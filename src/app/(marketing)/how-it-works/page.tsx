import Link from "next/link";
import React from "react";
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, MessageCircle, MapPin, Star } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Browse companions",
      desc: "Filter by activity and city. Every profile is reviewed before it goes live. The ID-checked badge means our team has checked that person’s government ID.",
      icon: MapPin,
    },
    {
      num: "02",
      title: "Unlock full profiles",
      desc: "The pass unlocks full profiles in every open city, and chat opens once a companion accepts your booking. Each meetup is paid separately at the companion's hourly rate, shown before you pay. Nothing renews, nothing auto-debits.",
      icon: Lock,
    },
    {
      num: "03",
      title: "Request a meetup",
      desc: "Pick the activity, a time and a public spot. When your companion accepts, chat opens so you can coordinate details.",
      icon: MessageCircle,
    },
    {
      num: "04",
      title: "Meet in a public place",
      desc: "Share your 4-digit meetup code with your companion when you meet. SOS stays on screen the whole time: tap it, then WhatsApp or SMS, to send your location to someone you trust.",
      icon: ShieldCheck,
    },
    {
      num: "05",
      title: "Rate it, meet again",
      desc: "Leave an authentic review, bookmark your favorite companion, or plan your next city activity together.",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFCFF] py-16 text-slate-900">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>How Companio works</span>
          </div>

          <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            How Companio works, in five steps.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            From the first browse to the second meetup. Strictly platonic, always in public.
          </p>
        </div>

        {/* 5-Step Cards */}
        <div className="mt-14 space-y-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md flex flex-col sm:flex-row sm:items-start gap-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-mono font-bold text-lg">
                  {s.num}
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-black transition active:scale-95"
          >
            <span>Explore companions near you</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
