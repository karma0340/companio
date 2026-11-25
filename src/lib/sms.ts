/**
 * Production SMS OTP Dispatcher for Meetzy Club
 * Primary Gateway: Fast2SMS (Quick SMS route 'q' or DLT route 'dlt')
 */

export interface SendSmsResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
  isMock: boolean;
}

function cleanPhoneNumber(rawPhone: string): { tenDigit: string; e164: string } {
  const digitsOnly = rawPhone.replace(/\D/g, "");
  const tenDigit = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
  const e164 = `+91${tenDigit}`;
  return { tenDigit, e164 };
}

/**
 * Dispatches an OTP via Fast2SMS (or configured real SMS provider) without mock fallbacks.
 */
export async function sendSmsOtp(
  recipientPhone: string,
  otpCode: string
): Promise<SendSmsResult> {
  const provider = (process.env.SMS_PROVIDER || "FAST2SMS").trim().toUpperCase();
  const apiKey = (process.env.SMS_API_KEY || "").trim();
  const { tenDigit, e164 } = cleanPhoneNumber(recipientPhone);

  if (!/^[6-9]\d{9}$/.test(tenDigit)) {
    return {
      success: false,
      provider,
      error: "Please enter a valid 10-digit Indian mobile number.",
      isMock: false,
    };
  }

  console.log(`[SMS DISPATCH] Target: ${e164} | Provider: ${provider}`);

  // 1. FAST2SMS Integration
  if (provider === "FAST2SMS") {
    const fast2smsKey = (process.env.FAST2SMS_API_KEY || apiKey).trim();
    if (!fast2smsKey) {
      return {
        success: false,
        provider: "FAST2SMS",
        error: "SMS gateway is not configured (missing FAST2SMS_API_KEY).",
        isMock: false,
      };
    }

    const dltSenderId = (process.env.FAST2SMS_SENDER_ID || "").trim();
    const dltMessageId = (process.env.FAST2SMS_MESSAGE_ID || "").trim();
    const configuredRoute = (process.env.FAST2SMS_ROUTE || "").trim().toLowerCase();
    const webOtpDomain = (process.env.NEXT_PUBLIC_APP_DOMAIN || "meetzy.club")
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .trim();

    // Use cost-effective DLT route ('dlt') automatically when DLT Sender & Message ID are configured
    const useDltRoute =
      configuredRoute === "dlt" || (Boolean(dltSenderId) && Boolean(dltMessageId));

    const payload: Record<string, string | number> = useDltRoute
      ? {
          route: "dlt",
          sender_id: dltSenderId,
          message: dltMessageId,
          variables_values: otpCode,
          flash: 0,
          numbers: tenDigit,
        }
      : {
          route: configuredRoute === "otp" ? "otp" : "q",
          ...(configuredRoute === "otp"
            ? { variables_values: otpCode }
            : {
                message: `Your Meetzy Club verification code is ${otpCode}. Valid for 5 minutes. @${webOtpDomain} #${otpCode}`,
                language: "english",
              }),
          flash: 0,
          numbers: tenDigit,
        };

    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: fast2smsKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.return) {
        const errorDetail = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message || `SMS gateway rejected request (HTTP ${response.status})`;
        console.error("[SMS GATEWAY ERROR]:", errorDetail);
        return {
          success: false,
          provider: "SMS",
          error: "Unable to send SMS verification code right now. Please retry shortly.",
          isMock: false,
        };
      }

      console.log(`[SMS DISPATCH SUCCESS] Sent OTP to ${tenDigit}. Request ID: ${data.request_id}`);
      return {
        success: true,
        provider: "SMS",
        messageId: data.request_id,
        isMock: false,
      };
    } catch (err) {
      const errMsg = (err as Error).message || "Network error contacting SMS service.";
      console.error("[SMS NETWORK ERROR]:", errMsg);
      return {
        success: false,
        provider: "SMS",
        error: "SMS verification service temporarily unreachable. Please retry.",
        isMock: false,
      };
    }
  }

  // 2. 2FACTOR Integration
  if (provider === "2FACTOR" || provider === "TWOFACTOR") {
    const twoFactorKey = (process.env.TWOFACTOR_API_KEY || apiKey).trim();
    if (!twoFactorKey) {
      return { success: false, provider: "2FACTOR", error: "Missing TWOFACTOR_API_KEY.", isMock: false };
    }
    try {
      const url = `https://2factor.in/API/V1/${encodeURIComponent(twoFactorKey)}/SMS/${tenDigit}/${otpCode}/OTP1`;
      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      if (data.Status !== "Success") {
        return { success: false, provider: "2FACTOR", error: data.Details || "2Factor dispatch failed", isMock: false };
      }
      return { success: true, provider: "2FACTOR", messageId: data.Details, isMock: false };
    } catch (err) {
      return { success: false, provider: "2FACTOR", error: (err as Error).message, isMock: false };
    }
  }

  // 3. MSG91 Integration
  if (provider === "MSG91") {
    const msg91AuthKey = (process.env.MSG91_AUTH_KEY || apiKey).trim();
    const templateId = (process.env.MSG91_TEMPLATE_ID || "").trim();
    if (!msg91AuthKey) {
      return { success: false, provider: "MSG91", error: "Missing MSG91_AUTH_KEY.", isMock: false };
    }
    try {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}&mobile=91${tenDigit}&authkey=${encodeURIComponent(msg91AuthKey)}&otp=${otpCode}`;
      const response = await fetch(url, { method: "POST" });
      const data = await response.json();
      if (data.type !== "success") {
        return { success: false, provider: "MSG91", error: data.message || "MSG91 dispatch failed", isMock: false };
      }
      return { success: true, provider: "MSG91", messageId: data.request_id, isMock: false };
    } catch (err) {
      return { success: false, provider: "MSG91", error: (err as Error).message, isMock: false };
    }
  }

  // 4. TWILIO Integration
  if (provider === "TWILIO") {
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = (apiKey || process.env.TWILIO_AUTH_TOKEN || "").trim();
    const fromNumber = process.env.TWILIO_FROM_NUMBER?.trim();
    if (!accountSid || !authToken || !fromNumber) {
      return { success: false, provider: "TWILIO", error: "Missing Twilio credentials.", isMock: false };
    }
    try {
      const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const bodyParams = new URLSearchParams({
        To: e164,
        From: fromNumber,
        Body: `Your Meetzy Club verification code is ${otpCode}. Valid for 5 minutes.`,
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
        return { success: false, provider: "TWILIO", error: data.message || "Twilio dispatch failed", isMock: false };
      }
      return { success: true, provider: "TWILIO", messageId: data.sid, isMock: false };
    } catch (err) {
      return { success: false, provider: "TWILIO", error: (err as Error).message, isMock: false };
    }
  }

  return {
    success: false,
    provider,
    error: `Unsupported SMS provider "${provider}". Please configure SMS_PROVIDER=FAST2SMS.`,
    isMock: false,
  };
}
