'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAppStore, User, MemberProfile, HostProfile } from '@/lib/store/useAppStore';

export type { User, MemberProfile, HostProfile };

interface AuthContextType {
  user: User | null;
  memberProfile: MemberProfile | null;
  hostProfile: HostProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  activeRole: 'member' | 'host';
  logout: () => Promise<void>;
  switchRole: (role: 'member' | 'host') => Promise<boolean>;
  refreshSession: () => Promise<void>;
  upgradeToHost: (hostProfile: HostProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStore();

  useEffect(() => {
    store.refreshSession();

    // Cross-tab reactive sync for multi-tab session updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companio-auth-storage') {
        store.refreshSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: AuthContextType = {
    user: store.user,
    memberProfile: store.memberProfile,
    hostProfile: store.hostProfile,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isHydrated: store.isHydrated,
    activeRole: store.activeRole,
    logout: store.logout,
    switchRole: store.switchRole,
    refreshSession: store.refreshSession,
    upgradeToHost: store.upgradeToHost,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    const store = useAppStore();
    return {
      user: store.user,
      memberProfile: store.memberProfile,
      hostProfile: store.hostProfile,
      isAuthenticated: store.isAuthenticated,
      isLoading: store.isLoading,
      isHydrated: store.isHydrated,
      activeRole: store.activeRole,
      logout: store.logout,
      switchRole: store.switchRole,
      refreshSession: store.refreshSession,
      upgradeToHost: store.upgradeToHost,
    };
  }
  return context;
}
