'use server';

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { debitCoins } from '@/lib/wallet';
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
  hourlyRate: number;
  paymentMethod?: 'WALLET' | 'RAZORPAY';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

function parseScheduledDate(dateStr: string, timeStr?: string): Date {
  try {
    const cleanTime = (timeStr || '16:00').replace(/[^0-9:]/g, '').trim();
    const parts = cleanTime.split(':');
    const hours = parseInt(parts[0] || '16', 10);
    const minutes = parseInt(parts[1] || '0', 10);
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      d.setHours(isNaN(hours) ? 16 : hours, isNaN(minutes) ? 0 : minutes, 0, 0);
      return d;
    }
  } catch (e) {}
  return new Date(Date.now() + 86400000);
}

export async function createBookingAction(input: CreateBookingInput) {
  try {
    const hostSubtotal = input.hourlyRate * input.durationHours;
    const connectionFee = Math.round(hostSubtotal * 0.1);
    const gst = Math.round(connectionFee * 0.18);
    const totalPayable = hostSubtotal + connectionFee + gst;

    // Generate 4-digit mutual start verification code
    const startCode = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `cmp-book-${Math.floor(100000 + Math.random() * 900000)}`;

    // Verify cryptographic signature if provided
    if (input.razorpaySignature && input.razorpayOrderId && input.razorpayPaymentId) {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (secret) {
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
          .digest('hex');
        if (expectedSignature === input.razorpaySignature) {
          console.log(`[Razorpay Signature Verified] Booking ${bookingId} authenticity confirmed.`);
        } else {
          console.warn(`[Razorpay Warning] Signature mismatch on booking ${bookingId}`);
        }
      }
    }

    // Find or create user for this member
    const cleanPhone = `+91${input.memberPhone.replace(/\D/g, '').slice(-10)}`;
    let user = input.memberId
      ? await prisma.user.findUnique({ where: { id: input.memberId } })
      : null;

    if (!user) {
      user = await prisma.user.findFirst({
        where: { phone: cleanPhone },
      });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: cleanPhone,
          name: input.memberName,
          email: input.memberEmail || `${cleanPhone.slice(-10)}@member.meetzy.club`,
          role: 'MEMBER',
          coinBalance: 0,
        },
      });
    }

    // Check if companion exists in db or fallback to first available
    let companion = await prisma.companion.findUnique({
      where: { id: input.companionId },
      include: { city: true },
    });
    if (!companion) {
      companion = await prisma.companion.findFirst({
        include: { city: true },
      });
    }

    if (!companion) {
      return {
        success: false,
        error: 'No companion profile found to book.',
      };
    }

    // Handle Wallet Coins deduction if paymentMethod is WALLET
    if (input.paymentMethod === 'WALLET') {
      if (user.coinBalance < totalPayable) {
        return {
          success: false,
          error: `Insufficient wallet coins. You have ${user.coinBalance} coins, but ${totalPayable} coins are needed.`,
        };
      }

      await debitCoins({
        userId: user.id,
        amount: totalPayable,
        type: CoinTransactionType.MEETUP_PAYMENT,
        description: `Escrow payment for meetup with ${companion.displayName || 'Host'} (Booking #${bookingId})`,
        referenceId: bookingId,
      });
    }

    // Resolve City ID
    let cityId = companion.cityId;
    if (!cityId) {
      const defaultCity = (await prisma.city.findFirst()) || (await prisma.city.create({
        data: { name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka' },
      }));
      cityId = defaultCity.id;
    }

    // Resolve Activity ID
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
      activity = (await prisma.activity.findFirst()) || (await prisma.activity.create({
        data: { title: 'Coffee Chat', slug: 'coffee-chat', description: 'Casual coffee conversation', icon: 'coffee' },
      }));
    }

    const scheduledDate = parseScheduledDate(input.date, input.startTime);

    // Create Booking record in Database with HELD_IN_ESCROW status
    await prisma.booking.create({
      data: {
        id: bookingId,
        bookingNumber: `CMP-${Date.now().toString().slice(-6)}`,
        memberId: user.id,
        companionId: companion.id,
        cityId,
        activityId: activity.id,
        scheduledDate,
        durationHours: input.durationHours,
        venueName: input.meetingPoint.split(',')[0]?.trim() || input.meetingPoint.trim(),
        venueAddress: input.meetingPoint.trim(),
        totalAmount: totalPayable,
        companionFee: hostSubtotal,
        platformFee: connectionFee,
        gstAmount: gst,
        verificationPin: startCode,
        status: 'CONFIRMED',
        escrowStatus: 'HELD_IN_ESCROW',
        hostAcceptanceDeadline: new Date(Date.now() + 12 * 3600000),
      },
    });

    // Record Escrow Deposit Transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        bookingId,
        type: 'ESCROW_DEPOSIT',
        amount: totalPayable,
        feeAmount: connectionFee + gst,
        netAmount: hostSubtotal,
        gateway: input.paymentMethod === 'WALLET' ? 'WALLET' : 'RAZORPAY',
        gatewayTransactionId: input.razorpayPaymentId || `wallet_escrow_${Date.now()}`,
        status: 'SUCCESS',
      },
    }).catch((txErr) => console.warn('[TRANSACTION CREATE WARN]:', txErr.message));

    try {
      revalidatePath('/bookings');
      revalidatePath('/companion/dashboard');
    } catch {
      // Ignore if called outside request context
    }

    return {
      success: true,
      bookingId,
      startCode,
      totalPayable,
    };
  } catch (error) {
    console.error('Error in createBookingAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create booking',
    };
  }
}
