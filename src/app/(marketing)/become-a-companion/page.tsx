'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Wallet,
  Lock,
  ChevronDown,
  Radio,
  Check,
  CheckCircle2,
  Coins,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { HOST_REGISTRATION_FEE, HOST_PACK_OPTIONS } from '@/lib/data';
import { HostEarningsCalculator } from '@/components/landing/host-earnings-calculator';

export default function BecomeACompanionPage() {
  const { isAuthenticated, activeRole, hostProfile } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const destinationHref = !isAuthenticated
    ? '/become-a-host/apply'
    : activeRole === 'host' && hostProfile?.verificationStatus === 'approved'
    ? '/companion/dashboard'
    : '/become-a-host/apply';

  const buttonText =
    isAuthenticated && activeRole === 'host' && hostProfile?.verificationStatus === 'approved'
      ? 'Go to Host Dashboard ->'
      : 'Apply to Become a Host ->';

  const faqs = [
    {
      q: 'Who can become a host?',
      a: 'Anyone aged 18+ who is friendly, reliable, and excited to share public activities like coffee chats, gym workouts, or city walks. You simply verify your Indian mobile number via live SMS OTP, set your public profile photo, and complete the one-time INR 113 registration. Zero Aadhaar or government ID uploads required.',
    },
    {
      q: 'How does the 70-30 payout split work?',
      a: 'With our unified INR 113 Verified Host Registration, every Host receives the exact same transparent 70-30 split: you take home 70% of your meetup fee directly into your Host Earnings Wallet upon session completion, while 30% covers statutory GST, Razorpay processing charges, 24/7 SOS & escrow infrastructure, and platform revenue.',
    },
    {
      q: 'Why is there a INR 113 Host Registration fee?',
      a: 'We charge a single transparent INR 113 total onboarding fee (INR 99.50 host registration charges + INR 13.50 all due taxes & gateway processing) to keep the directory spam-free, activate your Verified Host listing for a full year, and credit +100 Bonus Chat Coins.',
    },
    {
      q: 'How and when do I get paid?',
      a: 'When you meet your member at the public venue, enter their secret 4-digit start PIN to begin the clock. As soon as the meetup completes, 70% of the meetup fee is credited to your Host Wallet, ready for UPI withdrawal.',
    },
    {
      q: 'What is the Strictly Platonic policy?',
      a: 'Every session must take place in approved public venues (cafes, malls, parks, gyms). Private homes and hotel rooms are strictly prohibited. Any romantic or off-platform payment solicitations lead to an immediate permanent ban.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Hero */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="sunny" size="md">
              Host Community &middot; Fixed 70% Payout
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink leading-tight">
              Good company is a skill. <br />
              <span className="bg-[#D4F7A5] px-3 py-0.5 border-brutal rounded-xl shadow-brutal inline-block mt-1">
                Keep 70% every meetup.
              </span>
            </h1>

            <p className="font-body text-base sm:text-lg text-ink-soft leading-relaxed">
              Show people around your city, accompany them to gym sessions, concerts, or cafe chats. Set your hourly rate (INR 399 - 1,299), enjoy a fixed 70-30 transparent split across every Host Pack, and withdraw directly to UPI.
            </p>

            <div className="pt-2 flex justify-center">
              <Link href={destinationHref}>
                <Button variant="primary" size="lg">
                  <span>{buttonText}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* 3-Step Clean Process (No Aadhaar) */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <Badge variant="lime" size="sm">
                3-Step Onboarding
              </Badge>
              <h2 className="font-display text-3xl font-black text-ink">
                How becoming a host works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-sunny text-ink font-display text-lg font-black shadow-brutal-sm">
                  1
                </div>
                <h3 className="font-display text-lg font-black text-ink">Verify mobile via OTP</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Verify your 10-digit Indian mobile number once via live SMS OTP. One verified account powers both Member and Host modes cleanly.
                </p>
              </div>

              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-[#D4F7A5] text-ink font-display text-lg font-black shadow-brutal-sm">
                  2
                </div>
                <h3 className="font-display text-lg font-black text-ink">Create persona &amp; rate</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Upload a clear headshot photo, pick your activities, spoken languages, availability, and set your hourly rate (INR 399 - 1,299). Zero Aadhaar required.
                </p>
              </div>

              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-pink text-ink font-display text-lg font-black shadow-brutal-sm">
                  3
                </div>
                <h3 className="font-display text-lg font-black text-ink">Complete INR 113 registration &amp; earn 70%</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Pay one-time INR 99.50 + INR 13.50 due taxes (INR 113 total), pledge 100% platonic public-venue meetups, and take home 70% of every completed booking to UPI.
                </p>
              </div>
            </div>
          </div>

          {/* Transparent INR 113 Host Registration Card */}
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <Badge variant="lavender" size="sm">
                Host Registration &middot; 70% Payout Fixed
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-ink">
                One Simple Host Registration
              </h2>
              <p className="font-body text-sm text-ink-soft">
                Flat <strong>INR {HOST_REGISTRATION_FEE.basePrice.toFixed(2)}</strong> registration charge +{' '}
                <strong>INR {HOST_REGISTRATION_FEE.taxesAndCharges.toFixed(2)}</strong> due taxes &amp; gateway fees ={' '}
                <strong>INR {HOST_REGISTRATION_FEE.totalPrice} total</strong>. You take home a fixed{' '}
                <strong>70% Host Payout</strong> on every meetup.
              </p>
            </div>

            <div className="mx-auto max-w-2xl">
              {HOST_PACK_OPTIONS.map((pack) => (
                <div
                  key={pack.tier}
                  className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-8 shadow-brutal flex flex-col justify-between space-y-6 text-ink"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-lg border-2 border-ink bg-sunny px-3 py-0.5 text-[11px] font-black uppercase text-ink">
                        Verified Host Plan
                      </span>
                      <span className="rounded-lg border-2 border-ink bg-[#D4F7A5] px-3 py-0.5 text-[11px] font-black uppercase text-ink">
                        70% Host Payout Fixed
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink/10 pb-4">
                      <div>
                        <h3 className="font-display text-2xl font-black">{pack.name}</h3>
                        <p className="mt-1 text-xs font-medium text-ink-soft">
                          {pack.tagline}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="font-display text-4xl font-black text-ink">
                          INR {HOST_REGISTRATION_FEE.totalPrice}
                        </span>
                        <span className="block text-[11px] font-bold text-ink-muted">
                          All Taxes Included
                        </span>
                      </div>
                    </div>

                    {/* Transparent INR 99.50 + 13.50 = 113 Breakdown */}
                    <div className="rounded-2xl border-2 border-ink bg-paper p-4 space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-ink-soft">
                        <span>Host Registration Charges</span>
                        <span className="font-mono text-ink">INR {HOST_REGISTRATION_FEE.basePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-ink-soft">
                        <span>All Due Taxes &amp; Gateway Processing</span>
                        <span className="font-mono text-ink">INR {HOST_REGISTRATION_FEE.taxesAndCharges.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-ink/20 pt-1.5 flex justify-between font-display text-sm font-black text-ink">
                        <span>Total Payable Today</span>
                        <span className="font-mono">INR {HOST_REGISTRATION_FEE.totalPrice}.00</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 pt-1 text-xs font-bold">
                      {pack.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={destinationHref} className="block">
                    <button
                      type="button"
                      className="w-full rounded-2xl border-2 border-ink bg-ink text-white py-3.5 px-6 font-display text-sm font-black uppercase tracking-wider shadow-brutal-sm hover:bg-black transition cursor-pointer"
                    >
                      {isAuthenticated
                        ? 'Apply with Your Verified Number (INR 113 Total) ->'
                        : 'Verify Mobile Once & Become a Host (INR 113 Total) ->'}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic 70-30 Earnings Calculator */}
          <HostEarningsCalculator />

          {/* Safety & Escrow Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border-brutal bg-white shadow-brutal space-y-2">
              <div className="flex items-center gap-2 font-display text-sm font-black text-ink">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>OTP-Verified 18+ Members Only</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                No anonymous users can request meetups or message you. Phone numbers stay masked across the platform.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-brutal bg-white shadow-brutal space-y-2">
              <div className="flex items-center gap-2 font-display text-sm font-black text-ink">
                <Lock className="w-5 h-5 text-pink-700" />
                <span>Public Places Only</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Strictly platonic meetups in cafes, malls, parks, and cultural spaces. Zero tolerance for private venue requests.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-brutal bg-white shadow-brutal space-y-2">
              <div className="flex items-center gap-2 font-display text-sm font-black text-ink">
                <Radio className="w-5 h-5 text-danger" />
                <span>SOS &amp; 4-Digit Start Code</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Live GPS SOS telemetry and in-person 4-digit code verification protect every single scheduled session.
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-10 shadow-brutal space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="sunny" size="sm">
                Got Questions?
              </Badge>
              <h2 className="font-display text-3xl font-black text-ink">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y-brutal-sm">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="py-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left font-display text-base font-black text-ink hover:text-lavender transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-ink' : 'text-ink-muted'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="font-body text-xs sm:text-sm text-ink-soft leading-relaxed mt-2.5 animate-in fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="rounded-3xl border-brutal bg-[#FFE2EC] p-8 sm:p-12 shadow-brutal text-center space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-ink">
              Ready to earn 70% per meetup in your city?
            </h2>
            <p className="text-sm font-medium text-ink-soft max-w-lg mx-auto">
              Verify your mobile number, create your persona in under 3 minutes, and choose your Host Pack.
            </p>
            <div className="pt-2">
              <Link href={destinationHref}>
                <Button variant="primary" size="lg">
                  <span>{buttonText}</span>
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
