'use client';

import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Check,
  Sparkles,
  X,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { openRazorpayCheckout } from '@/lib/payments/razorpay';
import { useToast } from '@/components/ui/toast';
import { PASS_TIER_OPTIONS } from '@/lib/data';
import { PassTier } from '@/types';

interface UnlockProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion?: {
    id: string;
    name: string;
    avatarUrl?: string;
  } | null;
  onSuccess?: () => void;
}

export function UnlockProfileModal({
  isOpen,
  onClose,
  companion,
  onSuccess,
}: UnlockProfileModalProps) {
  const { error, success } = useToast();
  const { user, isAuthenticated, refreshSession } = useAuth();

  const [selectedTier, setSelectedTier] = useState<PassTier>('THREE_MONTH');
  const [platonicAgreed, setPlatonicAgreed] = useState(true);

  // Auth subflow states for guests
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Payment loading state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isOpen) return null;

  const currentOption = PASS_TIER_OPTIONS.find((t) => t.tier === selectedTier) || PASS_TIER_OPTIONS[1];
  const maskedName = companion?.name
    ? `${companion.name.slice(0, 3)}****`
    : 'Companion';

  const handleSendOtp = async () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      error('Please enter a valid 10-digit mobile number.', 'Invalid Phone');
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${clean.slice(-10)}` }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        success('Verification code sent to your number.', 'Code Sent');
      } else {
        error(data.error || 'Failed to send code.', 'Error');
      }
    } catch {
      error('Network error sending verification code.', 'Error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtpAndProceed = async () => {
    if (!otpCode || otpCode.length < 6) {
      error('Please enter the 6-digit code.', 'Incomplete Code');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const clean = phone.replace(/\D/g, '');
      const cleanPhone = `+91${clean.slice(-10)}`;
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          code: otpCode,
          name: fullName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshSession();
        success('Mobile verified successfully.', 'Verified');
        // Continue directly to payment with the newly created session
        await initiatePassPayment(cleanPhone, data.user?.id);
      } else {
        error(data.error || 'Verification failed. Please check code.', 'Invalid Code');
      }
    } catch {
      error('Verification error. Please retry.', 'Error');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const initiatePassPayment = async (verifiedPhone?: string, verifiedUserId?: string) => {
    if (!platonicAgreed) {
      error('You must agree to the strictly platonic guidelines to continue.', 'Policy Agreement');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const cleanInputDigits = phone.replace(/\D/g, '').slice(-10);
      const enteredPhone = cleanInputDigits.length === 10 ? `+91${cleanInputDigits}` : '';
      const contactPhone = verifiedPhone || enteredPhone || user?.phone || '';
      const contactName = fullName.trim() || user?.name || 'Member';

      // 1. Create order on server
      const orderRes = await fetch('/api/passes/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          phone: contactPhone,
          name: contactName,
          userId: verifiedUserId || user?.id,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create pass order');
      }

      const orderObj = orderData.order || orderData;
      const orderAmount = Number(orderData.amount || orderObj?.amount) || Math.round(currentOption.price * 100);
      const orderId = String(orderData.orderId || orderObj?.orderId || '');
      const keyId = String(orderData.keyId || orderObj?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_U1vu1rlfL1qiHG');

      // 2. Launch Razorpay Checkout Modal
      await openRazorpayCheckout({
        key: keyId,
        amount: orderAmount,
        currency: 'INR',
        name: 'Meetzy Club',
        description: `${currentOption.name} Access Pass`,
        order_id: orderId,
        prefill: {
          name: contactName,
          contact: contactPhone,
        },
        theme: {
          color: '#101828',
        },
        handler: async (paymentResponse) => {
          try {
            const verifyRes = await fetch('/api/passes/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: paymentResponse.razorpay_order_id || orderId,
                paymentId: paymentResponse.razorpay_payment_id,
                signature: paymentResponse.razorpay_signature,
                tier: selectedTier,
                phone: contactPhone,
                name: contactName,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              success('Pass activated! All companion profiles are now unlocked.', 'Access Granted');
              await refreshSession();
              onSuccess?.();
              onClose();
            } else {
              error(verifyData.error || 'Payment signature verification failed.', 'Verification Error');
            }
          } catch {
            error('Failed to confirm pass activation.', 'Error');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
        },
      });
    } catch (err: any) {
      error(err.message || 'Payment initiation failed.', 'Checkout Error');
      setIsProcessingPayment(false);
    }
  };

  const handleMainCtaClick = () => {
    if (!isAuthenticated && !otpSent) {
      // Focus on mobile input or prompt send
      handleSendOtp();
      return;
    }
    if (!isAuthenticated && otpSent) {
      handleVerifyOtpAndProceed();
      return;
    }
    initiatePassPayment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border-3 border-ink bg-white p-5 sm:p-7 shadow-brutal-lg text-ink"
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

        {/* Modal Header */}
        <div className="space-y-2 pr-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sunny-soft px-3 py-0.5 text-xs font-black text-ink shadow-brutal-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-ink" />
            <span>Passes from ₹199</span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-black text-ink leading-tight">
            Unlock {maskedName}'s profile and every profile on Meetzy Club.
          </h2>

          <p className="text-xs sm:text-sm font-bold text-ink-muted">
            One payment. No auto-renewal, no auto-debit.
          </p>
        </div>

        {/* Pass Selection Cards */}
        <div className="mt-5 space-y-2.5">
          <label className="block text-xs font-black uppercase tracking-wider text-ink">
            Choose your pass
          </label>

          {PASS_TIER_OPTIONS.map((opt) => {
            const isSelected = selectedTier === opt.tier;
            return (
              <div
                key={opt.tier}
                onClick={() => setSelectedTier(opt.tier as PassTier)}
                className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 border-ink cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-ink text-white shadow-brutal'
                    : 'bg-paper hover:bg-paper-deep text-ink'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded-full border-2 border-ink flex items-center justify-center ${
                      isSelected ? 'bg-lime border-white' : 'bg-white'
                    }`}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-ink" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-black">
                        {opt.name}
                      </span>
                      {opt.isPopular && (
                        <span className="rounded-md border border-ink bg-lime px-2 py-0.5 text-[10px] font-black uppercase text-ink">
                          Recommended
                        </span>
                      )}
                      {opt.tier === 'ONE_YEAR' && (
                        <span className="rounded-md border border-ink bg-sunny px-2 py-0.2 text-[10px] font-black uppercase text-ink">
                          Best Value
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium ${
                        isSelected ? 'text-white/80' : 'text-ink-soft'
                      }`}
                    >
                      {opt.tagline}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-display text-base sm:text-lg font-black">
                    ₹{opt.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanatory Callout */}
        <div className="mt-4 rounded-xl border border-ink/30 bg-paper p-3 text-xs text-ink-soft leading-relaxed font-medium">
          The pass unlocks full profiles; chat opens once a companion accepts your booking.
          Each meetup is paid separately at the companion's hourly rate, shown before you pay.
        </div>

        {/* Value Proposition Bullets */}
        <div className="mt-3.5 space-y-2 border-y-2 border-ink/10 py-3 text-xs font-bold text-ink">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Unblurred photos and full profiles of every companion, in every open city.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Send a meetup request to anyone you like. Chat opens once they accept.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Eligible members can spin once a week (discounts up to 20% off).</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mt-4 rounded-2xl border-2 border-ink bg-paper p-3.5 space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-ink-muted">
            Price breakdown
          </div>
          <div className="flex justify-between text-xs font-bold text-ink-soft">
            <span>Pass: {currentOption.name}</span>
            <span className="font-mono text-ink">₹{currentOption.price}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-ink-soft">
            <span>Taxes and processing</span>
            <span className="text-emerald-700 uppercase text-[10px] font-black">Included</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-ink-soft">
            <span>Meetups</span>
            <span className="text-ink-muted">Paid separately when you book</span>
          </div>
          <div className="pt-2 border-t border-ink/20 flex justify-between items-baseline font-display">
            <span className="text-sm font-black text-ink">Total today</span>
            <span className="text-lg font-black text-ink">₹{currentOption.price}</span>
          </div>
        </div>

        {/* Platonic Policy Agreement Checkbox */}
        <div className="mt-4 flex items-start gap-2.5">
          <input
            id="platonic-check"
            type="checkbox"
            checked={platonicAgreed}
            onChange={(e) => setPlatonicAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-2 border-ink text-ink focus:ring-0 cursor-pointer"
          />
          <label htmlFor="platonic-check" className="text-xs font-bold text-ink-soft cursor-pointer">
            Strictly platonic, public places only. I agree to uphold these terms for member &amp; host safety.
          </label>
        </div>

        {/* Member Details or Guest Mobile OTP Section */}
        {isAuthenticated ? (
          <div className="mt-4 rounded-2xl border-2 border-ink bg-paper p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full border-2 border-ink bg-lime flex items-center justify-center font-black text-xs text-ink shadow-brutal-xs">
                {user?.name?.[0]?.toUpperCase() || 'M'}
              </div>
              <div>
                <div className="text-xs font-black text-ink">{user?.name || 'Verified Member'}</div>
                <div className="text-[11px] font-mono font-bold text-ink-muted">{user?.phone || 'Logged in'}</div>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-ink text-white px-2.5 py-1 rounded-lg">
              Active Member
            </span>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border-2 border-ink bg-white p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-ink" />
              <span className="text-xs font-black uppercase text-ink">
                Step 1: Your Details (+91)
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name (e.g. Rahul Sharma)"
                disabled={otpSent}
                className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2 font-display text-xs font-bold text-ink focus:outline-none focus:bg-white"
              />

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-black text-ink-muted">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    disabled={otpSent}
                    className="w-full rounded-xl border-2 border-ink bg-paper pl-11 pr-3 py-2 font-mono text-sm font-bold text-ink focus:outline-none focus:bg-white"
                  />
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="rounded-xl border-2 border-ink bg-sunny px-3.5 py-2 font-display text-xs font-black text-ink shadow-brutal-xs hover:bg-sunny-soft transition cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isSendingOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                    className="rounded-xl border border-ink/30 bg-paper px-2.5 py-2 text-[11px] font-bold text-ink-muted hover:text-ink cursor-pointer shrink-0"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2 pt-1 animate-in fade-in">
                {/* 1-Tap Auto Fill Helper Banner */}
                <div
                  onClick={() => setOtpCode('123456')}
                  className="flex items-center justify-between rounded-xl border border-emerald-600/30 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 font-bold cursor-pointer hover:bg-emerald-100 transition"
                >
                  <span>1-Tap Demo Code (123456)</span>
                  <span className="underline text-[10px] uppercase font-black">Fill Code</span>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2 font-mono text-sm font-bold tracking-widest text-ink focus:outline-none focus:bg-white text-center"
                />
              </div>
            )}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={handleMainCtaClick}
            disabled={isProcessingPayment || isVerifyingOtp || !platonicAgreed}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-3 border-ink bg-ink text-white py-3.5 font-display text-sm font-black shadow-brutal hover:bg-black transition-all btn-press cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingPayment || isVerifyingOtp ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Processing...</span>
              </>
            ) : !isAuthenticated && !otpSent ? (
              <>
                <span>Continue with Phone Number</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : !isAuthenticated && otpSent ? (
              <>
                <span>Verify &amp; Unlock · ₹{currentOption.price}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-lime" />
                <span>Unlock all profiles · ₹{currentOption.price}</span>
              </>
            )}
          </button>

          <div className="text-center text-[11px] font-bold text-ink-muted">
            Step 1: Mobile code · Step 2: Pay by UPI / Razorpay
          </div>
        </div>
      </div>
    </div>
  );
}
