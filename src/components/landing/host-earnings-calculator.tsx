'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Wallet, ShieldCheck, Zap } from 'lucide-react';
import { formatRupees } from '@/lib/utils';

export function HostEarningsCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(600);

  const monthlyEarnings = hoursPerWeek * hourlyRate * 4;
  const hoursPercent = ((hoursPerWeek - 4) / (25 - 4)) * 100;
  const ratePercent = ((hourlyRate - 400) / (900 - 400)) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border-brutal-lg bg-sunny p-6 sm:p-10 lg:p-12 shadow-brutal-lg relative overflow-hidden">
      {/* Background Watermark Pattern */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-6 font-display font-black text-9xl text-ink/5 select-none"
      >
        ₹ EARN
      </span>

      {/* Left Column: Heading & Value Prop */}
      <div className="lg:col-span-6 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border-brutal-sm bg-white px-3 py-1 font-display text-xs font-black uppercase text-ink shadow-brutal-xs">
          <Sparkles className="h-3.5 w-3.5 text-lavender" />
          <span>Turn Free Evenings Into Cash</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-black text-ink leading-tight">
          Get paid to hang out, <br />
          <span className="bg-lime px-2 py-0.5 border-brutal rounded-xl shadow-brutal-sm inline-block mt-1">
            on your own schedule.
          </span>
        </h2>

        <p className="font-body text-sm sm:text-base text-ink-soft leading-relaxed max-w-lg">
          Meet verified people for gym workouts, indie screenings, or quiet cafe co-working. Set your own hourly rate, choose who you accept, and withdraw earnings instantly to UPI.
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-xs font-black text-ink">
          <span className="inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-white px-2.5 py-1 shadow-brutal-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            100% Platonic & Public
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-white px-2.5 py-1 shadow-brutal-xs">
            <Zap className="h-3.5 w-3.5 text-amber-600" />
            Instant UPI Payouts
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-white px-2.5 py-1 shadow-brutal-xs">
            <Wallet className="h-3.5 w-3.5 text-pink-600" />
            Keep 85% of Meetup Fee
          </span>
        </div>
      </div>

      {/* Right Column: Interactive Earnings Slider Card */}
      <div className="lg:col-span-6">
        <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-6">
          <div className="flex items-baseline justify-between border-b-brutal pb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-ink-muted block">
                Estimated Monthly Earnings
              </span>
              <motion.div
                key={monthlyEarnings}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="font-display text-4xl sm:text-5xl font-black text-ink mt-0.5"
              >
                {formatRupees(monthlyEarnings)}
                <span className="text-base font-bold text-ink-muted"> / month</span>
              </motion.div>
            </div>

            <span className="rounded-lg border-brutal-sm bg-lime px-2.5 py-1 text-xs font-black uppercase text-ink shadow-brutal-xs">
              ~{hoursPerWeek} hrs/wk
            </span>
          </div>

          {/* Interactive Range Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-black text-ink mb-1.5">
                <span>Hours per week you can hang out:</span>
                <span className="text-sm font-black text-lavender">{hoursPerWeek} hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                step="1"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #141414 0%, #141414 ${hoursPercent}%, #F6EFE3 ${hoursPercent}%, #F6EFE3 100%)`,
                }}
                className="slider-brutal w-full h-3 rounded-lg appearance-none cursor-pointer"
                aria-label="Hours per week you can hang out"
              />
              <div className="flex justify-between text-[10px] font-bold text-ink-muted mt-1">
                <span>4 hrs (Part-time)</span>
                <span>15 hrs (Moderate)</span>
                <span>25 hrs (Super active)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-black text-ink mb-1.5">
                <span>Your hourly meetup rate:</span>
                <span className="text-sm font-black text-emerald-600">₹{hourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="400"
                max="900"
                step="50"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #141414 0%, #141414 ${ratePercent}%, #F6EFE3 ${ratePercent}%, #F6EFE3 100%)`,
                }}
                className="slider-brutal w-full h-3 rounded-lg appearance-none cursor-pointer"
                aria-label="Your hourly meetup rate"
              />
              <div className="flex justify-between text-[10px] font-bold text-ink-muted mt-1">
                <span>₹400/hr (Beginner)</span>
                <span>₹600/hr (Average)</span>
                <span>₹900/hr (Top-rated)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/become-a-companion"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-brutal bg-lime px-6 py-3.5 font-display text-sm font-black text-ink shadow-brutal hover:bg-sunny hover:shadow-brutal-lg active:scale-95 transition-all cursor-pointer text-center"
            >
              <span>Apply to Become a Host</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-xl border-brutal bg-paper px-4 py-3.5 font-display text-xs font-black text-ink hover:bg-paper-deep transition-colors cursor-pointer"
            >
              <span>Learn Payout Rules</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
