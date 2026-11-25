import { prisma } from "@/lib/prisma";
import {
  isValidUpiId,
  isRazorpayConfigured,
  isRazorpayXConfigured,
  ensureRazorpayXContactAndUpiFundAccount,
  createRazorpayXUpiPayout,
  fetchRazorpayPaymentDetails,
} from "@/lib/razorpay";
import { PaymentGateway, TransactionStatus } from "@prisma/client";

export const SETTLEMENT_HOLD_DAYS = 2;
export const SETTLEMENT_HOLD_MS = SETTLEMENT_HOLD_DAYS * 24 * 60 * 60 * 1000;

export interface PendingSettlementItem {
  transactionId: string;
  bookingNumber: string;
  amount: number;
  creditedAt: string;
  unlocksAt: string;
  tPlus2Elapsed: boolean;
  razorpaySettled: boolean;
  reason: string;
}

export interface HostWalletSummary {
  walletBalance: number;
  withdrawableBalance: number;
  pendingSettlementBalance: number;
  nextUnlockAt: string | null;
  pendingCredits: PendingSettlementItem[];
}

function roundInr(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Computes withdrawable vs T+2 settlement-locked Host cash balance.
 * Money is only withdrawable when:
 * 1. The meetup booking was accepted & completed (RELEASED_TO_HOST), AND
 * 2. At least 2 days (48h T+2 clearing window) have passed since earning credit, AND
 * 3. For live Razorpay payments (pay_*), Razorpay has released settlement (settlement_id present).
 */
export async function getHostWalletSummary(userId: string): Promise<HostWalletSummary> {
  const [user, payoutCredits, cashoutTxs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        type: "HOST_PAYOUT",
        status: "SUCCESS",
      },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            status: true,
            escrowStatus: true,
            razorpayPaymentId: true,
            sessionEndedAt: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        type: "WALLET_CASHOUT",
        status: { in: ["SUCCESS", "PENDING"] },
      },
      select: { amount: true, netAmount: true },
    }),
  ]);

  const totalWalletLedger = Math.max(0, roundInr(Number(user?.walletBalance || 0)));
  const rzpEnabled = isRazorpayConfigured();
  const nowMs = Date.now();

  const evaluated = await Promise.all(
    payoutCredits.map(async (tx) => {
      const amount = roundInr(Number(tx.netAmount || tx.amount || 0));
      const b = tx.booking;

      // Must belong to an accepted & completed meetup released to host
      const isCompletedRelease = b
        ? b.status === "COMPLETED" && b.escrowStatus === "RELEASED_TO_HOST"
        : true;

      if (!isCompletedRelease || amount <= 0) {
        return {
          amount: 0,
          withdrawable: false,
          pendingItem: null as PendingSettlementItem | null,
        };
      }

      const creditedDate = b?.sessionEndedAt || tx.createdAt;
      const unlocksAtDate = new Date(creditedDate.getTime() + SETTLEMENT_HOLD_MS);
      const tPlus2Elapsed = nowMs >= unlocksAtDate.getTime();

      let razorpaySettled = true;
      const paymentId = (b?.razorpayPaymentId || "").trim();
      if (rzpEnabled && paymentId.startsWith("pay_")) {
        const paymentCheck = await fetchRazorpayPaymentDetails(paymentId);
        razorpaySettled = Boolean(paymentCheck.success && paymentCheck.settled);
      }

      const isReleased = tPlus2Elapsed && razorpaySettled;
      let reason = "Settled & ready to withdraw";
      if (!tPlus2Elapsed && !razorpaySettled) {
        reason = "In 2-day (T+2) & Razorpay settlement hold";
      } else if (!tPlus2Elapsed) {
        reason = "Available to withdraw 2 days after meetup completion";
      } else if (!razorpaySettled) {
        reason = "Waiting for Razorpay to release settlement funds";
      }

      return {
        amount,
        withdrawable: isReleased,
        pendingItem: isReleased
          ? null
          : {
              transactionId: tx.id,
              bookingNumber: b?.bookingNumber || tx.id.slice(-8).toUpperCase(),
              amount,
              creditedAt: creditedDate.toISOString(),
              unlocksAt: unlocksAtDate.toISOString(),
              tPlus2Elapsed,
              razorpaySettled,
              reason,
            },
      };
    })
  );

  let totalEligibleCredits = 0;
  let settledCreditsTotal = 0;
  const pendingCredits: PendingSettlementItem[] = [];

  for (const row of evaluated) {
    totalEligibleCredits += row.amount;
    if (row.withdrawable) {
      settledCreditsTotal += row.amount;
    } else if (row.pendingItem) {
      pendingCredits.push(row.pendingItem);
    }
  }

  const totalCashouts = cashoutTxs.reduce(
    (sum, t) => sum + roundInr(Number(t.netAmount || t.amount || 0)),
    0
  );

  const pendingSettlementBalance = Math.max(0, roundInr(totalEligibleCredits - settledCreditsTotal));
  const netCreditsOutstanding = Math.max(0, roundInr(totalEligibleCredits - totalCashouts));
  const legacyDirectBalance = Math.max(0, roundInr(totalWalletLedger - netCreditsOutstanding));
  const withdrawableBalance = Math.max(
    0,
    Math.min(
      totalWalletLedger,
      roundInr(settledCreditsTotal + legacyDirectBalance - totalCashouts)
    )
  );

  const sortedUnlocks = pendingCredits
    .map((p) => p.unlocksAt)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return {
    walletBalance: totalWalletLedger,
    withdrawableBalance,
    pendingSettlementBalance,
    nextUnlockAt: sortedUnlocks[0] || null,
    pendingCredits,
  };
}

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

  const walletSummary = await getHostWalletSummary(params.userId);
  if (amountInr > walletSummary.withdrawableBalance) {
    if (walletSummary.pendingSettlementBalance > 0) {
      const unlockText = walletSummary.nextUnlockAt
        ? new Date(walletSummary.nextUnlockAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata",
          })
        : "in 2 days";
      return {
        success: false,
        gateway: "WALLET",
        status: "FAILED",
        recipientUpiId: cleanUpi,
        error: `Funds are still in Razorpay's T+2 settlement hold (unlocks after 2 days on ${unlockText} once Razorpay releases settlement). Withdrawable now: INR ${walletSummary.withdrawableBalance.toFixed(2)}.`,
      };
    }
    return {
      success: false,
      gateway: "WALLET",
      status: "FAILED",
      recipientUpiId: cleanUpi,
      error: `Insufficient withdrawable balance. Available: INR ${walletSummary.withdrawableBalance.toFixed(2)}.`,
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
