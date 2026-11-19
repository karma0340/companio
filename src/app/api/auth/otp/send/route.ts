import { NextRequest, NextResponse } from "next/server";
import { generateAndStoreOtp } from "@/lib/otp-store";
import { sendSmsOtp } from "@/lib/sms";
import { validateIndianMobileNumber } from "@/lib/phone";

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
      const phoneValidation = validateIndianMobileNumber(rawInput);
      if (!phoneValidation.isValid) {
        return NextResponse.json(
          { success: false, error: phoneValidation.error || "Please enter a valid 10-digit Indian mobile number." },
          { status: 400 }
        );
      }
      identifier = phoneValidation.e164;
    }

    const code = generateAndStoreOtp(identifier);
    let smsResult = null;

    if (!isEmail) {
      smsResult = await sendSmsOtp(identifier, code);
    }

    console.log(`[AUTH OTP DISPATCH] Target: ${identifier} | Code: ${code} | Provider: ${smsResult?.provider || "EMAIL"}`);

    const isSandboxOrDev =
      process.env.NODE_ENV !== "production" ||
      Boolean(smsResult?.isMock);

    return NextResponse.json({
      success: true,
      message: isEmail
        ? `Sign-in code dispatched to ${identifier}`
        : `Sign-in code dispatched via SMS to ${identifier}`,
      identifier,
      isEmail,
      provider: smsResult?.provider || (isEmail ? "EMAIL_DISPATCH" : "SMS_DISPATCH"),
      devCode: isSandboxOrDev ? code : undefined,
    });
  } catch (error) {
    console.error("[AUTH OTP SEND ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch sign-in code. Please try again." },
      { status: 500 }
    );
  }
}
