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

    let hostProfile: any = null;
    let memberProfile: any = {
      id: session.userId,
      fullName: session.name || "Member",
      city: "bengaluru",
      onboardingCompleted: true,
    };

    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          companion: {
            include: { city: true },
          },
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

        if (dbUser.companion) {
          hostProfile = {
            id: dbUser.companion.id,
            userId: dbUser.id,
            displayName: dbUser.companion.displayName,
            city: dbUser.companion.city?.name || 'Bengaluru',
            hourlyRate: Number(dbUser.companion.hourlyRate),
            avatarUrl: dbUser.companion.avatarUrl,
            verificationStatus: 'approved',
            isFreeToday: dbUser.companion.isAvailable,
            walletBalance: Number(dbUser.walletBalance || 0),
          };
        }

        memberProfile = {
          id: dbUser.id,
          fullName: dbUser.name || "Member",
          city: dbUser.companion?.city?.slug || "bengaluru",
          onboardingCompleted: true,
        };
      }

      if (!hostProfile && session.phone) {
        const hostApp = await prisma.hostApplication.findFirst({
          where: { phone: session.phone },
          orderBy: { createdAt: "desc" },
        });
        if (hostApp) {
          hostProfile = {
            id: hostApp.id,
            userId: session.userId,
            displayName: hostApp.fullName,
            city: hostApp.city,
            hourlyRate: 499,
            verificationStatus: hostApp.screeningStatus.toLowerCase() === "approved" ? "approved" : "pending",
            isFreeToday: false,
            walletBalance: 0,
          };
        }
      }
    } catch (dbErr) {
      console.warn("[AUTH ME DB LOOKUP]:", (dbErr as Error).message);
    }

    const activeRole = session.role === "COMPANION" ? "host" : "member";

    return NextResponse.json({
      authenticated: true,
      user: {
        ...userDetails,
        activeRole,
      },
      hostProfile,
      memberProfile,
      hasHostProfile: Boolean(hostProfile),
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
