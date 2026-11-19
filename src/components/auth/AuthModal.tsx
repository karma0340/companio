"use client";

import React, { useState } from "react";
import { X, Mail, Phone, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { isFirebaseConfigured, getFirebaseAuth, initRecaptchaVerifier, formatFirebasePhoneError } from "@/lib/firebase";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { validateIndianMobileNumber } from "@/lib/phone";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<"input" | "code">("input");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time phone validation
  const phoneValidation = authMethod === "phone" ? validateIndianMobileNumber(phoneNumber) : null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isEmail = authMethod === "email";

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }
      const effectiveIdentifier = email.trim().toLowerCase();

      try {
        const res = await fetch("/api/auth/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: effectiveIdentifier }),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || "Failed to send code. Please check your credentials.");
        } else {
          setStep("code");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Strict Indian Mobile Number Validation
    const validation = validateIndianMobileNumber(phoneNumber);
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid 10-digit Indian mobile number.");
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured()) {
      setError("Firebase Phone Auth configuration is missing. Please check your project settings.");
      setLoading(false);
      return;
    }

    // Direct Firebase Phone Auth dispatch (Real SMS)
    try {
      const auth = getFirebaseAuth();
      const recaptchaVerifier = initRecaptchaVerifier("modal-recaptcha-container");

      const confirmation = await signInWithPhoneNumber(
        auth,
        validation.e164,
        recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setStep("code");
    } catch (fbErr: any) {
      console.error("[FIREBASE PHONE AUTH FAILED]:", fbErr);
      setError(formatFirebasePhoneError(fbErr));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const effectiveIdentifier = authMethod === "email"
      ? email.trim().toLowerCase()
      : `+91${phoneNumber.replace(/\D/g, "")}`;

    // 1. Firebase Phone Auth client confirmation
    if (confirmationResult) {
      try {
        const cred = await confirmationResult.confirm(code);
        const idToken = await cred.user.getIdToken();

        const res = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: effectiveIdentifier,
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
        body: JSON.stringify({ identifier: effectiveIdentifier, code }),
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
          aria-label="Close modal"
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
            {step === "input" ? "Sign in to Companio" : "Enter verification code"}
          </h2>

          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {step === "input"
              ? "Sign in with your verified Indian mobile number or email address."
              : `A 6-digit code was sent to ${authMethod === "phone" ? `+91 ${phoneNumber}` : email}.`}
          </p>
        </div>

        {/* Method Toggle: Phone vs Email */}
        {step === "input" && (
          <div className="mt-5 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("phone");
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                authMethod === "phone"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Mobile Number</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("email");
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
                authMethod === "email"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email Address</span>
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === "input" ? (
          <form onSubmit={handleSendCode} className="mt-5 space-y-4">
            {authMethod === "phone" ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Indian Mobile Number
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {phoneNumber.length}/10 digits
                  </span>
                </div>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition overflow-hidden">
                  {/* Fixed Indian Country Code Prefix */}
                  <div className="flex items-center gap-1.5 bg-slate-100/80 px-3.5 py-3 border-r border-slate-200 text-xs font-bold text-slate-800 select-none">
                    <span className="text-sm leading-none font-bold">IN</span>
                    <span>+91</span>
                  </div>

                  <input
                    type="tel"
                    required
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="9812345678"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhoneNumber(val);
                      setError(null);
                    }}
                    className="w-full bg-transparent py-3 px-3.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                {/* Validation hint */}
                {phoneNumber.length > 0 && (
                  <div className="mt-1.5 text-[11px]">
                    {phoneValidation?.isValid ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Valid Indian mobile format (+91 {phoneValidation.formatted})
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">
                        {phoneValidation?.error}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (authMethod === "phone" && !phoneValidation?.isValid)}
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                inputMode="numeric"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("input");
                setConfirmationResult(null);
                setCode("");
                setError(null);
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition"
            >
              Change number or email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
