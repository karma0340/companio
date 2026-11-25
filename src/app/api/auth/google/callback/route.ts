import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signUserToken } from "@/lib/auth";
import { getSessionCookieName, setSessionCookie } from "@/lib/session";
import { generateReferralCode, ensureUserWallet } from "@/lib/wallet";
import { CoinTransactionType, UserRole } from "@prisma/client";

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
  const cookieName = getSessionCookieName();

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    // 1. Handle user cancellation or OAuth provider error
    if (errorParam) {
      console.warn("[GOOGLE OAUTH CALLBACK]: Provider returned error:", errorParam);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorParam)}`, req.url));
    }

    if (!code || !state) {
      console.error("[GOOGLE OAUTH CALLBACK]: Missing code or state");
      return NextResponse.redirect(new URL("/login?error=invalid_oauth_response", req.url));
    }

    // 2. Validate state against secure HttpOnly cookie for CSRF defense
    const stateCookie = req.cookies.get("google_oauth_state")?.value;
    if (!stateCookie) {
      console.error("[GOOGLE OAUTH CALLBACK]: State cookie missing or expired");
      return NextResponse.redirect(new URL("/login?error=state_cookie_missing", req.url));
    }

    let stateData: { token: string; intent?: string; next?: string; ref?: string; timestamp?: number };
    try {
      stateData = JSON.parse(stateCookie);
    } catch {
      console.error("[GOOGLE OAUTH CALLBACK]: Failed to parse state cookie");
      return NextResponse.redirect(new URL("/login?error=invalid_state_format", req.url));
    }

    if (stateData.token !== state) {
      console.error("[GOOGLE OAUTH CALLBACK]: CSRF state mismatch detected");
      return NextResponse.redirect(new URL("/login?error=csrf_state_mismatch", req.url));
    }

    // Check state expiry (10 minutes)
    if (stateData.timestamp && Date.now() - stateData.timestamp > 10 * 60 * 1000) {
      console.error("[GOOGLE OAUTH CALLBACK]: State expired");
      return NextResponse.redirect(new URL("/login?error=state_expired", req.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("[GOOGLE OAUTH CALLBACK]: Google OAuth credentials missing in .env");
      return NextResponse.redirect(new URL("/login?error=server_auth_misconfigured", req.url));
    }

    const redirectUri = getRedirectUri(req);

    // 3. Exchange authorization code for Google access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error("[GOOGLE OAUTH CALLBACK]: Token exchange failed:", errBody);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 4. Fetch Google User Profile
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoResponse.ok) {
      console.error("[GOOGLE OAUTH CALLBACK]: Userinfo fetch failed");
      return NextResponse.redirect(new URL("/login?error=userinfo_fetch_failed", req.url));
    }

    const userInfo: {
      sub: string;
      email: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
    } = await userInfoResponse.json();

    if (!userInfo.sub || !userInfo.email) {
      console.error("[GOOGLE OAUTH CALLBACK]: Incomplete user profile from Google");
      return NextResponse.redirect(new URL("/login?error=incomplete_google_profile", req.url));
    }

    const emailNormalized = userInfo.email.toLowerCase().trim();

    // 5. Database lookup: Match by Google ID or existing Email
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: userInfo.sub }, { email: emailNormalized }],
      },
      include: {
        companion: {
          include: { city: true },
        },
        passes: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (dbUser) {
      // Existing user: Link Google ID if not already set, update avatar or name if missing
      const updateData: any = {};
      if (!dbUser.googleId) updateData.googleId = userInfo.sub;
      if (!dbUser.avatarUrl && userInfo.picture) updateData.avatarUrl = userInfo.picture;
      if (!dbUser.name && userInfo.name) updateData.name = userInfo.name;
      if (!dbUser.emailVerified && userInfo.email_verified) updateData.emailVerified = true;

      if (Object.keys(updateData).length > 0) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: updateData,
          include: {
            companion: {
              include: { city: true },
            },
            passes: {
              where: { status: "ACTIVE" },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });
      }

      await ensureUserWallet(dbUser.id);
    } else {
      // New User: Check referral code if provided
      let referredByUser = null;
      if (stateData.ref) {
        referredByUser = await prisma.user.findUnique({
          where: { referralCode: stateData.ref.trim().toUpperCase() },
          select: { id: true },
        });
      }

      let newReferralCode = generateReferralCode();
      let codeCollision = await prisma.user.findUnique({ where: { referralCode: newReferralCode } });
      while (codeCollision) {
        newReferralCode = generateReferralCode();
        codeCollision = await prisma.user.findUnique({ where: { referralCode: newReferralCode } });
      }

      const desiredRole: UserRole = stateData.intent === "host" ? "COMPANION" : "MEMBER";

      dbUser = await prisma.user.create({
        data: {
          googleId: userInfo.sub,
          email: emailNormalized,
          name: userInfo.name || "Member",
          avatarUrl: userInfo.picture || null,
          role: desiredRole,
          walletBalance: 0.0,
          coinBalance: 100,
          creditBalance: 100.0,
          emailVerified: Boolean(userInfo.email_verified),
          referralCode: newReferralCode,
          referredById: referredByUser?.id || null,
          isUnlocked: false,
          coinTransactions: {
            create: {
              type: CoinTransactionType.WELCOME_CREDIT,
              amount: 100,
              balanceAfter: 100,
              description: "Welcome bonus for joining Meetzy Club (+100 Coins)",
            },
          },
        },
        include: {
          companion: {
            include: { city: true },
          },
          passes: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }

    // 6. Sign session token matching standard application JWT payload
    const tokenPayload = {
      userId: dbUser.id,
      phone: dbUser.phone || "",
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role as "MEMBER" | "COMPANION" | "ADMIN",
      activeRole: (dbUser.role === "COMPANION" ? "host" : "member") as "member" | "host" | "admin",
      avatarUrl: dbUser.avatarUrl,
      isUnlocked: dbUser.isUnlocked,
      activePassTier: dbUser.activePassTier || (dbUser.passes?.[0]?.tier ?? null),
      passExpiresAt: dbUser.passExpiresAt?.toISOString() || null,
    };

    const sessionToken = signUserToken(tokenPayload, "7d");
    await setSessionCookie(tokenPayload, "7d");

    // 7. Determine final redirect destination
    let destination = stateData.next || (dbUser.role === "COMPANION" ? "/onboarding" : "/explore");
    if (!destination.startsWith("/")) {
      destination = "/explore";
    }

    const response = NextResponse.redirect(new URL(destination, req.url));

    // Guarantee session cookie on response headers for edge / reverse-proxy compatibility
    response.cookies.set(cookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Clean up temporary CSRF state cookie
    response.cookies.set("google_oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    console.error("[GOOGLE OAUTH CALLBACK FATAL]:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_internal_error", req.url));
  }
}
