"use client";

import React, { useState } from "react";
import { DollarSign, Clock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export function EarningsCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(15);
  const [hourlyRate, setHourlyRate] = useState<number>(499);
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "Bengaluru",
    languages: "English, Hindi",
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // 4.33 weeks per month average
  const monthlyEarnings = Math.round(hoursPerWeek * 4.33 * hourlyRate);
  const annualEarnings = monthlyEarnings * 12;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="rounded-2xl border border-[#262626] bg-[#121212] p-8">
      {/* Earnings Simulator */}
      <div>
        <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#D4AF37]" />
          <span>Interactive Earnings Calculator</span>
        </h3>
        <p className="mt-1 text-xs text-[#8E8E93]">
          Simulate how much you can earn as a verified companion based on your weekly availability.
        </p>

        {/* Sliders Grid */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {/* Hours Slider */}
          <div className="rounded-xl border border-[#222] bg-[#171717] p-5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#8E8E93]">Hours Hosted Per Week</span>
              <span className="font-bold text-white text-sm">{hoursPerWeek} hrs/wk</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="mt-4 w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="mt-2 flex justify-between text-[10px] text-[#666]">
              <span>5 hrs (Weekend)</span>
              <span>20 hrs (Part-time)</span>
              <span>35 hrs (Full)</span>
            </div>
          </div>

          {/* Rate Slider */}
          <div className="rounded-xl border border-[#222] bg-[#171717] p-5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#8E8E93]">Your Set Hourly Rate</span>
              <span className="font-bold text-white text-sm">₹{hourlyRate}/hr</span>
            </div>
            <input
              type="range"
              min="499"
              max="1499"
              step="50"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="mt-4 w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="mt-2 flex justify-between text-[10px] text-[#666]">
              <span>₹499 (Starter)</span>
              <span>₹899 (Pro)</span>
              <span>₹1,499 (Elite)</span>
            </div>
          </div>
        </div>

        {/* Calculated Results Card */}
        <div className="mt-6 rounded-xl border border-[#D4AF37]/40 bg-[#1A1A1A] p-6 text-center sm:text-left sm:flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Projected Monthly Income
            </div>
            <div className="mt-1 font-serif text-4xl font-extrabold text-white">
              ₹{monthlyEarnings.toLocaleString("en-IN")}
              <span className="text-sm font-normal text-[#8E8E93]"> /month</span>
            </div>
            <p className="mt-1 text-[11px] text-[#8E8E93]">
              Up to ₹{annualEarnings.toLocaleString("en-IN")}/year • 100% of food & cafe bills paid by member
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <a
              href="#apply-form"
              className="inline-flex items-center rounded-full bg-[#D4AF37] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5C158] transition"
            >
              <span>Start Application</span>
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Onboarding Application Form */}
      <div id="apply-form" className="mt-16 border-t border-[#262626] pt-12">
        <h3 className="font-serif text-2xl font-bold text-white">
          Apply to Become a Companion
        </h3>
        <p className="mt-1 text-xs text-[#8E8E93]">
          4-step digital onboarding. Every host pays an INR 99.50 screening fee to deter fake applications.
        </p>

        {isSubmitted ? (
          <div className="mt-8 rounded-xl border border-green-800 bg-[#0F1E14] p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h4 className="mt-3 font-serif text-xl font-bold text-white">
              Application & Screening Fee Submitted
            </h4>
            <p className="mt-2 text-xs text-[#8E8E93] max-w-md mx-auto">
              Our safety review team will review your Aadhaar details and video introduction within 24–48 hours. You will receive an SMS alert upon approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Step 1 of 3: Basic Profile
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#8E8E93]">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vanshika Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8E8E93]">Mobile Number (OTP Verified)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8E8E93]">Primary City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5E5E7] transition"
                >
                  Continue to Preferences
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Step 2 of 3: Languages & Activities
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8E8E93]">Spoken Languages</label>
                  <input
                    type="text"
                    required
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8E8E93]">Short Bio & Conversational Hobbies</label>
                  <textarea
                    rows={3}
                    placeholder="Tell members about yourself (e.g. DU student, love specialty coffee roasteries, indie films...)"
                    className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full border border-[#333] px-5 py-2 text-xs font-semibold text-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5E5E7] transition"
                  >
                    Continue to Document Verification
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Step 3 of 3: Sovereign KYC & Screening Fee
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#2B2B2B] bg-[#181818] p-4 text-xs">
                    <span className="font-bold text-white block mb-1">Aadhaar Card Upload</span>
                    <input type="file" className="text-xs text-[#8E8E93]" />
                  </div>
                  <div className="rounded-xl border border-[#2B2B2B] bg-[#181818] p-4 text-xs">
                    <span className="font-bold text-white block mb-1">PAN Card Upload</span>
                    <input type="file" className="text-xs text-[#8E8E93]" />
                  </div>
                </div>

                <div className="rounded-xl border border-[#D4AF37]/30 bg-[#1A1A1A] p-4 text-xs">
                  <div className="font-bold text-white">Application Screening Fee: ₹99.50</div>
                  <p className="mt-1 text-[#8E8E93] text-[11px]">
                    To eliminate fake accounts and maintain host quality, applicants pay a one-time non-refundable INR 99.50 verification fee.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-full border border-[#333] px-5 py-2 text-xs font-semibold text-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#D4AF37] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5C158] transition"
                  >
                    Pay ₹99.50 & Submit Application
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
