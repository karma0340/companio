import { NextResponse } from "next/server";
import { getInitialAuthSnapshot } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getInitialAuthSnapshot();

    if (!snapshot.authenticated || !snapshot.user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        ...snapshot.user,
        activeRole: snapshot.activeRole,
      },
      hostProfile: snapshot.hostProfile,
      memberProfile: snapshot.memberProfile,
      hasHostProfile: Boolean(snapshot.hostProfile),
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
