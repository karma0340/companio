'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Scale } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useCollectionsStore } from '@/lib/store/useCollectionsStore';
import { CompareModal } from '@/components/companion/compare-modal';

const HIDE_TRAY_PREFIXES = [
  '/login',
  '/onboarding',
  '/become-a-host',
  '/become-a-companion',
  '/book/',
  '/booking/',
  '/session/',
  '/chat',
];

export function CompareTray() {
  const pathname = usePathname() || '/';
  const { isAuthenticated } = useAuth();
  const {
    compareList,
    isCompareOpen,
    setCompareOpen,
    removeCompare,
    clearCompare,
  } = useCollectionsStore();

  const shouldHideTray = HIDE_TRAY_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isAuthenticated || shouldHideTray || compareList.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl rounded-2xl border-3 border-ink bg-white px-4 py-3 shadow-brutal-lg flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
        <div className="flex items-center gap-2 min-w-0">
          <Scale className="h-4 w-4 text-ink shrink-0" />
          <span className="font-display text-xs sm:text-sm font-black text-ink truncate">
            {compareList.length}/3 selected: {compareList.map((c) => c.name).join(', ')}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => clearCompare()}
            className="text-xs font-bold text-ink-muted hover:text-danger cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            className="rounded-xl border-2 border-ink bg-lime px-3.5 py-1.5 font-display text-xs font-black text-ink shadow-brutal-xs hover:bg-sunny transition cursor-pointer"
          >
            Compare Now
          </button>
        </div>
      </div>

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setCompareOpen(false)}
        companions={compareList}
        onRemove={(id) => removeCompare(id)}
        onClear={() => clearCompare()}
      />
    </>
  );
}
