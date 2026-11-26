import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";
import { ensureUserWallet } from "@/lib/wallet";
import {
  checkSeededAuthRateLimit,
  clearSeededAuthFailures,
  isSeededOperatorConfigured,
  recordSeededAuthFailure,
  verifySeededOperatorCredentials,
  verifySeededPortalKey,
} from "@/lib/seeded-auth";

export const dynamic = "force-dynamic";

function getClientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    if (!isSeededOperatorConfigured()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const accessKey = String(body.accessKey || "");

    if (!verifySeededPortalKey(accessKey)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const clientKey = getClientKey(req);
    const rateCheck = checkSeededAuthRateLimit(clientKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Try again in ${rateCheck.retryAfterSeconds ?? 60}s.`,
        },
        { status: 429 }
      );
    }

    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const targetUserId = body.targetUserId ? String(body.targetUserId).trim() : null;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Operator email and password are required." },
        { status: 400 }
      );
    }

    if (!verifySeededOperatorCredentials(email, password)) {
      recordSeededAuthFailure(clientKey);
      return NextResponse.json(
        { success: false, error: "Invalid operator email or password." },
        { status: 401 }
      );
    }

    clearSeededAuthFailures(clientKey);

    // Step 1: List all seeded profiles without touching genuine user accounts
    if (!targetUserId) {
      const seededUsers = await prisma.user.findMany({
        where: { isSeeded: true },
        orderBy: [{ role: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          avatarUrl: true,
          city: true,
          companion: {
            select: {
              id: true,
              displayName: true,
              maskedName: true,
              hourlyRate: true,
              avatarUrl: true,
              isAvailable: true,
              city: {
                select: { name: true, slug: true },
              },
            },
          },
        },
      });

      const profiles = seededUsers.map((u) => ({
        userId: u.id,
        companionId: u.companion?.id || null,
        name: u.name || u.companion?.displayName || "Seeded Profile",
        displayName: u.companion?.displayName || u.name || "Seeded Profile",
        phone: u.phone || "",
        role: u.companion ? "COMPANION" : u.role,
        city: u.companion?.city?.name || u.city || "Unknown",
        hourlyRate: u.companion ? Number(u.companion.hourlyRate) : null,
        avatarUrl: u.companion?.avatarUrl || u.avatarUrl || null,
        isAvailable: u.companion?.isAvailable ?? false,
      }));

      return NextResponse.json({
        success: true,
        profiles,
      });
    }

    // Step 2: Sign in as a specific seeded user (strictly rejecting genuine users)
    const dbUser = await prisma.user.findUnique({
      where: { id: targetUserId },
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

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "Target profile not found." },
        { status: 404 }
      );
    }

    if (!dbUser.isSeeded) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied: genuine user accounts require OTP or Google authentication.",
        },
        { status: 403 }
      );
    }

    await ensureUserWallet(dbUser.id);

    const latestPass = dbUser.passes?.[0];
    const isPassValid =
      latestPass && (!latestPass.validUntil || new Date(latestPass.validUntil) > new Date());
    const isUnlocked = Boolean(dbUser.isUnlocked) || Boolean(isPassValid);
    const activePassTier = isUnlocked
      ? dbUser.activePassTier || (latestPass ? latestPass.tier : "ONE_MONTH")
      : null;
    const passExpiresAt = latestPass?.validUntil || dbUser.passExpiresAt;
    const hasCompanion = Boolean(dbUser.companion);
    const effectiveRole = hasCompanion ? "COMPANION" : dbUser.role;

    const hostProfile =
      hasCompanion && dbUser.companion
        ? {
            id: dbUser.companion.id,
            userId: dbUser.id,
            displayName: dbUser.companion.displayName,
            city: dbUser.companion.city?.name || "Bengaluru",
            hourlyRate: Number(dbUser.companion.hourlyRate),
            avatarUrl: dbUser.companion.avatarUrl,
            verificationStatus: "approved" as const,
            isFreeToday: dbUser.companion.isAvailable,
            walletBalance: Number(dbUser.walletBalance || 0),
          }
        : null;

    const memberProfile = {
      id: dbUser.id,
      fullName: dbUser.name || "Member",
      gender: dbUser.gender || "female",
      city: dbUser.city || dbUser.companion?.city?.slug || "bengaluru",
      area: dbUser.area || "",
      bio: dbUser.bio || "",
      emergencyContact: dbUser.emergencyContact || "",
      onboardingCompleted: Boolean(dbUser.onboardingCompleted || (dbUser.name && dbUser.name.trim().length > 1)),
    };

    const token = await setSessionCookie({
      userId: dbUser.id,
      phone: dbUser.phone || "",
      phoneVerified: Boolean(dbUser.phone),
      email: dbUser.email || null,
      name: dbUser.name || dbUser.companion?.displayName || "Member",
      role: effectiveRole as "MEMBER" | "COMPANION" | "ADMIN",
      activeRole: effectiveRole === "COMPANION" ? "host" : "member",
      avatarUrl: dbUser.companion?.avatarUrl || dbUser.avatarUrl || null,
      isUnlocked,
      activePassTier,
      passExpiresAt: passExpiresAt ? new Date(passExpiresAt).toISOString() : null,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        phone: dbUser.phone || "",
        phoneVerified: Boolean(dbUser.phone),
        email: dbUser.email || undefined,
        name: dbUser.name || dbUser.companion?.displayName || "Member",
        avatarUrl: dbUser.companion?.avatarUrl || dbUser.avatarUrl || null,
        role: effectiveRole,
        activeRole: effectiveRole === "COMPANION" ? "host" : "member",
        isUnlocked,
        activePassTier,
        passExpiresAt,
        walletBalance: Number(dbUser.walletBalance || 0),
        coinBalance: dbUser.coinBalance ?? 100,
      },
      hostProfile,
      memberProfile,
      hasHostProfile: hasCompanion,
      redirectTo: hasCompanion ? "/companion/dashboard" : "/explore",
      token,
    });
  } catch (error) {
    console.error("[SEEDED LOGIN ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to authenticate seeded profile." },
      { status: 500 }
    );
  }
}
