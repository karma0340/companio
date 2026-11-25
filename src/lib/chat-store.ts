import { filterChatMessage } from "./filters";
import { prisma } from "./prisma";

export interface ChatMessageRecord {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole?: "MEMBER" | "COMPANION" | "SYSTEM";
  content: string;
  isRedacted: boolean;
  redactionReason?: string;
  violationsDetected?: string[];
  sentAt: string;
}

export interface AddMessageInput {
  bookingId: string;
  senderId: string;
  senderName?: string;
  senderRole?: "MEMBER" | "COMPANION" | "SYSTEM";
  content: string;
}

export async function addChatMessage(input: AddMessageInput): Promise<ChatMessageRecord> {
  const filterResult = filterChatMessage(input.content);
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const sentAt = new Date().toISOString();

  await prisma.chatMessage.create({
    data: {
      id: msgId,
      bookingId: input.bookingId,
      senderId: input.senderId,
      content: filterResult.filteredContent,
      isRedacted: !filterResult.isClean,
      redactionReason: filterResult.redactionReason,
    },
  });

  return {
    id: msgId,
    bookingId: input.bookingId,
    senderId: input.senderId,
    senderName: input.senderName || "Member",
    senderRole: input.senderRole || "MEMBER",
    content: filterResult.filteredContent,
    isRedacted: !filterResult.isClean,
    redactionReason: filterResult.redactionReason,
    violationsDetected: filterResult.violationsDetected,
    sentAt,
  };
}

export async function getChatMessagesForBooking(bookingId: string): Promise<ChatMessageRecord[]> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        companion: { select: { userId: true, displayName: true } },
      },
    });

    const hostUserId = booking?.companion?.userId;

    const dbMsgs = await prisma.chatMessage.findMany({
      where: { bookingId },
      include: {
        sender: { select: { id: true, name: true } },
      },
      orderBy: { sentAt: "asc" },
    });

    return dbMsgs.map((m) => {
      const isHostSender = Boolean(hostUserId && m.senderId === hostUserId);
      return {
        id: m.id,
        bookingId: m.bookingId,
        senderId: m.senderId,
        senderName: isHostSender
          ? booking?.companion?.displayName || m.sender.name || "Host"
          : m.sender.name || "Member",
        senderRole: isHostSender ? "COMPANION" : "MEMBER",
        content: m.content,
        isRedacted: m.isRedacted,
        redactionReason: m.redactionReason || undefined,
        sentAt: m.sentAt.toISOString(),
      };
    });
  } catch (err) {
    console.warn("[GET CHAT PRISMA ERROR]:", (err as Error).message);
    return [];
  }
}
