"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Check, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { PASS_TIER_OPTIONS } from "@/lib/data";
import { PassTier } from "@/types";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionName?: string;
  onUnlockedSuccess?: () => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
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
  const [agreedPlatonic, setAgreedPlatonic] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email?: string | null;
    phone?: string | null;
    name?: string | null;
    isUnlocked?: boolean;
  } | null>(null);
  const [emailInput, setEmailInput] = useState("");

  // Check auth session on mount
  useEffect(() => {
    if (isOpen) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            if (data.user.email) setEmailInput(data.user.email);
            else if (data.user.phone) setEmailInput(data.user.phone);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOption =
    PASS_TIER_OPTIONS.find((p) => p.tier === selectedTier) || PASS_TIER_OPTIONS[1];

  const handlePurchase = async (tier: PassTier, price: number) => {
    if (!agreedPlatonic) {
      alert("Please agree to meet in public and keep it strictly platonic to continue.");
      return;
    }

    const effectiveIdentifier = currentUser?.email || currentUser?.phone || emailInput.trim();
    if (!effectiveIdentifier) {
      alert("Please enter your email address so your access pass is securely saved to your account.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Order with linked account
      const isEmail = effectiveIdentifier.includes("@");
      const orderRes = await fetch("/api/passes/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          email: isEmail ? effectiveIdentifier.toLowerCase() : undefined,
          phone: !isEmail ? effectiveIdentifier : undefined,
          identifier: effectiveIdentifier,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. If real Razorpay key is active, open native Razorpay checkout modal
      if (orderData.order?.isLive) {
        const loaded = await loadRazorpayScript();
        if (loaded && (window as any).Razorpay) {
          const options = {
            key: orderData.order.keyId,
            amount: orderData.order.amount,
            currency: orderData.order.currency,
            name: "Companio",
            description: `${orderData.order.tierName} Access Pass`,
            order_id: orderData.order.orderId,
            handler: async function (response: any) {
              try {
                const verifyRes = await fetch("/api/passes/verify-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: response.razorpay_order_id || orderData.order.orderId,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    tier,
                    email: isEmail ? effectiveIdentifier.toLowerCase() : undefined,
                    phone: !isEmail ? effectiveIdentifier : undefined,
                    identifier: effectiveIdentifier,
                  }),
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok || !verifyData.success) {
                  throw new Error(verifyData.error || "Payment verification failed");
                }
                setUnlockedSuccess(true);
                if (onUnlockedSuccess) onUnlockedSuccess();
              } catch (verifyErr) {
                alert((verifyErr as Error).message || "Verification failed");
              } finally {
                setIsProcessing(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
              },
            },
            prefill: {
              email: isEmail ? effectiveIdentifier.toLowerCase() : "",
              contact: !isEmail ? effectiveIdentifier : "",
            },
            theme: {
              color: "#101828",
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        }
      }

      // 3. Sandbox Fallback Simulation with account persistence
      const paymentId = `pay_rzp_mock_${Date.now()}`;
      const verifyRes = await fetch("/api/passes/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.orderId,
          paymentId,
          tier,
          email: isEmail ? effectiveIdentifier.toLowerCase() : undefined,
          phone: !isEmail ? effectiveIdentifier : undefined,
          identifier: effectiveIdentifier,
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
    <div
      className="fixed inset-0 z-[120] flex items-end md:items-center md:justify-center"
      style={{ backgroundColor: "rgba(20, 18, 42, 0.55)" }}
    >
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Bottom Sheet Container */}
      <div className="relative z-10 w-full max-h-[92dvh] md:max-w-md bg-[#FFFFFF] text-slate-900 rounded-t-[28px] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Top Drag Handle on Mobile */}
        <div className="pt-3 pb-1 flex justify-center md:hidden">
          <span className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Close Button Header */}
        <div className="flex items-center justify-between px-5 py-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
            <span>Passes from ₹99.50</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {unlockedSuccess ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600 animate-in zoom-in-50" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Profiles Unlocked!
            </h2>
            <p className="mt-2 text-xs text-slate-600 max-w-sm mx-auto">
              Your pass has been activated. All companion portrait photos are unblurred and chat requests are ready to send.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-black transition"
              >
                Start Exploring Profiles
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 flex flex-col gap-4">
            {/* Title & Subtitle */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {companionName
                  ? `Unlock ${companionName}'s profile and every profile on Companio.`
                  : "Unlock all profiles on Companio."}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                One payment. No auto-renewal, no auto-debit.
              </p>
            </div>

            {/* Pass Selection Options */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Choose your pass
              </div>

              {PASS_TIER_OPTIONS.map((opt) => {
                const isSelected = selectedTier === opt.tier;
                return (
                  <div
                    key={opt.tier}
                    onClick={() => setSelectedTier(opt.tier)}
                    className={`relative cursor-pointer rounded-xl p-3.5 border transition ${
                      isSelected
                        ? "bg-[#101828] text-white border-[#101828] shadow-md"
                        : "bg-white text-slate-900 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Radio Indicator */}
                        <div
                          className={`h-4 w-4 rounded-full flex items-center justify-center border transition ${
                            isSelected
                              ? "border-white bg-white"
                              : "border-slate-400 bg-transparent"
                          }`}
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-[#101828]" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{opt.name}</span>
                            {opt.tier === "THREE_MONTH" && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  isSelected
                                    ? "bg-amber-400 text-black"
                                    : "bg-amber-100 text-amber-900"
                                }`}
                              >
                                Save 16% vs monthly
                              </span>
                            )}
                            {opt.tier === "ONE_YEAR" && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  isSelected
                                    ? "bg-slate-700 text-white"
                                    : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                Best value
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[11px] mt-0.5 ${
                              isSelected ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {opt.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-base">₹{opt.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>Send a meetup request to anyone you like. Chat opens once they accept.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>Eligible members can spin once a week. About 1 in 20 spins wins a discount, up to 20% off.</span>
              </div>
            </div>

            {/* Price Breakdown Box */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 mb-1">Price breakdown</div>
              <div className="flex justify-between text-slate-600">
                <span>Pass: {currentOption.name}</span>
                <span className="font-semibold text-slate-900">₹{currentOption.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes and processing</span>
                <span className="text-emerald-700 font-medium">Included</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Meetups</span>
                <span>Paid separately when you book</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total today</span>
                <span>₹{currentOption.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Safety & Trust Checkmarks */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Look for the ID-checked badge on a profile</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Strictly platonic, public places only</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Unlimited profile views while your pass lasts</span>
              </div>
            </div>

            {/* Account Binding Card */}
            {currentUser?.email || currentUser?.phone ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-600">Active Account:</span>
                  <span className="font-bold text-slate-900">
                    {currentUser.email || currentUser.phone}
                  </span>
                </div>
                <span className="text-[10px] text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded-full">
                  Pass Synced
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900">
                    Your Email or Mobile Number
                  </label>
                  <span className="text-[10px] text-blue-600 font-medium">To link pass across devices</span>
                </div>
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. you@example.com or 10-digit mobile"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
                <p className="text-[11px] text-slate-500">
                  Your pass will be permanently bound to this account in our database so you can log in on any device.
                </p>
              </div>
            )}

            {/* Platonic Agreement Checkbox */}
            <label className="flex items-start gap-2.5 pt-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedPlatonic}
                onChange={(e) => setAgreedPlatonic(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="leading-tight">
                I agree to meet in a public place and keep it strictly platonic. I understand this is enforced strictly.
              </span>
            </label>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                disabled={isProcessing || !agreedPlatonic}
                onClick={() => handlePurchase(currentOption.tier, currentOption.price)}
                className="w-full rounded-xl bg-[#101828] py-3.5 text-center text-sm font-bold text-white transition hover:bg-black disabled:opacity-50 shadow-md active:scale-[0.99]"
              >
                {isProcessing
                  ? "Processing Payment..."
                  : `Unlock all profiles · ₹${currentOption.price.toFixed(2)}`}
              </button>

              <div className="mt-2 text-center text-[11px] text-slate-500">
                Step 1: Email code · Step 2: Pay by UPI
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <Lock className="h-3 w-3" />
                <span>Secured by Razorpay</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
