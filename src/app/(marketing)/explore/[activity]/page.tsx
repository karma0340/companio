import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GatedCompanionGrid } from '@/components/companion/gated-companion-grid';
import { Badge } from '@/components/ui/badge';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { ACTIVITIES } from '@/lib/data/activities';
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

interface ActivityPageProps {
  params: {
    activity: string;
  };
}

export function generateStaticParams() {
  return ACTIVITIES.map((act) => ({
    activity: act.slug,
  }));
}

export function generateMetadata({ params }: ActivityPageProps): Metadata {
  const activitySlug = params.activity;
  const currentActivity = ACTIVITIES.find((a) => a.slug === activitySlug);
  if (!currentActivity) return { title: 'Activity Not Found' };

  return {
    title: `Find a Verified ${currentActivity.name} in India — ${currentActivity.tagline} | Meetzy Club`,
    description: currentActivity.description,
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const activitySlug = params.activity;

  const currentActivity = ACTIVITIES.find((a) => a.slug === activitySlug);
  if (!currentActivity) {
    notFound();
  }

  const rawCompanions = await getCompanions(undefined, activitySlug);
  const relevantCompanions: Companion[] = rawCompanions.map((c) => ({
    id: c.id,
    name: c.displayName || c.name,
    age: c.age || 24,
    gender: (c.gender as 'male' | 'female' | 'non-binary') || 'non-binary',
    city: c.citySlug,
    area: c.locality || c.city,
    tagline: c.shortBio || 'Verified local companion',
    about: c.bio || c.shortBio || '',
    avatarUrl: c.avatarUrl,
    languages: c.spokenLanguages || ['English', 'Hindi'],
    hourlyRate: c.hourlyRate || 499,
    verifiedId: true,
    verifiedPhoto: true,
    rating: c.ratingAverage || 5.0,
    reviewCount: c.totalReviews || 0,
    meetupsCount: c.completedMeetups || 0,
    activities: mapToActivityCategories(c.acceptedActivities || []),
    isFreeToday: c.isAvailable ?? true,
    acceptsWomenOnly: false,
    memberSince: '2026',
    availability:
      c.availabilitySlots && c.availabilitySlots.length > 0
        ? c.availabilitySlots.map((slot) => ({ days: slot, hours: 'By Slot' }))
        : [{ days: 'Weekends & Evenings', hours: 'Flexible' }],
    preferredVenues: c.preferredVenues || [],
    reviews: [],
  }));

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Back Navigation */}
          <div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 font-display text-xs font-black text-ink hover:text-lavender transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all activities</span>
            </Link>
          </div>

          {/* Activity Hero Banner */}
          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-12 shadow-brutal-lg space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <ActivityIcon
                slug={currentActivity.slug}
                size="xl"
                variant="tile"
                bgVariant="sunny"
                animated
              />
              <Badge variant="lime" size="md">
                Activity Hub
              </Badge>
              <Badge variant="sunny" size="md">
                100% Platonic
              </Badge>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink">
              {currentActivity.name}
            </h1>

            <p className="font-body text-base sm:text-xl text-ink-soft max-w-3xl leading-relaxed">
              {currentActivity.description}
            </p>

            {/* Safety & Protocol Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t-brutal-sm">
              <div className="rounded-xl border-brutal-sm bg-paper p-3.5 space-y-1">
                <span className="flex items-center gap-1.5 font-display text-xs font-black text-ink">
                  <MapPin className="h-3.5 w-3.5 text-ink stroke-[2.25]" />
                  <span>Public Spaces Only</span>
                </span>
                <p className="text-[11px] font-body text-ink-soft">
                  Coffee shops, public gyms, food streets, and shopping avenues.
                </p>
              </div>

              <div className="rounded-xl border-brutal-sm bg-paper p-3.5 space-y-1">
                <span className="flex items-center gap-1.5 font-display text-xs font-black text-ink">
                  <Badge variant="lime" size="sm">OTP Verified</Badge>
                  <span>100% Phone Verified</span>
                </span>
                <p className="text-[11px] font-body text-ink-soft">
                  Every host completes live SMS OTP verification &amp; public meetup pledges.
                </p>
              </div>

              <div className="rounded-xl border-brutal-sm bg-paper p-3.5 space-y-1">
                <span className="flex items-center gap-1.5 font-display text-xs font-black text-ink">
                  <Badge variant="pink" size="sm">Platonic Only</Badge>
                  <span>Zero Awkwardness</span>
                </span>
                <p className="text-[11px] font-body text-ink-soft">
                  Strictly non-romantic activity companionship. Zero harassment tolerance.
                </p>
              </div>
            </div>
          </div>

          {/* Companions Grid */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-brutal pb-4">
              <div>
                <h2 className="font-display text-2xl font-black text-ink">
                  Available Hosts for {currentActivity.name}
                </h2>
                <p className="text-xs font-body text-ink-soft mt-0.5">
                  Showing {relevantCompanions.length} verified buddies across India
                </p>
              </div>

              <Link
                href={`/explore?activity=${currentActivity.slug}`}
                className="font-display text-xs font-bold text-lavender underline hover:text-ink transition-colors"
              >
                Filter by specific city →
              </Link>
            </div>

            {relevantCompanions.length === 0 ? (
              <div className="rounded-2xl border-brutal bg-white p-12 text-center shadow-brutal space-y-4">
                <p className="font-display text-lg font-black text-ink">
                  No hosts currently listed for this specific activity.
                </p>
                <p className="text-xs font-body text-ink-soft max-w-md mx-auto">
                  Be the first companion to offer {currentActivity.name} in your city and start earning!
                </p>
                <Link
                  href="/become-a-companion"
                  className="inline-block rounded-xl border-brutal bg-lime px-5 py-2.5 font-display text-xs font-black uppercase text-ink shadow-brutal-sm btn-press"
                >
                  Become a Host
                </Link>
              </div>
            ) : (
              <GatedCompanionGrid companions={relevantCompanions} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
