import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // Static assets and internal next requests pass through immediately
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/manifest.json")
  ) {
    return NextResponse.next();
  }

  // 1. Domain Detection for getcompanio.in (Marketplace Web App)
  const isMarketplaceDomain =
    hostname.includes("getcompanio") ||
    hostname.startsWith("app.") ||
    hostname.startsWith("marketplace.");

  if (isMarketplaceDomain) {
    // If accessing root of getcompanio.in, rewrite to /app marketplace view
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/app", req.url));
    }
  }

  // 2. Allow explicit /app paths on localhost or any domain
  if (pathname.startsWith("/app/")) {
    const stripped = pathname.replace(/^\/app/, "");
    // If stripped path is an app sub-route (e.g. /app/booking/comp_01 -> /booking/comp_01)
    if (stripped !== "" && stripped !== "/") {
      return NextResponse.rewrite(new URL(stripped, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ],
};
