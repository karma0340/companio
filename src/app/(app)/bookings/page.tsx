"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, MapPin, Calendar, MessageSquare, ShieldCheck, ArrowRight, Sparkles, KeyRound } from "lucide-react";
import { BookingRecord } from "@/lib/bookings";

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bookings) {
          setBookings(data.bookings);
        }
      })
      .catch((err) => console.error("Error fetching bookings:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Banner */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Escrow-Protected Meetups</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Your Bookings
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Track your escrow status, 12-hour response deadlines, and 4-digit verification PINs.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#101828] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:bg-black transition active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Book New Session</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "PENDING_ACCEPTANCE", "CONFIRMED", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === tab
                  ? "bg-[#101828] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-3">
              <Clock className="mx-auto h-8 w-8 text-slate-400" />
              <p className="font-bold text-slate-800">No bookings found</p>
              <p className="text-xs max-w-sm mx-auto">
                No bookings match the selected filter. Explore companions to book your next meetup.
              </p>
              <div className="pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 text-white font-bold px-6 py-2.5 text-xs shadow-md hover:bg-blue-700 transition"
                >
                  <span>Explore Companions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      #{b.bookingNumber} · {b.companionName}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Escrow Hold: ₹{b.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Activity: {b.activityTitle} ({b.durationHours} hr)
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(b.scheduledDate).toLocaleString()}</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{b.venueName}</span>
                    </p>
                    <p className="mt-1 text-slate-500">{b.venueAddress}</p>
                  </div>
                </div>

                {/* Handshake PIN info */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <KeyRound className="h-4 w-4 text-blue-600" />
                    <span className="text-slate-600 font-medium">In-Person Handshake PIN:</span>
                    <span className="font-mono font-bold text-slate-900">{b.verificationPin}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/chat/${b.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat</span>
                    </Link>
                    <Link
                      href={`/session/${b.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#101828] text-white px-3.5 py-1 text-xs font-bold shadow-2xs hover:bg-black transition"
                    >
                      <span>Live Session</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
