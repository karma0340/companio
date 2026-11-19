"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowRight, Lock, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { openRazorpayCheckout } from "@/lib/payments/razorpay";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";

export default function MembershipPage() {
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const [activePass, setActivePass] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/passes/active")
      .then((res) => res.json())
      .then((data) => {
        if (data.isUnlocked) {
          setIsUnlocked(true);
          setActivePass(data.activePass);
        }
      })
      .catch(() => {});
  }, []);

  const tiers = [
    {
      id: "ONE_MONTH",
      name: "1 Month Pass",
      price: 99.5,
      durationDays: 30,
      badge: "Flexible",
      badgeColor: "bg-paper",
      tagline: "30 days full unblurred access",
      features: [
        "Unblur all companion host profiles",
        "View verified ratings & reviews",
        "Send unlimited booking requests",
        "Active for 30 calendar days",
      ],
    },
    {
      id: "THREE_MONTH",
      name: "3 Month Pass",
      price: 249.5,
      durationDays: 90,
      badge: "Most Popular",
      badgeColor: "bg-sunny",
      tagline: "Save 16% · INR 83 / month",
      isPopular: true,
      features: [
        "All 1-month features included",
        "Save 16% vs monthly subscription",
        "Priority companion response window",
        "Instant SMS notifications on request accept",
        "Active for 90 calendar days",
      ],
    },
    {
      id: "ONE_YEAR",
      name: "12 Month Pass",
      price: 499.5,
      durationDays: 365,
      badge: "Best Value",
      badgeColor: "bg-lime",
      tagline: "Best long-term · INR 41 / month",
      features: [
        "All 3-month features included",
        "Unlimited profile views across all Indian cities",
        "Early access to newly onboarded companions",
        "VIP safety desk dedicated routing",
        "Active for 365 calendar days",
      ],
    },
    {
      id: "LIFETIME",
      name: "Lifetime Pass",
      price: 999.5,
      durationDays: null,
      badge: "Founding Member",
      badgeColor: "bg-pink/40",
      tagline: "Pay once · Access forever",
      features: [
        "Permanent unrestricted access",
        "Founding Member badge on public profile",
        "Direct concierge meetup booking assistance",
        "Never renews · Zero recurring charges",
      ],
    },
  ];

  const handleSubscribe = async (tierId: string) => {
    if (!isAuthenticated) {
      toast.warning("Please sign in with your phone or email to activate a pass.", "Sign In Required");
      window.location.href = `/login?redirect=/membership`;
      return;
    }

    setLoadingTier(tierId);

    try {
      // 1. Create Razorpay order via backend
      const res = await fetch("/api/passes/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create subscription order");
      }

      // 2. Launch Razorpay Escrow Modal
      const checkoutSuccess = await openRazorpayCheckout({
        key: data.keyId,
        amount: Math.round(data.amount * 100),
        currency: "INR",
        name: "Companio Pass",
        description: `${data.tierName} Access Pass`,
        order_id: data.orderId,
        prefill: {
          name: user?.name || "Member",
          contact: user?.phone || "",
          email: user?.email || "",
        },
        theme: {
          color: "#0D0D11",
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/passes/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                tier: tierId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Pass Activated! All companion profiles are now unblurred.", "Success");
              setIsUnlocked(true);
              setActivePass(verifyData.pass);
            } else {
              toast.error(verifyData.error || "Payment verification failed.", "Error");
            }
          } catch (err) {
            toast.error("Failed to verify subscription payment.", "Error");
          }
        },
      });

      if (!checkoutSuccess) {
        toast.error("Could not load payment checkout. Please check your internet connection.", "Checkout Error");
      }
    } catch (err) {
      toast.error((err as Error).message || "Subscription initialization failed.", "Error");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Header */}
          <div className="border-brutal shadow-brutal bg-sunny p-8 sm:p-12 text-center">
            <span className="inline-block border-2 border-ink bg-white px-3 py-1 text-xs font-black uppercase tracking-wider mb-4">
              Transparent Membership
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-ink tracking-tight">
              Unlock Verified Companions Across India
            </h1>
            <p className="mt-3 text-xs sm:text-sm font-bold text-ink/80 max-w-xl mx-auto">
              Zero commission on companion meetups. A simple access pass keeps our community spam-free, verified, and strictly platonic.
            </p>

            {isUnlocked && (
              <div className="mt-6 inline-flex items-center gap-2 border-2 border-ink bg-lime px-4 py-2 text-xs font-black uppercase shadow-brutal">
                <CheckCircle2 className="h-4 w-4" />
                <span>Active Pass: {activePass?.name || "Unlocked"} · Profiles Unblurred</span>
              </div>
            )}
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => {
              const isLoading = loadingTier === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`border-brutal shadow-brutal flex flex-col justify-between p-6 ${
                    tier.isPopular ? "bg-white border-4 border-ink" : "bg-white"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`border-2 border-ink ${tier.badgeColor} px-2.5 py-0.5 text-[10px] font-black uppercase`}>
                        {tier.badge}
                      </span>
                      {tier.durationDays ? (
                        <span className="text-[11px] font-bold text-ink/60">{tier.durationDays} Days</span>
                      ) : (
                        <span className="text-[11px] font-black text-ink">Lifetime</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-black uppercase text-ink">{tier.name}</h3>
                      <p className="text-xs font-bold text-ink/70 mt-0.5">{tier.tagline}</p>
                    </div>

                    <div className="border-y-2 border-ink py-3">
                      <span className="text-3xl font-black text-ink">INR {tier.price.toFixed(2)}</span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2.5 text-xs font-bold text-ink/80">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t-2 border-ink">
                    <button
                      type="button"
                      disabled={isLoading || isUnlocked}
                      onClick={() => handleSubscribe(tier.id)}
                      className={`w-full border-2 border-ink py-3 text-xs font-black uppercase tracking-wider shadow-brutal btn-press disabled:opacity-50 flex items-center justify-center gap-1.5 ${
                        tier.isPopular ? "bg-lime text-ink" : "bg-ink text-white"
                      }`}
                    >
                      <span>
                        {isUnlocked
                          ? "Pass Already Active"
                          : isLoading
                          ? "Connecting Razorpay..."
                          : `Get ${tier.name}`}
                      </span>
                      {!isUnlocked && !isLoading && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Banner */}
          <div className="border-brutal shadow-brutal bg-white p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-sunny shrink-0">
                <ShieldCheck className="h-6 w-6 text-ink" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-ink">Aadhaar Verified Hosts</h4>
                <p className="text-[11px] font-bold text-ink/70">100% ID checks on all companion profiles</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-lime shrink-0">
                <Lock className="h-6 w-6 text-ink" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-ink">Escrow Payment Protection</h4>
                <p className="text-[11px] font-bold text-ink/70">Funds released only after in-person handshake</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-lavender shrink-0">
                <Clock className="h-6 w-6 text-ink" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-ink">Instant Cancellation Refund</h4>
                <p className="text-[11px] font-bold text-ink/70">100% full refund if companion declines</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
