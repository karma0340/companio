import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { submitSessionReview } from "@/lib/bookings";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to submit a verified review." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const score = Number(body.score ?? body.rating ?? 5);
    const comment = String(body.comment || "").trim();
    const tags = Array.isArray(body.tags) ? body.tags : [];

    const result = await submitSessionReview({
      bookingId: params.bookingId,
      memberId: session.userId,
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
      message: "Thank you for your feedback! Verified rating saved.",
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
