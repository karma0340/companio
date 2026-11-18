import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>DPDPA 2023 Compliant</span>
        </div>
        <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-[#8E8E93]">
          TRYCOMPANIOLABS LLP • Protecting User Privacy Across India
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">1. Information We Collect</h2>
          <p>
            We collect only the minimum personal data required to safely operate the platform and guarantee physical security:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
            <li><strong>Account Verification:</strong> Mobile phone number verified via SMS One-Time Password (OTP).</li>
            <li><strong>Identity Verification:</strong> Sovereign Aadhaar and PAN documents for companions and verified members.</li>
            <li><strong>Emergency Location:</strong> HTML5 device GPS coordinates captured ONLY when the user explicitly triggers the Emergency SOS button.</li>
            <li><strong>Transactional Data:</strong> Payment order IDs, pass status, and UPI payout identifiers.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">2. Asymmetric Contact Shielding</h2>
          <p>
            Your private phone number, home address, and direct payment handles are never visible to other users. Profile names are masked on public discovery pages (e.g. &quot;Vanshika S***&quot;), and in-app chat automatically redacts phone numbers and social links to protect your personal identity.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">3. Zero Data Monetization Guarantee</h2>
          <p>
            We never sell, rent, or trade your personal information, browsing history, or chat logs to third-party advertisers or data brokers.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-3">4. Grievance Officer & Contact</h2>
          <p>
            For data correction, access, or erasure requests, write to our Data Grievance Officer:
          </p>
          <div className="mt-2 rounded-xl border border-[#222] bg-[#121212] p-4 text-xs text-[#BBB]">
            <div><strong>Grievance Officer:</strong> Suraj Choudhary</div>
            <div><strong>Entity:</strong> Companio Labs Operations Hub, Jaipur, Rajasthan</div>
            <div><strong>Email:</strong> privacy@trycompanio.in</div>
          </div>
        </section>
      </div>
    </div>
  );
}
