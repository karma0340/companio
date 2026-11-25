import { NextResponse } from "next/server";
import { HOST_REGISTRATION_FEE, PASS_TIER_OPTIONS } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    success: true,
    passTiers: PASS_TIER_OPTIONS,
    hourlyRange: { min: 399, max: 1299, default: 499 },
    hostShareRate: 0.7,
    platformFeeRate: 0.3,
    gstIncludedInPlatformShare: true,
    chatCoinCostPerMessage: 10,
    hostRegistrationFee: HOST_REGISTRATION_FEE,
    currency: "INR",
  });
}
