import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SafetyTrustSystem } from '@/components/safety/safety-trust-system';

export const metadata: Metadata = {
  title: "Meetzy Club Trust System — Safety Architecture & Verified Safeguards",
  description:
    "How Meetzy Club keeps you safe: Government ID checks, live video selfies, public-place restrictions, 4-digit start codes, escrow payment vaults, and 1-tap emergency SOS.",
};

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
