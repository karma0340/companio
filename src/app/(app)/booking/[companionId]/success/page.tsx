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
  Copy,
  Check,
} from "lucide-react";
import { BookingRecord } from "@/lib/bookings";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
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

  const pin = booking?.verificationPin || "7492";
  const pinDigits = pin.split("");

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-6 px-4 sm:px-6">
      <div className="mx-auto max-w-xl space-y-5">
        {/* Success Header Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
            Escrow Secured
          </span>
          <h1 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Meetup Request Dispatched!
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Booking #{booking?.bookingNumber || "CMP-2026-8941"} is now pending companion acceptance.
          </p>
        </div>

        {/* 4-Digit Secret PIN Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Secret 4-Digit Handshake PIN
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
              Safety Code
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Share this PIN with your companion <strong>only after meeting in person</strong> at the public venue to initiate the verified session.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {pinDigits.map((digit, i) => (
              <div
                key={i}
                className="flex h-14 w-12 items-center justify-center rounded-xl bg-slate-900 text-2xl font-black text-white shadow-sm font-mono"
              >
                {digit}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleCopyPin}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>PIN Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy PIN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 12-Hour SLA Countdown Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-800">Host Acceptance Window</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The companion has up to 12 hours to review and accept your meetup request. If they decline or do not respond in time, 100% of your escrow payment is instantly refunded back to your source account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href={`/chat/${bookingId || "bkg_seed_01"}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#101828] hover:bg-black py-3.5 text-xs font-bold text-white shadow-md transition active:scale-[0.99]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Open In-App Chat with {booking?.companionName || "Companion"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/explore"
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Explore More Companions
          </Link>
        </div>
      </div>
    </div>
  );
}
