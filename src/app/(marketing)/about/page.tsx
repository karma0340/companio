import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Compass, ArrowRight, Lock, CheckCircle2, Users } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <div className="border-brutal shadow-brutal bg-sunny p-8 sm:p-12 text-center">
            <span className="inline-block border-2 border-ink bg-white px-3 py-1 text-xs font-black uppercase tracking-wider mb-4">
              Our Mission
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-ink tracking-tight">
              Never Go Alone.
              <br />
              Find a Buddy, Not a Date.
            </h1>
            <p className="mt-4 text-sm sm:text-base font-bold text-ink/80 max-w-2xl mx-auto leading-relaxed">
              Meetzy Club is India&apos;s verified on-demand platonic companionship marketplace. We connect urban adults for respectful, safe, in-person social activities across major metropolitan cities.
            </p>
          </div>

          {/* Core Values Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-brutal shadow-brutal bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-lime mb-4">
                <ShieldCheck className="h-6 w-6 text-ink" />
              </div>
              <h3 className="text-lg font-black uppercase text-ink">100% Platonic</h3>
              <p className="mt-2 text-xs font-bold text-ink/70 leading-relaxed">
                Zero tolerance for solicitation, romance, or dating. Meetzy Club is exclusively for genuine social company: coffee, gym, concerts, and exploring the city.
              </p>
            </div>

            <div className="border-brutal shadow-brutal bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-pink/40 mb-4">
                <Lock className="h-6 w-6 text-ink" />
              </div>
              <h3 className="text-lg font-black uppercase text-ink">Public Venues Only</h3>
              <p className="mt-2 text-xs font-bold text-ink/70 leading-relaxed">
                All meetups must take place in verified public spaces such as cafes, museums, shopping malls, and parks. Private residences are strictly prohibited.
              </p>
            </div>

            <div className="border-brutal shadow-brutal bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-lavender mb-4">
                <Users className="h-6 w-6 text-ink" />
              </div>
              <h3 className="text-lg font-black uppercase text-ink">Aadhaar Verified</h3>
              <p className="mt-2 text-xs font-bold text-ink/70 leading-relaxed">
                Every companion host undergoes government ID verification, selfie liveliness checks, and phone number validation before their profile is published.
              </p>
            </div>
          </div>

          {/* Story & Background */}
          <div className="border-brutal shadow-brutal bg-white p-8 sm:p-10 space-y-6">
            <h2 className="text-2xl font-black uppercase text-ink tracking-tight">
              Why We Built Meetzy Club
            </h2>
            <div className="space-y-4 text-xs sm:text-sm font-medium text-ink/80 leading-relaxed">
              <p>
                In fast-growing metropolitan cities across India - Bengaluru, Delhi NCR, Mumbai, Hyderabad - millions of ambitious students and professionals move away from home. While our careers grow, our casual social circles often shrink.
              </p>
              <p>
                Existing apps push users into romantic dates or sterile networking groups. Meetzy Club bridges the gap: safe, on-demand, reliable companionship for ordinary everyday activities. Whether you need a gym spotter, a shopping opinion, a partner for a newly opened art exhibition, or just friendly conversation over a cup of specialty coffee, you never have to go alone.
              </p>
            </div>

            <div className="pt-6 border-t-2 border-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-ink">Corporate Entity</p>
                <p className="text-xs font-bold text-ink/60">TRYCOMPANIOLABS LLP · New Delhi, India</p>
              </div>
              <Link
                href="/explore"
                className="border-2 border-ink bg-ink px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press inline-flex items-center gap-2"
              >
                <span>Explore Companions</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
