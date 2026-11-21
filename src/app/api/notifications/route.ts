import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    let userId = session?.userId;

    if (!userId) {
      // Dev fallback to latest active user
      const latestUser = await prisma.user.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if (latestUser) {
        userId = latestUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json({
        success: true,
        notifications: [],
        offers: [],
        unreadCount: 0,
      });
    }

    const result = await getUserNotifications(userId);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[NOTIFICATIONS_API_ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
