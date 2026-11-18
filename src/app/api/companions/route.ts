import { NextRequest, NextResponse } from "next/server";
import { getCompanions } from "@/lib/data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || undefined;
    const activity = searchParams.get("activity") || undefined;

    const list = await getCompanions(city, activity);

    return NextResponse.json({
      success: true,
      companions: list,
      total: list.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch companions" },
      { status: 500 }
    );
  }
}
