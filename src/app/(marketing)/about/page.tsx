import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Compass, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-[#A1A1A6] leading-relaxed">
      {/* Title */}
      <div className="border-b border-[#262626] pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
          <HeartHandshake className="h-3.5 w-3.5" />
          <span>Our Founding Thesis</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          The Companio Vision
        </h1>
        <p className="mt-3 text-sm text-[#8E8E93] max-w-xl mx-auto sm:text-base">
          Why we built an on-demand, platonic social companionship platform for modern urban India.
        </p>
      </div>

      <div className="mt-12 space-y-10 text-sm">
        <section>
          <h2 className="font-serif text-2xl font-bold text-white mb-3">Two Realities of Urban India</h2>
          <p>
            When we examined the social landscape in Indian metropolitan hubs like Bengaluru, Mumbai, and Delhi-NCR, we saw two glaring truths: profound, genuine loneliness affecting over 600 million domestic migrants, and a dating app industry built on superficial algorithms, ghosting, and emotional burnout.
          </p>
          <p className="mt-3">
            Young corporate professionals, researchers, and students move thousands of kilometers away from home. They have money, curiosity, and a desire to explore city cafes, art museums, and comedy gigs—but no trusted friends free to join them.
          </p>
        </section>

        <section className="rounded-2xl border border-[#262626] bg-[#121212] p-8">
          <h3 className="font-serif text-xl font-bold text-white mb-2">Our Core Solution: Transactional Certainty</h3>
          <p className="text-xs sm:text-sm text-[#8E8E93]">
            Companio was designed to strip away the awkwardness and emotional games of modern dating. We replace romantic ambiguity with a transparent commercial agreement: you hire another person&apos;s time for friendly, engaging conversation in a verified public cafe. No romantic expectations, no rejection, no games.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-white mb-3">The 70 / 30 Fair Economic Split</h2>
          <p>
            We believe people who invest their social energy, cultural empathy, and listening skills deserve high, dignified compensation. That is why <strong>70.7% of every booking fee goes directly into the companion host&apos;s bank account via instant UPI</strong>. Companio retains a 29.3% platform markup to fund insurance, 100% sovereign Aadhaar/PAN ID checks, payment gateway infrastructure, and 24/7 safety monitoring.
          </p>
        </section>

        <section className="rounded-2xl border border-[#D4AF37]/30 bg-[#161616] p-8 text-center sm:text-left sm:flex items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Experience it yourself</h3>
            <p className="mt-1 text-xs text-[#8E8E93]">
              Browse verified companions in your city or apply to become a host today.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3 shrink-0">
            <Link
              href="/explore"
              className="rounded-full bg-[#D4AF37] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5C158] transition"
            >
              Find a companion
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
