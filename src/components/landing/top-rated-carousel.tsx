'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CompanionCard } from '@/components/companion/companion-card';
import { CompareModal } from '@/components/companion/compare-modal';
import { TiltCard } from '@/components/landing/tilt-card';
import { Companion, ActivityCategory } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

const FILTERS = [
  { id: 'all', label: 'All Top Rated' },
  { id: 'freeToday', label: 'Free Today' },
  { id: 'weekend', label: 'Weekend Only' },
  { id: 'womenOnly', label: 'Women Hosts' },
];

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

interface TopRatedCarouselProps {
  companions?: Companion[];
}

export function TopRatedCarousel({ companions: initialCompanions }: TopRatedCarouselProps) {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [companionsList, setCompanionsList] = useState<Companion[]>(initialCompanions || []);
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
      return;
    }

    fetch('/api/companions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.companions)) {
          const mapped: Companion[] = data.companions.map((c: any) => ({
            id: c.id,
            name: c.displayName || c.name,
            age: 24,
            gender: (c.gender === 'male' ? 'male' : 'female') as 'female' | 'male',
            city: c.citySlug,
            area: c.city,
            tagline: c.shortBio || 'Verified local companion',
            about: c.bio || c.shortBio || '',
            avatarUrl: c.avatarUrl || 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/ananya-del.jpg',
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
          setCompanionsList(mapped);
        }
      })
      .catch((err) => console.error('Failed to load top rated companions:', err));
  }, [initialCompanions]);

  const filteredCompanions = companionsList.filter((comp) => {
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
                <CompanionCard
                  companion={comp}
                  isCompared={compareList.some((c) => c.id === comp.id)}
                  onCompareClick={handleToggleCompare}
                />
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
