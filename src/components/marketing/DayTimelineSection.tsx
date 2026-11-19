"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DayChapter {
  id: string;
  step: string;
  timeSlot: string;
  activityTitle: string;
  activitySlug: string;
  tagline: string;
  tags: string[];
  image: string;
}

const CHAPTERS: DayChapter[] = [
  {
    id: "ch_01",
    step: "01",
    timeSlot: "Dawn",
    activityTitle: "City Walk",
    activitySlug: "City%20Walk",
    tagline: "Start the day with a walk and someone who actually knows the lanes.",
    tags: ["Marine Drive loop", "Cutting chai", "Old-city lanes"],
    image: "/assets/landing/chapters/city-walk-v2.webp",
  },
  {
    id: "ch_02",
    step: "02",
    timeSlot: "Morning",
    activityTitle: "Gym Buddy",
    activitySlug: "Gym%20Buddy",
    tagline: "Someone who actually shows up. Every time.",
    tags: ["A spotter", "5k runs", "Post-workout smoothie"],
    image: "/assets/landing/chapters/gym-buddy-v2.webp",
  },
  {
    id: "ch_03",
    step: "03",
    timeSlot: "Midday",
    activityTitle: "Café Chat",
    activitySlug: "Caf%C3%A9%20Chat",
    tagline: "Two cups of chai, one long conversation. No small talk.",
    tags: ["Roastery corners", "Book banter", "Coffee walks"],
    image: "/assets/landing/chapters/cafe-chat-v2.webp",
  },
  {
    id: "ch_04",
    step: "04",
    timeSlot: "Evening",
    activityTitle: "Events",
    activitySlug: "Live%20Events",
    tagline: "Gigs, standup, theatre. Never go solo.",
    tags: ["Comedy clubs", "Live gigs", "Night markets"],
    image: "/assets/landing/chapters/events-v2.webp",
  },
  {
    id: "ch_05",
    step: "05",
    timeSlot: "Anytime",
    activityTitle: "Elder Company",
    activitySlug: "Elder%20company",
    tagline: "Warm, attentive accompaniment for strolls, errands, or quiet conversation.",
    tags: ["Park walks", "Quiet chat", "Accompaniment"],
    image: "/assets/landing/chapters/elder-company-v2.webp",
  },
];

export function DayTimelineSection() {
  const [activeChapter, setActiveChapter] = useState<DayChapter>(CHAPTERS[0]);

  return (
    <section
      aria-labelledby="activity-heading"
      className="relative overflow-hidden py-16 md:py-28"
      style={{
        background: "linear-gradient(140deg, #FFF3E0 0%, #FFE0B0 60%, #FFD699 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow & Title */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900/80">
            One day, with Companio
          </span>
          <h2
            id="activity-heading"
            className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.08]"
          >
            From sunrise walk to evening show.
          </h2>
        </div>

        {/* Chapters Navigation Tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CHAPTERS.map((ch) => {
            const isSelected = ch.id === activeChapter.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(ch)}
                className={`flex-none inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "bg-white/80 text-slate-800 hover:bg-white"
                }`}
              >
                <span className="opacity-70 font-mono text-[11px]">{ch.step}</span>
                <span>{ch.timeSlot}</span>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Showcase Card */}
        <div className="mt-8 overflow-hidden rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-sm border border-amber-200/60 shadow-lg grid md:grid-cols-12 items-stretch">
          {/* Content */}
          <div className="p-8 sm:p-12 md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <span>{activeChapter.step}</span>
                <span>·</span>
                <span>{activeChapter.timeSlot}</span>
              </div>

              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                {activeChapter.activityTitle}
              </h3>

              <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed">
                {activeChapter.tagline}
              </p>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {activeChapter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1 text-xs font-medium text-amber-900"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                href={`/explore?activity=${activeChapter.activitySlug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-black transition active:scale-95 shadow-md"
              >
                <span>Find a companion for {activeChapter.activityTitle}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Chapter Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:col-span-6 overflow-hidden bg-slate-100 min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeChapter.image}
              alt={activeChapter.activityTitle}
              className="h-full w-full object-cover transition duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
