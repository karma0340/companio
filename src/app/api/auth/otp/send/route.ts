import { NextRequest, NextResponse } from "next/server";
import { generateAndStoreOtp } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").trim();

    // Validate phone number
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const isValidIndianPhone = /^(?:\+91)?[6-9]\d{9}$/.test(cleanPhone);

    if (!isValidIndianPhone) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const normalizedPhone = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
    const code = generateAndStoreOtp(normalizedPhone);

    console.log(`[AUTH OTP] Dispatched OTP to ${normalizedPhone}: ${code}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${normalizedPhone}`,
      phone: normalizedPhone,
      devCode: code,
    });
  } catch (error) {
    console.error("[AUTH OTP SEND ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch OTP. Please try again." },
      { status: 500 }
    );
  }
}

