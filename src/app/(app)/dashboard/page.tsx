'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Calendar,
  Sparkles,
  Edit3,
  LogOut,
  Save,
  ArrowRight,
  KeyRound,
  Coins,
  Wallet,
  Copy,
  Check,
  Clock,
  MessageSquare,
  Bookmark,
  Bell,
  HelpCircle,
  FileText,
  Download,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Lock,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import { CITIES } from '@/lib/data/cities';
import { AvatarVector, GenderType } from '@/components/ui/avatar-vector';
import { UnlockProfileModal } from '@/components/pass/unlock-profile-modal';
import { CoinTopupModal } from '@/components/chat/coin-topup-modal';
import { fetchLiveBookings, BookingDisplayItem } from '@/app/actions/getBookings';

type DashboardTab =
  | 'overview'
  | 'bookings'
  | 'messages'
  | 'saved'
  | 'notifications'
  | 'support'
  | 'account';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { user, memberProfile, hostProfile, isAuthenticated, isLoading, refreshSession, logout } =
    useAuth();

  const initialTab = (searchParams.get('tab') as DashboardTab) || 'overview';
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Sync tab with query param
  useEffect(() => {
    const tabParam = searchParams.get('tab') as DashboardTab;
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  };

  // Modals state
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isCoinTopupOpen, setIsCoinTopupOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('chandigarh');
  const [editArea, setEditArea] = useState('');
  const [editBio, setEditBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Live Bookings State
  const [bookings, setBookings] = useState<BookingDisplayItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Privacy Preferences
  const [lockScreenAlerts, setLockScreenAlerts] = useState(true);
  const [reminderEmails, setReminderEmails] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  // Active pass details
  const [passData, setPassData] = useState<any>(null);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; title: string; message: string; time: string; isUnread?: boolean }>
  >([]);
  const [savedCompanions, setSavedCompanions] = useState<
    Array<{
      id: string;
      displayName: string;
      city: string;
      locality: string;
      hourlyRate: number;
      ratingAverage: number;
      avatarUrl: string | null;
      isAvailable: boolean;
    }>
  >([]);

  useEffect(() => {
    if (user || memberProfile) {
      setEditName(memberProfile?.fullName || user?.name || '');
      setEditCity(memberProfile?.city || user?.city || 'chandigarh');
      setEditArea(memberProfile?.area || user?.area || '');
      setEditBio(memberProfile?.bio || user?.bio || '');
    }
  }, [user, memberProfile]);

  useEffect(() => {
    async function loadData() {
      try {
        const [passRes, notifRes, bookmarkRes] = await Promise.all([
          fetch('/api/passes/active', { cache: 'no-store' }),
          fetch('/api/notifications', { cache: 'no-store' }),
          fetch('/api/companions/bookmarks', { cache: 'no-store' }),
        ]);

        const passJson = await passRes.json();
        if (passJson.activePass) {
          setPassData(passJson.activePass);
        }

        if (notifRes.ok) {
          const notifJson = await notifRes.json();
          if (Array.isArray(notifJson.notifications)) {
            setNotifications(notifJson.notifications);
          }
        }

        if (bookmarkRes.ok) {
          const bookmarkJson = await bookmarkRes.json();
          if (Array.isArray(bookmarkJson.companions)) {
            setSavedCompanions(bookmarkJson.companions);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch dashboard metadata:', err);
      }

      if (user?.id || user?.phone) {
        setLoadingBookings(true);
        try {
          const live = await fetchLiveBookings({
            memberId: user?.id,
            memberPhone: user?.phone,
          });
          setBookings(live);
        } catch (e) {
          console.warn('Failed to load live bookings:', e);
        } finally {
          setLoadingBookings(false);
        }
      }
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, user]);

  // Greeting by hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = memberProfile?.fullName || user?.name || 'Member';
  const cleanPhone = (user?.phone || '').replace(/^\+91/, '').trim();
  const displayPhone =
    cleanPhone.length === 10
      ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
      : user?.phone || '+91 85434 52677';

  const referralCode = user?.referralCode || 'ZXZ2PBZ';
  const referralLink = `https://trycompanio.in/?invite=${referralCode}`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/user/member-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editName.trim(),
          city: editCity,
          area: editArea.trim(),
          bio: editBio.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Profile details saved successfully.', 'Profile Updated');
        setIsEditingProfile(false);
        await refreshSession();
      } else {
        toast.error(data.error || 'Failed to update profile.', 'Error');
      }
    } catch {
      toast.error('Network error updating profile.', 'Error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCopyInvite = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(referralLink);
      setCopiedInvite(true);
      toast.success('Referral link copied to clipboard!', 'Copied');
      setTimeout(() => setCopiedInvite(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Top Header & Funnel Bar */}
        <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-ink">
                {getGreeting()}, {userName}
              </h1>
              <p className="text-xs font-bold text-ink-muted mt-1">
                Welcome to your Meetzy Club member dashboard.
              </p>
            </div>

            {/* Pass Status Pill */}
            {passData || user?.isUnlocked ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-[#D4F7A5] px-4 py-2 font-display text-xs font-black shadow-brutal-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-800" />
                <span>
                  Pass active until {passData?.expiresAt ? new Date(passData.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '24 Dec 2026'}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-sunny px-4 py-2 font-display text-xs font-black shadow-brutal-xs hover:bg-sunny-soft transition cursor-pointer"
              >
                <Lock className="h-4 w-4 text-ink" />
                <span>Passes from ₹199 · Unlock Profiles</span>
              </button>
            )}
          </div>

          {/* Member Journey Stage Funnel */}
          <div className="border-t-2 border-ink/10 pt-4 flex items-center justify-between sm:justify-start gap-2 sm:gap-6 text-xs font-extrabold text-ink-muted">
            <span className="text-ink font-black flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Browsed</span>
            </span>
            <span className="text-ink/30">→</span>
            <span className={`flex items-center gap-1.5 ${bookings.length > 0 ? 'text-ink font-black' : ''}`}>
              <span>Booked</span>
            </span>
            <span className="text-ink/30">→</span>
            <span>Met</span>
            <span className="text-ink/30">→</span>
            <span>Reviewed</span>
          </div>
        </div>

        {/* Host Onboarding or Studio Switch Banner */}
        {hostProfile ? (
          <div className="rounded-2xl border-2 border-ink bg-[#D4F7A5]/70 p-4 sm:p-5 shadow-brutal-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ink" />
                <h2 className="font-display text-sm font-black text-ink uppercase">
                  Host Studio Active ({hostProfile.displayName})
                </h2>
              </div>
              <p className="text-xs font-bold text-ink-soft">
                Manage your incoming meetup requests, 4-digit Start PIN verification, and 70% UPI cashouts from your Host Studio.
              </p>
            </div>
            <Link
              href="/companion/dashboard"
              className="inline-flex items-center gap-1 rounded-xl border-2 border-ink bg-ink text-white px-4 py-2 font-display text-xs font-black shadow-brutal-xs hover:bg-ink/90 transition cursor-pointer shrink-0"
            >
              <span>Open Host Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-ink bg-sunny/60 p-4 sm:p-5 shadow-brutal-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ink" />
                <h2 className="font-display text-sm font-black text-ink uppercase">
                  Earn 70% Per Meetup as a Verified Host
                </h2>
              </div>
              <p className="text-xs font-bold text-ink-soft">
                Use your same verified mobile number to host platonic coffee or city walks. Zero Aadhaar upload required.
              </p>
            </div>
            <Link
              href="/become-a-companion/apply"
              className="inline-flex items-center gap-1 rounded-xl border-2 border-ink bg-ink text-white px-4 py-2 font-display text-xs font-black shadow-brutal-xs hover:bg-ink/90 transition cursor-pointer shrink-0"
            >
              <span>Become a Host</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* 7 Tab Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b-2 border-ink/20">
          {(
            [
              { id: 'overview' as const, label: 'Overview', icon: Sparkles },
              { id: 'bookings' as const, label: 'Bookings', icon: Calendar, badge: bookings.length > 0 ? bookings.length : undefined },
              { id: 'messages' as const, label: 'Messages', icon: MessageSquare },
              { id: 'saved' as const, label: 'Saved', icon: Bookmark, badge: savedCompanions.length > 0 ? savedCompanions.length : undefined },
              { id: 'notifications' as const, label: 'Notifications', icon: Bell, badge: notifications.filter((n) => n.isUnread).length || undefined },
              { id: 'support' as const, label: 'Support', icon: HelpCircle },
              { id: 'account' as const, label: 'Account', icon: User },
            ] as Array<{
              id: DashboardTab;
              label: string;
              icon: any;
              badge?: number | string;
              alert?: boolean;
            }>
          ).map((t) => {
            const isSelected = activeTab === t.id;
            const TabIcon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 font-display text-xs font-black transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-ink bg-ink text-white shadow-brutal-xs'
                    : 'border-transparent hover:border-ink/20 bg-white text-ink-soft hover:text-ink'
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-lime text-ink' : 'bg-paper-deep text-ink-muted'
                    }`}
                  >
                    {t.badge}
                  </span>
                )}
                {t.alert && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Pass Status */}
              <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal space-y-2">
                <span className="text-[10px] font-black uppercase text-ink-muted">Access Pass</span>
                <div className="font-display text-lg font-black text-ink">
                  {user?.isUnlocked ? 'Active Full Pass' : 'Not Active'}
                </div>
                <p className="text-xs text-ink-soft">
                  {user?.isUnlocked
                    ? 'All companion profiles & meetups unlocked.'
                    : 'Get a pass to view full profiles and send requests.'}
                </p>
                {!user?.isUnlocked && (
                  <button
                    type="button"
                    onClick={() => setIsUnlockModalOpen(true)}
                    className="text-xs font-black text-ink underline pt-1 block"
                  >
                    Unlock Profiles →
                  </button>
                )}
              </div>

              {/* Chat Coin Balance */}
              <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal space-y-2">
                <span className="text-[10px] font-black uppercase text-ink-muted">Chat Coins</span>
                <div className="flex items-center gap-2">
                  <div className="font-display text-lg font-black text-ink">
                    {user?.coinBalance ?? 100} Coins
                  </div>
                  <span className="text-[10px] font-bold text-ink-muted font-mono">1 Coin = ₹1</span>
                </div>
                <p className="text-xs text-ink-soft">
                  Coins power in-app direct messaging with hosts.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCoinTopupOpen(true)}
                  className="text-xs font-black text-ink underline pt-1 block"
                >
                  + Recharge Coins →
                </button>
              </div>

              {/* Meetups */}
              <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal space-y-2">
                <span className="text-[10px] font-black uppercase text-ink-muted">Total Meetups</span>
                <div className="font-display text-lg font-black text-ink">
                  {bookings.length} Booked
                </div>
                <p className="text-xs text-ink-soft">
                  Protected by 100% money-back escrow guarantees.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange('bookings')}
                  className="text-xs font-black text-ink underline pt-1 block"
                >
                  View Bookings →
                </button>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/explore"
                className="group p-5 rounded-2xl border-2 border-ink bg-sunny shadow-brutal flex items-center justify-between hover:bg-sunny-soft transition"
              >
                <div>
                  <h3 className="font-display text-base font-black text-ink">
                    Explore Verified Companions
                  </h3>
                  <p className="text-xs font-bold text-ink-soft">
                    Browse authentic local companions in your city.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-ink group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/become-a-companion"
                className="group p-5 rounded-2xl border-2 border-ink bg-white shadow-brutal flex items-center justify-between hover:bg-paper transition"
              >
                <div>
                  <h3 className="font-display text-base font-black text-ink">
                    Earn as a Companion Host
                  </h3>
                  <p className="text-xs font-bold text-ink-soft">
                    Accompany verified members to cafes and gym sessions.
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-ink group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-black text-ink">Your Meetups</h2>
              <Link href="/explore">
                <Button variant="primary" size="sm">
                  <span>Book New Meetup +</span>
                </Button>
              </Link>
            </div>

            {loadingBookings ? (
              <div className="rounded-2xl border-2 border-ink bg-white p-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-ink" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border-2 border-ink bg-white p-10 text-center space-y-3">
                <Calendar className="h-8 w-8 text-ink-muted mx-auto" />
                <h3 className="font-display text-base font-black text-ink">No meetups yet</h3>
                <p className="text-xs text-ink-muted max-w-sm mx-auto">
                  When you request a companion session, it will show up here with secret meetup start codes and escrow status.
                </p>
                <div className="pt-2">
                  <Link href="/explore">
                    <Button variant="primary" size="sm">
                      Find Companions →
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl border-2 border-ink bg-white shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-black text-ink">
                          {b.companion?.name || b.memberName}
                        </span>
                        <Badge variant="lime" size="sm">
                          {b.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-ink-soft flex items-center gap-3">
                        <span>{b.activity}</span>
                        <span>·</span>
                        <span>{b.meetingPoint}</span>
                        <span>·</span>
                        <span>{b.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {b.startCode && (
                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase text-ink-muted block">Start PIN</span>
                          <span className="font-mono text-base font-black text-ink">{b.startCode}</span>
                        </div>
                      )}
                      <Link href={`/chat`}>
                        <Button variant="outline" size="sm">
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="rounded-2xl border-2 border-ink bg-[#D4F7A5] p-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-ink" />
                <div>
                  <div className="font-display text-base font-black text-ink">
                    {user?.coinBalance ?? 100} Coins Available
                  </div>
                  <div className="text-xs font-bold text-ink-soft">
                    Shielded in-app chat opens automatically once your meetup booking is accepted.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/chat"
                  className="rounded-xl border-2 border-ink bg-ink text-white px-3.5 py-1.5 font-display text-xs font-black shadow-brutal-xs hover:bg-black transition"
                >
                  Open Inbox
                </Link>
                <button
                  type="button"
                  onClick={() => setIsCoinTopupOpen(true)}
                  className="rounded-xl border-2 border-ink bg-white px-3.5 py-1.5 font-display text-xs font-black shadow-brutal-xs hover:bg-paper transition cursor-pointer"
                >
                  + Recharge Coins
                </button>
              </div>
            </div>

            {bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS' || b.status === 'COMPLETED').length === 0 ? (
              <div className="rounded-2xl border-2 border-ink bg-white p-8 text-center space-y-3">
                <MessageSquare className="h-8 w-8 text-ink-muted mx-auto" />
                <h3 className="font-display text-base font-black text-ink">
                  Shielded In-App Conversations
                </h3>
                <p className="text-xs text-ink-muted max-w-sm mx-auto">
                  Once a host accepts your booking, your private shielded chat room appears here.
                </p>
                <div className="pt-2">
                  <Link href="/explore">
                    <Button variant="primary" size="sm">
                      Browse Companions →
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings
                  .filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS' || b.status === 'COMPLETED')
                  .map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border-2 border-ink bg-white p-4 flex items-center justify-between gap-4 shadow-brutal-xs"
                    >
                      <div>
                        <p className="font-display text-sm font-black text-ink">
                          {b.companion?.name || 'Verified Host'} — {b.activity}
                        </p>
                        <p className="text-xs font-semibold text-ink-muted">
                          {b.meetingPoint} • {b.date} ({b.status})
                        </p>
                      </div>
                      <Link href={`/chat/${b.id}`}>
                        <Button variant="primary" size="sm">
                          Open Chat
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SAVED */}
        {activeTab === 'saved' && (
          savedCompanions.length === 0 ? (
            <div className="rounded-2xl border-2 border-ink bg-white p-10 text-center space-y-3 animate-in fade-in">
              <Bookmark className="h-8 w-8 text-ink-muted mx-auto" />
              <h3 className="font-display text-base font-black text-ink">No saved companions</h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                Tap the bookmark icon on any companion card while exploring to keep them handy here.
              </p>
              <div className="pt-2">
                <Link href="/explore">
                  <Button variant="primary" size="sm">
                    Explore Now →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
              {savedCompanions.map((comp) => (
                <div
                  key={comp.id}
                  className="rounded-2xl border-2 border-ink bg-white p-4 shadow-brutal-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {comp.avatarUrl ? (
                      <img
                        src={comp.avatarUrl}
                        alt={comp.displayName}
                        className="h-14 w-14 rounded-xl border-2 border-ink object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl border-2 border-ink bg-sunny flex items-center justify-center font-display text-lg font-black shrink-0">
                        {comp.displayName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-black text-ink truncate">
                        {comp.displayName}
                      </h3>
                      <p className="text-xs font-semibold text-ink-soft truncate">
                        {comp.locality || comp.city} • INR {comp.hourlyRate}/hr
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/companion/${comp.id}`}
                      className="rounded-xl border-2 border-ink bg-lime px-3 py-1.5 font-display text-xs font-black text-ink hover:bg-lime/80"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await fetch('/api/companions/bookmarks', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ companionId: comp.id }),
                        });
                        if (res.ok) {
                          setSavedCompanions((prev) => prev.filter((item) => item.id !== comp.id));
                          toast.success('Removed from Saved companions.');
                        }
                      }}
                      className="rounded-xl border-2 border-ink bg-cream px-2.5 py-1.5 text-xs font-black text-ink hover:bg-rose-50 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="rounded-2xl border-2 border-ink bg-white p-6 shadow-brutal space-y-4 animate-in fade-in">
            <h2 className="font-display text-lg font-black text-ink">Notifications</h2>

            {notifications.length === 0 ? (
              <p className="text-xs font-bold text-ink-muted py-4">
                You are all caught up. Booking updates and platform alerts appear here automatically.
              </p>
            ) : (
              <div className="divide-y divide-ink/10 text-xs">
                {notifications.map((item) => (
                  <div key={item.id} className="py-3 flex items-start gap-3">
                    <div
                      className={`h-2 w-2 rounded-full mt-1 shrink-0 ${
                        item.isUnread ? 'bg-emerald-500' : 'bg-ink/25'
                      }`}
                    />
                    <div className="space-y-0.5">
                      <div className="font-display font-black text-ink">{item.title}</div>
                      <div className="text-ink-soft">{item.message}</div>
                      <div className="text-[10px] font-mono text-ink-muted">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SUPPORT */}
        {activeTab === 'support' && (
          <div className="rounded-2xl border-2 border-ink bg-white p-6 shadow-brutal space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-black text-ink">24/7 Member Safety &amp; Support</h2>
              <p className="text-xs text-ink-muted">
                Your safety and peace of mind are our absolute top priority.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-ink bg-sunny/30 p-4 space-y-1">
                <div className="text-[10px] font-black uppercase text-ink-muted">Emergency Safety Line</div>
                <div className="font-display text-base font-black text-ink">National Helpline 112</div>
                <p className="text-xs text-ink-soft">Available 24/7 for immediate physical assistance.</p>
              </div>

              <div className="rounded-xl border-2 border-ink bg-paper p-4 space-y-1">
                <div className="text-[10px] font-black uppercase text-ink-muted">Companio Trust &amp; Grievance</div>
                <div className="font-display text-base font-black text-ink">support@trycompanio.in</div>
                <p className="text-xs text-ink-soft">Average response time is under 15 minutes.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ACCOUNT (FULL COMPANIO PARITY) */}
        {activeTab === 'account' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Public Profile Card */}
            <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal space-y-5">
              <div className="flex items-center justify-between border-b-2 border-ink/10 pb-3">
                <div>
                  <h2 className="font-display text-lg font-black text-ink">Public Profile</h2>
                  <p className="text-xs text-ink-muted">Companions see this when you book.</p>
                </div>

                <Button
                  variant={isEditingProfile ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                </Button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-ink">Your Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Nikhil"
                      className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2 font-display text-sm font-bold text-ink focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-ink">City</label>
                      <select
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2 font-display text-xs font-bold text-ink focus:outline-none"
                      >
                        {CITIES.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black uppercase text-ink">Area / Locality</label>
                      <input
                        type="text"
                        value={editArea}
                        onChange={(e) => setEditArea(e.target.value)}
                        placeholder="e.g. Sector 17, Indiranagar"
                        className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2 font-display text-xs font-bold text-ink focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-ink">Bio</label>
                    <textarea
                      rows={2}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="A line or two helps companions know who they're meeting..."
                      className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2 font-display text-xs font-bold text-ink focus:outline-none focus:bg-white"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="md" disabled={savingProfile}>
                    <Save className="h-4 w-4" />
                    <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
                  </Button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-ink">
                  <div>
                    <span className="text-[10px] font-black uppercase text-ink-muted block">Name</span>
                    <span className="text-sm font-black">{userName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-ink-muted block">Phone</span>
                    <span className="font-mono text-sm">{displayPhone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-ink-muted block">City</span>
                    <span className="capitalize">{memberProfile?.city || user?.city || 'Not set'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-ink-muted block">Email</span>
                    <span>{user?.email || 'Not set'}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-black uppercase text-ink-muted block">Bio</span>
                    <span className="text-ink-soft">
                      {memberProfile?.bio || user?.bio || 'No bio yet. A line or two helps companions know who they’re meeting.'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Your Pass Details Card */}
            <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal space-y-4">
              <div className="flex items-center justify-between border-b-2 border-ink/10 pb-3">
                <h2 className="font-display text-lg font-black text-ink">Your Pass</h2>
                {user?.isUnlocked ? (
                  <Badge variant="lime" size="sm">Active</Badge>
                ) : (
                  <Badge variant="dark" size="sm">Inactive</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-ink-muted block">Tier</span>
                  <span className="font-display font-black text-sm capitalize">
                    {(passData?.tier || user?.activePassTier || 'Free Explorer').replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <div className="text-[10px] text-ink-soft">
                    {passData?.validUntil
                      ? `Active until ${new Date(passData.validUntil).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}`
                      : passData
                      ? 'Lifetime Access'
                      : 'Browse & Compare Open Profiles Free'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-ink-muted block">Paid</span>
                  <span className="font-display font-black text-sm">
                    {passData?.pricePaid ? `INR ${passData.pricePaid}` : 'INR 0'}
                  </span>
                  <div className="text-[10px] text-ink-soft">
                    {passData ? 'One-time payment' : 'No pass required to browse'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-ink-muted block">Invoice Number</span>
                  <span className="font-mono font-bold text-xs">
                    {passData?.id
                      ? `CMPN-${new Date(passData.createdAt || Date.now()).getFullYear()}-${String(passData.id).slice(-6).toUpperCase()}`
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-ink-soft pt-1">
                Every companion profile on Explore is open to browse and compare for free. Each meetup booking is paid separately at the host&apos;s hourly rate.
              </p>

              {passData?.id && (
                <div className="pt-2">
                  <Link
                    href={`/receipt/${passData.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-ink underline hover:text-ink-soft"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download receipt (opens in new tab)</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Invite a Friend Card */}
            <div className="rounded-3xl border-3 border-ink bg-sunny/40 p-6 sm:p-8 shadow-brutal space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-ink" />
                <h3 className="font-display text-base font-black text-ink">
                  Invite a friend, both get a free week
                </h3>
              </div>
              <p className="text-xs font-bold text-ink-soft">
                When a friend joins with your link and completes their first booking or pass, both accounts receive bonus wallet coins.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <div className="w-full sm:flex-1 rounded-xl border-2 border-ink bg-white px-3.5 py-2 font-mono text-xs font-black text-ink truncate select-all">
                  {referralLink}
                </div>
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border-2 border-ink bg-ink text-white px-4 py-2 font-display text-xs font-black shadow-brutal-xs hover:bg-black transition cursor-pointer shrink-0"
                >
                  {copiedInvite ? <Check className="h-3.5 w-3.5 text-lime" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedInvite ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* 4. Host Application Status Card */}
            {hostProfile ? (
              <div className="rounded-3xl border-3 border-ink bg-[#D4F7A5]/60 p-6 sm:p-8 shadow-brutal space-y-3">
                <h3 className="font-display text-base font-black text-ink">
                  Host Studio Active ({hostProfile.displayName})
                </h3>
                <p className="text-xs font-bold text-ink-soft">
                  Your Host account is verified on the same phone number. You keep a fixed 70% payout per completed meetup.
                </p>
                <div>
                  <Link
                    href="/companion/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-ink text-white px-4 py-2 font-display text-xs font-black shadow-brutal-xs hover:bg-black transition cursor-pointer"
                  >
                    <span>Go to Host Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal space-y-3">
                <h3 className="font-display text-base font-black text-ink">
                  Want to host meetups too?
                </h3>
                <p className="text-xs font-bold text-ink-soft">
                  Register as a Verified Host with your existing phone number, pick a Starter/Pro/Elite Host Pack, and earn 70% fixed on every booking.
                </p>
                <div>
                  <Link
                    href="/become-a-companion/apply"
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-lime px-4 py-2 font-display text-xs font-black text-ink shadow-brutal-xs hover:bg-lime/80 transition cursor-pointer"
                  >
                    <span>Become a Verified Host</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* 5. Notifications and Privacy Preferences */}
            <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal space-y-5">
              <h3 className="font-display text-base font-black text-ink">
                Notifications and privacy
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-black text-ink">Lock-screen alerts</div>
                    <div className="text-ink-muted">Turn on to get meetup updates and messages on this phone.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={lockScreenAlerts}
                    onChange={(e) => setLockScreenAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-ink text-ink cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-ink/10 pt-3">
                  <div>
                    <div className="font-black text-ink">Reminder emails</div>
                    <div className="text-ink-muted">Email me optional plan, profile and meetup reminders.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={reminderEmails}
                    onChange={(e) => setReminderEmails(e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-ink text-ink cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-ink/10 pt-3">
                  <div>
                    <div className="font-black text-ink">Analytics and ad measurement</div>
                    <div className="text-ink-muted">PostHog and Google Analytics to improve the platform. We don't sell your data.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-ink text-ink cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 6. Account Actions & Clean Sign Out */}
            <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal space-y-4">
              <h3 className="font-display text-base font-black text-ink">Your account</h3>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink/10 pb-4">
                <div>
                  <div className="font-display text-xs font-black text-ink">Download your data</div>
                  <div className="text-[11px] text-ink-muted">
                    A JSON file covering profile, bookings, messages, saved companions and payments.
                  </div>
                </div>

                <a
                  href="/api/user/export"
                  download
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-paper px-3.5 py-2 font-display text-xs font-black hover:bg-paper-deep transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download a copy</span>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <div className="font-display text-xs font-black text-danger">Sign Out</div>
                  <div className="text-[11px] text-ink-muted">
                    Signed in via {displayPhone}. This signs you out across all your devices.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    await logout();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-rose-100 text-danger px-4 py-2 font-display text-xs font-black hover:bg-danger hover:text-white transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Unlock Pass Modal */}
      <UnlockProfileModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onSuccess={() => refreshSession()}
      />

      {/* Coin Topup Modal */}
      <CoinTopupModal
        isOpen={isCoinTopupOpen}
        onClose={() => setIsCoinTopupOpen(false)}
        onSuccess={() => refreshSession()}
      />

      <Footer />
    </div>
  );
}

export default function MemberDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ink" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
