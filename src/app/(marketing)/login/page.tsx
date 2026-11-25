'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, Users, Sparkles, Clock, Share2, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import { validateIndianMobileNumber } from '@/lib/phone';
import { useWebOtp } from '@/hooks/use-web-otp';
import { triggerCelebration } from '@/components/ui/celebration';

interface ProfileCheckResult {
  exists: boolean;
  hasHostProfile: boolean;
  hostStatus: 'approved' | 'pending' | 'rejected' | 'none';
  hostDisplayName: string | null;
  hourlyRate: number | null;
  hasMemberProfile: boolean;
  memberName: string | null;
  coinBalance?: number;
  onboardingCompleted?: boolean;
  suggestedRole: 'host' | 'member';
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || searchParams.get('redirect') || '/explore';
  const urlIntent = searchParams.get('intent') === 'host' ? 'host' : 'member';
  const toast = useToast();
  const { isAuthenticated, user, memberProfile, hostProfile, refreshSession, logout } = useAuth();

  const [intent, setIntent] = useState<'member' | 'host'>(urlIntent);
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'input' | 'code'>('input');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Production-level OTP input state & 60s cooldown timer
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);
  const inputRef5 = useRef<HTMLInputElement>(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3, inputRef4, inputRef5];

  // Real-time phone profile detection
  const [profileCheck, setProfileCheck] = useState<ProfileCheckResult | null>(null);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(false);
  const [showReferralInput, setShowReferralInput] = useState<boolean>(false);
  const [referralInput, setReferralInput] = useState<string>('');

  // 1. Reactive synchronization with URL intent parameter and referral capture
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      if (errorParam === 'access_denied' || errorParam === 'google_cancelled') {
        setError('Google sign-in was cancelled. Please try again.');
      } else if (errorParam === 'state_expired' || errorParam === 'csrf_state_mismatch') {
        setError('Google sign-in session expired. Please try again.');
      } else {
        setError(`Google sign-in error: ${errorParam.replace(/_/g, ' ')}`);
      }
    }

    const urlRef = searchParams.get('ref') || (typeof window !== 'undefined' ? localStorage.getItem('companio_referral_code') : null);
    if (urlRef) {
      setReferralInput(urlRef);
      setShowReferralInput(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('companio_referral_code', urlRef);
      }
    }
    setIntent(urlIntent);
  }, [searchParams, urlIntent]);

  // 2. 60-Second Cooldown Timer for Resend SMS
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 'code') {
      setResendCooldown(60);
      setCanResend(false);
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  // 3. Debounced phone lookup for real-time role and account recognition
  useEffect(() => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      setCheckingProfile(true);
      const timer = setTimeout(() => {
        fetch(`/api/auth/profile-check?phone=%2B91${digits}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setProfileCheck(data);
            }
          })
          .catch((err) => console.error('[PROFILE LOOKUP ERROR]:', err))
          .finally(() => setCheckingProfile(false));
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setProfileCheck(null);
    }
  }, [phone]);

  const handleIntentSwitch = (newIntent: 'member' | 'host') => {
    setIntent(newIntent);
    setError(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set('intent', newIntent);
    router.replace(`/login?${params.toString()}`);
  };

  const routePostAuth = (verifiedHostProfile?: any, verifiedMemberProfile?: any) => {
    const activeHost = verifiedHostProfile || hostProfile;
    const activeMember = verifiedMemberProfile || memberProfile;

    if (intent === 'host') {
      if (activeHost && activeHost.verificationStatus === 'approved') {
        router.push('/companion/dashboard');
      } else if (activeHost && activeHost.verificationStatus === 'pending') {
        router.push('/become-a-companion/apply?status=pending');
      } else {
        router.push(`/become-a-companion/apply?phone=${encodeURIComponent(phone)}`);
      }
    } else {
      if (!activeMember?.onboardingCompleted) {
        router.push('/onboarding/member');
      } else {
        router.push(nextUrl && nextUrl !== '/login' ? nextUrl : '/explore');
      }
    }
  };

  const phoneValidation = validateIndianMobileNumber(phone);

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: validation.e164 }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.error || 'Unable to send SMS verification code. Please try again.';
        setError(msg);
        toast.error(msg, 'SMS Delivery Failed');
        return;
      }

      setStep('code');
      setOtpDigits(['', '', '', '', '', '']);
      setCode('');
      setResendCooldown(60);
      setCanResend(false);
      toast.success(`6-digit OTP sent via SMS to +91 ${validation.formatted}`, 'SMS Dispatched');
    } catch {
      const msg = 'Network error while dispatching SMS code. Please check your connection and try again.';
      setError(msg);
      toast.error(msg, 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const executeVerify = async (cleanOtp: string) => {
    setLoading(true);
    setError(null);

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const effectiveIdentifier = cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone}`;

    const savedRef = typeof window !== 'undefined' ? localStorage.getItem('companio_referral_code') : null;
    const urlRef = searchParams.get('ref');
    const referralCode = referralInput.trim() || urlRef || savedRef || undefined;

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: effectiveIdentifier,
          code: cleanOtp,
          intent,
          ref: referralCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Invalid code entered. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg, 'Verification Failed');
        setLoading(false);
        return;
      }

      await refreshSession();
      triggerCelebration('Signed In! Wallet & Profile Ready');
      toast.success('Welcome back to Meetzy Club! Redirecting...', 'Verified');
      // Directly and automatically redirect into app without manual clicks
      routePostAuth(data.hostProfile, data.memberProfile);
    } catch {
      setError('Verification failed. Please check your connection.');
      toast.error('Verification failed. Please check your connection.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useWebOtp({
    enabled: step === 'code' && !loading,
    onCode: (autoCode) => {
      const digits = autoCode.split('');
      setOtpDigits([
        digits[0] || '',
        digits[1] || '',
        digits[2] || '',
        digits[3] || '',
        digits[4] || '',
        digits[5] || '',
      ]);
      setCode(autoCode);
      executeVerify(autoCode);
    },
  });

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      setCode(next.join(''));
      return;
    }

    if (clean.length > 1) {
      const digitsArr = clean.slice(0, 6).split('');
      const next = [...otpDigits];
      digitsArr.forEach((d, i) => {
        if (index + i < 6) next[index + i] = d;
      });
      setOtpDigits(next);
      const joined = next.join('');
      setCode(joined);
      const targetFocus = Math.min(index + digitsArr.length, 5);
      inputRefs[targetFocus]?.current?.focus();
      if (joined.length === 6) {
        executeVerify(joined);
      }
      return;
    }

    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    const joined = next.join('');
    setCode(joined);
    setError(null);

    // Auto-advance focus to next digit box
    if (index < 5 && clean) {
      inputRefs[index + 1]?.current?.focus();
    }

    // Auto-submit immediately on 6th digit
    if (joined.length === 6) {
      executeVerify(joined);
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((d, i) => {
      next[i] = d;
    });
    setOtpDigits(next);
    setCode(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs[focusIdx]?.current?.focus();
    if (pasted.length === 6) {
      executeVerify(pasted);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpDigits.join('').trim();
    if (cleanOtp.length < 6) {
      setError('Please enter all 6 digits received via SMS.');
      return;
    }
    await executeVerify(cleanOtp);
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

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
              Welcome to Meetzy Club
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

          {/* Active Session Notice & Switcher */}
          {isAuthenticated && user && (
            <div className="rounded-2xl border-2 border-ink bg-sunny/25 p-3.5 shadow-brutal-sm space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-[#D4F7A5] text-ink font-black text-xs shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-display font-black text-xs text-ink block truncate">
                      Signed in as {user.name || memberProfile?.fullName || 'Member'}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-ink-muted block truncate">
                      +91 {user.phone.replace('+91', '')} · {user.coinBalance ?? 100} Coins
                    </span>
                  </div>
                </div>
                <Badge variant="lime" size="sm">
                  Active
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => routePostAuth()}
                  className="px-3 py-1.5 rounded-xl border-2 border-ink bg-ink text-paper font-display text-xs font-black shadow-brutal-xs hover:bg-black/80 transition-all cursor-pointer text-center"
                >
                  Go to Dashboard →
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    toast.success('Signed out. You can now sign in with another number.', 'Logged Out');
                  }}
                  className="px-3 py-1.5 rounded-xl border-2 border-ink bg-white text-danger hover:bg-danger/10 font-display text-xs font-black shadow-brutal-xs transition-all cursor-pointer text-center"
                >
                  Sign Out / Switch
                </button>
              </div>
            </div>
          )}

          {/* Interactive Role / Intent Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl border-2 border-ink bg-paper shadow-brutal-sm">
            <button
              type="button"
              onClick={() => handleIntentSwitch('member')}
              className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                intent === 'member'
                  ? 'bg-ink text-paper shadow-brutal-sm'
                  : 'bg-transparent text-ink hover:bg-black/5'
              }`}
            >
              <div className="flex items-center gap-1.5 font-display text-xs font-black">
                <Users className="h-3.5 w-3.5" />
                <span>Find Company</span>
              </div>
              <span className={`text-[10px] font-bold ${intent === 'member' ? 'text-paper-deep' : 'text-ink-muted'}`}>
                Book Meetups
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleIntentSwitch('host')}
              className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                intent === 'host'
                  ? 'bg-sunny text-ink shadow-brutal-sm border border-ink'
                  : 'bg-transparent text-ink hover:bg-black/5'
              }`}
            >
              <div className="flex items-center gap-1.5 font-display text-xs font-black">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Become a Host</span>
              </div>
              <span className={`text-[10px] font-bold ${intent === 'host' ? 'text-ink' : 'text-ink-muted'}`}>
                Earn ₹499-1,299/hr
              </span>
            </button>
          </div>

          {/* Real-Time Profile Detection Banner */}
          {profileCheck && (
            <div className="animate-in fade-in space-y-2">
              {profileCheck.hasHostProfile ? (
                <div className="flex items-center justify-between gap-2 bg-sunny/25 p-3 rounded-2xl border-2 border-ink shadow-brutal-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-ink shrink-0" />
                    <div>
                      <span className="font-display font-black text-xs text-ink block leading-tight">
                        Host Account: {profileCheck.hostDisplayName || 'Verified Host'}
                      </span>
                      <span className="text-[10px] font-bold text-ink-soft">
                        Status: Approved · ₹{profileCheck.hourlyRate || 599}/hr
                      </span>
                    </div>
                  </div>
                  {intent !== 'host' ? (
                    <button
                      type="button"
                      onClick={() => handleIntentSwitch('host')}
                      className="px-2.5 py-1.5 rounded-xl border-2 border-ink bg-sunny font-display text-[10px] font-black uppercase text-ink shadow-brutal-xs hover:bg-lime transition-all shrink-0 cursor-pointer"
                    >
                      Switch to Host →
                    </button>
                  ) : (
                    <Badge variant="lime" size="sm">
                      Host Active
                    </Badge>
                  )}
                </div>
              ) : profileCheck.exists && profileCheck.hasMemberProfile ? (
                <div className="flex items-center justify-between gap-2 bg-emerald-50 p-3 rounded-2xl border-2 border-ink shadow-brutal-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink bg-[#D4F7A5] text-ink font-black text-xs shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-ink" />
                    </div>
                    <div>
                      <span className="font-display font-black text-xs text-ink block leading-tight">
                        Welcome back, {profileCheck.memberName || 'Member'}!
                      </span>
                      <span className="text-[10px] font-bold text-ink-soft">
                        Account Recognized · {profileCheck.coinBalance ?? 100} Coins Active
                      </span>
                    </div>
                  </div>
                  <Badge variant="lime" size="sm">
                    Account Exists
                  </Badge>
                </div>
              ) : profileCheck.hostStatus === 'pending' ? (
                <div className="flex items-center gap-2 bg-pink/20 p-2.5 rounded-2xl border-2 border-ink font-bold text-xs text-ink">
                  <Clock className="h-4 w-4 text-ink shrink-0" />
                  <span>Host application under review for {profileCheck.hostDisplayName || 'applicant'}.</span>
                </div>
              ) : !profileCheck.exists ? (
                <div className="flex items-center justify-between gap-2 bg-[#E8DEFF] p-3 rounded-2xl border-2 border-ink shadow-brutal-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-ink shrink-0" />
                    <div>
                      <span className="font-display font-black text-xs text-ink block leading-tight">
                        New Member Account
                      </span>
                      <span className="text-[10px] font-bold text-ink-soft">
                        Enter verification code to get 100 Free Welcome Coins on signup!
                      </span>
                    </div>
                  </div>
                  <Badge variant="sunny" size="sm">
                    +100 Coins
                  </Badge>
                </div>
              ) : null}
            </div>
          )}

          {step === 'input' ? (
            <div className="space-y-4">
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

              {/* Optional Referral Code Input */}
              <div className="pt-0.5">
                {!showReferralInput && !referralInput ? (
                  <button
                    type="button"
                    onClick={() => setShowReferralInput(true)}
                    className="text-xs font-bold text-ink-muted hover:text-ink underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="h-3 w-3" />
                    <span>Have a referral code?</span>
                  </button>
                ) : (
                  <div className="space-y-1.5 p-3 rounded-2xl border-2 border-ink bg-paper/60 shadow-brutal-xs">
                    <div className="flex items-center justify-between">
                      <label className="block font-display text-[11px] font-black uppercase text-ink">
                        Referral Code (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReferralInput(false);
                          setReferralInput('');
                        }}
                        className="text-[10px] font-bold text-ink-muted hover:text-ink cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={10}
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value.toUpperCase().trim())}
                      placeholder="e.g. HLTCC8QF"
                      className="w-full rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-xs font-black text-ink uppercase focus:outline-none focus:shadow-brutal-xs"
                    />
                    <span className="text-[10px] font-bold text-ink-soft block leading-tight">
                      Enter a friend&apos;s code to connect accounts. They earn 100 coins once you complete your first meetup!
                    </span>
                  </div>
                )}
              </div>

              {phone.length > 0 && phone.length < 10 && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
                  <span>Enter {10 - phone.length} more digit{10 - phone.length === 1 ? '' : 's'} to receive SMS code.</span>
                </div>
              )}

              <Button
                type="submit"
                variant={intent === 'host' ? 'sunny' : 'primary'}
                size="lg"
                fullWidth
                disabled={loading || phone.length !== 10 || !phoneValidation.isValid}
              >
                {loading
                  ? 'Dispatching Code...'
                  : profileCheck?.exists
                  ? 'Send Sign-In Code →'
                  : intent === 'host'
                  ? 'Send Code to Apply as Host →'
                  : 'Send Code to Register (+100 Coins) →'}
              </Button>
            </form>

            <div className="relative flex items-center justify-center pt-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-ink/15" />
              </div>
              <div className="relative bg-white px-3 text-[11px] font-black uppercase text-ink-muted tracking-wider select-none">
                Or continue with
              </div>
            </div>

            <button
              type="button"
              disabled={loading || googleLoading}
              onClick={() => {
                setGoogleLoading(true);
                const refParam = referralInput ? `&ref=${encodeURIComponent(referralInput)}` : '';
                window.location.href = `/api/auth/google?intent=${intent}&next=${encodeURIComponent(nextUrl)}${refParam}`;
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-ink bg-white font-display text-sm font-black text-ink shadow-brutal hover:bg-paper-deep/20 hover:shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-ink shrink-0" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>
        ) : (
            <form onSubmit={handleVerifyCode} className="space-y-5 animate-in fade-in">
              <div className="rounded-xl border-2 border-ink bg-paper p-3 text-xs font-bold text-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted block text-[10px] font-black uppercase">
                    Verifying Indian Number
                  </span>
                  <span className="font-mono text-sm font-black">+91 {phoneValidation.formatted}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setOtpDigits(['', '', '', '', '', '']);
                    setCode('');
                    setError(null);
                  }}
                  className="font-display text-xs font-black text-lavender hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="rounded-xl border border-ink/20 bg-paper/60 px-3 py-2 text-[11px] font-bold text-ink-soft">
                Enter the 6-digit OTP sent via SMS to your mobile number (auto-detects on supported mobile browsers; type manually on laptop). Valid for 5 minutes.
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    Enter 6-Digit SMS Code
                  </label>
                  <span className="font-mono text-[11px] font-bold text-ink-muted">
                    {otpDigits.filter(Boolean).length}/6 digits
                  </span>
                </div>

                {/* Segmented 6-box OTP input */}
                <div className="grid grid-cols-6 gap-2" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className={`w-full h-12 text-center rounded-xl border-2 font-mono text-xl font-black text-ink transition-all ${
                        digit
                          ? 'border-ink bg-paper shadow-brutal-xs'
                          : 'border-ink/30 bg-paper-deep/10 focus:border-ink focus:bg-white focus:shadow-brutal-xs'
                      }`}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant={intent === 'host' ? 'sunny' : 'primary'}
                size="lg"
                fullWidth
                disabled={loading || otpDigits.filter(Boolean).length < 6}
              >
                {loading
                  ? 'Verifying Code...'
                  : intent === 'host'
                  ? 'Verify & Open Host Portal →'
                  : 'Verify & Enter Directly →'}
              </Button>

              <div className="text-center pt-1">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading}
                    className="text-xs font-bold text-ink hover:underline cursor-pointer"
                  >
                    Didn't receive SMS? Resend code
                  </button>
                ) : (
                  <span className="text-xs font-bold text-ink-muted flex items-center justify-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Resend SMS code in {resendCooldown}s
                  </span>
                )}
              </div>
            </form>
          )}

          <div className="pt-2 text-center text-[11px] text-ink-muted leading-relaxed border-t border-ink/10">
            By proceeding, you agree to our{' '}
            <Link href="/terms" className="font-bold underline hover:text-ink">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/safety" className="font-bold underline hover:text-ink">
              Platonic Guidelines
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center font-display font-black text-ink">
          Loading Meetzy Club authentication...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
