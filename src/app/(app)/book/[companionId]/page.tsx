'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  MapPin,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Sun,
  Sunset,
  Sunrise,
  Check,
  X,
  Loader2,
  Coins,
  CreditCard,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { ACTIVITIES } from '@/lib/data/activities';
import { calculatePrice, formatRupees } from '@/lib/utils';
import { Companion, ActivityCategory } from '@/lib/types';
import { createBookingAction } from '@/app/actions/booking';
import { useAuth } from '@/context/auth-context';
import { openRazorpayCheckout } from '@/lib/payments/razorpay';
import { triggerCelebration } from '@/components/ui/celebration';

interface BookPageProps {
  params: { companionId: string };
}

// Quick venue recommendations mapped by city slug
const CITY_QUICK_VENUES: Record<string, string[]> = {
  chandigarh: [
    'Third Wave Coffee, Sector 35',
    'Sector 17 Plaza Fountain',
    'Blue Tokai Coffee, Sector 8',
    'Elante Mall Central Courtyard',
    'Sukhna Lake Waterfront Promenade',
  ],
  bengaluru: [
    'Third Wave Coffee, 12th Main Indiranagar',
    'Blue Tokai, 5th Block Koramangala',
    'Starbucks, Church Street',
    'UB City Piazza Promenade',
    'Cubbon Park Metro Cafe Plaza',
  ],
  mumbai: [
    'Third Wave Coffee, Khar West',
    'Blue Tokai, Bandra Pali Hill',
    'Subko Coffee, Bandra',
    'Marine Drive Promenade, Churchgate',
    'Phoenix Palladium Courtyard, Lower Parel',
  ],
  delhi: [
    'Blue Tokai, Khan Market',
    'Starbucks, Connaught Place Inner Circle',
    'Third Wave Coffee, GK2 M-Block',
    'Sunder Nursery Promenade',
    'Cyber Hub Courtyard, Gurgaon',
  ],
  default: [
    'Third Wave Coffee Roasters',
    'Blue Tokai Coffee Roasters',
    'City Centre Mall Open Promenade',
    'Main Market Artisan Cafe',
  ],
};

export default function BookPage({ params }: BookPageProps) {
  const companionId = params.companionId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { user, memberProfile, isAuthenticated, refreshSession } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [loadingCompanion, setLoadingCompanion] = useState<boolean>(true);

  // Step 1: Activity
  const [selectedActivity, setSelectedActivity] = useState<ActivityCategory>('coffee-chat');

  // Step 2: Date (7 upcoming dates)
  const availableDates = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const dayName = isToday
        ? 'Today'
        : isTomorrow
        ? 'Tomorrow'
        : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const iso = d.toISOString().split('T')[0];
      list.push({ label: dayName, dateStr, iso });
    }
    return list;
  }, []);
  const [selectedDateIso, setSelectedDateIso] = useState<string>(availableDates[0].iso);

  // Step 3: Time Slot & Duration
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [duration, setDuration] = useState<number>(1);

  // Step 4: Location
  const [meetingPlace, setMeetingPlace] = useState<string>('');

  // Step 5: User & Payment Details
  const [memberName, setMemberName] = useState<string>('');
  const [memberPhone, setMemberPhone] = useState<string>('');
  const [agreedPlatonic, setAgreedPlatonic] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'WALLET'>('RAZORPAY');

  // Booking states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');
  const [startCode, setStartCode] = useState<string>('');

  useEffect(() => {
    setLoadingCompanion(true);
    fetch(`/api/companions/${companionId}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.companion) {
          setCompanion(data.companion);
          if (data.companion.activities && data.companion.activities.length > 0) {
            setSelectedActivity(data.companion.activities[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to load companion details:', err))
      .finally(() => setLoadingCompanion(false));
  }, [companionId]);

  useEffect(() => {
    if (user || memberProfile) {
      if (memberProfile?.fullName && memberProfile.fullName !== 'Meetzy Club Member') {
        setMemberName(memberProfile.fullName);
      } else if (user?.name && user.name !== 'Member') {
        setMemberName(user.name);
      }
      if (user?.phone) {
        setMemberPhone(user.phone.replace(/\D/g, '').slice(-10));
      }
    }
  }, [user, memberProfile]);

  const activeCityKey = companion?.city?.toLowerCase() || 'default';
  const quickVenues = CITY_QUICK_VENUES[activeCityKey] || CITY_QUICK_VENUES.default;

  // Selected date object
  const activeDateObj = availableDates.find((d) => d.iso === selectedDateIso) || availableDates[0];

  // Time slot labels
  const timeSlotMap = {
    morning: { label: 'Morning', hours: '7–10 AM', icon: Sunrise },
    afternoon: { label: 'Afternoon', hours: '12–3 PM', icon: Sun },
    evening: { label: 'Evening', hours: '5–8 PM', icon: Sunset },
  };

  const selectedTimeLabel = `${timeSlotMap[selectedTimeSlot].label} (${timeSlotMap[selectedTimeSlot].hours})`;
  const price = calculatePrice(companion?.hourlyRate ?? 0, duration);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      if (!meetingPlace.trim() || meetingPlace.trim().length < 3) {
        toast.error('Please pick or type a public venue.', 'Venue Required');
        return;
      }
      setStep(5);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const handleFinalBookingAndPayment = async () => {
    if (!companion) return;
    if (!isAuthenticated) {
      toast.error('Please verify your mobile number via SMS OTP before booking.', 'Sign In Required');
      router.push(`/login?intent=member&next=${encodeURIComponent(`/book/${companionId}`)}`);
      return;
    }
    if (!memberName.trim() || memberName.trim().length < 2) {
      toast.error('Please provide your name so your companion knows who they are meeting.', 'Name Required');
      return;
    }
    const cleanPhone = memberPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit Indian phone number.', 'Phone Required');
      return;
    }
    if (!agreedPlatonic) {
      toast.error('You must agree to the strictly platonic public rules to proceed.', 'Agreement Required');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. If paying with Wallet Coins
      if (paymentMethod === 'WALLET') {
        const userCoins = user?.coinBalance ?? 0;
        if (userCoins < price.totalPayable) {
          toast.error(
            `Insufficient coins. You have ${userCoins} coins, but ₹${price.totalPayable} is required.`,
            'Insufficient Coins'
          );
          setIsSubmitting(false);
          return;
        }

        const res = await createBookingAction({
          companionId: companion.id,
          memberId: user?.id,
          memberName: memberName.trim(),
          memberPhone: `+91 ${cleanPhone}`,
          activitySlug: selectedActivity,
          date: selectedDateIso,
          startTime: selectedTimeLabel,
          durationHours: duration,
          meetingPoint: meetingPlace.trim(),
          hourlyRate: companion.hourlyRate,
          paymentMethod: 'WALLET',
        });

        if (res.success && res.startCode) {
          setStartCode(res.startCode);
          setConfirmedBookingId(res.bookingId || '');
          setBookingSuccess(true);
          triggerCelebration('Meetup Requested! Escrow Protected');
          toast.success(
            `₹${price.totalPayable} coins deducted from wallet! Meetup reserved in Safe Escrow.`,
            'Booking Confirmed'
          );
          if (refreshSession) await refreshSession();
        } else {
          toast.error(res.error || 'Failed to complete wallet booking.', 'Booking Error');
        }
        setIsSubmitting(false);
        return;
      }

      // 2. Paying via Razorpay
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companionId: companion.id,
          hourlyRate: companion.hourlyRate,
          durationHours: duration,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      const orderAmountPaise = Number(orderData.amount || orderData.amountPaise) || Math.round(price.totalPayable * 100);
      const rzpOrderId = String(orderData.orderId || '');

      await openRazorpayCheckout({
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_U1vu1rlfL1qiHG',
        amount: orderAmountPaise,
        currency: orderData.currency || 'INR',
        name: 'Meetzy Club',
        description: `${companion.name} · ${duration} Hour Meetup`,
        order_id: rzpOrderId,
        prefill: {
          name: memberName.trim(),
          contact: `+91${cleanPhone}`,
        },
        theme: {
          color: '#101828',
        },
        handler: async (response) => {
          try {
            const bookingRes = await createBookingAction({
              companionId: companion.id,
              memberId: user?.id,
              memberName: memberName.trim(),
              memberPhone: `+91 ${cleanPhone}`,
              activitySlug: selectedActivity,
              date: selectedDateIso,
              startTime: selectedTimeLabel,
              durationHours: duration,
              meetingPoint: meetingPlace.trim(),
              hourlyRate: companion.hourlyRate,
              paymentMethod: 'RAZORPAY',
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id || orderData.orderId,
              razorpaySignature: response.razorpay_signature,
            });

            if (bookingRes.success && bookingRes.startCode) {
              setStartCode(bookingRes.startCode);
              setConfirmedBookingId(bookingRes.bookingId || '');
              setBookingSuccess(true);
              triggerCelebration('Meetup Requested! Escrow Protected');
              toast.success(
                `Payment verified (${response.razorpay_payment_id}). Locked in Safe Escrow!`,
                'Booking Confirmed'
              );
              if (refreshSession) await refreshSession();
            } else {
              toast.error(bookingRes.error || 'Failed to store booking record.', 'Error');
            }
          } catch {
            toast.error('Error confirming meetup payment.', 'Error');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      });
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed.', 'Error');
      setIsSubmitting(false);
    }
  };

  if (loadingCompanion) {
    return (
      <div className="min-h-screen bg-paper flex flex-col justify-between text-ink">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-3xl border-3 border-ink bg-white p-8 shadow-brutal text-center space-y-3 max-w-sm w-full">
            <Loader2 className="h-8 w-8 animate-spin text-ink mx-auto" />
            <p className="font-display font-black text-ink">Loading host booking details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-paper flex flex-col justify-between text-ink">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-3xl border-3 border-ink bg-white p-8 shadow-brutal text-center space-y-4 max-w-md w-full">
            <h1 className="font-display text-2xl font-black text-ink">Host Profile Unavailable</h1>
            <p className="text-xs font-bold text-ink-soft">
              We could not find this host profile. Browse open verified hosts to continue.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-lime px-5 py-2.5 font-display text-xs font-black text-ink shadow-brutal-xs"
            >
              <span>Back to Explore</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // SUCCESS SCREEN
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-paper flex flex-col justify-between text-ink">
        <Navbar />
        <main className="flex-1 py-12 px-4 max-w-xl mx-auto w-full">
          <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal-lg space-y-6 text-center animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-lime shadow-brutal-sm">
              <CheckCircle2 className="h-8 w-8 text-ink" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl font-black text-ink">
                Meetup Requested!
              </h1>
              <p className="text-xs sm:text-sm font-bold text-ink-muted">
                Your payment is held in 100% safe escrow. {companion.name} has been notified to accept.
              </p>
            </div>

            {/* Meetup Start PIN */}
            <div className="rounded-2xl border-2 border-ink bg-sunny p-4 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-ink/70">
                Secret Meetup Start Code
              </span>
              <div className="font-mono text-3xl font-black tracking-widest text-ink">
                {startCode || '7492'}
              </div>
              <p className="text-[11px] font-bold text-ink-soft">
                Only share this 4-digit code in-person when you meet at the public venue.
              </p>
            </div>

            {/* Summary Details */}
            <div className="rounded-2xl border-2 border-ink bg-paper p-4 space-y-2 text-left text-xs font-bold text-ink-soft">
              <div className="flex justify-between">
                <span>Companion:</span>
                <span className="text-ink font-black">{companion.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date &amp; Time:</span>
                <span className="text-ink font-black">{activeDateObj.label}, {activeDateObj.dateStr} · {selectedTimeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Place:</span>
                <span className="text-ink font-black">{meetingPlace}</span>
              </div>
              <div className="flex justify-between border-t border-ink/20 pt-2 font-display text-sm">
                <span className="text-ink font-black">Escrow Total:</span>
                <span className="text-ink font-black">₹{price.totalPayable}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/bookings"
                className="w-full flex items-center justify-center rounded-xl border-2 border-ink bg-lime py-3 font-display text-xs font-black text-ink shadow-brutal-sm hover:bg-sunny transition"
              >
                <span>View in My Meetups</span>
              </Link>
              <Link
                href={`/chat`}
                className="w-full flex items-center justify-center rounded-xl border-2 border-ink bg-ink py-3 font-display text-xs font-black text-white shadow-brutal-sm hover:bg-black transition"
              >
                <span>Go to Messages</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFF] flex flex-col justify-between text-ink">
      {/* Top Persistent Header */}
      <header className="border-b-2 border-ink bg-white px-4 py-3 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={`/companions/${companion.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{companion.name}'s profile</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <Link href="/" className="font-display text-lg font-black tracking-tight text-ink">
            Meetzy<span className="text-pink-600">Club</span>
          </Link>

          <Link
            href="/explore"
            className="flex items-center gap-1 text-xs font-bold text-ink-muted hover:text-ink transition"
          >
            <span>Exit to explore</span>
            <X className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 max-w-2xl mx-auto w-full">
        {/* Companion Micro Subheader */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-ink">
              <Image
                src={companion.avatarUrl}
                alt={companion.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-display text-sm font-black text-ink">
              {companion.name} · ₹{companion.hourlyRate}/h
            </span>
          </div>

          {/* 5-Step Visual Progress Dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-ink border border-ink'
                    : s < step
                    ? 'w-2 bg-lime border border-ink'
                    : 'w-2 bg-paper-deep border border-ink/40'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
            Step {step} of 5 · {
              step === 1 ? 'Activity' :
              step === 2 ? 'Date' :
              step === 3 ? 'Time' :
              step === 4 ? 'Location' : 'Review'
            }
          </span>
        </div>

        {/* STEP 1: ACTIVITY */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
                What would you like to do?
              </h2>
              <p className="text-xs sm:text-sm font-bold text-ink-muted max-w-md mx-auto">
                Strictly platonic, always in public. Every meetup happens somewhere public, like a café, a promenade or an event. You pick the spot in two steps, and your companion confirms it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {ACTIVITIES.map((act) => {
                const isSelected = selectedActivity === act.slug;
                return (
                  <div
                    key={act.slug}
                    onClick={() => setSelectedActivity(act.slug)}
                    className={`p-4 rounded-2xl border-2 border-ink cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-ink text-white shadow-brutal'
                        : 'bg-white hover:bg-paper text-ink'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl border border-ink/20 bg-paper-deep text-ink">
                        <ActivityIcon slug={act.slug} size="sm" />
                      </div>
                      <div>
                        <span className="font-display text-sm font-black block">
                          {act.name}
                        </span>
                        <span
                          className={`text-[11px] font-medium line-clamp-1 ${
                            isSelected ? 'text-white/80' : 'text-ink-soft'
                          }`}
                        >
                          {act.description}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-lime border border-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-ink stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-3 border-ink bg-ink text-white py-3.5 font-display text-sm font-black shadow-brutal hover:bg-black transition btn-press cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
                When works for you?
              </h2>
              <p className="text-xs sm:text-sm font-bold text-ink-muted">
                Pick a day within the next week.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {availableDates.map((d) => {
                const isSelected = selectedDateIso === d.iso;
                return (
                  <div
                    key={d.iso}
                    onClick={() => setSelectedDateIso(d.iso)}
                    className={`p-4 rounded-2xl border-2 border-ink cursor-pointer transition-all text-center flex flex-col justify-between ${
                      isSelected
                        ? 'bg-ink text-white shadow-brutal'
                        : 'bg-white hover:bg-paper text-ink'
                    }`}
                  >
                    <span className="font-display text-xs font-black uppercase tracking-wider block">
                      {d.label}
                    </span>
                    <span className="font-display text-base font-black pt-1 block">
                      {d.dateStr}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="rounded-2xl border-2 border-ink bg-white px-5 py-3 font-display text-xs font-black text-ink hover:bg-paper transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-3 border-ink bg-ink text-white py-3 font-display text-sm font-black shadow-brutal hover:bg-black transition btn-press cursor-pointer"
              >
                <span>Choose {activeDateObj.label}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TIME & DURATION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
                What time suits you?
              </h2>
              <p className="text-xs sm:text-sm font-bold text-ink-muted">
                Times for {activeDateObj.label}, {activeDateObj.dateStr}
              </p>
            </div>

            {/* Time Slot Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {(['morning', 'afternoon', 'evening'] as const).map((slotKey) => {
                const isSelected = selectedTimeSlot === slotKey;
                const slot = timeSlotMap[slotKey];
                const SlotIcon = slot.icon;
                return (
                  <div
                    key={slotKey}
                    onClick={() => setSelectedTimeSlot(slotKey)}
                    className={`p-4 rounded-2xl border-2 border-ink cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                      isSelected
                        ? 'bg-ink text-white shadow-brutal'
                        : 'bg-white hover:bg-paper text-ink'
                    }`}
                  >
                    <SlotIcon className="h-5 w-5" />
                    <span className="font-display text-sm font-black block">
                      {slot.label}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white/80' : 'text-ink-soft'
                      }`}
                    >
                      {slot.hours}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Duration Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-black uppercase tracking-wider text-ink text-center">
                How long do you want to meet?
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((hrs) => {
                  const isSelected = duration === hrs;
                  return (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setDuration(hrs)}
                      className={`py-3 rounded-2xl border-2 border-ink font-display text-sm font-black cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-lime text-ink shadow-brutal border-ink'
                          : 'bg-white hover:bg-paper text-ink'
                      }`}
                    >
                      {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-xs font-extrabold text-ink-muted pt-1">
                {duration} hour{duration > 1 ? 's' : ''} · ₹{companion.hourlyRate * duration}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="rounded-2xl border-2 border-ink bg-white px-5 py-3 font-display text-xs font-black text-ink hover:bg-paper transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-3 border-ink bg-ink text-white py-3 font-display text-sm font-black shadow-brutal hover:bg-black transition btn-press cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
                Where would you like to meet?
              </h2>
              <p className="text-xs sm:text-sm font-bold text-ink-muted max-w-md mx-auto">
                Public places only, for everyone's comfort and safety.
              </p>
            </div>

            {/* Quick Picks */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-ink">
                Quick picks in {companion.city || 'your city'}
              </label>

              <div className="flex flex-wrap gap-2">
                {quickVenues.map((v) => {
                  const isSelected = meetingPlace === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMeetingPlace(v)}
                      className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-ink text-white shadow-brutal-xs'
                          : 'bg-white hover:bg-paper text-ink'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Public Place Input */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-black uppercase tracking-wider text-ink">
                Name a public place in {companion.city || 'your city'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                <input
                  type="text"
                  value={meetingPlace}
                  onChange={(e) => setMeetingPlace(e.target.value)}
                  placeholder="e.g., Third Wave Coffee, MG Road"
                  className="w-full rounded-xl border-2 border-ink bg-white pl-10 pr-4 py-3 font-display text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                />
              </div>
              <p className="text-[11px] font-bold text-ink-muted">
                Always choose a public venue. Your companion will review and confirm the location before accepting. Type or pick a meeting place to continue.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="rounded-2xl border-2 border-ink bg-white px-5 py-3 font-display text-xs font-black text-ink hover:bg-paper transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!meetingPlace.trim()}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-3 border-ink bg-ink text-white py-3 font-display text-sm font-black shadow-brutal hover:bg-black transition btn-press cursor-pointer disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & ESCROW PAYMENT */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1.5 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
                Review your meetup
              </h2>
              <p className="text-xs sm:text-sm font-bold text-ink-muted">
                Make sure everything looks right.
              </p>
            </div>

            {/* Meetup Summary Card */}
            <div className="rounded-3xl border-3 border-ink bg-white p-5 sm:p-6 shadow-brutal space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-ink/10 pb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-ink">
                  <Image
                    src={companion.avatarUrl}
                    alt={companion.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-base font-black text-ink">
                    {companion.name}
                  </h3>
                  <span className="text-xs font-extrabold text-ink-muted">
                    {companion.area}, {companion.city}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="block text-[11px] font-black uppercase text-ink-muted">Activity</span>
                  <span className="font-display font-black text-ink capitalize">
                    {selectedActivity.replace(/-/g, ' ')} · {duration} {duration === 1 ? 'hour' : 'hours'}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-black uppercase text-ink-muted">Date &amp; time</span>
                  <span className="font-display font-black text-ink">
                    {activeDateObj.label}, {activeDateObj.dateStr} · {selectedTimeLabel}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-black uppercase text-ink-muted">Place</span>
                  <span className="font-display font-black text-ink">
                    {meetingPlace}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-2xl border-2 border-ink bg-paper p-4 space-y-1 border-t-2">
                <div className="flex justify-between items-baseline font-display">
                  <div>
                    <span className="text-sm font-black text-ink block">Total today</span>
                    <span className="text-[11px] font-bold text-ink-muted">for {duration} {duration === 1 ? 'hour' : 'hours'} · Price includes GST</span>
                  </div>
                  <span className="text-xl font-black text-ink">₹{price.totalPayable}</span>
                </div>
              </div>
            </div>

            {/* Meetzy Club Escrow Protection Guarantee */}
            <div className="rounded-2xl border border-ink/30 bg-paper p-4 text-xs text-ink-soft space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 font-display font-black text-ink text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>Protected by Meetzy Club: your payment is held until you meet.</span>
              </div>
              <p>
                Declined, or withdrawn before it&apos;s accepted? The full amount is back in your Companio wallet at once. Not accepted within 12 hours (not counting 11 pm–8 am)? It&apos;s back within about an hour of that deadline. Use it for any meetup, or send it back to the card or UPI you paid with, minus a 12% processing fee. If your companion accepts and then doesn&apos;t turn up, tap &ldquo;No, it didn&apos;t happen&rdquo; on the meetup and our team checks it.
              </p>
              <p>
                Booked for {duration} {duration === 1 ? 'hour' : 'hours'}. If you both want longer on the day, you can ask {companion.name} for extra time.
              </p>
              <p>
                Need another time later? Ask from your dashboard; {companion.name} confirms it.
              </p>
              <p className="text-[11px] font-medium text-ink-muted pt-1 border-t border-ink/10">
                Payments are processed securely by Razorpay. Questions?{' '}
                <Link href="/contact" className="underline font-bold text-ink hover:text-ink-muted">
                  Contact The Companio Team
                </Link>
              </p>
            </div>

            {/* Member Details Input */}
            <div className="rounded-2xl border-2 border-ink bg-white p-4 space-y-3">
              <span className="text-xs font-black uppercase text-ink block">
                Your Details for Host Confirmation
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Your Name"
                  className="rounded-xl border-2 border-ink bg-paper px-3 py-2 font-display text-xs font-bold text-ink focus:outline-none focus:bg-white"
                />
                <input
                  type="tel"
                  maxLength={10}
                  readOnly={Boolean(isAuthenticated && user?.phone)}
                  value={memberPhone}
                  onChange={(e) => {
                    if (isAuthenticated && user?.phone) return;
                    setMemberPhone(e.target.value.replace(/\D/g, ''));
                  }}
                  placeholder="10-digit Phone (+91)"
                  className={`rounded-xl border-2 border-ink px-3 py-2 font-mono text-xs font-bold text-ink focus:outline-none ${
                    isAuthenticated && user?.phone
                      ? 'bg-paper-deep/60 cursor-not-allowed'
                      : 'bg-paper focus:bg-white'
                  }`}
                />
              </div>

              {/* Platonic Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="review-platonic"
                  type="checkbox"
                  checked={agreedPlatonic}
                  onChange={(e) => setAgreedPlatonic(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-2 border-ink text-ink focus:ring-0 cursor-pointer"
                />
                <label htmlFor="review-platonic" className="text-xs font-bold text-ink-soft cursor-pointer">
                  I agree to keep this meetup strictly platonic in a public place.
                </label>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-ink">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`p-3 rounded-2xl border-2 border-ink font-display text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition ${
                    paymentMethod === 'RAZORPAY'
                      ? 'bg-ink text-white shadow-brutal'
                      : 'bg-white text-ink hover:bg-paper'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Razorpay / UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-3 rounded-2xl border-2 border-ink font-display text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition ${
                    paymentMethod === 'WALLET'
                      ? 'bg-ink text-white shadow-brutal'
                      : 'bg-white text-ink hover:bg-paper'
                  }`}
                >
                  <Coins className="h-4 w-4 text-sunny" />
                  <span>Wallet ({user?.coinBalance ?? 0} Coins)</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrevStep}
                className="rounded-2xl border-2 border-ink bg-white px-5 py-3.5 font-display text-xs font-black text-ink hover:bg-paper transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalBookingAndPayment}
                disabled={isSubmitting || !agreedPlatonic}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-3 border-ink bg-lime text-ink py-3.5 font-display text-sm font-black shadow-brutal hover:bg-sunny transition btn-press cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-ink" />
                    <span>Processing Escrow...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-emerald-800" />
                    <span>Pay ₹{price.totalPayable} &amp; Request Meetup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
