"use client";

import React from "react";
import { ShieldCheck, Coffee, Sparkles, RefreshCcw } from "lucide-react";

const COMMITMENTS = [
  {
    icon: ShieldCheck,
    title: "100% ID-checked",
    description: "Every companion applies with a government ID. Profiles are hand-reviewed before going live.",
  },
  {
    icon: Coffee,
    title: "Public places only",
    description: "Strictly platonic. Meetups happen exclusively in open public places like cafes, parks, and events.",
  },
  {
    icon: Sparkles,
    title: "Pay per meetup",
    description: "No recurring subscriptions or locked memberships. You pay only for the meetups you schedule.",
  },
  {
    icon: RefreshCcw,
    title: "Protected refunds",
    description: "If a meetup request is declined or unaccepted, you receive a prompt full wallet refund or UPI return.",
  },
];

export function CommitmentsSection() {
  return (
    <section
      aria-labelledby="commitments-heading"
      className="py-16 md:py-28 bg-[#FBFCFF] border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            What we promise
          </span>
          <h2
            id="commitments-heading"
            className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
          >
            Four commitments, true from day one.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Companio was built on trust, transparency, and simple human connection.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMITMENTS.map((comm) => {
            const Icon = comm.icon;
            return (
              <div
                key={comm.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{comm.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {comm.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
