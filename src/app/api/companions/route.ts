import { NextRequest, NextResponse } from "next/server";
import { getCompanionsPaginated } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || undefined;
    const activity = searchParams.get("activity") || undefined;
    const freeToday = searchParams.get("freeToday") === "true";
    const weekendOnly = searchParams.get("weekendOnly") === "true";
    const womenOnly = searchParams.get("womenOnly") === "true";
    const genderParam = (searchParams.get("gender") || "").toLowerCase();
    const gender =
      genderParam === "female" || genderParam === "male" || genderParam === "all"
        ? (genderParam as "female" | "male" | "all")
        : undefined;
    const q = searchParams.get("q") || undefined;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "12");

    const result = await getCompanionsPaginated({
      city,
      activity,
      freeToday,
      weekendOnly,
      womenOnly,
      gender,
      q,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      companions: result.companions,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasMore: result.hasMore,
      cityCounts: result.cityCounts,
    });
  } catch (error) {
    console.error("[GET /api/companions ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load companions" },
      { status: 500 }
    );
  }
}
