"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Send,
  Sparkles,
  Lock,
  ChevronRight,
  KeyRound,
} from "lucide-react";
import { BookingRecord } from "@/lib/bookings";

export default function HostDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "completed">("pending");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // In-person verification PIN state
  const [pinInput, setPinInput] = useState<{ [bookingId: string]: string }>({});
  const [pinVerifying, setPinVerifying] = useState<string | null>(null);

  // Payout state
  const [walletBalance, setWalletBalance] = useState<number>(4491.0);
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);
  const [payoutProcessing, setPayoutProcessing] = useState<boolean>(false);

  const fetchBookings = () => {
    fetch("/api/bookings?role=COMPANION")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bookings) {
          setBookings(data.bookings);
        }
      })
      .catch((err) => console.error("Error fetching bookings:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRespond = async (bookingId: string, action: "ACCEPT" | "DECLINE") => {
    setActionLoading(bookingId);
    setNotification(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update booking status.");
      }

      setNotification({
        message:
          action === "ACCEPT"
            ? "Booking accepted! Real-time coordination chat is now unlocked."
            : "Booking declined. Escrow payment was returned to the member.",
        type: "success",
      });

      fetchBookings();
    } catch (err) {
      setNotification({ message: (err as Error).message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyPin = async (bookingId: string) => {
    const pin = pinInput[bookingId];
    if (!pin || pin.length !== 4) {
      alert("Please enter the 4-digit Handshake PIN provided by the member in person.");
      return;
    }

    setPinVerifying(bookingId);
    try {
      const res = await fetch(`/api/session/${bookingId}/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid PIN. Please ask member to check their booking screen.");
      }

      setNotification({
        message: "PIN verified! Meetup completed and escrow earnings credited to your wallet balance.",
        type: "success",
      });
      fetchBookings();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setPinVerifying(null);
    }
  };

  const handleInstantPayout = () => {
    if (walletBalance <= 0) return;
    setPayoutProcessing(true);

    setTimeout(() => {
      setPayoutProcessing(false);
      setPayoutSuccess(true);
      setWalletBalance(0);
    }, 1200);
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING_ACCEPTANCE");
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "IN_PROGRESS");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED" || b.status === "CANCELLED_BY_COMPANION");

  const pendingEscrowTotal = pendingBookings.reduce((sum, b) => sum + b.companionFee, 0);

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header & Role Switcher Banner */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Companion Host Portal</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>ID-checked Host</span>
              </span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Host Management Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage incoming meetup invitations, verify in-person 4-digit PINs, and withdraw your earnings.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition"
          >
            <span>Switch to Member View</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Top Financial Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Available Wallet Payout */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Available for Payout</span>
              <Wallet className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ₹{walletBalance.toFixed(2)}
            </div>
            <button
              onClick={handleInstantPayout}
              disabled={walletBalance <= 0 || payoutProcessing}
              className="w-full rounded-full bg-[#101828] py-2.5 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95 disabled:opacity-40"
            >
              {payoutProcessing ? "Processing UPI..." : "Instant UPI Payout"}
            </button>
          </div>

          {/* Pending Escrow */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Pending in Escrow</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ₹{pendingEscrowTotal.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Locked safely in escrow until you meet in person and verify the 4-digit Handshake PIN.
            </p>
          </div>

          {/* Host Rating */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Trust & Rating</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              5.0 <span className="text-sm font-normal text-slate-400">/ 5.0</span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Aadhaar & Background Verified</span>
            </p>
          </div>
        </div>

        {/* Payout Success Alert */}
        {payoutSuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Instant UPI Payout Dispatched! ₹4,491.00 transferred directly to your registered UPI VPA.</span>
          </div>
        )}

        {/* Global Action Notification */}
        {notification && (
          <div
            className={`rounded-2xl border p-4 text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
              notification.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Booking Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab("pending")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "pending"
                  ? "bg-[#101828] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Pending Requests ({pendingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("confirmed")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "confirmed"
                  ? "bg-[#101828] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Confirmed Meetups ({confirmedBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "completed"
                  ? "bg-[#101828] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Past & Completed ({completedBookings.length})
            </button>
          </div>

          {/* Tab 1: Pending Acceptance */}
          {activeTab === "pending" && (
            <div className="space-y-4">
              {pendingBookings.length > 0 ? (
                pendingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">
                          {b.activityTitle} with {b.memberName || "Verified Member"}
                        </span>
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                          12h SLA Pending
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{new Date(b.scheduledDate).toLocaleString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{b.venueName} · {b.venueAddress}</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          Earnings: ₹{b.companionFee.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        disabled={actionLoading === b.id}
                        onClick={() => handleRespond(b.id, "ACCEPT")}
                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 text-xs shadow-md transition active:scale-95 disabled:opacity-50"
                      >
                        {actionLoading === b.id ? "Updating..." : "Accept Meetup"}
                      </button>
                      <button
                        disabled={actionLoading === b.id}
                        onClick={() => handleRespond(b.id, "DECLINE")}
                        className="rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-5 py-2.5 text-xs transition active:scale-95 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-2">
                  <Clock className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="font-bold text-slate-800">No pending invitations right now</p>
                  <p className="text-xs">New invitations from members will appear here in real time.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Confirmed Meetups (with In-Person PIN Release) */}
          {activeTab === "confirmed" && (
            <div className="space-y-4">
              {confirmedBookings.length > 0 ? (
                confirmedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">
                            #{b.bookingNumber} · {b.activityTitle}
                          </span>
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            CONFIRMED
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {b.venueName} · Scheduled: {new Date(b.scheduledDate).toLocaleString()}
                        </div>
                      </div>

                      <Link
                        href={`/chat/${b.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#101828] text-white px-5 py-2 text-xs font-bold shadow-md hover:bg-black transition"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Open Private Chat</span>
                      </Link>
                    </div>

                    {/* In-Person PIN Verification Box */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <KeyRound className="h-4 w-4 text-blue-600" />
                          <span>Release Escrow with Member's 4-Digit Handshake PIN</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Ask the member for their secret 4-digit PIN when you meet in person to complete the session and credit ₹{b.companionFee.toFixed(2)} to your wallet.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="e.g. 5821"
                          value={pinInput[b.id] || ""}
                          onChange={(e) => setPinInput({ ...pinInput, [b.id]: e.target.value })}
                          className="w-24 px-3 py-2 text-center font-mono font-bold text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                        <button
                          disabled={pinVerifying === b.id}
                          onClick={() => handleVerifyPin(b.id)}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs shadow-md transition active:scale-95 disabled:opacity-50"
                        >
                          {pinVerifying === b.id ? "Verifying..." : "Verify PIN"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="font-bold text-slate-800">No active confirmed meetups</p>
                  <p className="text-xs">Accepted invitations will show up here for live coordination.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Past Completed Meetups */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              {completedBookings.length > 0 ? (
                completedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        #{b.bookingNumber} · {b.activityTitle}
                      </span>
                      <div className="text-slate-500 mt-0.5">
                        {b.venueName} · Completed {new Date(b.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 text-sm">
                        +₹{b.companionFee.toFixed(2)}
                      </span>
                      <span className="block text-[10px] text-slate-400">Escrow Released</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                  <p className="font-bold text-slate-800">No past meetups recorded yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
