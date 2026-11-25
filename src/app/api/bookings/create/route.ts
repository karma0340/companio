import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createBooking } from "@/lib/bookings";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in with your mobile number to book a meetup." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const companionId = String(body.companionId || "").trim();
    const activityId = String(body.activityId || "coffee-chat").trim();
    const scheduledDate = String(body.scheduledDate || "").trim();
    const durationHours = Number(body.durationHours || 1);
    const venueName = String(body.venueName || "").trim();
    const venueAddress = String(body.venueAddress || "").trim();

    if (!companionId) {
      return NextResponse.json(
        { success: false, error: "Please select a valid companion." },
        { status: 400 }
      );
    }

    if (!venueName || !venueAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "A verified public venue name and address are required.",
        },
        { status: 400 }
      );
    }

    const booking = await createBooking({
      memberId: session.userId,
      memberName: session.name || body.name || "Verified Member",
      memberPhone: session.phone,
      companionId,
      activityId,
      scheduledDate: scheduledDate || new Date(Date.now() + 24 * 3600000).toISOString(),
      durationHours: Math.max(1, Math.min(8, durationHours)),
      venueName,
      venueAddress,
    });

    return NextResponse.json({
      success: true,
      message: `Booking request sent to ${booking.companionName}. Escrow deposit of INR ${booking.totalAmount} secured.`,
      booking,
    });
  } catch (error) {
    console.error("[BOOKING CREATE ERROR]:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to create booking request." },
      { status: 500 }
    );
  }
}
