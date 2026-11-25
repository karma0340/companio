'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Wallet, ShieldCheck, Zap, Check } from 'lucide-react';
import { formatRupees } from '@/lib/utils';
import { HOST_PACK_OPTIONS } from '@/lib/data';
import { HostPackTier } from '@/types';

export function HostEarningsCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(599);
  const [selectedPack, setSelectedPack] = useState<HostPackTier>('PRO');

  const grossMonthly = hoursPerWeek * hourlyRate * 4;
  const hostTakeHomeMonthly = Math.round(grossMonthly * 0.70);
  const platformShareMonthly = Math.round(grossMonthly * 0.30);
  const hostTakeHomePerHour = Math.round(hourlyRate * 0.70);

  const activePack = HOST_PACK_OPTIONS.find((p) => p.tier === selectedPack) || HOST_PACK_OPTIONS[1];
  const breakEvenHours = Math.max(1, Math.ceil(activePack.price / Math.max(1, hostTakeHomePerHour)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border-brutal-lg bg-sunny p-6 sm:p-10 lg:p-12 shadow-brutal-lg relative overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-6 font-display font-black text-8xl sm:text-9xl text-ink/5 select-none"
      >
        70 / 30
      </span>

      {/* Left Column: Value Prop & Host Pack Highlights */}
      <div className="lg:col-span-6 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border-brutal-sm bg-white px-3 py-1 font-display text-xs font-black uppercase text-ink shadow-brutal-xs">
          <Sparkles className="h-3.5 w-3.5 text-lavender" />
          <span>Fixed 70% Host Payout &middot; Zero Surprises</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-black text-ink leading-tight">
          Keep 70% of every meetup, <br />
          <span className="bg-lime px-2 py-0.5 border-brutal rounded-xl shadow-brutal-sm inline-block mt-1">
            paid directly to UPI.
          </span>
        </h2>

        <p className="font-body text-sm sm:text-base text-ink-soft leading-relaxed max-w-lg">
          Across every Host Package (Starter, Pro &amp; Elite), you keep a guaranteed <strong>70% fixed share</strong> on every completed meetup. The remaining 30% covers statutory taxes (GST), Razorpay fees, 24/7 SOS &amp; escrow safety, and platform operations.
        </p>

        {/* Pack Selector Pills */}
        <div className="space-y-2 pt-1">
          <span className="block text-[11px] font-black uppercase tracking-wider text-ink">
            Select Host Package to Preview:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {HOST_PACK_OPTIONS.map((pack) => {
              const isSelected = selectedPack === pack.tier;
              return (
                <button
                  key={pack.tier}
                  type="button"
                  onClick={() => setSelectedPack(pack.tier)}
                  className={`rounded-xl border-2 border-ink p-2.5 text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-ink text-white shadow-brutal-sm'
                      : 'bg-white text-ink hover:bg-paper'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase opacity-80">
                    {pack.durationLabel}
                  </div>
                  <div className="font-display text-sm font-black">
                    INR {pack.price}
                  </div>
                  <div className="text-[10px] font-bold text-lime">
                    70% Share
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-1 flex flex-wrap gap-2 text-xs font-black text-ink">
          <span className="inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-white px-2.5 py-1 shadow-brutal-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            100% Platonic &amp; Public
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-white px-2.5 py-1 shadow-brutal-xs">
            <Zap className="h-3.5 w-3.5 text-amber-600" />
            Direct UPI Cashouts
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-white px-2.5 py-1 shadow-brutal-xs">
            <Wallet className="h-3.5 w-3.5 text-pink-600" />
            70-30 Transparent Split
          </span>
        </div>
      </div>

      {/* Right Column: Interactive Earnings Slider Card */}
      <div className="lg:col-span-6">
        <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-brutal pb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted block">
                Your 70% Net Monthly Take-Home
              </span>
              <motion.div
                key={hostTakeHomeMonthly}
                initial={{ scale: 0.92, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="font-display text-4xl sm:text-5xl font-black text-ink mt-0.5"
              >
                {formatRupees(hostTakeHomeMonthly)}
                <span className="text-base font-bold text-ink-muted"> / mo</span>
              </motion.div>
            </div>

            <span className="rounded-lg border-brutal-sm bg-lime px-2.5 py-1 text-xs font-black uppercase text-ink shadow-brutal-xs">
              {formatRupees(hostTakeHomePerHour)}/hr net
            </span>
          </div>

          {/* Interactive Range Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-black text-ink mb-1.5">
                <span>Hourly Rate You Set:</span>
                <span className="text-sm font-black text-lavender">{formatRupees(hourlyRate)} /hr</span>
              </div>
              <input
                type="range"
                min="399"
                max="1299"
                step="50"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2.5 rounded-lg border border-ink cursor-pointer accent-ink bg-paper-deep"
              />
              <div className="flex justify-between text-[10px] font-bold text-ink-muted mt-1">
                <span>INR 399</span>
                <span>INR 849</span>
                <span>INR 1,299</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-black text-ink mb-1.5">
                <span>Hours Hosted Per Week:</span>
                <span className="text-sm font-black text-lavender">{hoursPerWeek} hours / wk</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full h-2.5 rounded-lg border border-ink cursor-pointer accent-ink bg-paper-deep"
              />
              <div className="flex justify-between text-[10px] font-bold text-ink-muted mt-1">
                <span>2 hrs</span>
                <span>15 hrs</span>
                <span>30 hrs</span>
              </div>
            </div>
          </div>

          {/* Transparent 70/30 Split Box */}
          <div className="rounded-xl border-2 border-ink bg-paper p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between font-bold text-ink-soft">
              <span>Gross Monthly Bookings ({hoursPerWeek * 4} hrs)</span>
              <span className="font-mono text-ink">{formatRupees(grossMonthly)}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-800">
              <span>Your Guaranteed Host Share (70%)</span>
              <span className="font-mono font-black">+ {formatRupees(hostTakeHomeMonthly)}</span>
            </div>
            <div className="flex justify-between font-medium text-ink-muted">
              <span>Taxes, Razorpay Fees, Safety &amp; Platform (30%)</span>
              <span className="font-mono">{formatRupees(platformShareMonthly)}</span>
            </div>
            <div className="pt-1.5 border-t border-ink/15 flex items-center gap-1.5 text-[11px] font-black text-ink">
              <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span>
                {activePack.name} (INR {activePack.price}) pays for itself in ~{breakEvenHours} hr{breakEvenHours > 1 ? 's' : ''} of hosting!
              </span>
            </div>
          </div>

          <Link href={`/become-a-companion/apply?pack=${selectedPack}`} className="block">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-brutal bg-ink text-white py-3.5 px-6 font-display text-sm font-black shadow-brutal hover:bg-black transition btn-press cursor-pointer"
            >
              <span>Apply With {activePack.name} (INR {activePack.price})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
