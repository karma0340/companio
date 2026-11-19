import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { PASS_TIER_OPTIONS } from "@/lib/data";
import { PassTier } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[RAZORPAY WEBHOOK] Invalid signature rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    console.log(`[RAZORPAY WEBHOOK] Received event: ${eventType}`);

    if (eventType === "order.paid" || eventType === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};
      const tier = (notes.tier as PassTier) || "ONE_MONTH";
      const userId = notes.userId;

      const tierOption = PASS_TIER_OPTIONS.find((p) => p.tier === tier) || PASS_TIER_OPTIONS[0];
      const expiryDate = tierOption.durationDays
        ? new Date(Date.now() + tierOption.durationDays * 24 * 60 * 60 * 1000)
        : null;

      if (userId && userId !== "guest") {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: {
              isUnlocked: true,
              activePassTier: tier as any,
              passExpiresAt: expiryDate,
            },
          });

          const existingPass = orderId
            ? await prisma.accessPass.findFirst({
                where: { razorpayOrderId: orderId },
              })
            : null;

          if (existingPass) {
            await prisma.accessPass.update({
              where: { id: existingPass.id },
              data: {
                status: "ACTIVE",
                razorpayPaymentId: paymentId,
                validUntil: expiryDate,
              },
            });
          } else {
            await prisma.accessPass.create({
              data: {
                userId,
                tier: tier as any,
                pricePaid: tierOption.price,
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentId,
                status: "ACTIVE",
                validUntil: expiryDate,
              },
            });
          }

          console.log(`[RAZORPAY WEBHOOK] Successfully unlocked pass for user ${userId}`);
        } catch (dbErr) {
          console.error("[RAZORPAY WEBHOOK DB ERROR]:", dbErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[RAZORPAY WEBHOOK ERROR]:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
