import { NextRequest, NextResponse } from "next/server";
import { getBookingById, sanitizeBookingForViewer } from "@/lib/bookings";
import { getSession } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to view booking details." },
        { status: 401 }
      );
    }

    const booking = await getBookingById(params.id);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    if (
      booking.memberId !== session.userId &&
      booking.companionUserId !== session.userId
    ) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to view this booking." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: sanitizeBookingForViewer(booking, session.userId),
      viewerRole: booking.memberId === session.userId ? "MEMBER" : "COMPANION",
    });
  } catch (error) {
    console.error("[GET BOOKING ID ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve booking details." },
      { status: 500 }
    );
  }
}
