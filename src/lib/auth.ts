import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

// Unified JWT / NextAuth secret resolution with robust fallbacks
export function getJwtSecret(): string {
  const secret =
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "15e0475f24074512e0674de2d2adc71a02f96fb94bdded4bd40a047997c27ecd";

  // Sanitize any accidental quotes or whitespace from env configs
  return secret.replace(/^["']|["']$/g, "").trim();
}

export interface UserTokenPayload {
  userId: string;
  phone: string;
  email?: string | null;
  name?: string | null;
  role: "MEMBER" | "COMPANION" | "ADMIN";
  isUnlocked: boolean;
  activePassTier?: string | null;
  passExpiresAt?: string | null;
}

export function signUserToken(payload: UserTokenPayload, expiresIn: SignOptions["expiresIn"] = "7d"): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyUserToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as UserTokenPayload;
  } catch (error) {
    return null;
  }
}
