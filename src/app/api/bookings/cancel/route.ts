import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { refundEscrowCoinsIfWalletPaid } from "@/lib/bookings";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const bookingId = String(body?.bookingId || "").trim();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id: bookingId },
          { bookingNumber: bookingId },
        ],
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (booking.memberId && booking.memberId !== session.userId) {
      return NextResponse.json(
        { error: "You are not authorized to cancel this booking." },
        { status: 403 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "This booking has already been cancelled." },
        { status: 400 }
      );
    }

    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Completed meetups cannot be cancelled." },
        { status: 400 }
      );
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CANCELLED",
        escrowStatus: "REFUNDED_TO_MEMBER",
      },
    });

    await refundEscrowCoinsIfWalletPaid({
      bookingId: booking.id,
      memberId: booking.memberId,
      totalAmount: Number(booking.totalAmount),
      bookingNumber: booking.bookingNumber,
      reason: "Meetup cancelled by member",
    });

    return NextResponse.json({
      success: true,
      message: `Meetup #${booking.bookingNumber} has been cancelled successfully. 100% full refund of ₹${Number(booking.totalAmount).toLocaleString("en-IN")} has been processed.`,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking. Please try again." },
      { status: 500 }
    );
  }
}
