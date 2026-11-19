'use client';

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FilterBar } from '@/components/companion/filter-bar';
import { CompanionCard } from '@/components/companion/companion-card';
import { COMPANIONS } from '@/lib/data/companions';
import { ActivityCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, Search } from 'lucide-react';

interface SearchSyncProps {
  onSync: (city: string, activity: ActivityCategory | 'all', freeToday: boolean) => void;
}

function SearchParamsSync({ onSync }: SearchSyncProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const city = searchParams.get('city') || 'all';
    const activity = (searchParams.get('activity') as ActivityCategory) || 'all';
    const freeToday = searchParams.get('freeToday') === 'true';
    onSync(city, activity, freeToday);
  }, [searchParams, onSync]);

  return null;
}

export default function ExplorePage() {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityCategory | 'all'>('all');
  const [freeTodayOnly, setFreeTodayOnly] = useState<boolean>(false);
  const [womenOnlyHosts, setWomenOnlyHosts] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [companionsList, setCompanionsList] = useState(COMPANIONS);

  useEffect(() => {
    // Fetch live companions from database and merge
    fetch('/api/companions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.companions)) {
          setCompanionsList((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const newFromDb = data.companions
              .filter((c: any) => !existingIds.has(c.id))
              .map((c: any) => ({
                id: c.id,
                name: c.displayName || c.name,
                age: 24,
                gender: 'female' as const,
                city: c.citySlug || (c.city ? c.city.toLowerCase() : 'bengaluru'),
                area: c.city || 'Central',
                tagline: c.shortBio || 'Verified local companion',
                about: c.bio || c.shortBio || 'Happy to explore cafes and culture.',
                avatarUrl: c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                languages: c.spokenLanguages || ['English', 'Hindi'],
                hourlyRate: c.hourlyRate || 499,
                verifiedId: true,
                verifiedPhoto: true,
                rating: c.ratingAverage || 5.0,
                reviewCount: c.totalReviews || 0,
                meetupsCount: 1,
                activities: ['coffee-chat' as ActivityCategory, 'walk-and-talk' as ActivityCategory],
                isFreeToday: c.isAvailable ?? true,
                acceptsWomenOnly: false,
                memberSince: '2026',
                availability: [
                  { days: 'Mon — Fri', hours: '18:00 – 21:00' },
                  { days: 'Sat — Sun', hours: '11:00 – 20:00' },
                ],
                reviews: [],
              }));
            return [...newFromDb, ...prev];
          });
        }
      })
      .catch((err) => console.error('Failed to sync live companions:', err));
  }, []);

  const handleSyncParams = useCallback(
    (city: string, activity: ActivityCategory | 'all', freeToday: boolean) => {
      setSelectedCity(city);
      setSelectedActivity(activity);
      setFreeTodayOnly(freeToday);
    },
    []
  );

  const filteredCompanions = useMemo(() => {
    return companionsList.filter((comp) => {
      // City filter
      if (selectedCity !== 'all' && comp.city !== selectedCity) {
        return false;
      }
      // Activity filter
      if (selectedActivity !== 'all' && !comp.activities.includes(selectedActivity)) {
        return false;
      }
      // Free today filter
      if (freeTodayOnly && !comp.isFreeToday) {
        return false;
      }
      // Women-only hosts filter
      if (womenOnlyHosts && !comp.acceptsWomenOnly && comp.gender !== 'female') {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(query);
        const matchesArea = comp.area.toLowerCase().includes(query);
        const matchesTagline = comp.tagline.toLowerCase().includes(query);
        const matchesAbout = comp.about.toLowerCase().includes(query);
        const matchesLanguage = comp.languages.some((l) => l.toLowerCase().includes(query));
        if (!matchesName && !matchesArea && !matchesTagline && !matchesAbout && !matchesLanguage) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCity, selectedActivity, freeTodayOnly, womenOnlyHosts, searchQuery]);

  const handleReset = () => {
    setSelectedCity('all');
    setSelectedActivity('all');
    setFreeTodayOnly(false);
    setWomenOnlyHosts(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Suspense fallback={null}>
        <SearchParamsSync onSync={handleSyncParams} />
      </Suspense>

      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Page Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5">
              <Badge variant="lime" size="sm">
                Verified Directory
              </Badge>
              <Badge variant="lavender" size="sm">
                100% Platonic Meetups
              </Badge>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-ink tracking-tight">
              Explore Verified Local Companions
            </h1>

            <p className="font-body text-sm sm:text-base text-ink-soft max-w-3xl leading-relaxed">
              Browse ID-checked local companions across India. Filter by city, activity, hourly rate, or same-day availability. Every meetup is escrow-protected and verified via a 4-digit code.
            </p>
          </div>

          {/* Sticky Filter Bar */}
          <FilterBar
            selectedCity={selectedCity}
            selectedActivity={selectedActivity}
            freeTodayOnly={freeTodayOnly}
            womenOnlyHosts={womenOnlyHosts}
            searchQuery={searchQuery}
            onCityChange={setSelectedCity}
            onActivityChange={setSelectedActivity}
            onFreeTodayChange={setFreeTodayOnly}
            onWomenOnlyHostsChange={setWomenOnlyHosts}
            onSearchChange={setSearchQuery}
            onReset={handleReset}
            totalCount={filteredCompanions.length}
          />

          {/* Companions Results Grid */}
          {filteredCompanions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCompanions.map((companion) => (
                <CompanionCard key={companion.id} companion={companion} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border-brutal bg-white p-12 text-center space-y-4 shadow-brutal-sm max-w-md mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-brutal bg-sunny shadow-brutal-sm text-ink">
                <Search className="h-8 w-8 stroke-[2.25]" />
              </div>
              <h3 className="font-display text-xl font-black text-ink">
                No companions found matching these filters
              </h3>
              <p className="font-body text-xs sm:text-sm text-ink-soft">
                Try clearing your search query or selecting a different city or activity.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border-brutal bg-lime px-5 py-2.5 font-display text-xs font-black text-ink shadow-brutal-sm btn-press cursor-pointer"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

