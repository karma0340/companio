import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { triggerSosAlert } from "@/lib/bookings";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    const body = await req.json();

    const userId = session?.userId || body.userId || "user_member_demo";
    const latitude = body.latitude ? Number(body.latitude) : undefined;
    const longitude = body.longitude ? Number(body.longitude) : undefined;

    const result = await triggerSosAlert({
      bookingId: params.bookingId,
      userId,
      latitude,
      longitude,
    });

    return NextResponse.json({
      success: true,
      message: "Emergency alert logged. Dispatched to 24/7 Safety Command and dialing 112.",
      alertId: result.alertId,
      emergencyDial: result.emergencyDial,
    });
  } catch (error) {
    console.error("[SOS ALERT ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch SOS alert." },
      { status: 500 }
    );
  }
}
