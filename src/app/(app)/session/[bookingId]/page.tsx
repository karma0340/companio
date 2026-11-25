"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  PhoneCall,
  ChevronLeft,
  Sparkles,
  KeyRound,
  Loader2,
  MapPin,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingRecord, PayoutRecord } from "@/lib/bookings";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";

export default function SessionLivePage() {
  const params = useParams();
  const { user, refreshSession } = useAuth();
  const toast = useToast();
  const bookingId = String(params.bookingId || "");

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [viewerRole, setViewerRole] = useState<"MEMBER" | "COMPANION">("MEMBER");
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Real Timer State calculated from sessionStartedAt + durationHours
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(3600);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Completion & Review
  const [payoutData, setPayoutData] = useState<PayoutRecord | null>(null);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [reviewScore, setReviewScore] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // SOS
  const [sosDispatching, setSosDispatching] = useState<boolean>(false);
  const [sosAlertId, setSosAlertId] = useState<string | null>(null);

  const syncTimerFromBooking = (b: BookingRecord) => {
    const totalSecs = Math.max(1, b.durationHours || 1) * 3600;
    setTotalDurationSeconds(totalSecs);

    if (b.status === "IN_PROGRESS" && b.sessionStartedAt) {
      const elapsedSec = Math.floor((Date.now() - new Date(b.sessionStartedAt).getTime()) / 1000);
      const remaining = Math.max(0, totalSecs - elapsedSec);
      setSecondsRemaining(remaining);
      setTimerActive(remaining > 0);
    } else if (b.status === "COMPLETED") {
      setSecondsRemaining(0);
      setTimerActive(false);
    } else {
      setSecondsRemaining(totalSecs);
      setTimerActive(false);
    }
  };

  const fetchBooking = async () => {
    if (!bookingId) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.booking) {
        setLoadError(data.error || "Unable to load this booking.");
        return;
      }
      setBooking(data.booking);
      if (data.viewerRole) {
        setViewerRole(data.viewerRole);
      } else if (user?.id) {
        setViewerRole(data.booking.memberId === user.id ? "MEMBER" : "COMPANION");
      }
      syncTimerFromBooking(data.booking);
    } catch {
      setLoadError("Network error loading session details.");
    } finally {
      setLoadingBooking(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    // Poll every 5 seconds while pre-handshake or live so both screens stay in sync
    const poll = setInterval(fetchBooking, 5000);
    return () => clearInterval(poll);
  }, [bookingId]);

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
      syncTimerFromBooking(data.booking);
      toast.success("4-digit PIN verified! Session clock is active.", "Session Live");
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
      await refreshSession();
      toast.success("Session completed! 70% Host payout credited.", "Escrow Released");
    } catch (err) {
      toast.error((err as Error).message, "Completion Error");
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
          rating: reviewScore,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setReviewSubmitted(true);
      toast.success("Verified review published!", "Thank You");
    } catch (err) {
      toast.error((err as Error).message, "Review Error");
    }
  };

  const handleTriggerSos = async () => {
    const confirmSos = window.confirm(
      "CONFIRM EMERGENCY SOS: This will capture your current GPS coordinates and send an urgent safety alert to Meetzy Club Safety Operations. In immediate physical danger, also dial 112."
    );
    if (!confirmSos) return;

    setSosDispatching(true);

    const dispatchAlert = async (lat?: number, lng?: number) => {
      try {
        const res = await fetch(`/api/session/${bookingId}/sos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: lat, longitude: lng }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to send SOS alert.");
        }
        setSosAlertId(data.alertId || data.incidentId);
        toast.success(
          `Emergency SOS Logged (#${data.alertId}). Safety Command alerted!`,
          "SOS Dispatched"
        );
      } catch (err) {
        toast.error(
          (err as Error).message || "Could not dispatch automatic SOS. Dial 112 directly!",
          "Dial 112 Immediately"
        );
      } finally {
        setSosDispatching(false);
      }
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => dispatchAlert(pos.coords.latitude, pos.coords.longitude),
        () => dispatchAlert(undefined, undefined),
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      await dispatchAlert(undefined, undefined);
    }
  };

  const hoursPart = Math.floor(secondsRemaining / 3600);
  const minutesPart = Math.floor((secondsRemaining % 3600) / 60);
  const secondsPart = secondsRemaining % 60;
  const progressPct = Math.min(
    100,
    Math.max(4, ((totalDurationSeconds - secondsRemaining) / Math.max(1, totalDurationSeconds)) * 100)
  );
  const pinDigits = booking?.verificationPin ? booking.verificationPin.split("") : [];

  if (loadingBooking) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-ink" />
        </main>
        <Footer />
      </div>
    );
  }

  if (loadError || !booking) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 py-16 px-4 max-w-xl mx-auto w-full">
          <div className="border-brutal bg-white p-8 shadow-brutal text-center space-y-4">
            <AlertTriangle className="h-10 w-10 text-danger mx-auto" />
            <h1 className="font-display text-xl font-black uppercase text-ink">
              Session Not Accessible
            </h1>
            <p className="text-xs font-bold text-ink-soft">
              {loadError || "Please sign in with the account linked to this booking."}
            </p>
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 border-2 border-ink bg-ink text-white px-5 py-2.5 text-xs font-black uppercase"
            >
              Back to Meetups
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-brutal shadow-brutal bg-white p-4">
            <Link
              href={viewerRole === "COMPANION" ? "/companion/dashboard" : "/bookings"}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{viewerRole === "COMPANION" ? "Back to Host Dashboard" : "Back to Bookings"}</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-paper px-3 py-1 text-xs font-black uppercase">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              <span>Logged in as {viewerRole === "COMPANION" ? "Companion Host" : "Member"}</span>
            </span>
          </div>

          {/* Status Header Banner */}
          <div className="border-brutal shadow-brutal bg-sunny p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 border-2 border-ink bg-white px-3 py-1 text-xs font-black uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{booking.status.replace(/_/g, " ")}</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase border-2 border-ink bg-white px-3 py-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Ref #{booking.bookingNumber}</span>
              </div>
            </div>

            <h1 className="mt-4 text-2xl sm:text-4xl font-black text-ink uppercase tracking-tight">
              {booking.companionName} &amp; {booking.memberName}
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-bold text-ink/80 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>
                {booking.venueName} - {booking.venueAddress}
              </span>
            </p>
          </div>

          {/* STATE 1: PRE-HANDSHAKE */}
          {booking.status !== "IN_PROGRESS" && booking.status !== "COMPLETED" && (
            <div className="border-brutal shadow-brutal bg-white p-6 sm:p-10">
              {viewerRole === "MEMBER" ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-1 text-xs font-black uppercase tracking-wider">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>In-Person Handshake PIN</span>
                  </div>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight">
                    Your Secret Handshake PIN
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm font-medium text-ink/70 max-w-md mx-auto leading-relaxed">
                    When you meet {booking.companionName} in person at {booking.venueName}, share this 4-digit PIN verbally so they can begin the session clock.
                  </p>

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
                    <strong>Safety Rule:</strong> Never send this PIN in chat or SMS beforehand. Share it out loud in person once you are both at the public venue.
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto text-center">
                  <div className="inline-flex items-center gap-1.5 border-2 border-ink bg-lime px-3 py-1 text-xs font-black uppercase tracking-wider mb-3">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Host Action Required</span>
                  </div>
                  <h2 className="text-2xl font-black text-ink uppercase tracking-tight">
                    Enter Member 4-Digit PIN
                  </h2>
                  <p className="mt-2 text-xs text-ink/70">
                    Ask {booking.memberName} for the secret 4-digit PIN displayed on their screen at {booking.venueName}.
                  </p>

                  <form onSubmit={handleVerifyPin} className="mt-6 flex flex-col items-center gap-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="----"
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
                      className="w-full border-2 border-ink bg-ink px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-brutal btn-press disabled:opacity-50 cursor-pointer"
                    >
                      {isVerifying ? "Validating PIN..." : "Validate PIN & Start Session Clock"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* STATE 2: IN-PROGRESS + SOS AVAILABLE AT ALL TIMES */}
          {booking.status === "IN_PROGRESS" && (
            <div className="space-y-6">
              <div className="border-brutal shadow-brutal bg-white p-6 sm:p-8 text-center">
                <div className="inline-flex items-center gap-1.5 border-2 border-ink bg-lime px-3.5 py-1 text-xs font-black uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Session Live In Progress</span>
                </div>

                <div className="mt-6 text-5xl sm:text-6xl font-mono font-black tracking-tight text-ink">
                  {hoursPart > 0 ? `${String(hoursPart).padStart(2, "0")}:` : ""}
                  {String(minutesPart).padStart(2, "0")}:{String(secondsPart).padStart(2, "0")}
                </div>
                <p className="mt-2 text-xs font-bold text-ink/70">
                  Scheduled Duration: {booking.durationHours} Hour{booking.durationHours > 1 ? "s" : ""} ({booking.activityTitle})
                </p>

                <div className="mx-auto mt-6 h-3 max-w-md overflow-hidden border-2 border-ink bg-paper">
                  <div
                    className="h-full bg-ink transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleCompleteSession}
                    disabled={isCompleting}
                    className="border-2 border-ink bg-sunny px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-ink shadow-brutal btn-press disabled:opacity-50 cursor-pointer"
                  >
                    {isCompleting ? "Releasing 70% Escrow..." : "Complete Session & Release Escrow"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PERSISTENT SOS PANEL (Available for CONFIRMED & IN_PROGRESS scheduled meetings) */}
          {(booking.status === "CONFIRMED" || booking.status === "IN_PROGRESS") && (
            <div className="border-brutal shadow-brutal bg-danger/10 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-danger" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-danger">
                      Emergency Safety Protocol (SOS)
                    </h3>
                  </div>
                  <p className="mt-1 text-xs font-bold text-ink/80 leading-relaxed">
                    {sosAlertId
                      ? `SOS Alert #${sosAlertId} logged with your live GPS coordinates.`
                      : "Press SOS anytime during a scheduled meetup to transmit your live GPS coordinates to Safety Operations and access 112 Emergency Dial."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleTriggerSos}
                    disabled={sosDispatching}
                    className="flex items-center justify-center gap-2 border-2 border-ink bg-danger px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press cursor-pointer disabled:opacity-60"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>{sosDispatching ? "Sending GPS..." : "Trigger Live SOS"}</span>
                  </button>
                  <a
                    href="tel:112"
                    className="flex items-center justify-center gap-1.5 border-2 border-ink bg-white px-4 py-3 text-xs font-black uppercase tracking-wider text-danger shadow-brutal-sm hover:bg-rose-50"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Call 112</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: COMPLETED SESSION */}
          {booking.status === "COMPLETED" && (
            <div className="space-y-6">
              <div className="border-brutal shadow-brutal bg-lime p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-ink" />
                <h2 className="mt-3 text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight">
                  Session Completed Successfully
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-bold text-ink/80">
                  70% Host Payout ({booking.companionFee.toFixed(2)} INR) has been credited to {booking.companionName}&apos;s Host Wallet.
                </p>
              </div>

              <div className="border-brutal shadow-brutal bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-ink">
                      70-30 Escrow Settlement Receipt
                    </h3>
                  </div>
                  <span className="border border-ink bg-lime px-2.5 py-0.5 text-[10px] font-black uppercase">
                    Settled
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-ink">
                  <div>
                    <p className="text-ink/60">70% Host Wallet Credit:</p>
                    <p className="text-2xl font-black text-ink mt-0.5">
                      INR {booking.companionFee.toFixed(2)}
                    </p>
                    <p className="mt-3 text-ink/60">Destination UPI ID:</p>
                    <p className="font-bold text-ink">
                      {payoutData?.recipientUpiId || booking.companionUpiId || "Configured in Host Portal"}
                    </p>
                  </div>
                  <div>
                    <p className="text-ink/60">Total Meetup Paid:</p>
                    <p className="font-mono text-sm text-ink mt-0.5">
                      INR {booking.totalAmount.toFixed(2)} (30% GST, Razorpay &amp; Platform)
                    </p>
                    <p className="mt-3 text-ink/60">Settlement Reference:</p>
                    <p className="font-mono text-xs text-emerald-700 font-bold">
                      {payoutData?.utr || `MTZ-${booking.bookingNumber}`}
                    </p>
                  </div>
                </div>
              </div>

              {viewerRole === "MEMBER" && (
                <div className="border-brutal shadow-brutal bg-white p-6 sm:p-8">
                  {reviewSubmitted ? (
                    <div className="py-6 text-center">
                      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                      <h3 className="mt-3 text-lg font-black text-ink uppercase">
                        Rating &amp; Feedback Submitted
                      </h3>
                      <p className="text-xs font-bold text-ink/70 mt-1">
                        Thank you for keeping our community verified and trustworthy.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-wider text-ink">
                        Rate Your Meetup Experience
                      </h3>
                      <p className="text-xs font-medium text-ink/70">
                        How was your meetup with {booking.companionName}?
                      </p>

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
                                star <= reviewScore ? "fill-amber-400 text-ink" : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Share honest feedback about punctuality and conversation..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full border-2 border-ink bg-paper p-3.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                      />

                      <button
                        type="submit"
                        className="border-2 border-ink bg-ink px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press cursor-pointer"
                      >
                        Submit Verified Review
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
