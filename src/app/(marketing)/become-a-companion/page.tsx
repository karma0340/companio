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
  Award,
  ChevronDown,
  Clock,
  Radio,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRupees } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export default function BecomeACompanionPage() {
  const { isAuthenticated, activeRole, hostProfile } = useAuth();
  const [hourlyRate, setHourlyRate] = useState<number>(399);
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 90% take home for new hosts
  const hostCut = hourlyRate * 0.90;
  const monthlyEarnings = Math.round(hostCut * weeklyHours * 4);

  const destinationHref = !isAuthenticated
    ? '/login?intent=host&next=/become-a-companion/apply'
    : activeRole === 'host' && hostProfile?.verificationStatus === 'approved'
    ? '/companion/dashboard'
    : '/become-a-companion/apply';

  const buttonText =
    isAuthenticated && activeRole === 'host' && hostProfile?.verificationStatus === 'approved'
      ? 'Go to Host Dashboard →'
      : 'Apply to Become a Host →';

  const faqs = [
    {
      q: 'Who can become a host?',
      a: 'Anyone aged 18+ who is friendly, reliable, and excited to share activities like coffee chats, gym workouts, or city exploration. All hosts complete mandatory identity verification (Aadhaar) and automated face match.',
    },
    {
      q: 'How and when do I get paid?',
      a: 'After every completed meetup, the escrow payment is immediately unlocked and credited to your host wallet. You can withdraw directly to any UPI ID within 24 hours.',
    },
    {
      q: 'How does the leveling system work?',
      a: 'All hosts start keeping 90% of their hourly rate. As you complete 10+ meetups with a 4.5+ star rating, you level up to Rising Host (keeping 93%). At 30+ meetups and 4.8+ rating, you become a Top Host (keeping 95%).',
    },
    {
      q: 'What is the Strictly Platonic policy?',
      a: 'Every session must take place in approved public venues (cafes, malls, parks, gyms). Private homes and hotel rooms are strictly prohibited. Any romantic or off-platform payment solicitations lead to an immediate permanent ban.',
    },
    {
      q: 'Is there a registration fee?',
      a: 'Joining is free for members. To filter non-serious applicants and cover third-party identity verification, a one-time fee of INR 99 + 18% GST (INR 117 total) applies upon document submission.',
    },
  ];

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
              <span className="bg-[#D4F7A5] px-3 py-0.5 border-brutal rounded-xl shadow-brutal inline-block mt-1">
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

          {/* 4-Step Journey */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <Badge variant="lime" size="sm">
                4-Step Process
              </Badge>
              <h2 className="font-display text-3xl font-black text-ink">
                How becoming a host works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-sunny text-ink font-display text-lg font-black shadow-brutal-sm">
                  1
                </div>
                <h3 className="font-display text-lg font-black text-ink">Sign up &amp; tell us</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Provide your bio, favorite activities, languages, and preferred neighbourhood locality.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-[#D4F7A5] text-ink font-display text-lg font-black shadow-brutal-sm">
                  2
                </div>
                <h3 className="font-display text-lg font-black text-ink">Set rate &amp; radius</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Choose your hourly rate (INR 49 - 1,999) and specify your travel radius (up to 5, 10, or 25 km).
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-pink text-ink font-display text-lg font-black shadow-brutal-sm">
                  3
                </div>
                <h3 className="font-display text-lg font-black text-ink">Verify identity</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Submit 12-digit Aadhaar UID with front/back photos and quick automated video face match.
                </p>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal bg-lavender text-white font-display text-lg font-black shadow-brutal-sm">
                  4
                </div>
                <h3 className="font-display text-lg font-black text-ink">Meet &amp; earn</h3>
                <p className="font-body text-xs text-ink-soft leading-relaxed">
                  Accept requests, meet in public, get paid to your wallet after each session.
                </p>
              </div>
            </div>
          </div>

          {/* "The Deal" Feature Card */}
          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-10 shadow-brutal-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-brutal pb-5">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-ink-muted">
                  PLATFORM ECONOMY
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
                  The deal
                </h2>
              </div>
              <Badge variant="lime" size="md">
                Keep up to 95%
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Earnings Ladder */}
              <div className="space-y-4">
                <div className="rounded-2xl border-brutal-sm bg-[#D4F7A5] p-5 shadow-brutal-xs space-y-3">
                  <div className="font-display text-lg font-black text-ink flex items-center gap-2">
                    <Award className="w-5 h-5 text-ink" />
                    <span>Keep 90% as new host &mdash; up to 95% as you level up</span>
                  </div>
                  <div className="space-y-2 text-xs font-bold text-ink">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/70 border-brutal-xs">
                      <span>New Host (Starts here)</span>
                      <span>Keep 90% (10% fee)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/70 border-brutal-xs">
                      <span>Rising Host (10+ meetups &amp; 4.5 star)</span>
                      <span>Keep 93% (7% fee)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white/70 border-brutal-xs">
                      <span>Top Host (30+ meetups &amp; 4.8 star)</span>
                      <span>Keep 95% (5% fee)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border-brutal-sm bg-paper-deep space-y-2 text-xs font-medium text-ink-soft">
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <Wallet className="w-4 h-4 text-emerald-700" />
                    <span>Withdraw to any UPI ID within 24h</span>
                  </div>
                  <p>
                    Earnings are credited to your host balance immediately after the in-person handshake PIN is verified.
                  </p>
                </div>
              </div>

              {/* Trust & Safety Highlights */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border-brutal-sm bg-white shadow-brutal-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-display text-sm font-black text-ink">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Phone-verified 18+ members only</span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    No anonymous or unverified profiles can book you or send messages.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-brutal-sm bg-white shadow-brutal-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-display text-sm font-black text-ink">
                    <Lock className="w-4 h-4 text-pink-700" />
                    <span>Strictly platonic: no private homes or hotel rooms</span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Public places only. Zero exceptions. Any romantic advance results in permanent ban.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border-brutal-sm bg-white shadow-brutal-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-display text-sm font-black text-ink">
                    <Radio className="w-4 h-4 text-danger" />
                    <span>SOS &amp; live location on every meetup</span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Our safety team monitors active sessions with instant emergency telemetry.
                  </p>
                </div>
              </div>
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
                Adjust your desired rate and available hours to see what you take home (90% - 95%).
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
                    min="199"
                    max="1499"
                    step="50"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value, 10))}
                    className="w-full accent-ink cursor-pointer h-2 bg-paper-deep rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-ink-muted">
                    <span>INR 199 /hr</span>
                    <span>INR 1,499 /hr</span>
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
              <div className="rounded-2xl border-brutal bg-[#D4F7A5] p-6 sm:p-8 shadow-brutal text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-ink">
                  Estimated Take-Home (Monthly)
                </span>
                <div className="font-display text-4xl sm:text-5xl font-black text-ink">
                  {formatRupees(monthlyEarnings)}
                </div>
                <p className="text-xs font-bold text-ink-soft">
                  You keep 90% (INR {Math.round(hostCut)}/hr) as a New Host &mdash; up to 95% as Top Host.
                </p>
              </div>
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
              Ready to start earning in your city?
            </h2>
            <p className="text-sm font-medium text-ink-soft max-w-lg mx-auto">
              Complete your verification in under 5 minutes. Set your own hours, rates, and travel distance.
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
