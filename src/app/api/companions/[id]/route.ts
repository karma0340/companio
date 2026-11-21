import { NextRequest, NextResponse } from "next/server";
import { getCompanionById } from "@/lib/data";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companion = await getCompanionById(params.id);
    if (!companion) {
      return NextResponse.json(
        { success: false, error: "Companion not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      companion,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch companion" },
      { status: 500 }
    );
  }
}
