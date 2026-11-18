import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, AlertOctagon, Heart, Users } from "lucide-react";

export default function CommunityGuidelinesPage() {
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
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Code of Conduct & Platonic Integrity</span>
        </div>
        <h1 className="mt-4 font-serif text-3xl font-extrabold text-white sm:text-4xl">
          Community Guidelines
        </h1>
        <p className="mt-2 text-xs text-[#8E8E93]">
          These standards apply to every member and companion host on the platform.
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-red-900/40 bg-[#160D0D] p-6 text-white">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertOctagon className="h-5 w-5" />
            <span>Zero Tolerance for Sexual or Romantic Solicitation</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-red-200/80">
            Companio is strictly for platonic social companionship. Any user—member or companion—who asks for romantic favors, intimate contact, or proposes inappropriate conduct will be permanently banned immediately, have their wallet balance forfeited, and face legal reporting where applicable.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-2">1. The Public-Only Rule</h2>
          <p>
            All sessions must occur in busy, verified public venues: coffee shops, restaurants, art galleries, museums, shopping malls, or public gardens. Meeting at private homes, airbnbs, hotel rooms, or secluded vehicles is an automatic violation that invalidates all insurance and support.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-2">2. Respectful Boundaries & Dress Code</h2>
          <p>
            Both parties must dress respectfully and appropriately for public social settings. Conversation should be friendly, curious, and respectful. Neither party is obligated to answer invasive personal questions about family finances, past relationships, or private matters.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-2">3. Punctuality & 4-Digit Handshake</h2>
          <p>
            Respect the other person&apos;s time. Arrive on time at the agreed venue. When you arrive, the member provides the private 4-digit code displayed on their phone, which the host inputs into their dashboard. The session timer runs only while both parties are physically present.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-white mb-2">4. Disintermediation & Safety Warning</h2>
          <p>
            Do not pressure companions or members to transact off-platform or share private contact numbers during early meetups. In-app bookings are protected by platform insurance, escrow financial safety, and 24/7 rapid response monitoring.
          </p>
        </section>
      </div>
    </div>
  );
}
