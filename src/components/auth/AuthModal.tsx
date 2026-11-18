"use client";

import React, { useState } from "react";
import { X, Phone, ShieldCheck, ArrowRight, CheckCircle2, Lock } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to send OTP. Please check your number.");
      } else {
        setDevCode(data.devCode || null);
        setStep("otp");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp, name: name || undefined }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Incorrect OTP. Please try again.");
      } else {
        if (onSuccess) onSuccess(data.user);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError("Verification failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#333] bg-[#121212] p-6 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[#8E8E93] hover:bg-[#202020] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure Phone OTP Authentication</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-bold text-white">
            {step === "phone" ? "Sign In to Companio" : "Enter Verification Code"}
          </h2>
          <p className="mt-1 text-xs text-[#8E8E93]">
            {step === "phone"
              ? "Enter your 10-digit Indian mobile number to sign in or register."
              : `A 6-digit verification code has been dispatched to ${phone}.`}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {devCode && step === "otp" && (
          <div className="mt-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3 text-xs text-[#D4AF37] flex items-center justify-between">
            <span>Dev Sandbox Code: <strong>{devCode}</strong></span>
            <button
              type="button"
              onClick={() => setOtp(devCode)}
              className="text-[10px] underline font-bold"
            >
              Auto-fill
            </button>
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8E8E93]">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Aditya Mehta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8E8E93]">Mobile Number</label>
              <div className="relative mt-1.5 flex items-center">
                <span className="absolute left-3 text-xs font-bold text-[#8E8E93]">+91</span>
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={phone.replace(/^\+91/, "")}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#2B2B2B] bg-[#181818] py-2.5 pl-12 pr-4 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#D4AF37] py-3 text-xs font-bold text-black hover:bg-[#E5C158] transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8E8E93]">6-Digit Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] py-2.5 text-center text-lg font-bold tracking-widest text-white outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-1/3 rounded-full border border-[#333] py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
              >
                Change Number
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 rounded-full bg-[#D4AF37] py-2.5 text-xs font-bold text-black hover:bg-[#E5C158] transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
