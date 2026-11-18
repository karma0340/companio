import http from "http";
import { WebSocket } from "ws";
import { signUserToken } from "../src/lib/auth";

const BASE_URL = "http://localhost:3000";

async function makeRequest(
  path: string,
  method: string = "GET",
  body?: any,
  cookies?: string
): Promise<{ status: number; data: any; headers: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (cookies) {
      reqHeaders["Cookie"] = cookies;
    }

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          let parsedData: any = rawData;
          try {
            parsedData = JSON.parse(rawData);
          } catch {
            // Keep as string
          }
          resolve({
            status: res.statusCode || 0,
            data: parsedData,
            headers: res.headers,
          });
        });
      }
    );

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log("==================================================");
  console.log("RUNNING LIVE PHASE 5 CHAT & SHIELDING API TEST");
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

  try {
    const bookingId = "bkg_seed_01";

    // 1. Fetch Chat History via REST API
    const getRes = await makeRequest(`/api/chat/${bookingId}/messages`);
    assert(getRes.status === 200, "GET /api/chat/[bookingId]/messages returns 200 OK");
    assert(getRes.data.success === true, "Chat history success flag is true");
    assert(Array.isArray(getRes.data.messages), "Messages array returned");
    assert(getRes.data.messages.length >= 2, "Pre-seeded system and companion messages loaded");

    // 2. Post Clean Coordination Message
    const postCleanRes = await makeRequest(`/api/chat/${bookingId}/messages`, "POST", {
      content: "I have arrived at the cafe and taken a seat on the terrace.",
      senderId: "user_member_demo",
      senderName: "Rohit Verma",
      senderRole: "MEMBER",
    });
    assert(postCleanRes.status === 200, "POST /api/chat/[bookingId]/messages returns 200 OK");
    assert(postCleanRes.data.success === true, "Clean message dispatched successfully");
    assert(postCleanRes.data.message.isRedacted === false, "Clean message marked isRedacted: false");
    assert(postCleanRes.data.message.content.includes("terrace"), "Unmodified content delivered");

    // 3. Post Message with Disintermediation Phone Number Violation
    const postPhoneRes = await makeRequest(`/api/chat/${bookingId}/messages`, "POST", {
      content: "Call me directly at +91 9811223399 to meet outside",
      senderId: "user_member_demo",
      senderName: "Rohit Verma",
      senderRole: "MEMBER",
    });
    assert(postPhoneRes.status === 200, "POST with phone number returns 200 OK");
    assert(postPhoneRes.data.message.isRedacted === true, "Phone number message flagged isRedacted: true");
    assert(postPhoneRes.data.message.content.includes("[PHONE NUMBER REDACTED FOR SAFETY]"), "Phone number shielded with safety notice");
    assert(postPhoneRes.data.message.redactionReason?.includes("PHONE_NUMBER"), "Redaction reason contains PHONE_NUMBER");

    // 4. Post Message with UPI Handle Violation
    const postUpiRes = await makeRequest(`/api/chat/${bookingId}/messages`, "POST", {
      content: "You can pay me offline via rohit@okhdfcbank",
      senderId: "user_member_demo",
      senderName: "Rohit Verma",
      senderRole: "MEMBER",
    });
    assert(postUpiRes.status === 200, "POST with UPI handle returns 200 OK");
    assert(postUpiRes.data.message.isRedacted === true, "UPI handle message flagged isRedacted: true");
    assert(postUpiRes.data.message.content.includes("[PAYMENT HANDLE REDACTED]"), "UPI handle shielded with payment notice");

    // 5. Verify History Updated Chronologically
    const updatedHistory = await makeRequest(`/api/chat/${bookingId}/messages`);
    assert(updatedHistory.status === 200, "History refresh returns 200 OK");
    const lastMsg = updatedHistory.data.messages[updatedHistory.data.messages.length - 1];
    assert(lastMsg.content.includes("[PAYMENT HANDLE REDACTED]"), "Latest history reflects shielded message");

    console.log("==================================================");
    console.log(`LIVE PHASE 5 API TEST RESULTS: ${passed}/${total} PASSED`);
    console.log("==================================================");
  } catch (err) {
    console.error("Live test failed with exception:", err);
    process.exitCode = 1;
  }
}

run();
