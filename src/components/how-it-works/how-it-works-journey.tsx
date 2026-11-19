'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { Search, Lock, MessageSquare, MapPin, Star, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { LottiePlayer } from '@/components/ui/lottie-player';

interface StepItem {
  n: string;
  title: string;
  icon: React.ElementType;
  color: string;
  ink: string;
  bg: string;
  lottie: string;
  body: string;
}

const STEPS: StepItem[] = [
  {
    n: '01',
    title: 'Browse companions',
    icon: Search,
    color: '#2E6BFF',
    ink: '#1D4ED8',
    bg: '#EBF1FF',
    lottie: '/lottie/explore-scene.json',
    body: 'Filter by activity and city. Every profile is Aadhaar-verified and background-checked before going live. The ID-checked badge means our team has verified that person’s government ID.',
  },
  {
    n: '02',
    title: 'Unlock full profiles',
    icon: Lock,
    color: '#7A4FE0',
    ink: '#6D28D9',
    bg: '#F0EBFF',
    lottie: '/lottie/unlock-burst.json',
    body: 'The pass unlocks full profiles in every open city, and chat opens once a companion accepts your booking. Each meetup is paid separately at the companion’s hourly rate, shown before you pay. Nothing renews, nothing auto-debits.',
  },
  {
    n: '03',
    title: 'Request a meetup',
    icon: MessageSquare,
    color: '#B5791F',
    ink: '#92400E',
    bg: '#FFF8EC',
    lottie: '/lottie/scene-1.json',
    body: 'Pick the activity, a time and a public spot. When your companion accepts, chat opens so you can plan the details.',
  },
  {
    n: '04',
    title: 'Meet in a public place',
    icon: MapPin,
    color: '#1FAE6B',
    ink: '#047857',
    bg: '#E6F5EE',
    lottie: '/lottie/hiw-meet.json',
    body: 'Share your 4-digit meetup code with your companion when you meet. SOS stays on screen the whole time: tap it, then WhatsApp or SMS, to send your location to someone you trust.',
  },
  {
    n: '05',
    title: 'Rate it, meet again',
    icon: Star,
    color: '#FFB23E',
    ink: '#D97706',
    bg: '#FFF8EC',
    lottie: '/lottie/hiw-rate.json',
    body: 'Leave an honest review after you meet. If it clicked, book another meetup with them in a single tap.',
  },
];

interface HowItWorksJourneyProps {
  showHero?: boolean;
}

export function HowItWorksJourney({ showHero = true }: HowItWorksJourneyProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Track scroll position across the 5 steps
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 60%', 'end 70%'],
  });

  return (
    <div className="flex-1 pb-16 md:pb-24 overflow-hidden">
      {/* Hero Section */}
      {showHero && (
        <section className="pt-8 pb-6 md:py-24 relative overflow-hidden" aria-labelledby="hiw-heading">
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1240px] h-[900px] opacity-40 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 480px 380px at 50% 50%, rgba(231,238,255,0.7) 0%, rgba(231,238,255,0.35) 40%, rgba(231,238,255,0.12) 70%, transparent 100%)',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border-brutal-sm bg-lime px-3 py-1 font-display text-xs font-black uppercase text-ink shadow-brutal-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Step-by-Step Guide</span>
            </div>

            <h1
              id="hiw-heading"
              className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-ink tracking-tight leading-[1.1]"
            >
              How Companio works,{' '}
              <span className="bg-sunny px-3 py-0.5 border-brutal rounded-2xl shadow-brutal-sm inline-block">
                in five steps.
              </span>
            </h1>

            <p className="font-body text-base md:text-lg text-ink-soft max-w-xl mx-auto leading-relaxed">
              From the first browse to the second meetup. Strictly platonic, always in public.
            </p>
          </div>
        </section>
      )}

      {/* Vertical Interactive Scroll Timeline */}
      <section className="pb-16 pt-4 md:pt-10">
        <div className="max-w-4xl mx-auto px-5 md:px-8 relative">
          <div ref={timelineRef} className="relative">
            {/* Timeline Vertical Rail */}
            <div
              aria-hidden="true"
              className="absolute left-6 md:left-1/2 -ml-px md:-translate-x-1/2 top-10 bottom-10 w-1 md:w-1.5 rounded-full bg-black/5 overflow-hidden"
            >
              {/* Animated Progress Fill Line */}
              <motion.div
                style={{
                  scaleY: scrollYProgress,
                  transformOrigin: 'top',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #2E6BFF 0%, #7A4FE0 35%, #1FAE6B 70%, #FFB23E 100%)',
                  borderRadius: '9999px',
                }}
              />
            </div>

            {/* Step Cards List */}
            <div className="flex flex-col gap-6 md:gap-20 relative z-10">
              {STEPS.map((step, idx) => {
                const isReverse = idx % 2 === 1;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.n}
                    className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                      isReverse ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Pulsing Dot on Central Timeline */}
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      viewport={{ once: true, margin: '-15% 0px' }}
                      className="absolute left-6 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 shadow-sm z-20 flex items-center justify-center bg-white"
                      style={{ borderColor: step.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.color }} />
                    </motion.div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />

                    {/* Step Card */}
                    <div className="flex-1 w-full pl-12 md:pl-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        viewport={{ once: true, margin: '-10% 0px' }}
                      >
                        <div
                          className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border-brutal bg-white p-5 md:p-8 shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
                        >
                          {/* Corner Gradient Glow */}
                          <div
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                              background: `linear-gradient(135deg, ${step.bg} 0%, transparent 100%)`,
                            }}
                          />

                          {/* Large Background Step Watermark */}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1 right-3 font-display font-black leading-none select-none text-7xl md:text-8xl opacity-10"
                            style={{ color: step.color }}
                          >
                            {step.n}
                          </span>

                          {/* Top Row: Lottie Animation & Step Badge */}
                          <div className="relative z-10 mb-3 md:mb-6 flex items-center justify-between gap-3">
                            <span className="block shrink-0 w-[88px] h-[88px] md:w-[150px] md:h-[150px] drop-shadow-sm">
                              <LottiePlayer src={step.lottie} />
                            </span>

                            {/* Mobile & Desktop Step Pill */}
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full border-brutal-sm px-3 py-1 font-display text-xs font-black uppercase shadow-brutal-xs"
                              style={{
                                backgroundColor: step.bg,
                                borderColor: step.color,
                                color: step.ink,
                              }}
                            >
                              <IconComponent className="h-3.5 w-3.5" style={{ color: step.color }} />
                              <span>Step {Number(step.n)}</span>
                            </span>
                          </div>

                          {/* Heading */}
                          <h2 className="relative z-10 font-display text-2xl md:text-3xl font-black text-ink mb-2 md:mb-3">
                            {step.title}
                          </h2>

                          {/* Body Copy */}
                          <p className="relative z-10 font-body text-[15px] md:text-base text-ink-soft leading-relaxed text-pretty">
                            {step.body}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="text-center mt-12 md:mt-20 relative z-10 space-y-4">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-2xl border-brutal bg-lime font-display text-base font-black text-ink shadow-brutal hover:bg-sunny hover:shadow-brutal-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Browse companions</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1 font-display text-sm font-bold text-ink-muted hover:text-ink transition-colors cursor-pointer"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* "Before you request a meetup" Highlight Rule */}
      <section aria-labelledby="hiw-request-rule" className="px-4 pb-16 md:pb-24">
        <div className="mx-auto max-w-xl rounded-3xl p-5 md:p-7 flex gap-4 items-start border-brutal bg-[#FFF8EC] shadow-brutal-sm">
          <span
            aria-hidden="true"
            className="grid place-items-center shrink-0 w-11 h-11 rounded-2xl border-brutal-sm bg-white text-[#B5791F] shadow-brutal-xs"
          >
            <Clock className="w-5 h-5 text-[#B5791F] stroke-[2.25]" />
          </span>
          <div>
            <h2 id="hiw-request-rule" className="font-display text-base font-black text-ink mb-1">
              Before you request a meetup
            </h2>
            <p className="font-body text-[15px] md:text-base leading-relaxed text-ink-soft text-pretty">
              Book at least 2 hours ahead; if a companion declines, you see their reason when they give one, and your money comes back as credit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
