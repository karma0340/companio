"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  PhoneCall,
  Heart,
  Flag,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const SAFETY_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Reviewed before going live",
    description:
      "Every profile is reviewed before it goes live. The ID-checked badge means our team has verified that person's government ID (Aadhaar or PAN).",
  },
  {
    icon: CreditCard,
    title: "No auto-renewal or auto-debit",
    description:
      "A pass is bought once. Nothing renews, nothing auto-debits, and we never store recurring mandates against your card or UPI.",
  },
  {
    icon: PhoneCall,
    title: "SOS & location sharing",
    description:
      "Every active booking includes an in-app SOS. In two taps, your live location and meetup details are sent to a trusted contact.",
  },
  {
    icon: Heart,
    title: "Strictly platonic promise",
    description:
      "Public venues only. Cafés, parks, art galleries, and public events. Zero tolerance for private invitations or inappropriate conduct.",
  },
  {
    icon: Flag,
    title: "Report anytime",
    description:
      "Our safety moderation team is active 24/7. Immediate review, instant unmatch, and permanent platform ban for any violation.",
  },
];

export function SafetySection() {
  return (
    <section
      aria-labelledby="safety-heading"
      className="relative pt-20 pb-20 md:py-32 overflow-hidden text-white"
      style={{
        background: "linear-gradient(140deg, #14122a 0%, #1e1840 60%, #120e28 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow & Title */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Trust & safety
          </span>
          <h2
            id="safety-heading"
            className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.08]"
          >
            How we keep meetups safe
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
            Safety is built into every step: profiles reviewed before they go live, payments
            through Razorpay escrow, and SOS in your booking, which sends your location to someone
            you trust in two taps.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Strictly platonic. Zero tolerance for violations.</span>
          </div>
        </div>

        {/* Safety Cards Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAFETY_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{pillar.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Learn More Link */}
        <div className="mt-12">
          <Link
            href="/safety"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-300 hover:text-white transition"
          >
            <span>Read full trust, safety & escrow guidelines</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
