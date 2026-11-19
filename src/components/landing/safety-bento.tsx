'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  MapPin,
  AlertTriangle,
  Users,
  Check,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { StatusPulse } from '@/components/ui/status-pulse';
import { InteractiveCodeDemo } from '@/components/landing/interactive-code-demo';

export function SafetyBento() {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* =========================================================================
          TIER 1: 3 CORE INTERACTIVE SECURITY PILLARS (BALANCED & COMPACT)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {/* Card 1: ID + Live Selfie Checked */}
        <div className="flex flex-col justify-between rounded-2xl border-brutal bg-white p-4 sm:p-5 shadow-brutal transition-all hover:shadow-brutal-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-lime text-ink shadow-brutal-xs">
                <ShieldCheck className="h-5 w-5 stroke-[2.25]" />
              </span>
              <span className="rounded-full border-brutal-sm bg-lime-soft px-2 py-0.5 font-display text-[10px] font-black uppercase text-ink">
                100% Verified
              </span>
            </div>

            <h3 className="font-display text-lg font-black text-ink leading-tight">
              ID + Live Selfie Checked
            </h3>
            <p className="font-body text-xs text-ink-soft mt-1 leading-relaxed">
              Every host submits government ID (Aadhaar/Passport) and a live facial video selfie. No anonymous accounts, no catfish.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border-brutal-sm bg-paper p-2 text-xs font-bold text-ink">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px]">Zero anonymous profiles, 100% verified.</span>
          </div>
        </div>

        {/* Card 2: Secret 4-Digit Code Handshake (Interactive Demo) */}
        <InteractiveCodeDemo className="h-full" />

        {/* Card 3: Escrow Payment Vault */}
        <div className="flex flex-col justify-between rounded-2xl border-brutal bg-white p-4 sm:p-5 shadow-brutal transition-all hover:shadow-brutal-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-sunny text-ink shadow-brutal-xs">
                <Lock className="h-5 w-5 stroke-[2.25]" />
              </span>
              <span className="rounded-full border-brutal-sm bg-sunny-soft px-2 py-0.5 font-display text-[10px] font-black uppercase text-ink">
                Razorpay Escrow
              </span>
            </div>

            <h3 className="font-display text-lg font-black text-ink leading-tight">
              Escrow Payment Vault
            </h3>
            <p className="font-body text-xs text-ink-soft mt-1 leading-relaxed">
              Companions are never paid upfront. Funds sit safely in an automated escrow vault until meetup completion is verified.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border-brutal-sm bg-paper p-2 text-xs font-bold text-ink">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px]">Instant 100% refund if companion cancels.</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: 3 SAFETY GUARDRAILS (COMPACT & LOW-PROFILE)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {/* Card 4: Public Places Only */}
        <div className="flex items-start gap-3 rounded-2xl border-brutal bg-paper p-3.5 sm:p-4 shadow-brutal-sm transition-all hover:shadow-brutal">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-brutal-sm bg-sky text-ink shadow-brutal-xs">
            <MapPin className="h-4.5 w-4.5 stroke-[2.25]" />
          </span>
          <div className="space-y-0.5">
            <h4 className="font-display text-sm font-black text-ink">Public Places Only</h4>
            <p className="font-body text-[11px] text-ink-soft leading-relaxed">
              Strictly cafes, malls, gyms & parks. Private homes trigger instant permanent bans.
            </p>
          </div>
        </div>

        {/* Card 5: 1-Tap Live SOS Beacon */}
        <div className="flex items-start gap-3 rounded-2xl border-brutal bg-paper p-3.5 sm:p-4 shadow-brutal-sm transition-all hover:shadow-brutal">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-brutal-sm bg-danger text-white shadow-brutal-xs">
            <AlertTriangle className="h-4.5 w-4.5 stroke-[2.25]" />
          </span>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h4 className="font-display text-sm font-black text-ink">1-Tap Live SOS Beacon</h4>
              <StatusPulse size="xs" status="busy" />
            </div>
            <p className="font-body text-[11px] text-ink-soft leading-relaxed">
              Floating button on screen during active meetups with GPS tracking & 112 police escalation.
            </p>
          </div>
        </div>

        {/* Card 6: Strictly Platonic Community */}
        <div className="flex items-start gap-3 rounded-2xl border-brutal bg-paper p-3.5 sm:p-4 shadow-brutal-sm transition-all hover:shadow-brutal">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-brutal-sm bg-mint text-ink shadow-brutal-xs">
            <Users className="h-4.5 w-4.5 stroke-[2.25]" />
          </span>
          <div className="space-y-0.5">
            <h4 className="font-display text-sm font-black text-ink">Strictly Platonic Only</h4>
            <p className="font-body text-[11px] text-ink-soft leading-relaxed">
              Zero romance, zero escorting. Safe, comfortable spaces for introverts and women.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 3: UNIFIED SAFETY ARCHITECTURE STRIP (CLEAN & MINIMAL)
         ========================================================================= */}
      <div className="rounded-xl border-brutal-sm bg-paper-deep px-4 py-3 shadow-brutal-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-ink shrink-0" />
          <span className="font-display font-black text-ink">
            Companio Safety Architecture: Engineered for zero awkwardness & 100% peace of mind.
          </span>
        </div>

        <Link
          href="/safety"
          className="inline-flex items-center gap-1 font-display text-xs font-black text-ink hover:text-lavender transition-colors shrink-0 cursor-pointer"
        >
          <span>Read Full Safety Guidelines</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
