'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bookmark, Languages, Plus, Check } from 'lucide-react';
import { Companion } from '@/lib/types';
import { ACTIVITIES } from '@/lib/data/activities';
import { formatRupees } from '@/lib/utils';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';

interface CompanionCardProps {
  companion: Companion;
  featured?: boolean;
  isLocked?: boolean;
  isCompared?: boolean;
  initialBookmarked?: boolean;
  onUnlockClick?: (companion: Companion) => void;
  onCompareClick?: (companion: Companion) => void;
}

export function CompanionCard({
  companion,
  isCompared = false,
  initialBookmarked = false,
  onCompareClick,
}: CompanionCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const displayActivities =
    companion.rawActivities && companion.rawActivities.length > 0
      ? companion.rawActivities.map((label, idx) => {
          const fallbackSlug =
            companion.activities[idx] || companion.activities[0] || 'coffee-chat';
          return {
            key: `${label}-${idx}`,
            name: label,
            slug: fallbackSlug,
          };
        })
      : companion.activities
          .map((slug) => ACTIVITIES.find((a) => a.slug === slug))
          .filter(Boolean)
          .map((act) => ({
            key: act!.slug,
            name: act!.name,
            slug: act!.slug,
          }));

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    if (isAuthenticated) {
      try {
        const res = await fetch('/api/companions/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companionId: companion.id }),
        });
        if (res.ok) {
          const data = await res.json();
          setIsBookmarked(Boolean(data.saved));
        }
      } catch {
        // Ignore transient network error
      }
    } else if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('meetzy_saved_companions') || '[]') as string[];
        const updated = nextState
          ? Array.from(new Set([...stored, companion.id]))
          : stored.filter((id) => id !== companion.id);
        localStorage.setItem('meetzy_saved_companions', JSON.stringify(updated));
      } catch {}
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('companio:bookmarks-updated'));
    }

    toast({
      title: nextState ? 'Saved to Favorites' : 'Removed from Favorites',
      description: nextState
        ? `${companion.name} was added to your Saved favorites.`
        : `${companion.name} was removed from your Saved favorites.`,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onCompareClick) {
      onCompareClick(companion);
    } else {
      toast({
        title: 'Compare Companions',
        description: `Visit Explore to compare ${companion.name} side-by-side.`,
      });
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border-2 border-ink bg-white p-3 shadow-brutal hover:shadow-brutal-lg transition-all duration-200">
      <div>
        {/* Large Prominent Clear Photo with Embedded Name & City Overlay */}
        <Link href={`/companions/${companion.id}`} className="block">
          <div className="relative aspect-[3.2/4] w-full overflow-hidden rounded-xl border-2 border-ink bg-paper-deep">
            <Image
              src={companion.avatarUrl}
              alt={companion.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Top-Left Status Tag */}
            <div className="absolute top-2.5 left-2.5 z-20">
              <span
                className={`rounded-full border border-ink/40 px-2.5 py-0.5 text-[10px] font-black uppercase text-ink shadow-brutal-xs ${
                  companion.isFreeToday ? 'bg-[#D4F7A5]' : 'bg-lavender-soft/95'
                }`}
              >
                {companion.isFreeToday ? 'Available' : 'New'}
              </span>
            </div>

            {/* Bottom Photo Gradient & Clean Identity */}
            <div className="absolute inset-x-0 bottom-0 z-15 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-10 text-white">
              <h3 className="font-display text-lg sm:text-xl font-black text-white leading-tight truncate">
                {companion.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-white/90">
                <MapPin className="h-3.5 w-3.5 text-white/80 shrink-0" />
                <span className="truncate">
                  {companion.area || companion.city}, {companion.age}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Top-Right Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmarkToggle}
          className={`absolute top-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink shadow-brutal-xs hover:scale-105 transition-transform cursor-pointer ${
            isBookmarked ? 'bg-sunny' : 'bg-white'
          }`}
          aria-label="Bookmark companion"
        >
          <Bookmark className={`h-4 w-4 text-ink ${isBookmarked ? 'fill-ink' : ''}`} />
        </button>

        {/* Clean Bio (2 Lines) */}
        <p className="mt-3 font-body text-xs text-ink-soft leading-relaxed line-clamp-2 min-h-[2.25rem]">
          {companion.about || companion.tagline}
        </p>

        {/* Languages Row */}
        {companion.languages && companion.languages.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-ink-muted truncate">
            <Languages className="h-3.5 w-3.5 text-ink-muted shrink-0" />
            <span className="truncate">{companion.languages.join(' · ')}</span>
          </div>
        )}

        {/* Registered Hobbies & Hourly Rate Row */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 min-w-0">
            {displayActivities.slice(0, 2).map((act) => (
              <span
                key={act.key}
                className="inline-flex items-center gap-1 rounded-lg border border-ink/20 bg-paper-deep px-2 py-0.5 text-[11px] font-bold text-ink"
              >
                <ActivityIcon slug={act.slug} size="xs" />
                <span className="truncate max-w-[90px]">{act.name}</span>
              </span>
            ))}
            {displayActivities.length > 2 && (
              <span className="rounded-lg border border-ink/20 bg-paper px-1.5 py-0.5 text-[10px] font-bold text-ink-muted">
                +{displayActivities.length - 2}
              </span>
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="font-display text-sm sm:text-base font-black text-ink">
              {formatRupees(companion.hourlyRate)}
              <span className="text-[11px] font-bold text-ink-muted"> / hour</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer: + Compare & View Profile */}
      <div className="mt-4 pt-2.5 border-t border-ink/10 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCompare}
          className={`inline-flex items-center justify-center gap-1 rounded-xl border-2 border-ink px-3 py-2 font-display text-xs font-black shadow-brutal-xs transition-all cursor-pointer ${
            isCompared ? 'bg-[#D4F7A5] text-ink' : 'bg-white text-ink hover:bg-paper'
          }`}
        >
          {isCompared ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Compare</span>
            </>
          )}
        </button>

        <Link
          href={`/companions/${companion.id}`}
          className="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-ink bg-ink text-white py-2 px-3 font-display text-xs font-black shadow-brutal-xs hover:bg-black transition-all text-center"
        >
          <span>View profile</span>
        </Link>
      </div>
    </div>
  );
}
