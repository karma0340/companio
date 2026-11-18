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
  console.log("RUNNING LIVE PHASE 4 API INTEGRATION TEST");
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
    // 1. Initial bookings list
    const listRes = await makeRequest("/api/bookings");
    assert(listRes.status === 200, "GET /api/bookings returns 200 OK");
    assert(listRes.data.success === true, "Bookings payload success flag is true");
    assert(Array.isArray(listRes.data.bookings), "Bookings array returned");

    // 2. Create Booking Request
    const createRes = await makeRequest("/api/bookings/create", "POST", {
      companionId: "comp_01",
      activityId: "act_01",
      durationHours: 1,
      venueName: "Blue Tokai Coffee Roasters",
      venueAddress: "Plot 11, Hauz Khas Village, New Delhi",
      name: "Rohit Verma",
      phone: "+919811223399",
    });

    assert(createRes.status === 200, "POST /api/bookings/create returns 200 OK");
    assert(createRes.data.success === true, "Booking request created successfully");
    assert(createRes.data.booking.totalAmount === 706.00, "Escrow total amount locked at ₹706.00");
    assert(createRes.data.booking.companionFee === 499.00, "Companion fee is ₹499.00");
    assert(createRes.data.booking.platformFee === 175.42, "Platform convenience fee is ₹175.42");
    assert(createRes.data.booking.gstAmount === 31.58, "GST (18%) is ₹31.58");
    assert(createRes.data.booking.status === "PENDING_ACCEPTANCE", "Booking status is PENDING_ACCEPTANCE");
    assert(createRes.data.booking.escrowStatus === "HELD_IN_ESCROW", "Escrow status is HELD_IN_ESCROW");
    assert(typeof createRes.data.booking.verificationPin === "string" && createRes.data.booking.verificationPin.length === 4, "4-digit verification PIN generated");

    const bookingId = createRes.data.booking.id;

    // 3. Get single booking by ID
    const singleRes = await makeRequest(`/api/bookings/${bookingId}`);
    assert(singleRes.status === 200, "GET /api/bookings/[id] returns 200 OK");
    assert(singleRes.data.booking.id === bookingId, "Retrieved booking ID matches");
    assert(singleRes.data.booking.venueName === "Blue Tokai Coffee Roasters", "Venue name matches");

    // 4. Host acceptance
    const acceptRes = await makeRequest(`/api/bookings/${bookingId}/respond`, "POST", {
      action: "ACCEPT",
    });
    assert(acceptRes.status === 200, "POST /api/bookings/[id]/respond returns 200 OK");
    assert(acceptRes.data.booking.status === "CONFIRMED", "Booking status flipped to CONFIRMED");

    // 5. Host decline flow on another booking
    const secondBooking = await makeRequest("/api/bookings/create", "POST", {
      companionId: "comp_01",
      activityId: "act_02",
      durationHours: 2,
      venueName: "Third Wave Coffee",
      venueAddress: "Indiranagar, Bengaluru",
    });
    const declineRes = await makeRequest(`/api/bookings/${secondBooking.data.booking.id}/respond`, "POST", {
      action: "DECLINE",
    });
    assert(declineRes.status === 200, "Host decline returns 200 OK");
    assert(declineRes.data.booking.status === "CANCELLED_BY_COMPANION", "Status flipped to CANCELLED_BY_COMPANION");
    assert(declineRes.data.booking.escrowStatus === "REFUNDED_TO_MEMBER", "Escrow flipped to REFUNDED_TO_MEMBER");

    // 6. SLA Overdue Cron Check
    const cronSlaRes = await makeRequest("/api/cron/check-sla", "POST");
    assert(cronSlaRes.status === 200, "POST /api/cron/check-sla returns 200 OK");
    assert(cronSlaRes.data.success === true, "SLA cron executed cleanly");

    console.log("==================================================");
    console.log(`LIVE PHASE 4 TEST RESULTS: ${passed}/${total} PASSED`);
    console.log("==================================================");
  } catch (err) {
    console.error("Live test failed with exception:", err);
    process.exitCode = 1;
  }
}

run();
