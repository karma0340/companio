import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [activeCities, activeHosts] = await Promise.all([
      prisma.city.count({ where: { isActive: true } }),
      prisma.companion.count(),
    ]);

    return NextResponse.json({
      ok: true,
      status: "operational",
      time: new Date().toISOString(),
      service: "Meetzy Club Central API Engine",
      activeCities,
      activeHosts,
      version: "2.4.0",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        status: "degraded",
        time: new Date().toISOString(),
        service: "Meetzy Club Central API Engine",
      },
      { status: 503 }
    );
  }
}
