import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getWalletDetails } from "@/lib/wallet";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    let userId = session?.userId;

    // Verify session user exists in database
    if (userId) {
      const exists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!exists) {
        userId = undefined;
      }
    }

    if (!userId) {
      // Find latest user or first user for fallback
      const firstUser = await prisma.user.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if (firstUser) {
        userId = firstUser.id;
      }
    }

    if (!userId) {
      // If DB is completely empty, provision a default member
      const defaultUser = await prisma.user.create({
        data: {
          phone: "+919876543210",
          name: "Member",
          role: "MEMBER",
          coinBalance: 100,
          creditBalance: 100,
          referralCode: "COMPANIO",
        },
      });
      userId = defaultUser.id;
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
