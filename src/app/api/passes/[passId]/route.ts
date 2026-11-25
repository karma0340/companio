import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { passId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to view receipt.' },
        { status: 401 }
      );
    }

    const passId = params.passId;
    const pass = await prisma.accessPass.findFirst({
      where: {
        id: passId,
        userId: session.userId,
      },
      include: {
        user: {
          select: { name: true, phone: true },
        },
      },
    });

    if (!pass) {
      return NextResponse.json(
        { success: false, error: 'Pass receipt not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pass: {
        id: pass.id,
        tier: pass.tier,
        pricePaid: pass.pricePaid,
        status: pass.status,
        validFrom: pass.validFrom,
        validUntil: pass.validUntil,
        razorpayOrderId: pass.razorpayOrderId,
        razorpayPaymentId: pass.razorpayPaymentId,
        createdAt: pass.createdAt,
        memberName: pass.user.name || 'Verified Member',
        memberPhone: pass.user.phone,
      },
    });
  } catch (err) {
    console.error('[GET /api/passes/[passId]] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to load pass receipt.' },
      { status: 500 }
    );
  }
}
