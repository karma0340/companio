import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signUserToken, UserTokenPayload } from "@/lib/auth";
import { getSessionCookieName } from "@/lib/session";
import { ensureUserWallet, generateReferralCode } from "@/lib/wallet";

export const dynamic = "force-dynamic";

interface GoogleStateCookie {
  state: string;
  intent?: "member" | "host";
  next?: string;
  ref?: string;
}

function redirectWithError(origin: string, message: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("oauth_error", message);
  const res = NextResponse.redirect(url.toString());
  res.cookies.delete("companio_google_state");
  return res;
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return redirectWithError(origin, "Google Sign-In is not configured on this server.");
  }

  const oauthError = request.nextUrl.searchParams.get("error");
  if (oauthError) {
    return redirectWithError(origin, "Google sign-in was cancelled.");
  }

  const code = request.nextUrl.searchParams.get("code");
  const returnedState = request.nextUrl.searchParams.get("state");
  const rawStateCookie = request.cookies.get("companio_google_state")?.value;

  if (!code || !returnedState || !rawStateCookie) {
    return redirectWithError(origin, "Google sign-in session expired. Please try again.");
  }

  let parsedState: GoogleStateCookie;
  try {
    parsedState = JSON.parse(rawStateCookie) as GoogleStateCookie;
  } catch {
    return redirectWithError(origin, "Invalid sign-in state. Please try again.");
  }

  if (!parsedState?.state || parsedState.state !== returnedState) {
    return redirectWithError(origin, "Security state mismatch. Please retry Google sign-in.");
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
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

    const tokenData = await tokenRes.json().catch(() => ({}));
    if (!tokenRes.ok || !tokenData?.access_token) {
      console.error("[GOOGLE OAUTH TOKEN ERROR]:", tokenData);
      return redirectWithError(
        origin,
        tokenData?.error_description || "Failed to authenticate with Google."
      );
    }

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profile = await userInfoRes.json().catch(() => ({}));
    const googleId = String(profile?.sub || "").trim();
    const email = String(profile?.email || "").trim().toLowerCase();
    const googleName = String(profile?.name || "").trim();
    const picture = String(profile?.picture || "").trim() || null;

    if (!googleId || !email) {
      return redirectWithError(origin, "Google did not return a verified email account.");
    }

    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
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
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          googleId: dbUser.googleId || googleId,
          email: dbUser.email || email,
          emailVerified: true,
          ...((!dbUser.name || dbUser.name === "Member") && googleName ? { name: googleName } : {}),
          ...(!dbUser.avatarUrl && picture ? { avatarUrl: picture } : {}),
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
    } else {
      let referredById: string | null = null;
      if (parsedState.ref) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: parsedState.ref },
          select: { id: true },
        });
        referredById = referrer?.id || null;
      }

      dbUser = await prisma.user.create({
        data: {
          googleId,
          email,
          emailVerified: true,
          name: googleName || "Member",
          avatarUrl: picture,
          phone: null,
          role: "MEMBER",
          walletBalance: 0,
          coinBalance: 100,
          creditBalance: 100,
          referralCode: generateReferralCode(),
          referredById,
          isUnlocked: false,
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

    await ensureUserWallet(dbUser.id);

    const latestPass = dbUser.passes?.[0];
    const isPassValid =
      latestPass && (!latestPass.validUntil || new Date(latestPass.validUntil) > new Date());
    const isUnlocked = Boolean(dbUser.isUnlocked) || Boolean(isPassValid);
    const activePassTier = isUnlocked
      ? dbUser.activePassTier || (latestPass ? String(latestPass.tier) : "ONE_MONTH")
      : null;
    const passExpiresAt = latestPass?.validUntil || dbUser.passExpiresAt;

    const intent = parsedState.intent === "host" ? "host" : "member";
    const hasCompanion = Boolean(dbUser.companion);
    const effectiveRole: "MEMBER" | "COMPANION" =
      intent === "host" && hasCompanion ? "COMPANION" : dbUser.role === "ADMIN" ? "MEMBER" : "MEMBER";
    const resolvedRole =
      dbUser.role === "ADMIN"
        ? "ADMIN"
        : intent === "host" && hasCompanion
        ? "COMPANION"
        : effectiveRole;

    const sessionPayload: UserTokenPayload = {
      userId: dbUser.id,
      phone: dbUser.phone || "",
      email: dbUser.email || email,
      name: dbUser.name || googleName || "Member",
      role: resolvedRole as "MEMBER" | "COMPANION" | "ADMIN",
      activeRole: resolvedRole === "COMPANION" ? "host" : "member",
      avatarUrl: dbUser.companion?.avatarUrl || dbUser.avatarUrl || picture || null,
      isUnlocked,
      activePassTier,
      passExpiresAt: passExpiresAt ? passExpiresAt.toISOString() : null,
    };

    const token = signUserToken(sessionPayload, "7d");

    const isMemberOnboarded = Boolean(
      dbUser.onboardingCompleted ||
        (dbUser.name && dbUser.name !== "Member" && dbUser.name.trim().length > 1)
    );

    let destination = "/explore";
    if (intent === "host") {
      destination = hasCompanion ? "/companion/dashboard" : "/become-a-companion/apply";
    } else if (!isMemberOnboarded) {
      destination = "/onboarding/member";
    } else if (
      parsedState.next &&
      parsedState.next.startsWith("/") &&
      !parsedState.next.startsWith("//") &&
      parsedState.next !== "/login"
    ) {
      destination = parsedState.next;
    }

    const response = NextResponse.redirect(new URL(destination, origin).toString());
    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    response.cookies.delete("companio_google_state");

    return response;
  } catch (err) {
    console.error("[GOOGLE OAUTH CALLBACK ERROR]:", err);
    return redirectWithError(origin, "Failed to complete Google sign-in. Please try again.");
  }
}
