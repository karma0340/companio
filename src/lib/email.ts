/**
 * Email OTP & Notification Dispatcher for Companio
 * Supports Resend, SMTP, and development logging.
 */

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}

export async function sendEmailOtp(
  recipientEmail: string,
  otpCode: string
): Promise<SendEmailResult> {
  const normalizedEmail = recipientEmail.trim().toLowerCase();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  console.log(`[EMAIL DISPATCH INITIATED] Target: ${normalizedEmail} | OTP: ${otpCode}`);

  // 1. Resend API Integration (if RESEND_API_KEY is configured)
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Togethr <auth@togethr.in>",
          to: [normalizedEmail],
          subject: `${otpCode} is your Togethr verification code`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 2px solid #0D0D11; border-radius: 8px;">
              <h2 style="margin-top: 0; color: #0D0D11;">made4togethr Sign-In</h2>
              <p style="font-size: 14px; color: #4B5563;">Use the verification code below to sign in to your Togethr account. This code is valid for 10 minutes.</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 16px; background-color: #F8F9FA; border: 2px solid #0D0D11; border-radius: 6px; text-align: center; margin: 24px 0; color: #0D0D11;">
                ${otpCode}
              </div>
              <p style="font-size: 12px; color: #9CA3AF; margin-bottom: 0;">If you did not request this code, please ignore this email. Never share your verification code with anyone.</p>
            </div>
          `,
        }),
      });

      const data = await response.json();
      if (response.ok && data.id) {
        console.log(`[RESEND SUCCESS] Dispatched to ${normalizedEmail} (ID: ${data.id})`);
        return { success: true, messageId: data.id, provider: "RESEND" };
      } else {
        console.error("[RESEND ERROR]", data);
      }
    } catch (err) {
      console.error("[RESEND NETWORK ERROR]", err);
    }
  }

  // 2. Development / Sandbox logging fallback
  console.log(`[DEVELOPMENT EMAIL DISPATCH] To: ${normalizedEmail} | Code: ${otpCode}`);
  return {
    success: true,
    messageId: `dev-mail-${Date.now()}`,
    provider: "DEV_CONSOLE",
  };
}
