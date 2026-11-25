import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SafetyTrustSystem } from '@/components/safety/safety-trust-system';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Safety Architecture & Verified Safeguards',
  description:
    'How Meetzy Club keeps you safe: Live SMS OTP verification, public-place restrictions, 4-digit start codes, 70-30 escrow protection, and emergency SOS.',
  path: '/safety',
});

export default function SafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9EA]">
      <Navbar />

      <main className="flex-1">
        <SafetyTrustSystem />
      </main>

      <Footer />
    </div>
  );
}
