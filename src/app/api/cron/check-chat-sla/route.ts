import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { creditCoins } from "@/lib/wallet";
import { ChatUnlockStatus, CoinTransactionType } from "@prisma/client";

export async function GET() {
  try {
    const now = new Date();

    // Query active chat unlocks past their 48-hour deadline where host hasn't replied
    const timedOutUnlocks = await prisma.chatUnlock.findMany({
      where: {
        status: ChatUnlockStatus.ACTIVE,
        firstHostReplyAt: null,
        refundDeadline: { lte: now },
        isRefunded: false,
      },
      include: {
        companion: { select: { displayName: true } },
      },
    });

    let refundedCount = 0;

    for (const unlock of timedOutUnlocks) {
      await prisma.$transaction(async (tx) => {
        // Mark unlock as refunded
        await tx.chatUnlock.update({
          where: { id: unlock.id },
          data: {
            status: ChatUnlockStatus.REFUNDED_TIMEOUT,
            isRefunded: true,
          },
        });

        // Credit coins back to member
        const updatedUser = await tx.user.update({
          where: { id: unlock.memberId },
          data: {
            coinBalance: { increment: unlock.coinsDeducted },
          },
          select: { coinBalance: true },
        });

        // Log transaction ledger
        await tx.coinTransaction.create({
          data: {
            userId: unlock.memberId,
            type: CoinTransactionType.CHAT_REFUND_TIMEOUT,
            amount: unlock.coinsDeducted,
            balanceAfter: updatedUser.coinBalance,
            description: `48h timeout refund for chat with ${unlock.companion.displayName}`,
            referenceId: unlock.id,
          },
        });
      });

      refundedCount++;
    }

    return NextResponse.json({
      success: true,
      processed: timedOutUnlocks.length,
      refundedCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[CHAT_SLA_CRON_ERROR]:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
