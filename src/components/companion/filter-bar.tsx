'use client';

import React from 'react';
import { Search, MapPin, Sparkles, Filter, X, ShieldCheck } from 'lucide-react';
import { ACTIVITIES } from '@/lib/data/activities';
import { CITIES } from '@/lib/data/cities';
import { ActivityCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { StatusPulse } from '@/components/ui/status-pulse';

interface FilterBarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedActivity: ActivityCategory | 'all';
  onActivityChange: (activity: ActivityCategory | 'all') => void;
  freeTodayOnly: boolean;
  onFreeTodayChange: (val: boolean) => void;
  womenOnlyHosts: boolean;
  onWomenOnlyHostsChange: (val: boolean) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onReset: () => void;
  totalCount: number;
}

export function FilterBar({
  selectedCity,
  onCityChange,
  selectedActivity,
  onActivityChange,
  freeTodayOnly,
  onFreeTodayChange,
  womenOnlyHosts,
  onWomenOnlyHostsChange,
  searchQuery,
  onSearchChange,
  onReset,
  totalCount,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedCity !== 'all' ||
    selectedActivity !== 'all' ||
    freeTodayOnly ||
    womenOnlyHosts ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-4 rounded-2xl border-brutal bg-white p-4 sm:p-6 shadow-brutal">
      {/* Top Controls: Search + City Select */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="relative sm:col-span-7">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by companion name, interest, or area..."
            className="w-full rounded-xl border-brutal bg-paper-deep/40 pl-10 pr-4 py-2.5 font-body text-sm font-medium text-ink placeholder:text-ink-muted/70 focus:bg-white focus:outline-none focus:shadow-brutal transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* City Dropdown */}
        <div className="relative sm:col-span-5">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full rounded-xl border-brutal bg-white pl-10 pr-8 py-2.5 font-display text-xs sm:text-sm font-extrabold text-ink focus:outline-none focus:shadow-brutal appearance-none cursor-pointer"
          >
            <option value="all">All Cities Across India</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.activeCount} verified hosts)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Toggles: Free Today & Women-Only */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t-brutal-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Free Today Toggle */}
          <button
            onClick={() => onFreeTodayChange(!freeTodayOnly)}
            className={`group inline-flex items-center gap-2 rounded-full border-brutal-sm px-3.5 py-1.5 font-display text-xs font-black transition-all cursor-pointer ${
              freeTodayOnly
                ? 'bg-lime text-ink shadow-brutal-sm'
                : 'bg-white text-ink-soft hover:bg-paper-deep'
            }`}
          >
            <StatusPulse size="xs" status="active" />
            <span>Free Today</span>
          </button>

          {/* Women Only Hosts Toggle */}
          <button
            onClick={() => onWomenOnlyHostsChange(!womenOnlyHosts)}
            className={`group inline-flex items-center gap-1.5 rounded-full border-brutal-sm px-3.5 py-1.5 font-display text-xs font-black transition-all cursor-pointer ${
              womenOnlyHosts
                ? 'bg-pink text-ink shadow-brutal-sm'
                : 'bg-white text-ink-soft hover:bg-paper-deep'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-pink-700 stroke-[2.25]" />
            <span>Women Hosts for Women</span>
          </button>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center gap-3">
          <span className="font-display text-xs font-black uppercase text-ink-muted">
            Showing <strong className="text-ink">{totalCount}</strong> verified hosts
          </span>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="font-display text-xs font-black text-danger hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Activity Pills */}
      <div className="pt-2">
        <span className="block mb-2 font-display text-[11px] font-black uppercase tracking-wider text-ink-muted">
          Filter By Activity:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onActivityChange('all')}
            className={`group inline-flex items-center gap-1.5 rounded-full border-brutal-sm px-3 py-1 font-display text-xs font-extrabold transition-all cursor-pointer ${
              selectedActivity === 'all'
                ? 'bg-ink text-paper shadow-brutal-sm'
                : 'bg-white text-ink hover:bg-paper-deep'
            }`}
          >
            <Sparkles className="h-3 w-3 stroke-[2.25] text-sunny" />
            <span>All Activities</span>
          </button>

          {ACTIVITIES.map((act) => {
            const isSelected = selectedActivity === act.slug;
            return (
              <button
                key={act.slug}
                onClick={() => onActivityChange(act.slug)}
                className={`group inline-flex items-center gap-1.5 rounded-full border-brutal-sm px-3 py-1 font-display text-xs font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sunny text-ink shadow-brutal-sm'
                    : 'bg-white text-ink hover:bg-paper-deep'
                }`}
              >
                <ActivityIcon slug={act.slug} size="xs" animated />
                <span>{act.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
