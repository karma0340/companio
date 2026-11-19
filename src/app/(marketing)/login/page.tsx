"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, ShieldCheck, ArrowRight, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import { isFirebaseConfigured, getFirebaseAuth, initRecaptchaVerifier } from "@/lib/firebase";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { validateIndianMobileNumber } from "@/lib/phone";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "code">("input");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time phone validation
  const phoneValidation = authMethod === "phone" ? validateIndianMobileNumber(phoneNumber) : null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isEmail = authMethod === "email";
    let effectiveIdentifier = "";

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }
      effectiveIdentifier = email.trim().toLowerCase();
    } else {
      // Strict Indian Mobile Number Validation
      const validation = validateIndianMobileNumber(phoneNumber);
      if (!validation.isValid) {
        setError(validation.error || "Please enter a valid 10-digit Indian mobile number.");
        setLoading(false);
        return;
      }
      effectiveIdentifier = validation.e164;

      // 1. Phone Auth via Firebase (10,000 free SMS/mo)
      if (isFirebaseConfigured()) {
        try {
          const auth = getFirebaseAuth();
          const recaptchaVerifier =
            (window as any).loginRecaptchaVerifier || initRecaptchaVerifier("login-recaptcha-container");
          (window as any).loginRecaptchaVerifier = recaptchaVerifier;

          const confirmation = await signInWithPhoneNumber(
            auth,
            validation.e164,
            recaptchaVerifier
          );
          setConfirmationResult(confirmation);
          setStep("code");
          setLoading(false);
          return;
        } catch (fbErr) {
          console.warn("[FIREBASE PHONE OTP FALLBACK]:", (fbErr as Error).message);
        }
      }
    }

    // 2. Server REST dispatch (fallback or email)
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

    const effectiveIdentifier = authMethod === "email"
      ? email.trim().toLowerCase()
      : `+91${phoneNumber.replace(/\D/g, "")}`;

    // 1. Firebase Phone Auth verification
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

        router.push("/explore");
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
        router.push("/explore");
      }
    } catch (err) {
      setError("Verification failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FBFCFF]">
      {/* Invisible container for Firebase reCAPTCHA */}
      <div id="login-recaptcha-container" />

      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xl text-slate-900">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-1.5 shadow-sm">
              <Heart className="h-full w-full fill-white text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Companio
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {step === "input" ? "Sign in to Companio" : "Enter verification code"}
          </h1>

          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            {step === "input"
              ? "Sign in with your verified Indian mobile number or email address."
              : `Enter the 6-digit verification code sent to ${authMethod === "phone" ? `+91 ${phoneNumber}` : email}.`}
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

        {devCode && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 text-center font-mono font-bold">
            Demo Code: {devCode}
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
              className="w-full rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95 disabled:opacity-50"
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
              className="w-full rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
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
                setError(null);
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition"
            >
              Change number or email
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            By signing in, you agree to Companio’s strictly platonic policy and public venue guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
