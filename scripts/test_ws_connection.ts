import { WebSocket } from "ws";
import { signUserToken } from "../src/lib/auth";

console.log("[Test WS] Starting WebSocket client test...");

const token = signUserToken({
  userId: "user_test_client_01",
  phone: "+919811223301",
  role: "MEMBER",
  isUnlocked: true,
});

const bookingId = "bk_test_room_99";
const wsUrl = `ws://localhost:3001?bookingId=${bookingId}&token=${token}`;

const client = new WebSocket(wsUrl);

client.on("open", () => {
  console.log("[Test WS] Connected successfully to WebSocket gateway!");

  // Send a test message with a phone number and social handle to test interception
  const payload = {
    type: "CHAT_MESSAGE",
    content: "Hi! Can you call me on 9811223344 or add my insta @test_user? Otherwise see you at Third Wave Coffee at 5pm",
  };
  client.send(JSON.stringify(payload));
  console.log("[Test WS] Dispatched test message packet.");
});

client.on("message", (data) => {
  const parsed = JSON.parse(data.toString());
  console.log("[Test WS] Received packet from server:", parsed);

  if (parsed.type === "CONNECTION_ESTABLISHED") {
    console.log("[Test WS] Connection handshake acknowledged.");
  }

  if (parsed.type === "MESSAGE_RECEIVED") {
    console.log("[Test WS] Verified broadcast message received!");
    console.log("  Filtered content:", parsed.message.content);
    console.log("  Is Redacted:", parsed.message.isRedacted);
    console.log("  Redaction Reason:", parsed.message.redactionReason);

    if (
      parsed.message.content.includes("[PHONE NUMBER REDACTED FOR SAFETY]") &&
      parsed.message.content.includes("[SOCIAL HANDLE REDACTED]")
    ) {
      console.log("[Test WS] ALL INTERCEPTION ASSERTIONS PASSED!");
      client.close();
      process.exit(0);
    } else {
      console.error("[Test WS] Redaction assertion failed!");
      client.close();
      process.exit(1);
    }
  }
});

client.on("error", (err) => {
  console.error("[Test WS] Connection error:", err.message);
  process.exit(1);
});

// Timeout after 8 seconds if server doesn't respond
setTimeout(() => {
  console.error("[Test WS] Test timed out waiting for server response.");
  client.close();
  process.exit(1);
}, 8000);
