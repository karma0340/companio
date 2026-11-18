import { NextResponse } from "next/server";
import { PASS_TIER_OPTIONS } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    success: true,
    passTiers: PASS_TIER_OPTIONS,
    hourlyRange: { min: 299, max: 999, default: 499 },
    platformFeeRate: 0.25,
    gstRate: 0.18,
    currency: "INR",
  });
}
