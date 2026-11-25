import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { HOST_PACK_OPTIONS } from "@/lib/data";
import { HostPackTier } from "@/types";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please verify your mobile number before selecting a Host Package." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const packTier = (String(body.packTier || "PRO").toUpperCase() as HostPackTier);
    const packOption = HOST_PACK_OPTIONS.find((p) => p.tier === packTier);

    if (!packOption) {
      return NextResponse.json(
        { success: false, error: "Invalid host package tier selected." },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(packOption.price * 100);
    const rzpResult = await createRazorpayOrder(
      amountInPaise,
      "INR",
      `host_${session.userId.slice(0, 8)}_${Date.now()}`,
      {
        type: "HOST_REGISTRATION",
        packTier: packOption.tier,
        userId: session.userId,
        phone: session.phone,
      }
    );

    return NextResponse.json({
      success: true,
      orderId: rzpResult.orderId,
      amount: amountInPaise,
      currency: "INR",
      priceInr: packOption.price,
      packTier: packOption.tier,
      packName: packOption.name,
      keyId: getRazorpayKeyId(),
      isLive: isRazorpayConfigured(),
    });
  } catch (error) {
    console.error("[HOST CREATE ORDER ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initiate host package payment." },
      { status: 500 }
    );
  }
}
