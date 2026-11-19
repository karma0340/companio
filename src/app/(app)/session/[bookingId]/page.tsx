"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Star,
  PhoneCall,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { BookingRecord, PayoutRecord } from "@/lib/bookings";

export default function SessionLivePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = String(params.bookingId || "bkg_seed_01");

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [role, setRole] = useState<"MEMBER" | "COMPANION">("COMPANION"); // Toggle for testing
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600); // 60 mins
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Completion & Payout state
  const [payoutData, setPayoutData] = useState<PayoutRecord | null>(null);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  // Review state
  const [reviewScore, setReviewScore] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // SOS state
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);

  const fetchBooking = () => {
    fetch(`/api/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.booking) {
          setBooking(data.booking);
          if (data.booking.status === "IN_PROGRESS") {
            setTimerActive(true);
          } else if (data.booking.status === "COMPLETED") {
            setSecondsRemaining(0);
          }
        }
      })
      .catch((err) => console.error("Error fetching booking:", err));
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  // Live Timer Countdown
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPinError(null);

    try {
      const res = await fetch(`/api/session/${bookingId}/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Incorrect 4-digit PIN. Please re-check with member.");
      }

      setBooking(data.booking);
      setTimerActive(true);
    } catch (err) {
      setPinError((err as Error).message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteSession = async () => {
    setIsCompleting(true);

    try {
      const res = await fetch(`/api/session/${bookingId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to complete session.");
      }

      setBooking(data.booking);
      setPayoutData(data.payout);
      setTimerActive(false);
      setSecondsRemaining(0);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/session/${bookingId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewScore, comment: reviewComment }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setReviewSubmitted(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleTriggerSos = async () => {
    const confirmSos = window.confirm(
      "CONFIRM EMERGENCY SOS: This will alert local police dispatch (112), transmit current GPS coordinates, and notify Companio Trust Operations. Proceed only in genuine emergencies."
    );

    if (!confirmSos) return;

    try {
      const res = await fetch(`/api/session/${bookingId}/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: 28.5528,
          longitude: 77.1947,
          triggeredBy: role,
        }),
      });

      const data = await res.json();
      setSosTriggered(true);
      alert(`EMERGENCY SOS DISPATCHED: Incident Reference #${data.incidentId || "EMG-8914"}. Police 112 notified.`);
    } catch (err) {
      alert("Failed to send automatic SOS dispatch. Please dial 112 directly.");
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const pinDigits = (booking?.verificationPin || "7492").split("");

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Bar with Role Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Exit to Member Dashboard</span>
          </Link>

          {/* Dual Role Switcher Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Preview View:</span>
            <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setRole("MEMBER")}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  role === "MEMBER"
                    ? "bg-[#101828] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Member Screen
              </button>
              <button
                onClick={() => setRole("COMPANION")}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  role === "COMPANION"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Host Screen
              </button>
            </div>
          </div>
        </div>

        {/* Status Header Banner */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>{booking?.status || "CONFIRMED"}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Public Meetup</span>
            </div>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {booking?.companionName || "Kinjal Patel"} & {booking?.memberName || "Member"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Venue: {booking?.venueName || "Blue Tokai Coffee Roasters"} · {booking?.venueAddress || "Bandra West, Mumbai"}
          </p>
        </div>

        {/* STATE 1: PRE-HANDSHAKE (CONFIRMED / PENDING PIN VERIFICATION) */}
        {booking?.status !== "IN_PROGRESS" && booking?.status !== "COMPLETED" && (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm">
            {role === "MEMBER" ? (
              /* MEMBER SCREEN: DISPLAYS PIN TO SHOW TO COMPANION */
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-800">
                  <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                  <span>Step 1: In-Person 4-Digit Handshake</span>
                </div>
                <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
                  Your Secret Handshake PIN
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  When you sit down with {booking?.companionName || "your companion"}, share this 4-digit code so they can validate your arrival and release the escrow session.
                </p>

                {/* PIN Display Digits */}
                <div className="mt-6 flex justify-center gap-3">
                  {pinDigits.map((digit, idx) => (
                    <div
                      key={idx}
                      className="flex h-16 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-3xl font-mono font-black text-slate-900 shadow-sm"
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-blue-200/60 bg-blue-50/60 p-4 text-xs text-slate-700 text-left max-w-lg mx-auto">
                  <strong className="font-bold text-slate-900">Safety Rule:</strong> Never send this PIN over chat or SMS. Only say it out loud in person once you confirm you are in a safe public venue.
                </div>
              </div>
            ) : (
              /* HOST SCREEN: INPUTS PIN TO START CLOCK */
              <div className="max-w-md mx-auto text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-800 mb-3">
                  <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                  <span>Host Action Required</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Enter Member 4-Digit PIN
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  Ask {booking?.memberName || "the member"} for the 4-digit PIN displayed on their screen upon meeting at {booking?.venueName || "the venue"}.
                </p>

                <form onSubmit={handleVerifyPin} className="mt-6 flex flex-col items-center gap-4">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 7492"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                    className="w-48 rounded-2xl border border-slate-300 bg-white py-3 text-center text-3xl font-mono font-black tracking-widest text-slate-900 outline-none shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
                  />

                  {pinError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600">
                      {pinError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={pinInput.length !== 4 || isVerifying}
                    className="w-full rounded-full bg-[#101828] px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-black transition active:scale-95 disabled:opacity-50"
                  >
                    {isVerifying ? "Validating PIN..." : "Validate PIN & Start Session Clock"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* STATE 2: IN-PROGRESS SESSION (CLOCK ACTIVE + SOS BUTTON) */}
        {booking?.status === "IN_PROGRESS" && (
          <div className="space-y-6">
            {/* Live Timer Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-sm">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-800">
                <Clock className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                <span>Session Live In Progress</span>
              </div>

              {/* Large Clock Display */}
              <div className="mt-6 text-6xl font-mono font-extrabold tracking-tight text-slate-900">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Scheduled Duration: {booking?.durationHours || 1} Hour ({booking?.activityTitle || "Café & Conversation"})
              </p>

              {/* Progress Bar */}
              <div className="mx-auto mt-6 h-2.5 max-w-md overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-blue-600 transition-all duration-1000"
                  style={{ width: `${Math.max(5, ((3600 - secondsRemaining) / 3600) * 100)}%` }}
                />
              </div>

              {/* Complete Session Action Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleCompleteSession}
                  disabled={isCompleting}
                  className="rounded-full bg-[#101828] px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-black transition active:scale-95 disabled:opacity-50"
                >
                  {isCompleting ? "Dispersing Escrow..." : "Complete Session & Release Host Payout"}
                </button>
              </div>
            </div>

            {/* Emergency SOS Panic Button Card */}
            <div className="rounded-3xl border border-red-200 bg-red-50/70 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-red-900">
                      Emergency Safety Protocol (SOS)
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-red-700 leading-relaxed">
                    If at any time you feel uncomfortable, press the SOS button to instantly share GPS coordinates with emergency dispatch and dial 112.
                  </p>
                </div>

                <button
                  onClick={handleTriggerSos}
                  className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-xs font-bold uppercase text-white shadow-md hover:bg-red-700 transition active:scale-95 shrink-0"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Emergency SOS (112)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: COMPLETED SESSION */}
        {booking?.status === "COMPLETED" && (
          <div className="space-y-6">
            {/* Completion Success Card */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-8 text-center shadow-sm">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">
                Session Successfully Completed!
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Escrow funds have been successfully released to the companion.
              </p>
            </div>

            {/* Instant Payout Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Verified Payout Receipt
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  UTR Dispatched
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                <div>
                  <p className="text-slate-400">Net Companion Payout:</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    ₹{booking.companionFee.toFixed(2)}
                  </p>
                  <p className="mt-3 text-slate-400">Recipient UPI ID:</p>
                  <p className="font-semibold text-slate-900">
                    {payoutData?.recipientUpiId || "kinjal@okhdfcbank"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Escrow Release ID:</p>
                  <p className="font-mono text-xs text-slate-900 mt-0.5">
                    {payoutData?.transferId || `escrow_rel_${Date.now()}`}
                  </p>
                  <p className="mt-3 text-slate-400">Bank UTR Reference:</p>
                  <p className="font-mono text-xs text-emerald-700 font-semibold">
                    {payoutData?.utr || "UTR2026981402"} (Immediate Settlement)
                  </p>
                </div>
              </div>
            </div>

            {/* Post-Session Review Form */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
              {reviewSubmitted ? (
                <div className="py-6 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    Rating & Feedback Submitted!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Thank you for keeping our community safe and verified.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Rate Your Meetup Experience
                  </h3>
                  <p className="text-xs text-slate-500">
                    How was your experience with {booking.companionName}? Ratings help maintain trust across Companio.
                  </p>

                  {/* Star Rating Selector */}
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewScore(star)}
                        className="p-1 hover:scale-110 transition cursor-pointer"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewScore
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Write a polite review regarding punctuality, conversation, and professionalism..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />

                  <button
                    type="submit"
                    className="rounded-full bg-[#101828] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
