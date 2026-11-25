'use server';

import { prisma } from '@/lib/prisma';
import { Companion } from '@/lib/types';
import { mapToActivityCategories } from '@/lib/companion-mapper';

export interface BookingDisplayItem {
  id: string;
  bookingNumber: string;
  companion: Companion;
  companionId: string;
  memberName: string;
  memberPhone: string;
  activity: string;
  date: string;
  time: string;
  duration: string;
  meetingPoint: string;
  startCode: string;
  escrowAmount: number;
  refundedAmount: number;
  deductionAmount: number;
  status: string;
  rawStatus: 'pending_acceptance' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | string;
  paymentStatus: 'paid_escrow' | 'refunded' | 'released' | string;
  hasMemberReview: boolean;
  memberReviewScore?: number | null;
  hostScore?: number | null;
  hostComment?: string | null;
}

export async function fetchLiveBookings(filter?: {
  memberId?: string;
  memberPhone?: string;
}): Promise<BookingDisplayItem[]> {
  try {
    const where: any = {};
    if (filter?.memberId && filter?.memberPhone) {
      const digits = filter.memberPhone.replace(/\D/g, '').slice(-10);
      where.OR = [
        { memberId: filter.memberId },
        ...(digits.length === 10 ? [{ member: { phone: `+91${digits}` } }] : []),
      ];
    } else if (filter?.memberId) {
      where.memberId = filter.memberId;
    } else if (filter?.memberPhone) {
      const digits = filter.memberPhone.replace(/\D/g, '').slice(-10);
      if (digits.length === 10) {
        where.member = { phone: `+91${digits}` };
      } else {
        return [];
      }
    } else {
      return [];
    }

    const dbBookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        companion: { include: { city: true } },
        activity: true,
        member: true,
        review: { select: { id: true, score: true } },
      },
    });

    if (dbBookings && dbBookings.length > 0) {
      return dbBookings.map((b: any) => {
        const defaultAvatar =
          b.companion?.gender === 'male'
            ? 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/aarav-mum.jpg'
            : 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/ananya-del.jpg';

        const comp: Companion = {
          id: b.companion?.id || b.companionId,
          name: b.companion?.displayName || 'Verified Host',
          age: b.companion?.age || 24,
          gender: (b.companion?.gender as any) || 'female',
          city: b.companion?.city?.slug || 'bengaluru',
          area: b.companion?.locality || 'Central',
          tagline: b.companion?.shortBio || 'Verified Meetzy Club Host',
          about: b.companion?.bio || '',
          avatarUrl: b.companion?.avatarUrl || defaultAvatar,
          languages: b.companion?.spokenLanguages || ['English', 'Hindi'],
          hourlyRate: Number(b.companion?.hourlyRate) || 499,
          verifiedId: true,
          verifiedPhoto: Boolean(b.companion?.photoVerified),
          rating: Number(b.companion?.ratingAverage) || 5.0,
          reviewCount: Number(b.companion?.totalReviews) || 0,
          meetupsCount: Number(b.companion?.completedMeetups) || 0,
          activities: mapToActivityCategories(b.companion?.acceptedActivities || []),
          rawActivities: b.companion?.acceptedActivities || [],
          isFreeToday: Boolean(b.companion?.isAvailable),
          memberSince: '2026',
          availability: [],
          reviews: [],
        };

        let displayStatus = 'Ready for Code Verification';
        if (b.status === 'IN_PROGRESS') displayStatus = 'Active Meetup In Progress';
        else if (b.status === 'COMPLETED') displayStatus = 'Completed';
        else if (b.status === 'CANCELLED') displayStatus = 'Cancelled & Refunded';
        else if (b.status === 'PENDING_ACCEPTANCE') displayStatus = 'Pending Host Acceptance';

        const rawStatus = b.status?.toLowerCase() || 'confirmed';
        const sched = b.scheduledDate ? new Date(b.scheduledDate) : new Date();

        return {
          id: b.id,
          bookingNumber: b.bookingNumber,
          companion: comp,
          companionId: b.companionId,
          memberName: b.member?.name || 'Verified Member',
          memberPhone: b.member?.phone || '',
          activity: b.activity?.title || 'Meetup',
          date: sched.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'Asia/Kolkata',
          }),
          time: sched.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
          }),
          duration: `${b.durationHours || 1} Hour${(b.durationHours || 1) > 1 ? 's' : ''}`,
          meetingPoint: b.venueAddress || b.venueName || 'Public Venue',
          startCode: b.verificationPin || '',
          escrowAmount: Number(b.totalAmount || 0),
          refundedAmount: Math.round(Number(b.totalAmount || 0) * 0.75 * 100) / 100,
          deductionAmount: Math.round(Number(b.totalAmount || 0) * 0.25 * 100) / 100,
          status: displayStatus,
          rawStatus,
          paymentStatus:
            b.escrowStatus === 'RELEASED_TO_HOST'
              ? 'released'
              : b.escrowStatus === 'REFUNDED_TO_MEMBER'
              ? 'refunded'
              : 'paid_escrow',
          hasMemberReview: Boolean(b.review?.id),
          memberReviewScore: b.review?.score ?? null,
          hostScore: b.hostScore ?? null,
          hostComment: b.hostComment ?? null,
        };
      });
    }
  } catch (err) {
    console.warn('[PRISMA FETCH BOOKINGS ERROR]:', (err as Error).message);
  }

  return [];
}
