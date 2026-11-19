"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_COMPANIONS, MOCK_CITIES } from "@/lib/data";
import { CompanionCard } from "@/components/marketing/CompanionCard";
import { PaywallModal } from "@/components/marketing/PaywallModal";
import { CompanionSummary } from "@/types";
import {
  Search,
  CheckCircle2,
  ChevronDown,
  Coffee,
  Footprints,
  UtensilsCrossed,
  Ticket,
  Building2,
  BookOpen,
  Dumbbell,
  Flame,
  MoreHorizontal,
  LayoutGrid,
  Map as MapIcon,
  Sparkles,
} from "lucide-react";

const ACTIVITIES = [
  { id: "all", label: "All Activities", icon: Sparkles },
  { id: "cafe", label: "Café Chat", icon: Coffee },
  { id: "walk", label: "City Walk", icon: Footprints },
  { id: "food", label: "Street Food", icon: UtensilsCrossed },
  { id: "events", label: "Live Events", icon: Ticket },
  { id: "museum", label: "Museum Visit", icon: Building2 },
  { id: "books", label: "Book Cafés", icon: BookOpen },
  { id: "gym", label: "Gym Buddy", icon: Dumbbell },
  { id: "run", label: "Morning Run", icon: Flame },
  { id: "more", label: "More", icon: MoreHorizontal },
];

export default function ExplorePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>("mumbai");
  const [selectedActivity, setSelectedActivity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<"All" | "Women" | "Men">("All");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [activeModalCompanion, setActiveModalCompanion] = useState<CompanionSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check user unlock state on mount
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

  // Filter companions
  const filteredCompanions = useMemo(() => {
    return MOCK_COMPANIONS.filter((comp) => {
      const matchCity =
        selectedCity === "all" ||
        comp.citySlug.toLowerCase() === selectedCity.toLowerCase() ||
        comp.city.toLowerCase().includes(selectedCity.toLowerCase());

      const matchActivity =
        selectedActivity === "all" ||
        selectedActivity === "more" ||
        comp.acceptedActivities.some((act) =>
          act.toLowerCase().includes(selectedActivity.toLowerCase())
        );

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
      router.push(`/companion/${comp.id}`);
    } else {
      setActiveModalCompanion(comp);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-20">
      {/* Top Banner / Hero Header (Image 3 Parity) */}
      <div className="border-b border-slate-200/80 bg-gradient-to-b from-blue-50/40 via-white to-transparent pt-6 pb-6 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* City Dropdown Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Explore companions in</span>
            <div className="relative inline-block">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="appearance-none rounded-full border border-slate-200 bg-white px-3.5 py-1 pr-7 text-xs font-bold text-slate-800 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi NCR</option>
                <option value="bengaluru">Bengaluru</option>
                <option value="pune">Pune</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="all">All Cities</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Good company, near you.
          </h1>

          {/* ID-checked trust badge */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Profiles reviewed before going live · Look for the ID-checked badge</span>
            </div>
          </div>

          {/* Quiz prompt */}
          <div className="mt-3">
            <button
              onClick={() => {
                if (filteredCompanions.length > 0) {
                  router.push(`/companion/${filteredCompanions[0].id}`);
                }
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              <span>Not sure who to pick? Take the 60-second quiz</span>
              <span>→</span>
            </button>
          </div>

          {/* Horizontal Scrollable Activities Bar */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {ACTIVITIES.map((act) => {
              const Icon = act.icon;
              const isActive = selectedActivity === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => setSelectedActivity(act.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition duration-150 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search and Filters Toolbar */}
          <div className="mt-5 space-y-3 pt-4 border-t border-slate-100">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Name or activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Horizontal Scrollable Filter Chips Strip */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {/* Gender Segmented Control */}
              <div className="flex shrink-0 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                {(["Women", "Men", "All"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      genderFilter === g
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Time Filter Pill */}
              <button className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-slate-300">
                <span>Any time</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* Best Fit Sort Pill */}
              <button className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-slate-300">
                <span>Best fit</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* Available Now Toggle Pill */}
              <button className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Available now</span>
              </button>

              {/* View Mode Toggle (Grid / Map) */}
              <div className="flex shrink-0 rounded-full border border-slate-200 bg-white p-1 shadow-sm ml-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    viewMode === "map"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MapIcon className="h-3.5 w-3.5" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        {/* Pass Status Banner if unlocked */}
        {isUnlocked && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="font-bold">Active Member Pass Active:</span>
              <span>All portrait photos are unblurred. You can book direct meetups.</span>
            </div>
          </div>
        )}

        {filteredCompanions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCompanions.map((companion) => (
              <CompanionCard
                key={companion.id}
                companion={companion}
                isUnlocked={isUnlocked}
                onUnlockClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-base font-bold text-slate-800">No companions found</p>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your city filter or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCity("all");
                setSelectedActivity("all");
                setSearchQuery("");
              }}
              className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-black"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 1:1 Light Theme Unlock Bottom Sheet */}
      <PaywallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companionName={activeModalCompanion?.displayName}
        onUnlockedSuccess={() => {
          setIsUnlocked(true);
        }}
      />
    </div>
  );
}
