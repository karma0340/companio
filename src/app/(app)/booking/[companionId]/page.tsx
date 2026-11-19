"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Calendar,
  Coffee,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  ChevronLeft,
  Check,
  Info,
  Sparkles,
} from "lucide-react";
import { MOCK_COMPANIONS, MOCK_ACTIVITIES } from "@/lib/data";
import { calculateEscrowBreakdown } from "@/lib/escrow";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const companionId = String(params.companionId || "c-qkk6qfv6");

  const companion = useMemo(() => {
    return (
      MOCK_COMPANIONS.find((c) => c.id === companionId) ||
      MOCK_COMPANIONS.find((c) => c.displayName.toLowerCase() === "kinjal") ||
      MOCK_COMPANIONS[0]
    );
  }, [companionId]);

  // Form states
  const [selectedActivity, setSelectedActivity] = useState<string>("coffee");
  const [durationHours, setDurationHours] = useState<number>(1);
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 24 * 3600000);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>("04:00 PM");
  const [venueName, setVenueName] = useState<string>("Blue Tokai Coffee Roasters");
  const [venueAddress, setVenueAddress] = useState<string>("Hauz Khas / Bandra West, Public Area");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Popular public venue shortcuts
  const popularVenues = [
    { name: "Blue Tokai Coffee", address: "Local High-Street Roastery" },
    { name: "Third Wave Coffee", address: "City Center Cafe" },
    { name: "Starbucks", address: "Promenade Mall / Commercial Hub" },
    { name: "Paul / Cafe Delhi Heights", address: "Main Atrium Mall Food District" },
  ];

  // Escrow calculation
  const escrow = useMemo(() => {
    return calculateEscrowBreakdown(companion.hourlyRate, durationHours);
  }, [companion.hourlyRate, durationHours]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const fullDateTime = new Date(`${scheduledDate} ${timeSlot}`).toISOString();

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companionId: companion.id,
          activityId: selectedActivity,
          scheduledDate: fullDateTime,
          durationHours,
          venueName,
          venueAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create booking.");
      }

      router.push(`/booking/${companion.id}/success?bookingId=${data.booking.id}`);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Link */}
        <Link
          href={`/companion/${companion.id}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Profile</span>
        </Link>

        {/* Responsive Grid Layout: Left Wizard (7 cols) + Right Summary & Escrow (5 cols) */}
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Wizard */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Activity */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">1</span>
                  <span>Select Meetup Activity</span>
                </h2>
                <span className="text-xs text-slate-500">Public venues only</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {MOCK_ACTIVITIES.map((act) => {
                  const isSelected = selectedActivity === act.id;
                  return (
                    <button
                      type="button"
                      key={act.id}
                      onClick={() => setSelectedActivity(act.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold shadow-2xs"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span className="text-xs font-semibold">{act.title}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{act.suggestedDuration} hr typical</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date, Time & Duration */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">2</span>
                  <span>Date, Time & Duration</span>
                </h2>
                <span className="text-xs text-slate-500">12h host SLA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meetup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="01:30 PM">01:30 PM (Midday)</option>
                    <option value="04:00 PM">04:00 PM (Afternoon)</option>
                    <option value="06:30 PM">06:30 PM (Evening)</option>
                    <option value="08:30 PM">08:30 PM (Night Out)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={3}>3 hours</option>
                    <option value={4}>4 hours (Half Day)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Neutral Public Venue Selection */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">3</span>
                  <span>Public Meeting Venue</span>
                </h2>
                <span className="text-xs text-blue-600 font-medium">Neutral public locations only</span>
              </div>

              {/* Quick suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Popular public spots:</span>
                <div className="flex flex-wrap gap-2">
                  {popularVenues.map((pv) => (
                    <button
                      type="button"
                      key={pv.name}
                      onClick={() => {
                        setVenueName(pv.name);
                        setVenueAddress(pv.address);
                      }}
                      className="rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 text-xs text-slate-700 transition"
                    >
                      {pv.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blue Tokai Coffee Roasters"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Public Area & Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ground Floor, Bandra West / Connaught Place"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Companion Card & Escrow Summary (5 cols on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            {/* Companion Header Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={companion.avatarUrl}
                    alt={companion.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900">{companion.displayName}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                      <ShieldCheck className="h-3 w-3" />
                      ID-checked
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{companion.city}</span>
                    <span>•</span>
                    <span>Strictly Platonic</span>
                  </div>
                </div>
              </div>

              {/* Escrow Deposit Breakdown Card */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Escrow Deposit Breakdown
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                    100% Protected
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Companion Fee ({durationHours} hr @ ₹{companion.hourlyRate}/hr):</span>
                    <span className="font-semibold text-slate-900">₹{escrow.companionFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Safety & Escrow Fee:</span>
                    <span className="font-semibold text-slate-900">₹{escrow.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18% on platform fee):</span>
                    <span className="font-semibold text-slate-900">₹{escrow.gstAmount.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline text-sm font-bold text-slate-900">
                    <span>Total Deposit:</span>
                    <span className="text-xl font-extrabold text-blue-600">₹{escrow.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee Callout */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span>Escrow & Handshake Guarantee:</span>
                </div>
                <p>
                  Funds are held securely. The companion is paid only after in-person meetup PIN verification. If declined or expired after 12h, 100% is refunded.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#101828] hover:bg-black py-4 text-center text-sm font-bold text-white shadow-md transition active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting
                  ? "Securing Escrow Deposit..."
                  : `Deposit ₹${escrow.totalAmount.toFixed(2)} & Request Meetup`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
