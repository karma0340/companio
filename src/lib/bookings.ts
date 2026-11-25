import { prisma } from "./prisma";
import { calculateEscrowBreakdown } from "./escrow";
import { HostLevel } from "@prisma/client";

export type BookingStatusType =
  | "PENDING_ACCEPTANCE"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
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
  companionUserId?: string;
  companionName: string;
  companionAvatar: string;
  companionUpiId?: string | null;
  cityId: string;
  cityName: string;
  activityId: string;
  activityTitle: string;
  scheduledDate: string;
  durationHours: number;
  venueName: string;
  venueAddress: string;
  totalAmount: number;
  companionFee: number; // Fixed 70% Host Share
  platformFee: number;
  gstAmount: number;
  escrowStatus: EscrowStatusType;
  status: BookingStatusType;
  verificationPin: string;
  pinVerifiedAt?: string | null;
  sessionStartedAt?: string | null;
  sessionEndedAt?: string | null;
  hostAcceptanceDeadline: string;
  hostScore?: number | null;
  hostComment?: string | null;
  hostReviewedAt?: string | null;
  memberReview?: {
    score: number;
    comment: string | null;
    createdAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

const bookingsStore = new Map<string, BookingRecord>();

export function sanitizeBookingForViewer(
  booking: BookingRecord,
  viewerUserId?: string | null
): BookingRecord {
  if (!viewerUserId || viewerUserId !== booking.memberId) {
    return {
      ...booking,
      verificationPin: "",
      memberPhone: "",
    };
  }
  return booking;
}

function mapPrismaBooking(dbRecord: any): BookingRecord {
  const defaultAvatar =
    dbRecord.companion?.gender === "male"
      ? "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/aarav-mum.jpg"
      : "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/ananya-del.jpg";

  return {
    id: dbRecord.id,
    bookingNumber: dbRecord.bookingNumber,
    memberId: dbRecord.memberId,
    memberName: dbRecord.member?.name || "Verified Member",
    memberPhone: dbRecord.member?.phone || "",
    companionId: dbRecord.companionId,
    companionUserId: dbRecord.companion?.userId || undefined,
    companionName: dbRecord.companion?.displayName || "Companion",
    companionAvatar: dbRecord.companion?.avatarUrl || defaultAvatar,
    companionUpiId: dbRecord.companion?.upiId || null,
    cityId: dbRecord.cityId,
    cityName: dbRecord.city?.name || "Chandigarh",
    activityId: dbRecord.activityId,
    activityTitle: dbRecord.activity?.title || "Meetup",
    scheduledDate: dbRecord.scheduledDate
      ? dbRecord.scheduledDate.toISOString()
      : new Date().toISOString(),
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
    hostScore: dbRecord.hostScore ?? null,
    hostComment: dbRecord.hostComment ?? null,
    hostReviewedAt: dbRecord.hostReviewedAt ? dbRecord.hostReviewedAt.toISOString() : null,
    memberReview: dbRecord.review
      ? {
          score: dbRecord.review.score,
          comment: dbRecord.review.comment ?? null,
          createdAt: dbRecord.review.createdAt.toISOString(),
        }
      : null,
    createdAt: dbRecord.createdAt.toISOString(),
    updatedAt: dbRecord.updatedAt.toISOString(),
  };
}

export async function refundEscrowCoinsIfWalletPaid(params: {
  bookingId: string;
  memberId: string;
  totalAmount: number;
  bookingNumber: string;
  reason: string;
}): Promise<boolean> {
  try {
    const walletDeposit = await prisma.transaction.findFirst({
      where: {
        bookingId: params.bookingId,
        type: "ESCROW_DEPOSIT",
        gateway: "WALLET",
        status: "SUCCESS",
      },
      select: { id: true, amount: true },
    });

    if (!walletDeposit) return false;

    const alreadyRefunded = await prisma.coinTransaction.findFirst({
      where: {
        userId: params.memberId,
        type: "MEETUP_REFUND",
        referenceId: params.bookingId,
      },
      select: { id: true },
    });

    if (alreadyRefunded) return false;

    const coinsToRefund = Math.round(Number(walletDeposit.amount || params.totalAmount));
    if (coinsToRefund <= 0) return false;

    const { creditCoins } = await import("@/lib/wallet");
    await creditCoins({
      userId: params.memberId,
      amount: coinsToRefund,
      type: "MEETUP_REFUND",
      description: `${params.reason} · #${params.bookingNumber} (+${coinsToRefund} Coins)`,
      referenceId: params.bookingId,
    });
    return true;
  } catch (err) {
    console.warn("[WALLET ESCROW COIN REFUND WARN]:", (err as Error).message);
    return false;
  }
}

export interface CreateBookingInput {
  memberId: string;
  memberName?: string;
  memberPhone: string;
  companionId: string;
  activityId: string;
  scheduledDate: string;
  durationHours: number;
  venueName: string;
  venueAddress: string;
  cityId?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingRecord> {
  const dbCompanion = await prisma.companion.findFirst({
    where: {
      OR: [
        { id: input.companionId },
        { displayName: { equals: input.companionId, mode: "insensitive" } },
      ],
    },
    include: { city: true },
  });

  if (!dbCompanion) {
    throw new Error("Companion profile not found.");
  }

  let dbActivity = await prisma.activity.findFirst({
    where: {
      OR: [{ id: input.activityId }, { slug: input.activityId }],
    },
  });

  if (!dbActivity) {
    dbActivity =
      (await prisma.activity.findFirst()) ||
      (await prisma.activity.create({
        data: {
          title: "Coffee & Conversations",
          slug: "coffee-chat",
          description: "Casual coffee meetup",
          icon: "coffee",
        },
      }));
  }

  const durationHours = Math.max(1, Math.min(8, input.durationHours || 1));
  const breakdown = calculateEscrowBreakdown(Number(dbCompanion.hourlyRate), durationHours);

  const bookingId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const bookingNumber = `CMP-${Date.now().toString().slice(-6)}`;
  const verificationPin = Math.floor(1000 + Math.random() * 9000).toString();
  const hostAcceptanceDeadline = new Date(Date.now() + 12 * 60 * 60 * 1000);

  const created = await prisma.booking.create({
    data: {
      id: bookingId,
      bookingNumber,
      memberId: input.memberId,
      companionId: dbCompanion.id,
      cityId: dbCompanion.city.id,
      activityId: dbActivity.id,
      scheduledDate: new Date(input.scheduledDate),
      durationHours,
      venueName: input.venueName,
      venueAddress: input.venueAddress,
      totalAmount: breakdown.totalAmount,
      companionFee: breakdown.companionFee, // Fixed 70%
      platformFee: breakdown.platformFee,
      gstAmount: breakdown.gstAmount,
      escrowStatus: "HELD_IN_ESCROW",
      status: "PENDING_ACCEPTANCE",
      verificationPin,
      hostAcceptanceDeadline,
    },
    include: {
      member: { select: { id: true, name: true, phone: true } },
      companion: { select: { id: true, userId: true, displayName: true, avatarUrl: true, upiId: true } },
      city: { select: { id: true, name: true } },
      activity: { select: { id: true, title: true } },
    },
  });

  const record = mapPrismaBooking(created);
  bookingsStore.set(record.id, record);
  return record;
}

export async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  try {
    const dbRecord = await prisma.booking.findFirst({
      where: {
        OR: [{ id: bookingId }, { bookingNumber: bookingId }],
      },
      include: {
        member: { select: { id: true, name: true, phone: true } },
        companion: { select: { id: true, userId: true, displayName: true, avatarUrl: true, upiId: true, gender: true } },
        city: { select: { id: true, name: true } },
        activity: { select: { id: true, title: true } },
        review: { select: { score: true, comment: true, createdAt: true } },
      },
    });

    if (dbRecord) {
      const record = mapPrismaBooking(dbRecord);
      bookingsStore.set(bookingId, record);
      return record;
    }
  } catch (err) {
    console.warn("[GET BOOKING PRISMA WARN]:", (err as Error).message);
  }

  return bookingsStore.get(bookingId) || null;
}

export async function getBookingsForUser(
  userId: string,
  role: "MEMBER" | "COMPANION" | "ALL" = "ALL"
): Promise<BookingRecord[]> {
  try {
    const where: any = {};
    if (role === "MEMBER") {
      where.memberId = userId;
    } else if (role === "COMPANION") {
      where.OR = [{ companionId: userId }, { companion: { userId } }];
    } else {
      where.OR = [{ memberId: userId }, { companion: { userId } }];
    }

    const dbBookings = await prisma.booking.findMany({
      where,
      include: {
        member: { select: { id: true, name: true, phone: true } },
        companion: { select: { id: true, userId: true, displayName: true, avatarUrl: true, upiId: true, gender: true } },
        city: { select: { id: true, name: true } },
        activity: { select: { id: true, title: true } },
        review: { select: { score: true, comment: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return dbBookings.map((b) => sanitizeBookingForViewer(mapPrismaBooking(b), userId));
  } catch (err) {
    console.warn("[GET BOOKINGS PRISMA WARN]:", (err as Error).message);
    return [];
  }
}

export async function respondToBooking(
  bookingId: string,
  action: "ACCEPT" | "DECLINE",
  hostUserId?: string
): Promise<{ success: boolean; booking?: BookingRecord; error?: string }> {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, error: "Booking record not found." };
  }

  if (hostUserId && booking.companionUserId && booking.companionUserId !== hostUserId) {
    return { success: false, error: "Only the assigned Host can accept or decline this booking." };
  }

  if (booking.status !== "PENDING_ACCEPTANCE") {
    return {
      success: false,
      error: `Booking cannot be updated from current status: ${booking.status}`,
    };
  }

  const isExpired = new Date(booking.hostAcceptanceDeadline).getTime() < Date.now();
  if (isExpired) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CANCELLED",
        escrowStatus: "REFUNDED_TO_MEMBER",
      },
    });
    return {
      success: false,
      error: "12-hour response window expired. Escrow has been refunded to the member.",
    };
  }

  const dbStatus = action === "ACCEPT" ? "CONFIRMED" : "CANCELLED";
  const nextEscrow = action === "ACCEPT" ? "HELD_IN_ESCROW" : "REFUNDED_TO_MEMBER";

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: dbStatus as any,
      escrowStatus: nextEscrow as any,
    },
    include: {
      member: { select: { id: true, name: true, phone: true } },
      companion: { select: { id: true, userId: true, displayName: true, avatarUrl: true, upiId: true, gender: true } },
      city: { select: { id: true, name: true } },
      activity: { select: { id: true, title: true } },
      review: { select: { score: true, comment: true, createdAt: true } },
    },
  });

  if (action === "DECLINE") {
    await refundEscrowCoinsIfWalletPaid({
      bookingId: booking.id,
      memberId: booking.memberId,
      totalAmount: booking.totalAmount,
      bookingNumber: booking.bookingNumber,
      reason: "Booking declined by host",
    });
  }

  const record = sanitizeBookingForViewer(mapPrismaBooking(updated), hostUserId);
  bookingsStore.set(booking.id, record);

  return { success: true, booking: record };
}

export async function checkAndExpireSlaBookings(): Promise<{ expiredCount: number; expiredIds: string[] }> {
  const now = new Date();
  try {
    const overdue = await prisma.booking.findMany({
      where: {
        status: "PENDING_ACCEPTANCE",
        hostAcceptanceDeadline: { lt: now },
      },
      select: { id: true, memberId: true, totalAmount: true, bookingNumber: true },
    });

    if (overdue.length > 0) {
      await prisma.booking.updateMany({
        where: { id: { in: overdue.map((o) => o.id) } },
        data: {
          status: "CANCELLED",
          escrowStatus: "REFUNDED_TO_MEMBER",
        },
      });

      for (const b of overdue) {
        await refundEscrowCoinsIfWalletPaid({
          bookingId: b.id,
          memberId: b.memberId,
          totalAmount: Number(b.totalAmount),
          bookingNumber: b.bookingNumber,
          reason: "12h host acceptance SLA expired",
        });
      }
    }

    return {
      expiredCount: overdue.length,
      expiredIds: overdue.map((o) => o.id),
    };
  } catch (err) {
    console.warn("[SLA EXPIRATION CRON WARN]:", (err as Error).message);
    return { expiredCount: 0, expiredIds: [] };
  }
}

export interface PayoutRecord {
  transferId: string;
  utr: string;
  gateway: "WALLET" | "RAZORPAY" | "CASHFREE";
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
  submittedPin: string,
  hostUserId?: string
): Promise<{ success: boolean; booking?: BookingRecord; error?: string }> {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, error: "Booking record not found." };
  }

  if (hostUserId && booking.companionUserId && booking.companionUserId !== hostUserId) {
    return {
      success: false,
      error: "Only the assigned Host can enter and verify the member's 4-digit PIN.",
    };
  }

  if (booking.status === "IN_PROGRESS") {
    return { success: true, booking: sanitizeBookingForViewer(booking, hostUserId) };
  }

  if (booking.status !== "CONFIRMED" && booking.status !== "PENDING_ACCEPTANCE") {
    return { success: false, error: `Session cannot be started from status: ${booking.status}` };
  }

  if (booking.verificationPin.trim() !== submittedPin.trim()) {
    return {
      success: false,
      error: "Incorrect 4-digit PIN. Please ask the member for the code shown on their screen.",
    };
  }

  const now = new Date();
  const sessionEnd = new Date(now.getTime() + (booking.durationHours || 1) * 3600000);

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "IN_PROGRESS",
      pinVerifiedAt: now,
      sessionStartedAt: now,
      sessionEndedAt: sessionEnd,
    },
    include: {
      member: { select: { id: true, name: true, phone: true } },
      companion: { select: { id: true, userId: true, displayName: true, avatarUrl: true, upiId: true } },
      city: { select: { id: true, name: true } },
      activity: { select: { id: true, title: true } },
    },
  });

  const record = sanitizeBookingForViewer(mapPrismaBooking(updated), hostUserId);
  bookingsStore.set(booking.id, record);
  return { success: true, booking: record };
}

export async function completeSession(
  bookingId: string,
  callerUserId?: string
): Promise<{ success: boolean; booking?: BookingRecord; payout?: PayoutRecord; error?: string }> {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, error: "Booking record not found." };
  }

  if (
    callerUserId &&
    booking.memberId !== callerUserId &&
    booking.companionUserId !== callerUserId
  ) {
    return { success: false, error: "You are not authorized to complete this session." };
  }

  // Recompute authoritative 70% host share
  const breakdown = calculateEscrowBreakdown(booking.totalAmount / Math.max(1, booking.durationHours), booking.durationHours);
  const hostPayoutAmount = Number(booking.companionFee) || breakdown.companionFee;
  const platformTotalAmount = Number(booking.totalAmount) - hostPayoutAmount;
  const recipientUpi = booking.companionUpiId || "Add UPI ID in Host Dashboard";

  if (booking.status === "COMPLETED" && booking.escrowStatus === "RELEASED_TO_HOST") {
    return {
      success: true,
      booking: sanitizeBookingForViewer(booking, callerUserId),
      payout: {
        transferId: `escrow_rel_${booking.id.slice(-8)}`,
        utr: `MEETZY${booking.bookingNumber.replace(/\D/g, "")}`,
        gateway: "WALLET",
        amount: hostPayoutAmount,
        recipientUpiId: recipientUpi,
        timestamp: booking.sessionEndedAt || new Date().toISOString(),
        status: "SUCCESS",
      },
    };
  }

  if (booking.status !== "IN_PROGRESS" && booking.status !== "CONFIRMED") {
    return { success: false, error: `Cannot complete booking from status: ${booking.status}` };
  }

  const now = new Date();
  const transferId = `escrow_rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const utr = `MTZ${Date.now().toString().slice(-10)}`;

  const updated = await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: "COMPLETED",
        escrowStatus: "RELEASED_TO_HOST",
        sessionEndedAt: now,
      },
      include: {
        member: { select: { id: true, name: true, phone: true } },
        companion: { select: { id: true, userId: true, displayName: true, avatarUrl: true, upiId: true, completedMeetups: true, ratingAverage: true } },
        city: { select: { id: true, name: true } },
        activity: { select: { id: true, title: true } },
      },
    });

    if (booking.escrowStatus !== "RELEASED_TO_HOST" && updatedBooking.companion?.userId) {
      await tx.user.update({
        where: { id: updatedBooking.companion.userId },
        data: {
          walletBalance: { increment: hostPayoutAmount },
        },
      });

      const nextMeetups = (updatedBooking.companion.completedMeetups || 0) + 1;
      const avgRating = updatedBooking.companion.ratingAverage || 5.0;
      let nextLevel: HostLevel = HostLevel.NEW;
      if (nextMeetups >= 30 && avgRating >= 4.8) nextLevel = HostLevel.TOP;
      else if (nextMeetups >= 10 && avgRating >= 4.5) nextLevel = HostLevel.RISING;

      await tx.companion.update({
        where: { id: updatedBooking.companionId },
        data: {
          completedMeetups: nextMeetups,
          hostLevel: nextLevel,
        },
      });

      await tx.transaction.create({
        data: {
          bookingId: booking.id,
          userId: updatedBooking.companion.userId,
          type: "HOST_PAYOUT",
          amount: hostPayoutAmount,
          feeAmount: platformTotalAmount,
          netAmount: hostPayoutAmount,
          gateway: "WALLET",
          gatewayTransactionId: transferId,
          status: "SUCCESS",
        },
      });

      await tx.transaction.create({
        data: {
          bookingId: booking.id,
          userId: booking.memberId,
          type: "PLATFORM_FEE",
          amount: platformTotalAmount,
          feeAmount: Number(booking.gstAmount),
          netAmount: Math.max(0, platformTotalAmount - Number(booking.gstAmount)),
          gateway: "WALLET",
          gatewayTransactionId: `pf_${transferId}`,
          status: "SUCCESS",
        },
      });
    }

    return updatedBooking;
  });

  // Referral reward on member's first completed meetup
  try {
    const member = await prisma.user.findUnique({
      where: { id: booking.memberId },
      select: { id: true, name: true, referredById: true },
    });

    if (member?.referredById) {
      const completedCount = await prisma.booking.count({
        where: { memberId: member.id, status: "COMPLETED" },
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
            referenceId: booking.id,
          });
        }
      }
    }
  } catch (refErr) {
    console.warn("[REFERRAL REWARD WARN]:", refErr);
  }

  const record = sanitizeBookingForViewer(mapPrismaBooking(updated), callerUserId);
  bookingsStore.set(booking.id, record);

  return {
    success: true,
    booking: record,
    payout: {
      transferId,
      utr,
      gateway: "WALLET",
      amount: hostPayoutAmount,
      recipientUpiId: recipientUpi,
      timestamp: now.toISOString(),
      status: "SUCCESS",
    },
  };
}

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

  if (booking.memberId !== input.memberId) {
    return { success: false, error: "Only the member who booked can leave a verified host review." };
  }

  // Ensure escrow & payout settlement executes cleanly before storing review
  if (booking.status !== "COMPLETED") {
    const completion = await completeSession(booking.id, input.memberId);
    if (!completion.success) {
      return { success: false, error: completion.error || "Session must be active or confirmed to review." };
    }
  }

  const clampedScore = Math.max(1, Math.min(5, Math.round(input.score)));

  const reviewRecord = await prisma.$transaction(async (tx) => {
    const rev = await tx.reviewRating.upsert({
      where: { bookingId: booking.id },
      update: {
        score: clampedScore,
        comment: input.comment || null,
      },
      create: {
        bookingId: booking.id,
        memberId: input.memberId,
        companionId: booking.companionId,
        score: clampedScore,
        comment: input.comment || null,
      },
    });

    const stats = await tx.reviewRating.aggregate({
      where: { companionId: booking.companionId },
      _avg: { score: true },
      _count: { score: true },
    });

    await tx.companion.update({
      where: { id: booking.companionId },
      data: {
        ratingAverage: Number((stats._avg.score || clampedScore).toFixed(2)),
        totalReviews: stats._count.score || 1,
      },
    });

    return rev;
  });

  return {
    success: true,
    review: {
      id: reviewRecord.id,
      bookingId: booking.id,
      memberId: input.memberId,
      companionId: booking.companionId,
      score: clampedScore,
      comment: input.comment,
      tags: input.tags,
      createdAt: reviewRecord.createdAt.toISOString(),
    },
  };
}

export async function submitHostFeedback(input: {
  bookingId: string;
  hostUserId: string;
  score: number;
  comment?: string;
}): Promise<{ success: boolean; booking?: BookingRecord; error?: string }> {
  const booking = await getBookingById(input.bookingId);
  if (!booking) {
    return { success: false, error: "Booking record not found." };
  }

  if (!booking.companionUserId || booking.companionUserId !== input.hostUserId) {
    return { success: false, error: "Only the assigned Host can submit member feedback." };
  }

  if (booking.status !== "COMPLETED" && booking.status !== "IN_PROGRESS") {
    return {
      success: false,
      error: "Host feedback can be submitted during or after completing the meetup.",
    };
  }

  const clampedScore = Math.max(1, Math.min(5, Math.round(input.score)));
  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      hostScore: clampedScore,
      hostComment: input.comment?.trim() || null,
      hostReviewedAt: new Date(),
    },
    include: {
      member: { select: { id: true, name: true, phone: true } },
      companion: { select: { id: true, userId: true, displayName: true, avatarUrl: true, upiId: true, gender: true } },
      city: { select: { id: true, name: true } },
      activity: { select: { id: true, title: true } },
      review: { select: { score: true, comment: true, createdAt: true } },
    },
  });

  const record = sanitizeBookingForViewer(mapPrismaBooking(updated), input.hostUserId);
  bookingsStore.set(booking.id, record);
  return { success: true, booking: record };
}

export async function triggerSosAlert(input: {
  bookingId: string;
  userId: string;
  latitude?: number;
  longitude?: number;
}): Promise<{ success: boolean; alertId: string; emergencyDial: string }> {
  const alertId = `sos_${Date.now()}`;
  console.log(
    `[EMERGENCY SOS TRIGGERED] Booking: ${input.bookingId}, User: ${input.userId}, Lat: ${input.latitude}, Lng: ${input.longitude}`
  );

  await prisma.$transaction(async (tx) => {
    await tx.safetyAlert.create({
      data: {
        id: alertId,
        bookingId: input.bookingId,
        triggeredById: input.userId,
        latitude: input.latitude,
        longitude: input.longitude,
        status: "ACTIVE",
      },
    });

    await tx.grievanceTicket.create({
      data: {
        userId: input.userId,
        category: "SAFETY_INCIDENT",
        subject: `URGENT SOS ALERT - Booking ${input.bookingId}`,
        description: `Emergency SOS triggered during session ${input.bookingId}.\nAlert ID: ${alertId}\nCoordinates: ${input.latitude ?? "N/A"}, ${input.longitude ?? "N/A"}`,
        status: "OPEN",
      },
    });
  });

  return { success: true, alertId, emergencyDial: "112" };
}
