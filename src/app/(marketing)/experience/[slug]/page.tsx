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
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug: slug,
    description: "Experience the city with a verified companion.",
    suggestedDuration: 1,
    icon: "coffee",
  };

  const companionsForActivity = MOCK_COMPANIONS.filter((c) =>
    c.acceptedActivities.some((act) => act.toLowerCase().includes(slug.replace("-", " ").toLowerCase()))
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
      router.push(`/app/booking/${comp.id}`);
    } else {
      setSelectedCompanion(comp);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93] hover:text-white mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to explore</span>
      </Link>

      <div className="border-b border-[#262626] pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
          <Clock className="h-3.5 w-3.5" />
          <span>Curated Experience • Suggested Duration: {activity.suggestedDuration}h</span>
        </div>

        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          {activity.title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-[#A1A1A6] sm:text-base leading-relaxed">
          {activity.description}
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
              <span>Unlock {activity.title} Hosts (From ₹99.50)</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Public Venues Only • Escrow Safe</span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-white mb-6">
          Companions for {activity.title}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
