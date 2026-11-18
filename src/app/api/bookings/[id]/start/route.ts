import { NextRequest, NextResponse } from "next/server";
import { verifyHandshakePin } from "@/lib/bookings";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const pin = String(body.code || body.pin || "").trim();

    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Please enter the 4-digit start code." },
        { status: 400 }
      );
    }

    const result = await verifyHandshakePin(params.id, pin);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "4-Digit start code verified successfully! Session clock is now active.",
      booking: result.booking,
    });
  } catch (error) {
    console.error("[START BOOKING CODE ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify start code." },
      { status: 500 }
    );
  }
}
