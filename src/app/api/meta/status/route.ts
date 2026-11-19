import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "operational",
    time: new Date().toISOString(),
    service: "Togethr Central API Engine",
    activeCities: 126,
    activeHosts: 48,
    version: "2.4.0",
  });
}
