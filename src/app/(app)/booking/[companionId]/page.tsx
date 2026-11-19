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

      router.push(`/app/booking/${companion.id}/success?bookingId=${data.booking.id}`);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-4 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Back Link */}
        <Link
          href={`/companion/${companion.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-4 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Profile</span>
        </Link>

        {/* Companion Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
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
                <h1 className="text-lg font-bold text-slate-900">{companion.displayName}</h1>
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

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left sm:text-right">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
              Meetup Rate
            </span>
            <div className="text-lg font-bold text-slate-900">
              ₹{companion.hourlyRate}
              <span className="text-xs font-normal text-slate-500">/hr</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmitBooking} className="mt-5 space-y-5">
          {/* Step 1: Activity Selection */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Select Meetup Activity
              </h2>
              <span className="text-[11px] text-slate-500">Public spaces only</span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {MOCK_ACTIVITIES.map((act) => {
                const isSelected = selectedActivity === act.id || selectedActivity === act.slug;
                return (
                  <button
                    type="button"
                    key={act.id}
                    onClick={() => setSelectedActivity(act.id)}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? "border-[#101828] bg-[#101828] text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{act.title}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <p
                        className={`mt-0.5 text-[11px] line-clamp-1 ${
                          isSelected ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {act.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Duration, Date & Time */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              2. Schedule Duration & Time Slot
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Duration Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Duration (Hours)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((hrs) => (
                    <button
                      type="button"
                      key={hrs}
                      onClick={() => setDurationHours(hrs)}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition border ${
                        durationHours === hrs
                          ? "bg-[#101828] text-white border-[#101828]"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {hrs} {hrs === 1 ? "Hr" : "Hrs"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Meeting Date
                </label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Start Time
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition cursor-pointer"
                >
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:30 PM">07:30 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Public Meeting Venue */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Verified Public Venue
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                Public places only
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              To keep everyone safe, all meetups must be in well-lit public cafes, restaurants, or shopping centers.
            </p>

            {/* Quick Venue Suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {popularVenues.map((pv) => (
                <button
                  type="button"
                  key={pv.name}
                  onClick={() => {
                    setVenueName(pv.name);
                    setVenueAddress(pv.address);
                  }}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 transition"
                >
                  {pv.name}
                </button>
              ))}
            </div>

            <div className="space-y-3">
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

          {/* Step 4: Transparent Escrow Billing Breakdown Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-slate-700" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  4. Escrow Deposit Breakdown
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                100% Escrow Protected
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Companion Meetup Fee ({durationHours} hr @ ₹{companion.hourlyRate}/hr):</span>
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

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-sm font-bold text-slate-900">
                <span>Total Escrow Deposit:</span>
                <span className="text-lg font-extrabold">₹{escrow.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Escrow Guarantee Callout */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Our Escrow Guarantee:</span>
              </div>
              <p>
                Your deposit is safely held in platform escrow. The companion is NOT paid until you meet in person and verify the secret 4-digit Handshake PIN. If the companion declines or does not respond within 12 hours, 100% of your deposit is immediately refunded.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#101828] hover:bg-black py-4 text-center text-sm font-bold text-white shadow-md transition active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting
              ? "Securing Escrow Deposit..."
              : `Deposit ₹${escrow.totalAmount.toFixed(2)} & Request Meetup`}
          </button>
        </form>
      </div>
    </div>
  );
}
