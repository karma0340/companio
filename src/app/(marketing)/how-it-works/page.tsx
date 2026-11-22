import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HowItWorksJourney } from '@/components/how-it-works/how-it-works-journey';

export const metadata: Metadata = {
  title: 'How It Works, Meetzy Club — In Five Steps',
  description:
    'From the first browse to the second meetup. Strictly platonic, always in public. Learn how Meetzy Club works from discovery to safe completion in public venues.',
};

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
