'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Lock,
  Heart,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRupees } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export default function BecomeACompanionPage() {
  const { isAuthenticated, activeRole, hostProfile } = useAuth();
  const [hourlyRate, setHourlyRate] = useState<number>(550);
  const [weeklyHours, setWeeklyHours] = useState<number>(10);

  const monthlyEarnings = hourlyRate * weeklyHours * 4;

  const destinationHref = !isAuthenticated
    ? '/login?next=/companion/kyc'
    : activeRole === 'host' && hostProfile?.verificationStatus === 'approved'
    ? '/companion/dashboard'
    : '/companion/kyc';

  const buttonText =
    isAuthenticated && activeRole === 'host' && hostProfile?.verificationStatus === 'approved'
      ? 'Go to Host Dashboard →'
      : 'Start Host Application →';

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Hero */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="sunny" size="md">
              Host Community
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink leading-tight">
              Good company is a skill. <br />
              <span className="bg-lime px-3 py-0.5 border-brutal rounded-xl shadow-brutal inline-block mt-1">
                Get paid for it.
              </span>
            </h1>

            <p className="font-body text-base sm:text-lg text-ink-soft leading-relaxed">
              Show people around your city, accompany them to gym sessions, movies, or cafe chats. Set your own rate, control your hours, and withdraw earnings directly to UPI.
            </p>

            <div className="pt-2 flex justify-center">
              <Link href={destinationHref}>
                <Button variant="primary" size="lg">
                  <span>{buttonText}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Earnings Calculator */}
          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-12 shadow-brutal-lg space-y-8">
            <div className="text-center space-y-2">
              <Badge variant="lime" size="sm">
                Earnings Potential
              </Badge>
              <h2 className="font-display text-3xl font-black text-ink">
                Calculate your monthly income
              </h2>
              <p className="font-body text-sm text-ink-soft">
                Adjust your desired rate and available hours to see what you could make.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
              {/* Sliders */}
              <div className="space-y-6">
                {/* Rate Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-display text-sm font-extrabold text-ink">
                    <span>Hourly Rate:</span>
                    <span className="text-base text-lavender font-black">
                      {formatRupees(hourlyRate)} /hr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="1000"
                    step="50"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value, 10))}
                    className="w-full accent-ink cursor-pointer h-2 bg-paper-deep rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-ink-muted">
                    <span>₹400 /hr</span>
                    <span>₹1,000 /hr</span>
                  </div>
                </div>

                {/* Hours Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-display text-sm font-extrabold text-ink">
                    <span>Hours per Week:</span>
                    <span className="text-base text-lavender font-black">
                      {weeklyHours} Hours / week
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
                    className="w-full accent-ink cursor-pointer h-2 bg-paper-deep rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-ink-muted">
                    <span>2 hrs</span>
                    <span>30 hrs</span>
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="rounded-2xl border-brutal bg-sunny p-6 sm:p-8 shadow-brutal text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-ink">
                  Estimated Monthly Earnings
                </span>
                <div className="font-display text-4xl sm:text-5xl font-black text-ink">
                  {formatRupees(monthlyEarnings)}
                </div>
                <p className="text-xs font-bold text-ink-soft">
                  Transferred directly to your bank account via UPI.
                </p>
              </div>
            </div>
          </div>

          {/* How Becoming a Host Works */}
          <div className="space-y-8">
            <div className="border-b-brutal pb-4">
              <h2 className="font-display text-3xl font-black text-ink">
                From Application to First Payout
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-sunny text-ink font-display text-lg font-black shadow-brutal-sm">
                  1
                </div>
                <h3 className="font-display text-lg font-black text-ink">Create Profile</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Tell us your bio, favorite activities, languages spoken, and preferred city areas.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-lime text-ink font-display text-lg font-black shadow-brutal-sm">
                  2
                </div>
                <h3 className="font-display text-lg font-black text-ink">Verify Identity</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Upload government ID (Aadhaar/Passport) and take a quick live selfie for face matching.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-pink text-ink font-display text-lg font-black shadow-brutal-sm">
                  3
                </div>
                <h3 className="font-display text-lg font-black text-ink">Set Schedule</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Toggle the exact days and hours you are free. Accept only the requests that suit you.
                </p>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-lavender text-white font-display text-lg font-black shadow-brutal-sm">
                  4
                </div>
                <h3 className="font-display text-lg font-black text-ink">Meet & Earn</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Meet safely in public, enter the 4-digit code, and withdraw escrow earnings instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Host Protection & Women Safety */}
          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-10 shadow-brutal space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
              Built for Host Safety First
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body text-sm text-ink-soft">
              <div className="rounded-xl border-brutal-sm bg-paper p-4 space-y-1.5">
                <span className="flex items-center gap-1.5 text-ink font-display text-sm font-black">
                  <ShieldCheck className="h-4 w-4 text-pink-700 stroke-[2.25]" />
                  <span>Women-Only Toggle</span>
                </span>
                <p className="text-xs">
                  Female hosts can restrict bookings exclusively to verified female members.
                </p>
              </div>

              <div className="rounded-xl border-brutal-sm bg-paper p-4 space-y-1.5">
                <span className="flex items-center gap-1.5 text-ink font-display text-sm font-black">
                  <ShieldAlert className="h-4 w-4 text-danger stroke-[2.25]" />
                  <span>Zero Tolerance for Misconduct</span>
                </span>
                <p className="text-xs">
                  Any inappropriate comment, advance, or rule violation results in an immediate permanent ban.
                </p>
              </div>

              <div className="rounded-xl border-brutal-sm bg-paper p-4 space-y-1.5">
                <span className="flex items-center gap-1.5 text-ink font-display text-sm font-black">
                  <Wallet className="h-4 w-4 text-emerald-700 stroke-[2.25]" />
                  <span>Guaranteed Escrow Payouts</span>
                </span>
                <p className="text-xs">
                  No haggling or cash chasing. Member payments are locked in escrow before you show up.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t-brutal-sm flex justify-center">
              <Link href="/login?next=/companion/kyc">
                <Button variant="primary" size="lg">
                  <span>Submit Your Host Application Now →</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
