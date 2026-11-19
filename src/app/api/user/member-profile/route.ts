import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

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
        gender: "other",
        city: "bengaluru",
        area: "",
        bio: "",
        emergencyContact: "",
        isUnlocked: Boolean(user.isUnlocked) || user.passes.length > 0,
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
    const emergencyContact = String(body?.emergencyContact || "").trim().replace(/\D/g, "");

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: fullName,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      profile: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        fullName: updatedUser.name,
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
