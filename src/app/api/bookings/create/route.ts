import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createBooking } from "@/lib/bookings";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    const companionId = String(body.companionId || "").trim();
    const activityId = String(body.activityId || "act_01").trim();
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
          error: "A verified public venue name and address are required (e.g., Starbucks, Blue Tokai, DLF Mall).",
        },
        { status: 400 }
      );
    }

    const memberId = session?.userId || `guest_${Date.now()}`;
    const memberPhone = session?.phone || body.phone || "+919811223399";
    const memberName = body.name || "Member";

    const booking = await createBooking({
      memberId,
      memberName,
      memberPhone,
      companionId,
      activityId,
      scheduledDate: scheduledDate || new Date(Date.now() + 24 * 3600000).toISOString(),
      durationHours: Math.max(1, Math.min(6, durationHours)),
      venueName,
      venueAddress,
    });

    console.log(`[BOOKING CREATED] #${booking.bookingNumber} for ${booking.companionName} by ${memberPhone}. Total: ₹${booking.totalAmount}`);

    return NextResponse.json({
      success: true,
      message: `Booking request sent to ${booking.companionName}. Escrow deposit of ₹${booking.totalAmount} secured.`,
      booking,
    });
  } catch (error) {
    console.error("[BOOKING CREATE ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking request." },
      { status: 500 }
    );
  }
}
