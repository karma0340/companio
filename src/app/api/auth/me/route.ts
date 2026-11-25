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
      coinBalance: 100,
      creditBalance: 100,
      referralCode: null as string | null,
      name: session.name || "Member",
      avatarUrl: null as string | null,
    };

    let hostProfile: any = null;
    let memberProfile: any = {
      id: session.userId,
      fullName: session.name || "Member",
      city: "bengaluru",
      gender: null,
      onboardingCompleted: false,
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
          phone: dbUser.phone || "",
          email: dbUser.email,
          role: dbUser.role,
          isUnlocked: isUserUnlocked,
          activePassTier: isUserUnlocked
            ? dbUser.activePassTier || (latestPass ? (latestPass.tier as any) : "ONE_MONTH")
            : null,
          passExpiresAt: latestPass?.validUntil || dbUser.passExpiresAt,
          walletBalance: Number(dbUser.walletBalance),
          coinBalance: dbUser.coinBalance ?? 100,
          creditBalance: Number(dbUser.creditBalance ?? 100),
          referralCode: dbUser.referralCode,
          name: dbUser.name || "Member",
          avatarUrl: dbUser.companion?.avatarUrl || null,
        };

        if (dbUser.companion) {
          hostProfile = {
            id: dbUser.companion.id,
            userId: dbUser.id,
            displayName: dbUser.companion.displayName,
            city: dbUser.companion.city?.name || 'Bengaluru',
            locality: dbUser.companion.locality || 'Indiranagar',
            travelRadiusKm: dbUser.companion.travelRadiusKm || 10,
            hostLevel: dbUser.companion.hostLevel || 'NEW',
            completedMeetups: dbUser.companion.completedMeetups || 0,
            hourlyRate: Number(dbUser.companion.hourlyRate),
            avatarUrl: dbUser.companion.avatarUrl,
            verificationStatus: 'approved',
            isFreeToday: dbUser.companion.isAvailable,
            photoVerified: dbUser.companion.photoVerified,
            walletBalance: Number(dbUser.walletBalance || 0),
          };
        }

        const isMemberCompleted = Boolean(dbUser.onboardingCompleted && dbUser.gender);

        memberProfile = {
          id: dbUser.id,
          fullName: dbUser.name || "Member",
          gender: dbUser.gender || null,
          city: dbUser.city || dbUser.companion?.city?.slug || "bengaluru",
          area: dbUser.area || "",
          bio: dbUser.bio || "",
          emergencyContact: dbUser.emergencyContact || "",
          onboardingCompleted: isMemberCompleted,
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
            locality: hostApp.locality || 'Indiranagar',
            travelRadiusKm: hostApp.travelRadiusKm || 10,
            hourlyRate: Number(hostApp.hourlyRate || 399),
            avatarUrl: hostApp.selfieVideoUrl || null,
            verificationStatus: hostApp.screeningStatus.toLowerCase() === "approved" ? "approved" : "pending",
            isFreeToday: false,
            photoVerified: Boolean(hostApp.faceMatchScore && hostApp.faceMatchScore >= 80),
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
