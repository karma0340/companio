import React from 'react';
import { getCompanionsPaginated } from '@/lib/data';
import { mapApiCompanionToCard } from '@/lib/companion-mapper';
import { ExploreClient } from '@/components/companion/explore-client';
import { ActivityCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface ExplorePageProps {
  searchParams?: {
    city?: string;
    activity?: string;
    freeToday?: string;
    weekendOnly?: string;
    womenOnly?: string;
    gender?: string;
    q?: string;
  };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const city = searchParams?.city || 'all';
  const activity = (searchParams?.activity as ActivityCategory | 'all') || 'all';
  const freeToday = searchParams?.freeToday === 'true';
  const weekendOnly = searchParams?.weekendOnly === 'true';
  const womenOnly = searchParams?.womenOnly === 'true';
  const rawGender = (searchParams?.gender || '').toLowerCase();
  const initialGender: 'all' | 'female' | 'male' =
    rawGender === 'male'
      ? 'male'
      : rawGender === 'female' || womenOnly
      ? 'female'
      : 'all';
  const q = searchParams?.q || '';

  const result = await getCompanionsPaginated({
    city: city !== 'all' ? city : undefined,
    activity: activity !== 'all' ? activity : undefined,
    freeToday,
    weekendOnly,
    gender: initialGender,
    q: q || undefined,
    page: 1,
    limit: 12,
  });

  const initialCompanions = result.companions.map(mapApiCompanionToCard);

  return (
    <ExploreClient
      initialCompanions={initialCompanions}
      initialTotal={result.total}
      initialHasMore={result.hasMore}
      initialCityCounts={result.cityCounts}
      initialCity={city}
      initialActivity={activity}
      initialFreeToday={freeToday}
      initialWeekendOnly={weekendOnly}
      initialGender={initialGender}
      initialQuery={q}
    />
  );
}
