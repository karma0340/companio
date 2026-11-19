import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShieldCheck, Camera, MapPin, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { Companion } from '@/lib/types';
import { ACTIVITIES } from '@/lib/data/activities';
import { formatRupees } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { StatusPulse } from '@/components/ui/status-pulse';

interface CompanionCardProps {
  companion: Companion;
  featured?: boolean;
}

export function CompanionCard({ companion, featured = false }: CompanionCardProps) {
  // Map activity slugs to emojis and names
  const companionActivities = companion.activities.map((slug) => {
    return ACTIVITIES.find((a) => a.slug === slug);
  }).filter(Boolean);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border-brutal bg-white p-4 sm:p-5 shadow-brutal hover:shadow-brutal-lg transition-all duration-200">
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 pb-3">
          {companion.isFreeToday ? (
            <Badge variant="lime" size="sm" className="inline-flex items-center gap-1.5">
              <StatusPulse size="xs" status="active" />
              <span>Free Today</span>
            </Badge>
          ) : companion.isWeekendOnly ? (
            <Badge variant="sunny" size="sm" className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3 stroke-[2.25]" />
              <span>Weekend Only</span>
            </Badge>
          ) : (
            <Badge variant="paper" size="sm" className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 stroke-[2.25] text-sunny" />
              <span>Available</span>
            </Badge>
          )}

          {companion.acceptsWomenOnly && (
            <Badge variant="pink" size="sm" className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 stroke-[2.25] text-pink-700" />
              <span>Women-Only</span>
            </Badge>
          )}
        </div>

        {/* Photo & Quick Metrics */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-brutal bg-paper-deep">
          <Image
            src={companion.avatarUrl}
            alt={companion.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Verification Overlays */}
          <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1.5">
            {companion.verifiedId && (
              <span className="flex items-center gap-1 rounded-md border-brutal-sm bg-lime px-2 py-0.5 text-[10px] font-black uppercase text-ink shadow-brutal-sm">
                <ShieldCheck className="h-3 w-3" />
                ID Verified
              </span>
            )}
            {companion.verifiedPhoto && (
              <span className="flex items-center gap-1 rounded-md border-brutal-sm bg-sunny px-2 py-0.5 text-[10px] font-black uppercase text-ink shadow-brutal-sm">
                <Camera className="h-3 w-3" />
                Live Selfie
              </span>
            )}
          </div>
        </div>

        {/* Name, Age, Location */}
        <div className="mt-3.5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-xl sm:text-2xl font-black text-ink">
              {companion.name}
            </h3>
            <span className="font-display text-sm font-bold text-ink-muted">· {companion.age}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 rounded-lg border-brutal-sm bg-sunny-soft px-2 py-0.5 text-xs font-black text-ink shadow-brutal-sm">
            <Star className="h-3.5 w-3.5 fill-ink text-ink" />
            <span>{companion.rating.toFixed(1)}</span>
            <span className="text-[10px] text-ink-muted font-bold">({companion.meetupsCount})</span>
          </div>
        </div>

        {/* City and Area */}
        <div className="mt-1 flex items-center gap-1 text-xs font-extrabold text-ink-soft">
          <MapPin className="h-3.5 w-3.5 text-ink shrink-0" />
          <span className="truncate">{companion.area}</span>
        </div>

        {/* Tagline */}
        <p className="mt-2.5 line-clamp-2 font-body text-xs sm:text-sm font-medium text-ink-soft leading-relaxed">
          "{companion.tagline}"
        </p>

        {/* Activity Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {companionActivities.slice(0, 3).map((act) => (
            <span
              key={act!.slug}
              className="group/pill inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-paper-deep px-2 py-0.5 text-[11px] font-bold text-ink"
            >
              <ActivityIcon slug={act!.slug} size="xs" animated />
              <span>{act!.name}</span>
            </span>
          ))}
          {companionActivities.length > 3 && (
            <span className="rounded-lg border-brutal-sm bg-paper px-1.5 py-0.5 text-[10px] font-bold text-ink-muted">
              +{companionActivities.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Pricing & CTA Footer */}
      <div className="mt-5 pt-3.5 border-t-brutal flex items-center justify-between">
        <div>
          <span className="block text-[11px] font-extrabold uppercase text-ink-muted">Rate</span>
          <span className="font-display text-lg font-black text-ink">
            {formatRupees(companion.hourlyRate)}{' '}
            <span className="text-xs font-bold text-ink-muted">/hr</span>
          </span>
        </div>

        <Link
          href={`/companions/${companion.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-lime px-4 py-2 font-display text-xs font-extrabold text-ink shadow-brutal-sm hover:bg-sunny btn-press transition-colors cursor-pointer"
        >
          <span>View Profile</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
