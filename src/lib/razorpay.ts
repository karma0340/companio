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
