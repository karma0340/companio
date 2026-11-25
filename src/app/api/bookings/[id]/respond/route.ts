import { NextRequest, NextResponse } from "next/server";
import { respondToBooking } from "@/lib/bookings";
import { getSession } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const action = String(body.action || "").toUpperCase();

    if (action !== "ACCEPT" && action !== "DECLINE") {
      return NextResponse.json(
        { success: false, error: "Action must be either 'ACCEPT' or 'DECLINE'." },
        { status: 400 }
      );
    }

    const result = await respondToBooking(params.id, action, session.userId);

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
          ? "Booking accepted! Chat and Session Room are now active."
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
