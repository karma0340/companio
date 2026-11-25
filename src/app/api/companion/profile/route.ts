import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { uploadHostAvatar } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        companion: {
          include: { city: true },
        },
      },
    });

    if (!user?.companion) {
      return NextResponse.json(
        { success: false, hasProfile: false, error: "Host profile not found." },
        { status: 404 }
      );
    }

    const c = user.companion;
    return NextResponse.json({
      success: true,
      hasProfile: true,
      profile: {
        id: c.id,
        userId: c.userId,
        displayName: c.displayName,
        age: c.age,
        gender: c.gender,
        avatarUrl: c.avatarUrl,
        city: c.city?.name || "Chandigarh",
        locality: c.locality || "",
        travelRadiusKm: c.travelRadiusKm,
        bio: c.bio,
        hourlyRate: Number(c.hourlyRate),
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        availabilitySlots: c.availabilitySlots,
        preferredVenues: c.preferredVenues,
        hostPackTier: c.hostPackTier,
        hostPackExpiresAt: c.hostPackExpiresAt?.toISOString() || null,
        completedMeetups: c.completedMeetups,
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        isAvailable: c.isAvailable,
        upiId: c.upiId || "",
        walletBalance: Number(user.walletBalance || 0),
      },
    });
  } catch (error) {
    console.error("[HOST PROFILE GET ERROR]:", error);
    return NextResponse.json({ error: "Failed to load host profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companion = await prisma.companion.findFirst({
      where: { userId: session.userId },
    });

    if (!companion) {
      return NextResponse.json({ error: "Host profile not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const updates: Record<string, unknown> = {};

    if (typeof body.displayName === "string" && body.displayName.trim().length >= 2) {
      updates.displayName = body.displayName.trim();
    }
    if (typeof body.bio === "string" && body.bio.trim().length >= 10) {
      updates.bio = body.bio.trim();
      updates.shortBio = body.bio.trim().slice(0, 115);
    }
    if (typeof body.locality === "string") {
      updates.locality = body.locality.trim() || null;
    }
    if (body.hourlyRate !== undefined) {
      const rate = Math.min(1299, Math.max(399, Number(body.hourlyRate) || 499));
      updates.hourlyRate = rate;
    }
    if (typeof body.upiId === "string") {
      const cleanUpi = body.upiId.trim();
      if (cleanUpi && (!cleanUpi.includes("@") || cleanUpi.length < 5)) {
        return NextResponse.json(
          { error: "Please enter a valid UPI ID (e.g. name@okaxis or mobile@upi)." },
          { status: 400 }
        );
      }
      updates.upiId = cleanUpi || null;
      if (companion.upiId !== (cleanUpi || null)) {
        updates.razorpayFundAccountId = null;
        updates.upiVerified = false;
      }
    }
    if (Array.isArray(body.spokenLanguages) && body.spokenLanguages.length > 0) {
      updates.spokenLanguages = body.spokenLanguages.map((s: unknown) => String(s).trim()).filter(Boolean);
    }
    if (Array.isArray(body.availabilitySlots) && body.availabilitySlots.length > 0) {
      updates.availabilitySlots = body.availabilitySlots.map((s: unknown) => String(s).trim()).filter(Boolean);
    }
    if (Array.isArray(body.preferredVenues) && body.preferredVenues.length > 0) {
      updates.preferredVenues = body.preferredVenues.map((s: unknown) => String(s).trim()).filter(Boolean);
    }
    if (Array.isArray(body.acceptedActivities) && body.acceptedActivities.length > 0) {
      updates.acceptedActivities = body.acceptedActivities
        .map((s: unknown) => String(s).trim())
        .filter(Boolean);
    }
    if (typeof body.isAvailable === "boolean") {
      updates.isAvailable = body.isAvailable;
    }

    if (typeof body.avatarImage === "string" && body.avatarImage.trim().length > 0) {
      const rawAvatar = body.avatarImage.trim();
      if (rawAvatar.startsWith("data:")) {
        try {
          const uploaded = await uploadHostAvatar(rawAvatar);
          updates.avatarUrl = uploaded.avatarUrl;
          updates.blurredAvatarUrl = uploaded.blurredAvatarUrl;
        } catch {
          updates.avatarUrl = rawAvatar;
          updates.blurredAvatarUrl = rawAvatar;
        }
      } else if (rawAvatar.startsWith("http")) {
        updates.avatarUrl = rawAvatar;
        updates.blurredAvatarUrl = rawAvatar;
      }
    }

    const updated = await prisma.companion.update({
      where: { id: companion.id },
      data: updates as any,
    });

    // Keep core User record synced with Host Studio profile changes
    if (updates.locality !== undefined || updates.bio !== undefined || updates.avatarUrl !== undefined) {
      await prisma.user
        .update({
          where: { id: session.userId },
          data: {
            ...(updates.locality !== undefined ? { area: (updates.locality as string | null) } : {}),
            ...(updates.bio !== undefined ? { bio: updates.bio as string } : {}),
            ...(updates.avatarUrl !== undefined ? { avatarUrl: updates.avatarUrl as string } : {}),
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "Host profile settings saved!",
      profile: {
        displayName: updated.displayName,
        avatarUrl: updated.avatarUrl,
        hourlyRate: Number(updated.hourlyRate),
        locality: updated.locality || "",
        bio: updated.bio,
        upiId: updated.upiId || "",
        acceptedActivities: updated.acceptedActivities,
        availabilitySlots: updated.availabilitySlots,
        preferredVenues: updated.preferredVenues,
        isAvailable: updated.isAvailable,
      },
    });
  } catch (error) {
    console.error("[HOST PROFILE PATCH ERROR]:", error);
    return NextResponse.json({ error: "Failed to save host profile" }, { status: 500 });
  }
}
