import http from "http";

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
  console.log("RUNNING LIVE PHASE 3 API INTEGRATION TEST");
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
    // 1. Health check
    const health = await makeRequest("/api/health");
    assert(health.status === 200, "Health check returns 200 OK");

    // 2. Send OTP
    const sendRes = await makeRequest("/api/auth/otp/send", "POST", {
      phone: "+919811223399",
    });
    assert(sendRes.status === 200, "POST /api/auth/otp/send returns 200");
    assert(sendRes.data.success === true, "OTP dispatched successfully");

    // 3. Verify OTP
    const verifyRes = await makeRequest("/api/auth/otp/verify", "POST", {
      phone: "+919811223399",
      code: "123456",
      name: "Rohit Verma",
    });
    assert(verifyRes.status === 200, "POST /api/auth/otp/verify returns 200");
    assert(verifyRes.data.success === true, "OTP verification succeeds");
    assert(typeof verifyRes.data.token === "string", "Session JWT token generated");

    // Extract cookie
    const setCookie = verifyRes.headers["set-cookie"];
    const cookieHeader = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie || "";
    assert(cookieHeader.includes("companio_session"), "HTTP-only session cookie returned in headers");

    // 4. Session State check
    const meRes = await makeRequest("/api/auth/me", "GET", null, cookieHeader);
    assert(meRes.status === 200, "GET /api/auth/me returns 200");
    assert(meRes.data.authenticated === true, "Session is authenticated");
    assert(meRes.data.user.phone === "+919811223399", "User phone matches session");

    // 5. Create Pass Order
    const orderRes = await makeRequest("/api/passes/create-order", "POST", {
      tier: "ONE_MONTH",
    }, cookieHeader);
    assert(orderRes.status === 200, "POST /api/passes/create-order returns 200");
    assert(orderRes.data.order?.priceInr === 99.50, "Order price is ₹99.50");
    assert(typeof orderRes.data.order?.orderId === "string", "Valid order ID returned");

    const orderId = orderRes.data.order.orderId;

    // 6. Verify Payment & Activate Pass
    const payRes = await makeRequest("/api/passes/verify-payment", "POST", {
      orderId,
      paymentId: `pay_test_${Date.now()}`,
      tier: "ONE_MONTH",
    }, cookieHeader);
    assert(payRes.status === 200, "POST /api/passes/verify-payment returns 200");
    assert(payRes.data.isUnlocked === true, "User status flipped to isUnlocked: true");
    assert(payRes.data.pass?.tier === "ONE_MONTH", "Pass tier recorded as ONE_MONTH");

    // Extract new unlocked cookie
    const unlockedSetCookie = payRes.headers["set-cookie"];
    const unlockedCookieHeader = unlockedSetCookie
      ? (Array.isArray(unlockedSetCookie) ? unlockedSetCookie.join("; ") : unlockedSetCookie)
      : cookieHeader;

    // 7. Check Active Pass Status
    const passRes = await makeRequest("/api/passes/active", "GET", null, unlockedCookieHeader);
    assert(passRes.status === 200, "GET /api/passes/active returns 200");
    assert(passRes.data.isUnlocked === true, "Active pass reflects unlocked state");
    assert(passRes.data.activePass?.daysRemaining === 30, "Pass remaining duration is 30 days");

    // 8. Cron Expiry check
    const cronRes = await makeRequest("/api/cron/expire-passes", "POST");
    assert(cronRes.status === 200, "POST /api/cron/expire-passes returns 200");
    assert(cronRes.data.success === true, "Pass expiry cron executed cleanly");

    // 9. Sign Out
    const logoutRes = await makeRequest("/api/auth/logout", "POST", null, unlockedCookieHeader);
    assert(logoutRes.status === 200, "POST /api/auth/logout returns 200");

    console.log("==================================================");
    console.log(`LIVE PHASE 3 TEST RESULTS: ${passed}/${total} PASSED`);
    console.log("==================================================");
  } catch (err) {
    console.error("Live test failed with exception:", err);
    process.exitCode = 1;
  }
}

run();
