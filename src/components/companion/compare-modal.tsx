'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, MapPin, Star, Languages, Calendar, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Companion } from '@/lib/types';
import { ACTIVITIES } from '@/lib/data/activities';
import { formatRupees } from '@/lib/utils';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  companions: Companion[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CompareModal({
  isOpen,
  onClose,
  companions,
  onRemove,
  onClear,
}: CompareModalProps) {
  if (!isOpen || companions.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border-3 border-ink bg-paper p-5 sm:p-8 shadow-brutal-lg text-ink space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink pb-4">
          <div>
            <span className="inline-block rounded-lg border-2 border-ink bg-sunny px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-ink">
              Side-by-Side Comparison ({companions.length}/3)
            </span>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-black text-ink">
              Compare Companions
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl border-2 border-ink bg-white px-3 py-1.5 font-display text-xs font-black text-danger hover:bg-danger/10 transition cursor-pointer"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close comparison"
              className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-white text-ink hover:bg-pink transition cursor-pointer"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Responsive Comparison Cards Grid */}
        <div
          className={`grid gap-4 ${
            companions.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : companions.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {companions.map((comp) => {
            const actNames = comp.activities
              .map((slug) => ACTIVITIES.find((a) => a.slug === slug)?.name || slug)
              .slice(0, 4);

            return (
              <div
                key={comp.id}
                className="relative flex flex-col justify-between rounded-2xl border-2 border-ink bg-white p-4 shadow-brutal space-y-4"
              >
                <button
                  type="button"
                  onClick={() => onRemove(comp.id)}
                  aria-label={`Remove ${comp.name} from compare`}
                  className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-white text-ink hover:bg-rose-100 transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="space-y-4">
                  {/* Photo & Name */}
                  <div className="flex items-center gap-3 pr-8">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-paper-deep">
                      <Image
                        src={comp.avatarUrl}
                        alt={comp.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-black text-ink truncate">
                        {comp.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-ink-muted">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-ink" />
                        <span className="truncate">
                          {comp.area || comp.city}, {comp.age}
                        </span>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-ink/20 bg-sunny/50 px-1.5 py-0.5 text-[11px] font-black text-ink">
                        <Star className="h-3 w-3 fill-ink text-ink" />
                        <span>{comp.rating.toFixed(1)}</span>
                        <span className="text-ink-muted">({comp.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Attributes */}
                  <div className="divide-y divide-ink/10 rounded-xl border-2 border-ink bg-paper/50 p-3 text-xs space-y-2.5">
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="font-bold text-ink-muted">Hourly Rate</span>
                      <span className="font-display text-sm font-black text-ink">
                        {formatRupees(comp.hourlyRate)} / hr
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5">
                      <span className="font-bold text-ink-muted">Today&apos;s Status</span>
                      <span
                        className={`inline-flex items-center gap-1 font-black ${
                          comp.isFreeToday ? 'text-emerald-700' : 'text-ink-muted'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {comp.isFreeToday ? 'Available' : 'By Schedule'}
                      </span>
                    </div>

                    <div className="pt-2.5 space-y-1">
                      <span className="font-bold text-ink-muted flex items-center gap-1">
                        <Languages className="h-3.5 w-3.5 text-ink" />
                        Languages
                      </span>
                      <span className="block font-bold text-ink">
                        {comp.languages.join(', ')}
                      </span>
                    </div>

                    <div className="pt-2.5 space-y-1">
                      <span className="font-bold text-ink-muted flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-ink" />
                        Activities
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {actNames.map((name) => (
                          <span
                            key={name}
                            className="rounded-md border border-ink/20 bg-white px-2 py-0.5 text-[10px] font-bold text-ink"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2.5">
                      <span className="font-bold text-ink-muted block mb-0.5">Bio</span>
                      <p className="text-ink-soft line-clamp-3 leading-relaxed">
                        {comp.about || comp.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href={`/companions/${comp.id}`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-xl border-2 border-ink bg-white py-2 px-3 font-display text-xs font-black text-ink hover:bg-paper-deep transition text-center"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/book/${comp.id}`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border-2 border-ink bg-ink py-2 px-3 font-display text-xs font-black text-white shadow-brutal-xs hover:bg-black transition text-center"
                  >
                    <span>Book</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-ink-muted pt-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>Every companion meetup is 100% platonic, public-venue only, and protected in escrow.</span>
        </div>
      </div>
    </div>
  );
}
