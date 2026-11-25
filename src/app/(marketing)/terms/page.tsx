import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, CheckCircle2, Clock, RotateCcw, AlertTriangle, KeyRound } from 'lucide-react';

export const metadata: Metadata = {
  title: "Terms of Service — Platonic Rules, Escrow & User Agreement",
  description: "Official terms and conditions governing Companio and Meetzy Club. Strict platonic public venue rules, escrow refunds, and 4-digit PIN verification.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2">
              <Badge variant="sunny" size="md">
                Legal Contract
              </Badge>
              <Badge variant="pink" size="md">
                100% Platonic Meetups
              </Badge>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink tracking-tight">
              Terms of Service
            </h1>

            <p className="font-body text-xs sm:text-sm text-ink-muted">
              Effective Date: November 2026 &middot; Governed by the Laws of the Republic of India
            </p>
          </div>

          {/* Core Rules Callout Banner */}
          <div className="rounded-3xl border-3 border-ink bg-[#FFF9EA] p-6 sm:p-8 shadow-brutal space-y-4">
            <div className="flex items-center gap-2 text-ink font-display text-sm font-black uppercase">
              <ShieldAlert className="h-5 w-5 text-ink shrink-0" />
              <span>Core Platform Agreement &mdash; Essential Highlights</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="rounded-2xl border-2 border-ink bg-white p-3.5 shadow-brutal-xs space-y-1">
                <span className="font-display text-xs font-black text-ink block">1. Strictly Platonic</span>
                <p className="text-[11px] text-ink-soft leading-relaxed font-medium">
                  Romantic, sexual, or physical solicitations of any kind are strictly prohibited. Zero tolerance.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-ink bg-white p-3.5 shadow-brutal-xs space-y-1">
                <span className="font-display text-xs font-black text-ink block">2. Public Places Only</span>
                <p className="text-[11px] text-ink-soft leading-relaxed font-medium">
                  100% of meetups take place strictly in open, public venues (cafés, restaurants, promenades).
                </p>
              </div>
              <div className="rounded-2xl border-2 border-ink bg-white p-3.5 shadow-brutal-xs space-y-1">
                <span className="font-display text-xs font-black text-ink block">3. Escrow Protected</span>
                <p className="text-[11px] text-ink-soft leading-relaxed font-medium">
                  Payments are held safely in escrow and released to the companion only via the 4-digit start PIN.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Content Body */}
          <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-12 shadow-brutal-lg space-y-8 font-body text-xs sm:text-sm text-ink-soft leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                1. Intermediary Technology Platform
              </h2>
              <p>
                Companio (&ldquo;Meetzy Club&rdquo;) is an electronic communications and intermediary software marketplace connecting independent adult individuals (&ldquo;Members&rdquo;) with local companions (&ldquo;Hosts&rdquo;) for friendly, strictly platonic social activities in public spaces. Companio is <strong>not</strong> an employer, agent, dating service, matrimonial bureau, or adult entertainment provider. Hosts operate as independent individuals who determine their own availability, activities, and hourly rates.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                2. Age Requirement &amp; Eligibility
              </h2>
              <p>
                Platform access and booking are strictly restricted to natural persons aged <strong>18 years or older</strong>. By registering an account as a Member or Host, you warrant and represent that you possess the legal capacity under Indian Contract Act, 1872 to enter into binding agreements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                3. Strictly Platonic &amp; Public Venues Mandate
              </h2>
              <p>
                The cornerstone of Companio is safe, open, and strictly platonic human connection:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-soft">
                <li>
                  <strong className="text-ink">No Romantic or Adult Services:</strong> Any proposition involving physical intimacy, dating, escort services, sexually explicit communication, or commercial adult activity constitutes an immediate violation of contract, grounds for permanent blacklisting, and reporting to relevant cyber authorities.
                </li>
                <li>
                  <strong className="text-ink">Public Places Exclusively:</strong> All sessions must be held in openly visible, well-lit, public commercial or civic locations (e.g. coffee houses, artisan bakeries, high-street promenades, malls, museums, sports turfs, and public parks).
                </li>
                <li>
                  <strong className="text-ink">Prohibited Locations:</strong> Private apartments, hotel rooms, Airbnbs, private vehicles, secluded trails, or after-hours closed spaces are strictly off-limits.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                4. Access Passes &amp; Meetup Pricing
              </h2>
              <p>
                The platform utilizes a transparent, zero-subscription-trap billing model:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-soft">
                <li>
                  <strong className="text-ink">Access Passes:</strong> Members purchase a Pass (1 Month: ₹199, 3 Months: ₹499 Recommended, 12 Months: ₹999, or Lifetime: ₹1,999) to unlock unblurred profiles and send meetup requests. Passes are paid directly via Razorpay and <strong>never auto-renew or auto-debit</strong>.
                </li>
                <li>
                  <strong className="text-ink">Meetup Hourly Rate:</strong> Each meetup is paid separately at the companion&apos;s published hourly rate (inclusive of statutory GST). Meetup payments are deposited directly into safe escrow before session confirmation.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                5. Escrow Safeguard, Cancellation &amp; Refund Policy
              </h2>
              <div className="rounded-2xl border-2 border-ink bg-paper p-4 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-display font-black text-ink">
                  <RotateCcw className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Escrow Protection &amp; Automatic Wallet Reversal Rules</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-ink-soft">
                  <li>
                    <strong className="text-ink">Declined or Withdrawn Requests:</strong> If a companion declines your meetup request, or if you withdraw your booking before the companion accepts, 100% of the funds are credited back to your Companio wallet immediately.
                  </li>
                  <li>
                    <strong className="text-ink">12-Hour Companion Acceptance SLA:</strong> If a companion does not accept the request within 12 hours (excluding overnight hours 11:00 PM to 8:00 AM), the reservation auto-expires and the full amount is returned to your wallet within approximately one hour of the deadline.
                  </li>
                  <li>
                    <strong className="text-ink">Wallet Re-use or Bank Withdrawal:</strong> Wallet funds can be applied immediately to book any other companion. Alternatively, members can request a refund back to their original card/UPI minus a 12% banking processing fee.
                  </li>
                  <li>
                    <strong className="text-ink">No-Show Protection:</strong> If a companion confirms a meetup but fails to arrive at the agreed public venue, the member can tap &ldquo;No, it didn&apos;t happen&rdquo; on their dashboard. Our safety team reviews the location timestamps and issues an immediate full refund.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                6. Secret 4-Digit In-Person PIN &amp; Host Payouts
              </h2>
              <p>
                To prevent fraud and guarantee mutual arrival:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-soft">
                <li>Upon booking confirmation, the Member is issued a confidential 4-digit numeric start PIN.</li>
                <li>The Member must ONLY disclose this PIN in person after meeting the Companion at the designated public place.</li>
                <li>The Companion enters the 4-digit PIN on their Host Portal, which officially activates the session and releases the escrow payout to their Host earnings wallet.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                7. Virtual Coins Economy
              </h2>
              <p>
                Coins power direct in-app messaging with hosts (1 Coin = INR 1). Every new member receives 100 promotional coins upon verified registration. Coins hold no cash redemption value outside the platform and cannot be exchanged for cash, nor can they be used to purchase Access Passes. If a companion fails to reply to an initiated chat message within 48 hours, the spent coins are automatically refunded to the member&apos;s balance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                8. Off-Platform Payment Prohibition
              </h2>
              <p>
                Soliciting or accepting cash payments, direct UPI transfers, or gifts outside the official Companio payment gateway is strictly prohibited. Engaging in off-platform transactions voids all escrow protections and insurance guarantees, resulting in permanent deactivation of both user accounts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                9. Limitation of Liability &amp; Governing Law
              </h2>
              <p>
                To the maximum extent permitted by Indian law, Companio / Meetzy Club shall not be liable for any indirect, incidental, or consequential damages resulting from interpersonal interactions during meetups. Users agree to indemnify and hold harmless Companio, its directors, and affiliates. These Terms are governed exclusively by the laws of India, with courts in Chandigarh / New Delhi possessing exclusive jurisdiction.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                10. Contact &amp; Legal Support
              </h2>
              <p>
                For legal inquiries, terms interpretation, or platform safety concerns, contact our legal team at{' '}
                <a href="mailto:meetzyclub@gmail.com" className="font-bold underline text-ink">
                  meetzyclub@gmail.com
                </a>{' '}
                or visit our <Link href="/contact" className="underline font-bold text-ink">Contact Page</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
