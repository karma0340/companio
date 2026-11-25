import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function loadUserBookmarks(userId: string) {
  const rows = await prisma.savedCompanion.findMany({
    where: { userId },
    include: {
      companion: {
        include: {
          city: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const companionIds = rows.map((r) => r.companionId);
  const companions = rows.map((r) => ({
    id: r.companion.id,
    displayName: r.companion.displayName,
    city: r.companion.city?.name || "India",
    locality: r.companion.locality || r.companion.city?.name || "",
    hourlyRate: Number(r.companion.hourlyRate),
    ratingAverage: r.companion.ratingAverage,
    totalReviews: r.companion.totalReviews,
    avatarUrl: r.companion.avatarUrl || null,
    acceptedActivities: r.companion.acceptedActivities || [],
    isAvailable: r.companion.isAvailable,
  }));

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

    const { companionIds, companions } = await loadUserBookmarks(session.userId);
    return NextResponse.json({
      success: true,
      authenticated: true,
      companionIds,
      companions,
    });
  } catch (err) {
    console.error("[GET /api/companions/bookmarks] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load saved favorites." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please log in to save favorites." },
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

    const existing = await prisma.savedCompanion.findUnique({
      where: {
        userId_companionId: {
          userId: dbUser.id,
          companionId,
        },
      },
    });

    let saved = false;
    if (existing) {
      await prisma.savedCompanion.delete({ where: { id: existing.id } });
      saved = false;
    } else {
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
      await prisma.savedCompanion.create({
        data: { userId: dbUser.id, companionId },
      });
      saved = true;
    }

    const { companionIds, companions } = await loadUserBookmarks(dbUser.id);
    return NextResponse.json({
      success: true,
      saved,
      companionIds,
      companions,
    });
  } catch (err) {
    console.error("[POST /api/companions/bookmarks] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update saved favorites." },
      { status: 500 }
    );
  }
}
