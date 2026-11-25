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
import { HOST_PACK_OPTIONS } from '@/lib/data';
import { HostEarningsCalculator } from '@/components/landing/host-earnings-calculator';

export default function BecomeACompanionPage() {
  const { isAuthenticated, activeRole, hostProfile } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const destinationHref = !isAuthenticated
    ? '/login?intent=host&next=/become-a-companion/apply'
    : activeRole === 'host' && hostProfile?.verificationStatus === 'approved'
    ? '/companion/dashboard'
    : '/become-a-companion/apply';

  const buttonText =
    isAuthenticated && activeRole === 'host' && hostProfile?.verificationStatus === 'approved'
      ? 'Go to Host Dashboard ->'
      : 'Apply to Become a Host ->';

  const faqs = [
    {
      q: 'Who can become a host?',
      a: 'Anyone aged 18+ who is friendly, reliable, and excited to share public activities like coffee chats, gym workouts, or city walks. You simply verify your Indian mobile number via live SMS OTP, set your public profile photo, and pick a Host Pack. Zero Aadhaar or government ID uploads required.',
    },
    {
      q: 'How does the 70-30 payout split work?',
      a: 'Every Host Package (Starter, Pro, and Elite) guarantees the exact same 70-30 split: you take home 70% of your meetup fee directly into your Host Earnings Wallet upon session completion, while 30% covers statutory GST, Razorpay processing charges, 24/7 SOS & escrow infrastructure, and platform revenue.',
    },
    {
      q: 'Why is there a Host Registration Package?',
      a: 'Host Packs (starting at INR 199 for 1 Month) keep our community genuine by filtering out spam applicants, activate your verified directory listing, and grant promotional Chat Coins to engage on the platform.',
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
                  Verify your 10-digit Indian mobile number once via Fast2SMS OTP. One verified account powers both Member and Host modes cleanly.
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
                <h3 className="font-display text-lg font-black text-ink">Pick Host Pack &amp; earn 70%</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Choose Starter, Pro, or Elite Host Pack, pledge 100% platonic public-venue meetups, and take home 70% of every completed booking to UPI.
                </p>
              </div>
            </div>
          </div>

          {/* Host Registration Packages (70-30 Across All Packs) */}
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <Badge variant="lavender" size="sm">
                Host Packages
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-ink">
                Choose Your Host Package
              </h2>
              <p className="font-body text-sm text-ink-soft">
                Every pack guarantees a <strong>fixed 70% Host Payout</strong> (30% covers GST, Razorpay gateway fees, escrow &amp; safety infrastructure, and platform revenue).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HOST_PACK_OPTIONS.map((pack) => (
                <div
                  key={pack.tier}
                  className={`rounded-3xl border-3 border-ink p-6 sm:p-8 shadow-brutal flex flex-col justify-between space-y-6 ${
                    pack.isPopular ? 'bg-ink text-white' : 'bg-white text-ink'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-lg border-2 px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          pack.isPopular
                            ? 'border-white bg-lime text-ink'
                            : 'border-ink bg-sunny text-ink'
                        }`}
                      >
                        {pack.durationLabel}
                      </span>
                      <span
                        className={`rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase ${
                          pack.isPopular
                            ? 'border-lime/40 bg-white/10 text-lime'
                            : 'border-ink/20 bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        70% Payout Fixed
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-black">{pack.name}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-display text-4xl font-black">INR {pack.price}</span>
                        <span className={`text-xs font-bold ${pack.isPopular ? 'text-white/70' : 'text-ink-muted'}`}>
                          / {pack.durationLabel}
                        </span>
                      </div>
                      <p className={`mt-1 text-xs font-medium ${pack.isPopular ? 'text-white/80' : 'text-ink-soft'}`}>
                        {pack.tagline}
                      </p>
                    </div>

                    <ul className="space-y-2.5 pt-3 border-t border-current/15 text-xs font-bold">
                      {pack.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 mt-0.5 ${
                              pack.isPopular ? 'text-lime' : 'text-emerald-600'
                            }`}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={
                      isAuthenticated
                        ? `/become-a-companion/apply?pack=${pack.tier}`
                        : `/login?intent=host&next=${encodeURIComponent(`/become-a-companion/apply?pack=${pack.tier}`)}`
                    }
                    className="block"
                  >
                    <button
                      type="button"
                      className={`w-full rounded-2xl border-2 py-3 px-4 font-display text-xs font-black uppercase tracking-wider shadow-brutal-sm transition cursor-pointer ${
                        pack.isPopular
                          ? 'border-white bg-lime text-ink hover:bg-sunny'
                          : 'border-ink bg-ink text-white hover:bg-black'
                      }`}
                    >
                      Select {pack.name} &rarr;
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
