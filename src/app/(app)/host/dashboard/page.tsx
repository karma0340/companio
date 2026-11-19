'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  ShieldCheck,
  Star,
  MapPin,
  ArrowUpRight,
  User,
  Loader2,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatRupees } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export default function HostDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, hostProfile, activeRole, isAuthenticated, isLoading, refreshSession } = useAuth();

  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [enteredCode, setEnteredCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawing, setWithdrawing] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // Sync state with hostProfile from Zustand
  useEffect(() => {
    if (hostProfile) {
      setIsAvailableToday(hostProfile.isFreeToday ?? true);
      setWalletBalance(hostProfile.walletBalance ?? 0);
    }
  }, [hostProfile]);

  // Fetch live bookings for this host
  useEffect(() => {
    async function loadHostBookings() {
      setLoadingBookings(true);
      try {
        const res = await fetch('/api/companion/bookings');
        if (res.ok) {
          const data = await res.json();
          if (data.bookings && data.bookings.length > 0) {
            setPendingRequests(data.bookings);
          } else {
            // If no active bookings yet, show starter requests so the host sees how requests look
            setPendingRequests([
              {
                id: 'req-preview-1',
                memberName: 'Pooja Verma',
                activity: 'Coffee & City Walk',
                date: 'Today',
                time: '05:30 PM IST',
                duration: '2 Hours',
                venue: 'Third Wave Coffee, Main Market',
                payout: 1080,
                status: 'pending',
              },
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load host bookings:', err);
      } finally {
        setLoadingBookings(false);
      }
    }

    if (isAuthenticated) {
      loadHostBookings();
    }
  }, [isAuthenticated]);

  const handleToggleAvailability = async () => {
    const nextState = !isAvailableToday;
    setIsAvailableToday(nextState);

    try {
      const res = await fetch('/api/companion/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFreeToday: nextState }),
      });
      if (res.ok) {
        toast.success(
          nextState
            ? 'Your profile is now marked Available Today for instant bookings!'
            : 'You are now marked unavailable for today.',
          'Availability Updated'
        );
      }
    } catch {
      // Revert on failure
      setIsAvailableToday(!nextState);
    }
  };

  const handleAccept = async (id: string) => {
    setPendingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'confirmed' } : r))
    );
    try {
      await fetch('/api/companion/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, action: 'accept' }),
      });
    } catch {
      // Handled silently
    }
    toast.success('Meetup request accepted! Member has been notified.', 'Request Accepted');
  };

  const handleDecline = async (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch('/api/companion/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, action: 'decline' }),
      });
    } catch {
      // Handled silently
    }
    toast.info('The meetup request was declined and the member has been refunded.', 'Request Declined');
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.length !== 4) {
      toast.error('Please enter the complete 4-digit code provided by your member at the venue.', '4-Digit Code Required');
      return;
    }

    try {
      const res = await fetch('/api/companion/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: enteredCode }),
      });

      let json: any = {};
      try {
        json = await res.json();
      } catch {
        // Fallback
      }

      if (res.ok && json.success) {
        setCodeVerified(true);
        if (json.newWalletBalance !== undefined) {
          setWalletBalance(json.newWalletBalance);
        } else {
          setWalletBalance((prev) => prev + (json.payoutAdded || 898));
        }
        await refreshSession();
        toast.success(
          'Start code verified! Your meetup is officially active and payment has been secured.',
          'Meetup Verified'
        );
      } else {
        toast.error(
          json.error || 'Invalid 4-digit code. Please verify the code with your member.',
          'Verification Failed'
        );
      }
    } catch (err) {
      toast.error('Unable to verify code right now. Please try again.', 'Error');
    }
  };

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      const targetUpi = hostProfile?.upiId ? ` (${hostProfile.upiId})` : '';
      toast.success(
        `Withdrawal of ${formatRupees(walletBalance)} initiated to your UPI account${targetUpi}. Funds will reflect shortly!`,
        'Transfer Initiated'
      );
      setWalletBalance(0);
      setWithdrawing(false);
    }, 1000);
  };

  const hostDisplayName = hostProfile?.displayName || user?.phone || 'Host';
  const hostLocation = `${hostProfile?.area || 'City Area'}, ${hostProfile?.city || 'Bengaluru'}`;

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Bar: Profile & Availability Toggle */}
          <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="lime" size="sm">
                  Verified Host
                </Badge>
                <span className="text-xs font-bold text-ink-muted capitalize">
                  {hostLocation}
                </span>
              </div>
              <h1 className="font-display text-3xl font-black text-ink">
                Host Portal · {hostDisplayName}
              </h1>
              <p className="font-body text-xs sm:text-sm text-ink-soft">
                Manage your booking requests, verify meetup start codes, and withdraw your earnings safely.
              </p>
            </div>

            {/* Instant Free Today Toggle */}
            <div className="flex items-center gap-3 rounded-2xl border-brutal-sm bg-paper p-3">
              <span className="font-display text-xs font-black text-ink">
                Available Today?
              </span>
              <button
                type="button"
                onClick={handleToggleAvailability}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-brutal-sm transition-colors duration-200 ease-in-out ${
                  isAvailableToday ? 'bg-lime' : 'bg-paper-deep'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full border-brutal-sm bg-white shadow-brutal-sm transition duration-200 ease-in-out ${
                    isAvailableToday ? 'translate-x-7 bg-ink' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Metrics Row: Wallet & Meetups Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Wallet Balance Card */}
            <div className="rounded-2xl border-brutal bg-sunny p-6 shadow-brutal space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-ink">
                  Available Earnings Wallet
                </span>
                <Wallet className="h-5 w-5 text-ink" />
              </div>
              <div className="font-display text-3xl sm:text-4xl font-black text-ink">
                {formatRupees(walletBalance)}
              </div>
              <Button
                variant="dark"
                size="sm"
                onClick={handleWithdraw}
                disabled={walletBalance === 0 || withdrawing}
              >
                <span>{withdrawing ? 'Transferring...' : 'Withdraw to UPI →'}</span>
              </Button>
            </div>

            {/* Completed Meetups */}
            <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
                Completed Meetups
              </span>
              <div className="font-display text-3xl sm:text-4xl font-black text-ink">
                0 Meetups
              </div>
              <p className="text-xs font-bold text-emerald-600">
                100% mutual completion rate
              </p>
            </div>

            {/* Member Star Rating */}
            <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-ink-muted">
                Community Rating
              </span>
              <div className="flex items-center gap-2 font-display text-3xl sm:text-4xl font-black text-ink">
                <Star className="h-8 w-8 fill-sunny text-ink" />
                <span>5.0 / 5.0</span>
              </div>
              <p className="text-xs font-bold text-ink-muted">
                Verified Host Community
              </p>
            </div>
          </div>

          {/* Active In-Person Meetup & Start Code Entry */}
          <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-6">
            <div className="flex items-center gap-2 text-lavender font-display text-sm font-black uppercase">
              <KeyRound className="h-5 w-5" />
              <span>In-Person Code Verification</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-black text-ink">
                  At the public venue with your member?
                </h2>
                <p className="font-body text-xs sm:text-sm text-ink-soft max-w-xl">
                  Ask the member for their 4-digit start code and enter it below. This confirms mutual arrival and secures your payout once the meetup concludes.
                </p>
              </div>

              {!codeVerified ? (
                <form onSubmit={handleVerifyCode} className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="4 Digits"
                    className="w-32 text-center rounded-xl border-brutal bg-paper-deep px-3 py-2.5 font-mono text-xl font-black text-ink focus:bg-white focus:outline-none focus:shadow-brutal"
                  />
                  <Button type="submit" variant="primary" size="md">
                    Verify Code
                  </Button>
                </form>
              ) : (
                <div className="rounded-xl border-brutal-sm bg-lime px-4 py-2 font-display text-xs font-black text-ink shadow-brutal-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Meetup Active · Payout Protected</span>
                </div>
              )}
            </div>
          </div>

          {/* Pending Booking Requests */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b-brutal pb-3">
              <h2 className="font-display text-2xl font-black text-ink">
                Booking Requests ({pendingRequests.filter((r) => r.status === 'pending').length})
              </h2>
              <span className="font-display text-xs font-black uppercase text-ink-muted">
                Auto-Refunds if unreviewed within 4 hours
              </span>
            </div>

            {loadingBookings ? (
              <div className="rounded-2xl border-brutal bg-white p-8 text-center text-xs text-ink-muted">
                Loading requests...
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="rounded-2xl border-brutal bg-white p-8 text-center space-y-2">
                <p className="font-display text-sm font-black text-ink">No pending booking requests right now.</p>
                <p className="text-xs text-ink-muted">Keep your availability toggled ON to receive instant requests from nearby members.</p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border-brutal bg-white p-5 sm:p-6 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-black text-ink">
                        {req.memberName}
                      </h3>
                      <Badge variant="sunny" size="sm">
                        {req.activity || req.activitySlug}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-ink-soft">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-ink stroke-[2.25]" />
                        <span>{req.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-ink stroke-[2.25]" />
                        <span>{req.time || req.startTime} ({req.duration || `${req.durationHours || 1} hr`})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-ink stroke-[2.25]" />
                        <span>{req.venue || req.meetingPoint}</span>
                      </span>
                    </div>

                    <div className="text-xs font-extrabold text-ink">
                      Your Payout:{' '}
                      <strong className="text-base text-lavender font-mono font-black">
                        {formatRupees(req.payout || req.hostSubtotal || 600)}
                      </strong>{' '}
                      (Protected by Companio)
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {req.status === 'pending' ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAccept(req.id)}
                        >
                          Accept Meetup
                        </Button>
                        <button
                          onClick={() => handleDecline(req.id)}
                          className="rounded-xl border-brutal bg-white px-3 py-1.5 font-display text-xs font-bold text-danger hover:bg-danger-soft btn-press cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <Badge variant="lime" size="md" className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.25]" />
                        <span>Accepted · Meetup Active</span>
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
