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

    const session = await getSession();
    let userId = session?.userId;
    let userPhone = session?.phone || phoneInput || "+919999999901";

    // Calculate expiry date
    const expiryDate = tierOption.durationDays
      ? new Date(Date.now() + tierOption.durationDays * 24 * 60 * 60 * 1000)
      : null;

    try {
      // 1. Upsert / update user to unlocked state
      let user;
      if (userId) {
        user = await prisma.user.update({
          where: { id: userId },
          data: {
            isUnlocked: true,
            activePassTier: tier as any,
            passExpiresAt: expiryDate,
          },
        });
      } else {
        const cleanPhone = userPhone.replace(/[\s-]/g, "");
        const normalized = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
        user = await prisma.user.upsert({
          where: { phone: normalized },
          update: {
            isUnlocked: true,
            activePassTier: tier as any,
            passExpiresAt: expiryDate,
          },
          create: {
            phone: normalized,
            name: "Member",
            role: "MEMBER",
            isUnlocked: true,
            activePassTier: tier as any,
            passExpiresAt: expiryDate,
          },
        });
        userId = user.id;
        userPhone = user.phone;
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

    // 4. Update session cookie to reflect unlocked state immediately
    const token = await setSessionCookie({
      userId: userId!,
      phone: userPhone,
      role: "MEMBER",
      isUnlocked: true,
      activePassTier: tier,
      passExpiresAt: expiryDate ? expiryDate.toISOString() : null,
    });

    console.log(`[PASS UNLOCKED] User ${userId} (${userPhone}) unlocked with ${tierOption.name}. Expires: ${expiryDate}`);

    return NextResponse.json({
      success: true,
      isUnlocked: true,
      message: `Successfully unlocked Companio Club with ${tierOption.name}!`,
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

