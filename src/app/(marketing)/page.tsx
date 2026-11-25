import React from 'react';
import { getCompanionsPaginated } from '@/lib/data';
import { mapApiCompanionToCard } from '@/lib/companion-mapper';
import { HomeClient } from '@/components/landing/home-client';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const result = await getCompanionsPaginated({ page: 1, limit: 12 });
  const initialCompanions = result.companions.map(mapApiCompanionToCard);

  return (
    <HomeClient
      initialCompanions={initialCompanions}
      initialTotal={result.total}
    />
  );
}
