import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock, EyeOff, Server, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: "Privacy Policy — Digital Personal Data Protection (DPDP) Act 2023 Compliant",
  description: "Official privacy policy explaining what data we collect, what we never collect, encryption standards, and user data rights under Indian law.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2">
              <Badge variant="lime" size="md">
                Data Privacy &amp; Trust
              </Badge>
              <Badge variant="lavender" size="md">
                DPDP Act 2023 Compliant
              </Badge>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink tracking-tight">
              Privacy Policy
            </h1>

            <p className="font-body text-xs sm:text-sm text-ink-muted">
              Effective Date: November 2026 &middot; Compliant with the Digital Personal Data Protection (DPDP) Act 2023, Republic of India
            </p>
          </div>

          {/* Privacy Guarantees Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal-sm space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-[#D4F7A5] text-ink shadow-brutal-xs">
                <EyeOff className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-black text-ink">No Government IDs Stored</h3>
              <p className="text-xs font-medium text-ink-soft leading-relaxed">
                We do NOT collect, request, or store Aadhaar cards, biometrics, or government identity documents.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal-sm space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-[#E8DEFF] text-ink shadow-brutal-xs">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-black text-ink">Phone Numbers Masked</h3>
              <p className="text-xs font-medium text-ink-soft leading-relaxed">
                Your private 10-digit mobile number is encrypted and never displayed publicly on companion profiles or directories.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal-sm space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-[#FED7AA] text-ink shadow-brutal-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-black text-ink">PCI-DSS Payment Security</h3>
              <p className="text-xs font-medium text-ink-soft leading-relaxed">
                Card and UPI transactions are handled directly by RBI-licensed Razorpay. We never store payment credentials.
              </p>
            </div>
          </div>

          {/* Detailed Policy Document */}
          <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-12 shadow-brutal-lg space-y-8 font-body text-xs sm:text-sm text-ink-soft leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                1. Introduction &amp; Privacy by Default
              </h2>
              <p>
                Companio (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Platform&rdquo;), operated by Meetzy Club, respects the privacy rights of our users. This Privacy Policy outlines our procedures concerning the collection, storage, use, and protection of personal data provided by members and companions in accordance with the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                2. Data We Collect and Why
              </h2>
              <p>
                We only collect data that is strictly necessary to enable secure authentication, public companionship matching, and escrow coordination:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-soft">
                <li>
                  <strong className="text-ink">Mobile Phone Number:</strong> Collected solely for passwordless OTP verification, transactional order alerts, and emergency coordination.
                </li>
                <li>
                  <strong className="text-ink">Public Profile Details (Companions / Hosts):</strong> Display name, profile avatar photograph, city/locality, hourly companion rate, spoken languages, accepted public activities, and short biographical summary.
                </li>
                <li>
                  <strong className="text-ink">Booking Logistics:</strong> Scheduled meetup date, preferred time window (Morning, Afternoon, Evening), duration in hours, designated public venue name, and transaction status.
                </li>
                <li>
                  <strong className="text-ink">Meetup Verification Start PIN:</strong> A unique, randomly generated 4-digit numeric code generated per booking, used exclusively for in-person verification at the public venue.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                3. What We Strictly Do NOT Collect or Store
              </h2>
              <div className="rounded-2xl border-2 border-ink bg-[#FFF9EA] p-4 space-y-2">
                <div className="flex items-center gap-2 font-display text-xs font-black text-ink">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  <span>Explicit Non-Collection Safeguards</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-xs text-ink-soft">
                  <li>We do <strong>NOT</strong> collect, scan, or store Aadhaar numbers, biometric fingerprints, iris scans, or government database records.</li>
                  <li>We do <strong>NOT</strong> store credit card numbers, debit card CVVs, net banking passwords, or UPI MPINs.</li>
                  <li>We do <strong>NOT</strong> track continuous GPS background location when you are not actively navigating to a confirmed public venue.</li>
                  <li>We do <strong>NOT</strong> sell, license, or monetize your contact information or personal profile to advertising networks or third-party data brokers.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                4. Financial &amp; Payment Gateway Security
              </h2>
              <p>
                All financial transactions, including Access Passes, Chat Coin recharges, and Escrow Meetup Deposits, are processed securely through <strong>Razorpay Software Private Limited</strong>, an RBI-licensed and PCI-DSS Level 1 compliant payment aggregator. Transactions support UPI, RuPay, Visa, Mastercard, and Net Banking. All transactions use end-to-end TLS 1.3 encryption.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                5. Communication Privacy
              </h2>
              <p>
                In-app chat messages between verified members and companions are transmitted over encrypted web sockets. Direct messaging requires an active booking or chat coins. Phone numbers and email addresses are automatically filtered by safety algorithms to prevent off-platform solicitation and protect both parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                6. Data Subject Rights Under DPDP Act 2023
              </h2>
              <p>
                You retain complete sovereignty over your personal data. You possess the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ink-soft">
                <li>
                  <strong className="text-ink">Right to Access &amp; Export:</strong> Download a full JSON export of your profile, bookings, payments, and saved companions directly from your account dashboard.
                </li>
                <li>
                  <strong className="text-ink">Right to Correction:</strong> Update your display name, bio, photograph, city, and activity preferences at any time.
                </li>
                <li>
                  <strong className="text-ink">Right to Erasure / Deletion:</strong> Request permanent deletion of your account and associated records by emailing our Data Grievance Officer at{' '}
                  <a href="mailto:privacy@trycompanio.in" className="font-bold underline text-ink">
                    privacy@trycompanio.in
                  </a>
                  . Account deletion is executed within 72 hours.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-black text-ink">
                7. Grievance Redressal Officer
              </h2>
              <p>
                In accordance with the Information Technology Act 2000 and the DPDP Act 2023, the designated Grievance Officer for Companio / Meetzy Club is:
              </p>
              <div className="rounded-xl border border-ink/20 bg-paper p-3.5 space-y-1 font-mono text-xs text-ink">
                <p><strong>Grievance Officer:</strong> Legal &amp; Compliance Cell</p>
                <p><strong>Platform:</strong> Companio / Meetzy Club (India)</p>
                <p><strong>Email:</strong> grievance@trycompanio.in</p>
                <p><strong>Response SLA:</strong> Acknowledgement within 24 hours, resolution within 15 days</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
