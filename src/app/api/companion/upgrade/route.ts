import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user role to COMPANION
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "COMPANION" },
    });

    // Check if companion profile already exists
    let companion = await prisma.companion.findFirst({
      where: { userId: user.id },
    });

    if (!companion) {
      const city = await prisma.city.findFirst() || await prisma.city.create({
        data: { name: "Bengaluru", slug: "bengaluru", state: "Karnataka" },
      });

      companion = await prisma.companion.create({
        data: {
          userId: user.id,
          cityId: city.id,
          displayName: user.name || "Companion Host",
          maskedName: (user.name || "Companion").slice(0, 3) + "***",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          blurredAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&q=20",
          bio: "Passionate local companion ready to explore cafes and culture.",
          shortBio: "Friendly local companion for city activities",
          hourlyRate: 499,
          isAvailable: true,
          spokenLanguages: ["English", "Hindi"],
          acceptedActivities: ["Coffee & Conversations", "Cafe Hopping"],
        },
      });
    }

    // Update active session cookie
    await setSessionCookie({
      ...session,
      role: "COMPANION",
    });

    return NextResponse.json({
      success: true,
      message: "Successfully upgraded to Companion Host!",
      companionId: companion.id,
    });
  } catch (error) {
    console.error("Error upgrading to companion:", error);
    return NextResponse.json(
      { error: "Failed to upgrade profile." },
      { status: 500 }
    );
  }
}
