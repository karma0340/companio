/**
 * In-Memory OTP Store with 5-Minute Time-To-Live (TTL)
 */

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global in-memory phone -> OtpEntry map surviving Next.js dev reloads
const globalForOtp = globalThis as unknown as {
  otpMap: Map<string, OtpEntry> | undefined;
};

const otpMap = globalForOtp.otpMap ?? new Map<string, OtpEntry>();
globalForOtp.otpMap = otpMap;

function normalizePhoneKey(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function generateAndStoreOtp(phone: string): string {
  const key = normalizePhoneKey(phone);

  // Generate authentic random 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  otpMap.set(key, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
  });

  return code;
}

export function verifyOtp(phone: string, submittedCode: string): { success: boolean; error?: string } {
  const key = normalizePhoneKey(phone);
  const entry = otpMap.get(key);

  if (!entry) {
    return { success: false, error: "No OTP requested for this number. Please request a new code." };
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
    return { success: false, error: "Incorrect OTP. Please check the code and try again." };
  }

  // OTP verified successfully; clear it
  otpMap.delete(key);
  return { success: true };
}
