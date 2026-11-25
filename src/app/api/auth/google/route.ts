import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function sanitizeRedirectPath(rawNext: string | null): string {
  if (!rawNext || !rawNext.startsWith("/") || rawNext.startsWith("//")) {
    return "/explore";
  }
  return rawNext === "/login" ? "/explore" : rawNext;
}

function getRedirectUri(req: NextRequest): string {
  const envUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return `${envUrl.replace(/\/$/, "")}/api/auth/google/callback`;
  }
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}/api/auth/google/callback`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(
        "/login?oauth_error=Google+Sign-In+is+not+configured+on+this+server",
        request.nextUrl.origin
      )
    );
  }

  const intent = request.nextUrl.searchParams.get("intent") === "host" ? "host" : "member";
  const nextPath = sanitizeRedirectPath(
    request.nextUrl.searchParams.get("next") || request.nextUrl.searchParams.get("redirect")
  );
  const referralCode = (request.nextUrl.searchParams.get("ref") || "")
    .trim()
    .toUpperCase()
    .slice(0, 16);

  const redirectUri = getRedirectUri(request);
  const state = crypto.randomBytes(24).toString("hex");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("access_type", "online");
  authUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set(
    "companio_google_state",
    JSON.stringify({
      state,
      intent,
      next: nextPath,
      ref: referralCode,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    }
  );

  return response;
}
