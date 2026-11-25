'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FilterBar } from '@/components/companion/filter-bar';
import { CompanionCard } from '@/components/companion/companion-card';
import { CompanionCardSkeleton } from '@/components/companion/companion-card-skeleton';
import { CompareModal } from '@/components/companion/compare-modal';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';
import { Companion, ActivityCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { mapApiCompanionToCard } from '@/lib/companion-mapper';
import { Search, Loader2, Scale, ChevronDown } from 'lucide-react';

const PAGE_SIZE = 12;

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

interface ExploreClientProps {
  initialCompanions: Companion[];
  initialTotal: number;
  initialHasMore: boolean;
  initialCityCounts: Record<string, number>;
  initialCity: string;
  initialActivity: ActivityCategory | 'all';
  initialFreeToday: boolean;
  initialWomenOnly: boolean;
  initialQuery: string;
}

export function ExploreClient({
  initialCompanions,
  initialTotal,
  initialHasMore,
  initialCityCounts,
  initialCity,
  initialActivity,
  initialFreeToday,
  initialWomenOnly,
  initialQuery,
}: ExploreClientProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [compareList, setCompareList] = useState<Companion[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedActivity, setSelectedActivity] = useState<ActivityCategory | 'all'>(initialActivity);
  const [freeTodayOnly, setFreeTodayOnly] = useState<boolean>(initialFreeToday);
  const [womenOnlyHosts, setWomenOnlyHosts] = useState<boolean>(initialWomenOnly);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery);

  const [companionsList, setCompanionsList] = useState<Companion[]>(initialCompanions);
  const [cityCounts, setCityCounts] = useState<Record<string, number>>(initialCityCounts);
  const [totalMatches, setTotalMatches] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const didMountRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 220);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchCompanionsPage = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const params = new URLSearchParams();
        params.set('page', String(targetPage));
        params.set('limit', String(PAGE_SIZE));
        if (selectedCity !== 'all') params.set('city', selectedCity);
        if (selectedActivity !== 'all') params.set('activity', selectedActivity);
        if (freeTodayOnly) params.set('freeToday', 'true');
        if (womenOnlyHosts) params.set('womenOnly', 'true');
        if (debouncedQuery) params.set('q', debouncedQuery);

        const res = await fetch(`/api/companions?${params.toString()}`, {
          cache: 'no-store',
        });
        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.companions)) {
          const mapped = data.companions.map(mapApiCompanionToCard);
          setCompanionsList((prev) => {
            if (!append) return mapped;
            const seen = new Set(prev.map((c) => c.id));
            const uniqueNext = mapped.filter((c: Companion) => !seen.has(c.id));
            return [...prev, ...uniqueNext];
          });
          setTotalMatches(Number(data.total ?? mapped.length));
          setHasMore(Boolean(data.hasMore));
          setPage(targetPage);
          if (data.cityCounts && typeof data.cityCounts === 'object') {
            setCityCounts(data.cityCounts);
          }
        }
      } catch (err) {
        console.error('Failed to load companions:', err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [selectedCity, selectedActivity, freeTodayOnly, womenOnlyHosts, debouncedQuery]
  );

  // Skip initial fetch so SSR data stays visible immediately with zero layout shift
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    fetchCompanionsPage(1, false);
  }, [fetchCompanionsPage]);

  const loadBookmarks = useCallback(() => {
    if (isAuthenticated) {
      fetch('/api/companions/bookmarks', { cache: 'no-store' })
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

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

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

  const handleReset = () => {
    setSelectedCity('all');
    setSelectedActivity('all');
    setFreeTodayOnly(false);
    setWomenOnlyHosts(false);
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Suspense fallback={null}>
        <SearchParamsSync onSync={handleSyncParams} />
      </Suspense>

      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
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
              Browse mobile-verified local companions across India. Filter by city, hobby, or availability, compare profiles side-by-side, save favorites, and book safely with escrow protection.
            </p>
          </div>

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
            totalCount={totalMatches}
            cityCounts={cityCounts}
          />

          {isLoading ? (
            <div
              aria-label="Loading verified companions"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                <CompanionCardSkeleton key={idx} />
              ))}
            </div>
          ) : companionsList.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {companionsList.map((companion, idx) => (
                  <CompanionCard
                    key={companion.id}
                    companion={companion}
                    priority={idx < 4}
                    isCompared={compareList.some((c) => c.id === companion.id)}
                    initialBookmarked={savedIds.includes(companion.id)}
                    onCompareClick={handleToggleCompare}
                  />
                ))}
              </div>

              <div className="flex flex-col items-center justify-center gap-3 pt-2">
                <p className="font-display text-xs font-black uppercase tracking-wider text-ink-muted">
                  Showing {companionsList.length} of {totalMatches} verified hosts
                </p>

                {hasMore && (
                  <button
                    type="button"
                    disabled={isLoadingMore}
                    onClick={() => fetchCompanionsPage(page + 1, true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-lime px-7 py-3 font-display text-sm font-black text-ink shadow-brutal hover:bg-sunny transition-all btn-press cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-ink" />
                        <span>Loading more hosts...</span>
                      </>
                    ) : (
                      <>
                        <span>Show More Companions</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
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
