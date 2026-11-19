'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, Mail, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import { isFirebaseConfigured, getFirebaseAuth, initRecaptchaVerifier, formatFirebasePhoneError } from '@/lib/firebase';
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { validateIndianMobileNumber } from '@/lib/phone';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/explore';
  const toast = useToast();
  const { isAuthenticated, memberProfile, refreshSession } = useAuth();

  const [step, setStep] = useState<'input' | 'code'>('input');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      if (!memberProfile?.onboardingCompleted) {
        router.push('/onboarding/member');
      } else {
        router.push(nextUrl && nextUrl !== '/login' ? nextUrl : '/explore');
      }
    }
  }, [isAuthenticated, memberProfile, nextUrl, router]);

  const phoneValidation = authMethod === 'phone' ? validateIndianMobileNumber(phoneNumber) : null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Email OTP Dispatch
    if (authMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      const effectiveIdentifier = email.trim().toLowerCase();

      try {
        const res = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: effectiveIdentifier }),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error || 'Failed to dispatch verification code. Please try again.');
        } else {
          setStep('code');
          toast.success(`Verification code dispatched to ${effectiveIdentifier}`, 'Code Dispatched');
        }
      } catch (err) {
        setError('Network error while dispatching code. Please check your connection.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Mobile Phone Validation
    const validation = validateIndianMobileNumber(phoneNumber);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid 10-digit Indian mobile number.');
      setLoading(false);
      return;
    }

    // 3. Real Firebase Phone Auth Dispatch (Primary for real SMS delivery to Indian numbers)
    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth();
        const recaptchaVerifier = initRecaptchaVerifier('login-recaptcha-container');

        const confirmation = await signInWithPhoneNumber(
          auth,
          validation.e164,
          recaptchaVerifier
        );
        setConfirmationResult(confirmation);
        setStep('code');
        toast.success(`SMS verification code sent to +91 ${validation.formatted}`, 'OTP Dispatched');
        setLoading(false);
        return;
      } catch (fbErr: any) {
        console.error('[FIREBASE PHONE AUTH ERROR]:', fbErr);
        const friendlyError = formatFirebasePhoneError(fbErr);
        setError(friendlyError);
        toast.error(friendlyError, 'SMS Dispatch Failed');
        setLoading(false);
        return;
      }
    }

    // 4. REST SMS Dispatch fallback
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: validation.e164 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch verification SMS. Please try again.');
      } else {
        setStep('code');
        toast.success(`SMS verification code dispatched to ${validation.e164}`, 'Code Dispatched');
      }
    } catch (err) {
      setError('Network error while dispatching verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const effectiveIdentifier = authMethod === 'email'
      ? email.trim().toLowerCase()
      : `+91${phoneNumber.replace(/\D/g, '')}`;

    // 1. Firebase Phone Auth verification
    if (confirmationResult) {
      try {
        const cred = await confirmationResult.confirm(code);
        const idToken = await cred.user.getIdToken();

        const res = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: effectiveIdentifier,
            code,
            firebaseVerified: true,
            idToken,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Verification failed on server.');
        }

        await refreshSession();
        toast.success('Signed in successfully! Welcome to Companio.', 'Verified');
        router.push(nextUrl && nextUrl !== '/login' ? nextUrl : '/explore');
        return;
      } catch (fbVerifyErr) {
        const msg = (fbVerifyErr as Error).message || 'Incorrect verification code. Please check and try again.';
        setError(msg);
        toast.error(msg, 'Verification Failed');
        setLoading(false);
        return;
      }
    }

    // 2. Standard REST OTP Verification
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: effectiveIdentifier, code }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Incorrect sign-in code. Please try again.');
        toast.error(data.error || 'Incorrect sign-in code.', 'Verification Error');
      } else {
        await refreshSession();
        toast.success('Signed in successfully! Welcome to Companio.', 'Verified');
        router.push(nextUrl && nextUrl !== '/login' ? nextUrl : '/explore');
      }
    } catch (err) {
      setError('Verification failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      {/* Invisible container for Firebase reCAPTCHA */}
      <div id="login-recaptcha-container" />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border-brutal bg-white p-8 sm:p-10 shadow-brutal-lg space-y-6">
          <div className="text-center space-y-3">
            <Logo size="md" className="mx-auto" />
            <div className="inline-flex">
              <Badge variant="lime" size="sm">
                Secure Auth
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-black text-ink uppercase tracking-tight">
              {step === 'input' ? 'Welcome to Companio' : 'Enter Verification Code'}
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-soft">
              {step === 'input'
                ? 'Sign in with your verified Indian mobile number or email address.'
                : `Enter the 6-digit verification code sent to ${authMethod === 'phone' ? `+91 ${phoneNumber}` : email}.`}
            </p>
          </div>

          {/* Auth Method Selector */}
          {step === 'input' && (
            <div className="grid grid-cols-2 gap-2 border-2 border-ink p-1 bg-paper rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setError(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-black uppercase transition ${
                  authMethod === 'phone'
                    ? 'bg-ink text-white shadow-brutal-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Mobile (+91)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setError(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-display text-xs font-black uppercase transition ${
                  authMethod === 'email'
                    ? 'bg-ink text-white shadow-brutal-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border-2 border-danger bg-danger/10 p-3.5 text-xs font-bold text-danger animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              {authMethod === 'phone' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-display text-xs font-black uppercase text-ink">
                      Indian Mobile Number
                    </label>
                    <span className="font-mono text-[11px] font-bold text-ink-muted">
                      {phoneNumber.length}/10 digits
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-xs font-black text-ink-muted select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhoneNumber(val);
                        setError(null);
                      }}
                      placeholder="98765 43210"
                      className="w-full rounded-xl border-brutal bg-paper-deep/30 pl-12 pr-4 py-3 font-mono text-sm font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal transition"
                      required
                      autoFocus
                    />
                  </div>

                  {phoneNumber.length > 0 && (
                    <div className="text-[11px]">
                      {phoneValidation?.isValid ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Valid format (+91 {phoneValidation.formatted})
                        </span>
                      ) : (
                        <span className="text-amber-800 font-bold">
                          {phoneValidation?.error}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border-brutal bg-paper-deep/30 pl-10 pr-4 py-3 font-body text-sm font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal transition"
                      required
                      autoFocus
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading || (authMethod === 'phone' && !phoneValidation?.isValid)}
              >
                {loading ? 'Sending Code...' : 'Send Verification Code →'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    6-Digit Verification Code
                  </label>
                  <span className="font-mono text-[11px] font-bold text-ink-muted">
                    Sent to {authMethod === 'phone' ? `+91 ${phoneNumber}` : email}
                  </span>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.75em] rounded-xl border-brutal bg-white py-3.5 font-mono text-2xl font-black text-ink focus:outline-none focus:shadow-brutal transition"
                  autoFocus
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading || code.length !== 6}
              >
                {loading ? 'Verifying Code...' : 'Verify & Sign In →'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setConfirmationResult(null);
                  setCode('');
                  setError(null);
                }}
                className="w-full text-center font-display text-xs font-bold text-ink-muted hover:underline cursor-pointer"
              >
                Change mobile number or email
              </button>
            </form>
          )}

          <div className="border-t-brutal-sm pt-4 text-center text-[11px] font-bold text-ink-muted leading-relaxed">
            By proceeding, you agree to Companio's strictly platonic policy and public venue guidelines.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
