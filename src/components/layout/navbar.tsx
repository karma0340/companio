'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

  const { isAuthenticated, user, memberProfile, hostProfile, activeRole, logout, switchRole } =
    useAuth();

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

  if (isApplyingHost) {
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
            100% Platonic Only · Government ID Verified · Escrow Protected · 18+
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
                href={isAuthenticated ? "/become-a-companion" : "/login?intent=host"}
                className="font-display text-xs font-black text-ink hover:text-lavender transition-colors py-1 px-2 rounded-lg hover:bg-paper-deep"
              >
                Become a Host
              </Link>
            )}

            {/* Dynamic Authentication Area */}
            {isAuthenticated ? (
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

                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border-brutal bg-white px-2.5 py-1.5 shadow-brutal-sm hover:bg-paper-deep btn-press cursor-pointer"
                  >
                  <AvatarVector
                    gender={memberProfile?.gender || 'female'}
                    size="sm"
                    bgVariant={memberProfile?.gender === 'male' ? 'sky' : 'pink'}
                  />
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
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border-brutal bg-white p-2.5 shadow-brutal-lg z-50 space-y-1 animate-in fade-in">
                    {/* Header Details */}
                    <div className="border-b-brutal-sm p-2 pb-2.5">
                      <p className="font-display text-xs font-black text-ink">{resolvedName}</p>
                      <p className="text-[11px] font-mono text-ink-muted">
                        {formatPhoneNumber(user?.phone)}
                      </p>
                      <div className="mt-1">
                        <Badge variant={badgeVariant} size="sm">
                          {badgeLabel}
                        </Badge>
                      </div>
                    </div>

                    {/* Quick Wallet Link */}
                    <Link
                      href="/wallet"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-paper-deep transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-emerald-600" />
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
                      className="flex items-center gap-2 rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-paper-deep transition-colors"
                    >
                      <Calendar className="h-4 w-4 text-lavender" />
                      <span>My Meetups</span>
                    </Link>

                    {/* Member Profile Link */}
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-paper-deep transition-colors"
                    >
                      <User className="h-4 w-4 text-ink" />
                      <span>My Profile</span>
                    </Link>

                    {/* Host Links if applicable */}
                    {hostProfile && hostProfile.verificationStatus === 'approved' ? (
                      <>
                        <Link
                          href="/companion/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-paper-deep transition-colors"
                        >
                          <KeyRound className="h-4 w-4 text-emerald-600" />
                          <span>Host Dashboard</span>
                        </Link>

                        <button
                          onClick={() => {
                            switchRole(activeRole === 'host' ? 'member' : 'host');
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-display text-xs font-bold text-ink hover:bg-paper-deep transition-colors"
                        >
                          <ArrowRightLeft className="h-4 w-4 text-sunny" />
                          <span>Switch to {activeRole === 'host' ? 'Member' : 'Host'} View</span>
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/become-a-companion"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl p-2 font-display text-xs font-bold text-ink hover:bg-paper-deep transition-colors"
                      >
                        <Sparkles className="h-4 w-4 text-sunny" />
                        <span>Apply to Become a Host</span>
                      </Link>
                    )}

                    {/* Logout */}
                    <div className="border-t-brutal-sm pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-display text-xs font-bold text-danger hover:bg-danger-soft transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
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
