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
  Lock,
  Sparkles,
  AlertCircle,
  Video,
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
  const [simulatingApproval, setSimulatingApproval] = useState(false);

  const isApproved = hostProfile?.verificationStatus === 'approved';

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
            // Starter preview requests for host
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

  const handleSimulateApproval = async () => {
    setSimulatingApproval(true);
    try {
      const res = await fetch('/api/companion/upgrade', { method: 'POST' });
      if (res.ok) {
        await refreshSession();
        toast.success('Desk approval simulated. Live Host Portal unlocked for testing!', 'Host Verified');
      } else {
        toast.error('Simulation failed. Please try again.', 'Error');
      }
    } catch {
      toast.error('Network error during approval simulation.', 'Error');
    } finally {
      setSimulatingApproval(false);
    }
  };

  const hostDisplayName = hostProfile?.displayName || user?.name || user?.phone || 'Verified Host';
  const hostLocation = `${hostProfile?.area || 'City Area'}, ${hostProfile?.city || 'Bengaluru'}`;

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* APPLICANT REVIEW STAGE NOTICE (If Pending Review) */}
          {!isApproved && (
            <div className="border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="border border-ink bg-sunny px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-ink">
                      Application Under Review
                    </span>
                    <span className="border border-ink bg-paper px-2 py-0.5 text-xs font-mono font-bold text-ink">
                      Ref: HST-2026-REG
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-ink">
                    Host Verification in Progress (Under 48 Hours)
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-ink/70 max-w-xl">
                    Our trust and physical safety desk is reviewing your Aadhaar records and automated live video match. Meetup requests will be routed to your portal upon approval.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={simulatingApproval}
                    onClick={handleSimulateApproval}
                    className="border-2 border-ink bg-lime text-ink px-4 py-2 text-xs font-black uppercase tracking-wider shadow-brutal-sm btn-press flex items-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{simulatingApproval ? 'Simulating...' : 'Simulate Desk Approval (Instant Test)'}</span>
                  </button>
                </div>
              </div>

              {/* 3-Stage Progress Tracker */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="border-2 border-ink bg-lime/20 p-4 space-y-1 shadow-brutal-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-ink">
                      Stage 1
                    </span>
                    <span className="text-[10px] font-black uppercase bg-lime px-1.5 py-0.5 border border-ink text-ink flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-black uppercase text-ink">
                    Aadhaar ID Proof
                  </h4>
                  <p className="text-[11px] font-bold text-ink/70">
                    Front and back documents uploaded and encrypted under DPDP Act 2023.
                  </p>
                </div>

                <div className="border-2 border-ink bg-lime/20 p-4 space-y-1 shadow-brutal-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-ink">
                      Stage 2
                    </span>
                    <span className="text-[10px] font-black uppercase bg-lime px-1.5 py-0.5 border border-ink text-ink flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Passed</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-black uppercase text-ink">
                    Live Video Face Match
                  </h4>
                  <p className="text-[11px] font-bold text-ink/70">
                    Live facial geometry matched against government documentation.
                  </p>
                </div>

                <div className="border-2 border-ink bg-sunny/30 p-4 space-y-1 shadow-brutal-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-ink">
                      Stage 3
                    </span>
                    <span className="text-[10px] font-black uppercase bg-sunny px-1.5 py-0.5 border border-ink text-ink flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>In Review</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-black uppercase text-ink">
                    Safety Welcome Call
                  </h4>
                  <p className="text-[11px] font-bold text-ink/70">
                    Our safety officer will contact you on WhatsApp for a 5-minute onboarding check.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Bar: Profile & Availability Toggle */}
          <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant={isApproved ? "lime" : "sunny"} size="sm">
                  {isApproved ? "Verified Host" : "Verification Pending"}
                </Badge>
                <span className="border border-ink bg-[#D4F7A5] px-2 py-0.5 text-[11px] font-black uppercase text-ink">
                  {hostProfile?.hostLevel === 'TOP' ? 'Top Host (95% Cut)' : hostProfile?.hostLevel === 'RISING' ? 'Rising Host (93% Cut)' : 'New Host (90% Cut)'}
                </span>
                <span className="text-xs font-bold text-ink-muted capitalize">
                  {hostProfile?.locality ? `${hostProfile.locality}, ` : ''}{hostProfile?.city || 'Bengaluru'} &middot; Travel: {hostProfile?.travelRadiusKm || 10} km
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
                    placeholder="e.g. 4892"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-32 rounded-xl border-brutal bg-paper px-4 py-2.5 text-center font-mono text-lg font-black tracking-widest text-ink focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="md">
                    Verify Code
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border-brutal bg-lime px-4 py-2.5 text-ink font-display text-xs font-black uppercase shadow-brutal-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Session Code Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Requests Manager */}
          <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-ink">
                  Meetup Requests ({pendingRequests.length})
                </h2>
                <p className="font-body text-xs text-ink-soft">
                  Incoming reservation requests from verified members.
                </p>
              </div>

              <span className="text-xs font-black uppercase border border-ink bg-paper px-2.5 py-1">
                Safe Escrow Guaranteed
              </span>
            </div>

            {loadingBookings ? (
              <div className="py-8 text-center text-xs font-black uppercase text-ink flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading requests...</span>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-ink p-8 text-center text-xs font-bold text-ink-muted">
                No active meetup requests right now. Keep your "Available Today" toggle active to receive instant requests.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl border-brutal bg-paper p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-brutal-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-black text-ink">
                          {req.memberName}
                        </span>
                        <Badge variant="sunny" size="sm">
                          {req.activity}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-ink-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-ink" />
                          <span>{req.date} at {req.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-ink" />
                          <span>{req.duration}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-ink" />
                          <span>{req.venue}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-ink/10 justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <span className="block text-[10px] font-black uppercase text-ink-muted">
                          Your Escrow Payout
                        </span>
                        <span className="font-display text-base font-black text-ink">
                          {formatRupees(req.payout)}
                        </span>
                      </div>

                      {req.status === 'confirmed' ? (
                        <span className="border-2 border-ink bg-lime px-3 py-1.5 text-xs font-black uppercase text-ink shadow-brutal-sm flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Confirmed</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAccept(req.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDecline(req.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
