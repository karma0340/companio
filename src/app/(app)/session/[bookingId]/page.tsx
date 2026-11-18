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
        throw new Error(data.error || "Incorrect 4-digit PIN.");
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
        body: JSON.stringify({
          score: reviewScore,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const handleTriggerSos = async () => {
    setSosTriggered(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetch(`/api/session/${bookingId}/sos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
        },
        async () => {
          await fetch(`/api/session/${bookingId}/sos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
        }
      );
    }

    // Trigger phone dialer to 112
    window.location.href = "tel:112";
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const pinDigits = (booking?.verificationPin || "7492").split("");

  return (
    <div className="mx-auto max-w-3xl pb-24 md:pb-16 px-1 sm:px-0">
      {/* Top Bar with Role Switcher */}
      <div className="flex flex-col justify-between gap-3 border-b-2 border-[#102A43] bg-white p-4 sm:flex-row sm:items-center">
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-1 text-xs font-black text-[#102A43] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Exit to Dashboard</span>
        </Link>

        {/* Dual Role Switcher Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#627D98]">Testing Role:</span>
          <button
            onClick={() => setRole("MEMBER")}
            className={`rounded-md border-2 border-[#102A43] px-3 py-1 text-xs font-black ${
              role === "MEMBER"
                ? "bg-[#70D6FF] text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
                : "bg-white text-[#627D98]"
            }`}
          >
            Member View
          </button>
          <button
            onClick={() => setRole("COMPANION")}
            className={`rounded-md border-2 border-[#102A43] px-3 py-1 text-xs font-black ${
              role === "COMPANION"
                ? "bg-[#FF7AC6] text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
                : "bg-white text-[#627D98]"
            }`}
          >
            Host View
          </button>
        </div>
      </div>

      {/* Main Session Container */}
      <div className="mt-6 space-y-6">
        {/* Status Header Banner */}
        <div className="rounded-xl border-2 border-[#102A43] bg-[#E9FF70] p-6 shadow-[4px_4px_0px_0px_#102A43]">
          <div className="flex items-center justify-between">
            <span className="rounded bg-white border border-[#102A43] px-2 py-0.5 text-xs font-black uppercase text-[#102A43]">
              {booking?.status || "CONFIRMED"}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#102A43]">
              <ShieldCheck className="h-4 w-4 text-green-700" />
              <span>Verified Public Meetup</span>
            </div>
          </div>

          <h1 className="mt-3 text-2xl font-black text-[#102A43]">
            {booking?.companionName || "Vanshika Sharma"} & {booking?.memberName || "Rohit Verma"}
          </h1>
          <p className="mt-1 text-xs font-bold text-[#102A43]">
            Venue: {booking?.venueName || "Blue Tokai Coffee Roasters"} • {booking?.venueAddress || "Hauz Khas Village, New Delhi"}
          </p>
        </div>

        {/* STATE 1: PRE-HANDSHAKE (CONFIRMED / PENDING PIN VERIFICATION) */}
        {booking?.status !== "IN_PROGRESS" && booking?.status !== "COMPLETED" && (
          <div className="rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
            {role === "MEMBER" ? (
              /* MEMBER SCREEN: DISPLAYS PIN TO SHOW TO COMPANION */
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#102A43] bg-[#FF7AC6] px-3 py-1 text-xs font-black text-[#102A43]">
                  <Lock className="h-3.5 w-3.5" />
                  <span>STEP 1: IN-PERSON 4-DIGIT HANDSHAKE</span>
                </div>
                <h2 className="mt-3 text-xl font-black text-[#102A43]">
                  Your Secret Handshake PIN
                </h2>
                <p className="mt-1 text-xs font-bold text-[#627D98] max-w-md mx-auto">
                  When you sit down with {booking?.companionName || "your companion"}, disclose this 4-digit code so they can validate your arrival and start the session.
                </p>

                {/* PIN Display Digits */}
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

                <div className="mt-6 rounded-lg border border-[#102A43] bg-[#FFF9E6] p-3 text-xs text-[#334E68] text-left">
                  <strong>Safety Rule:</strong> Never send this PIN over chat or SMS. Only say it out loud in person once you confirm you are in a safe public cafe.
                </div>
              </div>
            ) : (
              /* HOST SCREEN: INPUTS PIN TO START CLOCK */
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#FF7AC6] border border-[#102A43] px-2 py-0.5 text-xs font-black uppercase text-[#102A43]">
                    HOST ACTION REQUIRED
                  </span>
                  <h2 className="text-base font-black text-[#102A43]">
                    Enter Member 4-Digit PIN to Start Session
                  </h2>
                </div>
                <p className="mt-1 text-xs text-[#627D98]">
                  Ask {booking?.memberName || "the member"} for the 4-digit PIN displayed on their screen upon meeting at {booking?.venueName || "the venue"}.
                </p>

                <form onSubmit={handleVerifyPin} className="mt-6 flex flex-col items-center gap-4">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 7492"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                    className="w-48 rounded-xl border-2 border-[#102A43] bg-[#FFFDF9] py-3 text-center text-3xl font-black tracking-widest text-[#102A43] outline-none shadow-[3px_3px_0px_0px_#102A43]"
                  />

                  {pinError && (
                    <div className="rounded border-2 border-red-500 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                      {pinError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={pinInput.length !== 4 || isVerifying}
                    className="rounded-xl border-2 border-[#102A43] bg-[#E9FF70] px-8 py-3 text-xs font-black uppercase text-[#102A43] shadow-[3px_3px_0px_0px_#102A43] hover:bg-[#D4E856] disabled:opacity-50"
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
            <div className="rounded-xl border-2 border-[#102A43] bg-white p-8 text-center shadow-[4px_4px_0px_0px_#102A43]">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#102A43] bg-[#70D6FF] px-3 py-1 text-xs font-black text-[#102A43]">
                <Clock className="h-3.5 w-3.5 animate-spin" />
                <span>SESSION LIVE IN PROGRESS</span>
              </div>

              {/* Large Clock Display */}
              <div className="mt-6 text-6xl font-black tracking-tight text-[#102A43]">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <p className="mt-2 text-xs font-bold text-[#627D98]">
                Scheduled Duration: {booking?.durationHours || 1} Hour ({booking?.activityTitle || "Café & Conversation"})
              </p>

              {/* Progress Bar */}
              <div className="mx-auto mt-6 h-3 max-w-md overflow-hidden rounded-full border-2 border-[#102A43] bg-[#F0EDE6]">
                <div
                  className="h-full bg-[#E9FF70] transition-all duration-1000"
                  style={{ width: `${Math.max(5, ((3600 - secondsRemaining) / 3600) * 100)}%` }}
                />
              </div>

              {/* Complete Session Action Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleCompleteSession}
                  disabled={isCompleting}
                  className="rounded-xl border-2 border-[#102A43] bg-[#E9FF70] px-8 py-3 text-xs font-black uppercase text-[#102A43] shadow-[3px_3px_0px_0px_#102A43] hover:bg-[#D4E856] disabled:opacity-50"
                >
                  {isCompleting ? "Dispersing Escrow..." : "Complete Session & Release Host Payout"}
                </button>
              </div>
            </div>

            {/* Emergency SOS Panic Button Card */}
            <div className="rounded-xl border-2 border-red-600 bg-red-50 p-6 shadow-[4px_4px_0px_0px_#990000]">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h3 className="text-sm font-black uppercase text-red-900">
                      Emergency Safety Protocol (SOS)
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-red-700">
                    If at any time you feel uncomfortable, press the SOS button to instantly share GPS coordinates with emergency dispatch and dial 112.
                  </p>
                </div>

                <button
                  onClick={handleTriggerSos}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-800 bg-red-600 px-6 py-3 text-xs font-black uppercase text-white shadow-[3px_3px_0px_0px_#660000] hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>EMERGENCY SOS (112)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: COMPLETED SESSION (CASHFREE PAYOUT RECEIPT & REVIEW) */}
        {booking?.status === "COMPLETED" && (
          <div className="space-y-6">
            {/* Completion Success Card */}
            <div className="rounded-xl border-2 border-[#102A43] bg-[#E9FF70] p-6 text-center shadow-[4px_4px_0px_0px_#102A43]">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#102A43]" />
              <h2 className="mt-2 text-2xl font-black text-[#102A43]">
                Session Successfully Completed!
              </h2>
              <p className="mt-1 text-xs font-bold text-[#102A43]">
                Escrow funds have been successfully unlocked and dispersed.
              </p>
            </div>

            {/* Cashfree Instant UPI Payout Card */}
            <div className="rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
              <div className="flex items-center justify-between border-b-2 border-[#102A43] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#102A43]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#102A43]">
                    Automated Cashfree Instant UPI Payout
                  </h3>
                </div>
                <span className="rounded bg-green-100 border border-green-500 px-2 py-0.5 text-[10px] font-black uppercase text-green-800">
                  UTR DISPATCHED
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs font-bold text-[#334E68]">
                <div>
                  <p className="text-[#627D98]">Net Companion Payout:</p>
                  <p className="text-xl font-black text-[#102A43]">
                    ₹{booking.companionFee.toFixed(2)}
                  </p>
                  <p className="mt-2 text-[#627D98]">Recipient UPI ID:</p>
                  <p className="font-black text-[#102A43]">
                    {payoutData?.recipientUpiId || "vanshika@okhdfcbank"}
                  </p>
                </div>
                <div>
                  <p className="text-[#627D98]">Cashfree Transfer ID:</p>
                  <p className="font-mono text-xs text-[#102A43]">
                    {payoutData?.transferId || "cf_payout_2026849201"}
                  </p>
                  <p className="mt-2 text-[#627D98]">Bank UTR Reference:</p>
                  <p className="font-mono text-xs text-green-700">
                    {payoutData?.utr || "CF2026981402"} (Immediate Settlement)
                  </p>
                </div>
              </div>
            </div>

            {/* Post-Session Review Form */}
            <div className="rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
              {reviewSubmitted ? (
                <div className="py-4 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                  <h3 className="mt-2 text-base font-black text-[#102A43]">
                    Rating & Feedback Submitted!
                  </h3>
                  <p className="text-xs text-[#627D98]">
                    Thank you for keeping our community safe and verified.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#102A43]">
                    Rate Your Session Experience
                  </h3>
                  <p className="mt-1 text-xs text-[#627D98]">
                    How was your experience with {booking.companionName}? Ratings help maintain trust on the platform.
                  </p>

                  {/* Star Rating Selector */}
                  <div className="mt-4 flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewScore(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewScore
                              ? "fill-[#FFD670] text-[#102A43]"
                              : "text-gray-300"
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
                    className="mt-4 w-full rounded-lg border-2 border-[#102A43] bg-[#FFFDF9] p-3 text-xs font-bold text-[#102A43] outline-none"
                  />

                  <button
                    type="submit"
                    className="mt-4 rounded-lg border-2 border-[#102A43] bg-[#70D6FF] px-6 py-2 text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#5BC5F2]"
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
