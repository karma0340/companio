'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
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

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'input' | 'code'>('input');
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

  const phoneValidation = validateIndianMobileNumber(phone);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validation = validateIndianMobileNumber(phone);
    if (!validation.isValid) {
      const msg = validation.error || `Please enter a valid 10-digit Indian mobile number. You entered ${phone.length} digit${phone.length === 1 ? '' : 's'}.`;
      setError(msg);
      toast.error(msg, 'Mobile Number Incomplete');
      setLoading(false);
      return;
    }

    // 1. Real Firebase Phone Auth Dispatch (Primary for real SMS delivery to Indian numbers)
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
        toast.success(`Verification code sent to +91 ${validation.formatted}`, 'SMS Dispatched');
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

    // 2. Server REST fallback
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: validation.e164 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch verification SMS. Please try again.');
        toast.error(data.error || 'Failed to dispatch verification SMS.', 'Error');
      } else {
        setStep('code');
        toast.success(`Verification code dispatched to ${validation.e164}`, 'Code Dispatched');
      }
    } catch {
      setError('Network error while dispatching verification code. Please check your connection.');
      toast.error('Network error. Please try again.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = code.trim().replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      const msg = 'Please enter the complete 6-digit verification code sent to your phone.';
      setError(msg);
      toast.error(msg, 'Code Incomplete');
      return;
    }

    setLoading(true);
    const effectiveIdentifier = `+91${phone.replace(/\D/g, '')}`;

    // 1. Firebase Phone Auth verification
    if (confirmationResult) {
      try {
        const cred = await confirmationResult.confirm(cleanOtp);
        const idToken = await cred.user.getIdToken();

        const res = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: effectiveIdentifier,
            code: cleanOtp,
            firebaseVerified: true,
            idToken,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Verification failed on server.');
        }

        await refreshSession();
        toast.success('Welcome to Togethr! Signing you in...', 'Verified');
        router.push(nextUrl && nextUrl !== '/login' ? nextUrl : '/explore');
        return;
      } catch (fbVerifyErr) {
        const msg = (fbVerifyErr as Error).message || 'Invalid code entered. Please try again.';
        setError(msg);
        toast.error(msg, 'Verification Failed');
        setLoading(false);
        return;
      }
    }

    // 2. Server REST OTP Verification fallback
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: effectiveIdentifier, code: cleanOtp }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid code entered. Please try again.');
        toast.error(data.error || 'Invalid code entered. Please try again.', 'Verification Failed');
      } else {
        await refreshSession();
        toast.success('Welcome to Togethr! Signing you in...', 'Verified');
        router.push(nextUrl && nextUrl !== '/login' ? nextUrl : '/explore');
      }
    } catch {
      setError('Verification failed. Please check your connection.');
      toast.error('Verification failed. Please check your connection.', 'Error');
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
            <h1 className="font-display text-2xl font-black text-ink">
              Welcome to made4togethr
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-soft">
              Sign in with your mobile number to explore, book meetups, or manage your host profile.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border-2 border-danger bg-danger/10 p-3.5 text-xs font-bold text-danger animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    Mobile Number (India +91)
                  </label>
                  <span className="font-mono text-[11px] font-bold text-ink-muted">
                    {phone.length}/10 digits
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
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                      setError(null);
                    }}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full rounded-xl border-brutal bg-paper-deep/30 pl-12 pr-4 py-3 font-mono text-sm font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal transition"
                    required
                    autoFocus
                  />
                </div>

                {phone.length > 0 && (
                  <div className="text-[11px]">
                    {phoneValidation.isValid ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Valid Indian mobile format (+91 {phoneValidation.formatted})
                      </span>
                    ) : (
                      <span className="text-amber-800 font-bold">
                        {phoneValidation.error}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading || (phone.length > 0 && !phoneValidation.isValid)}
              >
                {loading ? 'Sending OTP...' : 'Send Verification Code →'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    Enter 6-Digit Code
                  </label>
                  <span className="text-[11px] font-bold text-ink-muted">
                    Sent to +91 {phone}
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
                disabled={loading || code.replace(/\D/g, '').length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Continue →'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setCode('');
                  setError(null);
                  setConfirmationResult(null);
                }}
                className="w-full text-center font-display text-xs font-bold text-ink-muted hover:underline cursor-pointer"
              >
                Change Phone Number
              </button>
            </form>
          )}

          <div className="border-t-brutal-sm pt-4 text-center text-[11px] font-medium text-ink-muted leading-relaxed">
            By proceeding, you agree to our{' '}
            <Link href="/terms" className="font-bold underline text-ink">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/community-guidelines" className="font-bold underline text-ink">
              Platonic Community Guidelines
            </Link>
            .
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
