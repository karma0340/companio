import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/lib/bookings";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await getBookingById(params.id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("[GET BOOKING ID ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve booking details." },
      { status: 500 }
    );
  }
}
