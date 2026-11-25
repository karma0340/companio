import { NextRequest, NextResponse } from "next/server";
import { verifyHandshakePin } from "@/lib/bookings";
import { getSession } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in as the Host to verify the PIN." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const pin = String(body.pin || "").trim();

    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { success: false, error: "Please enter the 4-digit Handshake PIN." },
        { status: 400 }
      );
    }

    const result = await verifyHandshakePin(params.bookingId, pin, session.userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "4-Digit PIN verified! Session timer is now active.",
      booking: result.booking,
    });
  } catch (error) {
    console.error("[VERIFY PIN ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify handshake PIN." },
      { status: 500 }
    );
  }
}
