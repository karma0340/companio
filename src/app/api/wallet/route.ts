import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  
  return NextResponse.json({
    success: true,
    wallet: {
      userId: session?.userId || "user_companion_01",
      balance: 1497.00,
      currency: "INR",
      pendingEscrow: 706.00,
      availableForWithdrawal: 1497.00,
      defaultUpiId: "host@okhdfcbank",
    },
  });
}
