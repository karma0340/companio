"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface MomentItem {
  id: string;
  caption: string;
  activity: string;
  plan: string;
}

const MOMENTS: MomentItem[] = [
  { id: "m02", caption: "Arcade hoops", activity: "Gaming Buddy", plan: "a gaming buddy" },
  { id: "m06", caption: "Rest stop on a hill trek", activity: "Weekend trek", plan: "a weekend trek" },
  { id: "m11", caption: "Evening at a cosy café", activity: "Café Chat", plan: "a café chat" },
  { id: "m05", caption: "Open-air film screening", activity: "Live Events", plan: "live events" },
  { id: "m15", caption: "Group gym class", activity: "Gym Buddy", plan: "a gym buddy" },
  { id: "m23", caption: "Bonfire on the beach", activity: "Bitching & gossip", plan: "gossip & chai" },
  { id: "m09", caption: "Dinner under fairy lights", activity: "Dinner Companion", plan: "a dinner out" },
  { id: "m13", caption: "Tree-lined city street", activity: "City Walk", plan: "a city walk" },
  { id: "m27", caption: "Board game night", activity: "Board games", plan: "board games" },
  { id: "m03", caption: "Sunset beach volleyball", activity: "Sports Buddy", plan: "a sports buddy" },
  { id: "m07", caption: "Library study session", activity: "Book cafés", plan: "a book café" },
  { id: "m14", caption: "Popcorn at the cinema", activity: "Live Events", plan: "a show" },
  { id: "m30", caption: "Sunrise viewpoint", activity: "Weekend trek", plan: "a trek" },
  { id: "m01", caption: "Ice cream run", activity: "Street food", plan: "a street-food run" },
  { id: "m08", caption: "A night out in the city", activity: "City Walk", plan: "a night walk" },
  { id: "m20", caption: "Gym session", activity: "Gym Buddy", plan: "a workout" },
  { id: "m16", caption: "Camp chairs at sunset", activity: "Weekend trek", plan: "a sunset trek" },
  { id: "m04", caption: "Study picnic in the park", activity: "Park Stroll", plan: "a park afternoon" },
  { id: "m12", caption: "Swings in the park", activity: "Park Stroll", plan: "a park stroll" },
  { id: "m10", caption: "Controllers at a gaming lounge", activity: "Gaming Buddy", plan: "a gaming café" },
  { id: "m21", caption: "Chai in the hills", activity: "Weekend trek", plan: "a hill getaway" },
  { id: "m17", caption: "Beach at dusk", activity: "Weekend trek", plan: "a beach day" },
  { id: "m22", caption: "Stargazing at night", activity: "Park Stroll", plan: "a night out" },
  { id: "m19", caption: "Hands in, group photo", activity: "Live Events", plan: "a big night" },
  { id: "m26", caption: "Sunset on the beach", activity: "City Walk", plan: "a sunset walk" },
];

const ROW1_ITEMS = MOMENTS.slice(0, 14);
const ROW2_ITEMS = MOMENTS.slice(14);
const TILTS = [-3.2, 2.1, -1.4, 3.4, -2.6, 1.2, -0.8, 2.8, -3.6, 1.8];

export function MomentsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Framer Motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Opposite parallax horizontal translation
  const row1X = useTransform(scrollYProgress, [0, 1], ["translateX(-18%)", "translateX(0%)"]);
  const row2X = useTransform(scrollYProgress, [0, 1], ["translateX(0%)", "translateX(-18%)"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="moments-heading"
      className="relative pt-12 pb-16 md:py-36 overflow-hidden"
      style={{
        background: "linear-gradient(140deg, #14122a 0%, #1e1840 60%, #120e28 100%)",
      }}
    >
      {/* Title & Subtitle */}
      <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-16 grid md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-7">
          <h2
            id="moments-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.08] tracking-tight text-white"
            style={{ letterSpacing: "-0.035em" }}
          >
            Life is richer with someone.
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/80">
            Pick the weekend you want. We’ll show you who in your city is up for it.
          </p>
        </div>
      </div>

      {/* Weekend plans group */}
      <div aria-label="Weekend plans" className="flex flex-col gap-6 md:gap-9" role="group">
        {/* Row 1 - Translates Right as you scroll */}
        <motion.div
          className="flex gap-5 md:gap-7 w-max will-change-transform"
          style={{ transform: row1X, marginLeft: 0 }}
        >
          {ROW1_ITEMS.map((item, idx) => {
            const tilt = TILTS[idx % TILTS.length];
            return (
              <Link
                key={item.id}
                href={`/explore?activity=${encodeURIComponent(item.activity)}`}
                data-moment-id={item.id}
                data-tilt={tilt}
                draggable={false}
                className="moment-card group relative block shrink-0 text-left rounded-[4px] outline-none transition duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-amber-400"
                style={{ transform: `rotate(${tilt}deg)` }}
              >
                <span className="block bg-[#FBF8F1] p-2.5 pb-0 rounded-[3px] shadow-[0_10px_30px_rgba(5,4,20,0.45)]">
                  <span
                    className="block relative overflow-hidden bg-[#1A1829]"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/landing/moments/${item.id}.webp`}
                      alt={item.caption}
                      width={220}
                      height={293}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </span>
                  <span className="block font-script text-[1.06rem] md:text-[1.35rem] leading-none text-[#2A2540] px-0.5 pt-2.5 pb-3.5 truncate">
                    {item.caption}
                  </span>
                </span>
              </Link>
            );
          })}
        </motion.div>

        {/* Row 2 - Translates Left as you scroll */}
        <motion.div
          className="flex gap-5 md:gap-7 w-max will-change-transform"
          style={{ transform: row2X, marginLeft: "-90px" }}
        >
          {ROW2_ITEMS.map((item, idx) => {
            const tilt = TILTS[(idx + 4) % TILTS.length];
            return (
              <Link
                key={item.id}
                href={`/explore?activity=${encodeURIComponent(item.activity)}`}
                data-moment-id={item.id}
                data-tilt={tilt}
                draggable={false}
                className="moment-card group relative block shrink-0 text-left rounded-[4px] outline-none transition duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-amber-400"
                style={{ transform: `rotate(${tilt}deg)` }}
              >
                <span className="block bg-[#FBF8F1] p-2.5 pb-0 rounded-[3px] shadow-[0_10px_30px_rgba(5,4,20,0.45)]">
                  <span
                    className="block relative overflow-hidden bg-[#1A1829]"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/landing/moments/${item.id}.webp`}
                      alt={item.caption}
                      width={220}
                      height={293}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </span>
                  <span className="block font-script text-[1.06rem] md:text-[1.35rem] leading-none text-[#2A2540] px-0.5 pt-2.5 pb-3.5 truncate">
                    {item.caption}
                  </span>
                </span>
              </Link>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-20">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 min-h-12 rounded-[10px] px-6 py-3.5 font-sans font-semibold text-[15px] transition-transform duration-200 active:scale-[0.97] hover:-translate-y-0.5 shadow-md"
          style={{ background: "#ffb23e", color: "#14122A" }}
        >
          Find your kind of plan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
