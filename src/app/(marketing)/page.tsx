"use client";

import React from "react";
import Link from "next/link";
import { MomentsSection } from "@/components/marketing/MomentsSection";
import { ActivityPlannerSection } from "@/components/marketing/ActivityPlannerSection";
import { DayTimelineSection } from "@/components/marketing/DayTimelineSection";
import { SafetySection } from "@/components/marketing/SafetySection";
import { CommitmentsSection } from "@/components/marketing/CommitmentsSection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CtaBannerSection } from "@/components/marketing/CtaBannerSection";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#FBFCFF] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* HERO SECTION (Image 2 1:1 Parity) */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Atmospheric Video / Poster Background */}
        <video
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster="/assets/landing/hero-poster-v5.webp"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1, objectPosition: "50% 25%" }}
          aria-hidden="true"
        >
          <source media="(orientation: portrait) and (max-width: 600px)" src="/assets/landing/hero-phone-v5.mp4" type="video/mp4" />
          <source src="/assets/landing/hero-desktop-v4.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Atmospheric Overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            zIndex: 10,
            background: "linear-gradient(180deg, rgba(14, 12, 28, 0.25) 0%, rgba(14, 12, 28, 0.45) 30%, rgba(20, 18, 42, 0.75) 55%, rgba(20, 18, 42, 0.94) 80%, rgba(14, 12, 28, 0.98) 100%)",
          }}
        />

        {/* Hero Content (Image 3 Desktop / Image 5 Mobile Parity) */}
        <div className="relative z-30 max-w-4xl mx-auto px-6 w-full pt-16 pb-16 text-center">
          {/* Two-Line Pure White Headline */}
          <h1
            id="hero-heading"
            className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[0.96] mb-4 md:mb-6"
            style={{ textShadow: "0 2px 24px rgba(0, 0, 0, 0.75), 0 0 40px rgba(10, 8, 24, 0.6)" }}
          >
            <span className="block">Never go</span>
            <span className="block">alone.</span>
          </h1>

          {/* Exact Subtitle Text */}
          <p
            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-8 md:mb-10 max-w-xl mx-auto font-medium"
            style={{ textShadow: "0 1px 12px rgba(0, 0, 0, 0.8)" }}
          >
            <span className="block mb-1.5">Explore your city with a local companion.</span>
            <span className="block mb-1.5">Coffee, walks, and gigs with someone who knows the city.</span>
            <span className="block">Every profile reviewed before it goes live. Strictly platonic.</span>
          </p>

          {/* Action Buttons: Responsive for Mobile (Image 5) and Desktop (Image 3) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm sm:max-w-md mx-auto">
            <Link
              href="/explore"
              className="w-full sm:w-auto h-12 py-3 px-8 rounded-full font-bold text-sm sm:text-base bg-white text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95 flex items-center justify-center text-center"
            >
              Find a companion
            </Link>
            <Link
              href="/how-it-works"
              className="hidden sm:inline-flex items-center justify-center h-12 py-3 px-7 rounded-full font-bold text-sm sm:text-base bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 transition active:scale-95"
            >
              How it works &rarr;
            </Link>
          </div>

          {/* Already a member? Sign in */}
          <div className="mt-4">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition"
            >
              <span>Already a member? Sign in</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 1:1 AUTHENTIC POLAROID MOMENTS PARALLAX SCROLL SECTION */}
      <MomentsSection />

      {/* SECTION 2: COMPANION FOR EVERYTHING */}
      <ActivityPlannerSection />

      {/* SECTION 3: FROM SUNRISE WALK TO EVENING SHOW */}
      <DayTimelineSection />

      {/* SECTION 5: HOW WE KEEP MEETUPS SAFE */}
      <SafetySection />

      {/* SECTION 7: FOUR COMMITMENTS, TRUE FROM DAY ONE */}
      <CommitmentsSection />

      {/* SECTION 8: COMMON QUESTIONS FAQ */}
      <FaqSection />

      {/* SECTION 9: YOUR NEXT GREAT EXPERIENCE IS ONE BOOKING AWAY */}
      <CtaBannerSection />
    </div>
  );
}
