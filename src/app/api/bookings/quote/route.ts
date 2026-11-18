import { NextRequest, NextResponse } from "next/server";
import { calculateEscrowBreakdown } from "@/lib/escrow";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const companionId = body.companionId || "comp_01";
    const hours = Math.max(1, Number(body.hours || 1));
    const hourlyRate = Number(body.hourlyRate || 499.00);

    const feeCalculation = calculateEscrowBreakdown(hourlyRate, hours);

    return NextResponse.json({
      success: true,
      quote: {
        companionId,
        hours,
        baseCompanionFee: feeCalculation.companionFee,
        platformFee: feeCalculation.platformFee,
        gstAmount: feeCalculation.gstAmount,
        totalAmount: feeCalculation.totalAmount,
        currency: "INR",
        breakdownText: `Base: ₹${feeCalculation.companionFee.toFixed(2)} + Platform Fee: ₹${feeCalculation.platformFee.toFixed(2)} + GST: ₹${feeCalculation.gstAmount.toFixed(2)} = ₹${feeCalculation.totalAmount.toFixed(2)}`,
      },
    });
  } catch (error) {
    console.error("[BOOKING QUOTE API ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate booking quote" },
      { status: 500 }
    );
  }
}
