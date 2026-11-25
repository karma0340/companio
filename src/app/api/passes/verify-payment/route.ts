import { NextRequest, NextResponse } from "next/server";
import { getSession, setSessionCookie } from "@/lib/session";
import { PASS_TIER_OPTIONS } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { PassTier } from "@/types";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = String(body.orderId || "");
    const paymentId = String(body.paymentId || `pay_${Date.now().toString(36)}`);
    const signature = body.signature ? String(body.signature).trim() : undefined;
    const tier = (body.tier as PassTier) || "ONE_MONTH";
    const phoneInput = body.phone ? String(body.phone).trim() : null;
    const guestName = body.name ? String(body.name).trim() : null;

    // Cryptographic signature check
    const verification = verifyRazorpaySignature(orderId, paymentId, signature);
    if (!verification.isValid) {
      return NextResponse.json(
        { success: false, error: verification.reason || "Payment signature verification failed." },
        { status: 400 }
      );
    }

    const tierOption = PASS_TIER_OPTIONS.find((p) => p.tier === tier);
    if (!tierOption) {
      return NextResponse.json({ success: false, error: "Invalid pass tier." }, { status: 400 });
    }

    const rawIdentifier = String(body.email || body.phone || body.identifier || "").trim();
    const isEmailInput = rawIdentifier.includes("@");

    const session = await getSession();
    let userId = session?.userId;
    let userPhone = phoneInput || session?.phone || (!isEmailInput && rawIdentifier ? rawIdentifier : "+919999999901");
    let userEmail = session?.email || (isEmailInput ? rawIdentifier.toLowerCase() : null);

    // Calculate expiry date
    const expiryDate = tierOption.durationDays
      ? new Date(Date.now() + tierOption.durationDays * 24 * 60 * 60 * 1000)
      : null;

    try {
      // 1. Upsert / update user to unlocked state in Neon PostgreSQL
      let user;
      if (userId) {
        user = await prisma.user.update({
          where: { id: userId },
          data: {
            isUnlocked: true,
            activePassTier: tier as any,
            passExpiresAt: expiryDate,
            ...(userEmail ? { email: userEmail } : {}),
            ...(guestName ? { name: guestName } : {}),
          },
        });
      } else if (isEmailInput) {
        const cleanEmail = rawIdentifier.toLowerCase();
        const dummyPhone = `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        user = await prisma.user.upsert({
          where: { email: cleanEmail },
          update: {
            isUnlocked: true,
            activePassTier: tier as any,
            passExpiresAt: expiryDate,
            ...(guestName ? { name: guestName } : {}),
          },
          create: {
            email: cleanEmail,
            phone: dummyPhone,
            name: guestName || "Member",
            role: "MEMBER",
            isUnlocked: true,
            activePassTier: tier as any,
            passExpiresAt: expiryDate,
          },
        });
        userId = user.id;
        userEmail = user.email;
        userPhone = user.phone || "";
      } else {
        const cleanPhone = userPhone.replace(/[\s-]/g, "");
        const normalized = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
        user = await prisma.user.upsert({
          where: { phone: normalized },
          update: {
            isUnlocked: true,
            activePassTier: tier as any,
            passExpiresAt: expiryDate,
            ...(guestName ? { name: guestName } : {}),
          },
          create: {
            phone: normalized,
            name: guestName || "Member",
            role: "MEMBER",
            isUnlocked: true,
            activePassTier: tier as any,
            passExpiresAt: expiryDate,
          },
        });
        userId = user.id;
        userPhone = user.phone || "";
      }

      // 2. Update or create AccessPass record
      await prisma.accessPass.create({
        data: {
          userId: user.id,
          tier: tier as any,
          pricePaid: tierOption.price,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          status: "ACTIVE",
          validUntil: expiryDate,
        },
      });

      // 3. Record financial transaction
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: "PASS_PURCHASE",
          amount: tierOption.price,
          feeAmount: 0,
          netAmount: tierOption.price,
          gateway: "RAZORPAY",
          gatewayTransactionId: paymentId,
          status: "SUCCESS",
        },
      });
    } catch (dbErr) {
      console.warn("[PASS VERIFY DB FALLBACK]:", (dbErr as Error).message);
      if (!userId) userId = `user_${Date.now()}`;
    }

    // 4. Update session cookie to reflect unlocked state immediately while preserving host role/avatar
    const preservedRole =
      (session?.role === "COMPANION" ? "COMPANION" : "MEMBER") as "MEMBER" | "COMPANION";
    const token = await setSessionCookie({
      userId: userId!,
      phone: userPhone,
      email: userEmail,
      name: guestName || session?.name || "Member",
      role: preservedRole,
      activeRole: preservedRole === "COMPANION" ? "host" : "member",
      avatarUrl: session?.avatarUrl || null,
      isUnlocked: true,
      activePassTier: tier,
      passExpiresAt: expiryDate ? expiryDate.toISOString() : null,
    });

    console.log(`[PASS UNLOCKED] User ${userId} (${userPhone}) unlocked with ${tierOption.name}. Expires: ${expiryDate}`);

    return NextResponse.json({
      success: true,
      isUnlocked: true,
      message: `Successfully unlocked Meetzy Club with ${tierOption.name}!`,
      pass: {
        tier: tierOption.tier,
        name: tierOption.name,
        pricePaid: tierOption.price,
        isUnlocked: true,
        expiresAt: expiryDate ? expiryDate.toISOString() : "NEVER (Lifetime)",
      },
      token,
    });
  } catch (error) {
    console.error("[PASS VERIFY ERROR]:", error);
    return NextResponse.json({ success: false, error: "Payment verification failed." }, { status: 500 });
  }
}

