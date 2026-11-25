import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({
        success: true,
        companionIds: [],
        companions: [],
      });
    }

    const rows = await prisma.savedCompanion.findMany({
      where: { userId: session.userId },
      include: {
        companion: {
          include: {
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const companionIds = rows.map((r: any) => r.companionId);
    const companions = rows.map((r: any) => ({
      id: r.companion.id,
      displayName: r.companion.displayName,
      city: r.companion.city?.name || 'India',
      locality: r.companion.locality || r.companion.city?.name || '',
      hourlyRate: Number(r.companion.hourlyRate),
      ratingAverage: r.companion.ratingAverage,
      totalReviews: r.companion.totalReviews,
      avatarUrl: r.companion.avatarUrl || null,
      acceptedActivities: r.companion.acceptedActivities || [],
      isAvailable: r.companion.isAvailable,
    }));

    return NextResponse.json({
      success: true,
      companionIds,
      companions,
    });
  } catch (err) {
    console.error('[GET /api/companions/bookmarks] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to load saved companions.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Please log in to save companions.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const companionId = String(body.companionId || '').trim();
    if (!companionId) {
      return NextResponse.json(
        { success: false, error: 'companionId is required.' },
        { status: 400 }
      );
    }

    const existing = await prisma.savedCompanion.findFirst({
      where: { userId: session.userId, companionId },
    });

    let saved = false;
    if (existing) {
      await prisma.savedCompanion.delete({ where: { id: existing.id } });
      saved = false;
    } else {
      const target = await prisma.companion.findUnique({ where: { id: companionId } });
      if (!target) {
        return NextResponse.json(
          { success: false, error: 'Companion not found.' },
          { status: 404 }
        );
      }
      await prisma.savedCompanion.create({
        data: { userId: session.userId, companionId },
      });
      saved = true;
    }

    const allSaved = await prisma.savedCompanion.findMany({
      where: { userId: session.userId },
      select: { companionId: true },
    });

    return NextResponse.json({
      success: true,
      saved,
      companionIds: allSaved.map((r: any) => r.companionId),
    });
  } catch (err) {
    console.error('[POST /api/companions/bookmarks] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update saved companions.' },
      { status: 500 }
    );
  }
}
