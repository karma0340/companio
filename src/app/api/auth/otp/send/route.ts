import { NextRequest, NextResponse } from "next/server";
import { checkOtpCooldown, clearOtp, generateAndStoreOtp } from "@/lib/otp-store";
import { sendSmsOtp } from "@/lib/sms";
import { sendEmailOtp } from "@/lib/email";
import { validateIndianMobileNumber } from "@/lib/phone";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawInput = String(body.email || body.phone || body.identifier || "").trim();

    if (!rawInput) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit Indian mobile number." },
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
          {
            success: false,
            error: phoneValidation.error || "Please enter a valid 10-digit Indian mobile number.",
          },
          { status: 400 }
        );
      }
      identifier = phoneValidation.e164;

      const cooldown = checkOtpCooldown(identifier);
      if (!cooldown.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${cooldown.waitSeconds} seconds before requesting another SMS code.`,
            retryAfterSeconds: cooldown.waitSeconds,
          },
          { status: 429 }
        );
      }
    }

    const code = generateAndStoreOtp(identifier);
    const result = isEmail ? await sendEmailOtp(identifier, code) : await sendSmsOtp(identifier, code);

    if (!result || !result.success) {
      clearOtp(identifier);
      return NextResponse.json(
        {
          success: false,
          error:
            result?.error ||
            "Unable to deliver SMS verification code right now. Please try again in a moment.",
          provider: result?.provider || "FAST2SMS",
        },
        { status: 502 }
      );
    }

    console.log(`[AUTH OTP SENT] Target: ${identifier} | Provider: ${result.provider}`);

    return NextResponse.json({
      success: true,
      message: isEmail
        ? `Verification code sent to ${identifier}.`
        : `6-digit verification code sent via SMS to ${identifier}.`,
      identifier,
      isEmail,
      provider: result.provider,
    });
  } catch (error) {
    console.error("[AUTH OTP SEND ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch verification code. Please try again." },
      { status: 500 }
    );
  }
}
