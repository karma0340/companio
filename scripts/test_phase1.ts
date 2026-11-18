import { filterChatMessage } from "../src/lib/filters";
import { signUserToken, verifyUserToken } from "../src/lib/auth";

console.log("==================================================");
console.log("RUNNING PHASE 1 AUTOMATED VERIFICATION SUITE");
console.log("==================================================");

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Phone number redaction tests
const phoneTest1 = filterChatMessage("Hey let's talk directly on 9811223344 for coffee");
assert(phoneTest1.isClean === false, "Phone number detection flags unclean message");
assert(phoneTest1.filteredContent.includes("[PHONE NUMBER REDACTED FOR SAFETY]"), "Phone number is cleanly replaced with redaction label");
assert(!phoneTest1.filteredContent.includes("9811223344"), "Original phone number is completely purged");

const phoneTest2 = filterChatMessage("My number is +91 99887 76655 call me");
assert(phoneTest2.isClean === false, "+91 spaced phone format detected");

// 2. WhatsApp / external link redaction tests
const waTest = filterChatMessage("Text me at wa.me/919999999901 see you there");
assert(waTest.isClean === false, "WhatsApp direct link detected");
assert(waTest.filteredContent.includes("[EXTERNAL LINK REDACTED]"), "WhatsApp link redacted");

// 3. Instagram / Social handle redaction tests
const igTest = filterChatMessage("Add me on insta @vanshika_delhi");
assert(igTest.isClean === false, "Instagram handle detected");
assert(igTest.filteredContent.includes("[SOCIAL HANDLE REDACTED]"), "Social handle redacted");

// 4. UPI handle redaction tests
const upiTest = filterChatMessage("Send payment directly to my upi vanshika@okhdfcbank");
assert(upiTest.isClean === false, "UPI handle detected");
assert(upiTest.filteredContent.includes("[PAYMENT HANDLE REDACTED]"), "UPI handle redacted");

// 5. Clean logistics message test
const cleanTest = filterChatMessage("Let's meet at Third Wave Coffee Indiranagar at 4 PM, I'm wearing a blue shirt");
assert(cleanTest.isClean === true, "Legitimate cafe meeting logistics message passes unredacted");
assert(cleanTest.filteredContent === "Let's meet at Third Wave Coffee Indiranagar at 4 PM, I'm wearing a blue shirt", "Clean content unmodified");

// 6. JWT Authentication tests
const token = signUserToken({
  userId: "user_test_123",
  phone: "+919999999901",
  role: "MEMBER",
  isUnlocked: true,
});
assert(typeof token === "string" && token.length > 20, "JWT token generated successfully");

const payload = verifyUserToken(token);
assert(payload !== null, "JWT token verified successfully");
assert(payload?.userId === "user_test_123", "JWT payload userId matches");
assert(payload?.isUnlocked === true, "JWT payload isUnlocked matches");

const invalidPayload = verifyUserToken("invalid.tampered.token");
assert(invalidPayload === null, "Tampered JWT token rejected safely");

console.log("==================================================");
console.log(`TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log("==================================================");
