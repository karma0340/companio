'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { CompanionCard } from '@/components/companion/companion-card';
import { TiltCard } from '@/components/landing/tilt-card';
import { COMPANIONS } from '@/lib/data/companions';

const FILTERS = [
  { id: 'all', label: 'All Top Rated' },
  { id: 'freeToday', label: 'Free Today' },
  { id: 'weekend', label: 'Weekend Only' },
  { id: 'womenOnly', label: 'Women Hosts' },
];

export function TopRatedCarousel() {
  const [activeFilter, setActiveFilter] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredCompanions = COMPANIONS.filter((comp) => {
    if (activeFilter === 'freeToday') return comp.isFreeToday;
    if (activeFilter === 'weekend') return comp.isWeekendOnly;
    if (activeFilter === 'womenOnly') return comp.acceptsWomenOnly || comp.gender === 'female';
    return true;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
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

        {/* Arrow Controls */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
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

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence mode="popLayout">
          {filteredCompanions.map((comp) => (
            <motion.div
              key={comp.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="w-[310px] sm:w-[350px] shrink-0 snap-start"
            >
              <TiltCard maxTilt={5}>
                <CompanionCard companion={comp} />
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
