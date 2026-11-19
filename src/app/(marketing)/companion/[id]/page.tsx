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
  ShieldCheck,
  Languages,
  Clock,
  Heart,
  Lock,
} from "lucide-react";
import { MOCK_COMPANIONS } from "@/lib/data";
import { PaywallModal } from "@/components/marketing/PaywallModal";

export default function CompanionProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "c-qkk6qfv6");

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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
      router.push(`/booking/${companion.id}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const isPreviewProfile =
    Boolean(companion.isPreview) ||
    companion.id === "c-qkk6qfv6" ||
    companion.displayName.toLowerCase() === "kinjal";
  const canViewClear = isUnlocked || isPreviewProfile;

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-32 md:pb-20">
      {/* Top Navigation Bar */}
      <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to explore</span>
          </Link>

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
              aria-label="Share profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              aria-label="Bookmark companion"
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                bookmarked
                  ? "border-pink-300 bg-pink-50 text-pink-600"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-pink-600" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Portrait Photography & Quick Badges (5 cols on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:rounded-3xl bg-slate-100 border border-slate-200/80 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={canViewClear ? companion.avatarUrl : (companion.blurredAvatarUrl || companion.avatarUrl)}
                alt={canViewClear ? companion.displayName : "Companion profile"}
                className={`h-full w-full object-cover transition duration-300 ${
                  canViewClear ? "" : "blur-[2px] opacity-90"
                }`}
              />

              {/* Floating ID-checked badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                {isPreviewProfile && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-md"
                    style={{
                      background: "rgb(246, 238, 220)",
                      color: "rgb(138, 100, 24)",
                      boxShadow: "rgba(138, 100, 24, 0.18) 0px 0px 0px 1px inset",
                    }}
                  >
                    ★ Free preview
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-md border border-white/20">
                  <Check className="h-3 w-3 text-blue-400" />
                  ID-checked
                </span>
              </div>

              {/* Rate Tag on Photo */}
              <div className="absolute bottom-3.5 right-3.5 rounded-full bg-slate-900/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-md border border-white/10">
                ₹{companion.hourlyRate} / meetup
              </div>
            </div>

            {/* Quick Guarantees Pill Grid under photo */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 p-3 text-slate-700 shadow-2xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Aadhaar verified</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200/80 p-3 text-slate-700 shadow-2xs">
                <Heart className="h-4 w-4 text-pink-600 shrink-0" />
                <span className="font-medium">Strictly platonic</span>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Details, Vibe, Bio, Activities, and Action Card (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Information */}
            <div className="rounded-2xl md:rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {canViewClear ? companion.displayName : companion.maskedName}
                  </h1>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Bandra West · {companion.city}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    ₹{companion.hourlyRate}
                  </span>
                  <span className="text-xs text-slate-500 font-medium block">paid per meetup</span>
                </div>
              </div>

              {/* Trust Box */}
              <div className="mt-6 rounded-2xl bg-blue-50/60 border border-blue-200/60 p-4 text-xs sm:text-sm leading-relaxed text-slate-700">
                <strong className="font-bold text-slate-900">Protected by Companio:</strong> If your
                meetup request is declined or not accepted within the 12-hour SLA, your full booking
                fee returns immediately to your balance, with zero deductions.
              </div>

              {/* Bio Section */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  About {companion.displayName}
                </h3>
                {canViewClear ? (
                  <p className="text-base text-slate-800 leading-relaxed font-normal">
                    {companion.bio}
                  </p>
                ) : (
                  <div className="relative">
                    <p className="text-base text-transparent [text-shadow:0_0_8px_rgba(20,26,46,0.6)] select-none opacity-80 leading-relaxed">
                      Lover of quiet specialty coffee bars, indie gig nights, and long evening walks
                      around old town lanes. Enjoys meeting fellow travellers and curious city dwellers.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Full bio and candid hobbies reserved for members with an Access Pass.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Languages Spoken */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                <Languages className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-900">Languages:</span>
                <span>{companion.spokenLanguages?.join(" · ") || "English · Hindi"}</span>
              </div>

              {/* Accepted Activities */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Accepted meetup activities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {companion.acceptedActivities.map((act) => (
                    <span
                      key={act}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-800 border border-slate-200/60"
                    >
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span>{act}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Chat Coordination Notice */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
                <MessageCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Private in-app chat with {companion.displayName} unlocks automatically as soon as
                  they accept your request.
                </span>
              </div>

              {/* Desktop Booking Action Button */}
              <div className="mt-8 hidden sm:block">
                <button
                  onClick={handleActionClick}
                  className="w-full h-13 py-3.5 px-8 rounded-full font-bold text-base bg-[#101828] text-white shadow-xl hover:bg-black transition active:scale-98 flex items-center justify-center text-center gap-2"
                >
                  {isUnlocked ? (
                    <>
                      <span>Request Meetup with {companion.displayName}</span>
                      <span>&rarr;</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Unlock Pass to Book (from ₹99.50)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg">
        <div className="mx-auto flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-900">{companion.displayName}</div>
            <div className="text-xs text-slate-500 font-medium">₹{companion.hourlyRate} / meetup</div>
          </div>

          <button
            onClick={handleActionClick}
            className="rounded-full bg-[#101828] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95 flex items-center gap-1.5"
          >
            {isUnlocked ? (
              <span>Request Meetup</span>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>Unlock pass</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Access Pass Bottom Sheet / Modal */}
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
