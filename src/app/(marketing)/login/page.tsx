"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, ArrowRight, Heart } from "lucide-react";
import { isFirebaseConfigured, getFirebaseAuth, initRecaptchaVerifier } from "@/lib/firebase";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "code">("input");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isEmail = identifier.includes("@");

    // 1. Phone Auth via Firebase (10,000 free SMS/mo)
    if (!isEmail && isFirebaseConfigured()) {
      try {
        const cleanPhone = identifier.replace(/[\s-]/g, "");
        const formattedPhone = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
        const auth = getFirebaseAuth();
        const recaptchaVerifier =
          (window as any).loginRecaptchaVerifier || initRecaptchaVerifier("login-recaptcha-container");
        (window as any).loginRecaptchaVerifier = recaptchaVerifier;

        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        setConfirmationResult(confirmation);
        setStep("code");
        setLoading(false);
        return;
      } catch (fbErr) {
        console.warn("[FIREBASE PHONE OTP FALLBACK]:", (fbErr as Error).message);
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
        body: JSON.stringify({ identifier, code }),
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

      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/80 p-8 shadow-xl text-slate-900">
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
            {step === "input" ? "Sign in to Companio" : "Enter sign-in code"}
          </h1>

          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            {step === "input"
              ? "Enter your email or mobile number to receive a one-time sign-in code."
              : `Enter the 6-digit verification code sent to ${identifier}.`}
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
              className="w-full rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md hover:bg-black transition active:scale-95 disabled:opacity-50"
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
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition"
            >
              Change email or phone
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
