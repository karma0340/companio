import crypto from "crypto";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const failedAttempts = new Map<string, { count: number; resetAt: number }>();

function getOperatorConfig() {
  const email = (process.env.SEEDED_OPERATOR_EMAIL || "").replace(/^["']|["']$/g, "").trim().toLowerCase();
  const passwordHash = (process.env.SEEDED_OPERATOR_PASSWORD_HASH || "").replace(/^["']|["']$/g, "").trim();
  const accessKey = (process.env.SEEDED_ACCESS_KEY || "").replace(/^["']|["']$/g, "").trim();
  return { email, passwordHash, accessKey };
}

export function isSeededOperatorConfigured(): boolean {
  const { email, passwordHash, accessKey } = getOperatorConfig();
  return Boolean(email && passwordHash && passwordHash.includes(":") && accessKey.length >= 16);
}

export function verifySeededPortalKey(providedKey: string | null | undefined): boolean {
  const { accessKey } = getOperatorConfig();
  const candidate = String(providedKey || "").trim();
  if (!accessKey || accessKey.length < 16 || !candidate) {
    return false;
  }
  try {
    const a = Buffer.from(accessKey, "utf8");
    const b = Buffer.from(candidate, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Generates a salted scrypt hash in the format `<saltHex>:<derivedKeyHex>`
 * suitable for storing in SEEDED_OPERATOR_PASSWORD_HASH.
 */
export function hashOperatorPassword(password: string): string {
  const saltHex = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, saltHex, 64).toString("hex");
  return `${saltHex}:${derived}`;
}

export function verifySeededOperatorCredentials(email: string, password: string): boolean {
  const { email: expectedEmail, passwordHash } = getOperatorConfig();
  if (!expectedEmail || !passwordHash || !passwordHash.includes(":")) {
    return false;
  }

  const normalizedInputEmail = String(email || "").trim().toLowerCase();
  if (normalizedInputEmail !== expectedEmail) {
    return false;
  }

  const [saltHex, expectedHashHex] = passwordHash.split(":");
  if (!saltHex || !expectedHashHex) {
    return false;
  }

  try {
    const expectedBuffer = Buffer.from(expectedHashHex, "hex");
    const derivedBuffer = crypto.scryptSync(String(password || ""), saltHex, 64);
    if (expectedBuffer.length !== derivedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(expectedBuffer, derivedBuffer);
  } catch {
    return false;
  }
}

export function checkSeededAuthRateLimit(clientKey: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = failedAttempts.get(clientKey);
  if (!record || now > record.resetAt) {
    return { allowed: true };
  }
  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }
  return { allowed: true };
}

export function recordSeededAuthFailure(clientKey: string): void {
  const now = Date.now();
  const existing = failedAttempts.get(clientKey);
  if (!existing || now > existing.resetAt) {
    failedAttempts.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }
  existing.count += 1;
}

export function clearSeededAuthFailures(clientKey: string): void {
  failedAttempts.delete(clientKey);
}
