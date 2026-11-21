'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Coins, ShieldCheck, Clock, Infinity, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';
import { loadRazorpayScript } from '@/lib/payments/razorpay';

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

  const [selectedTier, setSelectedTier] = useState<'TWENTY_FOUR_HOURS' | 'FOREVER'>('TWENTY_FOUR_HOURS');
  const [loading, setLoading] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);

  if (!isOpen) return null;

  const currentCoins = user?.coinBalance ?? (isAuthenticated ? 0 : 100);
  const coinsRequired = selectedTier === 'FOREVER' ? 499 : 69;
  const hasEnoughCoins = currentCoins >= coinsRequired;

  const handlePayAndChat = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to message companions.',
      });
      router.push(`/login?intent=member&redirect=/companion/${companionId}`);
      return;
    }

    if (!hasEnoughCoins) {
      toast({
        title: 'Insufficient Coins',
        description: `You need ${coinsRequired} coins. Please top up your wallet.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/chat/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companionId,
          tier: selectedTier,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to unlock chat.');
      }

      toast({
        title: 'Chat Unlocked',
        description: data.alreadyUnlocked
          ? 'Opening your active conversation...'
          : `Paid ${coinsRequired} coins. Chat is now open!`,
      });

      await refreshSession();
      onClose();
      router.push(data.redirectUrl || `/chat/${data.bookingId || ''}`);
    } catch (err: any) {
      toast({
        title: 'Unlock Failed',
        description: err.message || 'Could not complete coin deduction.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTopup = async () => {
    if (!isAuthenticated) {
      router.push(`/login?intent=member&redirect=/companion/${companionId}`);
      return;
    }

    try {
      setIsToppingUp(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || typeof window === 'undefined' || !(window as any).Razorpay) {
        toast({
          title: 'Payment Gateway Error',
          description: 'Could not load Razorpay checkout script. Please disable ad-blockers and try again.',
          variant: 'destructive',
        });
        setIsToppingUp(false);
        return;
      }

      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-order',
          amount: 100,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initiate top-up.');
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'made4togethr',
        description: 'Instant Chat Recharge (100 Coins)',
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            setIsToppingUp(true);
            const verifyRes = await fetch('/api/wallet/topup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify',
                amount: 100,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const vData = await verifyRes.json();
            if (vData.success) {
              toast({
                title: 'Payment Successful',
                description: `Successfully added ${vData.bonus?.totalCoins || 100} coins!`,
              });
              await refreshSession();
            }
          } catch (err) {
            console.error('Verify error:', err);
          } finally {
            setIsToppingUp(false);
          }
        },
        prefill: {
          contact: user?.phone || '',
          email: user?.email || '',
        },
        theme: { color: '#141414' },
        modal: {
          ondismiss: function () {
            setIsToppingUp(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        toast({
          title: 'Payment Failed',
          description: resp.error?.description || 'Payment was unsuccessful.',
          variant: 'destructive',
        });
        setIsToppingUp(false);
      });
      rzp.open();
    } catch (err: any) {
      toast({
        title: 'Top-up Failed',
        description: err.message || 'Could not complete top-up.',
        variant: 'destructive',
      });
      setIsToppingUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border-brutal bg-white p-6 sm:p-7 shadow-brutal-lg text-ink space-y-5 animate-in zoom-in-95 duration-200">

        {/* Header & Close */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-ink tracking-tight">
              Message {companionName}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-ink-muted mt-0.5">
              Choose an option to chat with {companionName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-xl border-brutal-sm bg-paper-deep text-ink hover:bg-pink btn-press cursor-pointer"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Options Radios */}
        <div className="space-y-3">
          {/* 24 Hours */}
          <label
            onClick={() => setSelectedTier('TWENTY_FOUR_HOURS')}
            className={`flex items-center justify-between p-4 rounded-2xl border-brutal-sm cursor-pointer transition-all btn-press ${
              selectedTier === 'TWENTY_FOUR_HOURS'
                ? 'bg-[#D4F7A5] border-ink shadow-brutal-xs ring-2 ring-ink'
                : 'bg-paper-deep border-ink/40 hover:bg-paper'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink">
                {selectedTier === 'TWENTY_FOUR_HOURS' && (
                  <div className="h-2.5 w-2.5 rounded-full bg-ink" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-display text-base font-black text-ink">
                  <Clock className="w-4 h-4 text-ink" />
                  <span>24 hours</span>
                </div>
                <div className="text-xs font-medium text-ink-soft">
                  Write to {companionName} for the next 24 hours.
                </div>
              </div>
            </div>
            <div className="font-display text-base font-black text-ink text-right">
              69 Coins
            </div>
          </label>

          {/* Forever */}
          <label
            onClick={() => setSelectedTier('FOREVER')}
            className={`flex items-center justify-between p-4 rounded-2xl border-brutal-sm cursor-pointer transition-all btn-press ${
              selectedTier === 'FOREVER'
                ? 'bg-[#D4F7A5] border-ink shadow-brutal-xs ring-2 ring-ink'
                : 'bg-paper-deep border-ink/40 hover:bg-paper'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink">
                {selectedTier === 'FOREVER' && (
                  <div className="h-2.5 w-2.5 rounded-full bg-ink" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-display text-base font-black text-ink">
                  <Infinity className="w-4 h-4 text-ink" />
                  <span>Forever</span>
                </div>
                <div className="text-xs font-medium text-ink-soft">
                  Message {companionName} any time, no time limit.
                </div>
              </div>
            </div>
            <div className="font-display text-base font-black text-ink text-right">
              499 Coins
            </div>
          </label>
        </div>

        {/* User Balance Line */}
        <div className="flex items-center justify-between px-1 py-0.5 text-xs font-bold text-ink">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-ink" />
            <span>Your coins: <strong className="underline">{currentCoins}</strong></span>
          </div>
          <Link
            href="/wallet"
            onClick={onClose}
            className="text-[11px] font-black uppercase tracking-wider text-ink underline hover:text-ink-muted"
          >
            + View Full Wallet
          </Link>
        </div>

        {/* Safety & Escrow Guarantees */}
        <div className="space-y-2 rounded-2xl bg-paper-deep p-3.5 border-brutal-sm text-[11px] font-medium text-ink-soft">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              If {companionName} doesn&apos;t reply within 48 hours, your coins come back automatically.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-pink shrink-0 mt-0.5" />
            <span>
              Keep it platonic. Phone numbers, links and payment details hidden for your safety.
            </span>
          </div>
        </div>

        {/* CTA Button or Quick Top Up */}
        {hasEnoughCoins ? (
          <button
            onClick={handlePayAndChat}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl border-brutal bg-ink text-white font-display text-sm font-black shadow-brutal hover:bg-ink-soft transition-all btn-press disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : `Pay ${coinsRequired} coins and open chat`}
          </button>
        ) : (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleQuickTopup}
              disabled={isToppingUp}
              className="w-full py-3.5 px-6 rounded-2xl border-brutal bg-[#D4F7A5] text-ink font-display text-sm font-black shadow-brutal hover:bg-[#c4f089] transition-all btn-press disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Coins className="h-4 w-4" />
              <span>{isToppingUp ? 'Processing...' : `Quick Recharge 100 Coins (INR 100)`}</span>
            </button>
            <div className="text-center">
              <Link
                href="/wallet"
                onClick={onClose}
                className="text-xs font-bold text-ink-muted hover:text-ink underline"
              >
                Or select another amount on Wallet page &rarr;
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
