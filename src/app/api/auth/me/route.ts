import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    let userDetails = {
      id: session.userId,
      phone: session.phone,
      email: session.email || null,
      role: session.role,
      isUnlocked: session.isUnlocked,
      activePassTier: session.activePassTier || null,
      passExpiresAt: session.passExpiresAt ? new Date(session.passExpiresAt) : null,
      walletBalance: 0,
      name: session.name || "Member",
    };

    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          passes: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (dbUser) {
        const latestPass = dbUser.passes[0];
        const isPassValid =
          latestPass &&
          (!latestPass.validUntil || new Date(latestPass.validUntil) > new Date());

        const isUserUnlocked =
          Boolean(dbUser.isUnlocked) || Boolean(isPassValid);

        userDetails = {
          id: dbUser.id,
          phone: dbUser.phone,
          email: dbUser.email,
          role: dbUser.role,
          isUnlocked: isUserUnlocked,
          activePassTier: isUserUnlocked
            ? dbUser.activePassTier || (latestPass ? (latestPass.tier as any) : "ONE_MONTH")
            : null,
          passExpiresAt: latestPass?.validUntil || dbUser.passExpiresAt,
          walletBalance: Number(dbUser.walletBalance),
          name: dbUser.name || "Member",
        };
      }
    } catch (dbErr) {
      console.warn("[AUTH ME DB LOOKUP]:", (dbErr as Error).message);
    }

    return NextResponse.json({
      authenticated: true,
      user: userDetails,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
