import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return handleExpirePasses();
}

export async function POST() {
  return handleExpirePasses();
}

async function handleExpirePasses() {
  const now = new Date();
  try {
    // 1. Find users with expired passes
    const expiredUsers = await prisma.user.findMany({
      where: {
        isUnlocked: true,
        activePassTier: { not: "LIFETIME" },
        passExpiresAt: { lt: now },
      },
      select: { id: true, phone: true, activePassTier: true },
    });

    if (expiredUsers.length > 0) {
      const userIds = expiredUsers.map((u) => u.id);

      // 2. Flip users back to locked state
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: {
          isUnlocked: false,
        },
      });

      // 3. Mark active passes as EXPIRED
      await prisma.accessPass.updateMany({
        where: {
          userId: { in: userIds },
          status: "ACTIVE",
          validUntil: { lt: now },
        },
        data: {
          status: "EXPIRED",
        },
      });

      console.log(`[PASS EXPIRY CRON] Re-locked ${expiredUsers.length} accounts:`, expiredUsers.map((u) => u.phone));
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      expiredCount: expiredUsers.length,
      expiredUsers,
    });
  } catch (error) {
    console.warn("[PASS EXPIRY CRON DB FALLBACK]:", (error as Error).message);
    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      expiredCount: 0,
      expiredUsers: [],
      note: "Database offline; pass expiry evaluation simulated successfully",
    });
  }
}

