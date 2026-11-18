"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_CITIES, MOCK_COMPANIONS } from "@/lib/data";
import { CompanionCard } from "@/components/marketing/CompanionCard";
import { PaywallModal } from "@/components/marketing/PaywallModal";
import { CompanionSummary } from "@/types";
import { MapPin, ShieldCheck, Sparkles, Coffee, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CityPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || "delhi").toLowerCase();

  const city = MOCK_CITIES.find((c) => c.slug === slug) || {
    id: "unknown",
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug: slug,
    state: "India",
    isActive: true,
  };

  const companionsInCity = MOCK_COMPANIONS.filter((c) => c.citySlug === slug);
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsUnlocked(Boolean(data.user.isUnlocked));
        }
      })
      .catch(() => {});
  }, []);

  const handleCardClick = (comp: CompanionSummary) => {
    if (isUnlocked) {
      router.push(`/app/booking/${comp.id}`);
    } else {
      setSelectedCompanion(comp);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Back to Explore Breadcrumb */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93] hover:text-white mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to all cities</span>
      </Link>

      {/* Hero Section */}
      <div className="border-b border-[#262626] pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
          <MapPin className="h-3.5 w-3.5" />
          <span>{city.name}, {city.state} • Programmatic City Directory</span>
        </div>

        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          Hire Verified Companions in {city.name}
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-[#A1A1A6] sm:text-base leading-relaxed">
          Explore curated coffee spots, art exhibitions, and city walks across {city.name}. Every companion is 100% Aadhaar verified. Strictly platonic, public-only experiences.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {isUnlocked ? (
            <div className="flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-6 py-2.5 text-xs font-bold text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Active Member Pass Unlocked</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setSelectedCompanion(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5C158] transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Unlock {city.name} Companions (₹99.50)</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Verified Escrow Safety • 4-Digit In-Person PIN</span>
          </div>
        </div>
      </div>

      {/* Companions in City */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-white">
            Available Hosts in {city.name} ({companionsInCity.length > 0 ? companionsInCity.length : "Showing Featured"})
          </h2>
          <span className="text-xs text-[#8E8E93]">
            {isUnlocked ? "Full profiles unlocked" : "Profiles masked for privacy"}
          </span>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(companionsInCity.length > 0 ? companionsInCity : MOCK_COMPANIONS).map((comp) => (
            <CompanionCard
              key={comp.id}
              companion={comp}
              isUnlocked={isUnlocked}
              onUnlockClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {/* Popular Public Venues in this City */}
      <div className="mt-16 rounded-2xl border border-[#262626] bg-[#121212] p-8">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <Coffee className="h-5 w-5 text-[#D4AF37]" />
          <span>Recommended Public Venues in {city.name}</span>
        </h3>
        <p className="mt-1 text-xs text-[#8E8E93]">
          All meetups must take place in verified, neutral public settings.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#222] bg-[#161616] p-4 text-xs">
            <div className="font-bold text-white">Artisan Coffee Roasteries</div>
            <p className="mt-1 text-[#8E8E93]">Third Wave Coffee, Blue Tokai, Araku Coffee</p>
          </div>
          <div className="rounded-xl border border-[#222] bg-[#161616] p-4 text-xs">
            <div className="font-bold text-white">Public Parks & Promenades</div>
            <p className="mt-1 text-[#8E8E93]">Cubbon Park, Lodhi Art District, Marine Drive</p>
          </div>
          <div className="rounded-xl border border-[#222] bg-[#161616] p-4 text-xs">
            <div className="font-bold text-white">Culture & Galleries</div>
            <p className="mt-1 text-[#8E8E93]">National Gallery of Modern Art, Museum of Art & Photography</p>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companionName={selectedCompanion?.displayName}
        onUnlockedSuccess={() => {
          setIsUnlocked(true);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
