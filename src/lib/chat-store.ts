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

// In-memory cache synchronized with database messages
const chatHistoryMap = new Map<string, ChatMessageRecord[]>();

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

  const record: ChatMessageRecord = {
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

  // 1. In-memory storage
  const existing = chatHistoryMap.get(input.bookingId) || [];
  existing.push(record);
  chatHistoryMap.set(input.bookingId, existing);

  // 2. Database persistence with resilient fallback
  try {
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
  } catch (err) {
    console.warn("[CHAT PRISMA FALLBACK]:", (err as Error).message);
  }

  return record;
}

export async function getChatMessagesForBooking(bookingId: string): Promise<ChatMessageRecord[]> {
  const inMem = chatHistoryMap.get(bookingId);
  if (inMem && inMem.length > 0) {
    return inMem;
  }

  // Fallback to database
  try {
    const dbMsgs = await prisma.chatMessage.findMany({
      where: { bookingId },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
      orderBy: { sentAt: "asc" },
    });

    if (dbMsgs && dbMsgs.length > 0) {
      const records: ChatMessageRecord[] = dbMsgs.map((m) => ({
        id: m.id,
        bookingId: m.bookingId,
        senderId: m.senderId,
        senderName: m.sender.name || "Member",
        senderRole: m.sender.role === "COMPANION" ? "COMPANION" : "MEMBER",
        content: m.content,
        isRedacted: m.isRedacted,
        redactionReason: m.redactionReason || undefined,
        sentAt: m.sentAt.toISOString(),
      }));
      chatHistoryMap.set(bookingId, records);
      return records;
    }
  } catch (err) {
    console.warn("[GET CHAT PRISMA FALLBACK]:", (err as Error).message);
  }

  return inMem || [];
}
