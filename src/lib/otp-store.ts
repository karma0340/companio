/**
 * In-Memory OTP Store with 5-Minute Time-To-Live (TTL)
 */

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// In-memory phone -> OtpEntry map
const otpMap = new Map<string, OtpEntry>();

// Designated sandbox test phone numbers for automated testing and zero-SMS evaluation
export const TEST_SANDBOX_PHONES = new Set([
  "+919811223399",
  "+919999999901",
  "+919999999902",
  "+919999999999",
]);

export function generateAndStoreOtp(phone: string): string {
  // Clean phone number (Indian format)
  const cleanPhone = phone.replace(/[\s-]/g, "");
  
  // In development, sandbox mode, or for designated test numbers, use static "123456"
  const isDevOrTest = process.env.NODE_ENV !== "production" || TEST_SANDBOX_PHONES.has(cleanPhone);
  const code = isDevOrTest ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();

  otpMap.set(cleanPhone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
  });

  return code;
}

export function verifyOtp(phone: string, submittedCode: string): { success: boolean; error?: string } {
  const cleanPhone = phone.replace(/[\s-]/g, "");
  const entry = otpMap.get(cleanPhone);

  if (!entry) {
    return { success: false, error: "No OTP requested for this number. Please request a new code." };
  }

  if (Date.now() > entry.expiresAt) {
    otpMap.delete(cleanPhone);
    return { success: false, error: "OTP has expired. Please request a new code." };
  }

  if (entry.attempts >= 5) {
    otpMap.delete(cleanPhone);
    return { success: false, error: "Too many failed attempts. Please request a new code." };
  }

  entry.attempts += 1;

  const isTestBypass = TEST_SANDBOX_PHONES.has(cleanPhone) && submittedCode.trim() === "123456";
  if (entry.code !== submittedCode.trim() && !isTestBypass) {
    return { success: false, error: "Incorrect OTP. Please check the code and try again." };
  }

  // OTP verified successfully; clear it
  otpMap.delete(cleanPhone);
  return { success: true };
}

