'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  MapPin,
  ShieldCheck,
  ChevronDown,
  User,
  LogOut,
  Calendar,
  Sparkles,
  ArrowRightLeft,
  KeyRound,
  X,
  Coins,
  Wallet,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { MobileDrawer } from './mobile-drawer';
import { CITIES } from '@/lib/data/cities';
import { useAuth } from '@/context/auth-context';
import { AvatarVector } from '@/components/ui/avatar-vector';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('bengaluru');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'alerts' | 'offers'>('alerts');
  const [notifData, setNotifData] = useState<{
    notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      badge?: string;
      badgeVariant?: any;
      ctaText?: string;
      ctaUrl?: string;
      createdAt: string;
    }>;
    offers: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      badge?: string;
      badgeVariant?: any;
      ctaText?: string;
      ctaUrl?: string;
      createdAt: string;
    }>;
    unreadCount: number;
  }>({
    notifications: [],
    offers: [],
    unreadCount: 0,
  });

  // Capture referral parameter anywhere across the platform
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        localStorage.setItem('companio_referral_code', ref);
      }
    }
  }, [pathname]);

  const { isAuthenticated, isLoading, user, memberProfile, hostProfile, activeRole, logout, switchRole } =
    useAuth();

  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifData({
            notifications: data.notifications || [],
            offers: data.offers || [],
            unreadCount: data.unreadCount || 0,
          });
        }
      })
      .catch((err) => console.warn('[NOTIF_FETCH_ERROR]:', err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, pathname]);

  const isApplyingHost = pathname?.startsWith('/become-a-companion') || pathname?.startsWith('/become-a-host');
  const isOnboarding = pathname?.startsWith('/onboarding');
  const isAnonymousName = !user?.name || user.name.toLowerCase() === 'member';

  const formatPhoneNumber = (ph?: string | null) => {
    if (!ph) return '';
    const digits = ph.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      const nat = digits.slice(2);
      return `+91 ${nat.slice(0, 5)} ${nat.slice(5)}`;
    }
    return ph;
  };

  let resolvedName =
    activeRole === 'host'
      ? hostProfile?.displayName || user?.name || 'Host'
      : memberProfile?.fullName || user?.name || 'Member';

  let roleLabel = activeRole === 'host' ? 'Host Portal' : 'Member';
  let badgeLabel = activeRole === 'host' ? 'Verified Host' : 'Active Member';
  let badgeVariant: 'lime' | 'sunny' | 'coral' | 'lavender' = activeRole === 'host' ? 'lime' : 'sunny';

  const activeAvatarUrl =
    (activeRole === 'host' ? hostProfile?.avatarUrl : (user?.avatarUrl || memberProfile?.avatarUrl)) ||
    hostProfile?.avatarUrl ||
    user?.avatarUrl ||
    memberProfile?.avatarUrl;

  if (isApplyingHost && !hostProfile && user?.role !== 'COMPANION') {
    resolvedName = !isAnonymousName ? resolvedName : (user?.phone ? formatPhoneNumber(user.phone) : 'Host Applicant');
    roleLabel = 'Host Applicant';
    badgeLabel = 'Application in Progress';
    badgeVariant = 'sunny';
  } else if (isOnboarding) {
    resolvedName = !isAnonymousName ? resolvedName : (user?.phone ? formatPhoneNumber(user.phone) : 'New User');
    roleLabel = 'Onboarding';
    badgeLabel = 'Registration';
    badgeVariant = 'lavender';
  } else if (isAnonymousName && !hostProfile) {
    resolvedName = user?.phone ? formatPhoneNumber(user.phone) : 'New Member';
    roleLabel = 'New Member';
    badgeLabel = 'Active User';
    badgeVariant = 'sunny';
  } else if (hostProfile?.verificationStatus === 'pending') {
    roleLabel = 'Under Review';
    badgeLabel = 'Verification Pending';
    badgeVariant = 'sunny';
  }

  const userInitials = resolvedName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Top High-Voltage Platonic Notice Strip (Dismissible) */}
      {isBannerVisible && (
        <div className="relative bg-pink text-ink border-b-brutal px-8 py-1.5 text-center font-display text-xs sm:text-sm font-extrabold tracking-wide uppercase flex items-center justify-center gap-2 select-none">
          <span className="inline-block h-2 w-2 rounded-full bg-ink animate-pulse" />
          <span className="truncate sm:overflow-visible">
            100% Platonic Only · Mobile OTP Verified · Escrow Protected · 18+
          </span>
          <button
            type="button"
            onClick={() => setIsBannerVisible(false)}
            aria-label="Close announcement banner"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/15 active:scale-95 transition-all text-ink flex items-center justify-center"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full border-b-brutal bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Logo size="md" />

            {/* Platonic sticker badge */}
            <div className="hidden md:block">
              <Badge variant="sunny" size="sm" className="-rotate-2">
                Platonic Only
              </Badge>
            </div>
          </div>

          {/* Center Navigation Links: Streamlined 3 Core Links */}
          <nav className="hidden lg:flex items-center gap-8 font-display text-sm font-extrabold text-ink">
            <Link href="/explore" className="hover:text-lavender transition-colors">
              Explore
            </Link>
            <Link href="/how-it-works" className="hover:text-lavender transition-colors">
              How It Works
            </Link>
            <Link href="/safety" className="flex items-center gap-1.5 hover:text-lavender transition-colors">
              <ShieldCheck className="h-4 w-4 text-ink" />
              <span>Safety</span>
            </Link>
          </nav>

          {/* Right Area: Hosting Link + Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Hosting Link */}
            {activeRole === 'host' ? (
              <Link
                href="/companion/dashboard"
                className="font-display text-xs font-black text-ink hover:text-lavender transition-colors flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-paper-deep"
              >
                <Sparkles className="h-3.5 w-3.5 text-ink" />
                <span>Host Portal</span>
              </Link>
            ) : (
              <Link
                href="/become-a-host"
                className="font-display text-xs font-black text-ink hover:text-lavender transition-colors py-1 px-2 rounded-lg hover:bg-paper-deep"
              >
                Become a Host
              </Link>
            )}

            {/* Dynamic Authentication Area */}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 rounded-xl border-2 border-ink/20 bg-paper-deep/60 animate-pulse" />
                <div className="h-8 w-8 rounded-xl border-2 border-ink/20 bg-paper-deep/60 animate-pulse" />
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Coin Balance Pill */}
                <Link
                  href="/wallet"
                  title="View wallet & coins"
                  className="flex items-center gap-1.5 rounded-xl border-brutal bg-[#D4F7A5] px-2.5 py-1.5 text-xs font-black text-ink shadow-brutal-xs hover:bg-[#c3ec8d] btn-press"
                >
                  <Coins className="h-3.5 w-3.5 text-ink" />
                  <span>{user?.coinBalance ?? 100} Coins</span>
                </Link>

                {/* Notifications & Offers Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsUserMenuOpen(false);
                    }}
                    title="Notifications & Offers"
                    className="relative flex h-8 w-8 items-center justify-center rounded-xl border-brutal bg-white shadow-brutal-xs hover:bg-paper-deep btn-press cursor-pointer"
                  >
                    <Bell className="h-4 w-4 text-ink" />
                    {notifData.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full border border-ink bg-danger px-1 text-[9px] font-black text-white">
                        {notifData.unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border-brutal bg-white p-3 shadow-brutal-lg z-50 space-y-3 animate-in fade-in">
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between border-b-brutal-sm pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xs font-black uppercase text-ink">
                            Notifications &amp; Offers
                          </span>
                          {notifData.unreadCount > 0 && (
                            <Badge variant="sunny" size="sm">
                              {notifData.unreadCount} New
                            </Badge>
                          )}
                        </div>
                        <button
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-ink-muted hover:text-ink text-xs font-bold cursor-pointer"
                        >
                          Close
                        </button>
                      </div>

                      {/* Dropdown Tabs */}
                      <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl border border-ink bg-paper">
                        <button
                          type="button"
                          onClick={() => setNotifTab('alerts')}
                          className={`py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                            notifTab === 'alerts'
                              ? 'bg-ink text-paper shadow-brutal-xs'
                              : 'text-ink hover:bg-black/5'
                          }`}
                        >
                          Alerts ({notifData.notifications.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotifTab('offers')}
                          className={`py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                            notifTab === 'offers'
                              ? 'bg-ink text-paper shadow-brutal-xs'
                              : 'text-ink hover:bg-black/5'
                          }`}
                        >
                          Offers ({notifData.offers.length})
                        </button>
                      </div>

                      {/* Tab Panels */}
                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                        {notifTab === 'alerts' ? (
                          notifData.notifications.length === 0 ? (
                            <div className="py-6 text-center text-xs font-bold text-ink-muted">
                              No active alerts. You are all set!
                            </div>
                          ) : (
                            notifData.notifications.map((n) => (
                              <div
                                key={n.id}
                                className="p-2.5 rounded-xl border border-ink bg-paper/60 space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="font-display text-xs font-black text-ink">
                                    {n.title}
                                  </span>
                                  {n.badge && (
                                    <Badge variant={(n.badgeVariant as any) || 'sunny'} size="sm">
                                      {n.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[11px] font-bold text-ink-soft leading-tight">
                                  {n.message}
                                </p>
                                {n.ctaText && n.ctaUrl && (
                                  <Link
                                    href={n.ctaUrl}
                                    onClick={() => setIsNotificationsOpen(false)}
                                    className="inline-block pt-0.5 font-display text-[11px] font-black text-ink underline hover:text-lavender"
                                  >
                                    {n.ctaText}
                                  </Link>
                                )}
                              </div>
                            ))
                          )
                        ) : notifData.offers.length === 0 ? (
                          <div className="py-6 text-center text-xs font-bold text-ink-muted">
                            No promotional offers right now.
                          </div>
                        ) : (
                          notifData.offers.map((o) => (
                            <div
                              key={o.id}
                              className="p-2.5 rounded-xl border border-ink bg-sunny/20 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="font-display text-xs font-black text-ink">
                                  {o.title}
                                </span>
                                {o.badge && (
                                  <Badge variant={(o.badgeVariant as any) || 'lime'} size="sm">
                                    {o.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] font-bold text-ink-soft leading-tight">
                                {o.message}
                              </p>
                              {o.ctaText && o.ctaUrl && (
                                <Link
                                  href={o.ctaUrl}
                                  onClick={() => setIsNotificationsOpen(false)}
                                  className="inline-block pt-0.5 font-display text-[11px] font-black text-ink underline hover:text-lavender"
                                >
                                  {o.ctaText}
                                </Link>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border-brutal bg-white px-2.5 py-1.5 shadow-brutal-sm hover:bg-paper-deep btn-press cursor-pointer"
                  >
                  {activeAvatarUrl ? (
                    <div className="relative h-7 w-7 rounded-lg overflow-hidden border-2 border-ink shrink-0">
                      <Image
                        src={activeAvatarUrl}
                        alt={resolvedName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <AvatarVector
                      gender={memberProfile?.gender || 'female'}
                      size="sm"
                      bgVariant={memberProfile?.gender === 'male' ? 'sky' : 'pink'}
                    />
                  )}
                  <div className="text-left">
                    <span className="block font-display text-xs font-black text-ink leading-tight">
                      {resolvedName}
                    </span>
                    <span className="block text-[10px] font-bold text-ink-muted capitalize">
                      {roleLabel}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-ink" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border-brutal bg-white p-2.5 shadow-brutal-lg z-50 space-y-1 animate-in fade-in">
                    {/* Header Details */}
                    <div className="border-b-brutal-sm p-2 pb-2.5 flex items-center gap-2.5">
                      {activeAvatarUrl ? (
                        <div className="relative h-9 w-9 rounded-xl overflow-hidden border-2 border-ink shrink-0">
                          <Image
                            src={activeAvatarUrl}
                            alt={resolvedName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <AvatarVector
                          gender={memberProfile?.gender || 'female'}
                          size="md"
                          bgVariant={memberProfile?.gender === 'male' ? 'sky' : 'pink'}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xs font-black text-ink truncate">{resolvedName}</p>
                        <p className="text-[10px] font-mono text-ink-muted truncate">
                          {formatPhoneNumber(user?.phone)}
                        </p>
                        <div className="mt-1">
                          <Badge variant={badgeVariant} size="sm">
                            {badgeLabel}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Quick Wallet Link */}
                    <Link
                      href="/wallet"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-lime/15 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-[#D4F7A5] text-ink shadow-brutal-xs">
                          <Coins className="h-3.5 w-3.5" />
                        </div>
                        <span>Wallet &amp; Coins</span>
                      </div>
                      <span className="text-[10px] font-mono font-black bg-[#D4F7A5] px-1.5 py-0.5 rounded border border-ink">
                        {user?.coinBalance ?? 100}
                      </span>
                    </Link>

                    {/* Member Meetups */}
                    <Link
                      href="/bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-lavender/15 transition-colors group"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-[#E8DEFF] text-ink shadow-brutal-xs">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <span>My Meetups</span>
                    </Link>

                    {/* Member Profile Link */}
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-sky-50 transition-colors group"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-[#BAE6FD] text-ink shadow-brutal-xs">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span>My Profile</span>
                    </Link>

                    {/* Host Links if applicable */}
                    {hostProfile || user?.role === 'COMPANION' ? (
                      <>
                        <Link
                          href="/companion/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-lime/20 transition-colors group"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-[#D4F7A5] text-ink shadow-brutal-xs">
                            <KeyRound className="h-3.5 w-3.5 text-ink" />
                          </div>
                          <span>Host Dashboard</span>
                        </Link>

                        <button
                          onClick={() => {
                            switchRole(activeRole === 'host' ? 'member' : 'host');
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left font-display text-xs font-bold text-ink hover:bg-sunny/20 transition-colors group cursor-pointer"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-sunny text-ink shadow-brutal-xs">
                            <ArrowRightLeft className="h-3.5 w-3.5 text-ink" />
                          </div>
                          <span>Switch to {activeRole === 'host' ? 'Member' : 'Host'}</span>
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/become-a-companion"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-sunny/20 transition-colors group"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-sunny text-ink shadow-brutal-xs">
                          <Sparkles className="h-3.5 w-3.5 text-ink" />
                        </div>
                        <span>Apply to Become a Host</span>
                      </Link>
                    )}

                    {/* Logout */}
                    <div className="border-t-brutal-sm pt-1 mt-1">
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          setIsUserMenuOpen(false);
                          await logout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left font-display text-xs font-bold text-danger hover:bg-danger/10 transition-colors cursor-pointer group"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-rose-100 text-danger shadow-brutal-xs">
                          <LogOut className="h-3.5 w-3.5" />
                        </div>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            ) : (
              <>
                <Link href="/login?intent=member">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>

                <Link href="/explore">
                  <Button variant="primary" size="sm">
                    Find Company →
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/explore">
              <Button variant="primary" size="sm">
                Explore
              </Button>
            </Link>
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-sunny shadow-brutal-sm btn-press cursor-pointer"
            >
              <Menu className="h-6 w-6 text-ink stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedCity={selectedCity}
      />
    </>
  );
}
