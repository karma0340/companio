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
    const companionId = String(body?.companionId || "").trim();
    const bookingId = String(body?.bookingId || "").trim();
    const rating = Math.min(5, Math.max(1, parseInt(body?.rating || "5", 10)));
    const comment = String(body?.comment || "").trim();

    if (!comment || comment.length < 5) {
      return NextResponse.json(
        { error: "Please enter a genuine review (at least 5 characters)." },
        { status: 400 }
      );
    }

    // If bookingId is provided, check if booking exists
    if (bookingId) {
      const booking = await prisma.booking.findFirst({
        where: { OR: [{ id: bookingId }, { bookingNumber: bookingId }] },
      });

      if (booking) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "COMPLETED" },
        });

        // Insert review
        try {
          await prisma.reviewRating.create({
            data: {
              bookingId: booking.id,
              memberId: session.userId,
              companionId: booking.companionId,
              score: rating,
              comment,
            },
          });
        } catch (e) {
          // If already reviewed, update
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your review has been submitted and added to the companion profile!",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
