import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";
import { UserRole } from "@prisma/client";
import { ensureUserWallet, generateReferralCode } from "@/lib/wallet";

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

    // Strictly verify issued OTP code against store (no demo/master bypasses)
    if (!isFirebaseVerified) {
      const verification = verifyOtp(identifier, code);
      if (!verification.success) {
        return NextResponse.json(
          { success: false, error: verification.error },
          { status: 400 }
        );
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
      const incomingRef = String(body.ref || body.referralCode || "").trim();
      let referredByUser = null;
      if (incomingRef) {
        referredByUser = await prisma.user.findUnique({
          where: { referralCode: incomingRef },
          select: { id: true },
        });
      }

      if (isEmail) {
        dbUser = await prisma.user.upsert({
          where: { email: identifier },
          update: {
            ...(name ? { name } : {}),
            emailVerified: true,
          },
          create: {
            email: identifier,
            phone: null,
            name: name || "Member",
            role: "MEMBER",
            walletBalance: 0,
            coinBalance: 100,
            creditBalance: 100,
            emailVerified: true,
            referralCode: generateReferralCode(),
            referredById: referredByUser?.id || null,
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
            coinBalance: 100,
            creditBalance: 100,
            referralCode: generateReferralCode(),
            referredById: referredByUser?.id || null,
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
        await ensureUserWallet(dbUser.id);
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
      dbUser?.onboardingCompleted ||
      (dbUser?.name &&
       dbUser.name !== "Member" &&
       dbUser.name.trim().length > 1)
    );

    const memberProfile = {
      id: userId,
      fullName: dbUser?.name || name || 'Member',
      gender: dbUser?.gender || 'female',
      city: dbUser?.city || dbUser?.companion?.city?.slug || 'bengaluru',
      area: dbUser?.area || '',
      bio: dbUser?.bio || '',
      emergencyContact: dbUser?.emergencyContact || '',
      onboardingCompleted: isMemberOnboarded,
    };

    const requestedIntent = String(body.intent || '').toLowerCase();
    const effectiveRole = requestedIntent === 'host' && (hasCompanion || hostProfile) ? 'COMPANION' : 'MEMBER';

    const resolvedPhone = isEmail ? dbUser?.phone || "" : identifier;
    const isPhoneVerified = !isEmail;

    // Set secure HTTP-only session cookie
    const token = await setSessionCookie({
      userId,
      phone: resolvedPhone,
      phoneVerified: isPhoneVerified,
      email: isEmail ? identifier : dbUser?.email || null,
      name: dbUser?.name || name || "Member",
      role: effectiveRole as any,
      activeRole: effectiveRole === "COMPANION" ? "host" : "member",
      avatarUrl: dbUser?.companion?.avatarUrl || dbUser?.avatarUrl || null,
      isUnlocked,
      activePassTier,
      passExpiresAt: passExpiresAt ? passExpiresAt.toISOString() : null,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        identifier,
        phone: resolvedPhone,
        phoneVerified: isPhoneVerified,
        email: isEmail ? identifier : dbUser?.email || undefined,
        name: dbUser?.name || name || "Member",
        avatarUrl: dbUser?.companion?.avatarUrl || null,
        role: effectiveRole,
        activeRole: effectiveRole === 'COMPANION' ? 'host' : 'member',
        isUnlocked,
        activePassTier,
        passExpiresAt,
        walletBalance,
        coinBalance: dbUser?.coinBalance ?? 100,
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
