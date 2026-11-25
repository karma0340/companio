import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { HOST_REGISTRATION_FEE } from "@/lib/data";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Please verify your mobile number before registering as a Host." },
        { status: 401 }
      );
    }

    const amountInPaise = Math.round(HOST_REGISTRATION_FEE.totalPrice * 100); // 11300 paise = INR 113.00
    const rzpResult = await createRazorpayOrder(
      amountInPaise,
      "INR",
      `host_${session.userId.slice(0, 8)}_${Date.now()}`,
      {
        type: "HOST_REGISTRATION",
        packTier: HOST_REGISTRATION_FEE.tier,
        basePrice: String(HOST_REGISTRATION_FEE.basePrice),
        taxesAndCharges: String(HOST_REGISTRATION_FEE.taxesAndCharges),
        userId: session.userId,
        phone: session.phone || "",
      }
    );

    return NextResponse.json({
      success: true,
      orderId: rzpResult.orderId,
      amount: amountInPaise,
      currency: "INR",
      basePrice: HOST_REGISTRATION_FEE.basePrice,
      taxesAndCharges: HOST_REGISTRATION_FEE.taxesAndCharges,
      priceInr: HOST_REGISTRATION_FEE.totalPrice,
      packTier: HOST_REGISTRATION_FEE.tier,
      packName: HOST_REGISTRATION_FEE.name,
      keyId: getRazorpayKeyId(),
      isLive: isRazorpayConfigured(),
    });
  } catch (error) {
    console.error("[HOST CREATE ORDER ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initiate Host Registration payment." },
      { status: 500 }
    );
  }
}
