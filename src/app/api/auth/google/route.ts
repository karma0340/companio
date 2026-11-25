import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function getRedirectUri(req: NextRequest): string {
  const envUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return `${envUrl.replace(/\/$/, "")}/api/auth/google/callback`;
  }

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}/api/auth/google/callback`;
}

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("[GOOGLE OAUTH ERROR]: Missing GOOGLE_CLIENT_ID in environment variables");
      return NextResponse.redirect(new URL("/login?error=missing_google_client_id", req.url));
    }

    const { searchParams } = new URL(req.url);
    const intent = searchParams.get("intent") === "host" ? "host" : "member";
    const nextUrl = searchParams.get("next") || searchParams.get("redirect") || (intent === "host" ? "/onboarding" : "/explore");
    const referralCode = searchParams.get("ref") || "";

    // Generate cryptographically secure random token for CSRF protection
    const stateToken = crypto.randomBytes(32).toString("hex");
    const statePayload = JSON.stringify({
      token: stateToken,
      intent,
      next: nextUrl,
      ref: referralCode,
      timestamp: Date.now(),
    });

    const redirectUri = getRedirectUri(req);

    // Build standard Google OAuth 2.0 authorization URL
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", stateToken);
    googleAuthUrl.searchParams.set("access_type", "online");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    const response = NextResponse.redirect(googleAuthUrl.toString());

    // Store state in an encrypted/HttpOnly secure cookie valid for 10 minutes
    response.cookies.set("google_oauth_state", statePayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error: any) {
    console.error("[GOOGLE OAUTH INIT ERROR]:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_init_failed", req.url));
  }
}
