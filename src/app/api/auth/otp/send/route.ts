import { NextRequest, NextResponse } from "next/server";
import { generateAndStoreOtp } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawInput = String(body.email || body.phone || body.identifier || "").trim();

    if (!rawInput) {
      return NextResponse.json(
        { success: false, error: "Please provide an email address or mobile number." },
        { status: 400 }
      );
    }

    let identifier = rawInput;
    const isEmail = rawInput.includes("@");

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rawInput)) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid email address." },
          { status: 400 }
        );
      }
      identifier = rawInput.toLowerCase();
    } else {
      const cleanPhone = rawInput.replace(/[\s-]/g, "");
      const isValidIndianPhone = /^(?:\+91)?[6-9]\d{9}$/.test(cleanPhone);
      if (!isValidIndianPhone) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit mobile number or email address." },
          { status: 400 }
        );
      }
      identifier = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
    }

    const code = generateAndStoreOtp(identifier);
    console.log(`[AUTH OTP DISPATCH] Sent OTP to ${identifier}: ${code}`);

    return NextResponse.json({
      success: true,
      message: `Sign-in code dispatched to ${identifier}`,
      identifier,
      isEmail,
      devCode: code,
    });
  } catch (error) {
    console.error("[AUTH OTP SEND ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch sign-in code. Please try again." },
      { status: 500 }
    );
  }
}
