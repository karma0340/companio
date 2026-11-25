import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HowItWorksJourney } from '@/components/how-it-works/how-it-works-journey';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'How Meetzy Club Works — Safe 5-Step Platonic Meetups',
  description:
    'From browsing verified hosts to choosing a public venue, paying via escrow, and starting with a 4-digit in-person PIN. Learn how Meetzy Club keeps meetups safe.',
  path: '/how-it-works',
});

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <HowItWorksJourney showHero={true} />
      </main>
      <Footer />
    </div>
  );
}
