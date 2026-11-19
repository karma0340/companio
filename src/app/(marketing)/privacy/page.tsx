import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "Privacy Policy — DPDP Act 2023 Compliant",
  description: "How made4togethr securely handles ID verification, phone number masking, and data privacy in accordance with Indian data protection laws.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge variant="lime" size="md">
              Data Privacy
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink">
              Privacy Policy
            </h1>

            <p className="font-body text-xs sm:text-sm text-ink-muted">
              Compliant with the Digital Personal Data Protection (DPDP) Act 2023, India
            </p>
          </div>

          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-12 shadow-brutal-lg space-y-8 font-body text-sm text-ink-soft leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-display text-xl font-black text-ink">
                1. Data We Collect for Safety
              </h2>
              <p>
                To maintain our verification protocols, Togethr collects your legal name, mobile phone number, government ID images (Aadhaar, Passport, or Voter ID), live selfie video data, and meeting coordinate logs. Government IDs are encrypted at rest using AES-256 standards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black text-ink">
                2. Privacy by Default: Masked Phone Numbers
              </h2>
              <p>
                Your personal phone number and private contact details are never shared with companions or members. All pre-meetup logistics are handled through our in-app coordination framework.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black text-ink">
                3. Live Location Data During Active Meetups
              </h2>
              <p>
                When a 4-digit start code is activated, Togethr may access geolocation data strictly to provide real-time SOS tracking and emergency responder assistance if triggered. Geolocation tracking terminates automatically when the session concludes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-black text-ink">
                4. Data Subject Rights & Deletion
              </h2>
              <p>
                Under the DPDP Act 2023, you have the right to request a copy of your personal data or request permanent deletion of your account by emailing{' '}
                <a href="mailto:privacy@made4togethr.com" className="font-bold underline text-ink">
                  privacy@made4togethr.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
