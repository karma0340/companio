'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion } from '@/components/ui/accordion';
import { CompanionCard } from '@/components/companion/companion-card';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { StatusPulse } from '@/components/ui/status-pulse';
import { ACTIVITIES } from '@/lib/data/activities';
import { CITIES } from '@/lib/data/cities';
import { Companion } from '@/lib/types';
import { CompanionCardSkeleton } from '@/components/companion/companion-card-skeleton';
import { useAuth } from '@/context/auth-context';
import { HowItWorksJourney } from '@/components/how-it-works/how-it-works-journey';
import { KineticText } from '@/components/landing/kinetic-text';
import { TiltCard } from '@/components/landing/tilt-card';
import { SafetyBento } from '@/components/landing/safety-bento';
import { HostEarningsCalculator } from '@/components/landing/host-earnings-calculator';
import { ActivityCarousel } from '@/components/landing/activity-carousel';
import { TopRatedCarousel } from '@/components/landing/top-rated-carousel';

interface HomeClientProps {
  initialCompanions: Companion[];
  initialTotal: number;
}

export function HomeClient({ initialCompanions, initialTotal }: HomeClientProps) {
  const { isAuthenticated } = useAuth();
  const [heroCity, setHeroCity] = useState('chandigarh');
  const [heroActivity, setHeroActivity] = useState('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const freeTodayScrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/companions/bookmarks', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && Array.isArray(data.companionIds)) {
            setSavedIds(data.companionIds);
          }
        })
        .catch(() => {});
    } else if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('meetzy_saved_companions') || '[]');
        if (Array.isArray(stored)) setSavedIds(stored);
      } catch {}
    }
  }, [isAuthenticated]);

  const liveCompanions = initialCompanions;
  const totalAvailableHosts = initialTotal || liveCompanions.length;
  const freeTodayCompanions = liveCompanions.filter((c) => c.isFreeToday);
  const freeTodaySliderItems =
    freeTodayCompanions.length > 0 ? freeTodayCompanions : liveCompanions;
  const featured = liveCompanions[0] || null;

  const scrollFreeToday = (direction: 'left' | 'right') => {
    if (freeTodayScrollRef.current) {
      freeTodayScrollRef.current.scrollBy({
        left: direction === 'left' ? -340 : 340,
        behavior: 'smooth',
      });
    }
  };

  const faqItems = [
    {
      id: 'faq-1',
      question: 'Is Meetzy Club a dating or matchmaking app?',
      answer:
        'Absolutely NOT. Meetzy Club is strictly for platonic, activity-based companionship. We exist to help you find a gym spotter, a movie buddy, a shopping guide, or a coffee companion. Any romantic advances, escorting requests, or inappropriate behavior result in an immediate permanent ban and forfeiture of escrow funds.',
    },
    {
      id: 'faq-2',
      question: 'How do Escrow Payments protect my money?',
      answer:
        'When you book a companion, your payment is held securely in our escrow vault. The companion is NOT paid until the meetup happens in person and you exchange the 4-digit start code. If cancelled or declined before start verification, 75% is refunded back automatically after a 25% cancellation and processing fee.',
    },
    {
      id: 'faq-3',
      question: 'What is the 4-Digit Start Code and how does it work?',
      answer:
        'When your booking is confirmed, a secret 4-digit numeric code is generated on your Meetzy Club screen. When you meet your companion at the agreed public venue, you share this code with them. Once they enter it, the meetup timer officially activates. No code = no meetup = zero payment released.',
    },
    {
      id: 'faq-4',
      question: 'Where can meetups take place?',
      answer:
        'PUBLIC VENUES ONLY. Coffee shops, malls, public parks, gym franchises, metro lobbies, museums, or cultural venues. Private residences, hotel rooms, or secluded areas are strictly prohibited and will get your account flagged.',
    },
    {
      id: 'faq-5',
      question: 'How are companions verified?',
      answer:
        'Every single host verifies their Indian mobile number via live SMS OTP, submits a clear public headshot photo, sets preferred public venues, and agrees to our strictly platonic Code of Conduct before going live. We never require Aadhaar cards or invasive biometric storage.',
    },
    {
      id: 'faq-6',
      question: 'Can women choose women-only companions?',
      answer:
        'Yes. We have a dedicated "Women Hosts for Women" filter. Female hosts have the autonomy to restrict bookings exclusively to verified female members for maximum comfort and peace of mind.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1">
        {/* SECTION 1: HERO */}
        <section className="relative overflow-hidden border-b-brutal bg-paper pt-8 pb-14 lg:py-18">
          <div
            aria-hidden="true"
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-35 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 600px 300px at 50% 50%, rgba(198,244,50,0.3) 0%, rgba(255,210,63,0.2) 40%, transparent 100%)',
            }}
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <motion.div
                    initial={{ rotate: -3, scale: 0.95 }}
                    animate={{ rotate: [-3, -1, -3] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="inline-flex items-center gap-1.5 rounded-full border-brutal-sm bg-lime px-3 py-1 font-display text-xs font-black uppercase text-ink shadow-brutal-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>The Anti-Dating App</span>
                  </motion.div>

                  <motion.div
                    initial={{ rotate: 2, scale: 0.95 }}
                    animate={{ rotate: [2, 4, 2] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                    className="inline-flex items-center gap-1.5 rounded-full border-brutal-sm bg-sunny px-3 py-1 font-display text-xs font-black uppercase text-ink shadow-brutal-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-pink-700" />
                    <span>100% Platonic Only</span>
                  </motion.div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border-brutal-sm bg-paper-deep px-3 py-1 font-display text-xs font-black uppercase text-ink shadow-brutal-xs">
                    <StatusPulse size="xs" status="active" />
                    <span>{CITIES.length} Cities Live</span>
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ink leading-[1.12]">
                  Find a companion for <br />
                  <KineticText /> <br />
                  <span className="text-ink">not a date.</span>
                </h1>

                <p className="font-body text-base sm:text-lg text-ink-soft max-w-xl leading-relaxed">
                  Never go alone again. Book verified companions for the gym, movies, cafe chats, or food walks. Safe, strictly public, and zero awkwardness.
                </p>

                <div className="rounded-2xl border-brutal bg-white p-3.5 sm:p-4 shadow-brutal-lg space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 transition-transform hover:translate-y-[-1px]">
                  <div className="sm:w-1/3">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-ink-muted mb-1">
                      City
                    </label>
                    <select
                      value={heroCity}
                      onChange={(e) => setHeroCity(e.target.value)}
                      className="w-full rounded-xl border-brutal-sm bg-paper-deep px-3 py-2 text-xs font-extrabold text-ink focus:outline-none cursor-pointer"
                    >
                      {CITIES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:w-1/3">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-ink-muted mb-1">
                      Activity
                    </label>
                    <select
                      value={heroActivity}
                      onChange={(e) => setHeroActivity(e.target.value)}
                      className="w-full rounded-xl border-brutal-sm bg-paper-deep px-3 py-2 text-xs font-extrabold text-ink focus:outline-none cursor-pointer"
                    >
                      <option value="all">Any Activity ({ACTIVITIES.length} available)</option>
                      {ACTIVITIES.map((a) => (
                        <option key={a.slug} value={a.slug}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:w-1/3 sm:self-end">
                    <Link
                      href={`/explore?city=${heroCity}&activity=${heroActivity}`}
                      className="block w-full"
                    >
                      <Button variant="primary" size="md" fullWidth className="font-display font-black text-sm">
                        <span>Find Companion →</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-extrabold text-ink">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Mobile OTP Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Escrow Payment Lock</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>4-Digit Start Code</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex justify-center pt-4 lg:pt-0">
                <div className="relative w-full max-w-sm">
                  <motion.div
                    animate={{
                      rotate: [-3, -4.5, -3],
                      y: [0, 4, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-2xl border-brutal bg-pink translate-x-2 translate-y-3 shadow-brutal pointer-events-none"
                  />

                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <TiltCard maxTilt={6}>
                      {!featured ? (
                        <div className="relative rounded-2xl border-brutal bg-white p-5 shadow-brutal-lg rotate-1 space-y-4">
                          <p className="font-display text-sm font-black text-ink">
                            Browse Verified Companions on Explore
                          </p>
                          <Link href="/explore">
                            <Button variant="primary" size="sm">
                              Explore Now →
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/companions/${featured.id}`}
                          className="block group cursor-pointer"
                          aria-label={`View profile of ${featured.name}`}
                        >
                          <div className="relative rounded-2xl border-brutal bg-white p-5 shadow-brutal-lg rotate-1 space-y-4 transition-transform group-hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                              <Badge variant="lime" size="sm" className="inline-flex items-center gap-1.5">
                                <StatusPulse size="xs" status="active" />
                                <span>Available Today</span>
                              </Badge>
                              <span className="inline-flex items-center gap-1 font-display text-xs font-black text-ink-muted">
                                <MapPin className="h-3 w-3 text-ink-muted" />
                                <span>{featured.area || featured.city}</span>
                              </span>
                            </div>

                            <div className="flex gap-4 items-center">
                              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-brutal bg-paper-deep">
                                <Image
                                  src={featured.avatarUrl}
                                  alt={featured.name}
                                  fill
                                  priority
                                  sizes="80px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h3 className="font-display text-2xl font-black text-ink group-hover:text-lavender transition-colors">
                                  {featured.name} · {featured.age}
                                </h3>
                                <p className="text-xs font-bold text-ink-soft">
                                  Verified Meetzy Club Host
                                </p>
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {(featured.rawActivities && featured.rawActivities.length > 0
                                    ? featured.rawActivities.slice(0, 2)
                                    : ['Coffee & Chats']
                                  ).map((hobby, hIdx) => (
                                    <span
                                      key={hobby}
                                      className="inline-flex items-center gap-1 rounded-md border-brutal-sm bg-sunny px-1.5 py-0.5 text-[10px] font-bold text-ink"
                                    >
                                      <ActivityIcon
                                        slug={featured.activities[hIdx] || 'coffee-chat'}
                                        size="xs"
                                      />
                                      <span>{hobby}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl border-brutal-sm bg-paper/70 p-3 text-xs font-medium text-ink-soft leading-relaxed italic line-clamp-2">
                              &ldquo;{featured.tagline}&rdquo;
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t-brutal-sm">
                              <div>
                                <span className="text-[10px] uppercase font-black text-ink-muted block">
                                  Hourly Rate
                                </span>
                                <span className="font-display text-lg font-black text-ink">
                                  ₹{featured.hourlyRate} /hr
                                </span>
                              </div>
                              <div className="inline-flex items-center gap-1.5 rounded-xl border-brutal bg-lime px-4 py-2 font-display text-xs font-black text-ink shadow-brutal-sm group-hover:bg-sunny btn-press transition-colors">
                                <span>View {featured.name} →</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )}
                    </TiltCard>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FREE TODAY LIVE CAROUSEL */}
        <section className="border-b-brutal bg-white py-14 sm:py-18">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md border-brutal-sm bg-lime px-2.5 py-1 text-xs font-black uppercase text-ink shadow-brutal-sm mb-2">
                  <StatusPulse size="xs" status="active" />
                  <span>Real-Time Availability</span>
                </div>
                <h2 className="flex items-center gap-3 font-display text-3xl sm:text-4xl font-black text-ink">
                  <StatusPulse size="sm" status="active" />
                  <span>Free today in your city</span>
                </h2>
                <p className="font-body text-sm text-ink-soft mt-1">
                  Need plans for later today? These verified hosts have open slots right now.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => scrollFreeToday('left')}
                  aria-label="Swipe left"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-white text-ink shadow-brutal-xs hover:bg-sunny transition cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFreeToday('right')}
                  aria-label="Swipe right"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-white text-ink shadow-brutal-xs hover:bg-sunny transition cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <Link href="/explore?freeToday=true">
                  <Button variant="outline" size="sm" className="font-display font-black">
                    <span>Explore More ({totalAvailableHosts}) →</span>
                  </Button>
                </Link>
              </div>
            </div>

            {freeTodaySliderItems.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <CompanionCardSkeleton key={idx} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  ref={freeTodayScrollRef}
                  className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {freeTodaySliderItems.map((comp, idx) => (
                    <div
                      key={comp.id}
                      className="w-[270px] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] shrink-0 snap-start"
                    >
                      <TiltCard maxTilt={4}>
                        <CompanionCard
                          companion={comp}
                          priority={idx < 4}
                          initialBookmarked={savedIds.includes(comp.id)}
                        />
                      </TiltCard>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-7 py-3 font-display text-sm font-black text-ink shadow-brutal hover:bg-lime transition-all btn-press"
                  >
                    <span>Show All Companions in Explore</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: ACTIVITIES CAROUSEL */}
        <section className="border-b-brutal bg-paper py-14 sm:py-18">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <Badge variant="sunny" size="md">
                {ACTIVITIES.length} Approved Activities
              </Badge>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-ink">
                What are we doing today?
              </h2>
              <p className="font-body text-sm sm:text-base text-ink-soft">
                Everything is better with good company. Pick an activity and find a verified buddy ready to show up.
              </p>
            </div>

            <ActivityCarousel />
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS */}
        <section className="border-b-brutal bg-white py-10 sm:py-16">
          <HowItWorksJourney showHero={true} />
        </section>

        {/* SECTION 5: TOP-RATED COMPANIONS */}
        <section className="border-b-brutal bg-paper py-14 sm:py-18">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <Badge variant="pink" size="md" className="mb-2">
                  Community Favorites
                </Badge>
                <h2 className="font-display text-3xl sm:text-5xl font-black text-ink">
                  Top-rated this week
                </h2>
                <p className="font-body text-sm sm:text-base text-ink-soft mt-1">
                  OTP-verified, reviewed by verified members, and ready to hang out.
                </p>
              </div>

              <Link href="/explore">
                <Button variant="dark" size="md" className="font-display font-black">
                  <span>Browse All Companions →</span>
                </Button>
              </Link>
            </div>

            <TopRatedCarousel
              companions={liveCompanions}
              isLoading={false}
              savedIds={savedIds}
            />
          </div>
        </section>

        {/* SECTION 6: SAFETY BENTO */}
        <section className="border-b-brutal bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <Badge variant="lavender" size="md">
                Safety by Architecture
              </Badge>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-ink">
                Built so everyone feels safe showing up.
              </h2>
              <p className="font-body text-sm sm:text-base text-ink-soft">
                Safety is not an afterthought or marketing slogan. It is engineered into every line of code.
              </p>
            </div>

            <SafetyBento />
          </div>
        </section>

        {/* SECTION 7: HOST EARNINGS CALCULATOR */}
        <section className="border-b-brutal bg-white py-14 sm:py-18">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <HostEarningsCalculator />
          </div>
        </section>

        {/* SECTION 8: FAQ */}
        <section className="py-14 sm:py-18 bg-paper">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-3">
              <Badge variant="paper" size="md">
                Clarity First
              </Badge>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-ink">
                Questions, answered
              </h2>
              <p className="font-body text-sm sm:text-base text-ink-soft">
                Everything you need to know about safety, escrow, and meetup rules.
              </p>
            </div>

            <Accordion items={faqItems} />

            <div className="text-center pt-4">
              <Link href="/faq" className="font-display text-sm font-extrabold text-lavender underline">
                Have more questions? Read our full FAQ directory →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
