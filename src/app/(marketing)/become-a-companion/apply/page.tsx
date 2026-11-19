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
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function CompanionApplyPage() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Bengaluru",
    age: "24",
    displayName: "",
    bio: "",
    hourlyRate: "499",
    languages: "English, Hindi",
    activities: ["Coffee & Conversations", "Cafe Hopping"],
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
    "Coffee & Conversations",
    "Cafe Hopping",
    "Gym Buddy",
    "Live Events & Concerts",
    "Museum Visit",
    "Book Cafes",
    "Morning Run",
    "Food Walks",
    "Shopping & Styling",
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Back Link */}
          <Link
            href="/become-a-companion"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Become a Companion</span>
          </Link>

          {isSubmitted ? (
            <div className="border-brutal shadow-brutal bg-lime p-8 sm:p-14 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border-3 border-ink bg-white shadow-brutal">
                <CheckCircle2 className="h-10 w-10 text-ink" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase text-ink tracking-tight">
                Application Submitted
              </h1>
              <p className="text-xs sm:text-sm font-bold text-ink/80 max-w-md mx-auto leading-relaxed">
                Thank you for applying, {formData.displayName || formData.fullName}. Our trust and verification desk reviews all applications within 48 hours. We will contact you via WhatsApp and email for your quick 10-minute video verification check.
              </p>

              <div className="pt-6">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center border-2 border-ink bg-ink text-white px-8 py-3.5 text-xs font-black uppercase tracking-wider shadow-brutal btn-press"
                >
                  Explore Current Companions
                </Link>
              </div>
            </div>
          ) : (
            <div className="border-brutal shadow-brutal bg-white p-6 sm:p-10 space-y-8">
              {/* Header & Step Tracker */}
              <div>
                <span className="border-2 border-ink bg-sunny px-3 py-1 text-xs font-black uppercase tracking-wider inline-block mb-3">
                  Host Verification Application
                </span>
                <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-ink">
                  Become a Verified Companion
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-medium text-ink/70">
                  Earn INR 499 - 1,299/hour sharing your city. Strictly platonic, public venues only.
                </p>

                {/* Step Indicators */}
                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
                  <div
                    className={`border-2 border-ink p-2 font-black uppercase ${
                      step >= 1 ? "bg-lime text-ink shadow-brutal" : "bg-paper text-ink/40"
                    }`}
                  >
                    1. Personal Info
                  </div>
                  <div
                    className={`border-2 border-ink p-2 font-black uppercase ${
                      step >= 2 ? "bg-lime text-ink shadow-brutal" : "bg-paper text-ink/40"
                    }`}
                  >
                    2. Companion Profile
                  </div>
                  <div
                    className={`border-2 border-ink p-2 font-black uppercase ${
                      step >= 3 ? "bg-lime text-ink shadow-brutal" : "bg-paper text-ink/40"
                    }`}
                  >
                    3. ID Verification
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: Personal Contact Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        Full Legal Name (as on Aadhaar)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Full legal name as on ID"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="you@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          WhatsApp Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="Enter 10-digit mobile number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Primary Metropolitan City
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none"
                        >
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Pune">Pune</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Kolkata">Kolkata</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Your Age (Must be 18+)
                        </label>
                        <input
                          type="number"
                          min={18}
                          max={70}
                          required
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Companion Persona & Hourly Rate */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        Public Display Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Public display name"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        Short Bio / Tagline
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Introduce yourself. What kind of places do you love showing around? What are your hobbies and favorite conversation topics?"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full border-2 border-ink bg-paper p-3.5 text-xs font-bold text-ink focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Hourly Rate (INR)
                        </label>
                        <select
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none"
                        >
                          <option value="499">INR 499 / hour (Recommended Starting Rate)</option>
                          <option value="699">INR 699 / hour</option>
                          <option value="899">INR 899 / hour</option>
                          <option value="1299">INR 1,299 / hour (Specialized Guide)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Spoken Languages
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Languages spoken (e.g. English, Hindi)"
                          value={formData.languages}
                          onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-2">
                        Accepted Activities (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {AVAILABLE_ACTIVITIES.map((act) => {
                          const isSelected = formData.activities.includes(act);
                          return (
                            <button
                              type="button"
                              key={act}
                              onClick={() => handleActivityToggle(act)}
                              className={`border-2 border-ink p-2.5 text-left text-xs transition ${
                                isSelected
                                  ? "bg-lime font-black shadow-brutal"
                                  : "bg-paper font-bold hover:bg-black/5"
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

                {/* STEP 3: Identity & Safety Checks */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="border-2 border-ink bg-pink/20 p-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <h3 className="text-xs font-black uppercase">Government Identity Verification</h3>
                      </div>
                      <p className="text-xs font-bold text-ink/70">
                        Government verification is mandatory under Indian safety compliance. Your Aadhaar number and document are encrypted and never shown to members.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        12-Digit Aadhaar Number
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        placeholder="XXXX XXXX XXXX"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value.replace(/\D/g, "") })}
                        className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-mono font-black text-ink placeholder:text-ink/40 focus:outline-none"
                      />
                    </div>

                    {/* Strict Platonic Guarantee Checkbox */}
                    <div className="border-2 border-ink bg-white p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={formData.agreePlatonic}
                          onChange={(e) => setFormData({ ...formData, agreePlatonic: e.target.checked })}
                          className="mt-0.5 h-4 w-4 border-2 border-ink accent-ink"
                        />
                        <span className="text-xs font-bold text-ink leading-relaxed">
                          I agree to Togethr&apos;s Strictly Platonic &amp; Public Venues policy. I understand that all meetups must be in public venues, that alcohol or romance is strictly forbidden, and that violations lead to immediate permanent ban and forfeiture of escrow earnings.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-ink">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="border-2 border-ink bg-paper px-6 py-2.5 text-xs font-black uppercase shadow-brutal btn-press"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="border-2 border-ink bg-ink px-8 py-3 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    <span>{step === 3 ? (isSubmitting ? "Submitting Application..." : "Submit Application") : "Next Step"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
