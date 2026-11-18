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
} from "lucide-react";
import { MOCK_COMPANIONS, MOCK_ACTIVITIES } from "@/lib/data";
import { calculateEscrowBreakdown } from "@/lib/escrow";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const companionId = String(params.companionId || "comp_01");

  const companion = useMemo(() => {
    return MOCK_COMPANIONS.find((c) => c.id === companionId) || MOCK_COMPANIONS[0];
  }, [companionId]);

  // Form states
  const [selectedActivity, setSelectedActivity] = useState<string>("act_01");
  const [durationHours, setDurationHours] = useState<number>(1);
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 24 * 3600000);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>("04:00 PM");
  const [venueName, setVenueName] = useState<string>("Blue Tokai Coffee Roasters");
  const [venueAddress, setVenueAddress] = useState<string>("Plot 11, Hauz Khas Village, New Delhi");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <div className="mx-auto max-w-3xl pb-24 md:pb-16 px-1 sm:px-0">
      {/* Back link */}
      <Link
        href="/app/dashboard"
        className="inline-flex items-center gap-1 text-xs font-black text-[#102A43] hover:underline mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Directory</span>
      </Link>

      {/* Host Profile Header Card */}
      <div className="flex flex-col gap-4 rounded-xl border-2 border-[#102A43] bg-white p-5 shadow-[4px_4px_0px_0px_#102A43] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-[#102A43]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={companion.avatarUrl}
              alt={companion.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black text-[#102A43]">{companion.name}</h1>
              <ShieldCheck className="h-4 w-4 text-green-600" />
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs font-bold text-[#486581]">
              <MapPin className="h-3.5 w-3.5 text-[#102A43]" />
              <span>{companion.city}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-[#102A43]">
                <Star className="h-3 w-3 fill-[#FFD670]" />
                <span>{companion.ratingAverage}</span>
                <span className="text-gray-400">({companion.totalReviews})</span>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-[#334E68] line-clamp-1 max-w-md">
              {companion.shortBio}
            </p>
          </div>
        </div>

        <div className="rounded-lg border-2 border-[#102A43] bg-[#E9FF70] px-4 py-2 text-center sm:text-right">
          <span className="text-[10px] font-black uppercase text-[#102A43]">Host Rate</span>
          <div className="text-xl font-black text-[#102A43]">₹{companion.hourlyRate}<span className="text-xs">/hr</span></div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmitBooking} className="mt-6 space-y-6">
        {/* Step 1: Activity Selection */}
        <div className="rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#102A43]">
            1. Select Meetup Activity
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {MOCK_ACTIVITIES.map((act) => {
              const isSelected = selectedActivity === act.id;
              return (
                <button
                  type="button"
                  key={act.id}
                  onClick={() => setSelectedActivity(act.id)}
                  className={`flex flex-col items-start rounded-lg border-2 border-[#102A43] p-3 text-left transition ${
                    isSelected
                      ? "bg-[#70D6FF] shadow-[2px_2px_0px_0px_#102A43]"
                      : "bg-[#FFFDF9] hover:bg-[#F0EDE6]"
                  }`}
                >
                  <span className="text-xs font-black text-[#102A43]">{act.title}</span>
                  <span className="mt-1 text-[11px] text-[#486581] line-clamp-2">
                    {act.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Duration, Date & Time */}
        <div className="rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#102A43]">
            2. Schedule Duration & Time Slot
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-black text-[#102A43] mb-1.5">
                Duration (Hours)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map((hrs) => (
                  <button
                    type="button"
                    key={hrs}
                    onClick={() => setDurationHours(hrs)}
                    className={`flex-1 rounded-lg border-2 border-[#102A43] py-2 text-xs font-black ${
                      durationHours === hrs
                        ? "bg-[#FF7AC6] text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
                        : "bg-[#FFFDF9] text-[#102A43] hover:bg-[#F0EDE6]"
                    }`}
                  >
                    {hrs} {hrs === 1 ? "Hour" : "Hours"}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-black text-[#102A43] mb-1.5">
                Meeting Date
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-lg border-2 border-[#102A43] bg-[#FFFDF9] px-3 py-2 text-xs font-bold text-[#102A43] outline-none"
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-xs font-black text-[#102A43] mb-1.5">
                Start Time
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-lg border-2 border-[#102A43] bg-[#FFFDF9] px-3 py-2 text-xs font-bold text-[#102A43] outline-none cursor-pointer"
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
        <div className="rounded-xl border-2 border-[#102A43] bg-white p-6 shadow-[4px_4px_0px_0px_#102A43]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#102A43]">
              3. Verified Public Venue
            </h2>
            <span className="rounded bg-yellow-100 border border-yellow-400 px-2 py-0.5 text-[10px] font-black text-yellow-800">
              Strictly Public Only
            </span>
          </div>

          <p className="mt-1 text-xs text-[#627D98]">
            To comply with safety standards, sessions must take place at public coffee shops, restaurants, or malls.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-black text-[#102A43] mb-1">
                Venue Name (Cafe / Restaurant)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Blue Tokai Coffee Roasters / Third Wave Coffee"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full rounded-lg border-2 border-[#102A43] bg-[#FFFDF9] px-3.5 py-2 text-xs font-bold text-[#102A43] placeholder-[#9FB3C8] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#102A43] mb-1">
                Public Address & Neighborhood
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Plot 11, Hauz Khas Village, Near Deer Park, New Delhi"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                className="w-full rounded-lg border-2 border-[#102A43] bg-[#FFFDF9] px-3.5 py-2 text-xs font-bold text-[#102A43] placeholder-[#9FB3C8] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Transparent Escrow Billing Breakdown Card */}
        <div className="rounded-xl border-2 border-[#102A43] bg-[#FFF9E6] p-6 shadow-[4px_4px_0px_0px_#102A43]">
          <div className="flex items-center justify-between border-b-2 border-[#102A43] pb-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#102A43]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#102A43]">
                4. Escrow Deposit Calculation
              </h2>
            </div>
            <span className="rounded bg-[#E9FF70] border border-[#102A43] px-2 py-0.5 text-[10px] font-black text-[#102A43]">
              100% Escrow Protected
            </span>
          </div>

          <div className="mt-4 space-y-2 text-xs font-bold text-[#334E68]">
            <div className="flex justify-between">
              <span>Companion Fee ({durationHours} hr @ ₹{companion.hourlyRate}/hr):</span>
              <span className="text-[#102A43]">₹{escrow.companionFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Convenience & Safety Fee:</span>
              <span className="text-[#102A43]">₹{escrow.platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18% on convenience fee):</span>
              <span className="text-[#102A43]">₹{escrow.gstAmount.toFixed(2)}</span>
            </div>

            <div className="border-t-2 border-[#102A43] pt-3 flex justify-between text-base font-black text-[#102A43]">
              <span>Total Escrow Deposit:</span>
              <span className="text-lg">₹{escrow.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Escrow Guarantee Callout */}
          <div className="mt-4 rounded-lg border border-[#102A43] bg-white p-3 text-[11px] font-medium text-[#486581]">
            <p className="font-bold text-[#102A43]">Escrow Guarantee:</p>
            Your ₹{escrow.totalAmount.toFixed(2)} deposit is safely retained in platform escrow. The companion is NOT paid until you meet in person and provide the secret 4-digit Handshake PIN. If the companion fails to accept within 12 hours, 100% of this deposit is instantly refunded.
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl border-2 border-[#102A43] bg-[#E9FF70] py-4 text-center text-sm font-black uppercase text-[#102A43] shadow-[4px_4px_0px_0px_#102A43] transition hover:bg-[#D4E856] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#102A43] disabled:opacity-50"
        >
          {isSubmitting
            ? "Securing Escrow Deposit..."
            : `Pay ₹${escrow.totalAmount.toFixed(2)} & Send Booking Request`}
        </button>
      </form>
    </div>
  );
}
