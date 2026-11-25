import crypto from "crypto";

export interface RazorpayOrderResult {
  success: boolean;
  orderId: string;
  amount: number; // in paise
  currency: string;
  isMock: boolean;
  error?: string;
}

export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) return false;
  if (
    keyId.includes("placeholder") ||
    keySecret.includes("placeholder") ||
    keyId.includes("MOCK") ||
    keySecret.includes("mock")
  ) {
    return false;
  }
  return true;
}

export function getRazorpayKeyId(): string {
  if (isRazorpayConfigured()) {
    return process.env.RAZORPAY_KEY_ID!.trim();
  }
  return "";
}

/**
 * Creates a real Razorpay order. Never creates mock unpaid fallback orders in production
 * or when live gateway credentials are active.
 */
export async function createRazorpayOrder(
  amountInPaise: number,
  currency: string = "INR",
  receipt?: string,
  notes?: Record<string, string>
): Promise<RazorpayOrderResult> {
  if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
    throw new Error("Invalid order amount.");
  }

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (isRazorpayConfigured() && keyId && keySecret) {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: Math.round(amountInPaise),
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.id) {
      const msg = data?.error?.description || "Payment gateway order creation failed.";
      console.error("[RAZORPAY ORDER ERROR]:", msg);
      throw new Error(msg);
    }

    return {
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      isMock: false,
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Payment gateway is not configured in production.");
  }

  // Strictly local development fallback when live Razorpay keys are intentionally absent
  const devOrderId = `order_dev_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
  return {
    success: true,
    orderId: devOrderId,
    amount: Math.round(amountInPaise),
    currency,
    isMock: true,
  };
}

/**
 * Verifies cryptographic HMAC-SHA256 Razorpay signature using timing-safe comparison.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature?: string
): { isValid: boolean; reason?: string } {
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (isRazorpayConfigured() && keySecret) {
    if (!orderId || !paymentId || !signature) {
      return { isValid: false, reason: "Missing Razorpay payment signature." };
    }

    try {
      const expectedHex = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      const expectedBuf = Buffer.from(expectedHex, "utf8");
      const providedBuf = Buffer.from(String(signature).trim(), "utf8");

      if (expectedBuf.length !== providedBuf.length) {
        return { isValid: false, reason: "Invalid payment signature." };
      }

      const isValid = crypto.timingSafeEqual(expectedBuf, providedBuf);
      return {
        isValid,
        reason: isValid ? undefined : "Invalid cryptographic payment signature.",
      };
    } catch (err) {
      return { isValid: false, reason: (err as Error).message };
    }
  }

  if (process.env.NODE_ENV === "production") {
    return { isValid: false, reason: "Payment verification secret missing in production." };
  }

  return {
    isValid: Boolean(paymentId && paymentId.startsWith("pay_")),
    reason: paymentId ? undefined : "Missing payment ID.",
  };
}

/**
 * Verifies Razorpay server-to-server webhook HMAC-SHA256 signature.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret?: string
): boolean {
  const secret =
    webhookSecret ||
    process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ||
    process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret || !signature) return false;
  try {
    const expectedHex = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    const expectedBuf = Buffer.from(expectedHex, "utf8");
    const providedBuf = Buffer.from(signature.trim(), "utf8");
    if (expectedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}

export function isValidUpiId(upiId: string): boolean {
  const clean = (upiId || "").trim();
  return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z0-9]{2,64}$/.test(clean);
}

export function getRazorpayXAccountNumber(): string {
  return (process.env.RAZORPAYX_ACCOUNT_NUMBER || "").replace(/^["']|["']$/g, "").trim();
}

export function isRazorpayXConfigured(): boolean {
  return isRazorpayConfigured() && Boolean(getRazorpayXAccountNumber());
}

function getRazorpayAuthHeader(): string | null {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) return null;
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export async function ensureRazorpayXContactAndUpiFundAccount(params: {
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  upiId: string;
  existingContactId?: string | null;
  existingFundAccountId?: string | null;
}): Promise<{
  success: boolean;
  contactId?: string;
  fundAccountId?: string;
  error?: string;
}> {
  const authHeader = getRazorpayAuthHeader();
  if (!authHeader || !isRazorpayXConfigured()) {
    return { success: false, error: "RazorpayX is not configured." };
  }

  try {
    let contactId = params.existingContactId || "";
    if (!contactId) {
      const cleanPhone = (params.phone || "").replace(/\D/g, "").slice(-10);
      const contactRes = await fetch("https://api.razorpay.com/v1/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          name: (params.name || "Meetzy Host").slice(0, 50),
          ...(params.email ? { email: params.email } : {}),
          ...(cleanPhone.length === 10 ? { contact: `+91${cleanPhone}` } : {}),
          type: "vendor",
          reference_id: params.userId.slice(0, 40),
        }),
      });
      const contactData = await contactRes.json().catch(() => ({}));
      if (!contactRes.ok || !contactData?.id) {
        return {
          success: false,
          error: contactData?.error?.description || "Failed to register RazorpayX host contact.",
        };
      }
      contactId = contactData.id;
    }

    let fundAccountId = params.existingFundAccountId || "";
    if (!fundAccountId) {
      const faRes = await fetch("https://api.razorpay.com/v1/fund_accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          contact_id: contactId,
          account_type: "vpa",
          vpa: {
            address: params.upiId.trim(),
          },
        }),
      });
      const faData = await faRes.json().catch(() => ({}));
      if (!faRes.ok || !faData?.id) {
        return {
          success: false,
          contactId,
          error: faData?.error?.description || "Failed to register RazorpayX UPI fund account.",
        };
      }
      fundAccountId = faData.id;
    }

    return { success: true, contactId, fundAccountId };
  } catch (err) {
    return { success: false, error: (err as Error).message || "RazorpayX contact setup failed." };
  }
}

export async function createRazorpayXUpiPayout(params: {
  fundAccountId: string;
  amountInPaise: number;
  referenceId: string;
  narration: string;
  idempotencyKey: string;
  notes?: Record<string, string>;
}): Promise<{
  success: boolean;
  payoutId?: string;
  status?: "PENDING" | "SUCCESS" | "FAILED";
  utr?: string;
  error?: string;
}> {
  const authHeader = getRazorpayAuthHeader();
  const accountNumber = getRazorpayXAccountNumber();
  if (!authHeader || !accountNumber) {
    return { success: false, error: "RazorpayX source account number is not configured." };
  }

  try {
    const res = await fetch("https://api.razorpay.com/v1/payouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        "X-Payout-Idempotency": params.idempotencyKey.slice(0, 36),
      },
      body: JSON.stringify({
        account_number: accountNumber,
        fund_account_id: params.fundAccountId,
        amount: Math.round(params.amountInPaise),
        currency: "INR",
        mode: "UPI",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: params.referenceId.slice(0, 40),
        narration: params.narration.slice(0, 30),
        notes: params.notes || {},
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.id) {
      return {
        success: false,
        status: "FAILED",
        error: data?.error?.description || "RazorpayX UPI payout initiation failed.",
      };
    }

    const rzpStatus = String(data.status || "").toLowerCase();
    const mappedStatus: "PENDING" | "SUCCESS" | "FAILED" =
      rzpStatus === "processed"
        ? "SUCCESS"
        : rzpStatus === "rejected" || rzpStatus === "cancelled" || rzpStatus === "reversed"
        ? "FAILED"
        : "PENDING";

    return {
      success: mappedStatus !== "FAILED",
      payoutId: data.id,
      status: mappedStatus,
      utr: data.utr || data.id,
      error: mappedStatus === "FAILED" ? data.status_details?.description || "Payout rejected" : undefined,
    };
  } catch (err) {
    return {
      success: false,
      status: "FAILED",
      error: (err as Error).message || "RazorpayX API request failed.",
    };
  }
}

export async function createRazorpayRefund(params: {
  paymentId: string;
  amountInPaise?: number;
  notes?: Record<string, string>;
}): Promise<{ success: boolean; refundId?: string; status?: string; error?: string }> {
  const authHeader = getRazorpayAuthHeader();
  if (!authHeader || !isRazorpayConfigured()) {
    return { success: false, error: "Razorpay credentials not configured for automated refunds." };
  }
  if (!params.paymentId || !params.paymentId.startsWith("pay_")) {
    return { success: false, error: "Valid Razorpay payment ID missing for refund." };
  }

  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(params.paymentId)}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        ...(params.amountInPaise ? { amount: Math.round(params.amountInPaise) } : {}),
        speed: "normal",
        notes: params.notes || {},
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.id) {
      return {
        success: false,
        error: data?.error?.description || "Razorpay refund initiation failed.",
      };
    }

    return {
      success: true,
      refundId: data.id,
      status: data.status || "processed",
    };
  } catch (err) {
    return { success: false, error: (err as Error).message || "Razorpay refund API failed." };
  }
}

export async function fetchRazorpayPaymentDetails(paymentId: string): Promise<{
  success: boolean;
  paymentId: string;
  captured: boolean;
  status: string;
  settlementId: string | null;
  settled: boolean;
  error?: string;
}> {
  const cleanId = (paymentId || "").trim();
  const authHeader = getRazorpayAuthHeader();
  if (!cleanId.startsWith("pay_") || !authHeader || !isRazorpayConfigured()) {
    return {
      success: false,
      paymentId: cleanId,
      captured: false,
      status: "unverified",
      settlementId: null,
      settled: false,
      error: "Razorpay credentials or payment ID unavailable.",
    };
  }

  try {
    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(cleanId)}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.id) {
      return {
        success: false,
        paymentId: cleanId,
        captured: false,
        status: "error",
        settlementId: null,
        settled: false,
        error: data?.error?.description || "Unable to fetch Razorpay payment status.",
      };
    }

    const settlementId = data.settlement_id ? String(data.settlement_id) : null;
    const status = String(data.status || "").toLowerCase();
    const captured = Boolean(data.captured) || status === "captured";

    return {
      success: true,
      paymentId: cleanId,
      captured,
      status,
      settlementId,
      settled: Boolean(settlementId),
    };
  } catch (err) {
    return {
      success: false,
      paymentId: cleanId,
      captured: false,
      status: "error",
      settlementId: null,
      settled: false,
      error: (err as Error).message || "Razorpay status check failed.",
    };
  }
}
