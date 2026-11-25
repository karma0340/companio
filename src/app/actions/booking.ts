'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { debitCoins } from '@/lib/wallet';
import { calculateEscrowBreakdown } from '@/lib/escrow';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { getSession } from '@/lib/session';
import { CoinTransactionType } from '@prisma/client';

export interface CreateBookingInput {
  companionId: string;
  memberId?: string;
  memberName: string;
  memberPhone: string;
  memberEmail?: string;
  activitySlug: string;
  date: string;
  startTime: string;
  durationHours: number;
  meetingPoint: string;
  note?: string;
  hourlyRate?: number;
  paymentMethod?: 'WALLET' | 'RAZORPAY';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

function parseScheduledDate(dateStr: string, timeStr?: string): Date {
  try {
    const lower = (timeStr || '').toLowerCase();
    let defaultHour = 16;
    if (lower.includes('morning')) defaultHour = 8;
    else if (lower.includes('afternoon')) defaultHour = 13;
    else if (lower.includes('evening')) defaultHour = 17;

    const cleanTime = (timeStr || '').replace(/[^0-9:]/g, '').trim();
    const parts = cleanTime.split(':');
    const parsedHour = parts[0] ? parseInt(parts[0], 10) : NaN;
    const hours = !isNaN(parsedHour) && parsedHour >= 0 && parsedHour <= 23 ? parsedHour : defaultHour;
    const minutes = parts[1] ? parseInt(parts[1], 10) || 0 : 0;

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      d.setHours(hours, minutes, 0, 0);
      return d;
    }
  } catch {}
  return new Date(Date.now() + 86400000);
}

export async function createBookingAction(input: CreateBookingInput) {
  try {
    const session = await getSession();

    // Locate companion strictly so authoritative hourlyRate is enforced server-side
    const companion = await prisma.companion.findUnique({
      where: { id: input.companionId },
      include: { city: true },
    });

    if (!companion) {
      return {
        success: false,
        error: 'Selected companion profile was not found.',
      };
    }

    const durationHours = Math.max(1, Math.min(8, Number(input.durationHours) || 1));
    const authoritativeRate = Number(companion.hourlyRate) || 499;
    const breakdown = calculateEscrowBreakdown(authoritativeRate, durationHours);

    const startCode = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `cmp-book-${Math.floor(100000 + Math.random() * 900000)}`;

    // Verify Razorpay cryptographic signature strictly on Razorpay payments
    if (input.paymentMethod !== 'WALLET') {
      const orderId = String(input.razorpayOrderId || '');
      const paymentId = String(input.razorpayPaymentId || '');
      if (!paymentId) {
        return { success: false, error: 'Payment confirmation ID is missing.' };
      }
      const sigResult = verifyRazorpaySignature(orderId, paymentId, input.razorpaySignature);
      if (!sigResult.isValid) {
        return {
          success: false,
          error: sigResult.reason || 'Payment signature verification failed.',
        };
      }
    }

    // Resolve authenticated member record
    const effectiveMemberId = session?.userId || input.memberId;
    const cleanPhone = `+91${input.memberPhone.replace(/\D/g, '').slice(-10)}`;

    let user = effectiveMemberId
      ? await prisma.user.findUnique({ where: { id: effectiveMemberId } })
      : null;

    if (!user && cleanPhone.length === 13) {
      user = await prisma.user.findFirst({ where: { phone: cleanPhone } });
    }

    if (!user) {
      return {
        success: false,
        error: 'Please sign in with your verified mobile number to book a meetup.',
      };
    }

    if (companion.userId === user.id) {
      return {
        success: false,
        error: 'You cannot book your own companion profile.',
      };
    }

    if (input.paymentMethod === 'WALLET') {
      if (user.coinBalance < breakdown.totalAmount) {
        return {
          success: false,
          error: `Insufficient wallet coins. You have ${user.coinBalance} coins, but ${breakdown.totalAmount} coins are needed.`,
        };
      }

      await debitCoins({
        userId: user.id,
        amount: Math.round(breakdown.totalAmount),
        type: CoinTransactionType.MEETUP_PAYMENT,
        description: `Escrow payment for meetup with ${companion.displayName} (Booking #${bookingId})`,
        referenceId: bookingId,
      });
    }

    const cityId = companion.cityId;

    let activity = await prisma.activity.findFirst({
      where: {
        OR: [
          { slug: input.activitySlug },
          { id: input.activitySlug },
          { slug: { contains: input.activitySlug } },
        ],
      },
    });

    if (!activity) {
      activity =
        (await prisma.activity.findFirst()) ||
        (await prisma.activity.create({
          data: {
            title: 'Coffee Chat',
            slug: 'coffee-chat',
            description: 'Casual coffee conversation',
            icon: 'coffee',
          },
        }));
    }

    const scheduledDate = parseScheduledDate(input.date, input.startTime);

    await prisma.booking.create({
      data: {
        id: bookingId,
        bookingNumber: `CMP-${Date.now().toString().slice(-6)}`,
        memberId: user.id,
        companionId: companion.id,
        cityId,
        activityId: activity.id,
        scheduledDate,
        durationHours,
        venueName: input.meetingPoint.split(',')[0]?.trim() || input.meetingPoint.trim(),
        venueAddress: input.meetingPoint.trim(),
        totalAmount: breakdown.totalAmount,
        companionFee: breakdown.companionFee, // 70% fixed Host Share
        platformFee: breakdown.platformFee,
        gstAmount: breakdown.gstAmount,
        verificationPin: startCode,
        status: 'PENDING_ACCEPTANCE',
        escrowStatus: 'HELD_IN_ESCROW',
        hostAcceptanceDeadline: new Date(Date.now() + 12 * 3600000),
      },
    });

    await prisma.transaction
      .create({
        data: {
          userId: user.id,
          bookingId,
          type: 'ESCROW_DEPOSIT',
          amount: breakdown.totalAmount,
          feeAmount: breakdown.platformShareTotal,
          netAmount: breakdown.companionFee,
          gateway: input.paymentMethod === 'WALLET' ? 'WALLET' : 'RAZORPAY',
          gatewayTransactionId: input.razorpayPaymentId || `wallet_escrow_${Date.now()}`,
          status: 'SUCCESS',
        },
      })
      .catch((txErr) => console.warn('[TRANSACTION CREATE WARN]:', txErr.message));

    try {
      revalidatePath('/bookings');
      revalidatePath('/companion/dashboard');
    } catch {}

    return {
      success: true,
      bookingId,
      startCode,
      totalPayable: breakdown.totalAmount,
    };
  } catch (error) {
    console.error('Error in createBookingAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create booking',
    };
  }
}
