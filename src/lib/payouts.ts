import { prisma } from "@/lib/prisma";
import {
  isValidUpiId,
  isRazorpayXConfigured,
  ensureRazorpayXContactAndUpiFundAccount,
  createRazorpayXUpiPayout,
} from "@/lib/razorpay";
import { PaymentGateway, TransactionStatus } from "@prisma/client";

export interface DispatchUpiPayoutParams {
  userId: string;
  amountInr: number;
  upiId: string;
  bookingId?: string | null;
  narration?: string;
}

export interface DispatchUpiPayoutResult {
  success: boolean;
  transactionId?: string;
  payoutId?: string;
  utr?: string;
  gateway: "RAZORPAY" | "WALLET";
  status: "SUCCESS" | "PENDING" | "FAILED";
  newWalletBalance?: number;
  recipientUpiId: string;
  createdAt?: string;
  error?: string;
}

/**
 * Atomically debits Host's walletBalance and dispatches a real RazorpayX UPI payout
 * when RAZORPAYX_ACCOUNT_NUMBER is configured (otherwise queues PENDING withdrawal).
 * Automatically restores walletBalance if the RazorpayX payout fails synchronously.
 */
export async function dispatchHostUpiPayout(
  params: DispatchUpiPayoutParams
): Promise<DispatchUpiPayoutResult> {
  const cleanUpi = params.upiId.trim();
  const amountInr = Math.round(Number(params.amountInr) * 100) / 100;

  if (!isValidUpiId(cleanUpi)) {
    return {
      success: false,
      gateway: "WALLET",
      status: "FAILED",
      recipientUpiId: cleanUpi,
      error: "Please enter a valid UPI ID (e.g. yourname@okaxis or mobile@ybl).",
    };
  }

  if (!Number.isFinite(amountInr) || amountInr <= 0) {
    return {
      success: false,
      gateway: "WALLET",
      status: "FAILED",
      recipientUpiId: cleanUpi,
      error: "Payout amount must be greater than INR 0.",
    };
  }

  const rzpXActive = isRazorpayXConfigured();
  const queueRef = `MTZQUE${Date.now().toString().slice(-8)}`;

  // 1. Atomic conditional debit + PENDING cashout row inside PostgreSQL transaction
  const debitRes = await prisma.$transaction(async (tx) => {
    const debited = await tx.user.updateMany({
      where: {
        id: params.userId,
        walletBalance: { gte: amountInr },
      },
      data: {
        walletBalance: { decrement: amountInr },
      },
    });

    if (debited.count === 0) {
      const current = await tx.user.findUnique({
        where: { id: params.userId },
        select: { walletBalance: true },
      });
      const available = Number(current?.walletBalance || 0);
      throw new Error(`Insufficient earnings balance. Available: INR ${available.toFixed(2)}`);
    }

    const updatedUser = await tx.user.findUnique({
      where: { id: params.userId },
      select: { walletBalance: true, name: true, email: true, phone: true },
    });

    const companion = await tx.companion.findFirst({
      where: { userId: params.userId },
      select: {
        id: true,
        displayName: true,
        upiId: true,
        razorpayContactId: true,
        razorpayFundAccountId: true,
      },
    });

    const upiChanged = companion && companion.upiId !== cleanUpi;
    if (companion) {
      await tx.companion.update({
        where: { id: companion.id },
        data: {
          upiId: cleanUpi,
          ...(upiChanged ? { razorpayFundAccountId: null, upiVerified: false } : {}),
        },
      });
    }

    const cashoutTx = await tx.transaction.create({
      data: {
        userId: params.userId,
        bookingId: params.bookingId || null,
        type: "WALLET_CASHOUT",
        amount: amountInr,
        feeAmount: 0,
        netAmount: amountInr,
        gateway: rzpXActive ? PaymentGateway.RAZORPAY : PaymentGateway.WALLET,
        gatewayTransactionId: queueRef,
        recipientUpiId: cleanUpi,
        status: TransactionStatus.PENDING,
      },
    });

    return {
      cashoutTxId: cashoutTx.id,
      createdAt: cashoutTx.createdAt.toISOString(),
      newBalance: Number(updatedUser?.walletBalance || 0),
      userName: companion?.displayName || updatedUser?.name || "Meetzy Host",
      userEmail: updatedUser?.email || null,
      userPhone: updatedUser?.phone || null,
      companionId: companion?.id || null,
      existingContactId: companion?.razorpayContactId || null,
      existingFundAccountId: upiChanged ? null : companion?.razorpayFundAccountId || null,
    };
  });

  // 2. If RazorpayX is not configured yet, return cleanly as PENDING settlement request
  if (!rzpXActive) {
    return {
      success: true,
      transactionId: debitRes.cashoutTxId,
      utr: queueRef,
      gateway: "WALLET",
      status: "PENDING",
      newWalletBalance: debitRes.newBalance,
      recipientUpiId: cleanUpi,
      createdAt: debitRes.createdAt,
    };
  }

  // 3. Dispatch real INR payout via RazorpayX
  const faSetup = await ensureRazorpayXContactAndUpiFundAccount({
    userId: params.userId,
    name: debitRes.userName,
    email: debitRes.userEmail,
    phone: debitRes.userPhone,
    upiId: cleanUpi,
    existingContactId: debitRes.existingContactId,
    existingFundAccountId: debitRes.existingFundAccountId,
  });

  if (debitRes.companionId && (faSetup.contactId || faSetup.fundAccountId)) {
    await prisma.companion
      .update({
        where: { id: debitRes.companionId },
        data: {
          ...(faSetup.contactId ? { razorpayContactId: faSetup.contactId } : {}),
          ...(faSetup.fundAccountId ? { razorpayFundAccountId: faSetup.fundAccountId } : {}),
        },
      })
      .catch(() => {});
  }

  if (!faSetup.success || !faSetup.fundAccountId) {
    // Compensate: refund debited balance back to Host Wallet
    const refunded = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: params.userId },
        data: { walletBalance: { increment: amountInr } },
        select: { walletBalance: true },
      });
      await tx.transaction.update({
        where: { id: debitRes.cashoutTxId },
        data: {
          status: TransactionStatus.FAILED,
          failureReason: faSetup.error || "UPI fund account setup failed",
        },
      });
      return Number(u.walletBalance);
    });

    return {
      success: false,
      transactionId: debitRes.cashoutTxId,
      gateway: "RAZORPAY",
      status: "FAILED",
      newWalletBalance: refunded,
      recipientUpiId: cleanUpi,
      error: faSetup.error || "Failed to register Host UPI on RazorpayX.",
    };
  }

  const payoutRes = await createRazorpayXUpiPayout({
    fundAccountId: faSetup.fundAccountId,
    amountInPaise: Math.round(amountInr * 100),
    referenceId: debitRes.cashoutTxId,
    narration: params.narration || "Meetzy Host 70pct Payout",
    idempotencyKey: debitRes.cashoutTxId,
    notes: {
      userId: params.userId,
      transactionId: debitRes.cashoutTxId,
      ...(params.bookingId ? { bookingId: params.bookingId } : {}),
      upiId: cleanUpi,
    },
  });

  if (!payoutRes.success || payoutRes.status === "FAILED") {
    const refunded = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: params.userId },
        data: { walletBalance: { increment: amountInr } },
        select: { walletBalance: true },
      });
      await tx.transaction.update({
        where: { id: debitRes.cashoutTxId },
        data: {
          ...(payoutRes.payoutId ? { gatewayTransactionId: payoutRes.payoutId } : {}),
          status: TransactionStatus.FAILED,
          failureReason: payoutRes.error || "RazorpayX payout failed",
        },
      });
      return Number(u.walletBalance);
    });

    return {
      success: false,
      transactionId: debitRes.cashoutTxId,
      gateway: "RAZORPAY",
      status: "FAILED",
      newWalletBalance: refunded,
      recipientUpiId: cleanUpi,
      error: payoutRes.error || "RazorpayX UPI transfer could not be completed.",
    };
  }

  const finalStatus =
    payoutRes.status === "SUCCESS" ? TransactionStatus.SUCCESS : TransactionStatus.PENDING;

  await prisma.transaction.update({
    where: { id: debitRes.cashoutTxId },
    data: {
      gatewayTransactionId: payoutRes.payoutId || payoutRes.utr || queueRef,
      status: finalStatus,
    },
  });

  if (finalStatus === TransactionStatus.SUCCESS && debitRes.companionId) {
    await prisma.companion
      .update({
        where: { id: debitRes.companionId },
        data: { upiVerified: true },
      })
      .catch(() => {});
  }

  return {
    success: true,
    transactionId: debitRes.cashoutTxId,
    payoutId: payoutRes.payoutId,
    utr: payoutRes.utr || payoutRes.payoutId || queueRef,
    gateway: "RAZORPAY",
    status: finalStatus === TransactionStatus.SUCCESS ? "SUCCESS" : "PENDING",
    newWalletBalance: debitRes.newBalance,
    recipientUpiId: cleanUpi,
    createdAt: debitRes.createdAt,
  };
}
