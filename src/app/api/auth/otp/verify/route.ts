import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").trim();
    const code = String(body.code || "").trim();
    const name = body.name ? String(body.name).trim() : undefined;

    const cleanPhone = phone.replace(/[\s-]/g, "");
    const normalizedPhone = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;

    // Verify OTP
    const verification = verifyOtp(normalizedPhone, code);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 400 }
      );
    }

    let userId = `user_${Date.now()}`;
    let role: UserRole = "MEMBER";
    let isUnlocked = false;
    let activePassTier: string | null = null;
    let passExpiresAt: Date | null = null;
    let walletBalance = 0;

    // Database upsert
    try {
      const user = await prisma.user.upsert({
        where: { phone: normalizedPhone },
        update: name ? { name } : {},
        create: {
          phone: normalizedPhone,
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
    } catch (dbErr) {
      console.warn("[AUTH VERIFY DB FALLBACK]:", (dbErr as Error).message);
    }

    // Set secure HTTP-only session cookie
    const token = await setSessionCookie({
      userId,
      phone: normalizedPhone,
      role: role as any,
      isUnlocked,
    });

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: userId,
        phone: normalizedPhone,
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
      { success: false, error: "Authentication verification failed." },
      { status: 500 }
    );
  }
}
