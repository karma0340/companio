import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "companio-production-secure-jwt-secret-key-32chars";

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
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyUserToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
  } catch (error) {
    return null;
  }
}
