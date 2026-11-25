import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getChatMessagesForBooking, addChatMessage } from "@/lib/chat-store";
import { getBookingById, sanitizeBookingForViewer } from "@/lib/bookings";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getSession();
    const bookingId = params.bookingId;
    const messages = await getChatMessagesForBooking(bookingId);
    const booking = await getBookingById(bookingId);

    if (
      booking &&
      session?.userId &&
      booking.memberId !== session.userId &&
      booking.companionUserId !== session.userId
    ) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to view this conversation." },
        { status: 403 }
      );
    }

    let unlockInfo = null;
    if (booking) {
      try {
        const unlock = await prisma.chatUnlock.findFirst({
          where: {
            companionId: booking.companionId,
            memberId: booking.memberId,
            status: { in: ["ACTIVE", "HOST_RESPONDED"] },
          },
          orderBy: { createdAt: "desc" },
        });

        if (unlock) {
          const now = new Date();
          const isExpired =
            unlock.tier === "TWENTY_FOUR_HOURS" &&
            unlock.expiresAt &&
            new Date(unlock.expiresAt) < now;

          unlockInfo = {
            id: unlock.id,
            tier: unlock.tier,
            status: unlock.status,
            coinsDeducted: unlock.coinsDeducted,
            expiresAt: unlock.expiresAt?.toISOString() || null,
            refundDeadline: unlock.refundDeadline?.toISOString() || null,
            firstHostReplyAt: unlock.firstHostReplyAt?.toISOString() || null,
            isExpired: Boolean(isExpired),
          };
        }
      } catch (err) {
        console.warn("[GET CHAT UNLOCK ERROR]:", err);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId,
      count: messages.length,
      messages,
      booking: booking ? sanitizeBookingForViewer(booking, session?.userId) : null,
      unlock: unlockInfo,
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

    const senderId = session?.userId || body.senderId || "usr_member";
    const senderName = body.senderName || (senderId === booking?.companionId ? booking?.companionName : "Member");
    const senderRole = (body.senderRole || (senderId === booking?.companionId ? "COMPANION" : "MEMBER")) as "MEMBER" | "COMPANION" | "SYSTEM";

    // Enforce 24-hour pass expiry for member
    if (senderRole === "MEMBER" && booking) {
      try {
        const unlock = await prisma.chatUnlock.findFirst({
          where: {
            companionId: booking.companionId,
            memberId: booking.memberId,
            status: { in: ["ACTIVE", "HOST_RESPONDED"] },
          },
          orderBy: { createdAt: "desc" },
        });

        if (unlock && unlock.tier === "TWENTY_FOUR_HOURS" && unlock.expiresAt) {
          const now = new Date();
          if (new Date(unlock.expiresAt) < now) {
            return NextResponse.json(
              {
                success: false,
                error: "Your 24-hour chat pass with this companion has expired. Please renew your pass (69 coins) to send messages.",
                isExpired: true,
                companionId: booking.companionId,
              },
              { status: 403 }
            );
          }
        }
      } catch (checkErr) {
        console.warn("[PASS EXPIRY CHECK ERROR]:", checkErr);
      }
    }

    const message = await addChatMessage({
      bookingId,
      senderId,
      senderName,
      senderRole,
      content,
    });

    // Mark ChatUnlock as responded if host sent a message, satisfying the 48h SLA
    if (senderRole === "COMPANION" && booking) {
      try {
        await prisma.chatUnlock.updateMany({
          where: {
            companionId: booking.companionId,
            memberId: booking.memberId,
            firstHostReplyAt: null,
          },
          data: {
            firstHostReplyAt: new Date(),
            status: "HOST_RESPONDED",
          },
        });
      } catch (slaErr) {
        console.warn("[HOST REPLY SLA UPDATE ERROR]:", slaErr);
      }
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("[POST CHAT MESSAGE ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch chat message." },
      { status: 500 }
    );
  }
}
