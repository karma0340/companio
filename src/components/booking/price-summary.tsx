'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCcw, MapPin, ArrowRight } from 'lucide-react';
import { Companion } from '@/lib/types';
import { calculatePrice, formatRupees } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PriceSummaryProps {
  companion: Companion;
}

export function PriceSummary({ companion }: PriceSummaryProps) {
  const [hours, setHours] = useState(1);
  const price = calculatePrice(companion.hourlyRate, hours);

  return (
    <div className="sticky top-24 rounded-2xl border-brutal bg-white p-5 sm:p-6 shadow-brutal-lg space-y-5">
      {/* Rate Header */}
      <div className="flex items-baseline justify-between border-b-brutal pb-4">
        <div>
          <span className="block text-xs font-black uppercase tracking-wider text-ink-muted">
            Companion Rate
          </span>
          <span className="font-display text-3xl font-black text-ink">
            {formatRupees(companion.hourlyRate)}
            <span className="text-sm font-bold text-ink-muted"> /hour</span>
          </span>
        </div>

        <div className="text-right">
          <span className="inline-block rounded-md border-brutal-sm bg-lime px-2 py-0.5 text-xs font-black uppercase text-ink shadow-brutal-sm">
            100% Protected
          </span>
        </div>
      </div>

      {/* Interactive Hours Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-ink">
          <span>Choose Meetup Duration:</span>
          <span className="font-display text-base font-black text-lavender">
            {hours} {hours === 1 ? 'Hour' : 'Hours'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHours(h)}
              className={`rounded-xl border-brutal-sm py-2 font-display text-xs font-black transition-all cursor-pointer ${
                hours === h
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-paper-deep text-ink hover:bg-sunny'
              }`}
            >
              {h} hr{h > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Itemized Price Breakdown */}
      <div className="space-y-2.5 rounded-xl border-brutal-sm bg-paper/50 p-4 font-body text-xs text-ink-soft">
        <div className="flex items-center justify-between font-medium">
          <span>
            {formatRupees(companion.hourlyRate)} × {hours} {hours === 1 ? 'hour' : 'hours'}
          </span>
          <span className="font-bold text-ink font-mono">{formatRupees(price.hostSubtotal)}</span>
        </div>

        <div className="flex items-center justify-between font-medium">
          <span className="flex items-center gap-1">
            <span>Togethr Protection & Platform Fee</span>
          </span>
          <span className="font-bold text-ink font-mono">{formatRupees(price.connectionFee)}</span>
        </div>

        <div className="flex items-center justify-between font-medium">
          <span>Statutory GST (18%)</span>
          <span className="font-bold text-ink font-mono">{formatRupees(price.gst)}</span>
        </div>

        <div className="border-t-brutal-sm pt-2.5 flex items-baseline justify-between font-display text-base font-black text-ink">
          <span>Total Payable</span>
          <span className="text-xl font-black text-ink">{formatRupees(price.totalPayable)}</span>
        </div>
      </div>

      {/* Action CTA */}
      <Link href={`/book/${companion.id}?hours=${hours}`} className="block">
        <Button variant="primary" size="lg" fullWidth>
          <span>Request Meetup with {companion.name}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>

      {/* Safety & Trust Assurances */}
      <div className="space-y-2 border-t-brutal-sm pt-4 font-body text-xs font-medium text-ink-soft">
        <div className="flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong className="text-ink">100% Money-Back Guarantee:</strong> Funds are released to {companion.name} only after your mutual meetup concludes.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <RotateCcw className="h-4 w-4 text-lavender shrink-0 mt-0.5" />
          <p>
            <strong className="text-ink">Instant Full Refund:</strong> Automatic 100% refund if {companion.name} declines or cannot make it.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-pink shrink-0 mt-0.5" />
          <p>
            <strong className="text-ink">Public Places Only:</strong> Malls, cafes, gyms, or cultural venues. Private homes strictly forbidden.
          </p>
        </div>
      </div>
    </div>
  );
}
