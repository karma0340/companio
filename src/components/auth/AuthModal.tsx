"use client";

import React, { useState } from "react";
import { X, Mail, ShieldCheck, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { isFirebaseConfigured, getFirebaseAuth, initRecaptchaVerifier } from "@/lib/firebase";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<"input" | "code">("input");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isEmail = identifier.includes("@");

    // 1. If phone number and Firebase is configured, use Firebase Phone Auth (10,000 free SMS/mo)
    if (!isEmail && isFirebaseConfigured()) {
      try {
        const cleanPhone = identifier.replace(/[\s-]/g, "");
        const formattedPhone = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
        const auth = getFirebaseAuth();
        const recaptchaVerifier =
          (window as any).recaptchaVerifier || initRecaptchaVerifier("modal-recaptcha-container");
        (window as any).recaptchaVerifier = recaptchaVerifier;

        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        setConfirmationResult(confirmation);
        setStep("code");
        setLoading(false);
        return;
      } catch (fbErr) {
        console.warn("[FIREBASE PHONE OTP FALLBACK]:", (fbErr as Error).message);
        // Fallback to server REST dispatch
      }
    }

    // 2. Server REST dispatch (Email or SMS gateway / sandbox)
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to send code. Please check your email or phone.");
      } else {
        setDevCode(data.devCode || null);
        setStep("code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. If sent via Firebase Phone Auth
    if (confirmationResult) {
      try {
        const cred = await confirmationResult.confirm(code);
        const idToken = await cred.user.getIdToken();

        const res = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier,
            code,
            firebaseVerified: true,
            idToken,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Verification failed");
        }

        if (onSuccess) onSuccess(data.user);
        onClose();
        window.location.reload();
        return;
      } catch (fbVerifyErr) {
        setError((fbVerifyErr as Error).message || "Incorrect verification code. Please try again.");
        setLoading(false);
        return;
      }
    }

    // 2. Standard REST OTP Verification
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Incorrect sign-in code. Please try again.");
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(20, 18, 42, 0.6)" }}
    >
      {/* Invisible container for Firebase reCAPTCHA */}
      <div id="modal-recaptcha-container" />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-200/80">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>Companio Sign In</span>
          </div>

          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900">
            {step === "input" ? "Sign in to Companio" : "Enter sign-in code"}
          </h2>

          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {step === "input"
              ? "Enter your email address or phone number to receive a one-time sign in code."
              : `A 6-digit verification code has been dispatched to ${identifier}.`}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        {devCode && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 text-center font-mono font-bold">
            Demo Code: {devCode}
          </div>
        )}

        {step === "input" ? (
          <form onSubmit={handleSendCode} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email or phone
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="you@example.com or 10-digit mobile"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending code..." : "Send sign-in code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                6-digit code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("input");
                setDevCode(null);
                setConfirmationResult(null);
                setCode("");
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition"
            >
              Change email or phone
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
