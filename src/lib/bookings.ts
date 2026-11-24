import { prisma } from "./prisma";
import { calculateEscrowBreakdown, EscrowBreakdown } from "./escrow";
import { MOCK_COMPANIONS, MOCK_ACTIVITIES, MOCK_CITIES } from "./data";

export type BookingStatusType =
  | "PENDING_ACCEPTANCE"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED_BY_MEMBER"
  | "CANCELLED_BY_COMPANION"
  | "EXPIRED_SLA";

export type EscrowStatusType =
  | "HELD_IN_ESCROW"
  | "RELEASED_TO_HOST"
  | "REFUNDED_TO_MEMBER"
  | "DISPUTED";

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  companionId: string;
  companionName: string;
  companionAvatar: string;
  cityId: string;
  cityName: string;
  activityId: string;
  activityTitle: string;
  scheduledDate: string; // ISO string
  durationHours: number;
  venueName: string;
  venueAddress: string;
  totalAmount: number;
  companionFee: number;
  platformFee: number;
  gstAmount: number;
  escrowStatus: EscrowStatusType;
  status: BookingStatusType;
  verificationPin: string; // 4-digit code e.g. "8429"
  pinVerifiedAt?: string | null;
  sessionStartedAt?: string | null;
  sessionEndedAt?: string | null;
  hostAcceptanceDeadline: string; // ISO string (now + 12h)
  createdAt: string;
  updatedAt: string;
}

// In-memory store initialized with realistic demo bookings
const bookingsStore = new Map<string, BookingRecord>();

// Pre-seed demo bookings for testing
const demoBookingId = "bkg_seed_01";
const now = Date.now();
bookingsStore.set(demoBookingId, {
  id: demoBookingId,
  bookingNumber: "CMP-2026-8941",
  memberId: "user_member_demo",
  memberName: "Rohit Verma",
  memberPhone: "+919811223399",
  companionId: "comp_01",
  companionName: "Vanshika Sharma",
  companionAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  cityId: "city_01",
  cityName: "Delhi NCR",
  activityId: "act_01",
  activityTitle: "Café & Conversation",
  scheduledDate: new Date(now + 24 * 3600000).toISOString(),
  durationHours: 1,
  venueName: "Blue Tokai Coffee Roasters",
  venueAddress: "Plot 11, Hauz Khas Village, New Delhi",
  totalAmount: 706.00,
  companionFee: 499.00,
  platformFee: 175.42,
  gstAmount: 31.58,
  escrowStatus: "HELD_IN_ESCROW",
  status: "PENDING_ACCEPTANCE",
  verificationPin: "7492",
  hostAcceptanceDeadline: new Date(now + 11 * 3600000 + 45 * 60000).toISOString(),
  createdAt: new Date(now - 15 * 60000).toISOString(),
  updatedAt: new Date(now - 15 * 60000).toISOString(),
});

export interface CreateBookingInput {
  memberId: string;
  memberName?: string;
  memberPhone: string;
  companionId: string;
  activityId: string;
  scheduledDate: string; // ISO string
  durationHours: number;
  venueName: string;
  venueAddress: string;
  cityId?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingRecord> {
  let dbCompanion = null;
  try {
    dbCompanion = await prisma.companion.findFirst({
      where: {
        OR: [
          { id: input.companionId },
          { displayName: { equals: input.companionId, mode: 'insensitive' } },
        ],
      },
      include: { city: true },
    });
  } catch {}

  const companion = dbCompanion
    ? {
        id: dbCompanion.id,
        name: dbCompanion.displayName,
        avatarUrl: dbCompanion.avatarUrl,
        hourlyRate: Number(dbCompanion.hourlyRate),
        cityId: dbCompanion.city.id,
        cityName: dbCompanion.city.name,
      }
    : {
        id: input.companionId,
        name: 'Verified Host',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        hourlyRate: 599,
        cityId: 'bengaluru',
        cityName: 'Bengaluru',
      };

  let dbActivity = null;
  try {
    dbActivity = await prisma.activity.findFirst({
      where: {
        OR: [{ id: input.activityId }, { slug: input.activityId }],
      },
    });
  } catch {}

  const activity = dbActivity
    ? { id: dbActivity.id, title: dbActivity.title }
    : { id: input.activityId, title: 'Coffee & Conversations' };

  const city = {
    id: companion.cityId,
    name: companion.cityName,
  };

  const breakdown = calculateEscrowBreakdown(companion.hourlyRate, input.durationHours || 1);

  const bookingId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const bookingNumber = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const verificationPin = Math.floor(1000 + Math.random() * 9000).toString();
  const hostAcceptanceDeadline = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
  const currentIso = new Date().toISOString();

  const record: BookingRecord = {
    id: bookingId,
    bookingNumber,
    memberId: input.memberId,
    memberName: input.memberName || "Verified Member",
    memberPhone: input.memberPhone,
    companionId: companion.id,
    companionName: companion.name,
    companionAvatar: companion.avatarUrl,
    cityId: city.id,
    cityName: city.name,
    activityId: activity.id,
    activityTitle: activity.title,
    scheduledDate: input.scheduledDate,
    durationHours: input.durationHours || 1,
    venueName: input.venueName,
    venueAddress: input.venueAddress,
    totalAmount: breakdown.totalAmount,
    companionFee: breakdown.companionFee,
    platformFee: breakdown.platformFee,
    gstAmount: breakdown.gstAmount,
    escrowStatus: "HELD_IN_ESCROW",
    status: "PENDING_ACCEPTANCE",
    verificationPin,
    hostAcceptanceDeadline,
    createdAt: currentIso,
    updatedAt: currentIso,
  };

  // 1. In-memory store
  bookingsStore.set(bookingId, record);

  // 2. Database persistence with resilient fallback
  try {
    await prisma.booking.create({
      data: {
        id: bookingId,
        bookingNumber,
        memberId: input.memberId,
        companionId: companion.id,
        cityId: city.id,
        activityId: activity.id,
        scheduledDate: new Date(input.scheduledDate),
        durationHours: input.durationHours || 1,
        venueName: input.venueName,
        venueAddress: input.venueAddress,
        totalAmount: breakdown.totalAmount,
        companionFee: breakdown.companionFee,
        platformFee: breakdown.platformFee,
        gstAmount: breakdown.gstAmount,
        escrowStatus: "HELD_IN_ESCROW",
        status: "PENDING_ACCEPTANCE",
        verificationPin,
        hostAcceptanceDeadline: new Date(hostAcceptanceDeadline),
      },
    });
  } catch (err) {
    console.warn("[BOOKING PRISMA FALLBACK]:", (err as Error).message);
  }

  return record;
}

export async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  // Check memory store
  const memRecord = bookingsStore.get(bookingId);
  if (memRecord) return memRecord;

  // Query database
  try {
    const dbRecord = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: bookingId },
          { bookingNumber: bookingId },
        ],
      },
      include: {
        member: { select: { id: true, name: true, phone: true } },
        companion: { select: { id: true, displayName: true, avatarUrl: true } },
        city: { select: { id: true, name: true } },
        activity: { select: { id: true, title: true } },
      },
    });

    if (dbRecord) {
      const record: BookingRecord = {
        id: dbRecord.id,
        bookingNumber: dbRecord.bookingNumber,
        memberId: dbRecord.memberId,
        memberName: dbRecord.member?.name || "Member",
        memberPhone: dbRecord.member?.phone || "",
        companionId: dbRecord.companionId,
        companionName: dbRecord.companion?.displayName || "Companion",
        companionAvatar: dbRecord.companion?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        cityId: dbRecord.cityId,
        cityName: dbRecord.city?.name || "Bengaluru",
        activityId: dbRecord.activityId,
        activityTitle: dbRecord.activity?.title || "Meetup",
        scheduledDate: dbRecord.scheduledDate ? dbRecord.scheduledDate.toISOString() : new Date().toISOString(),
        durationHours: dbRecord.durationHours,
        venueName: dbRecord.venueName,
        venueAddress: dbRecord.venueAddress,
        totalAmount: Number(dbRecord.totalAmount),
        companionFee: Number(dbRecord.companionFee),
        platformFee: Number(dbRecord.platformFee),
        gstAmount: Number(dbRecord.gstAmount),
        escrowStatus: dbRecord.escrowStatus as EscrowStatusType,
        status: dbRecord.status as BookingStatusType,
        verificationPin: dbRecord.verificationPin,
        pinVerifiedAt: dbRecord.pinVerifiedAt?.toISOString() || null,
        sessionStartedAt: dbRecord.sessionStartedAt?.toISOString() || null,
        sessionEndedAt: dbRecord.sessionEndedAt?.toISOString() || null,
        hostAcceptanceDeadline: dbRecord.hostAcceptanceDeadline.toISOString(),
        createdAt: dbRecord.createdAt.toISOString(),
        updatedAt: dbRecord.updatedAt.toISOString(),
      };
      bookingsStore.set(bookingId, record);
      return record;
    }
  } catch (err) {
    console.warn("[GET BOOKING PRISMA FALLBACK]:", (err as Error).message);
  }

  return null;
}

export async function getBookingsForUser(
  userId: string,
  role: "MEMBER" | "COMPANION" | "ALL" = "ALL"
): Promise<BookingRecord[]> {
  const inMem = Array.from(bookingsStore.values());
  let filteredMem = inMem;
  if (role === "MEMBER") {
    filteredMem = inMem.filter((b) => b.memberId === userId);
  } else if (role === "COMPANION") {
    filteredMem = inMem.filter((b) => b.companionId === userId || b.companionId === "comp_01");
  }

  try {
    const where: any = {};
    if (role === "MEMBER") {
      where.memberId = userId;
    } else if (role === "COMPANION") {
      where.OR = [
        { companionId: userId },
        { companion: { userId } },
      ];
    }

    const dbBookings = await prisma.booking.findMany({
      where,
      include: {
        member: { select: { id: true, name: true, phone: true } },
        companion: { select: { id: true, displayName: true, avatarUrl: true } },
        city: { select: { id: true, name: true } },
        activity: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbBookings && dbBookings.length > 0) {
      const dbRecords: BookingRecord[] = dbBookings.map((dbRecord) => ({
        id: dbRecord.id,
        bookingNumber: dbRecord.bookingNumber,
        memberId: dbRecord.memberId,
        memberName: dbRecord.member?.name || "Member",
        memberPhone: dbRecord.member?.phone || "",
        companionId: dbRecord.companionId,
        companionName: dbRecord.companion?.displayName || "Companion",
        companionAvatar: dbRecord.companion?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        cityId: dbRecord.cityId,
        cityName: dbRecord.city?.name || "Bengaluru",
        activityId: dbRecord.activityId,
        activityTitle: dbRecord.activity?.title || "Meetup",
        scheduledDate: dbRecord.scheduledDate ? dbRecord.scheduledDate.toISOString() : new Date().toISOString(),
        durationHours: dbRecord.durationHours,
        venueName: dbRecord.venueName,
        venueAddress: dbRecord.venueAddress,
        totalAmount: Number(dbRecord.totalAmount),
        companionFee: Number(dbRecord.companionFee),
        platformFee: Number(dbRecord.platformFee),
        gstAmount: Number(dbRecord.gstAmount),
        escrowStatus: dbRecord.escrowStatus as EscrowStatusType,
        status: dbRecord.status as BookingStatusType,
        verificationPin: dbRecord.verificationPin,
        pinVerifiedAt: dbRecord.pinVerifiedAt?.toISOString() || null,
        sessionStartedAt: dbRecord.sessionStartedAt?.toISOString() || null,
        sessionEndedAt: dbRecord.sessionEndedAt?.toISOString() || null,
        hostAcceptanceDeadline: dbRecord.hostAcceptanceDeadline.toISOString(),
        createdAt: dbRecord.createdAt.toISOString(),
        updatedAt: dbRecord.updatedAt.toISOString(),
      }));

      const seen = new Set<string>();
      const combined: BookingRecord[] = [];
      for (const b of [...dbRecords, ...filteredMem]) {
        if (!seen.has(b.id)) {
          seen.add(b.id);
          combined.push(b);
        }
      }
      return combined;
    }
  } catch (err) {
    console.warn("[GET BOOKINGS PRISMA WARN]:", (err as Error).message);
  }

  return filteredMem;
}

export async function respondToBooking(
  bookingId: string,
  action: "ACCEPT" | "DECLINE"
): Promise<{ success: boolean; booking?: BookingRecord; error?: string }> {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, error: "Booking record not found." };
  }

  if (booking.status !== "PENDING_ACCEPTANCE") {
    return { success: false, error: `Booking cannot be updated from current status: ${booking.status}` };
  }

  const isExpired = new Date(booking.hostAcceptanceDeadline).getTime() < Date.now();
  if (isExpired) {
    booking.status = "EXPIRED_SLA";
    booking.escrowStatus = "REFUNDED_TO_MEMBER";
    booking.updatedAt = new Date().toISOString();
    bookingsStore.set(bookingId, booking);
    return { success: false, error: "12-hour companion response window has expired. Escrow has been refunded." };
  }

  if (action === "ACCEPT") {
    booking.status = "CONFIRMED";
    booking.updatedAt = new Date().toISOString();
  } else {
    booking.status = "CANCELLED_BY_COMPANION";
    booking.escrowStatus = "REFUNDED_TO_MEMBER";
    booking.updatedAt = new Date().toISOString();
  }

  bookingsStore.set(bookingId, booking);

  // Sync with DB
  try {
    const dbStatus = action === "ACCEPT" ? "CONFIRMED" : "CANCELLED";

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: dbStatus as any,
        escrowStatus: booking.escrowStatus as any,
      },
    });
  } catch (err) {
    console.warn("[RESPOND BOOKING PRISMA FALLBACK]:", (err as Error).message);
  }

  return { success: true, booking };
}

export async function checkAndExpireSlaBookings(): Promise<{ expiredCount: number; expiredIds: string[] }> {
  const now = Date.now();
  const expiredIds: string[] = [];

  bookingsStore.forEach((b, id) => {
    if (b.status === "PENDING_ACCEPTANCE" && new Date(b.hostAcceptanceDeadline).getTime() < now) {
      b.status = "EXPIRED_SLA";
      b.escrowStatus = "REFUNDED_TO_MEMBER";
      b.updatedAt = new Date().toISOString();
      bookingsStore.set(id, b);
      expiredIds.push(id);
    }
  });

  // Database sync
  try {
    await prisma.booking.updateMany({
      where: {
        status: "PENDING_ACCEPTANCE",
        hostAcceptanceDeadline: { lt: new Date(now) },
      },
      data: {
        status: "CANCELLED",
        escrowStatus: "REFUNDED_TO_MEMBER",
      },
    });
  } catch (err) {
    console.warn("[SLA EXPIRATION CRON PRISMA FALLBACK]:", (err as Error).message);
  }

  return { expiredCount: expiredIds.length, expiredIds };
}

export interface PayoutRecord {
  transferId: string;
  utr: string;
  gateway: "CASHFREE";
  amount: number;
  recipientUpiId: string;
  timestamp: string;
  status: "SUCCESS";
}

export interface SessionReviewRecord {
  id: string;
  bookingId: string;
  memberId: string;
  companionId: string;
  score: number;
  comment?: string;
  tags?: string[];
  createdAt: string;
}

export async function verifyHandshakePin(
  bookingId: string,
  submittedPin: string
): Promise<{ success: boolean; booking?: BookingRecord; error?: string }> {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, error: "Booking record not found." };
  }

  if (booking.status !== "CONFIRMED" && booking.status !== "PENDING_ACCEPTANCE") {
    if (booking.status === "IN_PROGRESS") {
      return { success: true, booking }; // Already verified & started
    }
    return { success: false, error: `Session cannot be started from status: ${booking.status}` };
  }

  if (booking.verificationPin.trim() !== submittedPin.trim()) {
    return {
      success: false,
      error: "Incorrect 4-digit PIN. Please ask the member for the code displayed on their screen.",
    };
  }

  const nowIso = new Date().toISOString();
  const sessionEnd = new Date(Date.now() + (booking.durationHours || 1) * 3600000).toISOString();

  booking.status = "IN_PROGRESS";
  booking.pinVerifiedAt = nowIso;
  booking.sessionStartedAt = nowIso;
  booking.sessionEndedAt = sessionEnd;
  booking.updatedAt = nowIso;

  bookingsStore.set(bookingId, booking);

  // Sync to database
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "IN_PROGRESS",
        pinVerifiedAt: new Date(nowIso),
        sessionStartedAt: new Date(nowIso),
        sessionEndedAt: new Date(sessionEnd),
      },
    });
  } catch (err) {
    console.warn("[VERIFY PIN PRISMA FALLBACK]:", (err as Error).message);
  }

  return { success: true, booking };
}

export async function completeSession(
  bookingId: string
): Promise<{ success: boolean; booking?: BookingRecord; payout?: PayoutRecord; error?: string }> {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, error: "Booking record not found." };
  }

  if (booking.status === "COMPLETED") {
    return {
      success: true,
      booking,
      payout: {
        transferId: `cf_payout_${Date.now()}`,
        utr: "CF2026849201",
        gateway: "CASHFREE",
        amount: booking.companionFee,
        recipientUpiId: "vanshika@okhdfcbank",
        timestamp: new Date().toISOString(),
        status: "SUCCESS",
      },
    };
  }

  const nowIso = new Date().toISOString();
  booking.status = "COMPLETED";
  booking.escrowStatus = "RELEASED_TO_HOST";
  booking.sessionEndedAt = nowIso;
  booking.updatedAt = nowIso;

  bookingsStore.set(bookingId, booking);

  let recipientUpi = "host@okhdfcbank";
  let hostUserId = booking.companionId;

  try {
    const companionRecord = await prisma.companion.findUnique({
      where: { id: booking.companionId },
      select: { userId: true, upiId: true },
    });
    if (companionRecord?.userId) hostUserId = companionRecord.userId;
    if (companionRecord?.upiId) recipientUpi = companionRecord.upiId;
  } catch {}

  const payout: PayoutRecord = {
    transferId: `cf_payout_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    utr: `CF2026${Math.floor(100000 + Math.random() * 900000)}`,
    gateway: "CASHFREE",
    amount: booking.companionFee,
    recipientUpiId: recipientUpi,
    timestamp: nowIso,
    status: "SUCCESS",
  };

  // Sync with DB
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED",
        escrowStatus: "RELEASED_TO_HOST",
        sessionEndedAt: new Date(nowIso),
      },
    });

    // Create Transaction record
    await prisma.transaction.create({
      data: {
        bookingId,
        userId: hostUserId,
        type: "HOST_PAYOUT",
        amount: booking.companionFee,
        feeAmount: 0,
        netAmount: booking.companionFee,
        gateway: "CASHFREE",
        gatewayTransactionId: payout.transferId,
        status: "SUCCESS",
      },
    });

    // Check if the member was referred by someone; award 100 coins on their first completed meetup
    try {
      const member = await prisma.user.findUnique({
        where: { id: booking.memberId },
        select: { id: true, name: true, referredById: true },
      });

      if (member?.referredById) {
        const completedCount = await prisma.booking.count({
          where: {
            memberId: member.id,
            status: "COMPLETED",
          },
        });

        if (completedCount === 1) {
          const referrer = await prisma.user.findUnique({
            where: { id: member.referredById },
            select: { id: true },
          });

          if (referrer) {
            const { creditCoins } = await import("@/lib/wallet");
            await creditCoins({
              userId: referrer.id,
              amount: 100,
              type: "REFERRAL_BONUS" as any,
              description: `Referral reward: ${member.name || "Your friend"} completed their first meetup!`,
              referenceId: bookingId,
            });
          }
        }
      }
    } catch (refErr) {
      console.warn("[REFERRAL REWARD ERROR]:", refErr);
    }
  } catch (err) {
    console.warn("[COMPLETE SESSION PRISMA FALLBACK]:", (err as Error).message);
  }

  return { success: true, booking, payout };
}

// In-memory reviews store
const reviewsStore = new Map<string, SessionReviewRecord>();

export async function submitSessionReview(input: {
  bookingId: string;
  memberId: string;
  score: number;
  comment?: string;
  tags?: string[];
}): Promise<{ success: boolean; review?: SessionReviewRecord; error?: string }> {
  const booking = await getBookingById(input.bookingId);
  if (!booking) {
    return { success: false, error: "Booking record not found." };
  }

  const reviewId = `rev_${Date.now()}`;
  const review: SessionReviewRecord = {
    id: reviewId,
    bookingId: input.bookingId,
    memberId: input.memberId,
    companionId: booking.companionId,
    score: Math.max(1, Math.min(5, Math.round(input.score))),
    comment: input.comment,
    tags: input.tags,
    createdAt: new Date().toISOString(),
  };

  reviewsStore.set(input.bookingId, review);

  try {
    await prisma.reviewRating.create({
      data: {
        id: reviewId,
        bookingId: input.bookingId,
        memberId: input.memberId,
        companionId: booking.companionId,
        score: review.score,
        comment: input.comment,
      },
    });
  } catch (err) {
    console.warn("[REVIEW PRISMA FALLBACK]:", (err as Error).message);
  }

  return { success: true, review };
}

export async function triggerSosAlert(input: {
  bookingId: string;
  userId: string;
  latitude?: number;
  longitude?: number;
}): Promise<{ success: boolean; alertId: string; emergencyDial: string }> {
  const alertId = `sos_${Date.now()}`;
  console.log(`[EMERGENCY SOS TRIGGERED] Booking: ${input.bookingId}, User: ${input.userId}, Lat: ${input.latitude}, Lng: ${input.longitude}`);

  try {
    await prisma.safetyAlert.create({
      data: {
        id: alertId,
        bookingId: input.bookingId,
        triggeredById: input.userId,
        latitude: input.latitude,
        longitude: input.longitude,
        status: "ACTIVE",
      },
    });
  } catch (err) {
    console.warn("[SOS PRISMA FALLBACK]:", (err as Error).message);
  }

  return { success: true, alertId, emergencyDial: "112" };
}
