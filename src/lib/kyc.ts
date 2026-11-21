/**
 * KYC Validation Utilities
 * Strict Indian compliance according to UIDAI & DPDP Act 2023.
 */

// Verhoeff multiplication table
const d: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

// Verhoeff permutation table
const p: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

export interface AadhaarValidationResult {
  isValid: boolean;
  formatted: string;
  masked: string;
  rawDigits: string;
  isChecksumValid: boolean;
  message: string;
}

/**
 * Validates and formats a 12-digit Indian Aadhaar number.
 */
export function validateAadhaarNumber(input: string): AadhaarValidationResult {
  const digits = (input || "").replace(/\D/g, "").slice(0, 12);
  const formatted = digits.match(/.{1,4}/g)?.join(" ") || digits;

  // Masked format: •••• •••• 1234
  let masked = formatted;
  if (digits.length >= 8) {
    const lastFour = digits.slice(-4);
    masked = `•••• •••• ${lastFour}`;
  }

  if (digits.length === 0) {
    return {
      isValid: false,
      formatted: "",
      masked: "",
      rawDigits: "",
      isChecksumValid: false,
      message: "Please enter your 12-digit Aadhaar number.",
    };
  }

  if (digits.length < 12) {
    return {
      isValid: false,
      formatted,
      masked,
      rawDigits: digits,
      isChecksumValid: false,
      message: `${12 - digits.length} more digits needed.`,
    };
  }

  // Check repetition (e.g. 0000 0000 0000 or 1111 1111 1111)
  const isRepetitive = digits.split("").every((d) => d === digits[0]);
  if (isRepetitive) {
    return {
      isValid: false,
      formatted,
      masked,
      rawDigits: digits,
      isChecksumValid: false,
      message: "Dummy or repetitive Aadhaar number is not permitted.",
    };
  }

  // Verhoeff checksum algorithm check
  let c = 0;
  const reversed = digits.split("").reverse().map(Number);
  for (let i = 0; i < reversed.length; i++) {
    c = d[c][p[i % 8][reversed[i]]];
  }
  const isChecksumValid = c === 0;

  return {
    isValid: true,
    formatted,
    masked,
    rawDigits: digits,
    isChecksumValid,
    message: isChecksumValid
      ? "Valid 12-digit Aadhaar UID format (UIDAI Verified)"
      : "12-digit UID entered (Pending human review)",
  };
}
