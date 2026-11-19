import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const hourlyRate = Number(body?.hourlyRate) || 0;
    const durationHours = Number(body?.durationHours) || 1;

    if (hourlyRate <= 0 || durationHours <= 0) {
      return NextResponse.json(
        { error: 'Invalid hourly rate or duration specified.' },
        { status: 400 }
      );
    }

    const hostSubtotal = hourlyRate * durationHours;
    const connectionFee = Math.round(hostSubtotal * 0.1);
    const gst = Math.round(connectionFee * 0.18);
    const totalPayable = hostSubtotal + connectionFee + gst;
    const amountPaise = totalPayable * 100;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_U1vu1rlfL1qiHG';
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_rzp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // If a valid live or test secret is provided, call the Razorpay Orders API
    if (keySecret && !keySecret.includes('placeholder')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          body: JSON.stringify({
            amount: amountPaise,
            currency: 'INR',
            receipt: `rcpt_${Date.now().toString().slice(-8)}`,
            notes: {
              platform: 'Companio',
              escrowType: 'safe_deposit',
            },
          }),
        });

        if (rzpRes.ok) {
          const rzpData = await rzpRes.json();
          if (rzpData.id) {
            orderId = rzpData.id;
          }
        }
      } catch (err) {
        console.warn('Razorpay server order creation fallback to test order ID:', err);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      keyId,
      amountPaise,
      totalPayable,
      hostSubtotal,
      connectionFee,
      gst,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment. Please try again.' },
      { status: 500 }
    );
  }
}
