import { NextResponse } from "next/server";
import { clearSessionCookie, getSessionCookieName } from "@/lib/session";

export async function POST() {
  await clearSessionCookie();
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  const possibleCookies = [
    getSessionCookieName(),
    "companio_session",
    "auth_token",
    "session",
    "token",
  ];

  for (const cookieName of possibleCookies) {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  }

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}
