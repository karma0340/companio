"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Star, Clock, Lock, MapPin, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import { MOCK_COMPANIONS } from "@/lib/data";
import { BookingRecord } from "@/lib/bookings";

export default function AppDashboardPage() {
  const [activeBookings, setActiveBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
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
    <div className="space-y-6 sm:space-y-8 pb-24 md:pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border-2 border-[#102A43] bg-[#70D6FF] p-6 shadow-[4px_4px_0px_0px_#102A43] sm:flex-row sm:items-center">
        <div>
          <span className="rounded bg-white border border-[#102A43] px-2 py-0.5 text-xs font-black uppercase text-[#102A43]">
            MEMBER PORTAL
          </span>
          <h1 className="mt-2 text-2xl font-black text-[#102A43]">
            Verified Companion Directory
          </h1>
          <p className="mt-1 text-xs font-bold text-[#102A43]">
            Select a verified companion, book a public venue, and coordinate via real-time chat.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/app/host/dashboard"
            className="rounded-lg border-2 border-[#102A43] bg-[#E9FF70] px-4 py-2 text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#D4E856]"
          >
            Switch to Host Dashboard
          </Link>
        </div>
      </div>

      {/* Active Member Bookings Callout (if any exist) */}
      {activeBookings.length > 0 && (
        <div className="rounded-xl border-2 border-[#102A43] bg-[#FFF9E6] p-5 shadow-[4px_4px_0px_0px_#102A43]">
          <div className="flex items-center justify-between border-b-2 border-[#102A43] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#102A43]" />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#102A43]">
                Your Active Bookings ({activeBookings.length})
              </h2>
            </div>
            <span className="rounded bg-[#FF7AC6] border border-[#102A43] px-2 py-0.5 text-[10px] font-black uppercase text-[#102A43]">
              ESCROW LOCKED
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col justify-between gap-3 rounded-lg border-2 border-[#102A43] bg-white p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#102A43]">
                      #{b.bookingNumber} • {b.companionName}
                    </span>
                    <span className="rounded bg-yellow-100 border border-yellow-400 px-2 py-0.2 text-[10px] font-bold text-yellow-800">
                      {b.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[#486581]">
                    {b.venueName} • Scheduled: {new Date(b.scheduledDate).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/app/session/${b.id}`}
                    className="rounded-md border-2 border-[#102A43] bg-[#70D6FF] px-3 py-1.5 text-xs font-black text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#5BC5F2]"
                  >
                    Session & PIN: {b.verificationPin}
                  </Link>
                  {b.status === "CONFIRMED" && (
                    <Link
                      href={`/app/chat/${b.id}`}
                      className="rounded-md border-2 border-[#102A43] bg-[#E9FF70] px-3 py-1.5 text-xs font-black text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
                    >
                      Open Chat
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Companion Cards Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {MOCK_COMPANIONS.map((comp) => (
          <div
            key={comp.id}
            className="flex flex-col justify-between rounded-xl border-2 border-[#102A43] bg-white p-5 shadow-[4px_4px_0px_0px_#102A43]"
          >
            <div>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-[#102A43]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={comp.avatarUrl}
                  alt={comp.displayName}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full border border-[#102A43] bg-[#E9FF70] px-2.5 py-0.5 text-[10px] font-black text-[#102A43]">
                  ₹{comp.hourlyRate}/hr
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-base font-black text-[#102A43]">
                  {comp.name}
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-[#102A43]">
                  <Star className="h-3.5 w-3.5 fill-[#FFD670] text-[#102A43]" />
                  <span>{comp.ratingAverage}</span>
                  <span className="text-gray-400">({comp.totalReviews})</span>
                </div>
              </div>

              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#486581]">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span>{comp.city} • Verified</span>
              </div>

              <p className="mt-2.5 text-xs text-[#334E68] line-clamp-2">
                {comp.shortBio}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {comp.acceptedActivities.slice(0, 2).map((act) => (
                  <span
                    key={act}
                    className="rounded bg-[#F0F4F8] border border-[#CBD2D9] px-2 py-0.5 text-[10px] font-semibold text-[#102A43]"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-4">
              <Link
                href={`/app/booking/${comp.id}`}
                className="block w-full rounded-lg border-2 border-[#102A43] bg-[#FF7AC6] py-2.5 text-center text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                Book Session (From ₹706)
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
