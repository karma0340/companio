"use client";

import React, { useState } from "react";
import Link from "next/link";
import { validateIndianMobileNumber } from "@/lib/phone";
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Upload,
  Heart,
  Lock,
} from "lucide-react";

export default function CompanionApplyPage() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Mumbai",
    age: "24",
    displayName: "",
    bio: "",
    hourlyRate: "999",
    languages: "English, Hindi",
    activities: ["Café Chat", "City Walk"],
    idType: "Aadhaar Card",
    idNumber: "",
    agreePlatonic: true,
  });

  const handleActivityToggle = (act: string) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(act);
      return {
        ...prev,
        activities: exists
          ? prev.activities.filter((a) => a !== act)
          : [...prev.activities, act],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      const phoneCheck = validateIndianMobileNumber(formData.phone);
      if (!phoneCheck.isValid) {
        alert(phoneCheck.error || "Please enter a valid 10-digit Indian mobile number.");
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  const AVAILABLE_ACTIVITIES = [
    "Café Chat",
    "City Walk",
    "Gym Buddy",
    "Live Events",
    "Museum Visit",
    "Book Cafés",
    "Bitching & gossip",
    "Morning Run",
    "Street Food",
  ];

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 pb-28 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Link */}
        <Link
          href="/become-a-companion"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Become a Companion</span>
        </Link>

        {isSubmitted ? (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-14 text-center shadow-xl space-y-4">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600 animate-in zoom-in-50" />
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Submitted!
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for applying, {formData.displayName || formData.fullName}. Our trust & verification
              team reviews applications within 48 hours. We will contact you via WhatsApp and email for
              your quick 10-minute video onboarding check.
            </p>

            <div className="pt-6">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-full bg-[#101828] text-white px-8 py-3.5 text-xs sm:text-sm font-bold shadow-md hover:bg-black transition"
              >
                Explore Current Companions
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-lg space-y-8">
            {/* Header & Step Tracker */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 mb-3 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Host Verification Application</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Become a Verified Companion
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Step {step} of 3: {step === 1 ? "Basic Details" : step === 2 ? "Meetup Preferences" : "KYC & Verification"}
              </p>

              {/* Progress Bar */}
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Personal Contact Details */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Legal Name (as per Aadhaar/PAN)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Kinjal Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. kinjal@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number (+91 India)
                      </label>
                      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                        <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 border-r border-slate-200 select-none">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setFormData({ ...formData, phone: val });
                          }}
                          placeholder="9812345678"
                          className="w-full px-3 py-2 bg-transparent text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Pune">Pune</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Age (Must be 18+)
                      </label>
                      <input
                        type="number"
                        min={18}
                        max={65}
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Companion Preferences & Profile */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Display First Name (Visible to members)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        placeholder="e.g. Kinjal"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Rate per Meetup (₹)
                      </label>
                      <input
                        type="number"
                        min={499}
                        max={1499}
                        step={50}
                        required
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Bio & Personal Vibe (What you enjoy doing in the city)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="e.g. Weekend café explorer, architecture nerd, and indie gig enthusiast in Bandra."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    />
                  </div>

                  {/* Activity Pills Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Meetup Activities You Want to Offer
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_ACTIVITIES.map((act) => {
                        const isSelected = formData.activities.includes(act);
                        return (
                          <button
                            type="button"
                            key={act}
                            onClick={() => handleActivityToggle(act)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-2xs"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {act}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: KYC & Safety Agreement */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Government ID Type
                      </label>
                      <select
                        value={formData.idType}
                        onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Passport">Passport</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Last 4 Digits of ID
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        placeholder="e.g. 5821"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>
                  </div>

                  {/* Photo Upload Simulator Box */}
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center space-y-2 hover:border-blue-400 transition cursor-pointer bg-slate-50/50">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="text-xs font-bold text-slate-800">
                      Upload Clear Portrait Photo & ID Document
                    </div>
                    <p className="text-[11px] text-slate-500">
                      High-resolution JPEG, PNG, or WebP. Verified securely for your ID-checked badge.
                    </p>
                  </div>

                  {/* Platonic Code of Conduct Agreement */}
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 space-y-2 text-xs text-amber-950">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <ShieldCheck className="h-4 w-4 text-amber-700" />
                      <span>Companio Strict Platonic Code of Conduct</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-900/90">
                      Companio is strictly for platonic social companionship (coffee, walks, events, workouts).
                      Zero tolerance for romantic, private, or inappropriate requests. All meetups occur in public places.
                    </p>

                    <label className="flex items-center gap-2 pt-2 cursor-pointer select-none font-semibold">
                      <input
                        type="checkbox"
                        required
                        checked={formData.agreePlatonic}
                        onChange={(e) => setFormData({ ...formData, agreePlatonic: e.target.checked })}
                        className="h-4 w-4 rounded border-amber-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>I agree to uphold the strictly platonic code of conduct.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[#101828] text-white px-8 py-3 text-xs sm:text-sm font-bold shadow-md hover:bg-black transition active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : step < 3 ? (
                    <>
                      <span>Continue to Step {step + 1}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Submit Companion Application</span>
                      <ShieldCheck className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
