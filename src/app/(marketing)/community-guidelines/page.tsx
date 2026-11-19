import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "100% Platonic Code of Conduct & Guidelines",
  description:
    "Our zero-tolerance policy against romance, solicitation, and harassment. Learn our clear boundaries for safe, respectful, public companionship.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge variant="pink" size="md">
              Code of Conduct
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink">
              Community Guidelines
            </h1>

            <p className="font-body text-base sm:text-lg text-ink-soft leading-relaxed">
              Togethr is built on mutual respect, clear boundaries, and platonic camaraderie. Every member and host must adhere strictly to these rules.
            </p>
          </div>

          {/* Zero Tolerance Platonic Declaration */}
          <div className="rounded-3xl border-brutal bg-sunny p-8 sm:p-10 shadow-brutal space-y-4">
            <div className="flex items-center gap-2 text-ink font-display text-sm font-black uppercase">
              <AlertOctagon className="h-5 w-5" />
              <span>Core Principle</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
              Strictly Platonic. Zero Exceptions.
            </h2>

            <p className="font-body text-sm sm:text-base text-ink leading-relaxed">
              Togethr is not a dating service, hookup platform, or escort agency. Any user who makes romantic advances, sexual propositions, requests for intimate favors, or asks for physical affection will be <strong>permanently banned immediately</strong> without refund, and reported to law enforcement where applicable.
            </p>
          </div>

          {/* The Do's and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What is encouraged */}
            <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-display text-lg font-black">
                <CheckCircle2 className="h-6 w-6" />
                <span>What We Encourage</span>
              </div>

              <ul className="space-y-3 font-body text-sm text-ink-soft">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.25]" />
                  <span><strong>Daylight Public Meetups:</strong> Cafes, malls, gym chains, food streets, and public parks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.25]" />
                  <span><strong>Punctuality & Communication:</strong> Arrive on time and coordinate through in-app chat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.25]" />
                  <span><strong>Respecting Boundaries:</strong> Treat your companion with courtesy, active listening, and warmth.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.25]" />
                  <span><strong>Code Exchange:</strong> Always verbally share the 4-digit start code to activate the session.</span>
                </li>
              </ul>
            </div>

            {/* What is strictly prohibited */}
            <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-4">
              <div className="flex items-center gap-2 text-danger font-display text-lg font-black">
                <XCircle className="h-6 w-6" />
                <span>Strictly Prohibited</span>
              </div>

              <ul className="space-y-3 font-body text-sm text-ink-soft">
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-danger shrink-0 mt-0.5 stroke-[2.25]" />
                  <span><strong>Private Residences or Hotels:</strong> Never meet in homes, Airbnb apartments, or hotel rooms.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-danger shrink-0 mt-0.5 stroke-[2.25]" />
                  <span><strong>Off-Platform Payments:</strong> Cash or direct UPI transfers outside our escrow vault are banned.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-danger shrink-0 mt-0.5 stroke-[2.25]" />
                  <span><strong>Romantic or Sexual Solicitations:</strong> Zero tolerance for flirting, touching, or intimacy requests.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-danger shrink-0 mt-0.5 stroke-[2.25]" />
                  <span><strong>Substance Abuse or Alcohol Pressure:</strong> Never pressure a companion to drink or consume substances.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reporting & Enforcement */}
          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-10 shadow-brutal space-y-4">
            <h2 className="font-display text-2xl font-black text-ink">
              Violations & Reporting
            </h2>
            <p className="font-body text-sm text-ink-soft leading-relaxed">
              If a host or member makes you feel uncomfortable or violates any guideline, end the meetup immediately and report them via the in-app SOS button or by emailing{' '}
              <a href="mailto:safety@made4togethr.com" className="font-bold underline text-ink">
                safety@made4togethr.com
              </a>
              . Our safety committee reviews all complaints within 15 minutes.
            </p>

            <div className="pt-4 flex gap-4">
              <Link href="/explore">
                <Button variant="primary" size="md">
                  <span>Explore Verified Hosts →</span>
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
