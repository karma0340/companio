'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Search, Sparkles, UserCheck, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';

export interface SeededProfileOption {
  userId: string;
  companionId: string | null;
  name: string;
  displayName: string;
  phone: string;
  role: 'MEMBER' | 'COMPANION' | 'ADMIN';
  city: string;
  hourlyRate: number | null;
  avatarUrl: string | null;
  isAvailable: boolean;
}

interface SeededProfileSwitcherProps {
  accessKey: string;
  compact?: boolean;
}

export function SeededProfileSwitcher({ accessKey, compact = false }: SeededProfileSwitcherProps) {
  const router = useRouter();
  const toast = useToast();
  const { refreshSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signingInId, setSigningInId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<SeededProfileOption[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  const cities = useMemo(() => {
    if (!profiles) return [];
    const set = new Set(profiles.map((p) => p.city).filter(Boolean));
    return ['ALL', ...Array.from(set).sort()];
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    const q = searchQuery.trim().toLowerCase();
    return profiles.filter((p) => {
      if (selectedCity !== 'ALL' && p.city !== selectedCity) return false;
      if (!q) return true;
      return (
        p.displayName.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.companionId || '').toLowerCase().includes(q)
      );
    });
  }, [profiles, searchQuery, selectedCity]);

  const handleUnlockList = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/seeded-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessKey,
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.error || 'Could not verify operator credentials.';
        setError(msg);
        toast.error(msg, 'Access Denied');
        return;
      }

      setProfiles(data.profiles || []);
      toast.success(`Loaded ${(data.profiles || []).length} managed profiles.`, 'Access Ready');
    } catch {
      const msg = 'Network error while verifying operator credentials.';
      setError(msg);
      toast.error(msg, 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAsProfile = async (profile: SeededProfileOption) => {
    setSigningInId(profile.userId);
    setError(null);

    try {
      const res = await fetch('/api/auth/seeded-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessKey,
          email: email.trim(),
          password,
          targetUserId: profile.userId,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.error || 'Unable to sign into selected seeded profile.';
        setError(msg);
        toast.error(msg, 'Sign-In Failed');
        return;
      }

      await refreshSession();
      toast.success(`Signed in as ${profile.displayName} (${profile.city})`, 'Profile Active');
      router.push(data.redirectTo || '/companion/dashboard');
    } catch {
      const msg = 'Network error while signing into seeded profile.';
      setError(msg);
      toast.error(msg, 'Connection Error');
    } finally {
      setSigningInId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border-2 border-danger bg-danger/10 p-3 text-xs font-bold text-danger">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!profiles ? (
        <form onSubmit={handleUnlockList} className="space-y-3">
          <div className="rounded-xl border-2 border-ink bg-sunny/20 p-3 text-xs font-bold text-ink">
            Sign in with your operator email and password to switch between internal managed profiles. Genuine user accounts remain strictly isolated.
          </div>

          <div className="space-y-1">
            <label className="block font-display text-[11px] font-black uppercase text-ink">
              Operator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="snowgirl0340@gmail.com"
                className="w-full rounded-xl border-2 border-ink bg-paper/40 pl-9 pr-3 py-2.5 text-xs font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-display text-[11px] font-black uppercase text-ink">
              Operator Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter operator password"
                className="w-full rounded-xl border-2 border-ink bg-paper/40 pl-9 pr-3 py-2.5 text-xs font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal-xs"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" fullWidth disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying Access...
              </span>
            ) : (
              'Load Seeded Profiles'
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-ink" />
              <span className="font-display text-xs font-black text-ink">
                {filteredProfiles.length} Seeded Profiles Available
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setProfiles(null);
                setPassword('');
              }}
              className="text-[11px] font-black text-ink-muted underline hover:text-ink cursor-pointer"
            >
              Lock Panel
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, city, phone..."
                className="w-full rounded-xl border-2 border-ink bg-white pl-8 pr-3 py-2 text-xs font-bold text-ink focus:outline-none focus:shadow-brutal-xs"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border-2 border-ink bg-white px-3 py-2 text-xs font-black text-ink focus:outline-none cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Cities' : c}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`space-y-2 overflow-y-auto pr-1 ${
              compact ? 'max-h-72' : 'max-h-[32rem]'
            }`}
          >
            {filteredProfiles.map((profile) => {
              const isBusy = signingInId === profile.userId;
              return (
                <div
                  key={profile.userId}
                  className="flex items-center justify-between gap-2 rounded-2xl border-2 border-ink bg-paper/40 p-2.5 hover:bg-white transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display text-xs font-black text-ink truncate">
                        {profile.displayName}
                      </span>
                      <Badge variant={profile.role === 'COMPANION' ? 'sunny' : 'lime'} size="sm">
                        {profile.role === 'COMPANION' ? 'HOST' : 'MEMBER'}
                      </Badge>
                    </div>
                    <div className="font-mono text-[11px] font-bold text-ink-muted truncate mt-0.5">
                      {profile.phone || 'No phone'} · {profile.city}
                      {profile.hourlyRate ? ` · INR ${profile.hourlyRate}/hr` : ''}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={Boolean(signingInId)}
                    onClick={() => handleLoginAsProfile(profile)}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-ink px-3 py-1.5 font-display text-[11px] font-black text-paper shadow-brutal-xs hover:bg-black/85 disabled:opacity-60 cursor-pointer shrink-0"
                  >
                    {isBusy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LogIn className="h-3.5 w-3.5" />
                    )}
                    <span>{isBusy ? 'Opening...' : 'Login'}</span>
                  </button>
                </div>
              );
            })}

            {filteredProfiles.length === 0 && (
              <div className="rounded-xl border border-ink/20 bg-paper p-4 text-center text-xs font-bold text-ink-muted">
                No seeded profiles match your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
