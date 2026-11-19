"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ShieldCheck, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import { BookingRecord } from "@/lib/bookings";

export default function ChatIndexPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bookings) {
          setBookings(data.bookings);
        }
      })
      .catch((err) => console.error("Error fetching bookings for chat index:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Banner */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Shielded In-App Messaging</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Active Meetup Conversations
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Coordinate public venue meetups with verified companions under active contact shielding.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#101828] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:bg-black transition active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Explore Companions</span>
          </Link>
        </div>

        {/* Conversation List */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-3">
              <MessageSquare className="mx-auto h-8 w-8 text-slate-400" />
              <p className="font-bold text-slate-800">No active conversations</p>
              <p className="text-xs max-w-sm mx-auto">
                Once a companion accepts your booking request, a private real-time chat unlocks here.
              </p>
              <div className="pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 text-white font-bold px-6 py-2.5 text-xs shadow-md hover:bg-blue-700 transition"
                >
                  <span>Book a Companion</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/chat/${b.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.companionAvatar}
                        alt={b.companionName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {b.companionName}
                        </h2>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                          {b.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{b.venueName}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{new Date(b.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Click to open real-time coordination channel
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#101828] text-white px-4 py-2 text-xs font-bold shadow-sm group-hover:bg-black transition">
                      <span>Open Chat</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
