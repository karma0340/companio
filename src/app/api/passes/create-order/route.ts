import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { PASS_TIER_OPTIONS } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { PassTier } from "@/types";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tier = (body.tier as PassTier) || "ONE_MONTH";
    const guestPhone = body.phone ? String(body.phone).trim() : null;

    const tierOption = PASS_TIER_OPTIONS.find((p) => p.tier === tier);
    if (!tierOption) {
      return NextResponse.json({ success: false, error: "Invalid pass tier selected." }, { status: 400 });
    }

    const session = await getSession();
    let userId = session?.userId;
    const rawInput = String(body.email || body.phone || body.identifier || "").trim();

    // If guest checkout with identifier, upsert user by email or phone
    if (!userId && rawInput) {
      const isEmail = rawInput.includes("@");
      try {
        if (isEmail) {
          const cleanEmail = rawInput.toLowerCase();
          const dummyPhone = `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          const user = await prisma.user.upsert({
            where: { email: cleanEmail },
            update: {},
            create: { email: cleanEmail, phone: dummyPhone, name: "Member", role: "MEMBER" },
          });
          userId = user.id;
        } else {
          const cleanPhone = rawInput.replace(/[\s-]/g, "");
          const normalizedPhone = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
          const user = await prisma.user.upsert({
            where: { phone: normalizedPhone },
            update: {},
            create: { phone: normalizedPhone, name: "Member", role: "MEMBER" },
          });
          userId = user.id;
        }
      } catch (e) {
        console.warn("[PASS ORDER USER UPSERT WARNING]:", (e as Error).message);
      }
    }

    const amountInPaise = Math.round(tierOption.price * 100);
    const rzpResult = await createRazorpayOrder(
      amountInPaise,
      "INR",
      `pass_${Date.now()}`,
      {
        tier,
        userId: userId || "guest",
        email: session?.email || (rawInput.includes("@") ? rawInput.toLowerCase() : ""),
        phone: session?.phone || (!rawInput.includes("@") ? rawInput : ""),
      }
    );

    const orderId = rzpResult.orderId;

    // Create pending AccessPass record in DB if user is identified
    if (userId) {
      try {
        await prisma.accessPass.create({
          data: {
            userId,
            tier: tier as any,
            pricePaid: tierOption.price,
            razorpayOrderId: orderId,
            status: "PENDING",
            validUntil: tierOption.durationDays
              ? new Date(Date.now() + tierOption.durationDays * 24 * 60 * 60 * 1000)
              : null,
          },
        });
      } catch (dbErr) {
        console.warn("[PASS ORDER DB WARNING]:", (dbErr as Error).message);
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId,
        amount: amountInPaise,
        currency: "INR",
        tier: tierOption.tier,
        tierName: tierOption.name,
        priceInr: tierOption.price,
        keyId: getRazorpayKeyId(),
        isLive: isRazorpayConfigured(),
      },
    });
  } catch (error) {
    console.error("[PASS ORDER ERROR]:", error);
    return NextResponse.json({ success: false, error: "Failed to generate pass checkout order." }, { status: 500 });
  }
}
