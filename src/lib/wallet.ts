import prisma from "@/lib/prisma";
import { CoinTransactionType, HostLevel } from "@prisma/client";

export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars I, O, 0, 1
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface BonusCalculation {
  baseCoins: number;
  bonusCoins: number;
  totalCoins: number;
  bonusPercent: number;
  label: string;
}

export function calculateTopupBonus(amount: number, isFirstTopup = false): BonusCalculation {
  const baseCoins = Math.floor(amount); // 1 Coin = INR 1
  let bonusCoins = 0;
  let bonusPercent = 0;
  let label = "";

  if (isFirstTopup && amount >= 100) {
    bonusPercent = 20;
    bonusCoins = Math.min(100, Math.floor(amount * 0.20));
    label = "First top-up: +20% (up to 100) on INR 100+";
  } else if (amount >= 1000) {
    bonusPercent = 10;
    bonusCoins = Math.floor(amount * 0.10);
    label = "INR 1,000+: +10% bonus";
  } else if (amount >= 500) {
    bonusPercent = 5;
    bonusCoins = Math.floor(amount * 0.05);
    label = "INR 500+: +5% bonus";
  }

  return {
    baseCoins,
    bonusCoins,
    totalCoins: baseCoins + bonusCoins,
    bonusPercent,
    label,
  };
}

export async function ensureUserWallet(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        coinBalance: true,
        referralCode: true,
        coinTransactions: {
          where: { type: CoinTransactionType.WELCOME_CREDIT },
          take: 1,
        },
      },
    });

    if (!user) return null;

    let updatedReferralCode = user.referralCode;
    if (!updatedReferralCode) {
      let code = generateReferralCode();
      let exists = await prisma.user.findUnique({ where: { referralCode: code } });
      while (exists) {
        code = generateReferralCode();
        exists = await prisma.user.findUnique({ where: { referralCode: code } });
      }
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
      updatedReferralCode = code;
    }

    // Ensure welcome credit ledger entry exists if user has coins
    if (user.coinTransactions.length === 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            coinBalance: { increment: user.coinBalance === 0 ? 100 : 0 },
            creditBalance: 100,
          },
        }),
        prisma.coinTransaction.create({
          data: {
            userId,
            type: CoinTransactionType.WELCOME_CREDIT,
            amount: 100,
            balanceAfter: Math.max(100, user.coinBalance),
            description: "Welcome credit, for meetups & chats",
          },
        }),
      ]);
    }

    return {
      userId,
      referralCode: updatedReferralCode,
    };
  } catch (error) {
    console.error("[ENSURE_WALLET_ERROR]:", error);
    return null;
  }
}

export async function getWalletDetails(userId: string) {
  await ensureUserWallet(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      phone: true,
      name: true,
      role: true,
      coinBalance: true,
      creditBalance: true,
      walletBalance: true,
      referralCode: true,
      coinTransactions: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!user) return null;

  // Count referral stats
  const [signedUpCount, completedMeetupsCount] = await Promise.all([
    prisma.user.count({
      where: { referredById: user.id },
    }),
    prisma.booking.count({
      where: {
        member: { referredById: user.id },
        status: "COMPLETED",
      },
    }),
  ]);

  const referralEarnings = completedMeetupsCount * 100;

  // Check if first topup
  const topupCount = await prisma.coinTransaction.count({
    where: {
      userId,
      type: CoinTransactionType.TOPUP,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      name: user.name,
      role: user.role,
      coinBalance: user.coinBalance,
      creditBalance: Number(user.creditBalance),
      moneyBalance: Number(user.walletBalance),
      referralCode: user.referralCode,
    },
    referral: {
      code: user.referralCode,
      signedUp: signedUpCount,
      completed: completedMeetupsCount,
      earned: referralEarnings,
    },
    isFirstTopup: topupCount === 0,
    transactions: user.coinTransactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      balanceAfter: tx.balanceAfter,
      description: tx.description,
      createdAt: tx.createdAt.toISOString(),
      referenceId: tx.referenceId,
    })),
  };
}

export async function creditCoins(params: {
  userId: string;
  amount: number;
  type: CoinTransactionType;
  description: string;
  referenceId?: string;
}) {
  const { userId, amount, type, description, referenceId } = params;

  return await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        coinBalance: { increment: amount },
      },
      select: { coinBalance: true },
    });

    const transaction = await tx.coinTransaction.create({
      data: {
        userId,
        type,
        amount,
        balanceAfter: updatedUser.coinBalance,
        description,
        referenceId,
      },
    });

    return {
      newBalance: updatedUser.coinBalance,
      transaction,
    };
  });
}

export async function debitCoins(params: {
  userId: string;
  amount: number;
  type: CoinTransactionType;
  description: string;
  referenceId?: string;
}) {
  const { userId, amount, type, description, referenceId } = params;

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { coinBalance: true },
    });

    if (!user || user.coinBalance < amount) {
      throw new Error(`Insufficient coins. Balance is ${user?.coinBalance ?? 0}, required ${amount}.`);
    }

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        coinBalance: { decrement: amount },
      },
      select: { coinBalance: true },
    });

    const transaction = await tx.coinTransaction.create({
      data: {
        userId,
        type,
        amount: -Math.abs(amount),
        balanceAfter: updatedUser.coinBalance,
        description,
        referenceId,
      },
    });

    return {
      newBalance: updatedUser.coinBalance,
      transaction,
    };
  });
}

export function getHostCommissionRate(level: HostLevel): {
  platformCommissionPercent: number;
  hostCutPercent: number;
} {
  switch (level) {
    case HostLevel.TOP:
      return { platformCommissionPercent: 5, hostCutPercent: 95 };
    case HostLevel.RISING:
      return { platformCommissionPercent: 7, hostCutPercent: 93 };
    case HostLevel.NEW:
    default:
      return { platformCommissionPercent: 10, hostCutPercent: 90 };
  }
}
