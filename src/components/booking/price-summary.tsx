'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  MessageSquare,
  Bookmark,
  Check,
  Radio,
  Plus,
} from 'lucide-react';
import { Companion } from '@/lib/types';
import { calculatePrice, formatRupees } from '@/lib/utils';
import { MessageHostModal } from '@/components/companion/message-host-modal';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import { useCollectionsStore } from '@/lib/store/useCollectionsStore';

interface PriceSummaryProps {
  companion: Companion;
}

export function PriceSummary({ companion }: PriceSummaryProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { savedIds, compareIds, toggleBookmark, toggleCompare } = useCollectionsStore();

  const [hours, setHours] = useState(1);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [pendingCompare, setPendingCompare] = useState(false);

  const isSaved = isAuthenticated && savedIds.includes(companion.id);
  const isCompared = isAuthenticated && compareIds.includes(companion.id);

  const price = calculatePrice(companion.hourlyRate, hours);

  const redirectToLogin = (actionLabel: string) => {
    toast({
      title: 'Sign In Required',
      description: `Please log in to ${actionLabel}.`,
    });
    const nextPath =
      typeof window !== 'undefined'
        ? window.location.pathname + window.location.search
        : `/companions/${companion.id}`;
    router.push(`/login?intent=member&next=${encodeURIComponent(nextPath)}`);
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      redirectToLogin('save hosts to Favorites');
      return;
    }

    if (pendingSave) return;
    setPendingSave(true);
    try {
      const result = await toggleBookmark(companion.id);
      if (result.requiresLogin) {
        redirectToLogin('save hosts to Favorites');
        return;
      }
      if (!result.ok) {
        toast({
          title: 'Could Not Update Favorites',
          description: result.error || 'Please try again.',
        });
        return;
      }

      toast({
        title: result.saved ? 'Saved to Favorites' : 'Removed from Favorites',
        description: result.saved
          ? `${companion.name} was added to your Saved favorites.`
          : `${companion.name} was removed from your Saved favorites.`,
      });
    } finally {
      setPendingSave(false);
    }
  };

  const handleToggleCompare = async () => {
    if (!isAuthenticated) {
      redirectToLogin('compare companions side-by-side');
      return;
    }

    if (pendingCompare) return;
    setPendingCompare(true);
    try {
      const result = await toggleCompare(companion);
      if (result.requiresLogin) {
        redirectToLogin('compare companions side-by-side');
        return;
      }
      if (!result.ok) {
        toast({
          title: 'Compare Notice',
          description: result.error || 'Could not update comparison list.',
        });
        return;
      }

      toast({
        title: result.compared ? 'Added to Compare' : 'Removed from Compare',
        description: result.compared
          ? `${companion.name} added to your comparison list.`
          : `${companion.name} removed from your comparison list.`,
      });
    } finally {
      setPendingCompare(false);
    }
  };

  return (
    <>
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
              Meetup Rate ({formatRupees(companion.hourlyRate)} &times; {hours} {hours === 1 ? 'hr' : 'hrs'})
            </span>
            <span className="font-bold text-ink font-mono">{formatRupees(price.hostSubtotal)}</span>
          </div>

          <div className="flex items-center justify-between font-medium">
            <span>Taxes, Razorpay &amp; Escrow Protection</span>
            <span className="font-bold text-emerald-700 text-[11px] uppercase">Included</span>
          </div>

          <div className="border-t-brutal-sm pt-2.5 flex items-baseline justify-between font-display text-base font-black text-ink">
            <span>Total Payable</span>
            <span className="text-xl font-black text-ink">{formatRupees(price.totalPayable)}</span>
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary Action: Request Meetup */}
          <Link href={`/book/${companion.id}?hours=${hours}`} className="block">
            <button className="w-full py-3.5 px-6 rounded-2xl border-brutal bg-[#FF7AC6] text-ink font-display text-sm sm:text-base font-black shadow-brutal hover:bg-[#ff64b8] transition-all btn-press flex items-center justify-center gap-2 cursor-pointer">
              <span>Request a meetup with {companion.name}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>

          {/* Secondary Action: Message Host after Meetup Acceptance */}
          <button
            type="button"
            onClick={() => setIsChatModalOpen(true)}
            className="w-full py-3 px-4 rounded-2xl border-brutal bg-white text-ink text-left shadow-brutal-sm hover:bg-paper-deep transition-all btn-press cursor-pointer space-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-black text-ink flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-ink" />
                <span>Message {companion.name}</span>
              </span>
              <span className="text-xs font-black bg-[#D4F7A5] px-2 py-0.5 rounded-md border-brutal-xs text-ink">
                10 Coins / msg
              </span>
            </div>
            <div className="text-[11px] font-medium text-ink-muted pl-6">
              Opens once your meetup request is accepted
            </div>
          </button>

          {/* Save to Favorites & Compare Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={pendingSave}
              className={`py-2.5 px-3 rounded-xl border-brutal-sm text-xs font-bold transition-all btn-press flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                isSaved
                  ? 'bg-sunny text-ink shadow-brutal-xs'
                  : 'bg-white text-ink-muted hover:text-ink hover:bg-paper-deep'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-ink text-ink' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Favorite'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleCompare}
              disabled={pendingCompare}
              className={`py-2.5 px-3 rounded-xl border-brutal-sm text-xs font-bold transition-all btn-press flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                isCompared
                  ? 'bg-[#D4F7A5] text-ink shadow-brutal-xs'
                  : 'bg-white text-ink-muted hover:text-ink hover:bg-paper-deep'
              }`}
            >
              {isCompared ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>
          </div>
        </div>

        {/* Safety & Escrow Trust Assurances */}
        <div className="space-y-2 border-t-brutal-sm pt-4 font-body text-xs font-medium text-ink-soft">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-ink">Paid into escrow &mdash;</strong> released only after the meetup.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <RotateCcw className="h-4 w-4 text-lavender shrink-0 mt-0.5" />
            <p>
              <strong className="text-ink">75% escrow refund</strong> (25% cancellation fee) before start PIN verification.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Radio className="h-4 w-4 text-pink shrink-0 mt-0.5" />
            <p>
              <strong className="text-ink">Public places only &middot;</strong> live location &amp; SOS on every session.
            </p>
          </div>
        </div>
      </div>

      {/* Message Host Modal */}
      <MessageHostModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        companionId={companion.id}
        companionName={companion.name}
      />
    </>
  );
}
