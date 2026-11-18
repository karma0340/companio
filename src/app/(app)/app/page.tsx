"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Smartphone } from "lucide-react";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import MarketplaceFooter from "@/components/marketplace/MarketplaceFooter";

export default function MarketplaceHomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hostHoursPerWeek, setHostHoursPerWeek] = useState(12);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Host earnings calculation: 12 hrs/wk * INR 499 * 4.33 weeks * 85% payout approx INR 22,000 - 45,000
  const estimatedEarnings = Math.round(hostHoursPerWeek * 499 * 4.33 * 0.85);

  const categories = [
    {
      id: "gym",
      title: "Gym Partner",
      desc: "Spot, motivate, and actually show up for leg day.",
      badge: "Fitness",
      color: "bg-[#EDFBC0]",
    },
    {
      id: "movie",
      title: "Movie Buddy",
      desc: "First-day-first-show without going solo.",
      badge: "Entertainment",
      color: "bg-[#FFF1BF]",
    },
    {
      id: "guide",
      title: "City Guide",
      desc: "Hidden cafes, old bazaars, and the best chaat in town.",
      badge: "Exploration",
      color: "bg-[#FFD1EA]",
    },
    {
      id: "shopping",
      title: "Shopping Buddy",
      desc: "Honest opinions on the fit, the colour, and the price.",
      badge: "Lifestyle",
      color: "bg-[#DCF8C6]",
    },
    {
      id: "events",
      title: "Event Plus-One",
      desc: "Weddings, concerts, and networking with a friendly face.",
      badge: "Social",
      color: "bg-[#B8A4FF]",
    },
    {
      id: "cafe",
      title: "Cafe Partner",
      desc: "Good conversation over a flat white. That's it.",
      badge: "Chill",
      color: "bg-[#FFF1BF]",
    },
    {
      id: "travel",
      title: "Travel Companion",
      desc: "Day trips and weekend getaways with a verified local.",
      badge: "Adventure",
      color: "bg-[#EDFBC0]",
    },
    {
      id: "food",
      title: "Food Trail Partner",
      desc: "Street-food trails, thali hunts and late-night dessert runs.",
      badge: "Foodie",
      color: "bg-[#FFD1EA]",
    },
  ];

  const hosts = [
    {
      id: "comp_01",
      name: "Kashish Agarwal",
      city: "Bengaluru",
      badge: "Shopping Buddy",
      headline: "Show me around? No - let me show you around Bengaluru",
      rate: 499,
      rating: "4.9",
      reviews: 28,
      image: "/assets/hosts/kashish.webp",
      isFreeToday: true,
    },
    {
      id: "comp_02",
      name: "Shameera Khan",
      city: "Mumbai",
      badge: "City Guide",
      headline: "Your friendly companion for coffee, city walks and fun adventures",
      rate: 599,
      rating: "5.0",
      reviews: 42,
      image: "/assets/hosts/shameera.webp",
      isFreeToday: true,
    },
    {
      id: "comp_03",
      name: "Akash Verma",
      city: "Bengaluru",
      badge: "Gym Partner",
      headline: "Best For The Company You Want! Workouts and tech chats",
      rate: 499,
      rating: "4.8",
      reviews: 19,
      image: "/assets/hosts/akash.webp",
      isFreeToday: true,
    },
    {
      id: "comp_04",
      name: "Samridhi Sharma",
      city: "Delhi NCR",
      badge: "Cafe Partner",
      headline: "I am kinda cafeholic and love art galleries and quiet bookstores",
      rate: 499,
      rating: "4.9",
      reviews: 34,
      image: "/assets/hosts/samridhi.webp",
      isFreeToday: false,
    },
    {
      id: "comp_05",
      name: "Vanshika Gupta",
      city: "Jaipur",
      badge: "Event Plus-One",
      headline: "Your Fun, Friendly Plus-One for events, exhibitions and walks",
      rate: 499,
      rating: "5.0",
      reviews: 15,
      image: "/assets/hosts/vanshika.webp",
      isFreeToday: false,
    },
  ];

  const faqs = [
    {
      q: "What is Companio?",
      a: "A platform to meet friendly, verified local hosts for everyday activities - a gym partner, a movie buddy, a local guide, or a plus-one for an event. It is strictly platonic companionship, not dating.",
    },
    {
      q: "How much does it cost?",
      a: "Hosts set their own hourly rates (typically INR 299 to INR 999 per hour). Each meetup has a small connection fee plus GST. You always see the complete transparent escrow breakdown before paying.",
    },
    {
      q: "How do I know it is safe?",
      a: "Every host is ID-verified with a live-selfie liveness check, meetups happen exclusively in public commercial places, payments sit in escrow until the session concludes, and you get live location sharing and SOS during every meetup.",
    },
    {
      q: "How does the 4-digit start code work?",
      a: "When your booking is confirmed, you receive a secret 4-digit PIN. You only disclose this code to your companion when you physically meet in person at the venue. Entering the code starts the session clock and confirms attendance.",
    },
    {
      q: "Can I become a host?",
      a: "Yes! If you are 18+, friendly, and reliable, you can apply in minutes. Set your own rate and hours, and withdraw your earnings directly to UPI.",
    },
  ];

  const popularCities = [
    "Delhi NCR",
    "Mumbai",
    "Bengaluru",
    "Pune",
    "Hyderabad",
    "Jaipur",
    "Kolkata",
    "Goa",
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#141414] font-sans selection:bg-[#C6F432] selection:text-[#141414]">
      {/* Neo-Brutalist Top Navigation */}
      <MarketplaceHeader />

      {/* HERO SECTION */}
      <section className="border-b-2 border-[#141414] bg-[#FFF8EE] py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#C6F432] border-2 border-[#141414] rounded-full text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_0_#141414]">
              <span className="w-2 h-2 rounded-full bg-[#141414] animate-pulse"></span>
              India&apos;s Verified Companion Network
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-[#141414] font-serif">
              Find a buddy, <br />
              <span className="underline decoration-[#FF7AC6] decoration-wavy decoration-4">
                not a date.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-neutral-800 font-medium max-w-2xl leading-relaxed">
              Find an ID-verified local buddy for the gym, movies, coffee, city walks, travel and events across India. 100% platonic, 18+, safety-first — escrow payments, live location and SOS.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
              <Link
                href="/explore"
                className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[#141414] text-[#FFF8EE] font-black text-base sm:text-lg rounded-xl border-2 border-[#141414] shadow-[4px_4px_0_0_#C6F432] sm:shadow-[5px_5px_0_0_#C6F432] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                Find company →
              </Link>
              <Link
                href="/become-a-companion"
                className="w-full sm:w-auto text-center px-6 py-3.5 sm:py-4 bg-[#FFF8EE] text-[#141414] font-extrabold text-sm sm:text-base rounded-xl border-2 border-[#141414] shadow-[3px_3px_0_0_#141414] sm:shadow-[4px_4px_0_0_#141414] hover:bg-amber-50 transition-all"
              >
                Become a Host
              </Link>
            </div>

            {/* Quick Proof Pills */}
            <div className="pt-6 flex flex-wrap items-center gap-3 text-xs font-bold text-neutral-700">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#141414] rounded-lg">
                100% Aadhaar & Selfie Verified
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#141414] rounded-lg">
                Escrow Protected Payouts
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#141414] rounded-lg">
                Public Venues Only
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHAT ARE WE DOING TODAY? */}
      <section className="py-16 px-4 sm:px-6 border-b-2 border-[#141414] bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#141414] font-serif">
              What are we doing today?
            </h2>
            <p className="text-neutral-600 font-medium">
              Pick an activity to discover companions ready to join you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`${cat.color} p-6 rounded-2xl border-2 border-[#141414] shadow-[4px_4px_0_0_#141414] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#141414] transition-all flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="inline-block px-2.5 py-0.5 bg-white border border-[#141414] rounded-full text-xs font-black uppercase tracking-wider text-[#141414]">
                    {cat.badge}
                  </div>
                  <h3 className="text-xl font-black text-[#141414]">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-neutral-800 leading-snug">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href={`/explore?activity=${cat.id}`}
                    className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[#141414] underline decoration-2 underline-offset-4 hover:text-amber-900"
                  >
                    Browse Hosts →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: THREE STEPS. ZERO AWKWARD. */}
      <section className="py-16 px-4 sm:px-6 border-b-2 border-[#141414] bg-[#FFF8EE]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#141414] font-serif">
              Three steps. Zero awkward.
            </h2>
            <p className="text-neutral-700 font-medium">
              A frictionless, transparent process designed so anyone can show up comfortably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border-2 border-[#141414] shadow-[6px_6px_0_0_#141414] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EDFBC0] border-2 border-[#141414] flex items-center justify-center font-black text-xl text-[#141414]">
                1
              </div>
              <h3 className="text-xl font-black text-[#141414]">
                Browse & Pick
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Browse verified hosts by activity, city, price, and language. Read real reviews and inspect verified ID badges.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border-2 border-[#141414] shadow-[6px_6px_0_0_#141414] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFD23F] border-2 border-[#141414] flex items-center justify-center font-black text-xl text-[#141414]">
                2
              </div>
              <h3 className="text-xl font-black text-[#141414]">
                Lock in Escrow
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Choose a time and a public cafe or meeting spot. Your payment waits safely in escrow — UPI, cards, or wallet.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border-2 border-[#141414] shadow-[6px_6px_0_0_#141414] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF7AC6] border-2 border-[#141414] flex items-center justify-center font-black text-xl text-[#141414]">
                3
              </div>
              <h3 className="text-xl font-black text-[#141414]">
                4-Digit Start Code
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Share your secret 4-digit start code in person. Live location + SOS are one tap away the entire duration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FREE TODAY (LIVE COMPANIONS FEED) */}
      <section className="py-16 px-4 sm:px-6 border-b-2 border-[#141414] bg-white">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#DCF8C6] border border-[#141414] rounded-full text-xs font-black uppercase text-[#141414] mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Available Today
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#141414] font-serif">
                Free today
              </h2>
              <p className="text-sm text-neutral-600 font-medium pt-1">
                Verified hosts ready to meetup in a couple of hours.
              </p>
            </div>
            <Link
              href="/explore"
              className="text-sm font-black text-[#141414] underline decoration-2 underline-offset-4 hover:text-amber-800"
            >
              View all 48+ companions →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hosts.slice(0, 3).map((host) => (
              <div
                key={host.id}
                className="bg-[#FFF8EE] rounded-2xl border-2 border-[#141414] shadow-[7px_7px_0_0_#141414] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-[260px] w-full bg-neutral-200 border-b-2 border-[#141414]">
                    <Image
                      src={host.image}
                      alt={host.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#C6F432] text-[#141414] text-xs font-black uppercase tracking-wider rounded-full border border-[#141414]">
                      Available Now
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#141414] text-[#FFF8EE] text-xs font-extrabold rounded-lg">
                      {host.city}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-[#141414]">
                        {host.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-amber-100 border border-[#141414] rounded text-xs font-black text-[#141414]">
                        ★ {host.rating} ({host.reviews})
                      </span>
                    </div>

                    <span className="inline-block px-2 py-0.5 bg-[#FFD1EA] border border-[#141414] rounded text-xs font-bold text-[#141414]">
                      {host.badge}
                    </span>

                    <p className="text-sm text-neutral-700 font-medium line-clamp-2">
                      {host.headline}
                    </p>
                  </div>
                </div>

                {/* Footer on Card */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-neutral-300 mt-2">
                  <div>
                    <span className="text-xs text-neutral-500 font-bold block uppercase">Hourly Rate</span>
                    <span className="text-lg font-black text-[#141414]">₹{host.rate}/hr</span>
                  </div>
                  <Link
                    href={`/app/booking/${host.id}`}
                    className="px-5 py-2 bg-[#141414] text-[#FFF8EE] font-black text-xs uppercase tracking-wider rounded-lg border-2 border-[#141414] shadow-[3px_3px_0_0_#C6F432] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TOP RATED THIS WEEK */}
      <section className="py-16 px-4 sm:px-6 border-b-2 border-[#141414] bg-[#FFF8EE]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#141414] font-serif">
              Top-rated this week
            </h2>
            <p className="text-neutral-700 font-medium pt-1">
              Verified, reviewed, ready to hang.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hosts.slice(2, 5).map((host) => (
              <div
                key={host.id}
                className="bg-white rounded-2xl border-2 border-[#141414] shadow-[7px_7px_0_0_#141414] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-[260px] w-full bg-neutral-200 border-b-2 border-[#141414]">
                    <Image
                      src={host.image}
                      alt={host.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#141414] text-[#FFF8EE] text-xs font-black uppercase rounded-lg">
                      {host.city}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-[#141414]">
                        {host.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-amber-100 border border-[#141414] rounded text-xs font-black text-[#141414]">
                        ★ {host.rating}
                      </span>
                    </div>

                    <span className="inline-block px-2 py-0.5 bg-[#EDFBC0] border border-[#141414] rounded text-xs font-bold text-[#141414]">
                      {host.badge}
                    </span>

                    <p className="text-sm text-neutral-700 font-medium line-clamp-2">
                      {host.headline}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-neutral-200 mt-2">
                  <div>
                    <span className="text-xs text-neutral-500 font-bold block uppercase">Rate</span>
                    <span className="text-lg font-black text-[#141414]">₹{host.rate}/hr</span>
                  </div>
                  <Link
                    href={`/app/booking/${host.id}`}
                    className="px-5 py-2 bg-[#141414] text-[#FFF8EE] font-black text-xs uppercase tracking-wider rounded-lg border-2 border-[#141414] shadow-[3px_3px_0_0_#FFD23F] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    Request
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: BUILT SO EVERYONE FEELS SAFE SHOWING UP */}
      <section className="py-16 px-4 sm:px-6 border-b-2 border-[#141414] bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block px-3 py-1 bg-[#B8A4FF] border border-[#141414] rounded-full text-xs font-black uppercase text-[#141414]">
              Zero Compromise
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#141414] font-serif">
              Built so everyone feels safe showing up.
            </h2>
            <p className="text-neutral-700 font-medium">
              Safety isn&apos;t a feature on Companio. It is the entire product architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-[#FFF8EE] border-2 border-[#141414] rounded-2xl shadow-[4px_4px_0_0_#141414] space-y-2">
              <h3 className="text-lg font-black text-[#141414]">Sovereign ID Verification</h3>
              <p className="text-sm text-neutral-700">
                Government ID and a live-selfie liveness check for every single host before activation.
              </p>
            </div>

            <div className="p-6 bg-[#FFF8EE] border-2 border-[#141414] rounded-2xl shadow-[4px_4px_0_0_#141414] space-y-2">
              <h3 className="text-lg font-black text-[#141414]">Escrow Money Protection</h3>
              <p className="text-sm text-neutral-700">
                Money is released only after your session concludes safely. No-show? 100% automatic refund.
              </p>
            </div>

            <div className="p-6 bg-[#FFF8EE] border-2 border-[#141414] rounded-2xl shadow-[4px_4px_0_0_#141414] space-y-2">
              <h3 className="text-lg font-black text-[#141414]">Live Location Sharing</h3>
              <p className="text-sm text-neutral-700">
                Share your live location during a meetup with a trusted friend or family member for free.
              </p>
            </div>

            <div className="p-6 bg-[#FFF8EE] border-2 border-[#141414] rounded-2xl shadow-[4px_4px_0_0_#141414] space-y-2">
              <h3 className="text-lg font-black text-[#141414]">24/7 Instant Emergency SOS</h3>
              <p className="text-sm text-neutral-700">
                Direct integration with National Emergency 112 dispatch with your GPS location.
              </p>
            </div>

            <div className="p-6 bg-[#FFF8EE] border-2 border-[#141414] rounded-2xl shadow-[4px_4px_0_0_#141414] space-y-2">
              <h3 className="text-lg font-black text-[#141414]">Automated Contact Shielding</h3>
              <p className="text-sm text-neutral-700">
                Numbers, UPI IDs and external handles are shielded in chat. Zero off-platform pressure.
              </p>
            </div>

            <div className="p-6 bg-[#FFF8EE] border-2 border-[#141414] rounded-2xl shadow-[4px_4px_0_0_#141414] space-y-2">
              <h3 className="text-lg font-black text-[#141414]">Strictly Platonic Guarantee</h3>
              <p className="text-sm text-neutral-700">
                Zero tolerance for romantic or sexual solicitation. 18+ only with permanent instant device bans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: POPULAR CITIES */}
      <section className="py-14 px-4 sm:px-6 border-b-2 border-[#141414] bg-[#FFF8EE]">
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#141414] font-serif">
            Popular cities
          </h2>
          <div className="flex flex-wrap gap-3">
            {popularCities.map((city) => (
              <Link
                key={city}
                href="/explore"
                className="px-4 py-2 bg-white text-[#141414] font-black text-sm rounded-xl border-2 border-[#141414] shadow-[3px_3px_0_0_#141414] hover:bg-[#FFD23F] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: GOOD COMPANY? GET PAID FOR IT. */}
      <section className="py-16 px-4 sm:px-6 border-b-2 border-[#141414] bg-[#EDFBC0]">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border-3 border-[#141414] shadow-[8px_8px_0_0_#141414] space-y-8">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-[#141414] text-[#FFF8EE] rounded-full text-xs font-black uppercase tracking-wider">
              Host Recruitment
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#141414] font-serif">
              Good company? Get paid for it.
            </h2>
            <p className="text-neutral-700 font-medium text-base sm:text-lg">
              Set your own rate and hours. Do activities you already love. Withdraw earnings to UPI instantly after every session.
            </p>
          </div>

          {/* Interactive Calculator Slider */}
          <div className="bg-[#FFF8EE] p-6 rounded-2xl border-2 border-[#141414] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#141414]">
                Hours you want to spend per week:
              </span>
              <span className="px-3 py-1 bg-[#141414] text-white font-black text-base rounded-lg">
                {hostHoursPerWeek} hours/wk
              </span>
            </div>

            <input
              type="range"
              min="4"
              max="35"
              step="1"
              value={hostHoursPerWeek}
              onChange={(e) => setHostHoursPerWeek(Number(e.target.value))}
              className="w-full h-3 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-[#141414]"
            />

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-300">
              <div>
                <span className="text-xs uppercase text-neutral-500 font-bold block">Estimated Monthly Take-Home</span>
                <span className="text-3xl sm:text-4xl font-black text-[#141414]">
                  ₹{estimatedEarnings.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-neutral-600 block pt-0.5">
                  Based on 85% payout of ₹499/hr standard rate
                </span>
              </div>
              <Link
                href="/become-a-companion"
                className="px-6 py-3 bg-[#141414] text-[#FFF8EE] font-black text-sm uppercase rounded-xl border-2 border-[#141414] shadow-[4px_4px_0_0_#C6F432] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
              >
                Apply as Host →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: QUESTIONS, ANSWERED (FAQ) */}
      <section className="py-16 px-4 sm:px-6 border-b-2 border-[#141414] bg-white">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#141414] font-serif">
              Questions, answered
            </h2>
            <p className="text-neutral-600 font-medium">
              Everything you need to know about booking or hosting on Companio.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#FFF8EE] rounded-xl border-2 border-[#141414] shadow-[4px_4px_0_0_#141414] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-black text-base sm:text-lg text-[#141414]"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl font-mono">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm sm:text-base text-neutral-800 font-medium leading-relaxed border-t border-neutral-300 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating PWA Install Banner on Mobile (Exact getcompanio.in live DOM spec) */}
      {showInstallBanner && (
        <div className="fixed inset-x-3 bottom-16 sm:bottom-6 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl border-2 sm:border-3 border-[#141414] bg-[#FFD23F] p-3 shadow-[4px_4px_0_0_#141414] animate-in slide-in-from-bottom-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#141414] bg-white text-base">
            <Smartphone className="h-5 w-5 text-[#141414]" />
          </div>
          <p className="flex-1 text-xs sm:text-sm font-bold text-[#141414] leading-snug">
            Add Companio to your home screen for faster meetups & alerts.
          </p>
          <button
            onClick={() => {
              alert("Companio PWA ready to install. Tap Share -> Add to Home Screen in your browser.");
              setShowInstallBanner(false);
            }}
            className="rounded-lg border-2 border-[#141414] bg-[#141414] px-3 py-1.5 text-xs font-black uppercase text-[#FFF8EE] shadow-[2px_2px_0_0_#FFF8EE] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Install
          </button>
          <button
            onClick={() => setShowInstallBanner(false)}
            className="p-1 font-black text-sm text-[#141414] hover:bg-black/10 rounded"
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>
      )}

      {/* Neo-Brutalist Marketplace Footer */}
      <MarketplaceFooter />
    </div>
  );
}
