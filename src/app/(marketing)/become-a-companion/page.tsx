"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Coffee,
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  DollarSign,
  UserCheck,
  PhoneCall,
  Calendar,
  Lock,
} from "lucide-react";

export default function BecomeACompanionPage() {
  const [meetupsPerWeek, setMeetupsPerWeek] = useState<number>(4);
  const [ratePerMeetup, setRatePerMeetup] = useState<number>(999);

  const monthlyEstimatedEarnings = meetupsPerWeek * ratePerMeetup * 4;

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 selection:bg-blue-600 selection:text-white pb-28">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-transparent pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800 mb-6 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Companion Applications Open across Metro Cities</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] max-w-4xl mx-auto">
            Show people your city, and get paid for every meetup you complete.
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Set your own hours. Pick the activities you enjoy. Earn between ₹499 and ₹1,499 per meetup
            with verified members. All coffee, food, and tickets are 100% paid by members.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/become-a-companion/apply"
              className="w-full sm:w-auto h-13 py-3.5 px-8 rounded-full font-bold text-base bg-[#101828] text-white shadow-xl hover:bg-black transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Apply to become a companion</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#earnings"
              className="w-full sm:w-auto h-13 py-3.5 px-7 rounded-full font-bold text-base bg-white border border-slate-200 text-slate-800 shadow-sm hover:bg-slate-50 transition active:scale-95 flex items-center justify-center"
            >
              See earnings calculator
            </a>
          </div>
        </div>
      </section>

      {/* 2. Section: Your Meetups, Your Rules */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Autonomy & Respect
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Your meetups, your rules.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              You are never pressured to accept an invitation. You review every member bio and meetup
              venue before deciding.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Choose who you meet</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Accept or decline bookings with one tap. You only spend time with people whose vibe and activity you look forward to.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Coffee className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Free food, coffee & tickets</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All café bills, movie tickets, gallery admissions, and dining expenses during the meetup are paid entirely by the member.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Neutral public venues only</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Meetups take place exclusively in busy public spaces: high-street cafés, parks, museums, and concerts. Private places are strictly banned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Earnings Calculator */}
      <section id="earnings" className="py-20 bg-[#FBFCFF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Calculator Controls (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Income Potential
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                  What a meetup could pay you
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600">
                  Adjust your weekly hours and meetup rate to see your estimated monthly income.
                </p>
              </div>

              {/* Slider 1: Meetups per week */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Meetups per week:</span>
                  <span className="text-blue-600 text-sm">{meetupsPerWeek} meetups</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={meetupsPerWeek}
                  onChange={(e) => setMeetupsPerWeek(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>1 / week (Casual)</span>
                  <span>6 / week</span>
                  <span>12 / week (Full time)</span>
                </div>
              </div>

              {/* Slider 2: Rate per meetup */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Your rate per meetup:</span>
                  <span className="text-blue-600 text-sm">₹{ratePerMeetup}</span>
                </div>
                <input
                  type="range"
                  min={499}
                  max={1499}
                  step={100}
                  value={ratePerMeetup}
                  onChange={(e) => setRatePerMeetup(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>₹499 (Standard)</span>
                  <span>₹999 (Popular)</span>
                  <span>₹1,499 (Premium)</span>
                </div>
              </div>
            </div>

            {/* Income Display Card (5 cols) */}
            <div className="md:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 text-center space-y-4 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Estimated Monthly Payout
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                ₹{monthlyEstimatedEarnings.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Direct to your UPI or bank account within 24 hours of each verified meetup PIN.
              </p>

              <div className="pt-2">
                <Link
                  href="/become-a-companion/apply"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 py-3 px-6 text-xs sm:text-sm font-bold text-slate-950 transition active:scale-95 shadow-md"
                >
                  <span>Apply with this rate</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Journey from Application to First Booking */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Application Journey
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              From application to first booking
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Our safety review ensures quality companions and peace of mind for everyone.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                1
              </span>
              <h3 className="text-lg font-bold text-slate-900">Submit your profile</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tell us about your city favorites, favorite cafés, walks, and hobbies. Set your meetup hourly rate and availability.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900">Video call & ID check</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A brief 10-minute conversational check and Aadhaar/PAN verification to grant your profile the verified ID-checked trust badge.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                3
              </span>
              <h3 className="text-lg font-bold text-slate-900">Go live & start hosting</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive booking requests from verified members. Meet at neutral public spots, share the 4-digit PIN, and get paid instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA Banner */}
      <section className="mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#101828] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Ready to explore your city and earn?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Applications are reviewed within 48 hours. Start receiving bookings in Mumbai, Delhi NCR, Bengaluru, and Pune.
          </p>
          <div className="pt-2">
            <Link
              href="/become-a-companion/apply"
              className="inline-flex items-center gap-2 rounded-full bg-white text-slate-950 font-bold px-8 py-4 text-sm sm:text-base shadow-xl hover:bg-slate-100 transition active:scale-95"
            >
              <span>Start your companion application</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
