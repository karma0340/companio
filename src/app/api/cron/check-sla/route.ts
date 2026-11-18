import { NextResponse } from "next/server";
import { checkAndExpireSlaBookings } from "@/lib/bookings";

export async function GET() {
  return handleCheckSla();
}

export async function POST() {
  return handleCheckSla();
}

async function handleCheckSla() {
  try {
    const result = await checkAndExpireSlaBookings();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      expiredCount: result.expiredCount,
      expiredBookingIds: result.expiredIds,
      message:
        result.expiredCount > 0
          ? `Successfully marked ${result.expiredCount} overdue bookings as EXPIRED_SLA and refunded escrow.`
          : "All pending bookings are within the 12-hour companion response window.",
    });
  } catch (error) {
    console.error("[CRON SLA ERROR]:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
