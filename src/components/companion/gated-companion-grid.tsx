'use client';

import React, { useState } from 'react';
import { Companion } from '@/lib/types';
import { CompanionCard } from './companion-card';
import { CompareModal } from './compare-modal';
import { useToast } from '@/components/ui/toast';
import { Scale } from 'lucide-react';

interface GatedCompanionGridProps {
  companions: Companion[];
}

export function GatedCompanionGrid({ companions }: GatedCompanionGridProps) {
  const { toast } = useToast();
  const [compareList, setCompareList] = useState<Companion[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleCompare = (comp: Companion) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === comp.id);
      if (exists) {
        return prev.filter((c) => c.id !== comp.id);
      }
      if (prev.length >= 3) {
        toast({
          title: 'Compare Limit Reached',
          description: 'You can compare up to 3 companions at a time.',
        });
        return prev;
      }
      return [...prev, comp];
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {companions.map((comp) => (
          <CompanionCard
            key={comp.id}
            companion={comp}
            isCompared={compareList.some((c) => c.id === comp.id)}
            onCompareClick={handleToggleCompare}
          />
        ))}
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl rounded-2xl border-3 border-ink bg-white px-4 py-3 shadow-brutal-lg flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 min-w-0">
            <Scale className="h-4 w-4 text-ink shrink-0" />
            <span className="font-display text-xs sm:text-sm font-black text-ink truncate">
              {compareList.length} selected: {compareList.map((c) => c.name).join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCompareList([])}
              className="text-xs font-bold text-ink-muted hover:text-danger cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="rounded-xl border-2 border-ink bg-lime px-3.5 py-1.5 font-display text-xs font-black text-ink shadow-brutal-xs hover:bg-sunny transition cursor-pointer"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

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
    </>
  );
}
