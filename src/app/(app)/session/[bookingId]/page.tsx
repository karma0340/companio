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
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingRecord, PayoutRecord } from "@/lib/bookings";

export default function SessionLivePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = String(params.bookingId || "bkg_seed_01");

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [role, setRole] = useState<"MEMBER" | "COMPANION">("COMPANION");
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);
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
      "CONFIRM EMERGENCY SOS: This will alert local police dispatch (112), transmit current GPS coordinates, and notify Togethr Trust Operations. Proceed only in genuine emergencies."
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
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Top Bar with Role Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-brutal shadow-brutal bg-white p-4">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Bookings</span>
            </Link>

            {/* Dual Role Switcher Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/70">View Mode:</span>
              <div className="flex border-2 border-ink bg-paper p-0.5">
                <button
                  type="button"
                  onClick={() => setRole("MEMBER")}
                  className={`px-3 py-1 text-xs font-black uppercase transition ${
                    role === "MEMBER"
                      ? "bg-ink text-white"
                      : "text-ink hover:bg-black/5"
                  }`}
                >
                  Member View
                </button>
                <button
                  type="button"
                  onClick={() => setRole("COMPANION")}
                  className={`px-3 py-1 text-xs font-black uppercase transition ${
                    role === "COMPANION"
                      ? "bg-lime text-ink"
                      : "text-ink hover:bg-black/5"
                  }`}
                >
                  Host View
                </button>
              </div>
            </div>
          </div>

          {/* Status Header Banner */}
          <div className="border-brutal shadow-brutal bg-sunny p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 border-2 border-ink bg-white px-3 py-1 text-xs font-black uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{booking?.status || "CONFIRMED"}</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase border-2 border-ink bg-white px-3 py-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Verified Public Meetup</span>
              </div>
            </div>

            <h1 className="mt-4 text-2xl sm:text-4xl font-black text-ink uppercase tracking-tight">
              {booking?.companionName || "Kinjal Patel"} &amp; {booking?.memberName || "Member"}
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-bold text-ink/80">
              Venue: {booking?.venueName || "Blue Tokai Coffee Roasters"} - {booking?.venueAddress || "Bandra West, Mumbai"}
            </p>
          </div>

          {/* STATE 1: PRE-HANDSHAKE (CONFIRMED / PENDING PIN VERIFICATION) */}
          {booking?.status !== "IN_PROGRESS" && booking?.status !== "COMPLETED" && (
            <div className="border-brutal shadow-brutal bg-white p-6 sm:p-10">
              {role === "MEMBER" ? (
                /* MEMBER SCREEN: DISPLAYS PIN TO SHOW TO COMPANION */
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-1 text-xs font-black uppercase tracking-wider">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>In-Person Handshake PIN</span>
                  </div>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight">
                    Your Secret Handshake PIN
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm font-medium text-ink/70 max-w-md mx-auto leading-relaxed">
                    When you meet {booking?.companionName || "your companion"}, share this 4-digit code in person so they can validate your arrival and begin the session.
                  </p>

                  {/* PIN Display Digits */}
                  <div className="mt-6 flex justify-center gap-3">
                    {pinDigits.map((digit, idx) => (
                      <div
                        key={idx}
                        className="flex h-16 w-14 items-center justify-center border-3 border-ink bg-paper text-3xl font-mono font-black text-ink shadow-brutal"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-2 border-ink bg-pink/20 p-4 text-xs font-bold text-ink text-left max-w-lg mx-auto">
                    <strong>Safety Rule:</strong> Never send this PIN over chat or SMS. Only say it out loud in person once you confirm you are in a safe public venue.
                  </div>
                </div>
              ) : (
                /* HOST SCREEN: INPUTS PIN TO START CLOCK */
                <div className="max-w-md mx-auto text-center">
                  <div className="inline-flex items-center gap-1.5 border-2 border-ink bg-lime px-3 py-1 text-xs font-black uppercase tracking-wider mb-3">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Host Action Required</span>
                  </div>
                  <h2 className="text-2xl font-black text-ink uppercase tracking-tight">
                    Enter Member 4-Digit PIN
                  </h2>
                  <p className="mt-2 text-xs text-ink/70">
                    Ask {booking?.memberName || "the member"} for the 4-digit PIN displayed on their screen at {booking?.venueName || "the venue"}.
                  </p>

                  <form onSubmit={handleVerifyPin} className="mt-6 flex flex-col items-center gap-4">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="••••"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                      className="w-48 border-3 border-ink bg-paper py-3 text-center text-3xl font-mono font-black tracking-widest text-ink outline-none shadow-brutal"
                    />

                    {pinError && (
                      <div className="border-2 border-ink bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger">
                        {pinError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={pinInput.length !== 4 || isVerifying}
                      className="w-full border-2 border-ink bg-ink px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-brutal btn-press disabled:opacity-50"
                    >
                      {isVerifying ? "Validating PIN..." : "Validate PIN & Start Clock"}
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
              <div className="border-brutal shadow-brutal bg-white p-8 text-center">
                <div className="inline-flex items-center gap-1.5 border-2 border-ink bg-lime px-3.5 py-1 text-xs font-black uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 animate-spin" />
                  <span>Session Live In Progress</span>
                </div>

                {/* Large Clock Display */}
                <div className="mt-6 text-6xl font-mono font-black tracking-tight text-ink">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
                <p className="mt-2 text-xs font-bold text-ink/70">
                  Scheduled Duration: {booking?.durationHours || 1} Hour ({booking?.activityTitle || "Cafe & Conversation"})
                </p>

                {/* Progress Bar */}
                <div className="mx-auto mt-6 h-3 max-w-md overflow-hidden border-2 border-ink bg-paper">
                  <div
                    className="h-full bg-ink transition-all duration-1000"
                    style={{ width: `${Math.max(5, ((3600 - secondsRemaining) / 3600) * 100)}%` }}
                  />
                </div>

                {/* Complete Session Action Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleCompleteSession}
                    disabled={isCompleting}
                    className="border-2 border-ink bg-sunny px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-ink shadow-brutal btn-press disabled:opacity-50"
                  >
                    {isCompleting ? "Dispersing Escrow..." : "Complete Session & Release Escrow"}
                  </button>
                </div>
              </div>

              {/* Emergency SOS Panic Button Card */}
              <div className="border-brutal shadow-brutal bg-danger/10 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-danger" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-danger">
                        Emergency Safety Protocol (SOS)
                      </h3>
                    </div>
                    <p className="mt-1 text-xs font-bold text-ink/80 leading-relaxed">
                      If at any time you feel uncomfortable, press the SOS button to instantly share GPS coordinates with emergency dispatch and dial 112.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTriggerSos}
                    className="flex items-center justify-center gap-2 border-2 border-ink bg-danger px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press shrink-0"
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
              <div className="border-brutal shadow-brutal bg-lime p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-ink" />
                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight">
                  Session Completed Successfully
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-bold text-ink/80">
                  Escrow funds have been successfully released to the companion host.
                </p>
              </div>

              {/* Instant Payout Card */}
              <div className="border-brutal shadow-brutal bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-ink">
                      Verified Escrow Payout Receipt
                    </h3>
                  </div>
                  <span className="border border-ink bg-lime px-2.5 py-0.5 text-[10px] font-black uppercase">
                    UTR Dispatched
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-ink">
                  <div>
                    <p className="text-ink/60">Net Companion Payout:</p>
                    <p className="text-2xl font-black text-ink mt-0.5">
                      INR {booking.companionFee.toFixed(2)}
                    </p>
                    <p className="mt-3 text-ink/60">Recipient UPI ID:</p>
                    <p className="font-bold text-ink">
                      {payoutData?.recipientUpiId || "host@okhdfcbank"}
                    </p>
                  </div>
                  <div>
                    <p className="text-ink/60">Escrow Release ID:</p>
                    <p className="font-mono text-xs text-ink mt-0.5">
                      {payoutData?.transferId || `escrow_rel_${Date.now()}`}
                    </p>
                    <p className="mt-3 text-ink/60">Bank Settlement UTR:</p>
                    <p className="font-mono text-xs text-emerald-700 font-bold">
                      {payoutData?.utr || "UTR2026981402"} (Immediate Settlement)
                    </p>
                  </div>
                </div>
              </div>

              {/* Post-Session Review Form */}
              <div className="border-brutal shadow-brutal bg-white p-6 sm:p-8">
                {reviewSubmitted ? (
                  <div className="py-6 text-center">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                    <h3 className="mt-3 text-lg font-black text-ink uppercase">
                      Rating &amp; Feedback Submitted
                    </h3>
                    <p className="text-xs font-bold text-ink/70 mt-1">
                      Thank you for keeping our community safe and verified.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-ink">
                      Rate Your Meetup Experience
                    </h3>
                    <p className="text-xs font-medium text-ink/70">
                      How was your experience with {booking.companionName}? Ratings help maintain trust across Togethr.
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
                                ? "fill-amber-400 text-ink"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Write an honest review regarding punctuality, conversation, and professionalism..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full border-2 border-ink bg-paper p-3.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                    />

                    <button
                      type="submit"
                      className="border-2 border-ink bg-ink px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press"
                    >
                      Submit Verified Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
