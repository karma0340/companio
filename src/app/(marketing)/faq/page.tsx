import React from "react";
import Link from "next/link";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { HelpCircle, ArrowRight } from "lucide-react";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          Everything You Need to Know
        </h1>
        <p className="mt-3 text-sm text-[#8E8E93] max-w-lg mx-auto">
          Transparent answers about our Access Passes, escrow protection, safety rules, and companion payouts.
        </p>
      </div>

      <FaqAccordion />

      <div className="mt-16 rounded-2xl border border-[#262626] bg-[#121212] p-8 text-center">
        <h3 className="font-serif text-xl font-bold text-white">Still have questions?</h3>
        <p className="mt-1 text-xs text-[#8E8E93]">
          Our customer support team and grievance redressal officer are available to assist you.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex items-center rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-[#E5E5E7] transition"
        >
          <span>Contact Support Desk</span>
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
