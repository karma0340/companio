import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const code = String(body?.code || "").trim();

    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      return NextResponse.json(
        { error: "Please enter the valid 4-digit numeric PIN given by your member." },
        { status: 400 }
      );
    }

    const host = await prisma.companion.findFirst({
      where: { userId: session.userId },
      select: { id: true },
    });

    if (!host) {
      return NextResponse.json(
        { error: "Host profile not found for this account." },
        { status: 403 }
      );
    }

    // Strictly match PIN only among bookings assigned to THIS host
    const matchedBooking = await prisma.booking.findFirst({
      where: {
        companionId: host.id,
        verificationPin: code,
        status: { in: ["PENDING_ACCEPTANCE", "CONFIRMED"] },
      },
    });

    if (!matchedBooking) {
      return NextResponse.json(
        { error: "No active booking matches this 4-digit PIN. Please re-check with your member." },
        { status: 400 }
      );
    }

    const now = new Date();
    const sessionEnd = new Date(now.getTime() + (matchedBooking.durationHours || 1) * 3600000);

    await prisma.booking.update({
      where: { id: matchedBooking.id },
      data: {
        status: "IN_PROGRESS",
        pinVerifiedAt: now,
        sessionStartedAt: now,
        sessionEndedAt: sessionEnd,
      },
    });

    return NextResponse.json({
      success: true,
      message: "4-digit PIN verified! Session timer started. Complete the session when done to credit 70% to your wallet.",
      bookingId: matchedBooking.id,
    });
  } catch (error) {
    console.error("Error verifying start code:", error);
    return NextResponse.json(
      { error: "Failed to verify meetup code." },
      { status: 500 }
    );
  }
}
