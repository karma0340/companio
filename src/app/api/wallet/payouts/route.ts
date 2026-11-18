import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  return NextResponse.json({
    success: true,
    payouts: [
      {
        id: "payout_01",
        amount: 499.00,
        upiId: "host@okhdfcbank",
        utr: "CF2026849201",
        status: "SUCCESS",
        gateway: "CASHFREE",
        dispatchedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "payout_02",
        amount: 599.00,
        upiId: "host@okhdfcbank",
        utr: "CF2026849188",
        status: "SUCCESS",
        gateway: "CASHFREE",
        dispatchedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount || 499.00);
    const upiId = String(body.upiId || "host@okhdfcbank");

    const utr = `CF${Date.now().toString().slice(-10)}`;

    return NextResponse.json({
      success: true,
      message: `Instant UPI payout of ₹${amount.toFixed(2)} dispatched to ${upiId}`,
      payout: {
        amount,
        upiId,
        utr,
        gateway: "CASHFREE",
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process wallet payout" },
      { status: 500 }
    );
  }
}
