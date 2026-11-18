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

// In-memory message store: bookingId -> ChatMessageRecord[]
const chatHistoryMap = new Map<string, ChatMessageRecord[]>();

// Pre-seed demo messages for bkg_seed_01
const now = Date.now();
chatHistoryMap.set("bkg_seed_01", [
  {
    id: "msg_sys_01",
    bookingId: "bkg_seed_01",
    senderId: "system",
    senderName: "Companio Safety System",
    senderRole: "SYSTEM",
    content: "Booking confirmed. Coordination chat unlocked. Meeting venue: Blue Tokai Coffee Roasters, Hauz Khas Village. Reminder: Direct contact exchange is disabled for safety. Never disclose your 4-digit PIN in chat.",
    isRedacted: false,
    sentAt: new Date(now - 30 * 60000).toISOString(),
  },
  {
    id: "msg_seed_01",
    bookingId: "bkg_seed_01",
    senderId: "comp_01",
    senderName: "Vanshika Sharma",
    senderRole: "COMPANION",
    content: "Hi Rohit! Looking forward to meeting tomorrow at Blue Tokai. I will be there by 3:55 PM. Let me know if you prefer an indoor corner table or the outdoor patio!",
    isRedacted: false,
    sentAt: new Date(now - 25 * 60000).toISOString(),
  },
]);

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
