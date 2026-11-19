"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  Clock,
  Lock,
  MapPin,
  Calendar,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Compass,
  Sparkles,
} from "lucide-react";
import { BookingRecord } from "@/lib/bookings";

export default function MemberDashboardPage() {
  const [activeBookings, setActiveBookings] = useState<BookingRecord[]>([]);
  const [user, setUser] = useState<{
    id: string;
    email?: string | null;
    phone?: string | null;
    isUnlocked?: boolean;
    activePassTier?: string | null;
    passExpiresAt?: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    fetch("/api/bookings?role=MEMBER")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bookings) {
          setActiveBookings(data.bookings);
        }
      })
      .catch((err) => console.error("Error fetching member bookings:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Member Portal</span>
              </span>
              {user?.isUnlocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Pass Active</span>
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome to Companio
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Explore local companions, book neutral public meetups, and coordinate in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#101828] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:bg-black transition active:scale-95"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Directory</span>
            </Link>
            <Link
              href="/host/dashboard"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
            >
              Host Portal
            </Link>
          </div>
        </div>

        {/* Member Access Pass Overview Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Companio Access Pass Status
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>{user?.isUnlocked ? `${user.activePassTier || "Active"} Pass Unlocked` : "Free Explorer"}</span>
                {user?.isUnlocked ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <p className="text-xs text-slate-600">
                {user?.isUnlocked
                  ? `Valid until ${user.passExpiresAt ? new Date(user.passExpiresAt).toLocaleDateString() : "Active"}. All portraits unblurred.`
                  : "Pass required to unblur portraits and send direct meetup invitations."}
              </p>
            </div>

            {!user?.isUnlocked && (
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white font-bold px-6 py-2.5 text-xs sm:text-sm shadow-md hover:bg-blue-700 transition"
              >
                Unlock Pass from ₹99.50
              </Link>
            )}
          </div>
        </div>

        {/* Active Member Bookings List */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Your Bookings ({activeBookings.length})
          </h2>

          {activeBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">
                          {b.companionName}
                        </span>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                          {b.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {b.activityTitle} · {b.venueName}
                      </div>
                    </div>

                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{b.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{new Date(b.scheduledDate).toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{b.venueAddress}</span>
                    </span>
                  </div>

                  {/* Secret 4-Digit Handshake PIN Card */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                        <span>Handshake PIN (Share in person):</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Give this to your companion at the venue to verify arrival.
                      </p>
                    </div>

                    <div className="font-mono text-lg font-black tracking-widest text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                      {b.verificationPin}
                    </div>
                  </div>

                  {/* Action Link to In-App Chat */}
                  <div className="pt-2">
                    <Link
                      href={`/chat/${b.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#101828] text-white py-2.5 text-xs font-bold shadow-md hover:bg-black transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Open Real-Time Chat</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-3">
              <Clock className="mx-auto h-8 w-8 text-slate-400" />
              <p className="font-bold text-slate-800">No active bookings yet</p>
              <p className="text-xs max-w-sm mx-auto">
                Explore companions in Mumbai, Delhi NCR, Bengaluru, or Pune to plan your next coffee chat or city walk.
              </p>
              <div className="pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 text-white font-bold px-6 py-2.5 text-xs shadow-md hover:bg-blue-700 transition"
                >
                  <span>Browse Companions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
