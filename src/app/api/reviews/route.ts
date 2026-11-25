import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getBookingById, submitHostFeedback, submitSessionReview } from "@/lib/bookings";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const bookingId = String(body?.bookingId || "").trim();
    const rating = Math.min(5, Math.max(1, parseInt(String(body?.rating ?? body?.score ?? "5"), 10)));
    const comment = String(body?.comment || "").trim();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    if (!comment || comment.length < 5) {
      return NextResponse.json(
        { error: "Please enter a genuine review (at least 5 characters)." },
        { status: 400 }
      );
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    // Host reviewing Member
    if (booking.companionUserId && booking.companionUserId === session.userId) {
      const hostRes = await submitHostFeedback({
        bookingId: booking.id,
        hostUserId: session.userId,
        score: rating,
        comment,
      });
      if (!hostRes.success) {
        return NextResponse.json({ error: hostRes.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: "Your member feedback has been saved!",
      });
    }

    // Member reviewing Host (automatically settles escrow cleanly if session was IN_PROGRESS)
    if (booking.memberId !== session.userId) {
      return NextResponse.json(
        { error: "Only participants of this meetup can submit feedback." },
        { status: 403 }
      );
    }

    const res = await submitSessionReview({
      bookingId: booking.id,
      memberId: session.userId,
      score: rating,
      comment,
    });

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Your verified review has been saved and companion rating updated!",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
