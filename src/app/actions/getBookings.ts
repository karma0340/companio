'use server';

import { prisma } from '@/lib/prisma';
import { COMPANIONS } from '@/lib/data/companions';

export interface BookingDisplayItem {
  id: string;
  companion: typeof COMPANIONS[0];
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
    const dbBookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        companion: true,
        activity: true,
      },
    });

    if (dbBookings && dbBookings.length > 0) {
      return dbBookings.map((b: any) => {
        const comp = COMPANIONS.find((c) => c.id === b.companionId) || {
          ...COMPANIONS[0],
          id: b.companionId,
          name: b.companion?.name || COMPANIONS[0].name,
        };

        let displayStatus = 'Ready for Code Verification';
        if (b.status === 'IN_PROGRESS') displayStatus = 'Active Meetup In Progress';
        else if (b.status === 'COMPLETED') displayStatus = 'Completed';
        else if (b.status === 'CANCELLED') displayStatus = 'Cancelled & Refunded';

        const rawStatus = b.status?.toLowerCase() || 'confirmed';

        return {
          id: b.id,
          companion: comp,
          companionId: b.companionId,
          memberName: b.member?.name || 'Companio Member',
          memberPhone: b.member?.phone || '+91 98765 43210',
          activity: b.activity?.title || 'Meetup & Coffee',
          date: b.scheduledDate ? new Date(b.scheduledDate).toISOString().split('T')[0] : 'Today',
          time: b.scheduledDate ? new Date(b.scheduledDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '16:00',
          duration: `${b.durationHours || 1} Hour${(b.durationHours || 1) > 1 ? 's' : ''}`,
          meetingPoint: b.venueAddress || b.venueName || 'Starbucks, Indiranagar',
          startCode: b.verificationPin || '7492',
          escrowAmount: Number(b.totalAmount || 1199),
          status: displayStatus,
          rawStatus,
          paymentStatus: b.escrowStatus === 'RELEASED_TO_HOST' ? 'released' : 'paid_escrow',
        };
      });
    }
  } catch (err) {
    console.warn('[PRISMA FETCH BOOKINGS FALLBACK]:', (err as Error).message);
  }

  // Graceful sample fallback if database is empty
  const defaultComp = COMPANIONS[0];
  return [
    {
      id: 'cmp-sample-01',
      companion: defaultComp,
      companionId: defaultComp.id,
      memberName: 'Member',
      memberPhone: '+91 98765 43210',
      activity: 'Coffee & City Walk',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '16:00',
      duration: '2 Hours',
      meetingPoint: 'Third Wave Coffee, Indiranagar 100ft Rd',
      startCode: '7492',
      escrowAmount: 1840,
      status: 'Ready for Code Verification',
      rawStatus: 'confirmed',
      paymentStatus: 'paid_escrow',
    },
  ];
}
