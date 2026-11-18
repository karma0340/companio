import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    let userDetails = {
      id: session.userId,
      phone: session.phone,
      role: session.role,
      isUnlocked: session.isUnlocked,
      activePassTier: null as string | null,
      passExpiresAt: null as Date | null,
      walletBalance: 0,
      name: "Member",
    };

    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
      });
      if (dbUser) {
        userDetails = {
          id: dbUser.id,
          phone: dbUser.phone,
          role: dbUser.role,
          isUnlocked: dbUser.isUnlocked,
          activePassTier: dbUser.activePassTier,
          passExpiresAt: dbUser.passExpiresAt,
          walletBalance: Number(dbUser.walletBalance),
          name: dbUser.name || "Member",
        };
      }
    } catch (dbErr) {
      // Fallback to session token
    }

    return NextResponse.json({
      authenticated: true,
      user: userDetails,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
