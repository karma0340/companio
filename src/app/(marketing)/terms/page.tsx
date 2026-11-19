import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "Terms of Service — Platonic Rules & User Agreement",
  description: "Official terms and conditions governing the use of made4togethr platonic companionship platform in India.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge variant="sunny" size="md">
              Legal Compliance
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink">
              Terms of Service
            </h1>

            <p className="font-body text-xs sm:text-sm text-ink-muted">
              Effective Date: November 2026 · Governed by the Laws of the Republic of India
            </p>
          </div>

          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-12 shadow-brutal-lg space-y-8 font-body text-sm text-ink-soft leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display text-xl font-black text-ink">
                1. Strictly Platonic Nature of the Platform
              </h2>
              <p>
                Togethr (operated under <strong>made4togethr</strong>) is an intermediary technology platform connecting independent adult users for strictly platonic, social companionship in public venues. Togethr is <strong>not</strong> an employer, dating service, matrimony bureau, or adult entertainment directory. Any solicitation of romantic or sexual favors constitutes a breach of contract and criminal conduct under applicable Indian penal provisions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black text-ink">
                2. Age and Government Verification Mandate
              </h2>
              <p>
                Platform access is strictly restricted to individuals aged 18 and older. Both hosts and members must submit valid government-issued proof of identity upon request. Providing forged documents or impersonating another person results in immediate account termination and legal escalation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black text-ink">
                3. Public Venue Requirement
              </h2>
              <p>
                All meetups facilitated through Togethr must occur exclusively in publicly accessible venues such as restaurants, cafes, shopping centers, libraries, fitness studios, sports turfs, and public parks. Private residences, hotel rooms, and isolated properties are strictly off-limits.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black text-ink">
                4. Escrow Mechanism & Off-Platform Payments
              </h2>
              <p>
                All financial consideration must be transacted through Togethr’s authorized escrow payment gateway. Soliciting or accepting off-platform payments (cash, direct UPI, gift vouchers) is strictly prohibited and results in permanent deplatforming.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
