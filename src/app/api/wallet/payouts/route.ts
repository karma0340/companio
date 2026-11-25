import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { isRazorpayXConfigured } from "@/lib/razorpay";
import { dispatchHostUpiPayout, getHostWalletSummary } from "@/lib/payouts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [walletSummary, companion, transactions] = await Promise.all([
      getHostWalletSummary(session.userId),
      prisma.companion.findFirst({
        where: { userId: session.userId },
        select: { upiId: true, upiVerified: true },
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
      walletBalance: walletSummary.walletBalance,
      withdrawableBalance: walletSummary.withdrawableBalance,
      pendingSettlementBalance: walletSummary.pendingSettlementBalance,
      nextUnlockAt: walletSummary.nextUnlockAt,
      pendingCredits: walletSummary.pendingCredits,
      upiId: companion?.upiId || "",
      upiVerified: Boolean(companion?.upiVerified),
      razorpayXConfigured: isRazorpayXConfigured(),
      payouts: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.netAmount || t.amount),
        utr: t.gatewayTransactionId || t.id.slice(-10).toUpperCase(),
        recipientUpiId: t.recipientUpiId || companion?.upiId || "",
        failureReason: t.failureReason || null,
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

    if (isNaN(requestedAmount) || requestedAmount < 100) {
      return NextResponse.json(
        { success: false, error: "Minimum withdrawal amount is INR 100." },
        { status: 400 }
      );
    }

    const result = await dispatchHostUpiPayout({
      userId: session.userId,
      amountInr: requestedAmount,
      upiId,
      narration: "Meetzy Host Payout",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to process wallet payout.",
          newWalletBalance: result.newWalletBalance,
        },
        { status: 400 }
      );
    }

    const statusMsg =
      result.status === "SUCCESS"
        ? `INR ${requestedAmount.toFixed(2)} sent to ${result.recipientUpiId} (UTR: ${result.utr}).`
        : result.gateway === "RAZORPAY"
        ? `RazorpayX UPI transfer of INR ${requestedAmount.toFixed(2)} initiated to ${result.recipientUpiId} (Ref: ${result.utr}).`
        : `Withdrawal request of INR ${requestedAmount.toFixed(2)} queued for ${result.recipientUpiId} (Ref: ${result.utr}).`;

    return NextResponse.json({
      success: true,
      message: statusMsg,
      newWalletBalance: result.newWalletBalance,
      payout: {
        id: result.transactionId,
        type: "WALLET_CASHOUT",
        amount: requestedAmount,
        upiId: result.recipientUpiId,
        recipientUpiId: result.recipientUpiId,
        utr: result.utr,
        gateway: result.gateway,
        status: result.status,
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
