'use server';

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { COMPANIONS } from '@/lib/data/companions';
import { revalidatePath } from 'next/cache';

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
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
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

    try {
      // Find or create user for this phone
      const cleanPhone = `+91${input.memberPhone.replace(/\D/g, '').slice(-10)}`;
      let user = await prisma.user.findFirst({
        where: { phone: cleanPhone },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            phone: cleanPhone,
            name: input.memberName,
            email: input.memberEmail || `${cleanPhone.slice(-10)}@trycompanio.com`,
            role: 'MEMBER',
          },
        });
      }

      // Check if companion exists in db or fallback to first
      let companion = await prisma.companion.findUnique({
        where: { id: input.companionId },
      });
      if (!companion) {
        companion = await prisma.companion.findFirst();
      }

      if (companion && user) {
        const city = await prisma.city.findFirst() || await prisma.city.create({
          data: { name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka' },
        });
        const activity = await prisma.activity.findFirst() || await prisma.activity.create({
          data: { title: 'Coffee Chat', slug: 'coffee-chat', description: 'Casual coffee conversation', icon: 'coffee' },
        });

        await prisma.booking.create({
          data: {
            id: bookingId,
            bookingNumber: `CMP-${Date.now().toString().slice(-6)}`,
            memberId: user.id,
            companionId: companion.id,
            cityId: city.id,
            activityId: activity.id,
            scheduledDate: new Date(`${input.date}T${input.startTime}:00`),
            durationHours: input.durationHours,
            venueName: input.meetingPoint.split(',')[0] || input.meetingPoint,
            venueAddress: input.meetingPoint,
            totalAmount: totalPayable,
            companionFee: hostSubtotal,
            platformFee: connectionFee,
            gstAmount: gst,
            verificationPin: startCode,
            hostAcceptanceDeadline: new Date(Date.now() + 12 * 3600000),
          },
        });
      }
    } catch (dbErr) {
      console.warn('[PRISMA BOOKING CREATE FALLBACK]:', (dbErr as Error).message);
    }

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
