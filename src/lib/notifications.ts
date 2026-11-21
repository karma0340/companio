import prisma from "@/lib/prisma";
import { CoinTransactionType } from "@prisma/client";

export interface AppNotification {
  id: string;
  type: "OFFER" | "ALERT" | "TRANSACTION" | "CHAT";
  title: string;
  message: string;
  badge?: string;
  badgeVariant?: "sunny" | "lime" | "pink" | "danger" | "purple";
  ctaText?: string;
  ctaUrl?: string;
  createdAt: string;
  isRead?: boolean;
}

export async function getUserNotifications(userId: string): Promise<{
  notifications: AppNotification[];
  offers: AppNotification[];
  unreadCount: number;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        coinBalance: true,
        referralCode: true,
        role: true,
        coinTransactions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        chatUnlocksInitiated: {
          where: {
            status: { in: ["ACTIVE", "HOST_RESPONDED"] },
            tier: "TWENTY_FOUR_HOURS",
          },
          include: {
            companion: { select: { displayName: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 2,
        },
      },
    });

    if (!user) {
      return { notifications: [], offers: [], unreadCount: 0 };
    }

    const notifications: AppNotification[] = [];
    const offers: AppNotification[] = [];

    // 1. Balance Alerts
    if (user.coinBalance < 70) {
      notifications.push({
        id: "alert_low_balance",
        type: "ALERT",
        title: user.coinBalance === 0 ? "Zero Coin Balance" : "Low Coin Balance",
        message:
          user.coinBalance === 0
            ? "You have 0 coins left. Top up your wallet to message companions or book meetups."
            : `You have ${user.coinBalance} coins remaining. Top up to unlock 24-hour companion chats (69 coins).`,
        badge: "Wallet Alert",
        badgeVariant: "danger",
        ctaText: "Top Up Coins →",
        ctaUrl: "/wallet",
        createdAt: new Date().toISOString(),
      });
    }

    // 2. Chat Expiration Alerts
    const now = new Date();
    user.chatUnlocksInitiated.forEach((unlock) => {
      if (unlock.expiresAt) {
        const msRemaining = new Date(unlock.expiresAt).getTime() - now.getTime();
        const hoursRemaining = msRemaining / (1000 * 60 * 60);

        if (msRemaining > 0 && hoursRemaining < 3) {
          notifications.push({
            id: `chat_expiring_${unlock.id}`,
            type: "CHAT",
            title: "Chat Pass Expiring Soon",
            message: `Your 24-hour pass with ${unlock.companion.displayName} expires in ${Math.round(hoursRemaining * 60)} minutes.`,
            badge: "Pass Alert",
            badgeVariant: "pink",
            ctaText: "Open Chat →",
            ctaUrl: "/bookings",
            createdAt: unlock.createdAt.toISOString(),
          });
        }
      }
    });

    // 3. Recent Transaction Notifications (Refunds, Welcome credits, etc.)
    user.coinTransactions.forEach((tx) => {
      if (tx.type === CoinTransactionType.CHAT_REFUND_TIMEOUT) {
        notifications.push({
          id: `tx_${tx.id}`,
          type: "TRANSACTION",
          title: "SLA Auto-Refund Processed",
          message: `69 coins refunded: The companion was unable to reply within 48 hours.`,
          badge: "Refunded",
          badgeVariant: "lime",
          ctaText: "View Wallet →",
          ctaUrl: "/wallet",
          createdAt: tx.createdAt.toISOString(),
        });
      } else if (tx.type === CoinTransactionType.REFERRAL_BONUS) {
        notifications.push({
          id: `tx_${tx.id}`,
          type: "TRANSACTION",
          title: "Referral Reward Credited!",
          message: `You received +100 bonus coins because a friend completed their meetup!`,
          badge: "+100 Coins",
          badgeVariant: "lime",
          ctaText: "Check Balance →",
          ctaUrl: "/wallet",
          createdAt: tx.createdAt.toISOString(),
        });
      }
    });

    // 3.5 Referral Connections Alert
    try {
      const recentReferrals = await prisma.user.findMany({
        where: { referredById: user.id },
        select: {
          id: true,
          name: true,
          createdAt: true,
          memberBookings: {
            where: { status: "COMPLETED" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      recentReferrals.forEach((ref) => {
        if (ref.memberBookings.length === 0) {
          notifications.push({
            id: `ref_joined_${ref.id}`,
            type: "ALERT",
            title: "New Friend Joined!",
            message: `${ref.name || "A friend"} joined made4togethr using your invite code! When they complete their first meetup, you will automatically get 100 coins.`,
            badge: "Invited",
            badgeVariant: "sunny",
            ctaText: "View Invites →",
            ctaUrl: "/wallet",
            createdAt: ref.createdAt.toISOString(),
          });
        }
      });
    } catch {}

    // 4. Promotional Offers
    const priorTopups = await prisma.coinTransaction.count({
      where: { userId, type: CoinTransactionType.TOPUP },
    });

    if (priorTopups === 0) {
      offers.push({
        id: "offer_first_topup",
        type: "OFFER",
        title: "First Top-Up Offer (+20% Bonus)",
        message: "Get +20% bonus coins (up to 100 extra) on your very first top-up of INR 100 or more!",
        badge: "Special Offer",
        badgeVariant: "sunny",
        ctaText: "Claim +20% Bonus →",
        ctaUrl: "/wallet",
        createdAt: new Date().toISOString(),
      });
    }

    offers.push({
      id: "offer_referral",
      type: "OFFER",
      title: "Earn 100 Coins Per Friend",
      message: `Share your invite code ${user.referralCode || "JOIN"}. When friends complete their first meetup, you get 100 coins!`,
      badge: "Refer & Earn",
      badgeVariant: "lime",
      ctaText: "View Referral Code →",
      ctaUrl: "/profile",
      createdAt: new Date().toISOString(),
    });

    const unreadCount = notifications.length + (priorTopups === 0 ? 1 : 0);

    return {
      notifications,
      offers,
      unreadCount,
    };
  } catch (error) {
    console.error("[GET_USER_NOTIFICATIONS_ERROR]:", error);
    return { notifications: [], offers: [], unreadCount: 0 };
  }
}
