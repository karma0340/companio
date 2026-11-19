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

    if (code.length < 4 || code.length > 6 || !/^\d+$/.test(code)) {
      return NextResponse.json(
        { error: "Please enter a valid numeric verification PIN." },
        { status: 400 }
      );
    }

    // Look for matching booking by verificationPin
    const matchedBooking = await prisma.booking.findFirst({
      where: {
        verificationPin: code,
        status: { in: ["PENDING_ACCEPTANCE", "CONFIRMED"] },
      },
      include: { companion: true },
    });

    if (!matchedBooking) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check with your member at the venue." },
        { status: 400 }
      );
    }

    const hostPayout = Number(matchedBooking.companionFee);

    await prisma.booking.update({
      where: { id: matchedBooking.id },
      data: {
        status: "IN_PROGRESS",
        pinVerifiedAt: new Date(),
        sessionStartedAt: new Date(),
        escrowStatus: "RELEASED_TO_HOST",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Start code verified! Meetup is officially in progress.",
      payoutAdded: hostPayout,
      newWalletBalance: hostPayout,
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
