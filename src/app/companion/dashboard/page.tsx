'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useAuth } from '@/context/auth-context';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Sparkles,
  IndianRupee,
  Calendar,
  ArrowRight,
  KeyRound,
  MessageCircle,
  Settings,
  Wallet,
  Star,
  Users,
  Edit3,
  Loader2,
  Check,
  X,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { triggerCelebration } from '@/components/ui/celebration';

interface HostProfileData {
  id: string;
  userId: string;
  displayName: string;
  age: number | null;
  gender: string | null;
  avatarUrl: string | null;
  city: string;
  locality: string;
  travelRadiusKm: number;
  bio: string;
  hourlyRate: number;
  spokenLanguages: string[];
  acceptedActivities: string[];
  availabilitySlots: string[];
  preferredVenues: string[];
  hostPackTier: string | null;
  hostPackExpiresAt: string | null;
  completedMeetups: number;
  ratingAverage: number;
  totalReviews: number;
  isAvailable: boolean;
  upiId: string | null;
  walletBalance: number;
}

interface HostBookingItem {
  id: string;
  bookingNumber: string;
  memberName: string;
  activityTitle: string;
  scheduledDate?: string;
  date: string;
  startTime: string;
  durationHours: number;
  venueName: string;
  venueAddress: string | null;
  totalAmount: number;
  companionFee: number;
  status: string;
  escrowStatus: string;
  hostScore?: number | null;
  hostComment?: string | null;
  memberReviewScore?: number | null;
  memberReviewComment?: string | null;
  createdAt: string;
}

interface PayoutItem {
  id: string;
  type: string;
  amount: number;
  utr: string;
  recipientUpiId?: string;
  failureReason?: string | null;
  status: string;
  gateway: string;
  dispatchedAt: string;
}

const AVAILABILITY_OPTIONS = [
  'Weekdays (Mon-Fri)',
  'Weekends (Sat-Sun)',
  'Evenings (5-9 PM)',
  'Flexible / On Request',
];

const VENUE_OPTIONS = [
  'Artisan Coffee Shops',
  'Open Promenades & Parks',
  'Malls & Shopping Centers',
  'Cultural Spaces & Museums',
];

export default function CompanionDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, isLoading: isLoadingAuth, refreshSession, activeRole, switchRole } =
    useAuth();

  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);
  const [profile, setProfile] = useState<HostProfileData | null>(null);
  const [bookings, setBookings] = useState<HostBookingItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [upiVerified, setUpiVerified] = useState(false);
  const [razorpayXConfigured, setRazorpayXConfigured] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const [isAvailable, setIsAvailable] = useState(true);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [respondingBookingId, setRespondingBookingId] = useState<string | null>(null);

  // Payout Modal State
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutUpi, setPayoutUpi] = useState('');
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  // Profile Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocality, setEditLocality] = useState('');
  const [editHourlyRate, setEditHourlyRate] = useState('');
  const [editUpiId, setEditUpiId] = useState('');
  const [editLanguages, setEditLanguages] = useState('');
  const [editAvailabilitySlots, setEditAvailabilitySlots] = useState<string[]>([]);
  const [editPreferredVenues, setEditPreferredVenues] = useState<string[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Host -> Member Feedback Modal State
  const [feedbackBooking, setFeedbackBooking] = useState<HostBookingItem | null>(null);
  const [feedbackScore, setFeedbackScore] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, bookingsRes, payoutsRes] = await Promise.all([
        fetch('/api/companion/profile', { cache: 'no-store' }),
        fetch('/api/companion/bookings', { cache: 'no-store' }),
        fetch('/api/wallet/payouts', { cache: 'no-store' }),
      ]);

      if (profileRes.status === 401) {
        router.replace('/login?next=/companion/dashboard');
        return;
      }

      const profileData = await profileRes.json();
      if (!profileData.hasProfile || !profileData.profile) {
        setHasProfile(false);
        setLoading(false);
        return;
      }

      setHasProfile(true);
      const p: HostProfileData = profileData.profile;
      setProfile(p);
      setIsAvailable(p.isAvailable);
      setWalletBalance(p.walletBalance ?? 0);
      setPayoutUpi(p.upiId || '');

      // Seed settings editor
      setEditDisplayName(p.displayName || '');
      setEditBio(p.bio || '');
      setEditLocality(p.locality || '');
      setEditHourlyRate(String(p.hourlyRate || 499));
      setEditUpiId(p.upiId || '');
      setEditLanguages((p.spokenLanguages || []).join(', '));
      setEditAvailabilitySlots(p.availabilitySlots || []);
      setEditPreferredVenues(p.preferredVenues || []);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(Array.isArray(bookingsData.bookings) ? bookingsData.bookings : []);
      }

      if (payoutsRes.ok) {
        const payoutsData = await payoutsRes.json();
        setPayouts(Array.isArray(payoutsData.payouts) ? payoutsData.payouts : []);
        setUpiVerified(Boolean(payoutsData.upiVerified));
        setRazorpayXConfigured(Boolean(payoutsData.razorpayXConfigured));
        if (typeof payoutsData.walletBalance === 'number') {
          setWalletBalance(payoutsData.walletBalance);
        }
        if (payoutsData.upiId && !p.upiId) {
          setPayoutUpi(payoutsData.upiId);
          setEditUpiId(payoutsData.upiId);
        }
      }

      if (activeRole !== 'host') {
        await switchRole('host');
      }
    } catch {
      toast.error('Failed to load Host Studio data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [activeRole, router, switchRole, toast]);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.replace('/login?next=/companion/dashboard');
      return;
    }
    if (!isLoadingAuth && isAuthenticated) {
      loadDashboard();
      const poll = setInterval(() => {
        fetch('/api/companion/bookings', { cache: 'no-store' })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.success && Array.isArray(data.bookings)) {
              setBookings(data.bookings);
            }
          })
          .catch(() => {});
      }, 15000);
      return () => clearInterval(poll);
    }
  }, [isLoadingAuth, isAuthenticated, loadDashboard, router]);

  const handleToggleAvailability = async () => {
    if (togglingAvailability) return;
    const nextState = !isAvailable;
    setTogglingAvailability(true);
    setIsAvailable(nextState);
    try {
      const res = await fetch('/api/companion/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFreeToday: nextState }),
      });
      if (!res.ok) throw new Error('Failed to update availability');
      toast.success(nextState ? 'You are now listed as Available for bookings.' : 'Status set to Busy / Offline.');
    } catch {
      setIsAvailable(!nextState);
      toast.error('Could not update availability.');
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleRespondBooking = async (bookingId: string, action: 'accept' | 'decline') => {
    setRespondingBookingId(bookingId);
    try {
      const res = await fetch('/api/companion/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Could not update booking.');
        return;
      }
      toast.success(
        action === 'accept'
          ? 'Booking accepted! Chat & Session Room are now open.'
          : 'Booking declined. Member escrow has been marked for refund.'
      );
      await loadDashboard();
    } catch {
      toast.error('Network error while updating booking.');
    } finally {
      setRespondingBookingId(null);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = verifyCode.trim();
    if (!/^\d{4}$/.test(cleaned)) {
      toast.error('Please enter the exact 4-digit Member Start PIN.');
      return;
    }
    setIsVerifyingPin(true);
    try {
      const res = await fetch('/api/companion/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleaned }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'Invalid PIN or no confirmed meetup matched.');
        return;
      }
      toast.success(data.message || 'PIN verified! Opening live Session Room...');
      setVerifyCode('');
      if (data.bookingId) {
        router.push(`/session/${data.bookingId}`);
      } else {
        await loadDashboard();
      }
    } catch {
      toast.error('Verification request failed.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(payoutAmount);
    if (!Number.isFinite(amountNum) || amountNum < 100) {
      toast.error('Minimum withdrawal amount is INR 100.');
      return;
    }
    if (amountNum > walletBalance) {
      toast.error(`Insufficient balance. Available: INR ${walletBalance.toLocaleString('en-IN')}.`);
      return;
    }
    if (!payoutUpi.trim() || !payoutUpi.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. name@oksbi).');
      return;
    }

    setIsRequestingPayout(true);
    try {
      const res = await fetch('/api/wallet/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum, upiId: payoutUpi.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'Cashout failed.');
        return;
      }
      toast.success(data.message || 'UPI cashout initiated.');
      triggerCelebration(`INR ${amountNum} UPI Cashout Initiated!`);
      setWalletBalance(data.newWalletBalance ?? Math.max(0, walletBalance - amountNum));
      setPayoutAmount('');
      setShowPayoutModal(false);
      await Promise.all([loadDashboard(), refreshSession()]);
    } catch {
      toast.error('Network error while requesting payout.');
    } finally {
      setIsRequestingPayout(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Number(editHourlyRate);
    if (!Number.isFinite(rate) || rate < 399 || rate > 1299) {
      toast.error('Hourly rate must be between INR 399 and INR 1,299.');
      return;
    }
    if (editDisplayName.trim().length < 2) {
      toast.error('Display name must be at least 2 characters.');
      return;
    }
    if (editBio.trim().length < 20) {
      toast.error('Bio must be at least 20 characters.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/companion/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: editDisplayName.trim(),
          bio: editBio.trim(),
          locality: editLocality.trim(),
          hourlyRate: rate,
          upiId: editUpiId.trim() || null,
          spokenLanguages: editLanguages
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          availabilitySlots: editAvailabilitySlots,
          preferredVenues: editPreferredVenues,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'Could not update profile.');
        return;
      }
      toast.success('Host profile updated successfully.');
      setShowSettingsModal(false);
      await Promise.all([loadDashboard(), refreshSession()]);
    } catch {
      toast.error('Network error while saving profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const toggleSelection = (list: string[], value: string, setter: (v: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleSubmitMemberFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackBooking) return;
    if (feedbackComment.trim().length < 5) {
      toast.error('Please write short feedback about the member (at least 5 characters).');
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/session/${feedbackBooking.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: feedbackScore,
          rating: feedbackScore,
          comment: feedbackComment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'Could not save member feedback.');
        return;
      }
      toast.success('Member feedback saved.');
      setFeedbackBooking(null);
      setFeedbackComment('');
      await loadDashboard();
    } catch {
      toast.error('Network error while saving feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const pendingRequests = bookings.filter((b) => b.status.toUpperCase() === 'PENDING_ACCEPTANCE');
  const activeMeetups = bookings.filter(
    (b) => b.status.toUpperCase() === 'CONFIRMED' || b.status.toUpperCase() === 'IN_PROGRESS'
  );
  const pastMeetups = bookings.filter(
    (b) => b.status.toUpperCase() === 'COMPLETED' || b.status.toUpperCase() === 'CANCELLED'
  );
  const totalEarned = pastMeetups
    .filter((b) => b.status.toUpperCase() === 'COMPLETED')
    .reduce((sum, b) => sum + b.companionFee, 0);

  if (loading || isLoadingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-3xl border-brutal bg-white p-8 shadow-brutal text-center max-w-sm w-full">
            <Loader2 className="h-8 w-8 animate-spin text-ink mx-auto" />
            <p className="mt-4 font-display font-black text-ink">Loading Host Studio...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!hasProfile || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-3xl border-brutal bg-white p-8 shadow-brutal max-w-lg w-full text-center space-y-5">
            <div className="mx-auto h-14 w-14 rounded-2xl border-brutal bg-lime flex items-center justify-center shadow-brutal-sm">
              <Sparkles className="h-7 w-7 text-ink" />
            </div>
            <h1 className="font-display text-3xl font-black text-ink">Activate Your Host Studio</h1>
            <p className="text-xs sm:text-sm font-semibold text-ink/70 leading-relaxed">
              Your verified account does not have an active Host profile yet. Complete the 3-step Host onboarding
              (INR 99.50 + INR 13.50 due taxes = INR 113 total) to start earning a flat 70% payout on every meetup.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/become-a-companion/apply"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-brutal bg-lime px-6 py-3 font-display text-sm font-black text-ink shadow-brutal-sm hover:translate-y-[-2px] transition-all"
              >
                Complete Host Application
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border-brutal bg-cream px-5 py-3 font-display text-sm font-black text-ink hover:bg-white transition-all"
              >
                Go to Member Dashboard
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 space-y-8">
        {/* Top Studio Banner */}
        <section className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-brutal bg-cream overflow-hidden shrink-0 shadow-brutal-sm">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-display text-2xl font-black text-ink bg-sunny">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border-brutal-thin bg-lime px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-ink">
                    Verified Host
                  </span>
                  {profile.hostPackTier && (
                    <span className="rounded-lg border-brutal-thin bg-sunny px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-ink">
                      {profile.hostPackTier} Pack (70% Payout)
                    </span>
                  )}
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-ink">
                  {profile.displayName}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-ink/65 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-ink" />
                    {profile.locality ? `${profile.locality}, ` : ''}
                    {profile.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5 text-ink" />
                    INR {profile.hourlyRate}/hr (You receive INR {Math.round(profile.hourlyRate * 0.7)}/hr)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleToggleAvailability}
                disabled={togglingAvailability}
                className={`inline-flex items-center gap-2 rounded-xl border-brutal px-4 py-2.5 font-display text-xs sm:text-sm font-black shadow-brutal-sm transition-all ${
                  isAvailable
                    ? 'bg-lime text-ink'
                    : 'bg-cream text-ink/70'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full border border-ink ${
                    isAvailable ? 'bg-emerald-600' : 'bg-ink/30'
                  }`}
                />
                {isAvailable ? 'Available Today' : 'Busy / Offline'}
              </button>

              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border-brutal bg-white px-4 py-2.5 font-display text-xs sm:text-sm font-black text-ink shadow-brutal-sm hover:bg-cream transition-all"
              >
                <Settings className="h-4 w-4" />
                Edit Profile & Rate
              </button>

              <Link
                href={`/companion/${profile.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-ink px-4 py-2.5 font-display text-xs sm:text-sm font-black text-white shadow-brutal-sm hover:bg-ink/90 transition-all"
              >
                Public Card
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Privacy & 70/30 Guarantee Bar */}
          <div className="mt-6 rounded-2xl border-brutal-thin bg-cream/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs font-semibold text-ink/80">
                <span className="font-black text-ink">Zero Aadhaar Storage & Fixed 70/30 Split:</span> Your phone number stays private. Every meetup holds funds safely in escrow and releases 70% directly to your Host Wallet upon 4-digit PIN verification.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border-brutal bg-white p-5 shadow-brutal-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-ink/60">
              <span>Wallet Balance</span>
              <Wallet className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <p className="font-display text-2xl sm:text-3xl font-black text-ink">
                INR {walletBalance.toLocaleString('en-IN')}
              </p>
              <button
                type="button"
                onClick={() => setShowPayoutModal(true)}
                className="rounded-lg border-brutal-thin bg-lime px-3 py-1 text-xs font-black text-ink hover:bg-lime/80 transition-colors"
              >
                Cash Out UPI
              </button>
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-ink/60">
              Total Earned: INR {totalEarned.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="rounded-2xl border-brutal bg-white p-5 shadow-brutal-sm">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-ink/60">
              <span>Completed Meetups</span>
              <Users className="h-4 w-4 text-ink" />
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-black text-ink">
              {profile.completedMeetups}
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-ink/60">
              {activeMeetups.length} active upcoming
            </p>
          </div>

          <div className="rounded-2xl border-brutal bg-white p-5 shadow-brutal-sm">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-ink/60">
              <span>Host Rating</span>
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-black text-ink">
              {profile.totalReviews > 0 ? `${profile.ratingAverage.toFixed(1)} / 5.0` : 'New Host'}
            </p>
            <p className="mt-1.5 text-[11px] font-semibold text-ink/60">
              {profile.totalReviews} verified {profile.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <div className="rounded-2xl border-brutal bg-sunny p-5 shadow-brutal-sm">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-ink">
              <span>Pending Requests</span>
              <Clock className="h-4 w-4 text-ink" />
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-black text-ink">
              {pendingRequests.length}
            </p>
            <p className="mt-1.5 text-[11px] font-bold text-ink/75">
              Respond promptly to lock escrow bookings
            </p>
          </div>
        </section>

        {/* Main Workspace Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Requests & Active Meetups */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pending Booking Requests */}
            <div className="rounded-3xl border-brutal bg-white p-5 sm:p-6 shadow-brutal space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-black text-ink">
                  New Booking Requests ({pendingRequests.length})
                </h2>
                <span className="rounded-full border-brutal-thin bg-cream px-3 py-1 text-[11px] font-black text-ink">
                  Escrow Funded
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="rounded-2xl border-brutal-thin border-dashed bg-cream/60 p-6 text-center space-y-2">
                  <Calendar className="h-6 w-6 text-ink/40 mx-auto" />
                  <p className="text-sm font-bold text-ink/70">No pending requests right now.</p>
                  <p className="text-xs font-semibold text-ink/50">
                    Keep your availability toggle green and your bio updated so local members can book you.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-2xl border-brutal bg-cream p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-ink/55">
                            #{req.bookingNumber}
                          </span>
                          <h3 className="font-display text-lg font-black text-ink">
                            {req.activityTitle} with {req.memberName}
                          </h3>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="inline-block rounded-lg border-brutal-thin bg-lime px-2.5 py-1 text-xs font-black text-ink">
                            Your 70% Payout: INR {req.companionFee}
                          </span>
                          <span className="block text-[10px] font-bold text-ink/60">
                            Gross INR {req.totalAmount} · 30% Platform INR {Math.max(0, Math.round((req.totalAmount - req.companionFee) * 100) / 100)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-ink/75">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-ink" />
                          <span>
                            {new Date(req.scheduledDate || req.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              timeZone: 'Asia/Kolkata',
                            })}{' '}
                            at {req.startTime} ({req.durationHours}h)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-ink" />
                          <span className="truncate">{req.venueName}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-1">
                        <button
                          type="button"
                          disabled={respondingBookingId === req.id}
                          onClick={() => handleRespondBooking(req.id, 'accept')}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border-brutal bg-lime px-4 py-2 text-xs font-black text-ink shadow-brutal-sm hover:translate-y-[-1px] transition-all disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          Accept Meetup
                        </button>
                        <button
                          type="button"
                          disabled={respondingBookingId === req.id}
                          onClick={() => handleRespondBooking(req.id, 'decline')}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border-brutal bg-white px-4 py-2 text-xs font-black text-rose-700 hover:bg-rose-50 transition-all disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active / Confirmed Meetups */}
            <div className="rounded-3xl border-brutal bg-white p-5 sm:p-6 shadow-brutal space-y-4">
              <h2 className="font-display text-xl font-black text-ink">
                Confirmed & Live Meetups ({activeMeetups.length})
              </h2>

              {activeMeetups.length === 0 ? (
                <div className="rounded-2xl border-brutal-thin border-dashed bg-cream/60 p-6 text-center">
                  <p className="text-sm font-bold text-ink/70">No confirmed upcoming meetups yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeMeetups.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border-brutal bg-white p-4 sm:p-5 shadow-brutal-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-md border-brutal-thin bg-sunny px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-ink">
                            {item.status.toUpperCase() === 'IN_PROGRESS' ? 'Session Live' : 'Confirmed — Meet in Person'}
                          </span>
                          <h3 className="mt-1 font-display text-base sm:text-lg font-black text-ink">
                            {item.activityTitle} with {item.memberName}
                          </h3>
                        </div>
                        <span className="font-display text-sm font-black text-emerald-700">
                          +INR {item.companionFee}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-ink/75">
                        <span>
                          {new Date(item.scheduledDate || item.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            timeZone: 'Asia/Kolkata',
                          })}{' '}
                          · {item.startTime} ({item.durationHours}h)
                        </span>
                        <span>Public Venue: {item.venueName}</span>
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <Link
                          href={`/session/${item.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-ink px-4 py-2 text-xs font-black text-white shadow-brutal-sm hover:bg-ink/90 transition-all"
                        >
                          <KeyRound className="h-3.5 w-3.5 text-lime" />
                          Open Session & SOS Room
                        </Link>
                        <Link
                          href={`/chat/${item.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-cream px-4 py-2 text-xs font-black text-ink hover:bg-sunny transition-all"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Open Chat
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Cols: 4-Digit Start PIN & Payouts */}
          <div className="lg:col-span-5 space-y-6">
            {/* 4-Digit Handshake PIN Form */}
            <form
              onSubmit={handleVerifyPin}
              className="rounded-3xl border-brutal bg-sunny p-5 sm:p-6 shadow-brutal space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl border-brutal bg-white flex items-center justify-center shrink-0">
                  <KeyRound className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-black text-ink">In-Person 4-Digit Start PIN</h2>
                  <p className="text-xs font-bold text-ink/75">Ask the member for their secret PIN at the cafe</p>
                </div>
              </div>

              <p className="text-xs font-semibold text-ink/80 leading-relaxed">
                Entering the member&apos;s secret 4-digit PIN proves both of you arrived safely at the public venue,
                starts the countdown timer, and protects your 70% escrow payout.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Enter 4-digit PIN"
                  className="flex-1 rounded-xl border-brutal bg-white px-4 py-3 font-mono text-lg font-black tracking-[0.3em] text-center text-ink focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isVerifyingPin || verifyCode.length !== 4}
                  className="rounded-xl border-brutal bg-ink px-5 py-3 font-display text-xs sm:text-sm font-black text-white shadow-brutal-sm hover:bg-ink/90 disabled:opacity-50 transition-all"
                >
                  {isVerifyingPin ? 'Checking...' : 'Start Meetup'}
                </button>
              </div>
            </form>

            {/* UPI Cashouts & Transaction History */}
            <div className="rounded-3xl border-brutal bg-white p-5 sm:p-6 shadow-brutal space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-black text-ink">Wallet & UPI Payouts</h2>
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(true)}
                  className="inline-flex items-center gap-1 rounded-lg border-brutal-thin bg-lime px-3 py-1.5 text-xs font-black text-ink hover:bg-lime/80"
                >
                  Withdraw
                </button>
              </div>

              <div className="rounded-2xl border-brutal-thin bg-cream p-3.5 text-xs font-semibold text-ink/75 flex items-center justify-between gap-2">
                <div>
                  <span>Linked UPI ID:</span>
                  {upiVerified && (
                    <span className="ml-2 inline-block rounded border border-emerald-400 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                      Verified
                    </span>
                  )}
                </div>
                <span className="font-mono font-black text-ink">
                  {profile.upiId || 'Not configured yet'}
                </span>
              </div>

              {!profile.upiId && (
                <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-3 flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-amber-900">
                    Add your UPI ID to receive your 70% meetup payouts automatically.
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(true)}
                    className="shrink-0 rounded-lg border border-ink bg-sunny px-2.5 py-1 text-[11px] font-black text-ink hover:bg-lime cursor-pointer"
                  >
                    Add UPI
                  </button>
                </div>
              )}

              <p className="text-[11px] font-semibold text-ink/65">
                {razorpayXConfigured
                  ? 'RazorpayX Auto-Payout active: completed meetup earnings transfer directly to your UPI ID.'
                  : '70% of each completed meetup credits to your Host Wallet; request instant UPI payouts anytime.'}
              </p>

              {payouts.length === 0 ? (
                <p className="text-xs font-semibold text-ink/55 py-2">
                  No payout transactions recorded yet. Completed meetups credit your wallet automatically.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {payouts.map((tx) => {
                    const st = String(tx.status || 'SUCCESS').toUpperCase();
                    const badgeClass =
                      st === 'SUCCESS'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : st === 'PENDING'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-rose-50 text-rose-700 border-rose-300';
                    return (
                      <div
                        key={tx.id}
                        className="rounded-xl border-brutal-thin bg-cream/60 p-3 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs font-black text-ink">
                              {tx.type === 'HOST_PAYOUT' ? 'Meetup Payout (70%)' : 'UPI Cashout'}
                            </p>
                            <span className={`rounded border px-1.5 py-0.5 text-[9px] font-black uppercase ${badgeClass}`}>
                              {st}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-ink/60 truncate">
                            {new Date(tx.dispatchedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            • {tx.utr}
                            {tx.recipientUpiId && tx.type === 'WALLET_CASHOUT' ? ` • ${tx.recipientUpiId}` : ''}
                          </p>
                          {tx.failureReason && (
                            <p className="text-[10px] font-bold text-rose-700 mt-0.5">{tx.failureReason}</p>
                          )}
                        </div>
                        <span
                          className={`font-display text-sm font-black shrink-0 ${
                            tx.type === 'HOST_PAYOUT' ? 'text-emerald-700' : 'text-ink'
                          }`}
                        >
                          {tx.type === 'HOST_PAYOUT' ? '+' : '-'}INR {tx.amount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Completed Meetups Summary */}
            {pastMeetups.length > 0 && (
              <div className="rounded-3xl border-brutal bg-white p-5 sm:p-6 shadow-brutal space-y-3">
                <h2 className="font-display text-lg font-black text-ink">Recent Completed Meetups</h2>
                <div className="space-y-2.5">
                  {pastMeetups.slice(0, 6).map((item) => {
                    const isCompleted = item.status.toUpperCase() === 'COMPLETED';
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border-brutal-thin bg-cream/60 p-3 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-black text-ink">
                              {item.activityTitle} ({item.memberName})
                            </p>
                            <p className="font-semibold text-ink/60">
                              {item.status.toUpperCase()} · {item.durationHours}h
                            </p>
                          </div>
                          <span className="font-black text-emerald-700">
                            {isCompleted ? `INR ${item.companionFee}` : 'Refunded'}
                          </span>
                        </div>
                        {item.memberReviewScore && (
                          <p className="rounded-lg border border-ink/15 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-ink">
                            Member Review: {item.memberReviewScore}/5
                            {item.memberReviewComment ? ` — "${item.memberReviewComment}"` : ''}
                          </p>
                        )}
                        {isCompleted && (
                          <div className="flex items-center justify-between gap-2">
                            {item.hostScore ? (
                              <span className="text-[11px] font-bold text-emerald-700">
                                Your Feedback: {item.hostScore}/5 stars
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-ink/60">
                                Share member feedback
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackBooking(item);
                                setFeedbackScore(item.hostScore || 5);
                                setFeedbackComment(item.hostComment || '');
                              }}
                              className="rounded-lg border-brutal-thin bg-sunny px-2.5 py-1 text-[11px] font-black text-ink hover:bg-lime transition cursor-pointer"
                            >
                              {item.hostScore ? 'Edit Feedback' : 'Rate Member'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* UPI Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleRequestPayout}
            className="w-full max-w-md rounded-3xl border-brutal bg-white p-6 shadow-brutal space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-black text-ink">Withdraw Earnings via UPI</h3>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="rounded-lg border-brutal-thin p-1.5 hover:bg-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border-brutal-thin bg-lime/30 p-3.5 flex items-center justify-between">
              <span className="text-xs font-bold text-ink/80">Withdrawable Balance</span>
              <span className="font-display text-lg font-black text-ink">
                INR {walletBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1.5">
                Withdrawal Amount (INR)
              </label>
              <input
                type="number"
                min={100}
                max={walletBalance}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Minimum 100"
                className="w-full rounded-xl border-brutal bg-cream px-3.5 py-2.5 text-sm font-bold text-ink focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1.5">
                Destination UPI ID
              </label>
              <input
                type="text"
                value={payoutUpi}
                onChange={(e) => setPayoutUpi(e.target.value)}
                placeholder="yourname@oksbi"
                className="w-full rounded-xl border-brutal bg-cream px-3.5 py-2.5 text-sm font-bold text-ink focus:outline-none"
                required
              />
            </div>

            <div className="flex items-start gap-2 rounded-xl border-brutal-thin bg-cream p-3 text-[11px] font-semibold text-ink/70">
              <AlertCircle className="h-4 w-4 text-ink shrink-0 mt-0.5" />
              <span>Funds are transferred to your UPI handle within 24 business hours.</span>
            </div>

            <button
              type="submit"
              disabled={isRequestingPayout}
              className="w-full rounded-xl border-brutal bg-ink py-3 font-display text-sm font-black text-white shadow-brutal-sm hover:bg-ink/90 disabled:opacity-50"
            >
              {isRequestingPayout ? 'Processing Payout...' : 'Confirm UPI Withdrawal'}
            </button>
          </form>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-xl rounded-3xl border-brutal bg-white p-6 shadow-brutal space-y-4 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-black text-ink flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Edit Host Profile & Settings
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="rounded-lg border-brutal-thin p-1.5 hover:bg-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full rounded-xl border-brutal bg-cream px-3 py-2 text-sm font-bold text-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1">
                  Hourly Rate (INR)
                </label>
                <input
                  type="number"
                  min={399}
                  max={1299}
                  value={editHourlyRate}
                  onChange={(e) => setEditHourlyRate(e.target.value)}
                  className="w-full rounded-xl border-brutal bg-cream px-3 py-2 text-sm font-bold text-ink"
                  required
                />
                <p className="mt-1 text-[11px] font-bold text-emerald-700">
                  Your 70% share: INR {Math.round((Number(editHourlyRate) || 0) * 0.7)}/hr
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1">
                  Locality / Neighborhood
                </label>
                <input
                  type="text"
                  value={editLocality}
                  onChange={(e) => setEditLocality(e.target.value)}
                  className="w-full rounded-xl border-brutal bg-cream px-3 py-2 text-sm font-bold text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1">
                  Payout UPI ID
                </label>
                <input
                  type="text"
                  value={editUpiId}
                  onChange={(e) => setEditUpiId(e.target.value)}
                  placeholder="name@oksbi"
                  className="w-full rounded-xl border-brutal bg-cream px-3 py-2 text-sm font-bold text-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1">
                Spoken Languages (comma separated)
              </label>
              <input
                type="text"
                value={editLanguages}
                onChange={(e) => setEditLanguages(e.target.value)}
                className="w-full rounded-xl border-brutal bg-cream px-3 py-2 text-sm font-bold text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1">
                Public Bio
              </label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full rounded-xl border-brutal bg-cream px-3 py-2 text-sm font-bold text-ink"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1.5">
                Weekly Availability
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABILITY_OPTIONS.map((slot) => {
                  const active = editAvailabilitySlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        toggleSelection(editAvailabilitySlots, slot, setEditAvailabilitySlots)
                      }
                      className={`rounded-xl border-brutal-thin px-3 py-2 text-left text-xs font-bold flex items-center justify-between ${
                        active ? 'bg-lime text-ink' : 'bg-cream text-ink/75'
                      }`}
                    >
                      <span>{slot}</span>
                      {active && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-ink/70 mb-1.5">
                Preferred Public Venues
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VENUE_OPTIONS.map((venue) => {
                  const active = editPreferredVenues.includes(venue);
                  return (
                    <button
                      key={venue}
                      type="button"
                      onClick={() =>
                        toggleSelection(editPreferredVenues, venue, setEditPreferredVenues)
                      }
                      className={`rounded-xl border-brutal-thin px-3 py-2 text-left text-xs font-bold flex items-center justify-between ${
                        active ? 'bg-sunny text-ink' : 'bg-cream text-ink/75'
                      }`}
                    >
                      <span>{venue}</span>
                      {active && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="rounded-xl border-brutal bg-cream px-4 py-2.5 font-display text-xs font-black text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="rounded-xl border-brutal bg-lime px-5 py-2.5 font-display text-xs font-black text-ink shadow-brutal-sm"
              >
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Host -> Member Feedback Modal */}
      {feedbackBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSubmitMemberFeedback}
            className="w-full max-w-md rounded-3xl border-brutal bg-white p-6 shadow-brutal space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-black text-ink">
                Rate Meetup with {feedbackBooking.memberName}
              </h3>
              <button
                type="button"
                onClick={() => setFeedbackBooking(null)}
                className="rounded-lg border-brutal-thin p-1.5 hover:bg-cream cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-ink/70">
              {feedbackBooking.activityTitle} · {feedbackBooking.venueName}
            </p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackScore(star)}
                  className={`p-2 rounded-xl border-brutal-thin cursor-pointer ${
                    feedbackScore >= star ? 'bg-sunny' : 'bg-cream'
                  }`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      feedbackScore >= star ? 'fill-ink text-ink' : 'text-ink/40'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              required
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Was the member punctual, respectful, and strictly platonic?"
              className="w-full rounded-xl border-brutal bg-cream p-3 text-xs font-bold text-ink focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFeedbackBooking(null)}
                className="w-1/2 rounded-xl border-brutal bg-white py-2.5 text-xs font-black text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-1/2 rounded-xl border-brutal bg-ink py-2.5 text-xs font-black text-white shadow-brutal-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingFeedback ? 'Saving...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
