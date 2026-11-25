import { NextRequest, NextResponse } from "next/server";
import { verifyHandshakePin } from "@/lib/bookings";
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
    const pin = String(body.code || body.pin || "").trim();

    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Please enter the 4-digit start code." },
        { status: 400 }
      );
    }

    const result = await verifyHandshakePin(params.id, pin, session.userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "4-Digit start code verified! Session timer is now active.",
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
