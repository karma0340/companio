import React from 'react';

export function CompanionCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-ink bg-white p-3 shadow-brutal flex flex-col justify-between animate-pulse">
      <div>
        <div className="aspect-[3.2/4] w-full rounded-xl border-2 border-ink/20 bg-paper-deep" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full rounded bg-paper-deep" />
          <div className="h-3 w-4/5 rounded bg-paper-deep" />
        </div>
        <div className="mt-3 h-3 w-2/3 rounded bg-paper-deep" />
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <div className="h-5 w-16 rounded-lg bg-paper-deep" />
            <div className="h-5 w-14 rounded-lg bg-paper-deep" />
          </div>
          <div className="h-5 w-16 rounded bg-paper-deep" />
        </div>
      </div>
      <div className="mt-4 pt-2.5 border-t border-ink/10 flex items-center gap-2">
        <div className="h-9 w-24 rounded-xl bg-paper-deep" />
        <div className="h-9 flex-1 rounded-xl bg-paper-deep" />
      </div>
    </div>
  );
}
