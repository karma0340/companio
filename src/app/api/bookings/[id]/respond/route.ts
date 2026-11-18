import { NextRequest, NextResponse } from "next/server";
import { respondToBooking } from "@/lib/bookings";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const action = String(body.action || "").toUpperCase();

    if (action !== "ACCEPT" && action !== "DECLINE") {
      return NextResponse.json(
        { success: false, error: "Action must be either 'ACCEPT' or 'DECLINE'." },
        { status: 400 }
      );
    }

    const result = await respondToBooking(params.id, action);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === "ACCEPT"
          ? "Booking accepted! Real-time chat channel is now unlocked for coordination."
          : "Booking declined. Escrow payment has been automatically refunded to the member.",
      booking: result.booking,
    });
  } catch (error) {
    console.error("[BOOKING RESPOND ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process host response." },
      { status: 500 }
    );
  }
}
