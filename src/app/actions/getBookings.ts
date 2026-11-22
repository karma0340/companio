'use server';

import { prisma } from '@/lib/prisma';
import { Companion } from '@/lib/types';

export interface BookingDisplayItem {
  id: string;
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
  status: string;
  rawStatus: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | string;
  paymentStatus: 'paid_escrow' | 'refunded' | 'released' | string;
}

export async function fetchLiveBookings(filter?: {
  memberId?: string;
  memberPhone?: string;
}): Promise<BookingDisplayItem[]> {
  try {
    const where: any = {};
    if (filter?.memberId && filter?.memberPhone) {
      const cleanPhone = `+91${filter.memberPhone.replace(/\D/g, '').slice(-10)}`;
      where.OR = [
        { memberId: filter.memberId },
        { member: { phone: cleanPhone } },
      ];
    } else if (filter?.memberId) {
      where.memberId = filter.memberId;
    } else if (filter?.memberPhone) {
      const cleanPhone = `+91${filter.memberPhone.replace(/\D/g, '').slice(-10)}`;
      where.member = { phone: cleanPhone };
    }

    const dbBookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        companion: true,
        activity: true,
        member: true,
      },
    });

    if (dbBookings && dbBookings.length > 0) {
      return dbBookings.map((b: any) => {
        const comp: Companion = {
          id: b.companion?.id || b.companionId,
          name: b.companion?.displayName || 'Verified Host',
          age: 24,
          gender: 'female' as const,
          city: 'bengaluru',
          area: 'Central',
          tagline: b.companion?.shortBio || 'Verified Meetzy Club Host',
          about: b.companion?.bio || '',
          avatarUrl: b.companion?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          languages: b.companion?.spokenLanguages || ['English', 'Hindi'],
          hourlyRate: Number(b.companion?.hourlyRate) || 499,
          verifiedId: true,
          verifiedPhoto: true,
          rating: Number(b.companion?.ratingAverage) || 4.9,
          reviewCount: Number(b.companion?.totalReviews) || 12,
          meetupsCount: Number(b.companion?.totalReviews) || 12,
          activities: ['coffee-chat'],
          isFreeToday: true,
          memberSince: '2026',
          availability: [],
          reviews: [],
        };

        let displayStatus = 'Ready for Code Verification';
        if (b.status === 'IN_PROGRESS') displayStatus = 'Active Meetup In Progress';
        else if (b.status === 'COMPLETED') displayStatus = 'Completed';
        else if (b.status === 'CANCELLED') displayStatus = 'Cancelled & Refunded';
        else if (b.status === 'PENDING_ACCEPTANCE') displayStatus = 'Pending Acceptance';

        const rawStatus = b.status?.toLowerCase() || 'confirmed';

        return {
          id: b.id,
          companion: comp,
          companionId: b.companionId,
          memberName: b.member?.name || 'Meetzy Club Member',
          memberPhone: b.member?.phone || '+91 98765 43210',
          activity: b.activity?.title || 'Meetup & Coffee',
          date: b.scheduledDate ? new Date(b.scheduledDate).toISOString().split('T')[0] : 'Today',
          time: b.scheduledDate ? new Date(b.scheduledDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '16:00',
          duration: `${b.durationHours || 1} Hour${(b.durationHours || 1) > 1 ? 's' : ''}`,
          meetingPoint: b.venueAddress || b.venueName || 'Public Venue',
          startCode: b.verificationPin || '7492',
          escrowAmount: Number(b.totalAmount || 1199),
          status: displayStatus,
          rawStatus,
          paymentStatus: b.escrowStatus === 'RELEASED_TO_HOST' ? 'released' : 'paid_escrow',
        };
      });
    }
  } catch (err) {
    console.warn('[PRISMA FETCH BOOKINGS ERROR]:', (err as Error).message);
  }

  return [];
}
