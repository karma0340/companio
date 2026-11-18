"use client";

import React from "react";
import Link from "next/link";
import { Lock, Star, ShieldCheck, MapPin } from "lucide-react";
import { CompanionSummary } from "@/types";

interface CompanionCardProps {
  companion: CompanionSummary;
  isUnlocked?: boolean;
  onUnlockClick: (companion: CompanionSummary) => void;
}

export function CompanionCard({
  companion,
  isUnlocked = false,
  onUnlockClick,
}: CompanionCardProps) {
  return (
    <div
      onClick={() => onUnlockClick(companion)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#262626] bg-[#121212] p-4 transition hover:border-[#D4AF37]/50 hover:bg-[#161616] cursor-pointer"
    >
      <div>
        {/* Photo Container with Blur Filter */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#080808]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={companion.avatarUrl}
            alt={companion.displayName}
            className={`h-full w-full object-cover transition duration-300 ${
              isUnlocked ? "" : "blur-md scale-105 opacity-80"
            }`}
          />

          {/* Rate Badge */}
          <div className="absolute top-2.5 left-2.5 rounded-full border border-black/40 bg-black/70 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
            ₹{companion.hourlyRate}/hr
          </div>

          {/* Locked Badge Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-4 text-center">
              <div className="rounded-full bg-[#1A1A1A]/90 p-2.5 border border-[#333] shadow-md group-hover:scale-110 transition">
                <Lock className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <span className="mt-2 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                Unlock Profile
              </span>
            </div>
          )}
        </div>

        {/* Name and Rating */}
        <div className="mt-3 flex items-center justify-between">
          <Link
            href={`/companion/${companion.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-serif text-base font-bold text-white hover:text-[#D4AF37] transition hover:underline"
          >
            {isUnlocked ? companion.name : companion.maskedName}
          </Link>
          <div className="flex items-center gap-1 text-xs font-bold text-[#D4AF37]">
            <Star className="h-3.5 w-3.5 fill-[#D4AF37]" />
            <span>{companion.ratingAverage}</span>
            <span className="text-[#666]">({companion.totalReviews})</span>
          </div>
        </div>

        {/* City & Verification */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8E8E93]">
          <MapPin className="h-3 w-3 text-[#D4AF37]" />
          <span>{companion.city}</span>
          <span>•</span>
          <ShieldCheck className="h-3 w-3 text-green-500" />
          <span className="text-green-500">ID Verified</span>
        </div>

        {/* Short Bio */}
        <p className="mt-2 text-xs text-[#A1A1A6] line-clamp-2 leading-relaxed">
          {companion.shortBio}
        </p>

        {/* Accepted Activities */}
        <div className="mt-3 flex flex-wrap gap-1">
          {companion.acceptedActivities.slice(0, 2).map((act) => (
            <span
              key={act}
              className="rounded-full bg-[#1A1A1A] border border-[#2B2B2B] px-2 py-0.5 text-[10px] text-[#A1A1A6]"
            >
              {act}
            </span>
          ))}
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-4 border-t border-[#222] pt-3">
        <button className="w-full rounded-full bg-[#1A1A1A] border border-[#333] py-2 text-center text-xs font-bold text-white transition hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37]">
          {isUnlocked ? "Book Session" : "Unlock Profile (From ₹99.50)"}
        </button>
      </div>
    </div>
  );
}
