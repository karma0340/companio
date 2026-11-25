import React from 'react';
import type { Metadata } from 'next';
import { getCompanionsPaginated } from '@/lib/data';
import { mapApiCompanionToCard } from '@/lib/companion-mapper';
import { HomeClient } from '@/components/landing/home-client';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Find a Buddy, Not a Date — Verified Local Companions Across India',
  description:
    'Book mobile OTP-verified companions in Chandigarh, Delhi NCR, Bengaluru, Mumbai, Pune, and Hyderabad for coffee chats, movies, gym, and food walks. 100% platonic, public venues only.',
  path: '/',
});

export default async function HomePage() {
  const result = await getCompanionsPaginated({ page: 1, limit: 48 });
  const initialCompanions = result.companions.map(mapApiCompanionToCard);

  return (
    <HomeClient
      initialCompanions={initialCompanions}
      initialTotal={result.total}
    />
  );
}
