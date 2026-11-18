import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { verifyUserToken } from "../src/lib/auth";
import { filterChatMessage } from "../src/lib/filters";
import { addChatMessage, getChatMessagesForBooking } from "../src/lib/chat-store";

const PORT = parseInt(process.env.WS_PORT || "3001", 10);

interface AuthenticatedSocket extends WebSocket {
  userId?: string;
  bookingId?: string;
  isAlive?: boolean;
}

// In-memory room manager for active bookings
// bookingId -> Set of active WebSocket connections
const bookingRooms = new Map<string, Set<AuthenticatedSocket>>();

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", service: "Companio WebSocket Gateway", port: PORT }));
});

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws: AuthenticatedSocket, req) => {
  const reqUrl = new URL(req.url || "", `http://localhost:${PORT}`);
  let token = reqUrl.searchParams.get("token");
  let bookingId = reqUrl.searchParams.get("bookingId");

  // In sandbox or /rt connections without explicit query params, allow lazy join via event
  if (token) {
    const payload = verifyUserToken(token);
    if (payload) {
      ws.userId = payload.userId;
    }
  }

  ws.isAlive = true;

  if (bookingId) {
    ws.bookingId = bookingId;
    if (!bookingRooms.has(bookingId)) {
      bookingRooms.set(bookingId, new Set());
    }
    bookingRooms.get(bookingId)!.add(ws);
    console.log(`[WS] User ${ws.userId || 'anonymous'} connected to booking room: ${bookingId}`);
  }

  // Send connection acknowledgment
  ws.send(
    JSON.stringify({
      type: "CONNECTION_ESTABLISHED",
      bookingId: ws.bookingId || null,
      userId: ws.userId || null,
      namespace: "/rt",
      timestamp: new Date().toISOString(),
    })
  );

  // Send message history immediately if bookingId is present
  if (ws.bookingId) {
    try {
      const history = await getChatMessagesForBooking(ws.bookingId);
      ws.send(
        JSON.stringify({
          type: "HISTORY_PAYLOAD",
          bookingId: ws.bookingId,
          messages: history,
        })
      );
    } catch (err) {
      console.warn("[WS] Error fetching message history:", err);
    }
  }

  // Handle incoming messages
  ws.on("message", async (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());

      // 1. Support dynamic booking join
      if (data.type === "booking:join" || data.type === "JOIN_ROOM") {
        const targetBookingId = String(data.bookingId || data.targetBookingId || "").trim();
        if (targetBookingId) {
          ws.bookingId = targetBookingId;
          if (!bookingRooms.has(targetBookingId)) {
            bookingRooms.set(targetBookingId, new Set());
          }
          bookingRooms.get(targetBookingId)!.add(ws);

          const history = await getChatMessagesForBooking(targetBookingId);
          ws.send(
            JSON.stringify({
              type: "HISTORY_PAYLOAD",
              bookingId: targetBookingId,
              messages: history,
            })
          );
        }
        return;
      }

      // 2. Support dynamic booking leave
      if (data.type === "booking:leave") {
        if (ws.bookingId && bookingRooms.has(ws.bookingId)) {
          bookingRooms.get(ws.bookingId)!.delete(ws);
        }
        return;
      }

      // 3. Support live location broadcasts
      if (data.type === "booking:location") {
        const currentBookingId = ws.bookingId || data.bookingId;
        if (currentBookingId && bookingRooms.has(currentBookingId)) {
          const locPayload = JSON.stringify({
            type: "LOCATION_UPDATE",
            lat: data.lat,
            lng: data.lng,
            senderId: ws.userId,
            timestamp: new Date().toISOString(),
          });
          bookingRooms.get(currentBookingId)!.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(locPayload);
            }
          });
        }
        return;
      }

      // 4. Support Chat Messages
      if (data.type === "CHAT_MESSAGE" || data.type === "message") {
        const currentBookingId = ws.bookingId || data.bookingId;
        if (!currentBookingId) return;

        const rawContent = String(data.content || data.body || "").trim();
        if (!rawContent) return;

        // Save message with automated contact shielding
        const savedRecord = await addChatMessage({
          bookingId: currentBookingId,
          senderId: ws.userId || "user_member_01",
          senderName: data.senderName || "Member",
          senderRole: data.senderRole || "MEMBER",
          content: rawContent,
        });

        const broadcastPayload = JSON.stringify({
          type: "MESSAGE_RECEIVED",
          message: savedRecord,
        });

        const roomSockets = bookingRooms.get(currentBookingId);
        if (roomSockets) {
          roomSockets.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastPayload);
            }
          });
        }
      }
    } catch (err) {
      console.error("[WS] Error handling message:", err);
      ws.send(JSON.stringify({ type: "ERROR", error: "Failed to process message packet" }));
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    if (ws.bookingId) {
      const room = bookingRooms.get(ws.bookingId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) {
          bookingRooms.delete(ws.bookingId);
        }
      }
      console.log(`[WS] User ${ws.userId || 'anonymous'} disconnected from booking: ${ws.bookingId}`);
    }
  });

  ws.on("error", (err) => {
    console.error(`[WS] Socket error for user ${ws.userId}:`, err);
  });
});

// Periodic heartbeat to clean up dead sockets
setInterval(() => {
  wss.clients.forEach((client: AuthenticatedSocket) => {
    if (client.isAlive === false) return client.terminate();
    client.isAlive = false;
    client.ping();
  });
}, 30000);

server.listen(PORT, () => {
  console.log(`[Companio WS Gateway] Real-Time WebSocket Server listening on port ${PORT}`);
});
