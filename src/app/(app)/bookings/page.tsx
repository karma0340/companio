"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, MapPin, Calendar, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
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
    <div className="mx-auto max-w-4xl pb-16">
      <div className="flex flex-col justify-between gap-4 rounded-xl border-2 border-[#102A43] bg-[#FFF9E6] p-6 shadow-[4px_4px_0px_0px_#102A43] sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-[#102A43]">Session Bookings</h1>
          <p className="mt-1 text-xs text-[#627D98] font-bold">
            Track your escrow status, 12-hour response deadlines, and 4-digit verification PINs.
          </p>
        </div>
        <Link
          href="/app/dashboard"
          className="rounded-lg border-2 border-[#102A43] bg-[#E9FF70] px-4 py-2 text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
        >
          Book New Session
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["ALL", "PENDING_ACCEPTANCE", "CONFIRMED", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-lg border-2 border-[#102A43] px-3.5 py-1.5 text-xs font-black uppercase ${
              filter === tab
                ? "bg-[#70D6FF] text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
                : "bg-white text-[#627D98] hover:text-[#102A43]"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="mt-6 space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="rounded-xl border-2 border-[#102A43] bg-white p-8 text-center text-xs font-bold text-[#627D98]">
            No bookings found matching selected status.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border-2 border-[#102A43] bg-white p-5 shadow-[4px_4px_0px_0px_#102A43]"
            >
              <div className="flex flex-col justify-between gap-2 border-b-2 border-[#102A43] pb-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#102A43]">
                    #{b.bookingNumber} • {b.companionName}
                  </span>
                  <span className="rounded bg-yellow-100 border border-yellow-400 px-2 py-0.5 text-[10px] font-black text-yellow-800">
                    {b.status}
                  </span>
                </div>
                <div className="text-xs font-black text-[#102A43]">
                  Escrow Hold: ₹{b.totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-[#334E68]">
                <div>
                  <p className="font-bold">Activity: {b.activityTitle} ({b.durationHours} hr)</p>
                  <p className="mt-1">Scheduled: {new Date(b.scheduledDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-bold">Venue: {b.venueName}</p>
                  <p className="mt-1 text-[#627D98]">{b.venueAddress}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-[#102A43] flex items-center justify-between">
                <div className="text-xs font-black text-[#102A43]">
                  Secret PIN: <span className="rounded bg-[#E9FF70] px-2 py-0.5 border border-[#102A43]">{b.verificationPin}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/app/booking/${b.companionId}/success?bookingId=${b.id}`}
                    className="rounded-md border-2 border-[#102A43] bg-white px-3 py-1 text-xs font-bold text-[#102A43] hover:bg-[#F0EDE6]"
                  >
                    View Details
                  </Link>
                  {b.status === "CONFIRMED" && (
                    <Link
                      href={`/app/chat/${b.id}`}
                      className="rounded-md border-2 border-[#102A43] bg-[#70D6FF] px-3 py-1 text-xs font-black text-[#102A43]"
                    >
                      Chat
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
