import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId;

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
