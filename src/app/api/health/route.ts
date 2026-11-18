import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let dbStatus = "disconnected";
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (error) {
    dbStatus = "fallback_mock_mode";
  }

  return NextResponse.json({
    status: "ok",
    service: "Companio Platform API",
    version: "1.0.0",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    features: {
      routeGroups: true,
      webSocketChat: true,
      antiDisintermediationFilters: true,
      escrowEngine: true,
      pinHandshake: true,
    },
  });
}
