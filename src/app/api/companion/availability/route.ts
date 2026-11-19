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
    const isFreeToday = Boolean(body?.isFreeToday);

    const companion = await prisma.companion.findFirst({
      where: { userId: session.userId },
    });

    if (companion) {
      await prisma.companion.update({
        where: { id: companion.id },
        data: { isAvailable: isFreeToday },
      });
    }

    return NextResponse.json({
      success: true,
      isFreeToday,
      message: `Availability updated to: ${isFreeToday ? "Available Today" : "Not Available Today"}`,
    });
  } catch (error) {
    console.error("Error in availability route:", error);
    return NextResponse.json(
      { error: "Failed to update availability." },
      { status: 500 }
    );
  }
}
