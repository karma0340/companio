import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getChatMessagesForBooking, addChatMessage } from "@/lib/chat-store";
import { getBookingById } from "@/lib/bookings";

export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const bookingId = params.bookingId;
    const messages = await getChatMessagesForBooking(bookingId);

    return NextResponse.json({
      success: true,
      bookingId,
      count: messages.length,
      messages,
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

    const message = await addChatMessage({
      bookingId,
      senderId,
      senderName,
      senderRole,
      content,
    });

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
