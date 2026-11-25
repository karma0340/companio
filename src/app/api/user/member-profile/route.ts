import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, setSessionCookie } from "@/lib/session";
import { generateReferralCode } from "@/lib/wallet";
import { validateIndianMobileNumber } from "@/lib/phone";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId && !session?.phone) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cleanPhone = session.phone ? session.phone.replace(/[\s-]/g, "") : "";
    const e164Phone = cleanPhone ? (cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`) : "";

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(session.userId ? [{ id: session.userId }] : []),
          ...(e164Phone ? [{ phone: e164Phone }] : []),
          ...(cleanPhone ? [{ phone: cleanPhone.replace("+91", "") }] : []),
        ],
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        phone: user.phone || "",
        fullName: user.name || "Member",
        email: user.email || "",
        avatarUrl: user.companion?.avatarUrl || user.avatarUrl || "",
        gender: user.gender || null,
        city: user.city || user.companion?.city?.slug || "chandigarh",
        area: user.area || user.companion?.locality || "",
        bio: user.bio || user.companion?.bio || "",
        emergencyContact: user.emergencyContact || "",
        onboardingCompleted: Boolean(user.onboardingCompleted),
        isUnlocked: Boolean(user.isUnlocked) || user.passes.length > 0,
        coinBalance: user.coinBalance ?? 100,
      },
    });
  } catch (error) {
    console.error("[MEMBER PROFILE GET ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId && !session?.phone) {
      return NextResponse.json(
        { error: "Your session has expired. Please sign in again with your phone number." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const fullName = String(body?.fullName || "").trim();
    const rawPhone = body?.phone !== undefined ? String(body.phone || "").trim() : "";
    const gender = String(body?.gender || "").trim().toLowerCase();
    const city = String(body?.city || "chandigarh").trim();
    const area = String(body?.area || "").trim();
    const bio = String(body?.bio || "").trim();
    const emergencyContact = String(body?.emergencyContact || "").trim().replace(/\D/g, "");
    const referralCode = String(body?.referralCode || "").trim();

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    let validatedPhone: string | null = null;
    if (rawPhone) {
      const phoneCheck = validateIndianMobileNumber(rawPhone);
      if (!phoneCheck.isValid) {
        return NextResponse.json(
          { error: phoneCheck.error || "Please enter a valid 10-digit Indian mobile number." },
          { status: 400 }
        );
      }
      validatedPhone = phoneCheck.e164;
    }

    const cleanPhone = session.phone ? session.phone.replace(/[\s-]/g, "") : "";
    const e164Phone = cleanPhone ? (cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`) : "";

    // 1. Locate existing user record by ID or Phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(session.userId ? [{ id: session.userId }] : []),
          ...(e164Phone ? [{ phone: e164Phone }] : []),
          ...(cleanPhone ? [{ phone: cleanPhone.replace("+91", "") }] : []),
        ],
      },
      include: {
        companion: true,
        passes: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Guard against linking a mobile number that already belongs to another user account
    if (validatedPhone) {
      const phoneOwner = await prisma.user.findUnique({
        where: { phone: validatedPhone },
        select: { id: true },
      });
      if (phoneOwner && (!existingUser || phoneOwner.id !== existingUser.id)) {
        return NextResponse.json(
          { error: "This mobile number is already linked to another Meetzy Club account." },
          { status: 409 }
        );
      }
    }

    // 2. Resolve optional referral link
    let referredById: string | null = null;
    if (referralCode) {
      try {
        const referrer = await prisma.user.findFirst({
          where: {
            OR: [
              { referralCode: referralCode },
              { referralCode: { equals: referralCode, mode: "insensitive" } },
            ],
            ...(existingUser?.id ? { NOT: { id: existingUser.id } } : {}),
          },
          select: { id: true },
        });
        if (referrer) {
          referredById = referrer.id;
        }
      } catch (refErr) {
        console.warn("[REFERRAL LOOKUP WARN]:", refErr);
      }
    }

    // 3. Update existing user in DB (or create if session user missing)
    const safeGender = (gender === "male" || gender === "female" || gender === "non-binary" || gender === "other") ? gender : undefined;

    let updatedUser: any;
    if (existingUser) {
      // Never overwrite an already-registered phone number on the profile
      const shouldSetPhone = Boolean(validatedPhone && !existingUser.phone);
      updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: fullName,
          ...(shouldSetPhone && validatedPhone ? { phone: validatedPhone } : {}),
          ...(safeGender ? { gender: safeGender } : {}),
          city: city || "chandigarh",
          area: area || null,
          bio: bio || null,
          emergencyContact: emergencyContact || null,
          onboardingCompleted: true,
          ...(referredById && !existingUser.referredById ? { referredById } : {}),
        },
        include: {
          companion: true,
          passes: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    } else {
      const targetPhone = validatedPhone || e164Phone || null;
      updatedUser = await prisma.user.create({
        data: {
          id: session.userId || undefined,
          phone: targetPhone,
          email: session.email || null,
          name: fullName,
          role: "MEMBER",
          gender: safeGender || "male",
          city: city || "chandigarh",
          area: area || null,
          bio: bio || null,
          emergencyContact: emergencyContact || null,
          onboardingCompleted: true,
          coinBalance: 100,
          creditBalance: 100,
          referralCode: generateReferralCode(),
          referredById: referredById || null,
        },
        include: {
          companion: true,
          passes: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }

    // 4. Refresh session cookie from confirmed DB record (never stale session fields)
    const latestPass = updatedUser.passes?.[0];
    const isPassValid = latestPass && (!latestPass.validUntil || new Date(latestPass.validUntil) > new Date());
    const dbIsUnlocked = Boolean(updatedUser.isUnlocked) || Boolean(isPassValid);
    const dbActivePassTier = dbIsUnlocked
      ? updatedUser.activePassTier || (latestPass ? String(latestPass.tier) : "ONE_MONTH")
      : null;
    const dbPassExpiresAt = (latestPass?.validUntil || updatedUser.passExpiresAt)?.toISOString?.() || null;

    try {
      await setSessionCookie({
        userId: updatedUser.id,
        phone: updatedUser.phone || "",
        phoneVerified: Boolean(
          updatedUser.phone &&
            (session.phoneVerified || (!updatedUser.emailVerified && !updatedUser.googleId))
        ),
        email: updatedUser.email || session.email || null,
        name: updatedUser.name || fullName,
        role: updatedUser.role || "MEMBER",
        activeRole:
          session.activeRole === "host" && (updatedUser.companion || updatedUser.role === "COMPANION")
            ? "host"
            : updatedUser.role === "COMPANION"
            ? "host"
            : "member",
        avatarUrl: updatedUser.companion?.avatarUrl || updatedUser.avatarUrl || session.avatarUrl || null,
        isUnlocked: dbIsUnlocked,
        activePassTier: dbActivePassTier,
        passExpiresAt: dbPassExpiresAt,
      });
    } catch (cookieErr) {
      console.warn("[SESSION COOKIE UPDATE WARN]:", cookieErr);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      profile: {
        id: updatedUser.id,
        phone: updatedUser.phone || "",
        email: updatedUser.email || "",
        fullName: updatedUser.name,
        gender: updatedUser.gender,
        city: updatedUser.city,
        area: updatedUser.area,
        bio: updatedUser.bio,
        emergencyContact: updatedUser.emergencyContact,
        onboardingCompleted: true,
      },
    });
  } catch (error: any) {
    console.error("[MEMBER PROFILE POST ERROR]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}
