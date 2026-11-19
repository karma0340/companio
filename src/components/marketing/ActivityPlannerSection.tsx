"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Coffee,
  Dumbbell,
  Ticket,
  MessageCircle,
  Compass,
  HeartHandshake,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface ActivityPlan {
  id: string;
  name: string;
  headline: string;
  actionText: string;
  slug: string;
  icon: any;
  image: string;
}

const ACTIVITIES: ActivityPlan[] = [
  {
    id: "act_1",
    name: "City walk",
    headline: "Learn a neighbourhood with someone who loves it.",
    actionText: "See who’s free for a walk",
    slug: "City%20Walk",
    icon: MapPin,
    image: "/assets/landing/moments/m13-lg.webp",
  },
  {
    id: "act_2",
    name: "Café & conversation",
    headline: "Two hours at a sunny table with someone curious, easy, and engaged.",
    actionText: "Find a café companion",
    slug: "Caf%C3%A9%20Chat",
    icon: Coffee,
    image: "/assets/landing/chapters/cafe-chat-v2.webp",
  },
  {
    id: "act_3",
    name: "Gym & running",
    headline: "A partner who spots you, keeps the pace, and makes the hour fly.",
    actionText: "Find a workout buddy",
    slug: "Gym%20Buddy",
    icon: Dumbbell,
    image: "/assets/landing/chapters/gym-buddy-v2.webp",
  },
  {
    id: "act_4",
    name: "Gigs & events",
    headline: "Gigs, plays, standup. Go with a plus-one who loves the room as much as you.",
    actionText: "Find an event plus-one",
    slug: "Live%20Events",
    icon: Ticket,
    image: "/assets/landing/chapters/events-v2.webp",
  },
  {
    id: "act_5",
    name: "Gossip & chai",
    headline: "Unwind over hot cutting chai and effortless evening conversations.",
    actionText: "See who’s up for chai",
    slug: "Bitching%20%26%20gossip",
    icon: MessageCircle,
    image: "/assets/landing/moments/m23.webp",
  },
  {
    id: "act_6",
    name: "Weekend escape",
    headline: "Take on a hill trek or scenic sunrise viewpoint together.",
    actionText: "Plan a weekend trek",
    slug: "Weekend%20trek",
    icon: Compass,
    image: "/assets/landing/moments/m06.webp",
  },
  {
    id: "act_7",
    name: "Elder company",
    headline: "Warm, attentive accompaniment for strolls, errands, or quiet conversation.",
    actionText: "Find elder companion",
    slug: "Elder%20company",
    icon: HeartHandshake,
    image: "/assets/landing/chapters/elder-company-v2.webp",
  },
  {
    id: "act_8",
    name: "City help",
    headline: "New in town? Navigate local markets, metro routes, and culture with ease.",
    actionText: "Find a local guide",
    slug: "City%20help",
    icon: HelpCircle,
    image: "/assets/landing/chapters/city-walk-v2.webp",
  },
];

export function ActivityPlannerSection() {
  const [activePlan, setActivePlan] = useState<ActivityPlan>(ACTIVITIES[0]);

  return (
    <section
      aria-labelledby="plans-heading"
      className="pt-16 md:pt-28 pb-12 md:pb-20 bg-[#FBFCFF]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <h2
            id="plans-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
          >
            Companion for everything.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            What does today need? Pick a plan and see who’s up for it near you.
          </p>
        </div>

        {/* Activity Buttons Grid / Horizontal Scroll */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {ACTIVITIES.map((act) => {
            const Icon = act.icon;
            const isSelected = act.id === activePlan.id;
            return (
              <button
                key={act.id}
                onClick={() => setActivePlan(act)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:border-slate-400 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                <span>{act.name}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Display Card */}
        <div className="mt-8 overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/80 bg-white shadow-sm grid md:grid-cols-12 items-stretch">
          {/* Text & Action */}
          <div className="p-8 sm:p-12 md:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {activePlan.name}
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {activePlan.headline}
              </h3>
            </div>

            <div className="mt-8">
              <Link
                href={`/explore?activity=${activePlan.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition active:scale-95 shadow-md"
              >
                <span>{activePlan.actionText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Photo */}
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:col-span-6 overflow-hidden bg-slate-100 min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePlan.image}
              alt={activePlan.headline}
              className="h-full w-full object-cover transition duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
