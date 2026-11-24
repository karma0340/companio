'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bookmark, Lock, Languages, Plus } from 'lucide-react';
import { Companion } from '@/lib/types';
import { ACTIVITIES } from '@/lib/data/activities';
import { formatRupees } from '@/lib/utils';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { useToast } from '@/components/ui/toast';

interface CompanionCardProps {
  companion: Companion;
  featured?: boolean;
  isLocked?: boolean;
  onUnlockClick?: (companion: Companion) => void;
  onCompareClick?: (companion: Companion) => void;
}

export function CompanionCard({
  companion,
  featured = false,
  isLocked = false,
  onUnlockClick,
  onCompareClick,
}: CompanionCardProps) {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Map activity slugs to icons and names
  const companionActivities = companion.activities.map((slug) => {
    return ACTIVITIES.find((a) => a.slug === slug);
  }).filter(Boolean);

  const displayName = isLocked
    ? `${companion.name.slice(0, 3)}...`
    : companion.name;

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    toast({
      title: nextState ? 'Companion Saved' : 'Companion Removed',
      description: nextState
        ? `${companion.name} was saved to your list.`
        : `${companion.name} was removed from your list.`,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onCompareClick) {
      onCompareClick(companion);
    } else {
      toast({
        title: 'Added to Compare',
        description: `${companion.name} added to comparison list.`,
      });
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border-2 border-ink bg-white p-3 shadow-brutal hover:shadow-brutal-lg transition-all duration-200">
      <div>
        {/* Large Prominent Photo with Embedded Name & City Overlay */}
        <div className="relative aspect-[3.2/4] w-full overflow-hidden rounded-xl border-2 border-ink bg-paper-deep">
          <Image
            src={companion.avatarUrl}
            alt={companion.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isLocked ? 'filter blur-[5px] scale-105' : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Top-Left New Tag */}
          <div className="absolute top-2.5 left-2.5 z-20">
            <span className="rounded-full border border-ink/40 bg-lavender-soft/95 px-2.5 py-0.5 text-[10px] font-black uppercase text-ink shadow-brutal-xs">
              New
            </span>
          </div>

          {/* Top-Right Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmarkToggle}
            className={`absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-white shadow-brutal-xs hover:scale-105 transition-transform cursor-pointer ${
              isBookmarked ? 'bg-sunny' : 'bg-white'
            }`}
            aria-label="Bookmark companion"
          >
            <Bookmark className={`h-4 w-4 text-ink ${isBookmarked ? 'fill-ink' : ''}`} />
          </button>

          {/* Locked Silhouette Pass Overlay */}
          {isLocked && (
            <div
              onClick={() => onUnlockClick?.(companion)}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-white/95 px-3 py-1 font-display text-xs font-black text-ink shadow-brutal-xs hover:scale-105 transition-transform">
                <Lock className="h-3.5 w-3.5 text-ink" />
                <span>View pass</span>
              </div>
            </div>
          )}

          {/* Bottom Photo Gradient & Clean Identity */}
          <div className="absolute inset-x-0 bottom-0 z-15 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-10 text-white">
            <h3 className="font-display text-lg sm:text-xl font-black text-white leading-tight truncate">
              {displayName}
            </h3>
            <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-white/90">
              <MapPin className="h-3.5 w-3.5 text-white/80 shrink-0" />
              <span className="truncate">{companion.area || companion.city}, {companion.age}</span>
            </div>
          </div>
        </div>

        {/* Clean Bio (2 Lines) */}
        {isLocked ? (
          <p className="mt-3 font-body text-xs text-ink-muted leading-relaxed line-clamp-2 italic">
            Bio and personal vibe details are reserved for active Pass members.
          </p>
        ) : (
          <p className="mt-3 font-body text-xs text-ink-soft leading-relaxed line-clamp-2">
            {companion.about || companion.tagline}
          </p>
        )}

        {/* Languages Row */}
        {companion.languages && companion.languages.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-ink-muted truncate">
            <Languages className="h-3.5 w-3.5 text-ink-muted shrink-0" />
            <span className="truncate">{companion.languages.join(' · ')}</span>
          </div>
        )}

        {/* Activities & Hourly Rate Row */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 min-w-0">
            {companionActivities.slice(0, 2).map((act) => (
              <span
                key={act!.slug}
                className="inline-flex items-center gap-1 rounded-lg border border-ink/20 bg-paper-deep px-2 py-0.5 text-[11px] font-bold text-ink"
              >
                <ActivityIcon slug={act!.slug} size="xs" />
                <span className="truncate max-w-[90px]">{act!.name}</span>
              </span>
            ))}
            {companionActivities.length > 2 && (
              <span className="rounded-lg border border-ink/20 bg-paper px-1.5 py-0.5 text-[10px] font-bold text-ink-muted">
                +{companionActivities.length - 2}
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

      {/* Action Footer: + Compare & View/Unlock Profile */}
      <div className="mt-4 pt-2.5 border-t border-ink/10 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCompare}
          className="inline-flex items-center justify-center gap-1 rounded-xl border-2 border-ink bg-white px-3 py-2 font-display text-xs font-black text-ink shadow-brutal-xs hover:bg-paper transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Compare</span>
        </button>

        {isLocked ? (
          <button
            type="button"
            onClick={() => onUnlockClick?.(companion)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-ink bg-ink text-white py-2 px-3 font-display text-xs font-black shadow-brutal-xs hover:bg-black transition-all cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5 text-lime" />
            <span>Unlock profile</span>
          </button>
        ) : (
          <Link
            href={`/companions/${companion.id}`}
            className="flex-1 inline-flex items-center justify-center rounded-xl border-2 border-ink bg-ink text-white py-2 px-3 font-display text-xs font-black shadow-brutal-xs hover:bg-black transition-all text-center"
          >
            <span>View profile</span>
          </Link>
        )}
      </div>
    </div>
  );
}
