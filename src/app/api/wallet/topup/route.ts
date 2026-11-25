import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { calculateTopupBonus, creditCoins, getWalletDetails } from "@/lib/wallet";
import { createRazorpayOrder, isRazorpayConfigured, getRazorpayKeyId, verifyRazorpaySignature } from "@/lib/razorpay";
import { CoinTransactionType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Please sign in to top up coins." }, { status: 401 });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!userExists) {
      return NextResponse.json({ success: false, error: "Account not found. Please sign in again." }, { status: 401 });
    }

    const body = await req.json();
    const { action, amount, isSimulation, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 10) {
      return NextResponse.json({ success: false, error: "Minimum top-up amount is INR 10." }, { status: 400 });
    }

    // Determine if user has prior top-ups
    const priorTopups = await prisma.coinTransaction.count({
      where: {
        userId,
        type: CoinTransactionType.TOPUP,
      },
    });
    const isFirstTopup = priorTopups === 0;
    const bonus = calculateTopupBonus(numAmount, isFirstTopup);

    // 1. Order Creation
    if (action === "create-order") {
      const amountInPaise = Math.round(numAmount * 100);
      const receipt = `topup_${userId.substring(0, 8)}_${Date.now()}`;
      const order = await createRazorpayOrder(amountInPaise, "INR", receipt, {
        userId,
        type: "COIN_TOPUP",
        baseCoins: String(bonus.baseCoins),
        bonusCoins: String(bonus.bonusCoins),
      });

      return NextResponse.json({
        success: true,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: getRazorpayKeyId(),
        isMock: order.isMock,
        bonus,
      });
    }

    // 2. Direct Simulation (Strictly disabled - coins require real payment)
    if (action === "simulate" || isSimulation) {
      return NextResponse.json(
        { success: false, error: "Direct simulation disabled. Real payment verification via Razorpay required." },
        { status: 403 }
      );
    }

    // 3. Razorpay Signature Verification
    if (action === "verify") {
      const verification = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      if (!verification.isValid) {
        return NextResponse.json(
          { success: false, error: verification.reason || "Payment signature verification failed." },
          { status: 400 }
        );
      }

      if (razorpayPaymentId) {
        const existingTx = await prisma.coinTransaction.findFirst({
          where: { referenceId: razorpayPaymentId },
        });
        if (existingTx) {
          const updatedWallet = await getWalletDetails(userId);
          return NextResponse.json({
            success: true,
            wallet: updatedWallet,
            bonus,
          });
        }
      }

      // Credit base coins
      await creditCoins({
        userId,
        amount: bonus.baseCoins,
        type: CoinTransactionType.TOPUP,
        description: `Wallet top-up (INR ${numAmount})`,
        referenceId: razorpayPaymentId || `pay_${Date.now()}`,
      });

      // Credit bonus coins if applicable
      if (bonus.bonusCoins > 0) {
        await creditCoins({
          userId,
          amount: bonus.bonusCoins,
          type: CoinTransactionType.TOPUP_BONUS,
          description: bonus.label || `Top-up bonus (+${bonus.bonusPercent}%)`,
          referenceId: `bonus_${razorpayPaymentId || Date.now()}`,
        });
      }

      const updatedWallet = await getWalletDetails(userId);
      return NextResponse.json({
        success: true,
        wallet: updatedWallet,
        bonus,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("[WALLET_TOPUP_ERROR]:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
