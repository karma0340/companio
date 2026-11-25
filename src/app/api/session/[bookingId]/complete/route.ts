import { NextRequest, NextResponse } from "next/server";
import { completeSession } from "@/lib/bookings";
import { getSession } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await completeSession(params.bookingId, session.userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Session completed! 70% Host payout (INR ${result.booking?.companionFee.toFixed(2)}) credited to Host Wallet.`,
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
