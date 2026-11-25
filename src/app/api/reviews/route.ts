import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

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

    const booking = await prisma.booking.findFirst({
      where: { OR: [{ id: bookingId }, { bookingNumber: bookingId }] },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (booking.memberId !== session.userId) {
      return NextResponse.json(
        { error: "Only the member who booked can review this meetup." },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      if (booking.status !== "COMPLETED") {
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: "COMPLETED" },
        });
      }

      await tx.reviewRating.upsert({
        where: { bookingId: booking.id },
        update: {
          score: rating,
          comment,
        },
        create: {
          bookingId: booking.id,
          memberId: session.userId,
          companionId: booking.companionId,
          score: rating,
          comment,
        },
      });

      const stats = await tx.reviewRating.aggregate({
        where: { companionId: booking.companionId },
        _avg: { score: true },
        _count: { score: true },
      });

      await tx.companion.update({
        where: { id: booking.companionId },
        data: {
          ratingAverage: Number((stats._avg.score || rating).toFixed(2)),
          totalReviews: stats._count.score || 1,
        },
      });
    });

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
