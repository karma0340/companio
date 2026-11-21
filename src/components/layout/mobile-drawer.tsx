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

        {/* Compact Location Chip */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-ink/40 bg-white px-3 py-2 shadow-brutal-xs">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-ink" />
            <span className="text-[11px] font-bold text-ink-muted uppercase">City:</span>
            <span className="font-display text-xs font-black capitalize text-ink">{selectedCity}</span>
          </div>
          <Link href="/explore" onClick={onClose} className="text-[11px] font-black text-ink underline">
            Change
          </Link>
        </div>

        {/* Primary Explore Action Button */}
        <Link
          href="/explore"
          onClick={onClose}
          className="mt-3.5 flex items-center justify-between rounded-xl border-brutal bg-sunny p-3 shadow-brutal-sm btn-press text-ink font-display text-sm font-black"
        >
          <span>Explore Companions</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Grouped Minimal Navigation Card */}
        <div className="mt-3 rounded-2xl border-brutal bg-white overflow-hidden shadow-brutal-sm divide-y-2 divide-ink/10 font-display text-xs font-extrabold text-ink">
          {isAuthenticated && (
            <>
              <Link
                href="/bookings"
                onClick={onClose}
                className="flex items-center justify-between p-3 hover:bg-paper-deep transition"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-lavender" />
                  <span>My Meetups</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-ink/40" />
              </Link>

              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center justify-between p-3 hover:bg-paper-deep transition"
              >
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-ink" />
                  <span>Profile &amp; Settings</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-ink/40" />
              </Link>
            </>
          )}

          {/* Host Portal / Become a Host */}
          {activeRole === 'host' ? (
            <Link
              href="/companion/dashboard"
              onClick={onClose}
              className="flex items-center justify-between p-3 hover:bg-paper-deep transition bg-lime/20"
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-4 w-4 text-ink" />
                <span>Host Dashboard</span>
              </div>
              <Badge variant="lime" size="sm">Active</Badge>
            </Link>
          ) : (
            <Link
              href={isAuthenticated ? "/become-a-companion" : "/login?intent=host"}
              onClick={onClose}
              className="flex items-center justify-between p-3 hover:bg-paper-deep transition"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-sunny" />
                <span>Become a Host</span>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-300 rounded">
                Keep up to 95%
              </span>
            </Link>
          )}

          {/* Safety & Guidelines */}
          <Link
            href="/safety"
            onClick={onClose}
            className="flex items-center justify-between p-3 hover:bg-paper-deep transition"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-pink-dark" />
              <span>Safety &amp; Community Rules</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-ink/40" />
          </Link>

          <Link
            href="/how-it-works"
            onClick={onClose}
            className="flex items-center justify-between p-3 hover:bg-paper-deep transition"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-ink" />
              <span>How It Works</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-ink/40" />
          </Link>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 space-y-2.5 pt-3 border-t-brutal">
        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              onClose();
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
