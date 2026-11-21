import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawInput = String(body.email || body.phone || body.identifier || "").trim();
    const code = String(body.code || "").trim();
    const name = body.name ? String(body.name).trim() : undefined;

    if (!rawInput || !code) {
      return NextResponse.json(
        { success: false, error: "Identifier and code are required." },
        { status: 400 }
      );
    }

    const isEmail = rawInput.includes("@");
    let identifier = rawInput;

    if (isEmail) {
      identifier = rawInput.toLowerCase();
    } else {
      const cleanPhone = rawInput.replace(/[\s-]/g, "");
      identifier = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
    }

    const isFirebaseVerified = Boolean(body.firebaseVerified);

    // Verify OTP code if not already verified through Firebase Phone Auth
    if (!isFirebaseVerified) {
      const isDevBypass = (code === "123456" || code === "000000") && process.env.NODE_ENV !== "production";
      if (!isDevBypass) {
        const verification = verifyOtp(identifier, code);
        if (!verification.success) {
          return NextResponse.json(
            { success: false, error: verification.error },
            { status: 400 }
          );
        }
      }
    }

    let userId = `user_${Date.now()}`;
    let role: UserRole = "MEMBER";
    let isUnlocked = false;
    let activePassTier: string | null = null;
    let passExpiresAt: Date | null = null;
    let walletBalance = 0;
    let dbUser: any = null;

    // Database upsert based on verified credentials
    try {
      if (isEmail) {
        const dummyPhone = `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        dbUser = await prisma.user.upsert({
          where: { email: identifier },
          update: {
            ...(name ? { name } : {}),
          },
          create: {
            email: identifier,
            phone: dummyPhone,
            name: name || "Member",
            role: "MEMBER",
            walletBalance: 0,
            isUnlocked: false,
          },
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
      } else {
        dbUser = await prisma.user.upsert({
          where: { phone: identifier },
          update: name ? { name } : {},
          create: {
            phone: identifier,
            name: name || "Member",
            role: "MEMBER",
            walletBalance: 0,
            isUnlocked: false,
          },
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
      }

      if (dbUser) {
        userId = dbUser.id;
        role = dbUser.role;
        const latestPass = dbUser.passes?.[0];
        const isPassValid = latestPass && (!latestPass.validUntil || new Date(latestPass.validUntil) > new Date());
        isUnlocked = Boolean(dbUser.isUnlocked) || Boolean(isPassValid);
        activePassTier = isUnlocked ? (dbUser.activePassTier || (latestPass ? (latestPass.tier as any) : "ONE_MONTH")) : null;
        passExpiresAt = latestPass?.validUntil || dbUser.passExpiresAt;
        walletBalance = Number(dbUser.walletBalance);
      }
    } catch (dbErr) {
      console.warn("[AUTH VERIFY DB FALLBACK]:", (dbErr as Error).message);
    }

    // Determine host profile and member profile
    const hasCompanion = Boolean(dbUser?.companion);
    let hostProfile = null;

    if (hasCompanion && dbUser?.companion) {
      hostProfile = {
        id: dbUser.companion.id,
        userId: dbUser.id,
        displayName: dbUser.companion.displayName,
        city: dbUser.companion.city?.name || 'Bengaluru',
        hourlyRate: Number(dbUser.companion.hourlyRate),
        avatarUrl: dbUser.companion.avatarUrl,
        verificationStatus: 'approved' as const,
        isFreeToday: dbUser.companion.isAvailable,
        walletBalance: Number(dbUser.walletBalance || 0),
      };
    } else {
      try {
        const hostApp = await prisma.hostApplication.findFirst({
          where: { phone: identifier },
          orderBy: { createdAt: 'desc' },
        });
        if (hostApp) {
          hostProfile = {
            id: hostApp.id,
            userId: dbUser?.id || userId,
            displayName: hostApp.fullName,
            city: hostApp.city,
            hourlyRate: 499,
            verificationStatus: (hostApp.screeningStatus.toLowerCase() === 'approved' ? 'approved' : 'pending') as any,
            isFreeToday: false,
            walletBalance: 0,
          };
        }
      } catch (appErr) {
        console.warn("[HOST APP CHECK ERROR]:", appErr);
      }
    }

    const isMemberOnboarded = Boolean(
      dbUser?.name &&
      dbUser.name !== "Member" &&
      dbUser.name.trim().length > 1
    );

    const memberProfile = {
      id: userId,
      fullName: dbUser?.name || name || 'Member',
      city: dbUser?.companion?.city?.slug || 'bengaluru',
      onboardingCompleted: isMemberOnboarded,
    };

    const requestedIntent = String(body.intent || '').toLowerCase();
    const effectiveRole = requestedIntent === 'host' && (hasCompanion || hostProfile) ? 'COMPANION' : 'MEMBER';

    // Set secure HTTP-only session cookie
    const token = await setSessionCookie({
      userId,
      phone: identifier,
      email: isEmail ? identifier : null,
      name: dbUser?.name || name || "Member",
      role: effectiveRole as any,
      isUnlocked,
      activePassTier,
      passExpiresAt: passExpiresAt ? passExpiresAt.toISOString() : null,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        identifier,
        phone: identifier,
        email: isEmail ? identifier : undefined,
        name: dbUser?.name || name || "Member",
        role: effectiveRole,
        activeRole: effectiveRole === 'COMPANION' ? 'host' : 'member',
        isUnlocked,
        activePassTier,
        passExpiresAt,
        walletBalance,
      },
      hostProfile,
      memberProfile,
      hasHostProfile: Boolean(hostProfile),
      token,
    });
  } catch (error) {
    console.error("[AUTH OTP VERIFY ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify sign-in code." },
      { status: 500 }
    );
  }
}
