"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Is Companio a dating app?",
    a: "No. Companio is an Indian platform for meeting local companions for platonic activities in public places, like coffee, city walks, gyms and gigs. Every profile is reviewed before it goes live. A pass unlocks full profiles in every open city, chat opens once a companion accepts your booking, and each meetup is paid separately. We have zero tolerance for romantic or adult services.",
  },
  {
    q: "How are companions ID-checked?",
    a: "Companions apply with a government ID, and every profile is reviewed before it goes live. The ID-checked badge means our team has checked that person’s government ID (Aadhaar or PAN).",
  },
  {
    q: "Is it safe to meet?",
    a: "Every meetup is in a public place. Payments go through Razorpay, and every payout is reviewed by hand after the meetup and its complaint window.",
  },
  {
    q: "Does the pass include the meetups?",
    a: "No. The pass unlocks full profiles; chat opens once a companion accepts your booking. Each meetup is paid separately at the companion’s hourly rate, shown before you pay.",
  },
  {
    q: "How do I request a meetup?",
    a: "Pick the activity, a time and a public place on your companion’s profile. Book at least 2 hours ahead; if a companion declines, you see their reason when they give one, and your money comes back as credit.",
  },
  {
    q: "What if a meetup doesn’t happen?",
    a: "If your request isn’t accepted, is declined, or your companion doesn’t show up, you get the full amount back as Companio wallet credit (1 credit = ₹1). A request that is declined or withdrawn before it’s accepted comes back at once, and one not accepted within 12 hours comes back automatically. You can send credits from these meetups back to the card or UPI you paid with, from your Wallet, minus a 12% processing fee shown before you confirm.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="py-16 md:py-28 bg-[#FBFCFF] border-t border-slate-200/80"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            id="faq-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
          >
            Common questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            What Companio is, how we check companions, what a pass covers and how meetups stay safe.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in-50 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
