'use client';

import { create } from 'zustand';
import { Companion } from '@/lib/types';

export interface SavedCompanionSummary {
  id: string;
  displayName: string;
  city: string;
  locality: string;
  hourlyRate: number;
  ratingAverage: number;
  totalReviews?: number;
  avatarUrl: string | null;
  acceptedActivities?: string[];
  isAvailable: boolean;
}

interface CollectionsState {
  savedIds: string[];
  savedCompanions: SavedCompanionSummary[];
  compareIds: string[];
  compareList: Companion[];
  isCompareOpen: boolean;
  isLoaded: boolean;

  setCompareOpen: (open: boolean) => void;
  resetCollections: () => void;
  loadCollections: () => Promise<void>;
  toggleBookmark: (
    companionId: string
  ) => Promise<{ ok: boolean; saved?: boolean; requiresLogin?: boolean; error?: string }>;
  toggleCompare: (
    companion: Companion
  ) => Promise<{ ok: boolean; compared?: boolean; requiresLogin?: boolean; error?: string }>;
  removeCompare: (companionId: string) => Promise<void>;
  clearCompare: () => Promise<void>;
}

export const useCollectionsStore = create<CollectionsState>()((set, get) => ({
  savedIds: [],
  savedCompanions: [],
  compareIds: [],
  compareList: [],
  isCompareOpen: false,
  isLoaded: false,

  setCompareOpen: (open) => set({ isCompareOpen: open }),

  resetCollections: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('meetzy_saved_companions');
      } catch {}
    }
    set({
      savedIds: [],
      savedCompanions: [],
      compareIds: [],
      compareList: [],
      isCompareOpen: false,
      isLoaded: true,
    });
  },

  loadCollections: async () => {
    try {
      const [bookmarksRes, compareRes] = await Promise.all([
        fetch('/api/companions/bookmarks', { cache: 'no-store' }),
        fetch('/api/companions/compare', { cache: 'no-store' }),
      ]);

      const [bookmarksData, compareData] = await Promise.all([
        bookmarksRes.ok ? bookmarksRes.json().catch(() => null) : null,
        compareRes.ok ? compareRes.json().catch(() => null) : null,
      ]);

      set({
        savedIds: Array.isArray(bookmarksData?.companionIds) ? bookmarksData.companionIds : [],
        savedCompanions: Array.isArray(bookmarksData?.companions) ? bookmarksData.companions : [],
        compareIds: Array.isArray(compareData?.companionIds) ? compareData.companionIds : [],
        compareList: Array.isArray(compareData?.companions) ? compareData.companions : [],
        isLoaded: true,
      });
    } catch {
      set({ isLoaded: true });
    }
  },

  toggleBookmark: async (companionId: string) => {
    try {
      const res = await fetch('/api/companions/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companionId }),
      });

      if (res.status === 401) {
        return { ok: false, requiresLogin: true, error: 'Please sign in to save favorites.' };
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        return { ok: false, error: data.error || 'Could not update favorites.' };
      }

      set({
        savedIds: Array.isArray(data.companionIds) ? data.companionIds : get().savedIds,
        savedCompanions: Array.isArray(data.companions) ? data.companions : get().savedCompanions,
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('companio:bookmarks-updated'));
      }

      return { ok: true, saved: Boolean(data.saved) };
    } catch {
      return { ok: false, error: 'Network error updating favorites.' };
    }
  },

  toggleCompare: async (companion: Companion) => {
    try {
      const res = await fetch('/api/companions/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companionId: companion.id }),
      });

      if (res.status === 401) {
        return { ok: false, requiresLogin: true, error: 'Please sign in to compare companions.' };
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        return { ok: false, error: data.error || 'Could not update comparison.' };
      }

      const nextList: Companion[] = Array.isArray(data.companions) ? data.companions : [];
      set({
        compareIds: Array.isArray(data.companionIds) ? data.companionIds : [],
        compareList: nextList,
      });

      return { ok: true, compared: Boolean(data.compared) };
    } catch {
      return { ok: false, error: 'Network error updating comparison.' };
    }
  },

  removeCompare: async (companionId: string) => {
    try {
      const res = await fetch(
        `/api/companions/compare?companionId=${encodeURIComponent(companionId)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const nextList: Companion[] = Array.isArray(data.companions) ? data.companions : [];
        set((state) => ({
          compareIds: Array.isArray(data.companionIds) ? data.companionIds : [],
          compareList: nextList,
          isCompareOpen: nextList.length === 0 ? false : state.isCompareOpen,
        }));
      }
    } catch {}
  },

  clearCompare: async () => {
    try {
      const res = await fetch('/api/companions/compare', { method: 'DELETE' });
      if (res.ok) {
        set({ compareIds: [], compareList: [], isCompareOpen: false });
      }
    } catch {}
  },
}));
