import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShieldCheck, Camera, MapPin, ArrowRight, Calendar, Sparkles, Lock } from 'lucide-react';
import { Companion } from '@/lib/types';
import { ACTIVITIES } from '@/lib/data/activities';
import { formatRupees } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { StatusPulse } from '@/components/ui/status-pulse';

interface CompanionCardProps {
  companion: Companion;
  featured?: boolean;
  isLocked?: boolean;
  onUnlockClick?: (companion: Companion) => void;
}

export function CompanionCard({
  companion,
  featured = false,
  isLocked = false,
  onUnlockClick,
}: CompanionCardProps) {
  // Map activity slugs to icons and names
  const companionActivities = companion.activities.map((slug) => {
    return ACTIVITIES.find((a) => a.slug === slug);
  }).filter(Boolean);

  const displayName = isLocked
    ? `${companion.name.slice(0, 3)}...`
    : companion.name;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border-brutal bg-white p-3.5 sm:p-4 shadow-brutal hover:shadow-brutal-lg transition-all duration-200">
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-1.5 pb-2.5">
          {companion.isFreeToday ? (
            <Badge variant="lime" size="sm" className="inline-flex items-center gap-1 text-[11px] py-0 px-2">
              <StatusPulse size="xs" status="active" />
              <span>Free Today</span>
            </Badge>
          ) : companion.isWeekendOnly ? (
            <Badge variant="sunny" size="sm" className="inline-flex items-center gap-1 text-[11px] py-0 px-2">
              <Calendar className="h-3 w-3 stroke-[2.25]" />
              <span>Weekend Only</span>
            </Badge>
          ) : (
            <Badge variant="paper" size="sm" className="inline-flex items-center gap-1 text-[11px] py-0 px-2">
              <Sparkles className="h-3 w-3 stroke-[2.25] text-sunny" />
              <span>Available</span>
            </Badge>
          )}

          {companion.acceptsWomenOnly && (
            <Badge variant="pink" size="sm" className="inline-flex items-center gap-1 text-[11px] py-0 px-2">
              <ShieldCheck className="h-3 w-3 stroke-[2.25] text-pink-700" />
              <span>Women-Only</span>
            </Badge>
          )}
        </div>

        {/* Photo & Quick Metrics */}
        <div className="relative aspect-[3.6/4] w-full overflow-hidden rounded-xl border-brutal bg-paper-deep">
          <Image
            src={companion.avatarUrl}
            alt={companion.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isLocked ? 'filter blur-[5px] scale-105' : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {isLocked ? (
            <div
              onClick={() => onUnlockClick?.(companion)}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-white/95 px-3 py-1 font-display text-xs font-black text-ink shadow-brutal-xs hover:scale-105 transition-transform">
                <Lock className="h-3.5 w-3.5 text-ink" />
                <span>View pass</span>
              </div>
            </div>
          ) : (
            /* Verification Overlays */
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {companion.verifiedId && (
                <span className="flex items-center gap-1 rounded-md border-brutal-sm bg-lime px-1.5 py-0.5 text-[9px] font-black uppercase text-ink shadow-brutal-xs">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  Verified ID
                </span>
              )}
              {companion.verifiedPhoto && (
                <span className="flex items-center gap-1 rounded-md border-brutal-sm bg-sunny px-1.5 py-0.5 text-[9px] font-black uppercase text-ink shadow-brutal-xs">
                  <Camera className="h-2.5 w-2.5" />
                  Live Match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Name, Age, Rating */}
        <div className="mt-3 flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <h3 className="font-display text-lg sm:text-xl font-black text-ink truncate">
              {displayName}
            </h3>
            <span className="font-display text-xs sm:text-sm font-bold text-ink-muted shrink-0">· {companion.age}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 rounded-lg border-brutal-sm bg-sunny-soft px-1.5 py-0.5 text-[11px] font-black text-ink shadow-brutal-xs shrink-0">
            <Star className="h-3 w-3 fill-ink text-ink" />
            <span>{companion.rating.toFixed(1)}</span>
            <span className="text-[9px] text-ink-muted font-bold">({companion.meetupsCount})</span>
          </div>
        </div>

        {/* Area & City + Gender Tag */}
        <div className="mt-1 flex items-center justify-between text-xs font-extrabold text-ink-soft">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 text-ink shrink-0" />
            <span className="truncate">{companion.area}</span>
          </div>
          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded border border-ink/20 bg-paper-deep text-ink-muted shrink-0">
            {companion.gender === 'female' ? 'Female' : 'Male'}
          </span>
        </div>

        {/* Languages */}
        {companion.languages && companion.languages.length > 0 && (
          <div className="mt-1 text-[11px] font-bold text-ink-muted truncate">
            {companion.languages.join(' · ')}
          </div>
        )}

        {/* Tagline / Bio Teaser */}
        {isLocked ? (
          <p className="mt-2 font-body text-[11px] font-medium leading-snug text-ink-muted line-clamp-2 italic bg-paper/60 p-1.5 rounded-lg border border-ink/10">
            Bio and personal vibe details are reserved for active Pass members.
          </p>
        ) : (
          <p className="mt-2 line-clamp-2 font-body text-xs font-medium leading-relaxed text-ink-soft">
            "{companion.tagline}"
          </p>
        )}

        {/* Activity Pills */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {companionActivities.slice(0, 2).map((act) => (
            <span
              key={act!.slug}
              className="group/pill inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-paper-deep px-1.5 py-0.5 text-[10px] font-bold text-ink"
            >
              <ActivityIcon slug={act!.slug} size="xs" animated />
              <span className="truncate max-w-[100px]">{act!.name}</span>
            </span>
          ))}
          {companionActivities.length > 2 && (
            <span className="rounded-lg border-brutal-sm bg-paper px-1.5 py-0.5 text-[9px] font-bold text-ink-muted">
              +{companionActivities.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Pricing & CTA Footer */}
      <div className="mt-4 pt-3 border-t-brutal flex items-center justify-between gap-2">
        <div>
          <span className="block text-[10px] font-extrabold uppercase text-ink-muted">Rate</span>
          <span className="font-display text-base font-black text-ink">
            {formatRupees(companion.hourlyRate)}{' '}
            <span className="text-[10px] font-bold text-ink-muted">/hr</span>
          </span>
        </div>

        {isLocked ? (
          <button
            type="button"
            onClick={() => onUnlockClick?.(companion)}
            className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-ink text-white px-3 py-1.5 font-display text-xs font-black shadow-brutal-xs hover:bg-black btn-press transition-colors cursor-pointer"
          >
            <Lock className="h-3 w-3 text-lime" />
            <span>Unlock profile</span>
          </button>
        ) : (
          <Link
            href={`/companions/${companion.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-lime px-3 py-1.5 font-display text-xs font-black text-ink shadow-brutal-xs hover:bg-sunny btn-press transition-colors cursor-pointer"
          >
            <span>View Profile</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
