import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateIndianMobileNumber } from "@/lib/phone";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPhone = searchParams.get("phone");

    if (!rawPhone) {
      return NextResponse.json({
        success: false,
        exists: false,
        error: "Phone number is required.",
      });
    }

    const validation = validateIndianMobileNumber(rawPhone);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        exists: false,
        error: validation.error || "Invalid Indian mobile number.",
      });
    }

    const e164Phone = validation.e164;

    // 1. Check User and Companion records in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { phone: e164Phone },
      include: {
        companion: {
          include: { city: true },
        },
      },
    });

    // 2. Check HostApplication for pending or submitted review
    const hostApp = await prisma.hostApplication.findFirst({
      where: { phone: e164Phone },
      orderBy: { createdAt: "desc" },
    });

    const hasCompanion = Boolean(user?.companion);
    const hasHostApp = Boolean(hostApp);

    let hostStatus: "approved" | "pending" | "rejected" | "none" = "none";
    let hostDisplayName: string | null = null;
    let hourlyRate: number | null = null;

    if (hasCompanion && user?.companion) {
      hostStatus = "approved";
      hostDisplayName = user.companion.displayName;
      hourlyRate = Number(user.companion.hourlyRate);
    } else if (hasHostApp && hostApp) {
      const screening = hostApp.screeningStatus.toLowerCase();
      if (screening === "approved") {
        hostStatus = "approved";
      } else if (screening === "rejected") {
        hostStatus = "rejected";
      } else {
        hostStatus = "pending";
      }
      hostDisplayName = hostApp.fullName;
    }

    const hasMemberProfile = Boolean(user);
    const suggestedRole = hasCompanion ? "host" : "member";

    return NextResponse.json({
      success: true,
      exists: Boolean(user || hostApp),
      phone: e164Phone,
      hasHostProfile: hasCompanion,
      hostStatus,
      hostDisplayName,
      hourlyRate,
      hasMemberProfile,
      memberName: user?.name || null,
      suggestedRole,
    });
  } catch (error) {
    console.error("[PROFILE CHECK ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check profile." },
      { status: 500 }
    );
  }
}
