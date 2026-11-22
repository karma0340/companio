import { cookies } from "next/headers";
import { signUserToken, verifyUserToken, UserTokenPayload } from "./auth";

export function getSessionCookieName(): string {
  const name = process.env.SESSION_COOKIE_NAME || "companio_session";
  return name.replace(/^["']|["']$/g, "").trim();
}

export const SESSION_COOKIE_NAME = getSessionCookieName();

export async function setSessionCookie(payload: UserTokenPayload, expiresIn = "7d"): Promise<string> {
  const { iat, exp, nbf, jti, ...cleanPayload } = (payload as any) || {};
  const token = signUserToken(cleanPayload as UserTokenPayload, expiresIn as any);
  const cookieStore = cookies();
  const cookieName = getSessionCookieName();
  
  try {
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  } catch (err) {
    console.warn("[SESSION COOKIE SET WARN]:", err);
  }

  return token;
}

export async function getSession(): Promise<UserTokenPayload | null> {
  const cookieStore = cookies();
  const cookieName = getSessionCookieName();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  const cookieName = getSessionCookieName();
  cookieStore.delete(cookieName);
}
