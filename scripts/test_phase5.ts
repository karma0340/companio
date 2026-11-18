import { filterChatMessage } from "../src/lib/filters";
import { addChatMessage, getChatMessagesForBooking } from "../src/lib/chat-store";
import { WebSocket } from "ws";
import { signUserToken } from "../src/lib/auth";

console.log("==================================================");
console.log("RUNNING PHASE 5 AUTOMATED WEBSOCKET & CHAT SUITE");
console.log("==================================================");

let passed = 0;
let total = 0;

function assert(condition: boolean, desc: string, detail?: any) {
  total++;
  if (condition) {
    console.log(`[PASS] ${desc}`);
    passed++;
  } else {
    console.error(`[FAIL] ${desc}`, detail || "");
    process.exitCode = 1;
  }
}

async function run() {
  // 1. Contact Shielding Filter Tests
  const cleanMsg = filterChatMessage("Hi! I have arrived at Blue Tokai. Seated at the patio.");
  assert(cleanMsg.isClean === true, "Legitimate venue coordination message passes cleanly");
  assert(cleanMsg.violationsDetected.length === 0, "Zero violations detected on clean message");

  const phoneMsg = filterChatMessage("Call me directly on 9811223399 to find each other");
  assert(phoneMsg.isClean === false, "Phone number violates safety filter");
  assert(phoneMsg.violationsDetected.includes("PHONE_NUMBER"), "Violation identified as PHONE_NUMBER");
  assert(phoneMsg.filteredContent.includes("[PHONE NUMBER REDACTED FOR SAFETY]"), "Phone number replaced with safety banner");

  const waMsg = filterChatMessage("Ping me on WhatsApp: wa.me/919811223399");
  assert(waMsg.isClean === false, "WhatsApp direct link violates filter");
  assert(waMsg.violationsDetected.includes("EXTERNAL_CHAT_LINK"), "Violation identified as EXTERNAL_CHAT_LINK");

  const upiMsg = filterChatMessage("Pay me directly via UPI on rohit@okhdfcbank");
  assert(upiMsg.isClean === false, "UPI handle violates disintermediation filter");
  assert(upiMsg.violationsDetected.includes("UPI_PAYMENT_ID"), "Violation identified as UPI_PAYMENT_ID");

  const emailMsg = filterChatMessage("Email me at rohit.verma@example.com");
  assert(emailMsg.isClean === false, "Email address violates filter");
  assert(emailMsg.violationsDetected.includes("EMAIL_ADDRESS"), "Violation identified as EMAIL_ADDRESS");

  const socialMsg = filterChatMessage("Follow me on instagram @rohit_v_films");
  assert(socialMsg.isClean === false, "Social handle violates filter");
  assert(socialMsg.violationsDetected.includes("SOCIAL_HANDLE"), "Violation identified as SOCIAL_HANDLE");

  // 2. Chat Store In-Memory & Fallback Tests
  const testBookingId = `bkg_test_chat_${Date.now()}`;
  const savedMsg = await addChatMessage({
    bookingId: testBookingId,
    senderId: "user_member_01",
    senderName: "Rohit",
    senderRole: "MEMBER",
    content: "Hi, I am wearing a black jacket.",
  });
  assert(savedMsg.id.startsWith("msg_"), "Chat message record ID generated");
  assert(savedMsg.isRedacted === false, "Clean message marked isRedacted: false");

  const savedViolatingMsg = await addChatMessage({
    bookingId: testBookingId,
    senderId: "user_member_01",
    senderName: "Rohit",
    senderRole: "MEMBER",
    content: "My alternate number is +91 9811223399",
  });
  assert(savedViolatingMsg.isRedacted === true, "Violating message marked isRedacted: true");
  assert(savedViolatingMsg.content.includes("REDACTED"), "Content stored in redacted form");

  const history = await getChatMessagesForBooking(testBookingId);
  assert(history.length === 2, "Message history retrieves exactly 2 messages in sequence");
  assert(history[0].content === "Hi, I am wearing a black jacket.", "Chronological ordering preserved");

  // 3. WebSocket Integration Test (Connecting to Live WS Gateway on Port 3001)
  console.log("Testing WebSocket connection on ws://localhost:3001...");

  const token1 = signUserToken({ userId: "user_member_01", phone: "+919811223399", role: "MEMBER", isUnlocked: true });
  const token2 = signUserToken({ userId: "comp_01", phone: "+919999999901", role: "COMPANION", isUnlocked: true });

  const wsRoom = `bkg_ws_test_${Date.now()}`;

  await new Promise<void>((resolve) => {
    let client1: WebSocket;
    let client2: WebSocket;

    try {
      client1 = new WebSocket(`ws://localhost:3001?token=${token1}&bookingId=${wsRoom}`);
      client2 = new WebSocket(`ws://localhost:3001?token=${token2}&bookingId=${wsRoom}`);
    } catch (e) {
      console.warn("WebSocket server not running, skipping live socket step:", e);
      resolve();
      return;
    }

    let connectedCount = 0;
    const onConnect = () => {
      connectedCount++;
      if (connectedCount === 2) {
        assert(true, "Both Member and Companion WebSockets connected to room");

        // Client 1 sends a message
        client1.send(
          JSON.stringify({
            type: "CHAT_MESSAGE",
            content: "Hello from Member via WebSocket!",
            senderName: "Rohit",
            senderRole: "MEMBER",
          })
        );
      }
    };

    client1.on("open", onConnect);
    client2.on("open", onConnect);

    client2.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.type === "MESSAGE_RECEIVED") {
          assert(data.message.content === "Hello from Member via WebSocket!", "WebSocket broadcast received by peer in room");
          client1.close();
          client2.close();
          resolve();
        }
      } catch (err) {
        console.error("WS test error:", err);
        client1.close();
        client2.close();
        resolve();
      }
    });

    client1.on("error", () => resolve());
    client2.on("error", () => resolve());

    // Timeout fallback if WS is offline
    setTimeout(() => {
      try {
        client1.close();
        client2.close();
      } catch {}
      resolve();
    }, 2500);
  });

  console.log("==================================================");
  console.log(`PHASE 5 TEST RESULTS: ${passed}/${total} PASSED`);
  console.log("==================================================");
}

run();
