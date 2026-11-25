'use client';

import { useEffect } from 'react';

interface UseWebOtpOptions {
  enabled: boolean;
  onCode: (code: string) => void;
}

/**
 * Listens for native SMS OTP arrival via the WebOTP API on supported mobile browsers
 * (e.g., Chrome on Android). Safely no-ops on desktop/laptop browsers where manual input is used.
 */
export function useWebOtp({ enabled, onCode }: UseWebOtpOptions) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (!('OTPCredential' in window) || !navigator.credentials?.get) return;

    const ac = new AbortController();

    (navigator.credentials as any)
      .get({
        otp: { transport: ['sms'] },
        signal: ac.signal,
      })
      .then((otpCredential: { code?: string } | null) => {
        const rawCode = String(otpCredential?.code || '').replace(/\D/g, '').slice(0, 6);
        if (rawCode.length === 6) {
          onCode(rawCode);
        }
      })
      .catch(() => {
        // Ignore AbortError or unsupported WebOTP environments (desktop/iOS fallback is manual input)
      });

    return () => {
      ac.abort();
    };
  }, [enabled, onCode]);
}
