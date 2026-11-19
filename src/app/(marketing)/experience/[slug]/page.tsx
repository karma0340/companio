"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_ACTIVITIES, MOCK_COMPANIONS } from "@/lib/data";
import { CompanionCard } from "@/components/marketing/CompanionCard";
import { PaywallModal } from "@/components/marketing/PaywallModal";
import { CompanionSummary } from "@/types";
import { ArrowLeft, Clock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function ExperiencePage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || "coffee").toLowerCase();

  const activity = MOCK_ACTIVITIES.find((a) => a.slug === slug) || {
    id: "unknown",
    title: slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " "),
    slug: slug,
    description: "Experience the city with a verified local companion.",
    suggestedDuration: 1,
    icon: "coffee",
  };

  const companionsForActivity = MOCK_COMPANIONS.filter((c) =>
    c.acceptedActivities.some((act) =>
      act.toLowerCase().includes(slug.replace("-", " ").toLowerCase())
    )
  );

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
        {/* Back link */}
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
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span>Curated Activity · {activity.suggestedDuration}h typical meetup</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {activity.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {activity.description}
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
                <span>Unlock all {activity.title} hosts (from ₹99.50)</span>
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Public venues only · 100% Escrow protected</span>
            </div>
          </div>
        </div>

        {/* Companions for Activity Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Hosts offering {activity.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {companionsForActivity.length > 0
                  ? `${companionsForActivity.length} verified companions available`
                  : "Featured companions ready to meet"}
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {isUnlocked ? "Full profiles unlocked" : "ID-checked badges active"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(companionsForActivity.length > 0 ? companionsForActivity : MOCK_COMPANIONS).map((comp) => (
              <CompanionCard
                key={comp.id}
                companion={comp}
                isUnlocked={isUnlocked}
                onUnlockClick={handleCardClick}
              />
            ))}
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
