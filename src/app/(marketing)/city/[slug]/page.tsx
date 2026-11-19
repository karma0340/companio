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
      router.push(`/companion/${comp.id}`);
    } else {
      setSelectedCompanion(comp);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Back to Explore Breadcrumb */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to explore directory</span>
        </Link>

        {/* Hero Section */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            <span>{city.name}, {city.state} · Verified City Directory</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore {city.name} with a local companion
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Coffee, city walks, art galleries, and live gigs with verified locals who know {city.name} inside out. Every companion is reviewed before going live. Strictly platonic.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {isUnlocked ? (
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Active Member Pass Unlocked</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedCompanion(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-full bg-[#101828] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-black transition active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Unlock all {city.name} profiles (from ₹99.50)</span>
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Public venues only · 100% Escrow protected</span>
            </div>
          </div>
        </div>

        {/* Companions in City Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Verified Companions in {city.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {companionsInCity.length > 0 ? `${companionsInCity.length} verified locals ready for meetups` : "Featured companions ready to meet"}
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {isUnlocked ? "Full profiles unlocked" : "ID-checked badges active"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        <div className="mt-16 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Coffee className="h-5 w-5 text-blue-600" />
            <span>Recommended Public Venues in {city.name}</span>
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            For safety and quality, all Companio meetups take place strictly in verified public spots.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs">
              <div className="font-bold text-slate-900">Artisan Coffee Roasteries</div>
              <p className="mt-1 text-slate-600">Third Wave Coffee, Blue Tokai, Araku Coffee, Starbucks</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs">
              <div className="font-bold text-slate-900">Public Parks & Promenades</div>
              <p className="mt-1 text-slate-600">Cubbon Park, Lodhi Art District, Bandra Carter Road, Marine Drive</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs">
              <div className="font-bold text-slate-900">Culture & Galleries</div>
              <p className="mt-1 text-slate-600">National Gallery of Modern Art, Museum of Art & Photography</p>
            </div>
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
