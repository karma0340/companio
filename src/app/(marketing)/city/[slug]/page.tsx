import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GatedCompanionGrid } from '@/components/companion/gated-companion-grid';
import { Badge } from '@/components/ui/badge';
import { CITIES } from '@/lib/data/cities';
import { getCompanions } from '@/lib/data';
import { Companion, ActivityCategory } from '@/lib/types';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

function mapToActivityCategories(activities: string[] = []): ActivityCategory[] {
  const mapping: Record<string, ActivityCategory> = {
    'coffee': 'coffee-chat',
    'cafe': 'coffee-chat',
    'shopping': 'shopping-buddy',
    'styling': 'shopping-buddy',
    'photo': 'photo-walk',
    'comedy': 'comedy-and-shows',
    'city': 'city-guide',
    'walk': 'walk-and-talk',
    'gym': 'gym-partner',
    'fitness': 'gym-partner',
    'museum': 'city-guide',
    'book': 'study-buddy',
    'food': 'food-walk',
    'co-working': 'career-chat',
    'sports': 'sports-partner',
    'movie': 'movie-buddy',
  };

  const categories = new Set<ActivityCategory>();
  for (const act of activities) {
    const lower = act.toLowerCase();
    let matched = false;
    for (const [key, cat] of Object.entries(mapping)) {
      if (lower.includes(key)) {
        categories.add(cat);
        matched = true;
      }
    }
    if (!matched) categories.add('coffee-chat');
  }
  return Array.from(categories);
}

interface CityPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return CITIES.map((c) => ({
    slug: c.slug,
  }));
}

export function generateMetadata({ params }: CityPageProps): Metadata {
  const citySlug = params.slug;
  const currentCity = CITIES.find((c) => c.slug === citySlug);
  if (!currentCity) return { title: 'City Not Found | Meetzy Club' };

  return {
    title: `Verified Local Companions in ${currentCity.name} — Gym, Movies & Coffee Buddies | Meetzy Club`,
    description: `Connect with ID-verified local buddies in ${currentCity.name} (${currentCity.popularAreas.slice(0, 3).join(', ')}). 100% platonic, escrow-safe companionship on Meetzy Club.`,
  };
}

export default async function CityCompanionsPage({ params }: CityPageProps) {
  const citySlug = params.slug;

  const currentCity = CITIES.find((c) => c.slug === citySlug);
  if (!currentCity) {
    notFound();
  }

  const rawCompanions = await getCompanions(citySlug);
  const cityCompanions: Companion[] = rawCompanions.map((c) => ({
    id: c.id,
    name: c.displayName || c.name,
    age: 24,
    gender: 'female' as const,
    city: c.citySlug,
    area: c.city,
    tagline: c.shortBio || 'Verified local companion',
    about: c.bio || c.shortBio || '',
    avatarUrl: c.avatarUrl,
    languages: c.spokenLanguages || ['English', 'Hindi'],
    hourlyRate: c.hourlyRate || 499,
    verifiedId: true,
    verifiedPhoto: true,
    rating: c.ratingAverage || 4.9,
    reviewCount: c.totalReviews || 12,
    meetupsCount: c.totalReviews || 12,
    activities: mapToActivityCategories(c.acceptedActivities || []),
    isFreeToday: c.isAvailable ?? true,
    acceptsWomenOnly: false,
    memberSince: '2026',
    availability: [
      { days: 'Mon — Fri', hours: '18:00 – 21:00' },
      { days: 'Sat — Sun', hours: '11:00 – 20:00' },
    ],
    reviews: [],
  }));

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Back Navigation */}
          <div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 font-display text-xs font-black text-ink hover:text-lavender transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all cities</span>
            </Link>
          </div>

          {/* City Header Card */}
          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-12 shadow-brutal-lg space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="lime" size="md" className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 stroke-[2.25]" />
                <span>{currentCity.name} Hub</span>
              </Badge>
              <Badge variant="sunny" size="md">
                {currentCity.state}
              </Badge>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink">
              Verified Companions in {currentCity.name}
            </h1>

            <p className="font-body text-base sm:text-lg text-ink-soft max-w-2xl leading-relaxed">
              Find an ID-verified local buddy for coffee, gym sessions, movies, and city walks across {currentCity.name}. 100% platonic, escrow-protected, and verified via 4-digit start codes.
            </p>

            {/* Popular Neighborhoods Bar */}
            <div className="pt-4 border-t-brutal-sm space-y-2">
              <span className="block font-display text-xs font-black uppercase tracking-wider text-ink-muted">
                Popular Meetup Hubs in {currentCity.name}:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentCity.popularAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-paper px-2.5 py-1 text-xs font-bold text-ink"
                  >
                    <MapPin className="h-3 w-3 text-ink-muted stroke-[2.25]" />
                    <span>{area}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Companions Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-brutal pb-4">
              <div>
                <h2 className="font-display text-2xl font-black text-ink">
                  Hosts in {currentCity.name} ({cityCompanions.length})
                </h2>
                <p className="text-xs font-body text-ink-soft mt-0.5">
                  ID-checked hosts available for hire across {currentCity.name}
                </p>
              </div>

              <Link
                href="/explore"
                className="font-display text-xs font-bold text-lavender underline hover:text-ink transition-colors"
              >
                View all cities →
              </Link>
            </div>

            {cityCompanions.length === 0 ? (
              <div className="rounded-2xl border-brutal bg-white p-12 text-center shadow-brutal space-y-4">
                <p className="font-display text-lg font-black text-ink">
                  No hosts currently active in {currentCity.name}.
                </p>
                <p className="text-xs font-body text-ink-soft max-w-md mx-auto">
                  Be the founding companion for {currentCity.name} and start earning up to ₹1,500/hour!
                </p>
                <Link
                  href="/become-a-companion"
                  className="inline-block rounded-xl border-brutal bg-lime px-5 py-2.5 font-display text-xs font-black uppercase text-ink shadow-brutal-sm btn-press"
                >
                  Apply to Host in {currentCity.name}
                </Link>
              </div>
            ) : (
              <GatedCompanionGrid companions={cityCompanions} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
