"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Star, ShieldCheck, MapPin, Check } from "lucide-react";
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
  const router = useRouter();
  const isPreview = Boolean(companion.isPreview);
  const canViewClear = isUnlocked || isPreview;

  return (
    <div
      onClick={() => router.push(`/companion/${companion.id}`)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 transition duration-200 hover:shadow-lg hover:border-slate-300 cursor-pointer text-slate-900"
    >
      <div>
        {/* Photo Container with Dual Badges */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={canViewClear ? companion.avatarUrl : (companion.blurredAvatarUrl || companion.avatarUrl)}
            alt={companion.displayName}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
              canViewClear ? "" : "blur-[2px] opacity-90"
            }`}
          />

          {/* Top Floating Badges (Image 3 Parity) */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {isPreview && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-white px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm">
                ★ Free preview
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 text-white px-2 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm">
              <Check className="h-2.5 w-2.5 text-blue-400" />
              ID-checked
            </span>
          </div>

          {/* Rate Badge on Bottom Right of Photo */}
          <div className="absolute bottom-2.5 right-2.5 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm shadow-sm">
            ₹{companion.hourlyRate}/meetup
          </div>
        </div>

        {/* Name and Rating */}
        <div className="mt-3 flex items-center justify-between">
          <Link
            href={`/companion/${companion.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition"
          >
            {companion.displayName}
          </Link>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{companion.ratingAverage}</span>
            <span className="text-slate-400 text-[11px]">({companion.totalReviews})</span>
          </div>
        </div>

        {/* City / Location */}
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3 w-3 text-slate-400" />
          <span>{companion.city}</span>
        </div>

        {/* Bio */}
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {companion.bio}
        </p>

        {/* Activity Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {companion.acceptedActivities.slice(0, 2).map((act) => (
            <span
              key={act}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {act}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">
          {isUnlocked ? "Ready to book" : "Pass required"}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnlockClick(companion);
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
            isUnlocked
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-900 text-white hover:bg-black"
          }`}
        >
          {isUnlocked ? "Request Meetup" : "Unlock Profile"}
        </button>
      </div>
    </div>
  );
}
