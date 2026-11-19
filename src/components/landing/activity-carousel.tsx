'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { ACTIVITIES } from '@/lib/data/activities';

const CATEGORIES = [
  { id: 'all', label: 'All 17 Activities' },
  { id: 'popular', label: 'Trending & Popular' },
  { id: 'food', label: 'Food & Cafes' },
  { id: 'fitness', label: 'Fitness & Sports' },
  { id: 'culture', label: 'Culture & Shows' },
  { id: 'city', label: 'City & Social' },
];

export function ActivityCarousel() {
  const [activeCategory, setActiveCategory] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredActivities = ACTIVITIES.filter((act) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'popular') {
      return ['gym-partner', 'movie-buddy', 'coffee-chat', 'food-walk', 'shopping-buddy', 'photo-walk'].includes(act.slug);
    }
    if (activeCategory === 'food') {
      return ['coffee-chat', 'food-walk'].includes(act.slug);
    }
    if (activeCategory === 'fitness') {
      return ['gym-partner', 'sports-partner', 'walk-and-talk'].includes(act.slug);
    }
    if (activeCategory === 'culture') {
      return ['movie-buddy', 'comedy-and-shows', 'photo-walk', 'festival-buddy', 'gaming-partner', 'event-plus-one'].includes(act.slug);
    }
    if (activeCategory === 'city') {
      return ['city-guide', 'shopping-buddy', 'career-chat', 'study-buddy', 'settle-in-buddy', 'travel-buddy'].includes(act.slug);
    }
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
      {/* Category Pills & Scroll Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full border-brutal-sm px-3.5 py-1.5 font-display text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-ink text-paper shadow-brutal-xs scale-105'
                    : 'bg-white text-ink-soft hover:bg-paper-deep hover:text-ink'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Carousel Next/Prev Controls */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-white text-ink shadow-brutal-xs hover:bg-sunny active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-white text-ink shadow-brutal-xs hover:bg-sunny active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Smooth Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence mode="popLayout">
          {filteredActivities.map((act) => (
            <motion.div
              key={act.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="w-[260px] sm:w-[280px] shrink-0 snap-start"
            >
              <Link
                href={`/explore/${act.slug}`}
                className="group relative flex flex-col justify-between h-[210px] rounded-2xl border-brutal bg-white p-5 shadow-brutal hover:shadow-brutal-lg transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Subtle colored accent glow in corner */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 pointer-events-none translate-x-8 -translate-y-8"
                  style={{ backgroundColor: act.bgHex || '#C6F432' }}
                />

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <ActivityIcon
                      slug={act.slug}
                      size="md"
                      variant="tile"
                      bgVariant={
                        act.slug === 'gym-partner' || act.slug === 'sports-partner'
                          ? 'lime'
                          : act.slug === 'movie-buddy' || act.slug === 'festival-buddy'
                          ? 'sunny'
                          : act.slug === 'shopping-buddy' || act.slug === 'comedy-and-shows'
                          ? 'pink'
                          : act.slug === 'city-guide' || act.slug === 'photo-walk' || act.slug === 'travel-buddy'
                          ? 'sky'
                          : act.slug === 'event-plus-one' || act.slug === 'gaming-partner'
                          ? 'lavender'
                          : 'paper'
                      }
                      animated
                    />
                    <span className="rounded-md border-brutal-sm bg-paper-deep px-2 py-0.5 text-[10px] font-black uppercase text-ink-muted">
                      Activity
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-black text-ink group-hover:text-lavender transition-colors">
                    {act.name}
                  </h3>
                  <p className="font-body text-xs text-ink-soft mt-1 line-clamp-2 leading-relaxed">
                    {act.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t-brutal-sm flex items-center justify-between text-xs font-black text-ink">
                  <span>Explore Hosts</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paper group-hover:bg-lime group-hover:translate-x-1 transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
