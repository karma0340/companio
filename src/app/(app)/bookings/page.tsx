'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  KeyRound,
  ShieldAlert,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lock,
  XCircle,
  Star,
  Loader2,
  Check,
} from 'lucide-react';
import { StatusPulse } from '@/components/ui/status-pulse';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatRupees } from '@/lib/utils';
import { fetchLiveBookings, BookingDisplayItem } from '@/app/actions/getBookings';
import { useAuth } from '@/context/auth-context';

export default function MemberBookingsPage() {
  const toast = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [showSosModal, setShowSosModal] = useState(false);
  const [cancelModalBooking, setCancelModalBooking] = useState<BookingDisplayItem | null>(null);
  const [reviewModalBooking, setReviewModalBooking] = useState<BookingDisplayItem | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [bookings, setBookings] = useState<BookingDisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const live = await fetchLiveBookings({
        memberId: user?.id,
        memberPhone: user?.phone,
      });
      setBookings(live);
    } catch (err) {
      console.error('Error fetching live bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadBookings();
    }
  }, [user, authLoading]);

  // Tab Filtering
  const activeBookings = bookings.filter(
    (b) =>
      b.rawStatus === 'confirmed' ||
      b.rawStatus === 'in_progress' ||
      b.rawStatus === 'pending_acceptance'
  );
  const completedBookings = bookings.filter((b) => b.rawStatus === 'completed');
  const cancelledBookings = bookings.filter((b) => b.rawStatus === 'cancelled');

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: cancelModalBooking.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Meetup cancelled and refunded successfully.', 'Meetup Cancelled');
        setBookings((prev) =>
          prev.map((b) =>
            b.id === cancelModalBooking.id
              ? { ...b, rawStatus: 'cancelled', status: 'Cancelled & Refunded', paymentStatus: 'refunded' }
              : b
          )
        );
        setCancelModalBooking(null);
        setActiveTab('cancelled');
      } else {
        toast.error(data.error || 'Failed to cancel meetup. Please try again.', 'Cancellation Error');
      }
    } catch {
      toast.error('Network error while cancelling meetup. Please try again.', 'Error');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking) return;
    if (reviewComment.trim().length < 5) {
      toast.error('Please write a short review (at least 5 characters).', 'Review Required');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companionId: reviewModalBooking.companionId,
          bookingId: reviewModalBooking.id,
          rating: reviewRating,
          activityName: reviewModalBooking.activity,
          comment: reviewComment.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Your review has been published on the companion profile!', 'Review Submitted');
        setBookings((prev) =>
          prev.map((b) =>
            b.id === reviewModalBooking.id ? { ...b, rawStatus: 'completed', status: 'Completed' } : b
          )
        );
        setReviewModalBooking(null);
        setReviewComment('');
      } else {
        toast.error(data.error || 'Failed to submit review.', 'Error');
      }
    } catch {
      toast.error('Network error submitting review. Please try again.', 'Error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <Badge variant="lime" size="sm">
              Member Portal · Protected Meetup
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-ink">
              My Meetups
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-soft">
              Track your upcoming bookings, view your secret 4-digit start codes, review completed meetups, or cancel anytime before the session.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-2 border-b-brutal pb-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`inline-flex items-center gap-2 rounded-xl border-brutal-sm px-4 py-2 font-display text-xs font-black transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-paper-deep'
              }`}
            >
              <StatusPulse size="xs" status="active" />
              <span>Active & Upcoming ({activeBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`inline-flex items-center gap-1.5 rounded-xl border-brutal-sm px-4 py-2 font-display text-xs font-black transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-paper-deep'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.25]" />
              <span>Completed ({completedBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`inline-flex items-center gap-1.5 rounded-xl border-brutal-sm px-4 py-2 font-display text-xs font-black transition-all cursor-pointer ${
                activeTab === 'cancelled'
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-paper-deep'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[2.25]" />
              <span>Refunded ({cancelledBookings.length})</span>
            </button>
          </div>

          {/* Active Tab */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="rounded-2xl border-brutal bg-white p-12 text-center font-display text-sm font-bold text-ink">
                  Loading your bookings...
                </div>
              ) : activeBookings.length === 0 ? (
                <div className="rounded-2xl border-brutal bg-white p-12 text-center space-y-3">
                  <p className="font-display text-base font-black text-ink">No active bookings right now.</p>
                  <p className="text-xs text-ink-muted">Explore verified companions in your city and book your next meetup.</p>
                  <div className="pt-2">
                    <Link href="/explore">
                      <Button variant="primary" size="md">
                        Explore Companions →
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                activeBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal-lg space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-brutal-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-brutal bg-paper-deep">
                          <Image
                            src={booking.companion.avatarUrl || '/avatars/female.svg'}
                            alt={booking.companion.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-black text-ink">
                            {booking.companion.name}
                          </h2>
                          <span className="text-xs font-bold text-ink-muted">
                            Activity: {booking.activity} · Ref #{booking.id}
                          </span>
                        </div>
                      </div>

                      <Badge variant={booking.rawStatus === 'in_progress' ? 'sunny' : 'lime'} size="md" className="inline-flex items-center gap-1.5">
                        <StatusPulse size="xs" status="active" />
                        <span>{booking.status}</span>
                      </Badge>
                    </div>

                    {/* Secret 4-Digit Start Code Box */}
                    <div className="rounded-2xl border-brutal bg-sunny p-6 text-center space-y-2 shadow-brutal">
                      <span className="text-xs font-black uppercase text-ink">
                        Give this 4-Digit Code to {booking.companion.name} in person:
                      </span>
                      <div className="font-mono text-5xl font-black tracking-widest text-ink select-all">
                        {booking.startCode}
                      </div>
                      <p className="text-[11px] font-bold text-ink-soft max-w-sm mx-auto">
                        Tell this code verbally when you meet at {booking.meetingPoint}. Once entered, the meetup officially begins and your payment remains safe.
                      </p>
                    </div>

                    {/* Logistics Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-extrabold text-ink">
                      <div className="rounded-xl border-brutal-sm bg-paper p-3.5 space-y-1">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-ink-muted">
                          <MapPin className="h-3 w-3 text-ink stroke-[2.25]" />
                          <span>Public Venue</span>
                        </span>
                        <span className="block">{booking.meetingPoint}</span>
                      </div>

                      <div className="rounded-xl border-brutal-sm bg-paper p-3.5 space-y-1">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-ink-muted">
                          <Clock className="h-3 w-3 text-ink stroke-[2.25]" />
                          <span>Date and Time</span>
                        </span>
                        <span className="block">
                          {booking.date} at {booking.time} ({booking.duration})
                        </span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-brutal-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
                        <Lock className="h-4 w-4 text-emerald-600" />
                        <span>Protected Payment: {formatRupees(booking.escrowAmount)}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                          href={`/session/${booking.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-sunny px-3.5 py-2 font-display text-xs font-black text-ink shadow-brutal-sm hover:bg-yellow-300 btn-press cursor-pointer"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span>Open Session Room</span>
                        </Link>

                        {booking.rawStatus === 'in_progress' ? (
                          <button
                            onClick={() => setReviewModalBooking(booking)}
                            className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-lime px-3.5 py-2 font-display text-xs font-black text-ink shadow-brutal-sm hover:bg-lime-400 btn-press cursor-pointer"
                          >
                            <Star className="h-3.5 w-3.5 fill-ink" />
                            <span>Complete & Review</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setCancelModalBooking(booking)}
                            className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-white px-3.5 py-2 font-display text-xs font-bold text-ink hover:bg-danger-soft hover:text-danger btn-press cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Cancel Meetup</span>
                          </button>
                        )}

                        <button
                          onClick={() => setShowSosModal(true)}
                          className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-danger px-4 py-2 font-display text-xs font-black text-white shadow-brutal-sm hover:bg-red-600 btn-press cursor-pointer"
                        >
                          <ShieldAlert className="h-4 w-4" />
                          <span>Emergency SOS</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Completed Tab */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedBookings.length === 0 ? (
                <div className="rounded-2xl border-brutal bg-white p-12 text-center text-xs text-ink-muted space-y-2">
                  <p className="font-display text-sm font-black text-ink">No completed meetups yet.</p>
                  <p>Completed sessions will appear here with verified badges and rating records.</p>
                </div>
              ) : (
                completedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border-brutal bg-white p-6 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-brutal bg-paper-deep">
                        <Image
                          src={b.companion.avatarUrl || '/avatars/female.svg'}
                          alt={b.companion.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-black text-ink">
                          {b.companion.name} · {b.activity}
                        </h3>
                        <p className="text-xs text-ink-muted">
                          {b.date} · {b.meetingPoint}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="lime" size="sm" className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 stroke-[2.25]" />
                        <span>Meetup Completed</span>
                      </Badge>
                      <button
                        onClick={() => setReviewModalBooking(b)}
                        className="inline-flex items-center gap-1 rounded-xl border-brutal bg-sunny px-3 py-1 font-display text-xs font-black text-ink shadow-brutal-sm btn-press cursor-pointer"
                      >
                        <Star className="h-3 w-3 fill-ink" />
                        <span>Leave Review</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Cancelled Tab */}
          {activeTab === 'cancelled' && (
            <div className="space-y-4">
              {cancelledBookings.length === 0 ? (
                <div className="rounded-2xl border-brutal bg-white p-12 text-center text-xs text-ink-muted">
                  No cancelled or refunded bookings.
                </div>
              ) : (
                cancelledBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border-brutal bg-white p-5 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-black text-ink">
                          {b.companion.name} · {b.activity}
                        </h3>
                        <Badge variant="dark" size="sm">
                          Refunded
                        </Badge>
                      </div>
                      <p className="text-xs text-ink-muted">
                        Ref #{b.id} · Scheduled for {b.date} at {b.time}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300">
                        100% Refunded ({formatRupees(b.escrowAmount)})
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Cancellation Confirmation Modal */}
          {cancelModalBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-md rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal-lg space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 text-ink font-display text-lg font-black">
                  <XCircle className="h-6 w-6 text-danger" />
                  <span>Cancel Meetup Booking?</span>
                </div>

                <p className="font-body text-xs sm:text-sm text-ink-soft leading-relaxed">
                  Are you sure you want to cancel your meetup with <strong>{cancelModalBooking.companion.name}</strong> on {cancelModalBooking.date}?
                </p>

                <div className="rounded-xl border-brutal-sm bg-lime-soft p-3 text-xs font-bold text-ink space-y-1">
                  <span className="flex items-center gap-1.5 font-display text-xs font-black">
                    <CheckCircle2 className="h-4 w-4 text-ink stroke-[2.25]" />
                    <span>100% Full Escrow Refund:</span>
                  </span>
                  <p className="font-mono text-sm font-black text-ink">
                    {formatRupees(cancelModalBooking.escrowAmount)} will be released back to you immediately.
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setCancelModalBooking(null)}
                    disabled={cancelling}
                    className="w-1/2 rounded-xl border-brutal bg-white p-3 font-display text-xs font-bold text-ink hover:bg-paper-deep btn-press"
                  >
                    Keep Booking
                  </button>

                  <button
                    onClick={handleCancelBooking}
                    disabled={cancelling}
                    className="w-1/2 rounded-xl border-brutal bg-danger p-3 font-display text-xs font-black text-white shadow-brutal btn-press flex items-center justify-center gap-1.5"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Yes, Cancel & Refund</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Review Submission Modal */}
          {reviewModalBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-md rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal-lg space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <Badge variant="sunny" size="sm">
                    Verified Feedback
                  </Badge>
                  <h3 className="font-display text-xl font-black text-ink">
                    Rate Your Meetup with {reviewModalBooking.companion.name}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Your honest review helps keep the Togethr community respectful and trustworthy.
                  </p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Star Rating Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase text-ink">
                      Your Rating (1 to 5 Stars)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          className={`p-2 rounded-xl border-brutal-sm cursor-pointer transition-all ${
                            reviewRating >= s ? 'bg-sunny' : 'bg-paper'
                          }`}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              reviewRating >= s ? 'fill-ink text-ink' : 'text-ink-muted'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase text-ink">
                      Your Review
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share how your meetup went (e.g. prompt arrival, fun conversation, great coffee spot)..."
                      className="w-full rounded-xl border-brutal bg-white p-3 font-body text-xs sm:text-sm text-ink focus:outline-none focus:shadow-brutal"
                      required
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewModalBooking(null)}
                      disabled={submittingReview}
                      className="w-1/2 rounded-xl border-brutal bg-white p-3 font-display text-xs font-bold text-ink hover:bg-paper-deep btn-press"
                    >
                      Cancel
                    </button>

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={submittingReview || reviewComment.trim().length < 5}
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review →'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SOS Modal Dialog */}
          {showSosModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-md rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal-lg space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 text-danger font-display text-lg font-black">
                  <ShieldAlert className="h-6 w-6" />
                  <span>Immediate Safety Escalation</span>
                </div>
                <p className="font-body text-xs sm:text-sm text-ink-soft leading-relaxed">
                  If you feel unsafe or in danger, please exit the venue immediately and call emergency services.
                </p>

                <div className="space-y-2 pt-2">
                  <a
                    href="tel:112"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-brutal bg-danger p-3.5 font-display text-sm font-black text-white shadow-brutal btn-press"
                  >
                    <span>Dial Police Emergency 112 →</span>
                  </a>

                  <a
                    href="mailto:safety@togethr.in?subject=URGENT%20SAFETY%20INCIDENT"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-brutal bg-sunny p-3 font-display text-xs font-black text-ink shadow-brutal-sm btn-press"
                  >
                    <span>Alert 24/7 Togethr Safety Desk</span>
                  </a>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setShowSosModal(false)}
                    className="text-xs font-extrabold text-ink-muted hover:underline"
                  >
                    Close & Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
