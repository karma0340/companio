import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { mapApiCompanionToCard } from "@/lib/companion-mapper";

export const dynamic = "force-dynamic";

const MAX_COMPARE_COUNT = 3;

async function loadUserCompareList(userId: string) {
  const rows = await prisma.comparedCompanion.findMany({
    where: { userId },
    include: {
      companion: {
        include: {
          city: true,
          reviewsReceived: {
            include: { member: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: MAX_COMPARE_COUNT,
  });

  const companions = rows.map((r) =>
    mapApiCompanionToCard({
      ...r.companion,
      city: r.companion.city?.name || "Chandigarh",
      citySlug: r.companion.city?.slug || "chandigarh",
      hourlyRate: Number(r.companion.hourlyRate),
    })
  );
  const companionIds = rows.map((r) => r.companionId);
  return { companionIds, companions };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        companionIds: [],
        companions: [],
      });
    }

    const { companionIds, companions } = await loadUserCompareList(session.userId);
    return NextResponse.json({
      success: true,
      authenticated: true,
      companionIds,
      companions,
    });
  } catch (err) {
    console.error("[GET /api/companions/compare] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load comparison list." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please log in to compare companions." },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "Account not found. Please log in again." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const companionId = String(body.companionId || "").trim();
    if (!companionId) {
      return NextResponse.json(
        { success: false, error: "companionId is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.comparedCompanion.findUnique({
      where: {
        userId_companionId: {
          userId: dbUser.id,
          companionId,
        },
      },
    });

    let compared = false;
    if (existing) {
      await prisma.comparedCompanion.delete({ where: { id: existing.id } });
      compared = false;
    } else {
      const currentCount = await prisma.comparedCompanion.count({
        where: { userId: dbUser.id },
      });
      if (currentCount >= MAX_COMPARE_COUNT) {
        return NextResponse.json(
          {
            success: false,
            error: `You can compare up to ${MAX_COMPARE_COUNT} companions at once.`,
          },
          { status: 400 }
        );
      }

      const target = await prisma.companion.findUnique({
        where: { id: companionId },
        select: { id: true },
      });
      if (!target) {
        return NextResponse.json(
          { success: false, error: "Host profile not found." },
          { status: 404 }
        );
      }

      await prisma.comparedCompanion.create({
        data: { userId: dbUser.id, companionId },
      });
      compared = true;
    }

    const { companionIds, companions } = await loadUserCompareList(dbUser.id);
    return NextResponse.json({
      success: true,
      compared,
      companionIds,
      companions,
    });
  } catch (err) {
    console.error("[POST /api/companions/compare] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update comparison list." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please log in to manage comparisons." },
        { status: 401 }
      );
    }

    const companionId = req.nextUrl.searchParams.get("companionId")?.trim() || "";
    if (companionId) {
      await prisma.comparedCompanion.deleteMany({
        where: { userId: session.userId, companionId },
      });
    } else {
      await prisma.comparedCompanion.deleteMany({
        where: { userId: session.userId },
      });
    }

    const { companionIds, companions } = await loadUserCompareList(session.userId);
    return NextResponse.json({
      success: true,
      companionIds,
      companions,
    });
  } catch (err) {
    console.error("[DELETE /api/companions/compare] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update comparison list." },
      { status: 500 }
    );
  }
}
