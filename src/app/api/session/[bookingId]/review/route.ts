import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { submitSessionReview } from "@/lib/bookings";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    const body = await req.json();

    const score = Number(body.score || 5);
    const comment = String(body.comment || "").trim();
    const tags = Array.isArray(body.tags) ? body.tags : [];
    const memberId = session?.userId || body.memberId || "user_member_demo";

    const result = await submitSessionReview({
      bookingId: params.bookingId,
      memberId,
      score,
      comment,
      tags,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback! Rating recorded successfully.",
      review: result.review,
    });
  } catch (error) {
    console.error("[SUBMIT REVIEW ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit session review." },
      { status: 500 }
    );
  }
}
