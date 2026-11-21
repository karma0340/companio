import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getWalletDetails } from "@/lib/wallet";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    let userId = session?.userId;

    if (!userId) {
      // Find latest user or first user for dev demonstration if needed
      const firstUser = await prisma.user.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if (firstUser) {
        userId = firstUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    const details = await getWalletDetails(userId);
    if (!details) {
      return NextResponse.json({
        success: false,
        error: "Wallet not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      wallet: details,
    });
  } catch (error) {
    console.error("[WALLET_API_GET_ERROR]:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error fetching wallet",
    }, { status: 500 });
  }
}
