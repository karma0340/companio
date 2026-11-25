import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getBookingById, triggerSosAlert } from "@/lib/bookings";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to trigger an emergency SOS alert." },
        { status: 401 }
      );
    }

    const booking = await getBookingById(params.bookingId);
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
        { success: false, error: "Unauthorized SOS access for this booking." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const latitude = body.latitude !== undefined ? Number(body.latitude) : undefined;
    const longitude = body.longitude !== undefined ? Number(body.longitude) : undefined;

    const result = await triggerSosAlert({
      bookingId: booking.id,
      userId: session.userId,
      latitude: typeof latitude === "number" && !isNaN(latitude) ? latitude : undefined,
      longitude: typeof longitude === "number" && !isNaN(longitude) ? longitude : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Emergency alert logged and dispatched to Meetzy Club 24/7 Safety Desk.",
      alertId: result.alertId,
      incidentId: result.alertId,
      emergencyDial: result.emergencyDial,
    });
  } catch (error) {
    console.error("[SOS ALERT ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch SOS alert. Please dial 112 directly." },
      { status: 500 }
    );
  }
}
