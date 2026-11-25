'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CompanionCard } from '@/components/companion/companion-card';
import { CompanionCardSkeleton } from '@/components/companion/companion-card-skeleton';
import { CompareModal } from '@/components/companion/compare-modal';
import { TiltCard } from '@/components/landing/tilt-card';
import { Companion } from '@/lib/types';
import { mapApiCompanionToCard } from '@/lib/companion-mapper';
import { useToast } from '@/components/ui/toast';

const FILTERS = [
  { id: 'all', label: 'All Top Rated' },
  { id: 'freeToday', label: 'Free Today' },
  { id: 'weekend', label: 'Weekend Only' },
  { id: 'womenOnly', label: 'Women Hosts' },
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
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [companionsList, setCompanionsList] = useState<Companion[]>(initialCompanions || []);
  const [internalLoading, setInternalLoading] = useState<boolean>(
    !initialCompanions || initialCompanions.length === 0
  );
  const [compareList, setCompareList] = useState<Companion[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleToggleCompare = (comp: Companion) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === comp.id);
      if (exists) return prev.filter((c) => c.id !== comp.id);
      if (prev.length >= 3) {
        toast({
          title: 'Compare Limit Reached',
          description: 'You can compare up to 3 companions at once.',
        });
        return prev;
      }
      const next = [...prev, comp];
      if (next.length >= 2) {
        setIsCompareOpen(true);
      } else {
        toast({
          title: 'Added to Compare',
          description: `Select 1 more companion to compare alongside ${comp.name}.`,
        });
      }
      return next;
    });
  };

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

    fetch('/api/companions?limit=12', { cache: 'no-store' })
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
    if (activeFilter === 'womenOnly') return comp.acceptsWomenOnly || comp.gender === 'female';
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
                onClick={() => setActiveFilter(f.id)}
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
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredCompanions.map((comp) => (
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
                    isCompared={compareList.some((c) => c.id === comp.id)}
                    initialBookmarked={savedIds.includes(comp.id)}
                    onCompareClick={handleToggleCompare}
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
    </div>
  );
}
