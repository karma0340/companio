import { NextRequest, NextResponse } from "next/server";
import { completeSession } from "@/lib/bookings";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const result = await completeSession(params.bookingId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Session completed! Escrow payment of ₹${result.booking?.companionFee.toFixed(2)} dispatched via Cashfree Instant Payout.`,
      booking: result.booking,
      payout: result.payout,
    });
  } catch (error) {
    console.error("[COMPLETE SESSION ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete session." },
      { status: 500 }
    );
  }
}
