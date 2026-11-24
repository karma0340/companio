import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        passes: true,
        memberBookings: {
          include: {
            companion: {
              select: {
                displayName: true,
                hourlyRate: true,
              },
            },
          },
        },
        coinTransactions: true,
        transactions: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      platform: "Meetzy Club",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        area: user.area,
        gender: user.gender,
        bio: user.bio,
        role: user.role,
        isUnlocked: user.isUnlocked,
        activePassTier: user.activePassTier,
        passExpiresAt: user.passExpiresAt,
        coinBalance: user.coinBalance,
        walletBalance: user.walletBalance,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      },
      passes: user.passes,
      bookings: user.memberBookings,
      coinLedger: user.coinTransactions,
      payments: user.transactions,
    };

    const fileName = `meetzy-club-data-${user.phone.replace(/\D/g, '') || user.id}.json`;

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error("[USER DATA EXPORT ERROR]:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
