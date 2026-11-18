import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PASS_TIER_OPTIONS } from "@/lib/data";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ isUnlocked: false, activePass: null }, { status: 401 });
    }

    let isUnlocked = session.isUnlocked;
    let activePassTier = session.activePassTier || null;
    let passExpiresAt: Date | null = session.passExpiresAt ? new Date(session.passExpiresAt) : null;

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { isUnlocked: true, activePassTier: true, passExpiresAt: true },
      });
      if (user) {
        isUnlocked = user.isUnlocked;
        activePassTier = user.activePassTier;
        passExpiresAt = user.passExpiresAt;
      }
    } catch (e) {
      // Fallback to session values
    }

    let daysRemaining = null;
    if (passExpiresAt) {
      const diffMs = new Date(passExpiresAt).getTime() - Date.now();
      daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    const tierOption = PASS_TIER_OPTIONS.find((p) => p.tier === activePassTier);

    return NextResponse.json({
      isUnlocked,
      activePass: activePassTier
        ? {
            tier: activePassTier,
            name: tierOption?.name || activePassTier,
            expiresAt: passExpiresAt,
            daysRemaining: activePassTier === "LIFETIME" ? "Infinite" : daysRemaining,
            isLifetime: activePassTier === "LIFETIME",
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json({ isUnlocked: false, activePass: null }, { status: 500 });
  }
}

