"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ShieldCheck, MapPin, Clock, ArrowRight } from "lucide-react";
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
    <div className="mx-auto max-w-3xl pb-16">
      <div className="flex flex-col justify-between gap-4 rounded-xl border-2 border-[#102A43] bg-[#70D6FF] p-6 shadow-[4px_4px_0px_0px_#102A43] sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-white border border-[#102A43] px-2 py-0.5 text-xs font-black uppercase text-[#102A43]">
              SAFE MESSAGING
            </span>
            <ShieldCheck className="h-4 w-4 text-[#102A43]" />
          </div>
          <h1 className="mt-2 text-2xl font-black text-[#102A43]">
            Active Session Conversations
          </h1>
          <p className="mt-1 text-xs font-bold text-[#102A43]">
            Coordinate public venue meetups with verified companions under active contact shielding.
          </p>
        </div>

        <Link
          href="/app/dashboard"
          className="rounded-lg border-2 border-[#102A43] bg-white px-4 py-2 text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#F0EDE6]"
        >
          Book Companion
        </Link>
      </div>

      {/* Conversation List */}
      <div className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <div className="rounded-xl border-2 border-[#102A43] bg-white p-8 text-center text-xs font-bold text-[#627D98]">
            No active conversations. Book a companion to unlock safe coordination chat.
          </div>
        ) : (
          bookings.map((b) => (
            <Link
              key={b.id}
              href={`/app/chat/${b.id}`}
              className="group flex flex-col justify-between gap-4 rounded-xl border-2 border-[#102A43] bg-white p-5 shadow-[4px_4px_0px_0px_#102A43] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#102A43] sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-[#102A43]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.companionAvatar}
                    alt={b.companionName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-[#102A43]">
                      {b.companionName}
                    </h2>
                    <span className="rounded bg-yellow-100 border border-yellow-400 px-2 py-0.2 text-[10px] font-black text-yellow-800">
                      {b.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs font-bold text-[#486581]">
                    <MapPin className="h-3 w-3 text-[#102A43]" />
                    <span>{b.venueName}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3 text-[#102A43]" />
                    <span>{new Date(b.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#627D98]">
                    Click to open real-time coordination channel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="rounded-lg border-2 border-[#102A43] bg-[#E9FF70] px-4 py-2 text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] group-hover:bg-[#D4E856]">
                  Open Chat
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
