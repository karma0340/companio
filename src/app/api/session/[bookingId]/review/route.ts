import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getBookingById, submitHostFeedback, submitSessionReview } from "@/lib/bookings";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to submit verified feedback." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const score = Number(body.score ?? body.rating ?? 5);
    const comment = String(body.comment || "").trim();
    const tags = Array.isArray(body.tags) ? body.tags : [];

    const booking = await getBookingById(params.bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking record not found." },
        { status: 404 }
      );
    }

    // Companion Host rating the Member
    if (booking.companionUserId && booking.companionUserId === session.userId) {
      const hostRes = await submitHostFeedback({
        bookingId: booking.id,
        hostUserId: session.userId,
        score,
        comment,
      });
      if (!hostRes.success) {
        return NextResponse.json({ success: false, error: hostRes.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        role: "COMPANION",
        message: "Member feedback saved cleanly!",
        booking: hostRes.booking,
      });
    }

    // Member rating the Companion Host
    const result = await submitSessionReview({
      bookingId: booking.id,
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
      role: "MEMBER",
      message: "Thank you for your feedback! Verified rating saved.",
      review: result.review,
    });
  } catch (error) {
    console.error("[SUBMIT REVIEW ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit session feedback." },
      { status: 500 }
    );
  }
}
