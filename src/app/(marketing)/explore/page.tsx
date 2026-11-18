"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_COMPANIONS, MOCK_CITIES, MOCK_ACTIVITIES } from "@/lib/data";
import { CompanionCard } from "@/components/marketing/CompanionCard";
import { PaywallModal } from "@/components/marketing/PaywallModal";
import { CompanionSummary } from "@/types";
import { Search, Filter, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedActivity, setSelectedActivity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalCompanion, setActiveModalCompanion] = useState<CompanionSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Check user unlock state on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsUnlocked(Boolean(data.user.isUnlocked));
          setUserName(data.user.name || null);
        }
      })
      .catch(() => {});
  }, []);

  // Filter logic
  const filteredCompanions = useMemo(() => {
    return MOCK_COMPANIONS.filter((comp) => {
      const matchCity = selectedCity === "all" || comp.citySlug.toLowerCase() === selectedCity.toLowerCase();
      const matchActivity =
        selectedActivity === "all" ||
        comp.acceptedActivities.some((act) => act.toLowerCase().includes(selectedActivity.toLowerCase()));
      const matchSearch =
        !searchQuery ||
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchActivity && matchSearch;
    });
  }, [selectedCity, selectedActivity, searchQuery]);

  const handleCardClick = (comp: CompanionSummary) => {
    if (isUnlocked) {
      router.push(`/app/booking/${comp.id}`);
    } else {
      setActiveModalCompanion(comp);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Title & Trust Indicator */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-[#262626] pb-6 sm:pb-8 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Aadhaar & PAN Verified Companions</span>
          </div>
          <h1 className="mt-3 font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Explore Companions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8E8E93] max-w-xl">
            Browse verified social companions across India. Click any profile to view full details and book public sessions.
          </p>
        </div>

        {/* Global Unlock CTA Banner or Active Pass Indicator */}
        {isUnlocked ? (
          <div className="flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-5 sm:px-6 py-2.5 text-xs font-bold text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Active Member Pass Unlocked</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setActiveModalCompanion(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 sm:py-2.5 text-xs font-bold text-black transition hover:bg-[#E5C158] shadow-lg shadow-[#D4AF37]/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Unlock All Profiles (₹99.50)</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-6 sm:mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* City Filter Dropdown & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#2B2B2B] bg-[#141414] px-3.5 py-2.5">
            <Filter className="h-3.5 w-3.5 text-[#8E8E93]" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer w-full"
            >
              <option value="all" className="bg-[#141414] text-white">All Cities</option>
              {MOCK_CITIES.map((city) => (
                <option key={city.slug} value={city.slug} className="bg-[#141414] text-white">
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#2B2B2B] bg-[#141414] px-3.5 py-2.5 min-w-[200px]">
            <Search className="h-3.5 w-3.5 text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Search by name, hobby, or neighborhood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-[#666] outline-none"
            />
          </div>
        </div>

        {/* Activity Filter Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedActivity("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              selectedActivity === "all"
                ? "bg-white text-black"
                : "border border-[#262626] bg-[#141414] text-[#8E8E93] hover:text-white"
            }`}
          >
            All Activities
          </button>
          {MOCK_ACTIVITIES.map((act) => (
            <button
              key={act.slug}
              onClick={() => setSelectedActivity(act.slug)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedActivity === act.slug
                  ? "bg-[#D4AF37] text-black"
                  : "border border-[#262626] bg-[#141414] text-[#8E8E93] hover:text-white"
              }`}
            >
              {act.title}
            </button>
          ))}
        </div>
      </div>

      {/* Companions Grid */}
      <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCompanions.map((comp) => (
          <CompanionCard
            key={comp.id}
            companion={comp}
            isUnlocked={isUnlocked}
            onUnlockClick={handleCardClick}
          />
        ))}
      </div>

      {filteredCompanions.length === 0 && (
        <div className="mt-12 rounded-2xl border border-[#262626] bg-[#121212] py-16 text-center text-[#8E8E93]">
          <p className="text-sm">No companions found matching your selected filters.</p>
          <button
            onClick={() => {
              setSelectedCity("all");
              setSelectedActivity("all");
              setSearchQuery("");
            }}
            className="mt-3 text-xs font-bold text-[#D4AF37] underline"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Interactive Paywall Modal */}
      <PaywallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companionName={activeModalCompanion?.displayName}
        onUnlockedSuccess={() => {
          setIsUnlocked(true);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
