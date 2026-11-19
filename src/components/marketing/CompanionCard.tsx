"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Star, MapPin, Check, Languages, ArrowRight } from "lucide-react";
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
    <article
      onClick={() => {
        if (canViewClear) {
          router.push(`/companion/${companion.id}`);
        } else {
          onUnlockClick(companion);
        }
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 transition duration-200 hover:shadow-lg hover:border-slate-300 cursor-pointer text-slate-900"
    >
      <div>
        {/* Photo Container with Dual Badges */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={canViewClear ? companion.avatarUrl : (companion.blurredAvatarUrl || companion.avatarUrl)}
            alt={canViewClear ? companion.displayName : "Companion profile"}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              canViewClear ? "" : "blur-[2px] opacity-90"
            }`}
          />

          {/* Bottom Gradient Vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(20, 18, 42, 0.88) 0%, rgba(20, 18, 42, 0.45) 45%, rgba(20, 18, 42, 0) 100%)",
            }}
          />

          {/* Top Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            {isPreview && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm"
                style={{
                  background: "rgb(246, 238, 220)",
                  color: "rgb(138, 100, 24)",
                  boxShadow: "rgba(138, 100, 24, 0.18) 0px 0px 0px 1px inset",
                }}
              >
                 Free preview
              </span>
            )}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white shadow-sm"
              style={{
                background: "rgba(20, 26, 46, 0.62)",
                border: "1px solid rgba(255, 255, 255, 0.28)",
              }}
            >
              <Check className="h-2.5 w-2.5 text-blue-400" />
              ID-checked
            </span>
          </div>

          {/* Rate Badge on Bottom Right of Photo */}
          <div className="absolute bottom-2.5 right-2.5 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm shadow-sm z-10">
            ₹{companion.hourlyRate}/meetup
          </div>

          {/* Name & Location Overlay at Bottom of Photo */}
          <div className="absolute inset-x-0 bottom-0 p-3 text-left z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 text-white font-bold text-base [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
              <span>{canViewClear ? companion.displayName : companion.maskedName}</span>
              {!canViewClear && (
                <span
                  aria-hidden="true"
                  className="inline-block rounded-full bg-white/30 h-2.5 w-10 ml-1"
                />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]">
              <MapPin className="h-3 w-3 text-white/80" />
              <span>{companion.city}</span>
            </div>
          </div>
        </div>

        {/* Bio / Masked Bio */}
        <div className="mt-3">
          {canViewClear ? (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {companion.bio}
            </p>
          ) : (
            <p
              aria-hidden="true"
              className="text-xs leading-relaxed line-clamp-2 text-transparent [text-shadow:0_0_7px_rgba(20,26,46,0.6)] select-none opacity-75"
            >
              Bio and personal vibe details are reserved for members with an active Companio Pass.
            </p>
          )}
        </div>

        {/* Spoken Languages */}
        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <Languages className="h-3 w-3 text-blue-600 shrink-0" />
          <span className="truncate">{companion.spokenLanguages?.join(" · ") || "English · Hindi"}</span>
        </div>

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
          {companion.acceptedActivities.length > 2 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              +{companion.acceptedActivities.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {canViewClear ? (
          <Link
            href={`/companion/${companion.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95"
          >
            <span>View profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnlockClick(companion);
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#101828] py-2.5 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Unlock profile</span>
          </button>
        )}
      </div>
    </article>
  );
}
