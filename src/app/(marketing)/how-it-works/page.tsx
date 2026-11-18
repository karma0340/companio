import Link from "next/link";
import React from "react";
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, Sparkles } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Choose Your City & Activity",
      desc: "Select where you are and what you want to do: grab specialty coffee, explore an art museum, catch a standup comedy gig, or take a scenic city walk.",
    },
    {
      num: "02",
      title: "Select Your Verified Companion",
      desc: "Browse through vetted, articulate companion profiles. View their spoken languages, favorite cafes, and past ratings. Every companion is 100% Aadhaar/PAN verified.",
    },
    {
      num: "03",
      title: "Secure Escrow Booking",
      desc: "Choose a neutral public venue and book your time slot. Your booking fee (₹706/hr) is placed into a secure escrow wallet. The companion has 12 hours to accept.",
    },
    {
      num: "04",
      title: "Meet in Public & 4-Digit PIN Handshake",
      desc: "Arrive at the public cafe. Your phone displays a private 4-digit code. Share this code with the companion to start the official countdown timer. Strictly platonic.",
    },
    {
      num: "05",
      title: "Session Wrap & Automated Payout",
      desc: "When time completes, both users rate each other. Escrow is released, and Cashfree transfers the companion's 70.7% earnings (₹499.00) directly via UPI.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Simple, Safe & Transparent Onboarding</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          How Companio Works
        </h1>
        <p className="mt-3 text-sm text-[#8E8E93] max-w-xl mx-auto sm:text-base">
          From finding a companion to meeting at an artisan roastery, here is the complete 5-step process.
        </p>
      </div>

      {/* 5-Step Cards */}
      <div className="mt-16 space-y-6">
        {steps.map((s, idx) => (
          <div
            key={s.num}
            className="flex flex-col gap-6 rounded-2xl border border-[#262626] bg-[#121212] p-8 md:flex-row md:items-center justify-between"
          >
            <div className="flex items-start gap-6">
              <span className="font-serif text-4xl font-extrabold text-[#D4AF37] md:text-5xl">
                {s.num}
              </span>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#A1A1A6] sm:text-sm max-w-xl">
                  {s.desc}
                </p>
              </div>
            </div>
            <div className="hidden md:block text-[#262626]">
              {idx < steps.length - 1 && <ArrowRight className="h-6 w-6 text-[#444]" />}
            </div>
          </div>
        ))}
      </div>

      {/* Escrow & Trust Callout */}
      <div className="mt-16 rounded-2xl border border-[#D4AF37]/40 bg-[#141414] p-8 text-center sm:text-left sm:flex items-center justify-between gap-8">
        <div>
          <h3 className="font-serif text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Lock className="h-5 w-5 text-[#D4AF37]" />
            <span>100% Escrow Financial Protection</span>
          </h3>
          <p className="mt-2 text-xs text-[#8E8E93] sm:text-sm max-w-xl">
            Companions never get paid until you meet in person and share your 4-digit code. If a companion fails to accept within 12 hours or cancels, 100% of your funds return to your wallet immediately.
          </p>
        </div>
        <Link
          href="/explore"
          className="mt-6 sm:mt-0 inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-8 py-3 text-xs font-bold text-black hover:bg-[#E5C158] transition whitespace-nowrap"
        >
          <span>Find a companion</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
