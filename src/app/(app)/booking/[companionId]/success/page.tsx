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
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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

      if (diffMs <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [booking?.hostAcceptanceDeadline]);

  const handleCopyPin = () => {
    const pin = booking?.verificationPin || "7492";
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pinDigits = (booking?.verificationPin || "7492").split("");

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Success Banner */}
          <div className="border-brutal shadow-brutal bg-lime p-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border-3 border-ink bg-white shadow-brutal">
              <CheckCircle2 className="h-8 w-8 text-ink" />
            </div>
            <span className="inline-block border-2 border-ink bg-white px-3 py-0.5 text-xs font-black uppercase tracking-wider">
              Payment Held In Escrow
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-ink tracking-tight">
              Meetup Request Confirmed
            </h1>
            <p className="text-xs sm:text-sm font-bold text-ink/80 max-w-md mx-auto">
              Your meetup request #{booking?.bookingNumber || "CMP-2026"} has been placed. Your payment is safely locked in Companio Escrow and will only be released after the session is validated in person.
            </p>
          </div>

          {/* Handshake PIN Card */}
          <div className="border-brutal shadow-brutal bg-white p-6 sm:p-8 text-center space-y-4">
            <span className="border-2 border-ink bg-sunny px-3 py-1 text-xs font-black uppercase tracking-wider">
              Important: In-Person Verification
            </span>
            <h2 className="text-xl font-black uppercase text-ink">
              Your 4-Digit Handshake PIN
            </h2>
            <p className="text-xs font-bold text-ink/70 max-w-md mx-auto">
              Share this PIN out loud with {booking?.companionName || "your companion"} once you sit down at the public venue. Do not send this PIN via chat or SMS.
            </p>

            {/* PIN Digits */}
            <div className="flex justify-center gap-3 py-2">
              {pinDigits.map((digit, idx) => (
                <div
                  key={idx}
                  className="flex h-16 w-14 items-center justify-center border-3 border-ink bg-paper text-3xl font-mono font-black text-ink shadow-brutal"
                >
                  {digit}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyPin}
              className="inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-4 py-2 text-xs font-black uppercase shadow-brutal btn-press"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-ink" />}
              <span>{copied ? "PIN Copied" : "Copy Handshake PIN"}</span>
            </button>
          </div>

          {/* Booking Summary Card */}
          <div className="border-brutal shadow-brutal bg-white p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-ink border-b-2 border-ink pb-2">
              Meetup Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-ink">
              <div>
                <p className="text-ink/60">Companion Host:</p>
                <p className="text-base font-black text-ink">{booking?.companionName || "Verified Companion"}</p>
              </div>

              <div>
                <p className="text-ink/60">Activity:</p>
                <p className="text-base font-black text-ink">{booking?.activityTitle || "Coffee & Conversation"}</p>
              </div>

              <div>
                <p className="text-ink/60">Scheduled Date &amp; Time:</p>
                <p className="text-xs font-black text-ink">
                  {booking?.scheduledDate
                    ? new Date(booking.scheduledDate).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Tomorrow at 04:00 PM"}
                </p>
              </div>

              <div>
                <p className="text-ink/60">Public Venue:</p>
                <p className="text-xs font-black text-ink">
                  {booking?.venueName || "Blue Tokai Coffee Roasters"}
                </p>
                <p className="text-[11px] font-medium text-ink/70">
                  {booking?.venueAddress || "Bandra West, Mumbai"}
                </p>
              </div>
            </div>

            {/* 12-Hour SLA Notification */}
            <div className="border-2 border-ink bg-lavender/30 p-4 flex items-center justify-between text-xs font-bold text-ink">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink shrink-0" />
                <span>Host Acceptance SLA:</span>
              </div>
              <span className="font-mono font-black">
                {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/chat/${bookingId || "bkg_seed_01"}`}
              className="border-2 border-ink bg-ink p-3.5 text-center text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Open In-App Chat</span>
            </Link>

            <Link
              href="/bookings"
              className="border-2 border-ink bg-sunny p-3.5 text-center text-xs font-black uppercase tracking-wider text-ink shadow-brutal btn-press flex items-center justify-center gap-2"
            >
              <span>View All Bookings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
