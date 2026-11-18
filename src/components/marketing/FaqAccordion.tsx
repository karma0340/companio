"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const faqs: FaqItem[] = [
    {
      category: "passes",
      q: "Does buying an Access Pass pay for my companion meetup?",
      a: "No. The Access Pass (from ₹99.50) is purely an entrance pass that unlocks unblurred photos, full biographies, reviews, and messaging privileges. The companion's hourly fee (e.g. ₹499/hr) is paid separately into escrow when you submit a booking.",
    },
    {
      category: "passes",
      q: "How long does a 1-Month Pass stay active?",
      a: "A 1-Month Pass remains active for exactly 30 calendar days from the moment of purchase. On day 31, companion photos re-blur until you renew. Alternatively, you can purchase a Lifetime Pass (₹999.50) which never expires.",
    },
    {
      category: "bookings",
      q: "What happens if a companion doesn't accept my booking?",
      a: "Companions have a mandatory 12-hour response window. If a companion fails to accept within 12 hours or declines your request, 100% of your escrow deposit is immediately refunded to your wallet.",
    },
    {
      category: "bookings",
      q: "What is the 4-digit verification PIN?",
      a: "When you arrive at the public cafe, your mobile screen displays a private 4-digit numeric code. You verbally share this with your companion. The companion enters it into their dashboard to start the official session timer. This prevents fake bookings and billing disputes.",
    },
    {
      category: "safety",
      q: "Can we meet at a private apartment or hotel?",
      a: "Absolutely not. Companio enforces a strictly public venue mandate. All meetups must occur in neutral, well-lit public cafes, art galleries, museums, or public parks. Meeting in private residences results in an instant permanent ban.",
    },
    {
      category: "safety",
      q: "Is there any romantic or physical dating allowed?",
      a: "No. Companio is strictly platonic. Physical contact is limited to a polite greeting handshake. Any romantic advances, flirtatious pressure, or inappropriate behavior are grounds for immediate account termination.",
    },
    {
      category: "hosts",
      q: "When and how do companion hosts get paid?",
      a: "Once a session concludes and the timer stops, escrow funds are released. Cashfree Payments automatically transfers the companion's 70.7% earnings directly to their registered UPI ID within 24 hours.",
    },
    {
      category: "hosts",
      q: "What is the 12% wallet cashout fee?",
      a: "Companions must accumulate at least ₹500 in earnings before standard free withdrawals trigger. If a host requests an early or expedited withdrawal below the ₹500 threshold, a 12% penalty fee is deducted.",
    },
  ];

  const filtered = selectedCat === "all" ? faqs : faqs.filter((f) => f.category === selectedCat);

  return (
    <div>
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: "all", label: "All Questions" },
          { id: "passes", label: "Access Passes" },
          { id: "bookings", label: "Bookings & Escrow" },
          { id: "safety", label: "Safety & Rules" },
          { id: "hosts", label: "Host Payouts" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCat(tab.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              selectedCat === tab.id
                ? "bg-[#D4AF37] text-black font-bold"
                : "border border-[#262626] bg-[#141414] text-[#8E8E93] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filtered.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="rounded-xl border border-[#262626] bg-[#121212] transition overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white hover:bg-[#161616]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#D4AF37] transition-transform duration-200 shrink-0 ml-4 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-[#222] p-5 pt-3 text-xs leading-relaxed text-[#A1A1A6]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
