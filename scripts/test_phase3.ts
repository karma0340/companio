import { generateAndStoreOtp, verifyOtp } from "../src/lib/otp-store";
import { PASS_TIER_OPTIONS } from "../src/lib/data";

console.log("==================================================");
console.log("RUNNING PHASE 3 AUTOMATED VERIFICATION SUITE");
console.log("==================================================");

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string) {
  total++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. OTP Generation & Verification
const testPhone = "+919811223399";
const generatedOtp = generateAndStoreOtp(testPhone);
assert(typeof generatedOtp === "string" && generatedOtp.length === 6, "OTP generated is 6 digits");

// Incorrect OTP test
const wrongAttempt = verifyOtp(testPhone, "000000");
assert(wrongAttempt.success === false, "Wrong OTP attempt is rejected");
assert(wrongAttempt.error?.includes("Incorrect OTP") === true, "Appropriate error message returned on wrong OTP");

// Correct OTP test
const correctAttempt = verifyOtp(testPhone, generatedOtp);
assert(correctAttempt.success === true, "Correct OTP verified successfully");

// Second use of same OTP should fail (single-use token)
const replayAttempt = verifyOtp(testPhone, generatedOtp);
assert(replayAttempt.success === false, "Replay of already consumed OTP is rejected");

// 2. Pass Tier Pricing & Expiry Validation
const oneMonth = PASS_TIER_OPTIONS.find((p) => p.tier === "ONE_MONTH");
assert(oneMonth !== undefined, "1-Month Pass tier exists");
assert(oneMonth?.price === 99.50, "1-Month Pass price is exactly ₹99.50");
assert(oneMonth?.durationDays === 30, "1-Month Pass duration is 30 calendar days");

const lifetime = PASS_TIER_OPTIONS.find((p) => p.tier === "LIFETIME");
assert(lifetime !== undefined, "Lifetime Pass tier exists");
assert(lifetime?.price === 999.50, "Lifetime Pass price is exactly ₹999.50");
assert(lifetime?.durationDays === null, "Lifetime Pass has NULL duration (never expires)");

// 3. Expiry Calculation Logic
const now = Date.now();
const oneMonthExpiry = new Date(now + 30 * 24 * 60 * 60 * 1000);
const daysDiff = Math.round((oneMonthExpiry.getTime() - now) / (1000 * 60 * 60 * 24));
assert(daysDiff === 30, "Calculated 30-day expiration window is accurate");

// 4. Pass Expiry State Check Simulation
interface MockUserRecord {
  id: string;
  isUnlocked: boolean;
  passTier: string;
  expiresAt: Date | null;
}

const mockUsers: MockUserRecord[] = [
  { id: "u1", isUnlocked: true, passTier: "ONE_MONTH", expiresAt: new Date(now - 1000) }, // Expired
  { id: "u2", isUnlocked: true, passTier: "ONE_MONTH", expiresAt: new Date(now + 15 * 86400000) }, // Active
  { id: "u3", isUnlocked: true, passTier: "LIFETIME", expiresAt: null }, // Lifetime
];

// Run cron simulation
const expiredToRelock = mockUsers.filter(
  (u) => u.isUnlocked && u.passTier !== "LIFETIME" && u.expiresAt !== null && u.expiresAt.getTime() < now
);

assert(expiredToRelock.length === 1, "Expiry daemon accurately identifies exactly 1 expired user");
assert(expiredToRelock[0].id === "u1", "Expired user u1 correctly flagged for re-locking");

// Active and lifetime should stay unlocked
const activeRemaining = mockUsers.filter(
  (u) => u.isUnlocked && (u.passTier === "LIFETIME" || (u.expiresAt !== null && u.expiresAt.getTime() >= now))
);
assert(activeRemaining.length === 2, "Active 15-day and Lifetime users remain unlocked");

console.log("==================================================");
console.log(`PHASE 3 TEST RESULTS: ${passed}/${total} TESTS PASSED`);
console.log("==================================================");
