'use client';

import React, { useState } from 'react';
import { Coins, X, ArrowRight, Loader2, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { openRazorpayCheckout } from '@/lib/payments/razorpay';
import { useToast } from '@/components/ui/toast';
import { triggerCelebration } from '@/components/ui/celebration';

interface CoinTopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialAmount?: number;
}

const PRESET_AMOUNTS = [
  { coins: 50, inr: 50, label: 'Starter' },
  { coins: 100, inr: 100, label: 'Most Popular', bonus: '+20% First Topup' },
  { coins: 200, inr: 200, label: 'Chat Pack' },
  { coins: 500, inr: 500, label: 'Power User', bonus: '+5% Bonus' },
];

export function CoinTopupModal({
  isOpen,
  onClose,
  onSuccess,
  initialAmount = 100,
}: CoinTopupModalProps) {
  const { toast, error, success } = useToast();
  const { user, refreshSession } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentCoins = user?.coinBalance ?? 0;
  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleRecharge = async () => {
    if (!effectiveAmount || effectiveAmount < 10) {
      error('Minimum recharge amount is ₹10.', 'Invalid Amount');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create order
      const orderRes = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-order',
          amount: effectiveAmount,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate coin order.');
      }

      const checkoutKey = orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
      if (!checkoutKey) {
        throw new Error('Payment gateway key is not configured.');
      }

      // 2. Open Razorpay Checkout
      await openRazorpayCheckout({
        key: checkoutKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Meetzy Club Coins',
        description: `Recharge ${effectiveAmount} Chat Coins`,
        order_id: orderData.orderId,
        prefill: {
          name: user?.name || 'Member',
          contact: user?.phone || '',
        },
        theme: {
          color: '#101828',
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/wallet/topup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify',
                amount: effectiveAmount,
                razorpayOrderId: response.razorpay_order_id || orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              const totalAdded = verifyData.bonus?.totalCoins || effectiveAmount;
              success(`Successfully recharged ${totalAdded} coins!`, 'Wallet Credited');
              triggerCelebration(`+${totalAdded} Coins Added!`);
              await refreshSession();
              onSuccess?.();
              onClose();
            } else {
              error(verifyData.error || 'Payment signature could not be verified.', 'Error');
            }
          } catch {
            error('Failed to credit coins. Please reach support with payment ID.', 'Error');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      });
    } catch (err: any) {
      error(err.message || 'Payment initiation failed.', 'Error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-3xl border-3 border-ink bg-white p-5 sm:p-7 shadow-brutal-lg text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border-2 border-ink bg-paper p-1.5 hover:bg-black/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-4 w-4 text-ink" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-[#D4F7A5] px-3 py-0.5 text-xs font-black text-ink shadow-brutal-xs">
            <Coins className="h-3.5 w-3.5 text-ink" />
            <span>1 Coin = ₹1</span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-black text-ink">
            Recharge Chat Coins
          </h2>

          <p className="text-xs font-bold text-ink-muted">
            Coins power direct in-app messaging with companions.
          </p>
        </div>

        {/* Current Balance Bar */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-ink bg-paper p-3.5">
          <span className="text-xs font-black uppercase text-ink-muted">Current Coin Balance</span>
          <span className="font-display text-base font-black text-ink">
            {currentCoins} Coins
          </span>
        </div>

        {/* Presets Grid */}
        <div className="mt-4 space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-ink">
            Select Amount
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {PRESET_AMOUNTS.map((p) => {
              const isSelected = !customAmount && selectedAmount === p.inr;
              return (
                <div
                  key={p.inr}
                  onClick={() => {
                    setSelectedAmount(p.inr);
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-2xl border-2 border-ink cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-ink text-white shadow-brutal'
                      : 'bg-paper hover:bg-paper-deep text-ink'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-black">
                      {p.coins} Coins
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded border ${
                        isSelected
                          ? 'border-white bg-lime text-ink'
                          : 'border-ink bg-white text-ink-muted'
                      }`}
                    >
                      {p.label}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-baseline">
                    <span className="text-xs font-bold">₹{p.inr}</span>
                    {p.bonus && (
                      <span className="text-[10px] font-bold text-emerald-500">{p.bonus}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <div className="mt-3.5 space-y-1">
          <label className="block text-xs font-bold text-ink-soft">
            Or custom amount (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display text-xs font-black text-ink-muted">
              ₹
            </span>
            <input
              type="number"
              min={10}
              max={10000}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 150"
              className="w-full rounded-xl border-2 border-ink bg-paper pl-8 pr-3 py-2 font-display text-sm font-bold text-ink focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={handleRecharge}
            disabled={isProcessing || !effectiveAmount || effectiveAmount < 10}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-3 border-ink bg-lime text-ink py-3 font-display text-sm font-black shadow-brutal hover:bg-sunny transition-all btn-press cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-ink" />
                <span>Opening Checkout...</span>
              </>
            ) : (
              <>
                <span>Pay ₹{effectiveAmount} &amp; Add {effectiveAmount} Coins</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-ink-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            <span>Instant UPI &amp; Cards · Secured by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
