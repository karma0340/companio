"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
  MapPin,
  Calendar,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { BookingRecord } from "@/lib/bookings";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 11,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    fetch(`/api/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.booking) {
          setBooking(data.booking);
        }
      })
      .catch((err) => console.error("Error fetching booking:", err))
      .finally(() => setLoading(false));
  }, [bookingId]);

  // 12-hour SLA countdown timer
  useEffect(() => {
    if (!booking?.hostAcceptanceDeadline) return;

    const interval = setInterval(() => {
      const deadline = new Date(booking.hostAcceptanceDeadline).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, deadline - now);

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [booking?.hostAcceptanceDeadline]);

  const pinDigits = (booking?.verificationPin || "7492").split("");

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Success Badge */}
      <div className="rounded-xl border-2 border-[#102A43] bg-[#E9FF70] p-6 text-center shadow-[4px_4px_0px_0px_#102A43]">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#102A43]" />
        <span className="mt-2 inline-block rounded border border-[#102A43] bg-white px-2 py-0.5 text-xs font-black uppercase text-[#102A43]">
          ESCROW SECURED
        </span>
        <h1 className="mt-2 text-2xl font-black text-[#102A43]">
          Booking Request Dispatched!
        </h1>
        <p className="mt-1 text-xs font-bold text-[#102A43]">
          Order #{booking?.bookingNumber || "CMP-2026-8941"} is now pending companion acceptance.
        </p>
      </div>

      {/* 4-Digit Secret PIN Card */}
      <div className="mt-6 rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
        <div className="flex items-center justify-between border-b-2 border-[#102A43] pb-3">
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-[#102A43]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#102A43]">
              Your Secret 4-Digit Handshake PIN
            </h2>
          </div>
          <span className="rounded bg-[#FF7AC6] border border-[#102A43] px-2 py-0.5 text-[10px] font-black text-[#102A43]">
            CRITICAL SAFETY CODE
          </span>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          {pinDigits.map((digit, idx) => (
            <div
              key={idx}
              className="flex h-16 w-14 items-center justify-center rounded-xl border-2 border-[#102A43] bg-[#70D6FF] text-3xl font-black text-[#102A43] shadow-[3px_3px_0px_0px_#102A43]"
            >
              {digit}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-[#102A43] bg-[#FFF9E6] p-4 text-xs text-[#334E68]">
          <p className="font-black text-[#102A43]">Important Meeting Protocol:</p>
          <ul className="mt-1 list-disc list-inside space-y-1 text-[11px] font-medium">
            <li>Never disclose this PIN over chat, phone, or messaging apps.</li>
            <li>Give this 4-digit code to {booking?.companionName || "your companion"} ONLY in person once you sit down together at the venue.</li>
            <li>Their entry of this PIN starts the session timer and validates that both parties arrived safely.</li>
          </ul>
        </div>
      </div>

      {/* 12-Hour SLA Countdown Card */}
      <div className="mt-6 rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#102A43]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#102A43]">
              12-Hour Companion Acceptance SLA
            </h2>
          </div>
          <span className="rounded bg-yellow-100 border border-yellow-400 px-2 py-0.5 text-[10px] font-black text-yellow-800">
            AUTO-REFUND TIMER
          </span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-center">
          <div className="rounded-lg border-2 border-[#102A43] bg-[#FFFDF9] px-4 py-2">
            <div className="text-2xl font-black text-[#102A43]">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <span className="text-[10px] font-bold uppercase text-[#627D98]">Hours</span>
          </div>
          <span className="text-2xl font-black text-[#102A43]">:</span>
          <div className="rounded-lg border-2 border-[#102A43] bg-[#FFFDF9] px-4 py-2">
            <div className="text-2xl font-black text-[#102A43]">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <span className="text-[10px] font-bold uppercase text-[#627D98]">Mins</span>
          </div>
          <span className="text-2xl font-black text-[#102A43]">:</span>
          <div className="rounded-lg border-2 border-[#102A43] bg-[#FFFDF9] px-4 py-2">
            <div className="text-2xl font-black text-[#102A43]">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <span className="text-[10px] font-bold uppercase text-[#627D98]">Secs</span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#627D98]">
          {booking?.companionName || "The companion"} has 12 hours to accept your request. If they decline or the timer expires, 100% of your ₹{booking?.totalAmount.toFixed(2) || "706.00"} escrow hold is immediately returned to your original payment method.
        </p>
      </div>

      {/* Meeting Details Summary Card */}
      <div className="mt-6 rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
        <h2 className="text-xs font-black uppercase tracking-wider text-[#102A43] mb-4">
          Session Summary
        </h2>
        <div className="space-y-3 text-xs font-bold text-[#334E68]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#102A43] flex-shrink-0" />
            <span>
              <strong>Venue:</strong> {booking?.venueName || "Blue Tokai Coffee"}, {booking?.venueAddress || "Hauz Khas Village"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#102A43] flex-shrink-0" />
            <span>
              <strong>Scheduled Time:</strong> {booking?.scheduledDate ? new Date(booking.scheduledDate).toLocaleString() : "Tomorrow, 04:00 PM"} ({booking?.durationHours || 1} Hour)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>
              <strong>Escrow Hold:</strong> ₹{booking?.totalAmount.toFixed(2) || "706.00"} (Host Payout: ₹{booking?.companionFee.toFixed(2) || "499.00"})
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/app/host/dashboard`}
          className="flex-1 rounded-xl border-2 border-[#102A43] bg-[#70D6FF] py-3 text-center text-xs font-black uppercase text-[#102A43] shadow-[3px_3px_0px_0px_#102A43] hover:bg-[#5BC5F2]"
        >
          View in Host Dashboard (Simulation)
        </Link>
        <Link
          href="/app/dashboard"
          className="flex-1 rounded-xl border-2 border-[#102A43] bg-white py-3 text-center text-xs font-black uppercase text-[#102A43] shadow-[3px_3px_0px_0px_#102A43] hover:bg-[#F0EDE6]"
        >
          Return to Member Dashboard
        </Link>
      </div>
    </div>
  );
}
