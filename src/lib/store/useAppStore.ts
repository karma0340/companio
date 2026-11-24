'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  phone: string;
  email?: string | null;
  name?: string;
  activeRole: 'member' | 'host' | 'admin';
  accountStatus: string;
  coinBalance?: number;
  creditBalance?: number;
  referralCode?: string | null;
  isUnlocked?: boolean;
  activePassTier?: string | null;
  passExpiresAt?: string | null;
  city?: string | null;
  area?: string | null;
  bio?: string | null;
}

export interface MemberProfile {
  id: string;
  fullName: string;
  gender?: 'female' | 'male' | 'other' | string;
  city: string;
  area?: string;
  bio?: string;
  avatarUrl?: string;
  emergencyContact?: string;
  onboardingCompleted: boolean;
}

export interface HostProfile {
  id: string;
  userId?: string;
  displayName: string;
  age?: number;
  gender?: string;
  city?: string;
  area?: string;
  bio?: string;
  tagline?: string;
  avatarUrl?: string;
  hourlyRate?: number;
  locality?: string;
  travelRadiusKm?: number;
  hostLevel?: 'NEW' | 'RISING' | 'TOP' | string;
  completedMeetups?: number;
  photoVerified?: boolean;
  verificationStatus: 'not_applied' | 'pending' | 'approved' | 'rejected';
  isFreeToday: boolean;
  walletBalance: number;
  upiId?: string;
}

export interface AppState {
  user: User | null;
  memberProfile: MemberProfile | null;
  hostProfile: HostProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  activeRole: 'member' | 'host';

  // Synchronous State Modifiers
  setIsHydrated: (isHydrated: boolean) => void;
  setAuth: (payload: {
    user: User | null;
    memberProfile?: MemberProfile | null;
    hostProfile?: HostProfile | null;
  }) => void;
  setMemberProfile: (profile: MemberProfile | null) => void;
  setHostProfile: (profile: HostProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  upgradeToHost: (hostProfile: HostProfile) => void;

  // Async API Operations
  refreshSession: () => Promise<void>;
  switchRole: (targetRole: 'member' | 'host') => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      memberProfile: null,
      hostProfile: null,
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,
      activeRole: 'member',

      setIsHydrated: (isHydrated) => set({ isHydrated }),

      setAuth: ({ user, memberProfile = null, hostProfile = null }) => {
        set({
          user,
          memberProfile: memberProfile ?? null,
          hostProfile: hostProfile ?? null,
          isAuthenticated: !!user,
          activeRole: (user?.activeRole as 'member' | 'host') || 'member',
          isLoading: false,
        });
      },

      setMemberProfile: (memberProfile) => set({ memberProfile }),

      setHostProfile: (hostProfile) => set({ hostProfile }),

      setIsLoading: (isLoading) => set({ isLoading }),

      upgradeToHost: (hostProfile) => {
        set((state) => ({
          hostProfile,
          activeRole: 'host',
          user: state.user ? { ...state.user, activeRole: 'host' } : null,
        }));
      },

      refreshSession: async () => {
        try {
          const res = await fetch('/api/auth/me', {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' },
          });
          if (res.ok) {
            const data = await res.json();
            if ((data.authenticated || data.isAuthenticated) && data.user) {
              const u = data.user;
              const role = (u.activeRole || (u.role?.toLowerCase() === 'companion' ? 'host' : 'member')) as 'member' | 'host';
              const userObj: User = {
                id: u.id,
                phone: u.phone,
                email: u.email,
                name: u.name,
                activeRole: role,
                accountStatus: 'active',
                coinBalance: u.coinBalance ?? 100,
                creditBalance: u.creditBalance ?? 100,
                referralCode: u.referralCode || null,
              };
              const memProfile: MemberProfile = data.memberProfile || {
                id: u.id,
                fullName: u.name || 'Member',
                city: 'bengaluru',
                onboardingCompleted: true,
              };
              set({
                user: userObj,
                memberProfile: memProfile,
                hostProfile: data.hostProfile || null,
                isAuthenticated: true,
                activeRole: role,
                isLoading: false,
              });
              return;
            }
          }
          set({
            user: null,
            memberProfile: null,
            hostProfile: null,
            isAuthenticated: false,
            activeRole: 'member',
            isLoading: false,
          });
        } catch (err) {
          console.error('Failed to restore session via Zustand:', err);
          set({
            user: null,
            memberProfile: null,
            hostProfile: null,
            isAuthenticated: false,
            activeRole: 'member',
            isLoading: false,
          });
        }
      },

      switchRole: async (targetRole: 'member' | 'host') => {
        try {
          await fetch('/api/auth/switch-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: targetRole === 'host' ? 'COMPANION' : 'MEMBER' }),
          });
          set((state) => ({
            activeRole: targetRole,
            user: state.user ? { ...state.user, activeRole: targetRole } : null,
          }));
          return true;
        } catch (err) {
          console.error('Switch role error:', err);
          return false;
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          set({
            user: null,
            memberProfile: null,
            hostProfile: null,
            isAuthenticated: false,
            activeRole: 'member',
            isLoading: false,
          });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('companio-auth-storage');
            window.location.href = '/';
          }
        }
      },
    }),
    {
      name: 'companio-auth-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({
        user: state.user,
        memberProfile: state.memberProfile,
        hostProfile: state.hostProfile,
        isAuthenticated: state.isAuthenticated,
        activeRole: state.activeRole,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setIsHydrated(true);
        }
      },
    }
  )
);
