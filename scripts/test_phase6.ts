import {
  createBooking,
  respondToBooking,
  verifyHandshakePin,
  completeSession,
  submitSessionReview,
  triggerSosAlert,
  getBookingById,
} from "../src/lib/bookings";

console.log("==================================================");
console.log("RUNNING PHASE 6 HANDSHAKE, SESSION & PAYOUT SUITE");
console.log("==================================================");

let passed = 0;
let total = 0;

function assert(condition: boolean, desc: string, detail?: any) {
  total++;
  if (condition) {
    console.log(`[PASS] ${desc}`);
    passed++;
  } else {
    console.error(`[FAIL] ${desc}`, detail || "");
    process.exitCode = 1;
  }
}

async function run() {
  // 1. Create and confirm a booking
  const booking = await createBooking({
    memberId: "usr_phase6_member",
    memberName: "Vikram Malhotra",
    memberPhone: "+919811223399",
    companionId: "comp_01",
    activityId: "act_01",
    scheduledDate: new Date(Date.now() + 2 * 3600000).toISOString(),
    durationHours: 1,
    venueName: "Blue Tokai Coffee Roasters",
    venueAddress: "Hauz Khas Village, New Delhi",
  });

  await respondToBooking(booking.id, "ACCEPT");

  const correctPin = booking.verificationPin;
  assert(typeof correctPin === "string" && correctPin.length === 4, "Booking has 4-digit verification PIN");

  // 2. Submit wrong PIN
  const wrongPinRes = await verifyHandshakePin(booking.id, "0000");
  assert(wrongPinRes.success === false, "Incorrect 4-digit PIN is rejected");
  assert(wrongPinRes.error?.includes("Incorrect 4-digit PIN") === true, "Appropriate error message on wrong PIN");

  // 3. Submit correct PIN
  const correctPinRes = await verifyHandshakePin(booking.id, correctPin);
  assert(correctPinRes.success === true, "Correct 4-digit PIN is verified successfully");
  assert(correctPinRes.booking?.status === "IN_PROGRESS", "Booking status flipped to IN_PROGRESS");
  assert(typeof correctPinRes.booking?.pinVerifiedAt === "string", "pinVerifiedAt timestamp recorded");
  assert(typeof correctPinRes.booking?.sessionStartedAt === "string", "sessionStartedAt timestamp recorded");

  // 4. Session Completion & Cashfree Escrow Payout
  const completeRes = await completeSession(booking.id);
  assert(completeRes.success === true, "Session completion succeeds");
  assert(completeRes.booking?.status === "COMPLETED", "Booking status flipped to COMPLETED");
  assert(completeRes.booking?.escrowStatus === "RELEASED_TO_HOST", "Escrow status released to RELEASED_TO_HOST");
  assert(completeRes.payout?.gateway === "CASHFREE", "Payout gateway is CASHFREE");
  assert(completeRes.payout?.amount === 499.00, "Payout amount matches host companion fee of ₹499.00");
  assert(typeof completeRes.payout?.utr === "string" && completeRes.payout.utr.startsWith("CF2026"), "Bank UTR reference generated");
  assert(completeRes.payout?.recipientUpiId === "vanshika@okhdfcbank", "Recipient UPI matches host profile");

  // 5. Post-Session Review & Rating
  const reviewRes = await submitSessionReview({
    bookingId: booking.id,
    memberId: "usr_phase6_member",
    score: 5,
    comment: "Fantastic conversation and very punctual at Blue Tokai!",
    tags: ["Punctual", "Great Conversation", "Respectful & Safe"],
  });
  assert(reviewRes.success === true, "Post-session review submitted successfully");
  assert(reviewRes.review?.score === 5, "Review score recorded as 5 stars");
  assert(reviewRes.review?.companionId === "comp_01", "Review mapped to companion comp_01");

  // 6. Emergency SOS Protocol
  const sosRes = await triggerSosAlert({
    bookingId: booking.id,
    userId: "usr_phase6_member",
    latitude: 28.5535,
    longitude: 77.1945,
  });
  assert(sosRes.success === true, "Emergency SOS alert logged successfully");
  assert(sosRes.emergencyDial === "112", "Emergency dial routing directs to 112");
  assert(sosRes.alertId.startsWith("sos_"), "SOS alert tracking ID generated");

  console.log("==================================================");
  console.log(`PHASE 6 TEST RESULTS: ${passed}/${total} PASSED`);
  console.log("==================================================");
}

run();
