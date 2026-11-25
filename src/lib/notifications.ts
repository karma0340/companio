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
        companion: {
          select: { id: true, displayName: true },
        },
        coinTransactions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return { notifications: [], offers: [], unreadCount: 0 };
    }

    const notifications: AppNotification[] = [];
    const offers: AppNotification[] = [];

    // 1. Incoming Host Meetup Requests & Scheduled Meetups
    if (user.companion?.id) {
      const hostBookings = await prisma.booking.findMany({
        where: {
          companionId: user.companion.id,
          status: { in: ["PENDING_ACCEPTANCE", "CONFIRMED", "IN_PROGRESS"] },
        },
        include: {
          member: { select: { name: true } },
          activity: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      });

      for (const b of hostBookings) {
        const istDate = b.scheduledDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          timeZone: "Asia/Kolkata",
        });
        const istTime = b.scheduledDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });

        if (b.status === "PENDING_ACCEPTANCE") {
          notifications.push({
            id: `host_req_${b.id}`,
            type: "ALERT",
            title: `New Meetup Request from ${b.member?.name || "Member"}`,
            message: `${b.activity?.title || "Meetup"} at ${b.venueName} on ${istDate} (${istTime}) · Earn INR ${Number(b.companionFee).toFixed(0)}.`,
            badge: "Action Required",
            badgeVariant: "sunny",
            ctaText: "Accept / Decline →",
            ctaUrl: "/companion/dashboard",
            createdAt: b.createdAt.toISOString(),
          });
        } else {
          notifications.push({
            id: `host_active_${b.id}`,
            type: "CHAT",
            title: `${b.status === "IN_PROGRESS" ? "Meetup Live" : "Upcoming Confirmed Meetup"}`,
            message: `${b.activity?.title || "Meetup"} with ${b.member?.name || "Member"} at ${b.venueName} (${istDate}, ${istTime}).`,
            badge: b.status === "IN_PROGRESS" ? "Live Now" : "Confirmed",
            badgeVariant: "lime",
            ctaText: "Open Session / Chat →",
            ctaUrl: `/session/${b.id}`,
            createdAt: b.updatedAt.toISOString(),
          });
        }
      }
    }

    // 2. Member Confirmed / In-Progress Meetup Notifications
    const memberBookings = await prisma.booking.findMany({
      where: {
        memberId: userId,
        status: { in: ["CONFIRMED", "IN_PROGRESS"] },
      },
      include: {
        companion: { select: { displayName: true } },
        activity: { select: { title: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 4,
    });

    for (const b of memberBookings) {
      const istDate = b.scheduledDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        timeZone: "Asia/Kolkata",
      });
      notifications.push({
        id: `member_conf_${b.id}`,
        type: "CHAT",
        title: `${b.companion?.displayName || "Host"} accepted your meetup!`,
        message: `Chat is now open (10 Coins/msg) for ${b.activity?.title || "Meetup"} on ${istDate} at ${b.venueName}.`,
        badge: "Chat Open",
        badgeVariant: "lime",
        ctaText: "Message Host →",
        ctaUrl: `/chat/${b.id}`,
        createdAt: b.updatedAt.toISOString(),
      });
    }

    // 3. Low Coin Balance Alert (10 Coins per sent message)
    if (user.coinBalance < 10) {
      notifications.push({
        id: "alert_low_balance",
        type: "ALERT",
        title: user.coinBalance === 0 ? "Zero Coin Balance" : "Low Coin Balance",
        message:
          user.coinBalance === 0
            ? "You have 0 coins left. Recharge coins via Razorpay (INR 1 = 1 Coin) to send chat messages (10 Coins/message)."
            : `You have ${user.coinBalance} coins remaining. Sending a chat message requires 10 Coins.`,
        badge: "Recharge Coins",
        badgeVariant: "danger",
        ctaText: "Top Up Coins →",
        ctaUrl: "/wallet",
        createdAt: new Date().toISOString(),
      });
    }

    // 4. Recent Transaction Notifications (Refunds & Referral Rewards)
    user.coinTransactions.forEach((tx) => {
      if (tx.type === CoinTransactionType.MEETUP_REFUND) {
        notifications.push({
          id: `tx_${tx.id}`,
          type: "TRANSACTION",
          title: "Meetup Coins Refunded",
          message: tx.description || `+${tx.amount} coins credited back to your wallet.`,
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

    // 5. Referral Connections Alert
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
            message: `${ref.name || "A friend"} joined Meetzy Club using your invite code! When they complete their first meetup, you will automatically get 100 coins.`,
            badge: "Invited",
            badgeVariant: "sunny",
            ctaText: "View Invites →",
            ctaUrl: "/wallet",
            createdAt: ref.createdAt.toISOString(),
          });
        }
      });
    } catch {}

    // 6. Promotional Offers
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
