"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  MapPin,
  Coffee,
  MessageCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { MOCK_COMPANIONS } from "@/lib/data";
import { PaywallModal } from "@/components/marketing/PaywallModal";

export default function CompanionProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "c-qkk6qfv6");

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const companion = useMemo(() => {
    return (
      MOCK_COMPANIONS.find((c) => c.id === id) ||
      MOCK_COMPANIONS.find((c) => c.displayName.toLowerCase() === "kinjal") ||
      MOCK_COMPANIONS[0]
    );
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

  const handleActionClick = () => {
    if (isUnlocked) {
      router.push(`/app/booking/${companion.id}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const isPreviewProfile = Boolean(companion.isPreview) || companion.id === "c-qkk6qfv6" || companion.displayName.toLowerCase() === "kinjal";
  const canViewClear = isUnlocked || isPreviewProfile;

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28">
      {/* Container */}
      <div className="mx-auto max-w-xl px-4 py-4 sm:py-6">
        {/* Back Link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-4 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Explore</span>
        </Link>

        {/* Profile Card (Image 4 Parity) */}
        <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm p-4 sm:p-5">
          {/* Portrait Photo Container */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={canViewClear ? companion.avatarUrl : (companion.blurredAvatarUrl || companion.avatarUrl)}
              alt={companion.displayName}
              className={`h-full w-full object-cover transition duration-300 ${
                canViewClear ? "" : "blur-[2px] opacity-90"
              }`}
            />
          </div>

          {/* Header Row: Name & Share/Bookmark */}
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {companion.displayName}
            </h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: companion.displayName, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ID-checked Badge */}
          <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600">
            <Check className="h-3.5 w-3.5 rounded-full bg-blue-100 p-0.5" />
            <span>ID-checked</span>
          </div>

          {/* Protected by Companio Trust Box */}
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs leading-relaxed text-slate-600">
            <span className="font-bold text-slate-800">Protected by Companio:</span> If your
            request is declined or not accepted in time, the full amount comes back to your
            wallet, or to your card or UPI minus a 12% fee.
          </div>

          {/* Location & Activity Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>Bandra West, {companion.city}</span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              <Coffee className="h-3.5 w-3.5 text-slate-500" />
              <span>Café Chat</span>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4 text-sm leading-relaxed text-slate-700">
            {companion.bio}
          </div>

          {/* Chat Note */}
          <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 border-t border-slate-100 pt-4">
            <MessageCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Chat with {companion.displayName} opens once they accept your meetup request.
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Image 4 Parity) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-900">{companion.displayName}</div>
            <div className="text-xs text-slate-500 font-medium">Paid per meetup</div>
          </div>

          <button
            onClick={handleActionClick}
            className="rounded-xl bg-[#101828] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-black transition active:scale-95"
          >
            {isUnlocked ? "Request Meetup" : "Unlock pass"}
          </button>
        </div>
      </div>

      {/* Bottom Sheet Unlock Modal */}
      <PaywallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companionName={companion.displayName}
        onUnlockedSuccess={() => {
          setIsUnlocked(true);
        }}
      />
    </div>
  );
}
