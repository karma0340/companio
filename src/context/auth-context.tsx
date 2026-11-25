'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore, User, MemberProfile, HostProfile } from '@/lib/store/useAppStore';
import { useCollectionsStore } from '@/lib/store/useCollectionsStore';
import type { InitialAuthSnapshot } from '@/lib/server-auth';

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

export function AuthProvider({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth?: InitialAuthSnapshot;
}) {
  const store = useAppStore();
  const [hasMountedClient, setHasMountedClient] = useState(false);

  useEffect(() => {
    if (initialAuth) {
      store.setAuth({
        user: initialAuth.user,
        memberProfile: initialAuth.memberProfile,
        hostProfile: initialAuth.hostProfile,
      });
    } else {
      store.refreshSession();
    }
    setHasMountedClient(true);

    // Cross-tab reactive sync for multi-tab session updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companio-auth-storage') {
        store.refreshSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Keep Favorites & Compare synchronized with PostgreSQL for authenticated users only
  const { loadCollections, resetCollections } = useCollectionsStore();
  const effectiveAuthenticated = hasMountedClient
    ? store.isAuthenticated
    : Boolean(initialAuth?.authenticated);

  useEffect(() => {
    if (effectiveAuthenticated) {
      loadCollections();
    } else {
      resetCollections();
    }
  }, [effectiveAuthenticated, store.user?.id, loadCollections, resetCollections]);

  // Before client hydration settles, serve exact SSR snapshot so initial HTML = first client render (zero LCP spinner block & zero hydration mismatch)
  const useServerSnapshot = Boolean(initialAuth) && !hasMountedClient;

  const value: AuthContextType = useServerSnapshot && initialAuth
    ? {
        user: initialAuth.user,
        memberProfile: initialAuth.memberProfile,
        hostProfile: initialAuth.hostProfile,
        isAuthenticated: initialAuth.authenticated,
        isLoading: false,
        isHydrated: true,
        activeRole: initialAuth.activeRole,
        logout: store.logout,
        switchRole: store.switchRole,
        refreshSession: store.refreshSession,
        upgradeToHost: store.upgradeToHost,
      }
    : {
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
