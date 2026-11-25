import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, bookings: [], error: "Unauthorized" }, { status: 401 });
    }

    const host = await prisma.companion.findFirst({
      where: { userId: session.userId },
      select: { id: true },
    });

    // Strict guard: never return other hosts' bookings if user has no Companion profile
    if (!host) {
      return NextResponse.json({ success: true, bookings: [], isHost: false });
    }

    const bookings = await prisma.booking.findMany({
      where: { companionId: host.id },
      include: {
        member: { select: { name: true } },
        activity: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // Never return member's secret verificationPin or raw memberPhone to Host!
    const formatted = bookings.map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      memberName: b.member?.name || "Verified Member",
      activityTitle: b.activity?.title || "Meetup",
      date: b.scheduledDate.toISOString().split("T")[0],
      startTime: b.scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      durationHours: b.durationHours,
      venueName: b.venueName,
      venueAddress: b.venueAddress,
      totalAmount: Number(b.totalAmount),
      companionFee: Number(b.companionFee), // 70% Host Share
      status: b.status.toLowerCase(),
      escrowStatus: b.escrowStatus,
      createdAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      isHost: true,
      bookings: formatted,
    });
  } catch (error) {
    console.error("Error in host bookings GET:", error);
    return NextResponse.json({ success: false, bookings: [] }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const host = await prisma.companion.findFirst({
      where: { userId: session.userId },
      select: { id: true },
    });

    if (!host) {
      return NextResponse.json({ error: "Host profile not found" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const bookingId = String(body?.bookingId || "").trim();
    const action = String(body?.action || "").toLowerCase();

    if (!bookingId || (action !== "accept" && action !== "decline")) {
      return NextResponse.json({ error: "Valid bookingId and action required" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, companionId: host.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found for this host" }, { status: 404 });
    }

    if (booking.status !== "PENDING_ACCEPTANCE") {
      return NextResponse.json(
        { error: `Booking already processed (${booking.status})` },
        { status: 400 }
      );
    }

    if (action === "accept") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CONFIRMED" },
      });

      return NextResponse.json({
        success: true,
        message: "Meetup request accepted! Open Session Room when you arrive at the venue.",
      });
    } else {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "CANCELLED",
          escrowStatus: "REFUNDED_TO_MEMBER",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Meetup request declined and escrow refunded to the member.",
      });
    }
  } catch (error) {
    console.error("Error in host bookings PATCH:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
