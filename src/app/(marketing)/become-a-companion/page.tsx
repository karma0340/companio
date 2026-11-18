import React from "react";
import { EarningsCalculator } from "@/components/marketing/EarningsCalculator";
import { ShieldCheck, HeartHandshake, Coffee, Sparkles } from "lucide-react";

export default function BecomeACompanionPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
          <HeartHandshake className="h-3.5 w-3.5" />
          <span>Flexible Social Earning Opportunity</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          Monetize Your Social Presence
        </h1>
        <p className="mt-3 text-sm text-[#8E8E93] max-w-xl mx-auto sm:text-base">
          Earn between ₹499 and ₹1,499 per hour for friendly conversation over coffee, museum tours, and city walks. All meals & venue bills paid by members.
        </p>
      </div>

      {/* Host Advantages Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#262626] bg-[#121212] p-6 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#D4AF37] mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <h4 className="font-serif text-base font-bold text-white">Full Schedule Autonomy</h4>
          <p className="mt-1 text-xs text-[#8E8E93]">Accept or decline bookings on your own terms. Set your own available hours.</p>
        </div>

        <div className="rounded-2xl border border-[#262626] bg-[#121212] p-6 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#D4AF37] mb-3">
            <Coffee className="h-5 w-5" />
          </div>
          <h4 className="font-serif text-base font-bold text-white">Free Activities & Cafes</h4>
          <p className="mt-1 text-xs text-[#8E8E93]">All food, specialty coffee, and entry tickets are 100% paid by the booking member.</p>
        </div>

        <div className="rounded-2xl border border-[#262626] bg-[#121212] p-6 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#D4AF37] mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="font-serif text-base font-bold text-white">Strict Platonic Rules</h4>
          <p className="mt-1 text-xs text-[#8E8E93]">Zero tolerance for romantic advances. Neutral public venues only.</p>
        </div>
      </div>

      {/* Interactive Simulator & Form */}
      <div className="mt-16">
        <EarningsCalculator />
      </div>
    </div>
  );
}
