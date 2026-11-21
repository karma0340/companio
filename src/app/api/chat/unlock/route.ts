import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { debitCoins } from "@/lib/wallet";
import { ChatTier, ChatUnlockStatus, CoinTransactionType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    let userId = session?.userId;

    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!userExists) {
        userId = undefined;
      }
    }

    if (!userId) {
      // Dev fallback to latest user
      const firstUser = await prisma.user.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if (firstUser) {
        userId = firstUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: "Please sign in to message hosts." }, { status: 401 });
    }

    const body = await req.json();
    const { companionId, tier } = body;

    if (!companionId) {
      return NextResponse.json({ success: false, error: "Companion ID is required." }, { status: 400 });
    }

    const chatTier: ChatTier = tier === "FOREVER" ? ChatTier.FOREVER : ChatTier.TWENTY_FOUR_HOURS;
    const coinsRequired = chatTier === ChatTier.FOREVER ? 499 : 69;

    // Fetch companion details
    const companion = await prisma.companion.findUnique({
      where: { id: companionId },
      include: { user: true },
    });

    if (!companion) {
      return NextResponse.json({ success: false, error: "Companion not found." }, { status: 404 });
    }

    // Check if current user is trying to message themselves
    if (companion.userId === userId) {
      return NextResponse.json({ success: false, error: "You cannot message your own host profile." }, { status: 400 });
    }

    // Check existing active unlock
    const existingUnlock = await prisma.chatUnlock.findFirst({
      where: {
        memberId: userId,
        companionId: companion.id,
        status: { in: [ChatUnlockStatus.ACTIVE, ChatUnlockStatus.HOST_RESPONDED] },
        OR: [
          { tier: ChatTier.FOREVER },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingUnlock) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          memberId: userId,
          companionId: companion.id,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        message: "You already have an active chat pass with this companion.",
        unlockId: existingUnlock.id,
        redirectUrl: existingBooking ? `/chat/${existingBooking.id}` : `/chat`,
      });
    }

    // Check coin balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { coinBalance: true },
    });

    if (!user || user.coinBalance < coinsRequired) {
      return NextResponse.json({
        success: false,
        error: `Insufficient coins. You have ${user?.coinBalance ?? 0} coins, but ${coinsRequired} are required.`,
        currentBalance: user?.coinBalance ?? 0,
        requiredCoins: coinsRequired,
      }, { status: 402 });
    }

    const now = new Date();
    const expiresAt = chatTier === ChatTier.TWENTY_FOUR_HOURS
      ? new Date(now.getTime() + 24 * 60 * 60 * 1000)
      : null;
    const refundDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48-hour SLA

    // Deduct coins & create unlock record
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct coins
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          coinBalance: { decrement: coinsRequired },
        },
        select: { coinBalance: true },
      });

      // 2. Create ledger transaction
      const txType = chatTier === ChatTier.FOREVER
        ? CoinTransactionType.CHAT_UNLOCK_FOREVER
        : CoinTransactionType.CHAT_UNLOCK_24H;

      const transaction = await tx.coinTransaction.create({
        data: {
          userId,
          type: txType,
          amount: -coinsRequired,
          balanceAfter: updatedUser.coinBalance,
          description: `Message ${companion.displayName} (${chatTier === ChatTier.FOREVER ? "Forever pass" : "24h pass"})`,
          referenceId: companion.id,
        },
      });

      // 3. Create ChatUnlock entry
      const unlock = await tx.chatUnlock.create({
        data: {
          memberId: userId,
          companionId: companion.id,
          tier: chatTier,
          coinsDeducted: coinsRequired,
          expiresAt,
          refundDeadline,
          status: ChatUnlockStatus.ACTIVE,
        },
      });

      // 4. Ensure an active messaging booking thread exists between member and companion
      let activity = await tx.activity.findFirst();
      if (!activity) {
        activity = await tx.activity.create({
          data: {
            title: "Coffee & Conversations",
            slug: "coffee-conversations",
            description: "Direct messaging and coffee meetups",
            icon: "Coffee",
          },
        });
      }

      const booking = await tx.booking.create({
        data: {
          bookingNumber: `CMP-CHAT-${Date.now().toString().slice(-6)}`,
          memberId: userId,
          companionId: companion.id,
          cityId: companion.cityId,
          activityId: activity.id,
          scheduledDate: new Date(),
          durationHours: chatTier === ChatTier.FOREVER ? 999 : 24,
          venueName: "Direct Messaging",
          venueAddress: "Online Protected Chat",
          totalAmount: coinsRequired,
          companionFee: Math.round(coinsRequired * 0.9),
          platformFee: Math.round(coinsRequired * 0.1),
          gstAmount: 0,
          verificationPin: Math.floor(1000 + Math.random() * 9000).toString(),
          hostAcceptanceDeadline: refundDeadline,
          status: "CONFIRMED",
        },
      });

      return {
        newBalance: updatedUser.coinBalance,
        unlock,
        booking,
        transaction,
      };
    });

    return NextResponse.json({
      success: true,
      unlockId: result.unlock.id,
      bookingId: result.booking.id,
      newBalance: result.newBalance,
      tier: chatTier,
      redirectUrl: `/chat/${result.booking.id}`,
    });
  } catch (error) {
    console.error("[CHAT_UNLOCK_ERROR]:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
