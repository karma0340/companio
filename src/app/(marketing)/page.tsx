"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Coffee,
  MapPin,
  Dumbbell,
  Ticket,
  Palette,
  ShieldCheck,
  Clock,
  Users,
  Compass,
  MessageCircle,
  HeartHandshake,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activities = [
    { name: "City walk", icon: MapPin, href: "/explore?activity=city-walk" },
    { name: "Café & conversation", icon: Coffee, href: "/explore?activity=coffee" },
    { name: "Gym & running", icon: Dumbbell, href: "/explore?activity=gym" },
    { name: "Gigs & events", icon: Ticket, href: "/explore?activity=events" },
    { name: "Gossip & chai", icon: MessageCircle, href: "/explore?activity=chai" },
    { name: "Weekend escape", icon: Compass, href: "/explore?activity=travel" },
    { name: "Elder company", icon: HeartHandshake, href: "/explore?activity=elder" },
    { name: "City help", icon: Palette, href: "/explore?activity=guide" },
  ];

  const momentTiles = [
    { src: "/assets/moments/m02.webp", title: "Morning Run", city: "Lodhi Gardens, Delhi" },
    { src: "/assets/moments/m06.webp", title: "Cafe Chats", city: "Blue Tokai, Khan Market" },
    { src: "/assets/moments/m11.webp", title: "Art Walk", city: "Kala Ghoda, Mumbai" },
    { src: "/assets/moments/m05.webp", title: "Live Concert", city: "Indiranagar, Bengaluru" },
    { src: "/assets/moments/m15.webp", title: "Weekend Flea", city: "Anjuna, Goa" },
    { src: "/assets/moments/m23.webp", title: "Sunset Stroll", city: "Marine Drive, Mumbai" },
    { src: "/assets/moments/m09.webp", title: "Chai & Work", city: "CyberHub, Gurugram" },
    { src: "/assets/moments/m13.webp", title: "Heritage Walk", city: "Hawa Mahal, Jaipur" },
  ];

  const scenarioTimeline = [
    {
      time: "07:00 AM",
      title: "Dawn Cardio & Park Walk",
      venue: "Lodhi Gardens, New Delhi",
      desc: "Spotting, motivation, and fresh morning conversation across the gardens without going solo.",
      tag: "Fitness & Morning",
    },
    {
      time: "01:30 PM",
      title: "Midday Coffee & Remote Work",
      venue: "Blue Tokai Coffee Roasters",
      desc: "A focused work sprint or genuine life banter over a flat white in a vibrant neutral cafe.",
      tag: "Cafe & Casual",
    },
    {
      time: "06:00 PM",
      title: "Art Gallery & Walking Tour",
      venue: "National Gallery of Modern Art",
      desc: "Exploring exhibits, contemporary installations, and local culture with someone who shares your taste.",
      tag: "Culture & Art",
    },
    {
      time: "09:00 PM",
      title: "Live Standup & Gig Plus-One",
      venue: "The Habitat / Comedy Club",
      desc: "First-day-first-show or live standup gig with a friendly, verified companion. Zero dating pressure.",
      tag: "Entertainment",
    },
  ];

  const faqs = [
    {
      q: "What exactly is Companio?",
      a: "Companio is an ID-verified social companionship network operating across 126+ Indian cities. It allows urban residents, corporate transplants, and solo individuals to book verified companions for public activities like coffee, museum visits, gym workouts, and cultural walks. It is strictly platonic and 100% non-dating.",
    },
    {
      q: "How does the Access Pass work?",
      a: "To maintain community safety, eliminate non-serious inquiries, and guarantee privacy, Companio operates on an upfront Access Pass model (1-Month Pass at INR 99.50). Once unlocked, you can view uncensored companion bios, direct ratings, and book meetups.",
    },
    {
      q: "How do we ensure safety and platonic integrity?",
      a: "Every single companion undergoes sovereign Aadhaar and PAN verification along with a live facial liveness check. All meetups are strictly restricted to high-traffic commercial venues. Bookings include a persistent in-app SOS button connected to National Emergency 112 and real-time location sharing.",
    },
    {
      q: "How does the 4-digit completion code work?",
      a: "When you book a companion, your funds are safely held in escrow. You are given a private 4-digit handshake code. You only hand this code to your companion when you meet in person. Entering this code confirms physical arrival and starts the 60-minute session clock.",
    },
    {
      q: "Can I earn money as a companion?",
      a: "Yes. Articulate, reliable individuals over the age of 18 can apply to monetize their social presence. Companions set their own hourly rates (typically INR 499 to INR 999/hr) and retain up to 85% of each booking fee, with instant automated UPI payouts upon session completion.",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] text-white selection:bg-[#D4AF37] selection:text-black">
      {/* HERO SECTION */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pt-24 pb-16 text-center">
        {/* Safety Proof Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2B2B2B] bg-[#141414] px-4 py-1.5 text-xs font-semibold text-[#D4AF37] shadow-md">
          <ShieldCheck className="h-4 w-4" />
          <span>Sovereign Aadhaar & PAN Reviewed • Strictly Platonic Only</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-6 sm:mt-8 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1]">
          Never go <span className="text-[#D4AF37] italic">alone.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-[#A1A1AA] leading-relaxed">
          Meet local companions for coffee, walks, gyms and gigs in public places. Every profile is reviewed before it goes live. Strictly platonic.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/explore"
            className="w-full sm:w-auto text-center rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition hover:bg-[#E5E5E7] shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            Find a companion
          </Link>
          <Link
            href="/how-it-works"
            className="w-full sm:w-auto text-center rounded-full border border-[#333] bg-[#141414] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#202020]"
          >
            How it works
          </Link>
          <Link
            href="/app"
            className="w-full sm:w-auto text-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-6 py-3.5 text-sm font-bold text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
          >
            Open PWA App →
          </Link>
        </div>

        {/* Live Database Counter */}
        <div className="mt-10 sm:mt-14 grid grid-cols-3 gap-2 sm:gap-6 border-y border-[#262626] py-6 sm:py-8 w-full max-w-3xl">
          <div className="text-center">
            <div className="font-serif text-xl sm:text-3xl font-extrabold text-white">1.2 Lakh+</div>
            <div className="mt-1 text-[10px] sm:text-xs text-[#8E8E93] uppercase tracking-wider">Signed Up Members</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-xl sm:text-3xl font-extrabold text-[#D4AF37]">126 Cities</div>
            <div className="mt-1 text-[10px] sm:text-xs text-[#8E8E93] uppercase tracking-wider">Live & Operating</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-xl sm:text-3xl font-extrabold text-white">100%</div>
            <div className="mt-1 text-[10px] sm:text-xs text-[#8E8E93] uppercase tracking-wider">Escrow Protected</div>
          </div>
        </div>
      </section>

      {/* MOMENT TILES CAROUSEL (220px x 293px Aspect Ratio 3:4) */}
      <section className="py-12 border-t border-[#1F1F1F] bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-white">
                Life is richer with someone.
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8E93] pt-1">
                Real city moments shared between verified members and companions.
              </p>
            </div>
            <Link
              href="/explore"
              className="text-xs font-bold text-[#D4AF37] hover:underline"
            >
              View directory →
            </Link>
          </div>

          {/* Horizontal Scroll Grid with Touch Snap */}
          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 snap-x snap-mandatory">
            {momentTiles.map((tile, i) => (
              <div
                key={i}
                className="relative flex-none w-[180px] h-[240px] sm:w-[220px] sm:h-[293px] rounded-2xl overflow-hidden border border-[#2B2B2B] group hover:border-[#D4AF37] transition-all snap-start"
              >
                <Image
                  src={tile.src}
                  alt={tile.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {tile.city}
                  </span>
                  <span className="text-sm font-bold text-white block">
                    {tile.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITY SELECTOR */}
      <section className="border-t border-[#262626] bg-[#0A0A0A] py-16">
        <div className="mx-auto max-w-6xl px-6 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Everyday Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Companion for everything.
          </h2>
          <p className="max-w-xl mx-auto text-sm text-[#A1A1AA]">
            Ordinary things are better with good company. Select what you feel like doing today.
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-3">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <Link
                  key={act.name}
                  href={act.href}
                  className="flex items-center gap-2 rounded-full border border-[#2B2B2B] bg-[#141414] px-5 py-2.5 text-xs font-semibold text-[#E5E5E7] transition hover:border-[#D4AF37] hover:text-white"
                >
                  <Icon className="h-4 w-4 text-[#D4AF37]" />
                  <span>{act.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 24-HOUR SCENARIO TIMELINE: FROM SUNRISE WALK TO EVENING SHOW */}
      <section className="border-t border-[#1F1F1F] bg-[#0E0E0E] py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Scenario Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              From sunrise walk to evening show.
            </h2>
            <p className="text-sm text-[#8E8E93]">
              A continuous timeline of safe, enriching company available at any hour of the day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scenarioTimeline.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#262626] bg-[#141414] p-6 space-y-4 hover:border-[#D4AF37]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs font-bold border border-[#D4AF37]/30">
                    {item.time}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {item.title}
                </h3>
                <div className="text-xs text-[#D4AF37] font-medium">
                  {item.venue}
                </div>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS SAFETY SPECIFICATION */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-[#1F1F1F]">
        <div className="text-center max-w-2xl mx-auto space-y-2 pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Trust & Protection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            How we keep meetups safe.
          </h2>
          <p className="text-sm text-[#8E8E93]">
            Four core commitments, true from day one.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-[#262626] bg-[#121212] p-8 space-y-3">
            <ShieldCheck className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="font-serif text-xl font-bold text-white">Sovereign ID Verified</h3>
            <p className="text-xs leading-relaxed text-[#8E8E93]">
              Every companion and member completes government Aadhaar/PAN verification and live facial scan before booking approval.
            </p>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#121212] p-8 space-y-3">
            <Clock className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="font-serif text-xl font-bold text-white">Razorpay Escrow Protection</h3>
            <p className="text-xs leading-relaxed text-[#8E8E93]">
              Your payment is safely held in escrow until the meeting occurs and the in-person 4-digit PIN is verified.
            </p>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#121212] p-8 space-y-3">
            <Users className="h-8 w-8 text-[#D4AF37]" />
            <h3 className="font-serif text-xl font-bold text-white">Strictly Platonic Neutral Venues</h3>
            <p className="text-xs leading-relaxed text-[#8E8E93]">
              Zero romantic ambiguity. Public neutral commercial venues only: Blue Tokai, Starbucks, museums, and galleries.
            </p>
          </div>
        </div>
      </section>

      {/* COMMON QUESTIONS (FAQ) */}
      <section className="py-20 border-t border-[#1F1F1F] bg-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Common questions
            </h2>
            <p className="text-sm text-[#8E8E93]">
              Everything you need to know about the Companio experience.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#262626] bg-[#141414] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-base font-semibold text-white"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#D4AF37] font-mono">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-[#A1A1AA] leading-relaxed border-t border-[#222] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONVERSION ANCHOR */}
      <section className="py-20 border-t border-[#1F1F1F] bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-center px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Your next great experience is one booking away.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Join over 1.2 Lakh verified members across India enjoying safe, authentic companionship.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/explore"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition hover:bg-[#E5E5E7] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Explore Companions
            </Link>
            <Link
              href="/app"
              className="rounded-full border border-[#D4AF37] bg-[#141414] px-8 py-3.5 text-sm font-bold text-[#D4AF37] transition hover:bg-[#202020]"
            >
              Open PWA App
            </Link>
          </div>
        </div>
      </section>

      {/* PERSISTENT BOTTOM SAFETY BANNER */}
      <div className="hidden sm:flex fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-md border-t border-[#262626] py-2.5 px-4 text-center text-xs text-neutral-300 items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>In-app SOS & location sharing to share any meetup with someone you trust, free.</span>
        <Link href="/safety" className="text-[#D4AF37] font-bold underline ml-1">
          Learn more
        </Link>
      </div>
    </div>
  );
}
