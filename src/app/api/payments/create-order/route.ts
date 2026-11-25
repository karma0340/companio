import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayKeyId, isRazorpayConfigured, createRazorpayOrder } from '@/lib/razorpay';
import { calculateEscrowBreakdown } from '@/lib/escrow';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    const companionId = String(body?.companionId || '').trim();
    const durationHours = Math.max(1, Math.min(8, Number(body?.durationHours) || 1));

    let hourlyRate = Number(body?.hourlyRate) || 0;

    // Look up authoritative companion hourly rate from database when companionId is provided
    if (companionId) {
      const dbCompanion = await prisma.companion.findUnique({
        where: { id: companionId },
        select: { hourlyRate: true },
      }).catch(() => null);
      if (dbCompanion) {
        hourlyRate = Number(dbCompanion.hourlyRate);
      }
    }

    if (hourlyRate <= 0) {
      return NextResponse.json(
        { error: 'Invalid hourly rate or companion specified.' },
        { status: 400 }
      );
    }

    const breakdown = calculateEscrowBreakdown(hourlyRate, durationHours);
    const amountPaise = Math.round(breakdown.totalAmount * 100);

    const rzpOrder = await createRazorpayOrder(
      amountPaise,
      'INR',
      `escrow_${Date.now().toString().slice(-8)}`,
      {
        platform: 'meetzy_club',
        escrowType: 'meetup_70_30',
        userId: session?.userId || 'guest',
        companionId: companionId || 'direct',
        durationHours: String(durationHours),
      }
    );

    return NextResponse.json({
      success: true,
      orderId: rzpOrder.orderId,
      keyId: getRazorpayKeyId(),
      amount: rzpOrder.amount,
      amountPaise: rzpOrder.amount,
      totalPayable: breakdown.totalAmount,
      hostSubtotal: breakdown.grossAmount,
      hostShare70: breakdown.companionFee,
      platformShare30: breakdown.platformShareTotal,
      connectionFee: breakdown.platformFee,
      gst: breakdown.gstAmount,
      isLive: isRazorpayConfigured(),
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment. Please try again.' },
      { status: 500 }
    );
  }
}
