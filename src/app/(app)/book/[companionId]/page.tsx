'use client';

import React, { useState, use, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  ShieldCheck,
  MapPin,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  KeyRound,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { COMPANIONS } from '@/lib/data/companions';
import { ACTIVITIES } from '@/lib/data/activities';
import { calculatePrice, formatRupees } from '@/lib/utils';
import { ActivityCategory } from '@/lib/types';
import { createBookingAction } from '@/app/actions/booking';
import { useAuth } from '@/context/auth-context';
import { openRazorpayCheckout } from '@/lib/payments/razorpay';

interface BookPageProps {
  params: { companionId: string; }
}

interface BookingFormData {
  memberName: string;
  memberPhone: string;
  meetingPoint: string;
  note: string;
  agreedToPlatonic: boolean;
}

function BookPageContent({ params }: BookPageProps) {
  const companionId = params.companionId;
  const searchParams = useSearchParams();
  const initialHours = parseInt(searchParams.get('hours') || '1', 10);
  const toast = useToast();
  const { user, memberProfile, isAuthenticated } = useAuth();

  const companion = COMPANIONS.find((c) => c.id === companionId);
  if (!companion) {
    notFound();
  }

  // Booking Form State
  const [selectedActivity, setSelectedActivity] = useState<ActivityCategory>(
    companion.activities[0] || 'coffee-chat'
  );
  const [date, setDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [time, setTime] = useState<string>('16:00');
  const [duration, setDuration] = useState<number>(
    initialHours >= 1 && initialHours <= 4 ? initialHours : 1
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [startCode, setStartCode] = useState<string>('');
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');
  const [phoneRaw, setPhoneRaw] = useState<string>('');

  const { register, handleSubmit, setValue, watch, reset } = useForm<BookingFormData>({
    defaultValues: {
      memberName: '',
      memberPhone: '',
      meetingPoint: '',
      note: '',
      agreedToPlatonic: false,
    },
  });

  // Pre-fill user data dynamically from Zustand authenticated session
  useEffect(() => {
    if (user || memberProfile) {
      const cleanPhone = user?.phone ? user.phone.replace(/\D/g, '').slice(-10) : '';
      const name =
        memberProfile?.fullName && memberProfile.fullName !== 'Companio Member'
          ? memberProfile.fullName
          : '';

      if (name) {
        setValue('memberName', name);
      }
      if (cleanPhone) {
        setPhoneRaw(cleanPhone);
        setValue('memberPhone', cleanPhone);
      }
    }
  }, [user, memberProfile, setValue]);

  const meetingPoint = watch('meetingPoint');
  const agreedToPlatonic = watch('agreedToPlatonic');

  const price = calculatePrice(companion.hourlyRate, duration);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneRaw(digitsOnly);
    setValue('memberPhone', digitsOnly);
  };

  const onBookingSubmit = async (data: BookingFormData) => {
    if (!data.memberName || data.memberName.trim().length < 2) {
      toast.error('Please enter your name so your companion knows who they are meeting.', 'Name Required');
      return;
    }

    if (phoneRaw.length !== 10) {
      toast.error(
        `Please enter a valid 10-digit Indian phone number. You entered ${phoneRaw.length} digit${phoneRaw.length === 1 ? '' : 's'}.`,
        '10-Digit Mobile Required'
      );
      return;
    }

    if (!data.meetingPoint || data.meetingPoint.trim().length < 3) {
      toast.error(
        'Please specify a public meeting location (e.g. coffee shop, mall gate, gym lobby).',
        'Public Venue Required'
      );
      return;
    }

    if (!data.agreedToPlatonic) {
      toast.error(
        'Please check the box confirming this meetup is 100% platonic to continue.',
        'Safety Confirmation Required'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Initiate order with server
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hourlyRate: companion.hourlyRate,
          durationHours: duration,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        toast.error(orderData.error || 'Failed to initiate secure checkout. Please try again.', 'Payment Error');
        setIsSubmitting(false);
        return;
      }

      // 2. Open Razorpay Standard Checkout Modal
      await openRazorpayCheckout({
        key: orderData.keyId,
        amount: orderData.amountPaise,
        currency: 'INR',
        name: 'Companio Safe Escrow',
        description: `${selectedActivity.replace(/-/g, ' ')} with ${companion.name}`,
        order_id: orderData.orderId,
        prefill: {
          name: data.memberName.trim(),
          contact: phoneRaw,
          email: user?.phone ? `${user.phone}@member.trycompanio.com` : undefined,
        },
        theme: {
          color: '#121212',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast.error('Payment checkout was dismissed. Your meetup was not reserved.', 'Payment Cancelled');
          },
        },
        handler: async (paymentResponse) => {
          try {
            // 3. Confirm booking and lock funds into database
            const res = await createBookingAction({
              companionId: companion.id,
              memberId: user?.id,
              memberName: data.memberName.trim(),
              memberPhone: `+91 ${phoneRaw}`,
              activitySlug: selectedActivity,
              date,
              startTime: `${time} IST`,
              durationHours: duration,
              meetingPoint: data.meetingPoint.trim(),
              note: data.note.trim() || undefined,
              hourlyRate: companion.hourlyRate,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id || orderData.orderId,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            if (res.success && res.startCode) {
              setStartCode(res.startCode);
              setConfirmedBookingId(res.bookingId ? `#TGR-${res.bookingId.slice(-6)}` : '#TGR-1029');
              setBookingSuccess(true);
              toast.success(
                `Payment verified (${paymentResponse.razorpay_payment_id}). Locked in Safe Escrow!`,
                'Booking Confirmed'
              );
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              toast.error(res.error || 'Failed to confirm booking record.', 'Booking Error');
            }
          } catch (err) {
            console.error(err);
            toast.error('Payment succeeded but failed to confirm booking record.', 'Sync Error');
          } finally {
            setIsSubmitting(false);
          }
        },
      });
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Unable to open payment modal. Please check your internet connection.', 'Connection Error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Link */}
      <div>
        <Link
          href={`/companions/${companion.id}`}
          className="inline-flex items-center gap-1.5 font-display text-xs font-black text-ink hover:text-lavender transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {companion.name}'s profile</span>
        </Link>
      </div>

      {bookingSuccess ? (
        /* =========================================================================
           SUCCESS SCREEN: PROTECTED MEETUP CONFIRMED & 4-DIGIT CODE
           ========================================================================= */
        <div className="rounded-3xl border-brutal bg-white p-6 sm:p-12 shadow-brutal-lg max-w-2xl mx-auto text-center space-y-7 animate-in fade-in duration-300">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-brutal bg-lime shadow-brutal text-ink">
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <Badge variant="lime" size="md">
              Booking Confirmed · 100% Protected Payment
            </Badge>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-ink">
              Meetup Confirmed with {companion.name}!
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-soft max-w-lg mx-auto leading-relaxed">
              Your payment ({formatRupees(price.totalPayable)}) is held safely by Companio and only transferred to {companion.name} after you meet and share the code.
            </p>
          </div>

          {/* The 4-Digit Start Code Box */}
          <div className="rounded-2xl border-brutal bg-sunny p-6 sm:p-8 shadow-brutal space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase text-ink">
              <KeyRound className="h-4 w-4" />
              <span>Your Secret Meetup Start Code</span>
            </div>
            <div className="font-mono text-5xl sm:text-6xl font-black tracking-widest text-ink select-all">
              {startCode}
            </div>
            <p className="text-xs font-bold text-ink-soft max-w-md mx-auto leading-relaxed">
              Tell this 4-digit code verbally to {companion.name} when you meet at {meetingPoint}. Once entered, your session begins.
            </p>
          </div>

          {/* Booking Summary Card */}
          <div className="rounded-2xl border-brutal-sm bg-paper p-5 text-left text-xs font-medium text-ink space-y-2.5">
            <div className="flex justify-between">
              <span className="font-bold text-ink-muted">Companion:</span>
              <span className="font-extrabold">{companion.name} ({companion.area})</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-ink-muted">Activity:</span>
              <span className="font-extrabold capitalize">{selectedActivity.replace(/-/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-ink-muted">Date & Time:</span>
              <span className="font-extrabold">{date} at {time} IST</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-ink-muted">Public Venue:</span>
              <span className="font-extrabold">{meetingPoint}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-ink-muted">Duration & Rate:</span>
              <span className="font-extrabold">{duration} Hour{duration > 1 ? 's' : ''} (₹{companion.hourlyRate}/hr)</span>
            </div>
            <div className="flex justify-between border-t border-ink/20 pt-2 font-display text-sm font-black text-ink">
              <span>Total Safe Deposit:</span>
              <span className="font-mono text-base">{formatRupees(price.totalPayable)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/bookings">
              <Button variant="primary" size="lg" fullWidth>
                View in My Bookings Portal →
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="lg" fullWidth>
                Browse More Companions
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* =========================================================================
           BOOKING FORM (2 COLUMNS)
           ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-6">
              <div>
                <Badge variant="sunny" size="sm">
                  Step-by-Step Booking
                </Badge>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-ink mt-1">
                  Book a Meetup with {companion.name}
                </h1>
                <p className="font-body text-xs sm:text-sm text-ink-soft">
                  Fill in your preferred public location and timing. Your money stays safe with Companio until you meet in person.
                </p>
              </div>

              <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-3">
                  <label className="block font-display text-sm font-black text-ink">
                    1. Your Contact Details (for Meetup Updates):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-display text-xs font-black uppercase text-ink">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        {...register('memberName', { required: true })}
                        placeholder="e.g. Nikhil"
                        className="w-full rounded-xl border-brutal bg-white px-3.5 py-3 font-display text-xs sm:text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block font-display text-xs font-black uppercase text-ink">
                          Mobile Number
                        </label>
                        <span className="font-mono text-[11px] text-ink-muted">
                          {phoneRaw.length} / 10 digits
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-xs font-black text-ink-muted">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={phoneRaw}
                          onChange={handlePhoneChange}
                          placeholder="9876543210"
                          className="w-full rounded-xl border-brutal bg-white pl-12 pr-3.5 py-3 font-mono text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Choose Activity */}
                <div className="space-y-3">
                  <label className="block font-display text-sm font-black text-ink">
                    2. Select What You're Doing:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {companion.activities.map((slug) => {
                      const act = ACTIVITIES.find((a) => a.slug === slug);
                      const isSelected = selectedActivity === slug;
                      return (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => setSelectedActivity(slug)}
                          className={`group inline-flex items-center gap-1.5 rounded-xl border-brutal-sm px-3.5 py-2 font-display text-xs font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-ink text-paper shadow-brutal-sm'
                              : 'bg-paper-deep text-ink hover:bg-sunny'
                          }`}
                        >
                          <ActivityIcon slug={slug} size="xs" animated />
                          <span>{act?.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Date & Time Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="block font-display text-xs font-black uppercase text-ink">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border-brutal bg-white px-3.5 py-2.5 font-display text-xs font-bold text-ink focus:outline-none focus:shadow-brutal"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5">
                    <label className="block font-display text-xs font-black uppercase text-ink">
                      Start Time (IST)
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border-brutal bg-white px-3.5 py-2.5 font-display text-xs font-bold text-ink focus:outline-none focus:shadow-brutal appearance-none cursor-pointer"
                    >
                      <option value="10:00">10:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                      <option value="19:30">07:30 PM</option>
                      <option value="20:30">08:30 PM</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="block font-display text-xs font-black uppercase text-ink">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                      className="w-full rounded-xl border-brutal bg-white px-3.5 py-2.5 font-display text-xs font-bold text-ink focus:outline-none focus:shadow-brutal appearance-none cursor-pointer"
                    >
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="3">3 Hours</option>
                      <option value="4">4 Hours</option>
                    </select>
                  </div>
                </div>

                {/* Step 4: Public Meeting Point */}
                <div className="space-y-1.5">
                  <label className="block font-display text-sm font-black text-ink">
                    3. Public Meeting Point:
                  </label>
                  <input
                    type="text"
                    {...register('meetingPoint', { required: true })}
                    placeholder="e.g. Third Wave Coffee (Indiranagar), Starbucks, or Mall Main Gate"
                    className="w-full rounded-xl border-brutal bg-white px-3.5 py-3 font-display text-xs sm:text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                  />
                  <span className="block text-[11px] text-ink-muted">
                    Public places only for safety: cafes, malls, gym branches, or metro gates.
                  </span>
                </div>

                {/* Step 5: Note for Companion */}
                <div className="space-y-1.5">
                  <label className="block font-display text-sm font-black text-ink">
                    4. Note for {companion.name} (Optional):
                  </label>
                  <textarea
                    {...register('note')}
                    rows={3}
                    placeholder="Any specific topics you'd like to chat about, workout goals, or movies you want to watch..."
                    className="w-full rounded-xl border-brutal bg-white p-3.5 font-body text-xs sm:text-sm font-medium text-ink placeholder:text-ink-muted/70 focus:outline-none focus:shadow-brutal"
                  />
                </div>

                {/* Step 6: Platonic Agreement Checkbox */}
                <div className="rounded-2xl border-brutal-sm bg-pink-soft/50 p-4 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register('agreedToPlatonic', { required: true })}
                      className="mt-1 h-5 w-5 rounded border-brutal text-ink accent-ink cursor-pointer"
                    />
                    <div className="text-xs font-bold text-ink leading-relaxed">
                      <span>
                        I confirm that this meetup is <strong>100% platonic and respectful</strong>, will occur strictly in a public place, and follows the Companio Community Guidelines.
                      </span>
                    </div>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4 animate-spin" />
                      <span>Connecting to Razorpay Secure Vault...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Pay & Lock in Safe Escrow ({formatRupees(price.totalPayable)}) →</span>
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Sticky Summary & Breakdown */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b-brutal-sm">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-brutal bg-paper-deep">
                  <Image
                    src={companion.avatarUrl}
                    alt={companion.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black text-ink">{companion.name}</h3>
                  <p className="text-xs font-bold text-ink-muted">{companion.area}</p>
                  <Badge variant="lime" size="sm" className="mt-0.5">
                    ID Verified
                  </Badge>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs font-medium text-ink-soft">
                <div className="flex justify-between">
                  <span>
                    Rate: {formatRupees(companion.hourlyRate)} × {duration} hr{duration > 1 ? 's' : ''}
                  </span>
                  <span className="font-bold text-ink font-mono">{formatRupees(price.hostSubtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Companio Protection & Platform Fee</span>
                  <span className="font-bold text-ink font-mono">{formatRupees(price.connectionFee)}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-bold text-ink font-mono">{formatRupees(price.gst)}</span>
                </div>

                <div className="border-t-brutal-sm pt-2.5 flex items-baseline justify-between font-display text-base font-black text-ink">
                  <span>Total Payable</span>
                  <span className="text-2xl font-black text-ink">{formatRupees(price.totalPayable)}</span>
                </div>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="rounded-xl border-brutal-sm bg-lime-soft p-3.5 space-y-1.5 text-xs text-ink">
                <div className="flex items-center gap-1.5 font-black font-display">
                  <Lock className="h-4 w-4 text-ink" />
                  <span>100% Money-Back Guarantee</span>
                </div>
                <p className="font-body text-[11px] text-ink-soft leading-relaxed">
                  Your payment is never given upfront. It is safely held by Companio and released only after your meetup takes place.
                </p>
              </div>

              {/* Cancellation Policy */}
              <div className="rounded-xl border-brutal-sm bg-paper p-3 text-[11px] font-medium text-ink-soft space-y-1">
                <div className="flex items-center gap-1 font-bold text-ink">
                  <RotateCcw className="h-3 w-3" />
                  <span>Free Cancellation</span>
                </div>
                <span>
                  100% full refund if cancelled up to 2 hours before the meetup time.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookPage({ params }: BookPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12">
        <Suspense fallback={<div className="p-12 text-center font-display font-bold">Loading booking form...</div>}>
          <BookPageContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
