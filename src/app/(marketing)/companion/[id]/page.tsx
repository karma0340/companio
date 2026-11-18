"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Lock,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Globe,
  Coffee,
  HeartHandshake,
} from "lucide-react";
import { MOCK_COMPANIONS } from "@/lib/data";
import { PaywallModal } from "@/components/marketing/PaywallModal";
import { CompanionSummary } from "@/types";

export default function CompanionProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "comp_01");

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const companion = useMemo(() => {
    return MOCK_COMPANIONS.find((c) => c.id === id) || MOCK_COMPANIONS[0];
  }, [id]);

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

  const handleBookingClick = () => {
    if (isUnlocked) {
      router.push(`/app/booking/${companion.id}`);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Back to Explore Breadcrumb */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93] hover:text-white mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to explore directory</span>
      </Link>

      <div className="grid gap-10 md:grid-cols-12">
        {/* Left Column: Portrait & Quick Stats (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[#2B2B2B] bg-[#141414] shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={companion.avatarUrl}
              alt={companion.displayName}
              className={`h-full w-full object-cover transition duration-300 ${
                isUnlocked ? "" : "blur-lg scale-105 opacity-85"
              }`}
            />

            {/* Hourly Rate Overlay */}
            <div className="absolute top-4 left-4 rounded-full border border-black/40 bg-black/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              ₹{companion.hourlyRate}/hour
            </div>

            {/* Lock Overlay if locked */}
            {!isUnlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-6 text-center backdrop-blur-[2px]">
                <div className="rounded-full bg-[#1A1A1A]/90 p-4 border border-[#333] shadow-lg mb-3">
                  <Lock className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">
                  Photo Masked for Privacy
                </h4>
                <p className="mt-1 text-xs text-[#A1A1A6] max-w-xs">
                  Unlock Companio Club to view high-resolution portraits and send direct booking requests.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 rounded-full bg-[#D4AF37] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5C158] transition shadow-md"
                >
                  Unlock Profile (From ₹99.50)
                </button>
              </div>
            )}
          </div>

          {/* Verification Pillars Card */}
          <div className="rounded-xl border border-[#262626] bg-[#121212] p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Sovereign Identity Verification
            </h4>
            <div className="space-y-2 text-xs text-[#A1A1A6]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Government Aadhaar & PAN verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Live facial recognition liveness checked</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Funds held in escrow until 4-digit start PIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details & Booking Action (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% ID Verified</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8E8E93]">
                <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>{companion.city}</span>
              </span>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
              {isUnlocked ? companion.name : companion.maskedName}
            </h1>

            {/* Rating Stars */}
            <div className="mt-2 flex items-center gap-2 text-sm text-[#D4AF37]">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#D4AF37]" />
                <span className="font-bold">{companion.ratingAverage}</span>
              </div>
              <span className="text-[#666]">•</span>
              <span className="text-xs text-[#8E8E93]">
                {companion.totalReviews} verified public sessions
              </span>
            </div>
          </div>

          {/* About / Bio */}
          <div className="rounded-xl border border-[#262626] bg-[#121212] p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-white">
              About {companion.displayName}
            </h3>
            <p className="text-sm leading-relaxed text-[#A1A1A6]">
              {companion.bio}
            </p>
          </div>

          {/* Spoken Languages & Accepted Activities */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#262626] bg-[#121212] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                <Globe className="h-4 w-4" />
                <span>Languages</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {companion.spokenLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full bg-[#1A1A1A] border border-[#2B2B2B] px-3 py-1 text-xs font-medium text-white"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#262626] bg-[#121212] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                <Coffee className="h-4 w-4" />
                <span>Accepted Activities</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {companion.acceptedActivities.map((act) => (
                  <span
                    key={act}
                    className="rounded-full bg-[#1A1A1A] border border-[#2B2B2B] px-3 py-1 text-xs font-medium text-[#E5E5E7]"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Transparent Escrow Pricing Box */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="text-sm font-bold text-white">Standard 1-Hour Session</div>
              <div className="font-serif text-xl font-black text-[#D4AF37]">₹{companion.hourlyRate}</div>
            </div>
            <div className="space-y-1.5 text-xs text-[#8E8E93]">
              <div className="flex justify-between">
                <span>Base companion compensation</span>
                <span>₹{companion.hourlyRate}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow platform protection & 24/7 SOS (35%)</span>
                <span>₹{Math.round(companion.hourlyRate * 0.35)}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable GST (18%)</span>
                <span>₹{Math.round(companion.hourlyRate * 0.35 * 0.18)}.00</span>
              </div>
              <div className="flex justify-between border-t border-[#262626] pt-2 font-bold text-white">
                <span>Total Escrow Deposit</span>
                <span className="text-[#D4AF37]">
                  ₹{companion.hourlyRate + Math.round(companion.hourlyRate * 0.35 * 1.18)}.00
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={handleBookingClick}
              className="w-full rounded-full bg-[#D4AF37] py-4 text-center text-sm font-extrabold text-black transition hover:bg-[#E5C158] shadow-lg shadow-[#D4AF37]/20"
            >
              {isUnlocked
                ? `Book Session with ${companion.displayName} →`
                : "Unlock Profile to Book (From ₹99.50)"}
            </button>
            <p className="text-center text-[11px] text-[#666]">
              All meetups take place strictly in verified public commercial venues. Zero dating solicitation tolerated.
            </p>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companionName={companion.displayName}
        onUnlockedSuccess={() => {
          setIsUnlocked(true);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
