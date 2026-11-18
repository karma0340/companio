import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    platformFeeRate: 0.25,
    hostPayoutRate: 0.85,
    gstRate: 0.18,
    standardHourlyRates: [299, 499, 599, 699, 999],
    applicationFee: 99.50,
    currency: "INR",
  });
}
