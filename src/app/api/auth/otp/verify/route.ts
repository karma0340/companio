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

    // Verify OTP code
    const verification = verifyOtp(identifier, code);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 400 }
      );
    }

    let userId = `user_${Date.now()}`;
    let role: UserRole = "MEMBER";
    // Check if subscriber (e.g. user provided email)
    const isSpecialSubscriber = identifier.toLowerCase() === "mohittyagi@gmail.com";
    let isUnlocked = isSpecialSubscriber;
    let activePassTier: string | null = isSpecialSubscriber ? "ONE_MONTH" : null;
    let passExpiresAt: Date | null = isSpecialSubscriber
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;
    let walletBalance = 0;

    // Database upsert
    try {
      if (isEmail) {
        const dummyPhone = `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const user = await prisma.user.upsert({
          where: { email: identifier },
          update: {
            ...(name ? { name } : {}),
            ...(isSpecialSubscriber
              ? {
                  isUnlocked: true,
                  activePassTier: "ONE_MONTH",
                  passExpiresAt,
                }
              : {}),
          },
          create: {
            email: identifier,
            phone: dummyPhone,
            name: name || "Member",
            role: "MEMBER",
            walletBalance: 0,
            isUnlocked,
            activePassTier: activePassTier as any,
            passExpiresAt,
          },
        });
        userId = user.id;
        role = user.role;
        isUnlocked = user.isUnlocked;
        activePassTier = user.activePassTier;
        passExpiresAt = user.passExpiresAt;
        walletBalance = Number(user.walletBalance);
      } else {
        const user = await prisma.user.upsert({
          where: { phone: identifier },
          update: name ? { name } : {},
          create: {
            phone: identifier,
            name: name || "Member",
            role: "MEMBER",
            walletBalance: 0,
          },
        });
        userId = user.id;
        role = user.role;
        isUnlocked = user.isUnlocked;
        activePassTier = user.activePassTier;
        passExpiresAt = user.passExpiresAt;
        walletBalance = Number(user.walletBalance);
      }
    } catch (dbErr) {
      console.warn("[AUTH VERIFY DB FALLBACK]:", (dbErr as Error).message);
    }

    // Set secure HTTP-only session cookie
    const token = await setSessionCookie({
      userId,
      phone: identifier,
      role: role as any,
      isUnlocked,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        identifier,
        phone: identifier,
        email: isEmail ? identifier : undefined,
        name: name || "Member",
        role,
        isUnlocked,
        activePassTier,
        passExpiresAt,
        walletBalance,
      },
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
