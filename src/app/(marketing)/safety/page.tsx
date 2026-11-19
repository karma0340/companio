import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  MapPin,
  AlertTriangle,
  EyeOff,
  UserCheck,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "Safety First — ID Verification, 4-Digit Codes & Escrow Protection",
  description:
    "How made4togethr keeps you safe: Government ID checks, live video selfies, public-place restrictions, 4-digit start codes, and 1-tap emergency SOS.",
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="pink" size="md">
              Safety Architecture
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink leading-tight">
              Safety isn’t a feature. <br />
              <span className="bg-lime px-3 py-0.5 border-brutal rounded-xl shadow-brutal inline-block mt-1">
                It’s the product.
              </span>
            </h1>

            <p className="font-body text-base sm:text-lg text-ink-soft leading-relaxed">
              Togethr was designed from day one around safety, trust, and accountability. Every host, member, payment, and meetup is governed by strict, verified safeguards.
            </p>
          </div>

          {/* Emergency Alert Box */}
          <div className="rounded-3xl border-brutal bg-danger-soft p-6 sm:p-8 shadow-brutal space-y-3">
            <div className="flex items-center gap-2 text-danger font-display text-sm font-black uppercase tracking-wider">
              <ShieldAlert className="h-5 w-5" />
              <span>In-Person Emergency In India?</span>
            </div>
            <p className="font-display text-xl sm:text-2xl font-black text-ink">
              Dial <span className="underline text-danger">112</span> for immediate emergency police services.
            </p>
            <p className="font-body text-xs sm:text-sm text-ink-soft">
              Our 24/7 Trust & Safety Desk is reachable directly at{' '}
              <a href="mailto:safety@made4togethr.com" className="font-bold underline text-ink">
                safety@made4togethr.com
              </a>{' '}
              with priority incident response within 15 minutes.
            </p>
          </div>

          {/* Detailed 6 Safety Pillars */}
          <div className="space-y-8">
            <div className="border-b-brutal pb-4">
              <h2 className="font-display text-3xl font-black text-ink">
                The Togethr Trust System
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pillar 1 */}
              <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-brutal bg-lime text-ink shadow-brutal-sm">
                  <UserCheck className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="font-display text-2xl font-black text-ink">1. Verified Hosts</h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  Every host must upload a government-issued photo ID (Aadhaar, Passport, or Voter ID) and complete a real-time live video selfie match. We verify their legal identity, phone number, and social profiles before approving their listing.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-brutal bg-sunny text-ink shadow-brutal-sm">
                  <Lock className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="font-display text-2xl font-black text-ink">2. Escrow Protection</h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  Funds never go directly to the host upfront. Payment sits in an escrow vault until the meetup is mutually completed via code exchange. If a host cancels or fails to appear, your money is refunded automatically.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-brutal bg-pink text-ink shadow-brutal-sm">
                  <KeyRound className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="font-display text-2xl font-black text-ink">3. 4-Digit Start Codes</h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  A unique 4-digit code is generated on the member’s screen. When you meet in person, you verbally exchange this code. The host enters it to activate the timer. This prevents disputes and confirms physical presence.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-brutal bg-lavender text-white shadow-brutal-sm">
                  <MapPin className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="font-display text-2xl font-black text-ink">4. Public Places Only</h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  Meetups are restricted to verifiable public spots: cafes, malls, gym chains, cultural venues, and transit hubs. Private residences, hotel rooms, and secluded areas are strictly forbidden and trigger immediate account bans.
                </p>
              </div>

              {/* Pillar 5 */}
              <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-brutal bg-danger text-white shadow-brutal-sm">
                  <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="font-display text-2xl font-black text-ink">5. 1-Tap SOS & Live Location</h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  During an active meetup, both member and companion have access to a persistent SOS trigger. You can share your live coordinates with designated emergency contacts or alert local authorities directly.
                </p>
              </div>

              {/* Pillar 6 */}
              <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-brutal bg-mint text-ink shadow-brutal-sm">
                  <EyeOff className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="font-display text-2xl font-black text-ink">6. Private by Default</h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">
                  Your phone number, email, and full legal address are never displayed publicly. All coordination happens through Togethr’s in-app communication channels to protect your personal privacy.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Tips Checklist */}
          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-10 shadow-brutal space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
              Our Safety Tips for Every Meetup
            </h2>

            <div className="space-y-4 font-body text-sm text-ink-soft">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Always meet in broad daylight or well-lit public venues:</strong> Choose coffee shops, shopping centres, or popular public parks with steady foot traffic.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Never accept off-platform payments:</strong> If a host or member asks you to pay cash or UPI directly outside Togethr, report them immediately. Off-platform transactions lose all escrow and safety protections.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Trust your intuition:</strong> If someone makes you feel uncomfortable at any point, leave the venue immediately and notify our 24/7 safety team.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t-brutal-sm flex flex-col sm:flex-row gap-3">
              <Link href="/explore">
                <Button variant="primary" size="md">
                  <span>Browse Verified Hosts →</span>
                </Button>
              </Link>
              <Link href="/community-guidelines">
                <Button variant="outline" size="md">
                  <span>Read Community Guidelines</span>
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
