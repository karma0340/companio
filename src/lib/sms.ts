/**
 * Multi-Provider SMS OTP Dispatcher for Companio
 * Supported Providers:
 * - FAST2SMS (India Quick OTP)
 * - 2FACTOR (2factor.in Indian OTP Gateway)
 * - MSG91 (Enterprise Indian SMS Gateway)
 * - TWILIO (International SMS Gateway)
 * - SANDBOX (Simulated Instant Development Fallback)
 */

export interface SendSmsResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
  isMock: boolean;
}

/**
 * Normalizes phone number to 10-digit Indian standard without country code prefix,
 * or full E.164 format with plus sign.
 */
function cleanPhoneNumber(rawPhone: string): { tenDigit: string; e164: string } {
  const digitsOnly = rawPhone.replace(/\D/g, "");
  const tenDigit = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
  const e164 = `+91${tenDigit}`;
  return { tenDigit, e164 };
}

/**
 * Dispatches an SMS OTP via the configured provider
 */
export async function sendSmsOtp(
  recipientPhone: string,
  otpCode: string
): Promise<SendSmsResult> {
  const provider = (process.env.SMS_PROVIDER || "SANDBOX").trim().toUpperCase();
  const apiKey = (process.env.SMS_API_KEY || "").trim();
  const { tenDigit, e164 } = cleanPhoneNumber(recipientPhone);

  console.log(`[SMS DISPATCH INITIATED] Target: ${e164} via Provider: ${provider}`);

  // 1. FAST2SMS Integration (Fast Indian OTP)
  if (provider === "FAST2SMS") {
    const fast2smsKey = apiKey || process.env.FAST2SMS_API_KEY?.trim();
    if (!fast2smsKey) {
      console.warn("[FAST2SMS] Missing SMS_API_KEY or FAST2SMS_API_KEY. Falling back to sandbox.");
      return mockSmsFallback("FAST2SMS", recipientPhone, otpCode, "Missing API key");
    }

    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: fast2smsKey,
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otpCode,
          numbers: tenDigit,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.return) {
        throw new Error(data.message?.[0] || data.message || "Fast2SMS dispatch failed");
      }

      console.log(`[FAST2SMS SUCCESS] Sent OTP to ${tenDigit}. Request ID: ${data.request_id}`);
      return {
        success: true,
        provider: "FAST2SMS",
        messageId: data.request_id,
        isMock: false,
      };
    } catch (err) {
      console.error("[FAST2SMS ERROR]:", (err as Error).message);
      return mockSmsFallback("FAST2SMS", recipientPhone, otpCode, (err as Error).message);
    }
  }

  // 2. 2FACTOR Integration (2factor.in)
  if (provider === "2FACTOR" || provider === "TWOFACTOR") {
    const twoFactorKey = apiKey || process.env.TWOFACTOR_API_KEY?.trim();
    if (!twoFactorKey) {
      console.warn("[2FACTOR] Missing SMS_API_KEY or TWOFACTOR_API_KEY. Falling back to sandbox.");
      return mockSmsFallback("2FACTOR", recipientPhone, otpCode, "Missing API key");
    }

    try {
      // 2Factor.in standard OTP URL
      const url = `https://2factor.in/API/V1/${encodeURIComponent(twoFactorKey)}/SMS/${tenDigit}/${otpCode}/OTP1`;
      const response = await fetch(url, { method: "GET" });
      const data = await response.json();

      if (data.Status !== "Success") {
        throw new Error(data.Details || "2Factor dispatch failed");
      }

      console.log(`[2FACTOR SUCCESS] Sent OTP to ${tenDigit}. Session ID: ${data.Details}`);
      return {
        success: true,
        provider: "2FACTOR",
        messageId: data.Details,
        isMock: false,
      };
    } catch (err) {
      console.error("[2FACTOR ERROR]:", (err as Error).message);
      return mockSmsFallback("2FACTOR", recipientPhone, otpCode, (err as Error).message);
    }
  }

  // 3. MSG91 Integration
  if (provider === "MSG91") {
    const msg91AuthKey = apiKey || process.env.MSG91_AUTH_KEY?.trim();
    const templateId = process.env.MSG91_TEMPLATE_ID?.trim();
    if (!msg91AuthKey) {
      console.warn("[MSG91] Missing SMS_API_KEY or MSG91_AUTH_KEY. Falling back to sandbox.");
      return mockSmsFallback("MSG91", recipientPhone, otpCode, "Missing API key");
    }

    try {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId || "")}&mobile=91${tenDigit}&authkey=${encodeURIComponent(msg91AuthKey)}&otp=${otpCode}`;
      const response = await fetch(url, { method: "POST" });
      const data = await response.json();

      if (data.type !== "success") {
        throw new Error(data.message || "MSG91 dispatch failed");
      }

      console.log(`[MSG91 SUCCESS] Sent OTP to ${tenDigit}. Request ID: ${data.request_id}`);
      return {
        success: true,
        provider: "MSG91",
        messageId: data.request_id,
        isMock: false,
      };
    } catch (err) {
      console.error("[MSG91 ERROR]:", (err as Error).message);
      return mockSmsFallback("MSG91", recipientPhone, otpCode, (err as Error).message);
    }
  }

  // 4. TWILIO Integration
  if (provider === "TWILIO") {
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = (apiKey || process.env.TWILIO_AUTH_TOKEN || "").trim();
    const fromNumber = process.env.TWILIO_FROM_NUMBER?.trim();

    if (!accountSid || !authToken || !fromNumber) {
      console.warn("[TWILIO] Missing Twilio credentials. Falling back to sandbox.");
      return mockSmsFallback("TWILIO", recipientPhone, otpCode, "Missing Twilio credentials");
    }

    try {
      const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const bodyParams = new URLSearchParams({
        To: e164,
        From: fromNumber,
        Body: `Your Companio verification code is ${otpCode}. Valid for 5 minutes. Do not share this code with anyone.`,
      });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${authHeader}`,
          },
          body: bodyParams.toString(),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Twilio SMS dispatch failed");
      }

      console.log(`[TWILIO SUCCESS] Sent OTP to ${e164}. SID: ${data.sid}`);
      return {
        success: true,
        provider: "TWILIO",
        messageId: data.sid,
        isMock: false,
      };
    } catch (err) {
      console.error("[TWILIO ERROR]:", (err as Error).message);
      return mockSmsFallback("TWILIO", recipientPhone, otpCode, (err as Error).message);
    }
  }

  // 5. Default SANDBOX Mode (Zero-Config Simulation)
  return mockSmsFallback("SANDBOX", recipientPhone, otpCode);
}

/**
 * Fallback sandbox logger ensuring local and testing workflows never break
 */
function mockSmsFallback(
  provider: string,
  recipientPhone: string,
  otpCode: string,
  reason?: string
): SendSmsResult {
  console.log(
    `[SMS SANDBOX SIMULATION] Provider: ${provider}${reason ? ` (Fallback: ${reason})` : ""}. To: ${recipientPhone} -> Code: ${otpCode}`
  );
  return {
    success: true,
    provider: `${provider}_SANDBOX`,
    messageId: `msg_mock_${Date.now().toString(36)}`,
    isMock: true,
    error: reason,
  };
}
