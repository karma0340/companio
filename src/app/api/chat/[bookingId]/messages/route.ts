import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getChatMessagesForBooking, addChatMessage } from "@/lib/chat-store";
import { getBookingById, sanitizeBookingForViewer } from "@/lib/bookings";
import { debitCoins, ensureUserWallet } from "@/lib/wallet";
import { prisma } from "@/lib/prisma";
import { CoinTransactionType } from "@prisma/client";

const COINS_PER_MESSAGE = 10;
const CHAT_ALLOWED_STATUSES = new Set(["CONFIRMED", "IN_PROGRESS", "COMPLETED"]);

export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to access this chat." },
        { status: 401 }
      );
    }

    const bookingId = params.bookingId;
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking conversation not found." },
        { status: 404 }
      );
    }

    if (
      booking.memberId !== session.userId &&
      booking.companionUserId !== session.userId
    ) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to view this conversation." },
        { status: 403 }
      );
    }

    const messages = await getChatMessagesForBooking(bookingId);

    return NextResponse.json({
      success: true,
      bookingId,
      count: messages.length,
      messages,
      booking: sanitizeBookingForViewer(booking, session.userId),
      chatUnlocked: CHAT_ALLOWED_STATUSES.has(booking.status),
      coinsPerMessage: COINS_PER_MESSAGE,
    });
  } catch (error) {
    console.error("[GET CHAT MESSAGES ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve chat message history." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please verify your mobile number to send messages." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const content = String(body.content || "").trim();

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    const bookingId = params.bookingId;
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Meetup booking not found." },
        { status: 404 }
      );
    }

    const isMember = booking.memberId === session.userId;
    const isHost = booking.companionUserId === session.userId;

    if (!isMember && !isHost) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to message in this booking." },
        { status: 403 }
      );
    }

    // Strict Accept-First Gate: chat unlocks only after the Host accepts the meetup request
    if (booking.status === "PENDING_ACCEPTANCE") {
      return NextResponse.json(
        {
          success: false,
          requiresAcceptance: true,
          error:
            "Messaging unlocks only after the Host accepts your meetup request.",
        },
        { status: 403 }
      );
    }

    if (!CHAT_ALLOWED_STATUSES.has(booking.status)) {
      return NextResponse.json(
        {
          success: false,
          isCancelled: true,
          error: "Messaging is closed because this booking is no longer active.",
        },
        { status: 403 }
      );
    }

    const senderRole: "MEMBER" | "COMPANION" = isHost ? "COMPANION" : "MEMBER";
    const senderName = isHost ? booking.companionName : booking.memberName || "Member";

    let remainingCoins: number | undefined;

    // Charge 10 coins per sent message for Members (uses 100 registration bonus coins first)
    if (senderRole === "MEMBER") {
      await ensureUserWallet(session.userId);
      const userRecord = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { coinBalance: true },
      });

      const currentCoins = userRecord?.coinBalance ?? 0;
      if (currentCoins < COINS_PER_MESSAGE) {
        return NextResponse.json(
          {
            success: false,
            insufficientCoins: true,
            requiredCoins: COINS_PER_MESSAGE,
            coinBalance: currentCoins,
            error: `Insufficient chat coins (${currentCoins} left, 10 coins required per message). Recharge via Razorpay to continue chatting.`,
          },
          { status: 402 }
        );
      }

      const debitResult = await debitCoins({
        userId: session.userId,
        amount: COINS_PER_MESSAGE,
        type: CoinTransactionType.CHAT_UNLOCK_24H,
        description: `Chat message sent (-10 Coins) · #${booking.bookingNumber}`,
        referenceId: bookingId,
      });

      remainingCoins = debitResult.newBalance;
    }

    const message = await addChatMessage({
      bookingId,
      senderId: session.userId,
      senderName,
      senderRole,
      content,
    });

    if (senderRole === "COMPANION") {
      await prisma.chatUnlock
        .updateMany({
          where: {
            companionId: booking.companionId,
            memberId: booking.memberId,
            firstHostReplyAt: null,
          },
          data: {
            firstHostReplyAt: new Date(),
            status: "HOST_RESPONDED",
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message,
      coinsCharged: senderRole === "MEMBER" ? COINS_PER_MESSAGE : 0,
      remainingCoins,
    });
  } catch (error) {
    const msg = (error as Error)?.message || "";
    if (msg.toLowerCase().includes("insufficient coins") || msg.toLowerCase().includes("cannot be negative")) {
      return NextResponse.json(
        {
          success: false,
          insufficientCoins: true,
          requiredCoins: COINS_PER_MESSAGE,
          error: "Insufficient chat coins (10 coins required per message). Recharge via Razorpay to continue chatting.",
        },
        { status: 402 }
      );
    }
    console.error("[POST CHAT MESSAGE ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch chat message." },
      { status: 500 }
    );
  }
}
