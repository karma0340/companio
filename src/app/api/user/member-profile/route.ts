import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, setSessionCookie } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
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
    console.error("Error fetching member profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
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

    // Connect referral owner if referralCode provided and user not yet linked
    if (referralCode) {
      try {
        const currentUser = await prisma.user.findUnique({
          where: { id: session.userId },
          select: { referredById: true },
        });

        if (!currentUser?.referredById) {
          const referrer = await prisma.user.findFirst({
            where: {
              OR: [
                { referralCode: referralCode },
                { referralCode: { equals: referralCode, mode: "insensitive" } },
              ],
              NOT: { id: session.userId },
            },
            select: { id: true, name: true },
          });

          if (referrer) {
            await prisma.user.update({
              where: { id: session.userId },
              data: { referredById: referrer.id },
            });
          }
        }
      } catch (refErr) {
        console.warn("[REFERRAL LINK WARN]:", refErr);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: fullName,
        gender: gender || "female",
        city: city || "bengaluru",
        area: area || null,
        bio: bio || null,
        emergencyContact: emergencyContact || null,
        onboardingCompleted: true,
      },
    });

    // Refresh session cookie with the new name
    await setSessionCookie({
      ...session,
      name: updatedUser.name || fullName,
    });

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
  } catch (error) {
    console.error("Error updating member profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}
