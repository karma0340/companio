import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    platformFeeRate: 0.30,
    hostPayoutRate: 0.70,
    gstIncludedInPlatformShare: true,
    standardHourlyRates: [399, 499, 599, 799, 999, 1299],
    currency: "INR",
  });
}
