"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Check, Sparkles, CheckCircle2 } from "lucide-react";
import { PASS_TIER_OPTIONS } from "@/lib/data";
import { PassTier } from "@/types";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionName?: string;
  onUnlockedSuccess?: () => void;
}

export function PaywallModal({
  isOpen,
  onClose,
  companionName,
  onUnlockedSuccess,
}: PaywallModalProps) {
  const [selectedTier, setSelectedTier] = useState<PassTier>("THREE_MONTH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [needsPhone, setNeedsPhone] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async (tier: PassTier, price: number) => {
    setIsProcessing(true);

    try {
      // 1. Create Order
      const orderRes = await fetch("/api/passes/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, phone: phone || undefined }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Simulate Razorpay payment capture in sandbox mode
      const paymentId = `pay_rzp_mock_${Date.now()}`;
      const verifyRes = await fetch("/api/passes/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.orderId,
          paymentId,
          tier,
          phone: phone || undefined,
        }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      // Success
      setUnlockedSuccess(true);
      if (onUnlockedSuccess) onUnlockedSuccess();
    } catch (err) {
      alert((err as Error).message || "Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#333] bg-[#121212] p-6 text-white shadow-2xl md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[#8E8E93] hover:bg-[#202020] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {unlockedSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 animate-in zoom-in-50" />
            <h2 className="mt-4 font-serif text-3xl font-extrabold text-white">
              Companio Club Unlocked!
            </h2>
            <p className="mt-2 text-sm text-[#A1A1A6] max-w-md mx-auto">
              Your pass has been activated successfully. All companion profile photos are unblurred and booking privileges are active.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="rounded-full bg-[#D4AF37] px-8 py-3 text-xs font-bold text-black hover:bg-[#E5C158] transition"
              >
                Browse Unmasked Profiles
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Unlock Full Profiles & Direct Booking</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl text-white">
                {companionName ? `Meet ${companionName} & Other Verified Hosts` : "Join Companio Club"}
              </h2>
              <p className="mt-2 text-xs text-[#8E8E93] sm:text-sm max-w-lg mx-auto">
                Choose an Access Pass to remove photo blurs, read full verified bios, and send instant booking requests.
              </p>
            </div>

            {/* Pricing Tier Grid */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {PASS_TIER_OPTIONS.slice(0, 3).map((option) => {
                const isSelected = selectedTier === option.tier;
                return (
                  <div
                    key={option.tier}
                    onClick={() => setSelectedTier(option.tier)}
                    className={`relative cursor-pointer rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#D4AF37] bg-[#1A1A1A] shadow-lg shadow-[#D4AF37]/10"
                        : "border-[#262626] bg-[#141414] hover:border-[#383838]"
                    }`}
                  >
                    {option.isPopular && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-[#D4AF37] px-2 py-0.5 text-[9px] font-black uppercase text-black">
                        Popular
                      </span>
                    )}
                    <div className="text-xs font-semibold text-[#8E8E93]">{option.name}</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-serif text-2xl font-extrabold text-white">₹{option.price}</span>
                      {option.durationDays && (
                        <span className="text-[10px] text-[#666]">/{option.durationDays}d</span>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] text-[#A1A1A6] leading-tight">{option.tagline}</p>
                  </div>
                );
              })}
            </div>

            {/* Lifetime Bar */}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[#262626] bg-[#141414] px-4 py-2.5 text-xs">
              <div>
                <span className="font-bold text-white">Lifetime Pass (₹999.50)</span>
                <span className="text-[#8E8E93] ml-2 text-[11px]">— Never expires. Founding member badge.</span>
              </div>
              <button
                onClick={() => handlePurchase("LIFETIME", 999.50)}
                className="rounded-full border border-[#D4AF37]/40 px-3 py-1 font-bold text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                Get Lifetime
              </button>
            </div>

            {/* Selected Tier Features Checklist */}
            <div className="mt-5 rounded-xl bg-[#0A0A0A] border border-[#222] p-4 text-xs">
              <div className="font-semibold text-white mb-2">What this pass unlocks:</div>
              <div className="grid grid-cols-2 gap-2 text-[#A1A1A6]">
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>Crystal clear unblurred portraits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>Full host bio, hobbies & reviews</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>Direct session booking button</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>Real-time WebSocket chat access</span>
                </div>
              </div>
            </div>

            {/* Notice on Companion Hourly Rate */}
            <p className="mt-3 text-center text-[10px] text-[#666]">
              Note: Access Pass provides profile & booking privileges. Companion hourly rates (e.g. ₹499/hr) are paid upon booking into escrow.
            </p>

            {/* Checkout Action Button */}
            <div className="mt-5">
              <button
                disabled={isProcessing}
                onClick={() => {
                  const opt = PASS_TIER_OPTIONS.find((p) => p.tier === selectedTier);
                  if (opt) handlePurchase(opt.tier, opt.price);
                }}
                className="w-full rounded-full bg-[#D4AF37] py-3.5 text-center text-sm font-bold text-black transition hover:bg-[#E5C158] disabled:opacity-50 shadow-md"
              >
                {isProcessing
                  ? "Processing Razorpay Sandbox Order..."
                  : `Unlock Profile Access Now (₹${PASS_TIER_OPTIONS.find((p) => p.tier === selectedTier)?.price})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
