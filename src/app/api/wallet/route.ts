import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getWalletDetails } from "@/lib/wallet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to view your wallet." },
        { status: 401 }
      );
    }

    const details = await getWalletDetails(userId);
    if (!details) {
      return NextResponse.json(
        { success: false, error: "Wallet not found for your account." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      wallet: details,
    });
  } catch (error) {
    console.error("[WALLET_API_GET_ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching wallet" },
      { status: 500 }
    );
  }
}
