import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [user, companion, transactions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.userId },
        select: { walletBalance: true },
      }),
      prisma.companion.findFirst({
        where: { userId: session.userId },
        select: { upiId: true },
      }),
      prisma.transaction.findMany({
        where: {
          userId: session.userId,
          type: { in: ["HOST_PAYOUT", "WALLET_CASHOUT"] },
        },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
    ]);

    return NextResponse.json({
      success: true,
      walletBalance: Number(user?.walletBalance || 0),
      upiId: companion?.upiId || "",
      payouts: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.netAmount || t.amount),
        utr: t.gatewayTransactionId || t.id.slice(-10).toUpperCase(),
        status: t.status,
        gateway: t.gateway,
        dispatchedAt: t.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[WALLET PAYOUTS GET ERROR]:", error);
    return NextResponse.json({ success: false, error: "Failed to load payout history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const requestedAmount = Number(body.amount || 0);
    const upiId = String(body.upiId || "").trim();

    if (!upiId || !upiId.includes("@") || upiId.length < 5) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid UPI ID (e.g. yourname@okaxis)." },
        { status: 400 }
      );
    }

    if (isNaN(requestedAmount) || requestedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Withdrawal amount must be greater than INR 0." },
        { status: 400 }
      );
    }

    const utr = `MTZUPI${Date.now().toString().slice(-8)}`;

    const result = await prisma.$transaction(async (tx) => {
      const currentUser = await tx.user.findUnique({
        where: { id: session.userId },
        select: { walletBalance: true },
      });

      const available = Number(currentUser?.walletBalance || 0);
      if (requestedAmount > available) {
        throw new Error(`Insufficient earnings balance. Available: INR ${available.toFixed(2)}`);
      }

      const updatedUser = await tx.user.update({
        where: { id: session.userId },
        data: {
          walletBalance: { decrement: requestedAmount },
        },
        select: { walletBalance: true },
      });

      const companion = await tx.companion.findFirst({
        where: { userId: session.userId },
        select: { id: true },
      });
      if (companion) {
        await tx.companion.update({
          where: { id: companion.id },
          data: { upiId },
        });
      }

      const cashoutTx = await tx.transaction.create({
        data: {
          userId: session.userId,
          type: "WALLET_CASHOUT",
          amount: requestedAmount,
          feeAmount: 0,
          netAmount: requestedAmount,
          gateway: "WALLET",
          gatewayTransactionId: utr,
          status: "SUCCESS",
        },
      });

      return {
        newBalance: Number(updatedUser.walletBalance),
        txId: cashoutTx.id,
        createdAt: cashoutTx.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal of INR ${requestedAmount.toFixed(2)} queued to ${upiId} (Ref: ${utr}).`,
      newWalletBalance: result.newBalance,
      payout: {
        id: result.txId,
        type: "WALLET_CASHOUT",
        amount: requestedAmount,
        upiId,
        utr,
        gateway: "WALLET",
        status: "SUCCESS",
        dispatchedAt: result.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to process wallet payout" },
      { status: 400 }
    );
  }
}
