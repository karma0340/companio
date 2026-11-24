import { NextResponse } from "next/server";
import { clearSessionCookie, getSessionCookieName } from "@/lib/session";

export async function POST() {
  await clearSessionCookie();
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  const cookieName = getSessionCookieName();
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
