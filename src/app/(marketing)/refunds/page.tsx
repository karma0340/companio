import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, RefreshCw, AlertCircle } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-[#A1A1A6] leading-relaxed">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E8E93] hover:text-white mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to homepage</span>
      </Link>

      <div className="border-b border-[#262626] pb-8 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Fair & Transparent Financial Terms</span>
        </div>
        <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          Refund & Cancellation Policy
        </h1>
        <p className="mt-2 text-xs text-[#8E8E93]">
          Clear rules regarding booking escrow, pass purchases, and host cancellations.
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-[#262626] bg-[#121212] p-6">
          <h2 className="font-serif text-xl font-bold text-white mb-2">1. Access Passes (1-Month to Lifetime)</h2>
          <p className="text-xs sm:text-sm text-[#8E8E93]">
            Access Passes provide immediate digital unlocks (removing photo blurs, displaying full biographies, and activating messaging privileges). Because this digital utility is delivered instantaneously upon payment confirmation, <strong>all Access Pass purchases are final and non-refundable</strong> once activated.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-2">2. The 12-Hour Companion Acceptance SLA</h2>
          <p>
            When you deposit an hourly booking fee into escrow, the companion host has exactly 12 hours to accept or decline. If the companion fails to respond within 12 hours or declines your request, <strong>100% of the escrow fee is automatically refunded</strong> to your wallet balance immediately with zero deductions.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-2">3. Member Cancellation Window</h2>
          <ul className="list-disc pl-5 mt-2 space-y-2 text-xs">
            <li><strong>More than 24 Hours in Advance:</strong> 100% refund of the booking fee back to your wallet balance.</li>
            <li><strong>Less than 24 Hours in Advance:</strong> A late cancellation penalty of ₹250 is charged to compensate the host for blocking their calendar. The remaining balance (e.g. ₹456 out of a ₹706 booking) is returned to your wallet.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-2">4. Host Wallet Withdrawals & The 12% Threshold</h2>
          <p>
            Companions must accumulate at least ₹500 in completed session earnings before initiating standard, free UPI settlements. If a companion requests an expedited or partial cashout below the ₹500 minimum threshold, a <strong>12% early processing fee</strong> is deducted from the withdrawal amount.
          </p>
        </section>
      </div>
    </div>
  );
}
