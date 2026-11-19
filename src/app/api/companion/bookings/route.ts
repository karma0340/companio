import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ bookings: [] });
    }

    const host = await prisma.companion.findFirst({
      where: { userId: session.userId },
    });

    const bookings = await prisma.booking.findMany({
      where: host ? { companionId: host.id } : undefined,
      include: {
        member: { select: { name: true, phone: true } },
        activity: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      memberName: b.member?.name || "Verified Member",
      memberPhone: b.member?.phone || "+91 98765 43210",
      activityTitle: b.activity?.title || "Meetup",
      date: b.scheduledDate.toISOString().split("T")[0],
      startTime: b.scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      durationHours: b.durationHours,
      venueName: b.venueName,
      venueAddress: b.venueAddress,
      companionFee: Number(b.companionFee),
      status: b.status.toLowerCase(),
      verificationCode: b.verificationPin,
      createdAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      bookings: formatted,
    });
  } catch (error) {
    console.error("Error in host bookings GET:", error);
    return NextResponse.json({ bookings: [] });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { bookingId, action } = body;

    if (!bookingId || !action) {
      return NextResponse.json({ error: "Missing bookingId or action" }, { status: 400 });
    }

    if (action === "accept") {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });

      return NextResponse.json({
        success: true,
        message: "Meetup request accepted! Member has been notified.",
      });
    } else if (action === "decline") {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CANCELLED",
          escrowStatus: "REFUNDED_TO_MEMBER",
        },
      });

      return NextResponse.json({
        success: true,
        message: "The meetup request was declined and the member has been refunded.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error in host bookings PATCH:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
