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
  console.log("RUNNING LIVE PHASE 6 HANDSHAKE & PAYOUT API TEST");
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
    // 1. Create a new booking
    const createRes = await makeRequest("/api/bookings/create", "POST", {
      companionId: "comp_01",
      activityId: "act_01",
      durationHours: 1,
      venueName: "Blue Tokai Coffee Roasters",
      venueAddress: "Hauz Khas Village, New Delhi",
      name: "Rohit Verma",
      phone: "+919811223399",
    });
    assert(createRes.status === 200, "POST /api/bookings/create returns 200 OK");
    const bookingId = createRes.data.booking.id;
    const correctPin = createRes.data.booking.verificationPin;
    assert(typeof correctPin === "string" && correctPin.length === 4, "4-digit verification PIN generated");

    // 2. Companion accepts booking
    const acceptRes = await makeRequest(`/api/bookings/${bookingId}/respond`, "POST", {
      action: "ACCEPT",
    });
    assert(acceptRes.status === 200, "Companion accepts booking successfully");
    assert(acceptRes.data.booking.status === "CONFIRMED", "Booking status is CONFIRMED");

    // 3. Test wrong PIN submission
    const wrongPinRes = await makeRequest(`/api/session/${bookingId}/verify-pin`, "POST", {
      pin: "0000",
    });
    assert(wrongPinRes.status === 400, "POST /api/session/[id]/verify-pin with wrong PIN returns 400 Bad Request");
    assert(wrongPinRes.data.success === false, "Wrong PIN rejected with success: false");

    // 4. Test valid PIN Handshake submission
    const validPinRes = await makeRequest(`/api/session/${bookingId}/verify-pin`, "POST", {
      pin: correctPin,
    });
    assert(validPinRes.status === 200, "POST /api/session/[id]/verify-pin with correct PIN returns 200 OK");
    assert(validPinRes.data.success === true, "PIN handshake verified successfully");
    assert(validPinRes.data.booking.status === "IN_PROGRESS", "Session status flipped to IN_PROGRESS");
    assert(typeof validPinRes.data.booking.pinVerifiedAt === "string", "pinVerifiedAt timestamp recorded");

    // 5. Test Emergency SOS trigger during session
    const sosRes = await makeRequest(`/api/session/${bookingId}/sos`, "POST", {
      latitude: 28.5535,
      longitude: 77.1945,
    });
    assert(sosRes.status === 200, "POST /api/session/[id]/sos returns 200 OK");
    assert(sosRes.data.emergencyDial === "112", "Emergency dial routes to 112");
    assert(typeof sosRes.data.alertId === "string", "SOS alert record ID generated");

    // 6. Complete Session & Release Cashfree Escrow Payout
    const completeRes = await makeRequest(`/api/session/${bookingId}/complete`, "POST");
    assert(completeRes.status === 200, "POST /api/session/[id]/complete returns 200 OK");
    assert(completeRes.data.success === true, "Session completion success flag is true");
    assert(completeRes.data.booking.status === "COMPLETED", "Booking status flipped to COMPLETED");
    assert(completeRes.data.booking.escrowStatus === "RELEASED_TO_HOST", "Escrow status released to RELEASED_TO_HOST");
    assert(completeRes.data.payout?.gateway === "CASHFREE", "Payout gateway identified as CASHFREE");
    assert(completeRes.data.payout?.amount === 499.00, "Net payout amount is ₹499.00");
    assert(completeRes.data.payout?.recipientUpiId === "vanshika@okhdfcbank", "Payout directed to host UPI handle");
    assert(typeof completeRes.data.payout?.utr === "string", "Bank UTR reference number generated");

    // 7. Post-Session Review & Rating
    const reviewRes = await makeRequest(`/api/session/${bookingId}/review`, "POST", {
      score: 5,
      comment: "Punctual, intelligent discussion on books, and completely safe public venue experience.",
      tags: ["Punctual", "Articulate", "Safe & Respectful"],
    });
    assert(reviewRes.status === 200, "POST /api/session/[id]/review returns 200 OK");
    assert(reviewRes.data.success === true, "Review submitted successfully");
    assert(reviewRes.data.review.score === 5, "Review rating recorded as 5 stars");

    console.log("==================================================");
    console.log(`LIVE PHASE 6 API TEST RESULTS: ${passed}/${total} PASSED`);
    console.log("==================================================");
  } catch (err) {
    console.error("Live test failed with exception:", err);
    process.exitCode = 1;
  }
}

run();
