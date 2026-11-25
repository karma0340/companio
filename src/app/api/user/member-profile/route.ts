import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, setSessionCookie } from "@/lib/session";
import { generateReferralCode } from "@/lib/wallet";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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
        phone: user.phone,
        fullName: user.name || "Member",
        email: user.email || "",
        gender: user.gender || "female",
        city: user.city || "chandigarh",
        area: user.area || "",
        bio: user.bio || "",
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
    const gender = String(body?.gender || "female").trim();
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

    const cleanPhone = session.phone ? session.phone.replace(/[\s-]/g, "") : "";
    const e164Phone = cleanPhone ? (cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`) : "";

    // 1. Locate existing user record by ID or Phone
    let existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(session.userId ? [{ id: session.userId }] : []),
          ...(e164Phone ? [{ phone: e164Phone }] : []),
          ...(cleanPhone ? [{ phone: cleanPhone.replace("+91", "") }] : []),
        ],
      },
    });

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

    // 3. Update existing user or upsert by phone
    let updatedUser;
    if (existingUser) {
      updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: fullName,
          gender: gender || "female",
          city: city || "chandigarh",
          area: area || null,
          bio: bio || null,
          emergencyContact: emergencyContact || null,
          onboardingCompleted: true,
          ...(referredById && !existingUser.referredById ? { referredById } : {}),
        },
      });
    } else {
      const targetPhone = e164Phone || `+91${Math.floor(6000000000 + Math.random() * 3999999999)}`;
      updatedUser = await prisma.user.upsert({
        where: { phone: targetPhone },
        update: {
          name: fullName,
          gender: gender || "female",
          city: city || "chandigarh",
          area: area || null,
          bio: bio || null,
          emergencyContact: emergencyContact || null,
          onboardingCompleted: true,
          ...(referredById ? { referredById } : {}),
        },
        create: {
          id: session.userId || undefined,
          phone: targetPhone,
          name: fullName,
          role: "MEMBER",
          gender: gender || "female",
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
      });
    }

    // 4. Update session cookie with the confirmed User ID and name
    try {
      await setSessionCookie({
        userId: updatedUser.id,
        phone: updatedUser.phone || '',
        email: updatedUser.email || session.email || null,
        name: updatedUser.name || fullName,
        role: (session.role as any) || "MEMBER",
        isUnlocked: Boolean(session.isUnlocked),
        activePassTier: session.activePassTier || null,
        passExpiresAt: session.passExpiresAt || null,
      });
    } catch (cookieErr) {
      console.warn("[SESSION COOKIE UPDATE WARN]:", cookieErr);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      profile: {
        id: updatedUser.id,
        phone: updatedUser.phone,
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
