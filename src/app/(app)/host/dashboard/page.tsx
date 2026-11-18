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
} from "lucide-react";
import { BookingRecord } from "@/lib/bookings";

export default function HostDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "completed">("pending");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Payout simulation state
  const [walletBalance, setWalletBalance] = useState<number>(4491.00);
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

  const handleSimulateCashfreePayout = () => {
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
    <div className="mx-auto max-w-5xl pb-24 md:pb-16 px-1 sm:px-0">
      {/* Header & Role Switcher Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border-2 border-[#102A43] bg-[#70D6FF] p-6 shadow-[4px_4px_0px_0px_#102A43] sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-white border border-[#102A43] px-2 py-0.5 text-xs font-black uppercase text-[#102A43]">
              HOST PORTAL
            </span>
            <span className="text-xs font-bold text-[#102A43]">Vanshika Sharma (Host #CMP-H104)</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-[#102A43]">
            Companion Management Dashboard
          </h1>
          <p className="mt-1 text-xs text-[#102A43] font-medium">
            Manage incoming session requests, verify 4-digit pins, and withdraw earnings.
          </p>
        </div>

        <Link
          href="/app/dashboard"
          className="rounded-lg border-2 border-[#102A43] bg-white px-4 py-2 text-center text-xs font-black text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#F0EDE6]"
        >
          Switch to Member View
        </Link>
      </div>

      {/* Top Financial Stats Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {/* Available Wallet Payout */}
        <div className="rounded-xl border-2 border-[#102A43] bg-[#E9FF70] p-5 shadow-[4px_4px_0px_0px_#102A43]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#102A43]">
              Available for Payout
            </span>
            <Wallet className="h-4 w-4 text-[#102A43]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#102A43]">
            ₹{walletBalance.toFixed(2)}
          </div>
          <button
            onClick={handleSimulateCashfreePayout}
            disabled={walletBalance <= 0 || payoutProcessing}
            className="mt-3 w-full rounded-lg border-2 border-[#102A43] bg-white py-1.5 text-center text-[11px] font-black uppercase text-[#102A43] hover:bg-[#F0EDE6] disabled:opacity-50"
          >
            {payoutProcessing ? "Processing UPI..." : "Instant Cashfree Payout"}
          </button>
        </div>

        {/* Pending Escrow */}
        <div className="rounded-xl border-2 border-[#102A43] bg-white p-5 shadow-[4px_4px_0px_0px_#102A43]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#627D98]">
              Pending in Escrow
            </span>
            <Clock className="h-4 w-4 text-[#627D98]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#102A43]">
            ₹{pendingEscrowTotal.toFixed(2)}
          </div>
          <p className="mt-3 text-[10px] text-[#627D98]">
            Held in escrow until in-person 4-digit PIN verification
          </p>
        </div>

        {/* Host Verified Rating */}
        <div className="rounded-xl border-2 border-[#102A43] bg-white p-5 shadow-[4px_4px_0px_0px_#102A43]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#627D98]">
              Host Trust Score
            </span>
            <ShieldCheck className="h-4 w-4 text-green-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#102A43]">
            4.9 <span className="text-sm font-bold text-gray-400">/ 5.0</span>
          </div>
          <p className="mt-3 text-[10px] text-green-700 font-bold">
            100% Aadhaar & Background Verified
          </p>
        </div>
      </div>

      {/* Payout Notification */}
      {payoutSuccess && (
        <div className="mt-4 rounded-xl border-2 border-green-600 bg-green-50 p-4 text-xs font-bold text-green-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>
              Cashfree Payout Transfer Successful: ₹4,491.00 dispatched instantly to UPI ID: <strong>vanshika@okhdfcbank</strong> (UTR: CF2026849201).
            </span>
          </div>
          <button onClick={() => setPayoutSuccess(false)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Notification Banner */}
      {notification && (
        <div
          className={`mt-4 rounded-xl border-2 p-4 text-xs font-bold flex items-center gap-2 ${
            notification.type === "success"
              ? "border-green-600 bg-green-50 text-green-800"
              : "border-red-600 bg-red-50 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Booking Tabs (Scrollable on mobile) */}
      <div className="mt-8 flex gap-2 border-b-2 border-[#102A43] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("pending")}
          className={`rounded-lg border-2 border-[#102A43] px-4 py-2 text-xs font-black uppercase transition ${
            activeTab === "pending"
              ? "bg-[#FF7AC6] text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
              : "bg-white text-[#627D98] hover:text-[#102A43]"
          }`}
        >
          Incoming Requests ({pendingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("confirmed")}
          className={`rounded-lg border-2 border-[#102A43] px-4 py-2 text-xs font-black uppercase transition ${
            activeTab === "confirmed"
              ? "bg-[#70D6FF] text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
              : "bg-white text-[#627D98] hover:text-[#102A43]"
          }`}
        >
          Confirmed Sessions ({confirmedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`rounded-lg border-2 border-[#102A43] px-4 py-2 text-xs font-black uppercase transition ${
            activeTab === "completed"
              ? "bg-[#E9FF70] text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
              : "bg-white text-[#627D98] hover:text-[#102A43]"
          }`}
        >
          Past / Completed ({completedBookings.length})
        </button>
      </div>

      {/* Tab 1: Incoming Pending Booking Requests */}
      {activeTab === "pending" && (
        <div className="mt-6 space-y-4">
          {pendingBookings.length === 0 ? (
            <div className="rounded-xl border-2 border-[#102A43] bg-white p-8 text-center text-xs font-bold text-[#627D98]">
              No pending booking requests at this time. New requests will appear here with an active 12-hour response timer.
            </div>
          ) : (
            pendingBookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]"
              >
                <div className="flex flex-col justify-between gap-2 border-b-2 border-[#102A43] pb-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#FF7AC6] border border-[#102A43] px-2 py-0.5 text-[10px] font-black uppercase text-[#102A43]">
                      ACTION REQUIRED
                    </span>
                    <span className="text-xs font-black text-[#102A43]">
                      #{b.bookingNumber} • {b.activityTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-800 bg-yellow-100 border border-yellow-400 px-2.5 py-0.5 rounded-md">
                    <Clock className="h-3.5 w-3.5" />
                    <span>12h SLA Deadline Active</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs text-[#334E68]">
                  <div>
                    <p className="font-black text-[#102A43]">Member Details:</p>
                    <p className="mt-1 font-bold">{b.memberName} ({b.memberPhone})</p>
                    <p className="mt-2 font-black text-[#102A43]">Scheduled Time:</p>
                    <p className="mt-0.5 font-bold">{new Date(b.scheduledDate).toLocaleString()} ({b.durationHours} Hour session)</p>
                  </div>
                  <div>
                    <p className="font-black text-[#102A43]">Public Meeting Venue:</p>
                    <p className="mt-1 font-bold">{b.venueName}</p>
                    <p className="mt-0.5 text-[#627D98]">{b.venueAddress}</p>
                    <p className="mt-2 font-black text-[#102A43]">Host Payout upon Handshake:</p>
                    <p className="mt-0.5 text-sm font-black text-green-700">₹{b.companionFee.toFixed(2)} (Escrow Held: ₹{b.totalAmount.toFixed(2)})</p>
                  </div>
                </div>

                {/* Host Actions */}
                <div className="mt-6 flex flex-col gap-3 pt-4 border-t-2 border-[#102A43] sm:flex-row">
                  <button
                    onClick={() => handleRespond(b.id, "ACCEPT")}
                    disabled={actionLoading === b.id}
                    className="flex-1 rounded-lg border-2 border-[#102A43] bg-[#E9FF70] py-2.5 text-center text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#D4E856] disabled:opacity-50"
                  >
                    {actionLoading === b.id ? "Updating..." : "Accept Booking (Confirm Session)"}
                  </button>
                  <button
                    onClick={() => handleRespond(b.id, "DECLINE")}
                    disabled={actionLoading === b.id}
                    className="rounded-lg border-2 border-[#102A43] bg-white px-6 py-2.5 text-center text-xs font-black uppercase text-red-600 shadow-[2px_2px_0px_0px_#102A43] hover:bg-red-50 disabled:opacity-50"
                  >
                    Decline & Refund
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Confirmed Sessions */}
      {activeTab === "confirmed" && (
        <div className="mt-6 space-y-4">
          {confirmedBookings.length === 0 ? (
            <div className="rounded-xl border-2 border-[#102A43] bg-white p-8 text-center text-xs font-bold text-[#627D98]">
              No confirmed bookings currently active. Accepted requests will show here with real-time chat coordination.
            </div>
          ) : (
            confirmedBookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]"
              >
                <div className="flex items-center justify-between border-b-2 border-[#102A43] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-green-100 border border-green-500 px-2 py-0.5 text-[10px] font-black uppercase text-green-800">
                      CONFIRMED
                    </span>
                    <span className="text-xs font-black text-[#102A43]">
                      #{b.bookingNumber} • {b.activityTitle}
                    </span>
                  </div>
                  <span className="text-xs font-black text-green-700">
                    Host Payout: ₹{b.companionFee.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs text-[#334E68]">
                  <div>
                    <p className="font-black text-[#102A43]">Member:</p>
                    <p className="mt-1 font-bold">{b.memberName} ({b.memberPhone})</p>
                    <p className="mt-2 font-black text-[#102A43]">Meeting Location:</p>
                    <p className="mt-0.5 font-bold">{b.venueName}</p>
                    <p className="text-[#627D98]">{b.venueAddress}</p>
                  </div>
                  <div>
                    <p className="font-black text-[#102A43]">In-Person Meeting Protocol:</p>
                    <p className="mt-1 text-[11px] text-[#627D98]">
                      Ask the member for their secret 4-digit PIN when meeting at the venue. Entering the PIN validates arrival and starts the session.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-[#102A43] flex items-center justify-between">
                  <Link
                    href={`/app/session/${b.id}`}
                    className="flex items-center gap-1.5 rounded-lg border-2 border-[#102A43] bg-[#E9FF70] px-4 py-2 text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#D4E856]"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Enter Session & PIN Handshake</span>
                  </Link>

                  <Link
                    href={`/app/chat/${b.id}`}
                    className="flex items-center gap-1.5 rounded-lg border-2 border-[#102A43] bg-[#70D6FF] px-4 py-2 text-xs font-black text-[#102A43] shadow-[2px_2px_0px_0px_#102A43] hover:bg-[#5BC5F2]"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Open Safe Coordination Chat</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Completed / Past Sessions */}
      {activeTab === "completed" && (
        <div className="mt-6 space-y-4">
          {completedBookings.length === 0 ? (
            <div className="rounded-xl border-2 border-[#102A43] bg-white p-8 text-center text-xs font-bold text-[#627D98]">
              No past sessions recorded yet.
            </div>
          ) : (
            completedBookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border-2 border-[#102A43] bg-white p-4 shadow-[2px_2px_0px_0px_#102A43] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-[#102A43]">
                    #{b.bookingNumber} • {b.activityTitle}
                  </div>
                  <div className="text-[11px] text-[#627D98]">
                    {b.venueName} • Status: {b.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-[#102A43]">
                    ₹{b.companionFee.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[#627D98]">
                    Escrow: {b.escrowStatus}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
