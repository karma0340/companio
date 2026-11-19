'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShieldAlert, Sparkles, MapPin, ArrowRight, Calendar, KeyRound, LogOut, User } from 'lucide-react';
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

  const displayName =
    activeRole === 'host'
      ? hostProfile?.displayName || 'Host'
      : memberProfile?.fullName || 'Member';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-paper p-5 sm:p-6 overflow-y-auto pb-12 animate-in fade-in duration-200">
      <div>
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b-brutal">
          <div className="flex items-center gap-2" onClick={onClose}>
            <Logo size="sm" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-pink shadow-brutal-sm btn-press cursor-pointer"
          >
            <X className="h-6 w-6 text-ink stroke-[3]" />
          </button>
        </div>

        {/* User Card if Authenticated */}
        {isAuthenticated && (
          <Link
            href="/profile"
            onClick={onClose}
            className="mt-4 rounded-2xl border-brutal bg-white p-3.5 shadow-brutal-sm flex items-center justify-between hover:bg-paper-deep transition-all"
          >
            <div className="flex items-center gap-3">
              <AvatarVector
                gender={memberProfile?.gender || 'female'}
                size="md"
                bgVariant={memberProfile?.gender === 'male' ? 'sky' : 'pink'}
              />
              <div>
                <p className="font-display text-sm font-black text-ink">{displayName}</p>
                <p className="text-[11px] font-mono text-ink-muted">+91 {user?.phone}</p>
              </div>
            </div>
            <Badge variant={activeRole === 'host' ? 'lime' : 'sunny'} size="sm">
              {activeRole === 'host' ? 'Host' : 'Member'}
            </Badge>
          </Link>
        )}

        {/* Selected City Pill */}
        <div className="mt-4 flex items-center justify-between rounded-xl border-brutal bg-white p-3 shadow-brutal-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-ink" />
            <span className="text-xs font-extrabold uppercase text-ink-soft">Current City:</span>
            <span className="font-display text-sm font-extrabold capitalize text-ink">{selectedCity}</span>
          </div>
          <Link href="/explore" onClick={onClose} className="text-xs font-bold text-lavender underline">
            Change
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 flex flex-col gap-2.5 font-display text-base font-extrabold">
          <Link
            href="/explore"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border-brutal bg-sunny p-3.5 shadow-brutal-sm btn-press text-ink"
          >
            <span>Explore Companions</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center justify-between rounded-xl border-brutal bg-white p-3.5 shadow-brutal-sm btn-press text-ink"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-ink" />
                  <span>My Profile</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/bookings"
                onClick={onClose}
                className="flex items-center justify-between rounded-xl border-brutal bg-white p-3.5 shadow-brutal-sm btn-press text-ink"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-lavender" />
                  <span>My Meetups</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}

          {isAuthenticated && hostProfile?.verificationStatus === 'approved' && (
            <Link
              href="/companion/dashboard"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border-brutal bg-lime p-3.5 shadow-brutal-sm btn-press text-ink"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-ink" />
                <span>Host Dashboard</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <Link
            href="/how-it-works"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border-brutal bg-white p-3.5 shadow-brutal-sm btn-press text-ink"
          >
            <span>How It Works</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/safety"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border-brutal bg-pink-soft p-3.5 shadow-brutal-sm btn-press text-ink"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-ink" />
              <span>Safety & Trust</span>
            </div>
            <Badge variant="lime" size="sm">Strict</Badge>
          </Link>

          {activeRole === 'host' ? (
            <Link
              href="/companion/dashboard"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border-brutal bg-lime p-3.5 shadow-brutal-sm btn-press text-ink"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ink" />
                <span>Host Portal</span>
              </div>
              <Badge variant="dark" size="sm">Active Host</Badge>
            </Link>
          ) : (
            <Link
              href="/become-a-companion"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border-brutal bg-paper-deep p-3.5 shadow-brutal-sm btn-press text-ink"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ink" />
                <span>Become a Host</span>
              </div>
              <Badge variant="dark" size="sm">Earn ₹600/hr</Badge>
            </Link>
          )}

          <Link
            href="/faq"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border-brutal bg-white p-3.5 shadow-brutal-sm btn-press text-ink"
          >
            <span>FAQs & Rules</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-6 space-y-3 pt-4 border-t-brutal">
        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-brutal bg-white p-3 font-display text-xs font-black text-danger shadow-brutal-sm btn-press"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of Companio</span>
          </button>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" onClick={onClose} className="w-1/2">
              <Button variant="outline" size="md" fullWidth>
                Log In
              </Button>
            </Link>
            <Link href="/explore" onClick={onClose} className="w-1/2">
              <Button variant="primary" size="md" fullWidth>
                Book Now →
              </Button>
            </Link>
          </div>
        )}

        {/* Emergency Alert Callout */}
        <div className="rounded-xl border-brutal-sm bg-danger-soft p-2.5 text-center flex items-center justify-center gap-1.5 text-[11px] font-bold text-danger">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0 stroke-[2.25]" />
          <span>Immediate Emergency in India? Call <span className="underline">112</span> directly.</span>
        </div>
      </div>
    </div>
  );
}
