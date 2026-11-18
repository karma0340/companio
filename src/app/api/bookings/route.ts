import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getBookingsForUser } from "@/lib/bookings";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get("role") || "ALL";

    const userId = session?.userId || "user_member_demo";
    const role = (roleParam.toUpperCase() === "COMPANION" ? "COMPANION" : roleParam.toUpperCase() === "MEMBER" ? "MEMBER" : "ALL");

    const bookings = await getBookingsForUser(userId, role);

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("[GET BOOKINGS ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}
