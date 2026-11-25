import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, unlocked: false, requiresAuth: true, error: "Please sign in first." },
        { status: 200 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const companionId = String(body.companionId || "").trim();

    if (!companionId) {
      return NextResponse.json(
        { success: false, unlocked: false, error: "Companion ID is required." },
        { status: 400 }
      );
    }

    const companion = await prisma.companion.findUnique({
      where: { id: companionId },
      select: { id: true, userId: true, displayName: true },
    });

    if (!companion) {
      return NextResponse.json(
        { success: false, unlocked: false, error: "Companion not found." },
        { status: 404 }
      );
    }

    if (companion.userId === userId) {
      return NextResponse.json({
        success: false,
        unlocked: false,
        isSelfHost: true,
        error: "You cannot message your own host profile.",
      });
    }

    // Messaging strictly unlocks only after Member requested a meetup AND Host accepted it
    const acceptedBooking = await prisma.booking.findFirst({
      where: {
        memberId: userId,
        companionId: companion.id,
        status: { in: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (acceptedBooking) {
      return NextResponse.json({
        success: true,
        unlocked: true,
        alreadyUnlocked: true,
        bookingId: acceptedBooking.id,
        redirectUrl: `/chat/${acceptedBooking.id}`,
        message: "Meetup accepted! Opening your private shielded chat.",
      });
    }

    const pendingBooking = await prisma.booking.findFirst({
      where: {
        memberId: userId,
        companionId: companion.id,
        status: "PENDING_ACCEPTANCE",
      },
      orderBy: { createdAt: "desc" },
    });

    if (pendingBooking) {
      return NextResponse.json({
        success: false,
        unlocked: false,
        requiresAcceptance: true,
        pendingBookingId: pendingBooking.id,
        message: `Your meetup request with ${companion.displayName} is pending acceptance. Messaging unlocks automatically as soon as they accept!`,
      });
    }

    return NextResponse.json({
      success: false,
      unlocked: false,
      requiresMeetupRequest: true,
      message: `Please request a meetup with ${companion.displayName} first. Once they accept your request, chat opens at 10 Coins per message (starting with your 100 bonus coins).`,
    });
  } catch (error) {
    console.error("[CHAT_UNLOCK_GATE_ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify meetup chat access." },
      { status: 500 }
    );
  }
}
