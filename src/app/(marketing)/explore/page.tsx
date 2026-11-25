'use client';

import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FilterBar } from '@/components/companion/filter-bar';
import { CompanionCard } from '@/components/companion/companion-card';
import { CompareModal } from '@/components/companion/compare-modal';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';
import { Companion, ActivityCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Scale } from 'lucide-react';

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

function mapToActivityCategories(activities: string[] = []): ActivityCategory[] {
  const mapping: Record<string, ActivityCategory> = {
    'coffee': 'coffee-chat',
    'cafe': 'coffee-chat',
    'shopping': 'shopping-buddy',
    'styling': 'shopping-buddy',
    'photo': 'photo-walk',
    'candid': 'photo-walk',
    'comedy': 'comedy-and-shows',
    'shows': 'comedy-and-shows',
    'city': 'city-guide',
    'walk': 'walk-and-talk',
    'gym': 'gym-partner',
    'fitness': 'gym-partner',
    'museum': 'city-guide',
    'art': 'city-guide',
    'book': 'study-buddy',
    'reading': 'study-buddy',
    'food': 'food-walk',
    'crawl': 'food-walk',
    'eats': 'food-walk',
    'co-working': 'career-chat',
    'career': 'career-chat',
    'badminton': 'sports-partner',
    'tennis': 'sports-partner',
    'cycling': 'sports-partner',
    'sports': 'sports-partner',
    'sunset': 'walk-and-talk',
    'board': 'gaming-partner',
    'arcade': 'gaming-partner',
    'games': 'gaming-partner',
    'flea': 'shopping-buddy',
    'thrifting': 'shopping-buddy',
    'movie': 'movie-buddy',
    'event': 'event-plus-one',
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
    if (!matched) {
      categories.add('coffee-chat');
    }
  }

  if (categories.size === 0) {
    categories.add('coffee-chat');
  }

  return Array.from(categories);
}

export default function ExplorePage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [compareList, setCompareList] = useState<Companion[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityCategory | 'all'>('all');
  const [freeTodayOnly, setFreeTodayOnly] = useState<boolean>(false);
  const [womenOnlyHosts, setWomenOnlyHosts] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [companionsList, setCompanionsList] = useState<Companion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/companions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.companions)) {
          const mapped: Companion[] = data.companions.map((c: any) => ({
            id: c.id,
            name: c.displayName || c.name,
            age: Number(c.age) || 24,
            gender: (c.gender === 'male' ? 'male' : 'female') as 'female' | 'male',
            city: (c.citySlug || (c.city ? c.city.toLowerCase() : 'chandigarh')).trim(),
            area: c.locality || c.city || 'Central Area',
            tagline: c.shortBio || 'Verified local companion',
            about: c.bio || c.shortBio || 'Engaging companion for genuine public meetups.',
            avatarUrl: c.avatarUrl || 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/ananya-del.jpg',
            languages: c.spokenLanguages || ['English', 'Hindi'],
            hourlyRate: Number(c.hourlyRate) || 499,
            verifiedId: true,
            verifiedPhoto: true,
            rating: Number(c.ratingAverage) || 4.9,
            reviewCount: Number(c.totalReviews) || 15,
            meetupsCount: Number(c.completedMeetups ?? c.totalReviews) || 0,
            activities: mapToActivityCategories(c.acceptedActivities || []),
            isFreeToday: c.isAvailable ?? true,
            acceptsWomenOnly: false,
            memberSince: '2026',
            availability: Array.isArray(c.availabilitySlots) && c.availabilitySlots.length > 0
              ? c.availabilitySlots.map((slot: string) => ({ days: slot, hours: 'Flexible Hours' }))
              : [
                  { days: 'Mon — Fri', hours: '18:00 – 21:00' },
                  { days: 'Sat — Sun', hours: '11:00 – 20:00' },
                ],
            reviews: [],
          }));
          setCompanionsList(mapped);
        }
      })
      .catch((err) => console.error('Failed to load database companions:', err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/companions/bookmarks')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && Array.isArray(data.companionIds)) {
            setSavedIds(data.companionIds);
          }
        })
        .catch(() => {});
    } else if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('meetzy_saved_companions') || '[]');
        if (Array.isArray(stored)) setSavedIds(stored);
      } catch {}
    }
  }, [isAuthenticated]);

  const handleToggleCompare = (comp: Companion) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === comp.id);
      if (exists) {
        return prev.filter((c) => c.id !== comp.id);
      }
      if (prev.length >= 3) {
        toast({
          title: 'Compare Limit Reached',
          description: 'You can compare up to 3 companions at once.',
        });
        return prev;
      }
      return [...prev, comp];
    });
  };

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
      if (selectedCity !== 'all' && comp.city !== selectedCity.toLowerCase()) {
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
  }, [companionsList, selectedCity, selectedActivity, freeTodayOnly, womenOnlyHosts, searchQuery]);

  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const comp of companionsList) {
      if (comp.city) {
        counts[comp.city.toLowerCase()] = (counts[comp.city.toLowerCase()] || 0) + 1;
      }
    }
    return counts;
  }, [companionsList]);

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
              Browse phone-verified local companions across India. Filter by city, activity, or same-day availability, compare profiles side-by-side, and book safely with escrow protection and 4-digit start codes.
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
            cityCounts={cityCounts}
          />

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="rounded-3xl border-brutal bg-white p-16 text-center space-y-4 shadow-brutal-sm max-w-md mx-auto">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-ink" />
              <h3 className="font-display text-lg font-black text-ink">
                Loading Verified Companions...
              </h3>
              <p className="font-body text-xs text-ink-muted">
                Connecting directly to PostgreSQL directory
              </p>
            </div>
          ) : filteredCompanions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredCompanions.map((companion) => (
                <CompanionCard
                  key={companion.id}
                  companion={companion}
                  isCompared={compareList.some((c) => c.id === companion.id)}
                  initialBookmarked={savedIds.includes(companion.id)}
                  onCompareClick={handleToggleCompare}
                />
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

      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl rounded-2xl border-3 border-ink bg-white px-4 py-3 shadow-brutal-lg flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 min-w-0">
            <Scale className="h-4 w-4 text-ink shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black text-ink truncate">
              {compareList.length} selected: {compareList.map((c) => c.name).join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCompareList([])}
              className="text-xs font-bold text-ink-muted hover:text-danger cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="rounded-xl border-2 border-ink bg-lime px-3.5 py-1.5 font-display text-xs font-black text-ink shadow-brutal-xs hover:bg-sunny transition cursor-pointer"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        companions={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((c) => c.id !== id))}
        onClear={() => {
          setCompareList([]);
          setIsCompareOpen(false);
        }}
      />

      <Footer />
    </div>
  );
}
