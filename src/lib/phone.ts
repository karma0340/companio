/**
 * Indian Mobile Number Validator and Formatter
 * 
 * Enforces:
 * 1. Strict country prefix: +91
 * 2. Exactly 10 national digits
 * 3. Starting digit allocated to Indian mobile networks (6, 7, 8, or 9)
 * 4. Automatic rejection of mock, dummy, repetitive, and sequential numbers
 */

const KNOWN_MOCK_NUMBERS = new Set([
  "0000000000",
  "1111111111",
  "2222222222",
  "3333333333",
  "4444444444",
  "5555555555",
  "6666666666",
  "7777777777",
  "8888888888",
  "9999999999",
  "1234567890",
  "0123456789",
  "9876543210",
  "9811223399",
  "9999999901",
  "9999999902",
  "9898989898",
  "9191919191",
  "9000000000",
]);

export interface PhoneValidationResult {
  isValid: boolean;
  countryCode: string;
  nationalNumber: string;
  e164: string;
  formatted: string;
  error?: string;
}

export function validateIndianMobileNumber(input: string): PhoneValidationResult {
  const trimmed = (input || "").trim();

  if (!trimmed) {
    return {
      isValid: false,
      countryCode: "+91",
      nationalNumber: "",
      e164: "",
      formatted: "",
      error: "Please enter your mobile number.",
    };
  }

  // Detect foreign country code mismatch
  if (trimmed.startsWith("+") && !trimmed.startsWith("+91")) {
    const foreignCode = trimmed.slice(0, 4);
    return {
      isValid: false,
      countryCode: "+91",
      nationalNumber: "",
      e164: "",
      formatted: "",
      error: `Foreign country code (${foreignCode}) is not supported. Please provide a valid Indian (+91) mobile number.`,
    };
  }

  // Remove all non-digits
  let digits = trimmed.replace(/\D/g, "");

  // If input started with country code 91 and has 12 digits, strip country code
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  // Strip single leading 0 if someone entered trunk prefix (e.g. 09812345678)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // 1. Length check: Must be exactly 10 digits
  if (digits.length < 10) {
    return {
      isValid: false,
      countryCode: "+91",
      nationalNumber: digits,
      e164: `+91${digits}`,
      formatted: digits,
      error: `Mobile number must have exactly 10 digits (currently ${digits.length}).`,
    };
  }

  if (digits.length > 10) {
    return {
      isValid: false,
      countryCode: "+91",
      nationalNumber: digits,
      e164: `+91${digits}`,
      formatted: digits,
      error: `Mobile number exceeds 10 digits (currently ${digits.length}). Please remove extra digits.`,
    };
  }

  // 2. Starting digit check: TRAI allocates Indian mobile numbers to 6, 7, 8, 9
  const firstDigit = digits.charAt(0);
  if (!["6", "7", "8", "9"].includes(firstDigit)) {
    return {
      isValid: false,
      countryCode: "+91",
      nationalNumber: digits,
      e164: `+91${digits}`,
      formatted: digits,
      error: `Invalid Indian mobile prefix '${firstDigit}'. Valid Indian numbers start with 6, 7, 8, or 9.`,
    };
  }

  // 3. Reject all identical repetitive digits (e.g. 9999999999, 8888888888)
  const isRepetitive = digits.split("").every((d) => d === digits[0]);
  if (isRepetitive) {
    return {
      isValid: false,
      countryCode: "+91",
      nationalNumber: digits,
      e164: `+91${digits}`,
      formatted: digits,
      error: "Repetitive dummy number detected. Please enter a genuine mobile number.",
    };
  }

  // 4. Reject known mock, dummy, or sequential series
  if (KNOWN_MOCK_NUMBERS.has(digits)) {
    return {
      isValid: false,
      countryCode: "+91",
      nationalNumber: digits,
      e164: `+91${digits}`,
      formatted: digits,
      error: "Mock or placeholder mobile numbers are not allowed. Please enter your real number.",
    };
  }

  // Formatted as: 98123 45678
  const formatted = `${digits.slice(0, 5)} ${digits.slice(5)}`;

  return {
    isValid: true,
    countryCode: "+91",
    nationalNumber: digits,
    e164: `+91${digits}`,
    formatted,
  };
}
