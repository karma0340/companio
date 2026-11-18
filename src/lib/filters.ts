/**
 * Contact Shielding & Anti-Disintermediation Filter
 * Intercepts phone numbers, messaging links, social handles, and payment IDs
 */

export interface FilterResult {
  isClean: boolean;
  filteredContent: string;
  redactionReason?: string;
  violationsDetected: string[];
}

export function filterChatMessage(rawContent: string): FilterResult {
  let content = rawContent;
  const violations: string[] = [];

  // 1. Indian Phone Numbers
  // Matches: +91 9876543210, 9876543210, 98765 43210, 9876-543210
  const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g;
  if (phoneRegex.test(content)) {
    violations.push("PHONE_NUMBER");
    content = content.replace(phoneRegex, "[PHONE NUMBER REDACTED FOR SAFETY]");
  }

  // 2. WhatsApp / Telegram Direct Chat Links
  const waRegex = /(?:wa\.me\/\d+|whatsapp\.com\/|t\.me\/[\w_]+|chat\.whatsapp\.com\/[\w\d]+)/gi;
  if (waRegex.test(content)) {
    violations.push("EXTERNAL_CHAT_LINK");
    content = content.replace(waRegex, "[EXTERNAL LINK REDACTED]");
  }

  // 3. UPI Handles (Checked BEFORE generic @ handles so user@bank is treated as payment)
  // Matches: username@okhdfcbank, user@paytm, user@ybl, etc.
  const upiRegex = /[\w.\-_]+@(okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|ibl|upi|apl|axl|fbl)/gi;
  if (upiRegex.test(content)) {
    violations.push("UPI_PAYMENT_ID");
    content = content.replace(upiRegex, "[PAYMENT HANDLE REDACTED]");
  }

  // 4. Email Addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  if (emailRegex.test(content)) {
    violations.push("EMAIL_ADDRESS");
    content = content.replace(emailRegex, "[EMAIL REDACTED]");
  }

  // 5. Instagram / Snapchat Handles
  // Matches: @username, "my insta is username", "ig: username"
  const socialHandleRegex = /(?:@[\w._]{3,30}|(?:insta|instagram|ig|snap|snapchat)[\s:]+[\w._]{3,30})/gi;
  if (socialHandleRegex.test(content)) {
    violations.push("SOCIAL_HANDLE");
    content = content.replace(socialHandleRegex, "[SOCIAL HANDLE REDACTED]");
  }

  return {
    isClean: violations.length === 0,
    filteredContent: content,
    redactionReason: violations.length > 0 ? violations.join(", ") : undefined,
    violationsDetected: violations,
  };
}
