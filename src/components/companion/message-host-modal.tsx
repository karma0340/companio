'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Coins, ShieldCheck, Lock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';
import { CoinTopupModal } from '@/components/chat/coin-topup-modal';

interface MessageHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionId: string;
  companionName: string;
}

export function MessageHostModal({
  isOpen,
  onClose,
  companionId,
  companionName,
}: MessageHostModalProps) {
  const router = useRouter();
  const { user, isAuthenticated, refreshSession } = useAuth();
  const { toast } = useToast();

  const [checking, setChecking] = useState(false);
  const [statusState, setStatusState] = useState<
    'idle' | 'accepted' | 'pending' | 'needs_request'
  >('idle');
  const [acceptedUrl, setAcceptedUrl] = useState<string>('');
  const [showTopup, setShowTopup] = useState(false);

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    let active = true;
    setChecking(true);

    fetch('/api/chat/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companionId }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!active) return;
        if (ok && data.success && data.unlocked !== false && data.redirectUrl) {
          setStatusState('accepted');
          setAcceptedUrl(data.redirectUrl);
        } else if (data.requiresAcceptance) {
          setStatusState('pending');
        } else {
          setStatusState('needs_request');
        }
      })
      .catch(() => {
        if (active) setStatusState('needs_request');
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, isAuthenticated, companionId]);

  if (!isOpen) return null;

  const currentCoins = user?.coinBalance ?? 0;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-3xl border-3 border-ink bg-white p-5 sm:p-7 shadow-brutal-lg text-ink space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl border-2 border-ink bg-paper p-1.5 hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 text-ink" />
          </button>

          <div className="space-y-1 pr-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-[#D4F7A5] px-3 py-0.5 text-[11px] font-black text-ink">
              <Coins className="h-3.5 w-3.5" />
              <span>10 Coins Per Message</span>
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-ink">
              Message {companionName}
            </h2>
          </div>

          {!isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-xs font-bold text-ink-soft leading-relaxed">
                Sign in with your mobile number to receive 100 Bonus Coins and request a meetup with{' '}
                {companionName}. Chat unlocks once your meetup request is accepted!
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push(`/login?intent=member&next=/companion/${companionId}`);
                }}
                className="w-full rounded-2xl border-2 border-ink bg-ink py-3 text-xs font-black uppercase text-white shadow-brutal-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In with OTP (+100 Bonus Coins)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : checking ? (
            <div className="py-6 text-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-ink" />
              <p className="text-xs font-bold text-ink-muted">Checking booking acceptance status...</p>
            </div>
          ) : statusState === 'accepted' ? (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-ink bg-[#D4F7A5]/60 p-4 flex items-start gap-2.5 text-xs font-bold text-ink">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Your meetup request was accepted! Open chat now ({currentCoins} coins available · 10 coins per sent message).
                </span>
              </div>

              {currentCoins < 10 ? (
                <button
                  type="button"
                  onClick={() => setShowTopup(true)}
                  className="w-full rounded-2xl border-2 border-ink bg-sunny py-3 text-xs font-black uppercase text-ink shadow-brutal-sm cursor-pointer"
                >
                  Recharge Coins via Razorpay ({currentCoins} left)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(acceptedUrl);
                  }}
                  className="w-full rounded-2xl border-2 border-ink bg-ink py-3 text-xs font-black uppercase text-white shadow-brutal-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Shielded Chat</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : statusState === 'pending' ? (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-ink bg-amber-50 p-4 flex items-start gap-2.5 text-xs font-bold text-amber-900">
                <Lock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Your meetup request is waiting for <strong>{companionName}</strong> to accept. Messaging unlocks automatically as soon as they confirm!
                </span>
              </div>
              <Link
                href="/bookings"
                onClick={onClose}
                className="w-full rounded-2xl border-2 border-ink bg-white py-3 text-xs font-black uppercase text-ink shadow-brutal-sm flex items-center justify-center gap-2"
              >
                <span>View My Bookings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-ink bg-paper p-4 space-y-2 text-xs font-bold text-ink-soft">
                <div className="flex items-start gap-2 text-ink">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Respect-First Chat Protection</span>
                </div>
                <p className="leading-relaxed">
                  To protect hosts from unsolicited spam, messaging opens only after you request a meetup and{' '}
                  <strong>{companionName}</strong> accepts it.
                </p>
                <p className="text-ink">
                  Your Balance: <strong className="font-mono">{currentCoins} Coins</strong> (10 Coins deducted per message sent).
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/book/${companionId}`}
                  onClick={onClose}
                  className="w-full rounded-2xl border-2 border-ink bg-[#FF7AC6] py-3 text-xs font-black uppercase text-ink shadow-brutal-sm flex items-center justify-center gap-2"
                >
                  <span>Request Meetup First</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {currentCoins < 10 && (
                  <button
                    type="button"
                    onClick={() => {
                      toast({ title: 'Low Coins', description: 'Top up coins via Razorpay.' });
                      setShowTopup(true);
                    }}
                    className="w-full rounded-xl border-2 border-ink bg-white py-2 text-xs font-black text-ink cursor-pointer"
                  >
                    + Recharge Chat Coins
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <CoinTopupModal
        isOpen={showTopup}
        onClose={() => setShowTopup(false)}
        onSuccess={() => {
          refreshSession();
        }}
      />
    </>
  );
}
