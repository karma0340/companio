'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CompanionCard } from '@/components/companion/companion-card';
import { CompanionCardSkeleton } from '@/components/companion/companion-card-skeleton';
import { TiltCard } from '@/components/landing/tilt-card';
import { Companion } from '@/lib/types';
import { mapApiCompanionToCard } from '@/lib/companion-mapper';

const FILTERS = [
  { id: 'all', label: 'All Top Rated' },
  { id: 'freeToday', label: 'Free Today' },
  { id: 'weekend', label: 'Weekend Only' },
  { id: 'womenOnly', label: 'Women Hosts' },
  { id: 'menOnly', label: 'Men Hosts' },
];

interface TopRatedCarouselProps {
  companions?: Companion[];
  isLoading?: boolean;
  savedIds?: string[];
  showExploreButton?: boolean;
}

export function TopRatedCarousel({
  companions: initialCompanions,
  isLoading: externalLoading = false,
  savedIds = [],
  showExploreButton = true,
}: TopRatedCarouselProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [companionsList, setCompanionsList] = useState<Companion[]>(initialCompanions || []);
  const [internalLoading, setInternalLoading] = useState<boolean>(
    !initialCompanions || initialCompanions.length === 0
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCompanions && initialCompanions.length > 0) {
      setCompanionsList(initialCompanions);
      setInternalLoading(false);
      return;
    }

    if (externalLoading) {
      setInternalLoading(true);
      return;
    }

    fetch('/api/companions?limit=48', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.companions)) {
          setCompanionsList(data.companions.map(mapApiCompanionToCard));
        }
      })
      .catch((err) => console.error('Failed to load companions:', err))
      .finally(() => setInternalLoading(false));
  }, [initialCompanions, externalLoading]);

  const loading = externalLoading || (companionsList.length === 0 && internalLoading);

  const filteredCompanions = companionsList.filter((comp) => {
    if (activeFilter === 'freeToday') return comp.isFreeToday;
    if (activeFilter === 'weekend') return comp.isWeekendOnly;
    if (activeFilter === 'womenOnly') return comp.gender === 'female';
    if (activeFilter === 'menOnly') return comp.gender === 'male';
    return true;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setActiveFilter(f.id);
                  if (scrollRef.current) scrollRef.current.scrollLeft = 0;
                }}
                className={`rounded-full border-brutal-sm px-3.5 py-1.5 font-display text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink text-ink shadow-brutal-xs scale-105'
                    : 'bg-white text-ink-soft hover:bg-paper-deep hover:text-ink'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Swipe Arrow Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous companions"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-white text-ink shadow-brutal-xs hover:bg-sunny active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next companions"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-white text-ink shadow-brutal-xs hover:bg-sunny active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal 4-Card Desktop Swipe Slider */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <CompanionCardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredCompanions.length === 0 ? (
        <div className="rounded-2xl border-brutal bg-white p-8 text-center shadow-brutal-sm space-y-3">
          <p className="font-display text-base font-black text-ink">
            No hosts match this quick filter right now.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="inline-flex items-center gap-2 rounded-xl border-brutal-sm bg-lime px-4 py-2 font-display text-xs font-black text-ink shadow-brutal-xs hover:bg-sunny cursor-pointer"
          >
            Show All Top Rated
          </button>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredCompanions.map((comp, idx) => (
              <motion.div
                key={comp.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                className="w-[270px] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] shrink-0 snap-start"
              >
                <TiltCard maxTilt={4}>
                  <CompanionCard
                    companion={comp}
                    priority={idx < 4}
                    initialBookmarked={savedIds.includes(comp.id)}
                  />
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {showExploreButton && (
        <div className="flex justify-center pt-1">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-lime px-6 py-3 font-display text-sm font-black text-ink shadow-brutal hover:bg-sunny transition-all btn-press"
          >
            <span>Explore More Profiles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
