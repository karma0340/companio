import { cookies } from "next/headers";
import { signUserToken, verifyUserToken, UserTokenPayload } from "./auth";

export const SESSION_COOKIE_NAME = "companio_session";

export async function setSessionCookie(payload: UserTokenPayload, expiresIn = "7d"): Promise<string> {
  const token = signUserToken(payload, expiresIn as any);
  const cookieStore = cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return token;
}

export async function getSession(): Promise<UserTokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
