import { calculateEscrowBreakdown } from "../src/lib/escrow";
import {
  createBooking,
  getBookingById,
  respondToBooking,
  checkAndExpireSlaBookings,
} from "../src/lib/bookings";

console.log("==================================================");
console.log("RUNNING PHASE 4 AUTOMATED ESCROW & BOOKING SUITE");
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
  // 1. Escrow calculations
  const escrow1hr = calculateEscrowBreakdown(499, 1);
  assert(escrow1hr.companionFee === 499.00, "1-hr Companion Fee is exactly ₹499.00");
  assert(escrow1hr.platformFee === 175.42, "1-hr Platform Convenience Fee is exactly ₹175.42");
  assert(escrow1hr.gstAmount === 31.58, "1-hr GST (18%) is exactly ₹31.58");
  assert(escrow1hr.totalAmount === 706.00, "1-hr Total Escrow Hold is exactly ₹706.00 (Benchmark)");
  assert(escrow1hr.hostSharePercent === 70.7, "Host payout is exactly 70.7% of total escrow");

  const escrow2hr = calculateEscrowBreakdown(499, 2);
  assert(escrow2hr.companionFee === 998.00, "2-hr Companion Fee is ₹998.00");
  assert(escrow2hr.totalAmount === 1412.00, "2-hr Total Escrow Hold is ₹1,412.00");

  // 2. Booking creation
  const booking = await createBooking({
    memberId: "usr_test_member",
    memberName: "Aakash Mehta",
    memberPhone: "+919811223399",
    companionId: "comp_01",
    activityId: "act_01",
    scheduledDate: new Date(Date.now() + 24 * 3600000).toISOString(),
    durationHours: 1,
    venueName: "Blue Tokai Coffee Roasters",
    venueAddress: "Hauz Khas Village, New Delhi",
  });

  assert(typeof booking.id === "string" && booking.id.startsWith("bkg_"), "Booking ID generated");
  assert(booking.bookingNumber.startsWith("CMP-2026-"), "Booking number has official CMP-2026- prefix");
  assert(booking.status === "PENDING_ACCEPTANCE", "Initial booking status is PENDING_ACCEPTANCE");
  assert(booking.escrowStatus === "HELD_IN_ESCROW", "Initial escrow status is HELD_IN_ESCROW");
  assert(booking.totalAmount === 706.00, "Total amount held in escrow matches ₹706.00");
  assert(typeof booking.verificationPin === "string" && booking.verificationPin.length === 4, "4-digit verification PIN generated");

  // 3. 12-hour SLA deadline calculation
  const deadlineDiffHours = Math.round(
    (new Date(booking.hostAcceptanceDeadline).getTime() - Date.now()) / (1000 * 60 * 60)
  );
  assert(deadlineDiffHours === 12, "Host acceptance deadline is exactly 12 hours from creation");

  // 4. Host acceptance flow
  const acceptResult = await respondToBooking(booking.id, "ACCEPT");
  assert(acceptResult.success === true, "Host acceptance succeeds");
  assert(acceptResult.booking?.status === "CONFIRMED", "Booking status transitioned to CONFIRMED");

  // 5. Host decline flow
  const declinableBooking = await createBooking({
    memberId: "usr_test_member_2",
    memberPhone: "+919811223399",
    companionId: "comp_01",
    activityId: "act_02",
    scheduledDate: new Date(Date.now() + 48 * 3600000).toISOString(),
    durationHours: 1,
    venueName: "Third Wave Coffee",
    venueAddress: "Indiranagar, Bengaluru",
  });

  const declineResult = await respondToBooking(declinableBooking.id, "DECLINE");
  assert(declineResult.success === true, "Host decline succeeds");
  assert(declineResult.booking?.status === "CANCELLED_BY_COMPANION", "Status changed to CANCELLED_BY_COMPANION");
  assert(declineResult.booking?.escrowStatus === "REFUNDED_TO_MEMBER", "Escrow status changed to REFUNDED_TO_MEMBER");

  // 6. SLA Overdue Auto-Expiration Simulation
  const expiredBooking = await createBooking({
    memberId: "usr_test_member_3",
    memberPhone: "+919811223399",
    companionId: "comp_01",
    activityId: "act_01",
    scheduledDate: new Date(Date.now() + 24 * 3600000).toISOString(),
    durationHours: 1,
    venueName: "Cafe Coffee Day",
    venueAddress: "Connaught Place, New Delhi",
  });

  // Backdate deadline
  expiredBooking.hostAcceptanceDeadline = new Date(Date.now() - 1000).toISOString();

  const slaResult = await checkAndExpireSlaBookings();
  assert(slaResult.expiredCount >= 1, "SLA expiration daemon caught overdue booking");

  const refreshed = await getBookingById(expiredBooking.id);
  assert(refreshed?.status === "EXPIRED_SLA", "Overdue booking status changed to EXPIRED_SLA");
  assert(refreshed?.escrowStatus === "REFUNDED_TO_MEMBER", "Overdue booking escrow changed to REFUNDED_TO_MEMBER");

  console.log("==================================================");
  console.log(`PHASE 4 TEST RESULTS: ${passed}/${total} PASSED`);
  console.log("==================================================");
}

run();
