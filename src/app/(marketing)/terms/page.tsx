import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="font-serif text-3xl font-extrabold text-white sm:text-4xl">
          Terms of Service & Code of Conduct
        </h1>
        <p className="mt-2 text-xs text-[#8E8E93]">
          TRYCOMPANIOLABS LLP • Effective Platform Terms
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">1. Strictly Platonic Nature of Services</h2>
          <p>
            Companio is an on-demand social companionship platform. All interactions between members and companions are strictly platonic, non-romantic, and non-sexual. Physical contact is restricted to a polite greeting handshake. Any solicitation of romantic, intimate, or illegal acts results in immediate permanent expulsion and legal escalation.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">2. Neutral Public Venue Requirement</h2>
          <p>
            All bookings must occur strictly within recognized, well-lit public establishments (cafes, restaurants, art galleries, museums, shopping centers, or parks). Meeting in private residences, hotel rooms, or secluded vehicles is an explicit violation of our terms and immediately voids all platform protections and insurance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">3. Access Passes vs. Booking Hourly Fees</h2>
          <p>
            Access Passes (1-Month, 3-Month, 6-Month, 1-Year, and Lifetime) grant browsing, unmasking, and booking privileges only. An Access Pass does NOT cover the companion&apos;s hourly booking fee (e.g. ₹499/hr) or food/beverage costs. All Access Pass purchases are final and non-refundable once activated.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">4. Cancellations and Refunds</h2>
          <p>
            If a companion fails to accept a booking within the 12-hour response window, 100% of the escrow fee is automatically refunded to the member&apos;s wallet. If a member cancels a confirmed booking less than 24 hours prior to the scheduled time, a cancellation penalty of ₹250 is deducted, with ₹125 paid to the companion host as compensation.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">5. In-Person 4-Digit Handshake Verification</h2>
          <p>
            The session officially starts only when the companion inputs the member&apos;s 4-digit verification code into their portal. Entering this code constitutes formal legal confirmation that both parties are physically present at the agreed public venue.
          </p>
        </section>
      </div>
    </div>
  );
}
