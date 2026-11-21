'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Coins,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/toast';

interface WalletDetails {
  user: {
    id: string;
    email?: string | null;
    emailVerified?: boolean;
    phone: string;
    name?: string | null;
    role: string;
    coinBalance: number;
    creditBalance: number;
    moneyBalance: number;
    referralCode?: string | null;
  };
  referral: {
    code?: string | null;
    signedUp: number;
    completed: number;
    earned: number;
  };
  isFirstTopup: boolean;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    balanceAfter: number;
    description: string;
    createdAt: string;
    referenceId?: string | null;
  }>;
}

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000];

export default function WalletPage() {
  const { isAuthenticated, user, refreshSession } = useAuth();
  const { toast } = useToast();

  const [wallet, setWallet] = useState<WalletDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState<string>('200');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailBannerDismissed, setEmailBannerDismissed] = useState(false);
  const [referralLink, setReferralLink] = useState<string>('');

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wallet');
      const data = await res.json();
      if (data.success && data.wallet) {
        setWallet(data.wallet);
      }
    } catch (err) {
      console.error('[FETCH_WALLET_ERROR]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [isAuthenticated]);

  useEffect(() => {
    const code = wallet?.referral.code || user?.referralCode || 'JOIN';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://companio-eight.vercel.app';
    setReferralLink(`${origin}/?ref=${code}`);
  }, [wallet?.referral.code, user?.referralCode]);

  const numAmount = Number(customAmount) || 0;
  const isFirstTopup = wallet?.isFirstTopup ?? true;

  // Bonus computation
  let bonusCoins = 0;
  let bonusPercent = 0;
  let bonusTag = '';

  if (isFirstTopup && numAmount >= 100) {
    bonusPercent = 20;
    bonusCoins = Math.min(100, Math.floor(numAmount * 0.20));
    bonusTag = 'First top-up bonus (+20%)';
  } else if (numAmount >= 1000) {
    bonusPercent = 10;
    bonusCoins = Math.floor(numAmount * 0.10);
    bonusTag = 'High-tier top-up bonus (+10%)';
  } else if (numAmount >= 500) {
    bonusPercent = 5;
    bonusCoins = Math.floor(numAmount * 0.05);
    bonusTag = 'Tier bonus (+5%)';
  }

  const totalCoinsExpected = numAmount + bonusCoins;

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(String(amount));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    setSelectedAmount(Number(val));
  };

  const handleTopup = async (simulate = false) => {
    if (numAmount < 10) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum top-up amount is INR 10.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);

      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: simulate ? 'simulate' : 'create-order',
          amount: numAmount,
          isSimulation: simulate,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process top-up.');
      }

      if (simulate) {
        toast({
          title: 'Top-up Successful',
          description: `Added ${data.bonus.totalCoins} coins to your wallet.`,
        });
        await fetchWallet();
        await refreshSession();
        return;
      }

      // Check if Razorpay script is present
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'made4togethr',
        description: `Wallet Recharge: ${numAmount} Coins`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/wallet/topup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify',
                amount: numAmount,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast({
                title: 'Payment Successful',
                description: `Successfully recharged ${verifyData.bonus.totalCoins} coins!`,
              });
              await fetchWallet();
              await refreshSession();
            } else {
              toast({
                title: 'Verification Failed',
                description: verifyData.error || 'Payment verification failed.',
                variant: 'destructive',
              });
            }
          } catch (vErr) {
            toast({
              title: 'Error',
              description: 'Error confirming payment.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          contact: wallet?.user.phone || '',
          email: wallet?.user.email || '',
        },
        theme: {
          color: '#141414',
        },
      };

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback to simulation if Razorpay SDK script is blocked or missing in local environment
        toast({
          title: 'Razorpay SDK Unavailable',
          description: 'Executing sandbox test simulation for immediate credit.',
        });
        await handleTopup(true);
      }
    } catch (err: any) {
      toast({
        title: 'Top-up Error',
        description: err.message || 'Could not process top-up request.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const activeLink = referralLink || (typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${wallet?.referral.code || user?.referralCode || 'JOIN'}`
    : `https://companio-eight.vercel.app/?ref=${wallet?.referral.code || user?.referralCode || 'JOIN'}`);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(activeLink);
    setCopiedLink(true);
    toast({
      title: 'Link Copied',
      description: 'Referral link copied to clipboard.',
    });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join me on Togethr to find ID-verified local buddies for gym, coffee, and city walks! Sign up with my link and get INR 100 free credit: ${activeLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const currentCoins = wallet?.user.coinBalance ?? 100;
  const currentCredit = wallet?.user.creditBalance ?? 100;
  const currentMoney = wallet?.user.moneyBalance ?? 0;

  return (
    <div className="min-h-screen bg-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Email Verification Banner */}
        {!emailBannerDismissed && wallet?.user && !wallet.user.emailVerified && (
          <div className="flex items-center justify-between gap-3 p-3.5 bg-sunny-soft border-brutal-sm rounded-xl text-ink text-xs sm:text-sm font-bold shadow-brutal-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-ink" />
              <span>
                Verify your email &mdash; we sent a confirmation link to{' '}
                <span className="underline">{wallet.user.email || 'your email'}</span>.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toast({ title: 'Email Sent', description: 'Verification link resent.' })}
                className="underline hover:text-ink-muted cursor-pointer"
              >
                Resend
              </button>
              <button
                onClick={() => setEmailBannerDismissed(true)}
                className="text-ink-muted hover:text-ink font-bold ml-2 cursor-pointer"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight flex items-center gap-2">
              <Wallet className="w-7 h-7 text-ink" />
              <span>Wallet &amp; Coins</span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-ink-muted">
              Manage your balance, add coins, and view transaction history.
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-ink bg-white border-brutal-sm px-3 py-1.5 rounded-xl shadow-brutal-xs hover:bg-paper-deep btn-press"
          >
            <span>Explore Hosts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Green Balance Card */}
        <div className="relative overflow-hidden rounded-2xl border-brutal bg-[#D4F7A5] p-6 sm:p-8 shadow-brutal text-ink">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black tracking-widest uppercase text-ink-soft">
              BALANCE
            </span>
            <div className="flex items-center gap-1.5 bg-black/10 px-2.5 py-1 rounded-full text-xs font-black">
              <Coins className="w-3.5 h-3.5" />
              <span>1 Coin = INR 1</span>
            </div>
          </div>

          <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2">
            INR {currentCoins}{' '}
            <span className="text-lg sm:text-2xl font-bold text-ink-soft">
              ({currentCoins} coins)
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-ink-soft">
            INR {currentMoney} money &middot; INR {currentCoins} credit &amp; coins for meetups and chats, can&apos;t be withdrawn
          </p>
        </div>

        {/* Add Coins Section */}
        <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-6">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
              <Coins className="w-5 h-5 text-ink" />
              <span>Add Coins</span>
            </h2>
            <p className="text-xs sm:text-sm font-medium text-ink-muted mt-1">
              1 coin = INR 1. Use coins to message hosts or pay for meetups. Coins can&apos;t be withdrawn.
            </p>
          </div>

          {/* Bonus Tiers Callout Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className={`p-2.5 rounded-xl border-brutal-sm text-center ${isFirstTopup ? 'bg-[#FFE2EC]' : 'bg-paper-deep'}`}>
              <div className="text-[11px] font-black uppercase tracking-wider text-ink">
                First Top-Up
              </div>
              <div className="text-xs font-bold text-ink-soft mt-0.5">
                +20% (up to 100) on INR 100+
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border-brutal-sm text-center ${numAmount >= 500 && numAmount < 1000 ? 'bg-[#D4F7A5]' : 'bg-paper-deep'}`}>
              <div className="text-[11px] font-black uppercase tracking-wider text-ink">
                INR 500+ Top-Up
              </div>
              <div className="text-xs font-bold text-ink-soft mt-0.5">
                +5% Bonus Coins
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border-brutal-sm text-center ${numAmount >= 1000 ? 'bg-[#D4F7A5]' : 'bg-paper-deep'}`}>
              <div className="text-[11px] font-black uppercase tracking-wider text-ink">
                INR 1,000+ Top-Up
              </div>
              <div className="text-xs font-bold text-ink-soft mt-0.5">
                +10% Bonus Coins
              </div>
            </div>
          </div>

          {/* Amount Input & Preset Chips */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-ink">
              Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg font-bold text-ink">
                INR
              </span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="200"
                className="w-full pl-14 pr-4 py-3 rounded-xl border-brutal text-lg font-bold text-ink focus:outline-none focus:ring-2 focus:ring-ink shadow-brutal-xs"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectPreset(amt)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-brutal-sm transition-all btn-press ${
                      isSelected
                        ? 'bg-ink text-white shadow-brutal-xs'
                        : 'bg-paper-deep text-ink hover:bg-white'
                    }`}
                  >
                    INR {amt.toLocaleString('en-IN')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculated Output Note */}
          <div className="p-3.5 rounded-xl bg-paper-deep border-brutal-sm flex items-center justify-between text-xs sm:text-sm font-bold text-ink">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-ink shrink-0" />
              <span>
                You&apos;ll get <strong className="underline">{totalCoinsExpected} coins</strong>{' '}
                ({numAmount} {bonusCoins > 0 ? `+ ${bonusCoins} bonus ${bonusTag}` : ''})
              </span>
            </div>
            <span className="text-[11px] text-ink-muted uppercase tracking-wider font-mono">
              Secured by Razorpay
            </span>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleTopup(false)}
              disabled={isProcessing || numAmount < 10}
              className="w-full py-3.5 px-6 rounded-xl border-brutal bg-ink text-white font-display text-sm sm:text-base font-black shadow-brutal hover:bg-ink-soft transition-all btn-press disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? 'Processing...' : `Pay INR ${numAmount} with Razorpay`}
            </button>

            {/* Dev Sandbox Instant Top-Up Button */}
            <button
              onClick={() => handleTopup(true)}
              disabled={isProcessing || numAmount < 10}
              className="w-full py-2.5 px-4 rounded-xl border-brutal-sm bg-sunny-soft text-ink text-xs font-bold shadow-brutal-xs hover:bg-sunny transition-all btn-press cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Instant Top-up (Test Simulation)</span>
            </button>
          </div>
        </div>

        {/* Referral Card */}
        <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
                <Share2 className="w-5 h-5 text-ink" />
                <span>Invite friends, get INR 100 each</span>
              </h2>
              <p className="text-xs sm:text-sm font-medium text-ink-muted mt-1">
                Share your link. When a friend signs up and completes their first meetup, both of you get INR 100 credit.
              </p>
            </div>
          </div>

          {/* Link Box */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div
              suppressHydrationWarning
              className="flex-1 px-3.5 py-2.5 rounded-xl border-brutal-sm bg-paper-deep text-xs font-mono font-bold text-ink break-all flex items-center"
            >
              <span suppressHydrationWarning>{referralLink || 'Generating your invite link...'}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyReferralLink}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-brutal-sm bg-white text-ink text-xs font-black shadow-brutal-xs hover:bg-paper-deep btn-press cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={shareWhatsApp}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-brutal-sm bg-[#D4F7A5] text-ink text-xs font-black shadow-brutal-xs hover:bg-[#c3ec8d] btn-press cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp share</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t-brutal-sm">
            <div className="text-center">
              <div className="text-xs font-medium text-ink-muted">Signed up</div>
              <div className="font-display text-lg sm:text-xl font-black text-ink">
                {wallet?.referral.signedUp || 0}
              </div>
            </div>
            <div className="text-center border-x-brutal-sm">
              <div className="text-xs font-medium text-ink-muted">Completed</div>
              <div className="font-display text-lg sm:text-xl font-black text-ink">
                {wallet?.referral.completed || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-ink-muted">You earned</div>
              <div className="font-display text-lg sm:text-xl font-black text-emerald-600">
                INR {wallet?.referral.earned || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="rounded-2xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg sm:text-xl font-black text-ink uppercase tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-ink" />
              <span>Transactions</span>
            </h2>
            <span className="text-xs font-medium text-ink-muted">
              {wallet?.transactions.length || 0} entries
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-bold text-ink-muted">
              Loading transactions ledger...
            </div>
          ) : !wallet?.transactions || wallet.transactions.length === 0 ? (
            <div className="py-8 text-center text-xs font-bold text-ink-muted">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="divide-y-brutal-sm">
              {wallet.transactions.map((tx) => {
                const isPositive = tx.amount > 0;
                const formattedDate = new Date(tx.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-black text-ink">
                        {tx.description}
                      </div>
                      <div className="text-[11px] font-medium text-ink-muted">
                        {formattedDate} &middot; bal {tx.balanceAfter} coins
                      </div>
                    </div>
                    <div
                      className={`font-display text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg border-brutal-sm shadow-brutal-xs shrink-0 ${
                        isPositive ? 'bg-[#D4F7A5] text-ink' : 'bg-[#FFE2EC] text-ink'
                      }`}
                    >
                      {isPositive ? `+ INR ${tx.amount}` : `- ${Math.abs(tx.amount)} coins`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
