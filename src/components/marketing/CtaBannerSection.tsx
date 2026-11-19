"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function CtaBannerSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative py-24 md:py-36 overflow-hidden text-center text-white"
      style={{
        backgroundColor: "#2B2160",
        backgroundImage:
          "radial-gradient(55% 80% at 18% 8%, rgba(122,79,224,0.55), transparent 60%), radial-gradient(50% 75% at 92% 95%, rgba(255,178,62,0.40), transparent 60%), linear-gradient(120deg, #2E6BFF 0%, #7A4FE0 55%, #FFB23E 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
          Ready to connect?
        </span>

        <h2
          id="cta-heading"
          className="mt-3 font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]"
        >
          Your next great experience is one booking away.
        </h2>

        <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
          Explore your city, stay active, and make memories with warm local company.
          Every meetup is under a strictly platonic rule.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/explore"
            className="rounded-full bg-white px-8 py-3.5 text-xs sm:text-sm font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            Find a companion
          </Link>
          <Link
            href="/become-a-companion"
            className="rounded-full bg-white/15 border border-white/30 px-8 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/25 transition active:scale-95 backdrop-blur-sm"
          >
            Become a companion
          </Link>
        </div>

        {/* Trust Badges Row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/85">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <span>Reviewed profiles</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <span>Secure payments</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <span>No auto-renewal</span>
          </span>
        </div>
      </div>
    </section>
  );
}
