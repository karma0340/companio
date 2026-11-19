import { NextRequest, NextResponse } from "next/server";
import { getSession, setSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const targetRole = String(body?.role || "").toUpperCase();

    const newRole = targetRole === "COMPANION" ? "COMPANION" : "MEMBER";

    // Update in database if exists
    try {
      await prisma.user.update({
        where: { id: session.userId },
        data: { role: newRole as any },
      });
    } catch (e) {
      // Continue with session update
    }

    await setSessionCookie({
      ...session,
      role: newRole as any,
    });

    return NextResponse.json({
      success: true,
      role: newRole,
      message: `Active view switched to ${newRole === "COMPANION" ? "Host" : "Member"} mode.`,
    });
  } catch (error) {
    console.error("Error switching role:", error);
    return NextResponse.json({ error: "Failed to switch role" }, { status: 500 });
  }
}
