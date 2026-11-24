'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  Sparkles,
  MapPin,
  ArrowRight,
  Calendar,
  KeyRound,
  LogOut,
  User,
  Coins,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/context/auth-context';
import { AvatarVector } from '@/components/ui/avatar-vector';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
}

export function MobileDrawer({ isOpen, onClose, selectedCity }: MobileDrawerProps) {
  const { isAuthenticated, user, memberProfile, hostProfile, activeRole, logout } = useAuth();

  if (!isOpen) return null;

  const formatMobileDisplay = (ph?: string | null) => {
    if (!ph) return '';
    const digits = ph.replace(/\D/g, '');
    if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    if (digits.length === 12 && digits.startsWith('91')) {
      const nat = digits.slice(2);
      return `+91 ${nat.slice(0, 5)} ${nat.slice(5)}`;
    }
    return ph;
  };

  const isAnonymousName = !user?.name || user.name.toLowerCase() === 'member';
  const displayName =
    activeRole === 'host'
      ? hostProfile?.displayName || user?.name || 'Host'
      : memberProfile?.fullName || (!isAnonymousName ? user?.name : (user?.phone ? formatMobileDisplay(user.phone) : 'Member'));

  const roleLabel =
    activeRole === 'host'
      ? 'Host'
      : !hostProfile && isAnonymousName
      ? 'New User'
      : 'Member';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-paper p-5 sm:p-6 overflow-y-auto pb-10 animate-in fade-in duration-200">
      <div>
        {/* Header with Close Button */}
        <div className="flex items-center justify-between pb-3.5 border-b-brutal">
          <div className="flex items-center gap-2" onClick={onClose}>
            <Logo size="sm" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border-brutal bg-pink shadow-brutal-xs btn-press cursor-pointer"
          >
            <X className="h-5 w-5 text-ink stroke-[3]" />
          </button>
        </div>

        {/* User Profile Card with Integrated Wallet Bar */}
        {isAuthenticated ? (
          <div className="mt-4 rounded-2xl border-brutal bg-white p-3.5 shadow-brutal-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AvatarVector
                  gender={memberProfile?.gender || 'female'}
                  size="md"
                  bgVariant={memberProfile?.gender === 'male' ? 'sky' : 'pink'}
                />
                <div>
                  <p className="font-display text-sm font-black text-ink leading-tight">{displayName}</p>
                  <p className="text-[11px] font-mono font-bold text-ink-muted">
                    {formatMobileDisplay(user?.phone)}
                  </p>
                </div>
              </div>
              <Badge variant={activeRole === 'host' ? 'lime' : 'sunny'} size="sm">
                {roleLabel}
              </Badge>
            </div>

            {/* Embedded Wallet Coin Pill */}
            <Link
              href="/wallet"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border-2 border-ink bg-[#D4F7A5] px-3 py-2 text-xs font-black text-ink shadow-brutal-xs hover:bg-[#c6ee91] transition"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-ink" />
                <span>{user?.coinBalance ?? 100} Coins (INR {user?.coinBalance ?? 100})</span>
              </div>
              <span className="text-[10px] uppercase underline tracking-wider font-extrabold">
                Add Coins &rarr;
              </span>
            </Link>
          </div>
        ) : (
          <div className="mt-4 flex gap-2.5">
            <Link href="/login" onClick={onClose} className="w-1/2">
              <Button variant="outline" size="sm" fullWidth>
                Log In
              </Button>
            </Link>
            <Link href="/explore" onClick={onClose} className="w-1/2">
              <Button variant="primary" size="sm" fullWidth>
                Explore &rarr;
              </Button>
            </Link>
          </div>
        )}

        {/* Themed Location Chip */}
        <div className="mt-3 flex items-center justify-between rounded-2xl border-2 border-ink bg-white px-3.5 py-2.5 shadow-brutal-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-sunny text-ink shadow-brutal-xs">
              <MapPin className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-ink-muted leading-tight">Selected City</span>
              <span className="font-display text-xs font-black capitalize text-ink">{selectedCity}</span>
            </div>
          </div>
          <Link href="/explore" onClick={onClose} className="text-xs font-black text-ink underline hover:text-lavender transition-colors">
            Change
          </Link>
        </div>

        {/* Primary Explore Action Button */}
        <Link
          href="/explore"
          onClick={onClose}
          className="mt-3 flex items-center justify-between rounded-2xl border-brutal bg-sunny p-3.5 shadow-brutal-sm btn-press text-ink font-display text-sm font-black"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-white text-ink shadow-brutal-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>Explore Companions</span>
          </div>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </Link>

        {/* Themed Navigation Card */}
        <div className="mt-3 rounded-2xl border-brutal bg-white overflow-hidden shadow-brutal-sm divide-y-2 divide-ink/10 font-display text-xs font-extrabold text-ink">
          {isAuthenticated && (
            <>
              <Link
                href="/bookings"
                onClick={onClose}
                className="flex items-center justify-between p-3 hover:bg-lavender/15 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-[#E8DEFF] text-ink shadow-brutal-xs group-hover:scale-105 transition-transform">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-black text-ink leading-tight">My Meetups</span>
                    <span className="block text-[10px] font-medium text-ink-muted">View upcoming sessions</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-ink/40 group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center justify-between p-3 hover:bg-sky-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-[#BAE6FD] text-ink shadow-brutal-xs group-hover:scale-105 transition-transform">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-black text-ink leading-tight">Profile &amp; Settings</span>
                    <span className="block text-[10px] font-medium text-ink-muted">Edit profile, safety details</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-ink/40 group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
              </Link>
            </>
          )}

          {/* Host Portal / Become a Host */}
          {activeRole === 'host' ? (
            <Link
              href="/companion/dashboard"
              onClick={onClose}
              className="flex items-center justify-between p-3 hover:bg-lime/20 transition-colors bg-lime/10 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-[#D4F7A5] text-ink shadow-brutal-xs group-hover:scale-105 transition-transform">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-black text-ink leading-tight">Host Dashboard</span>
                  <span className="block text-[10px] font-medium text-ink-muted">Manage meetups &amp; payouts</span>
                </div>
              </div>
              <Badge variant="lime" size="sm">Active</Badge>
            </Link>
          ) : (
            <Link
              href={isAuthenticated ? "/become-a-companion" : "/login?intent=host"}
              onClick={onClose}
              className="flex items-center justify-between p-3 hover:bg-sunny/15 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-sunny text-ink shadow-brutal-xs group-hover:scale-105 transition-transform">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="block font-black text-ink leading-tight">Become a Host</span>
                  <span className="block text-[10px] font-medium text-ink-muted">Get paid for meetups &amp; activities</span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-ink bg-[#D4F7A5] px-2 py-0.5 border border-ink rounded-lg shadow-brutal-xs">
                Keep 95%
              </span>
            </Link>
          )}

          {/* Safety & Guidelines */}
          <Link
            href="/safety"
            onClick={onClose}
            className="flex items-center justify-between p-3 hover:bg-pink/15 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-[#FFE2EC] text-ink shadow-brutal-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-4 w-4 text-ink" />
              </div>
              <div>
                <span className="block font-black text-ink leading-tight">Safety &amp; Rules</span>
                <span className="block text-[10px] font-medium text-ink-muted">100% Platonic &amp; Public meetups</span>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-ink/40 group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* How It Works */}
          <Link
            href="/how-it-works"
            onClick={onClose}
            className="flex items-center justify-between p-3 hover:bg-amber-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-[#FEF08A] text-ink shadow-brutal-xs group-hover:scale-105 transition-transform">
                <HelpCircle className="h-4 w-4 text-ink" />
              </div>
              <div>
                <span className="block font-black text-ink leading-tight">How It Works</span>
                <span className="block text-[10px] font-medium text-ink-muted">Booking, escrow &amp; coin guide</span>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-ink/40 group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 space-y-2.5 pt-3 border-t-brutal">
        {isAuthenticated && (
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              onClose();
              await logout();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/40 bg-white p-2.5 font-display text-xs font-black text-danger shadow-brutal-xs hover:bg-danger/10 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        )}

        <div className="text-center text-[11px] font-bold text-ink-muted">
          Need immediate safety help? Call National Helpline <span className="underline font-black text-ink">112</span>
        </div>
      </div>
    </div>
  );
}
