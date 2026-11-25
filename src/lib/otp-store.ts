/**
 * In-Memory OTP Store with 5-Minute Time-To-Live (TTL) and 60s Resend Cooldown
 */

interface OtpEntry {
  code: string;
  expiresAt: number;
  lastSentAt: number;
  attempts: number;
}

const globalForOtp = globalThis as unknown as {
  otpMap: Map<string, OtpEntry> | undefined;
};

const otpMap = globalForOtp.otpMap ?? new Map<string, OtpEntry>();
globalForOtp.otpMap = otpMap;

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

function normalizePhoneKey(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function checkOtpCooldown(phone: string): { allowed: boolean; waitSeconds: number } {
  const key = normalizePhoneKey(phone);
  const existing = otpMap.get(key);
  if (!existing) return { allowed: true, waitSeconds: 0 };

  const elapsed = Date.now() - existing.lastSentAt;
  if (elapsed < RESEND_COOLDOWN_MS) {
    return {
      allowed: false,
      waitSeconds: Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000),
    };
  }
  return { allowed: true, waitSeconds: 0 };
}

export function generateAndStoreOtp(phone: string): string {
  const key = normalizePhoneKey(phone);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();

  otpMap.set(key, {
    code,
    expiresAt: now + OTP_TTL_MS,
    lastSentAt: now,
    attempts: 0,
  });

  return code;
}

export function clearOtp(phone: string): void {
  const key = normalizePhoneKey(phone);
  otpMap.delete(key);
}

export function verifyOtp(phone: string, submittedCode: string): { success: boolean; error?: string } {
  const key = normalizePhoneKey(phone);
  const entry = otpMap.get(key);

  if (!entry) {
    return { success: false, error: "No active OTP found for this number. Please request a new code." };
  }

  if (Date.now() > entry.expiresAt) {
    otpMap.delete(key);
    return { success: false, error: "OTP has expired. Please request a new code." };
  }

  if (entry.attempts >= 5) {
    otpMap.delete(key);
    return { success: false, error: "Too many failed attempts. Please request a new code." };
  }

  entry.attempts += 1;

  if (entry.code !== submittedCode.trim()) {
    return { success: false, error: "Incorrect OTP entered. Please check your SMS and try again." };
  }

  otpMap.delete(key);
  return { success: true };
}
