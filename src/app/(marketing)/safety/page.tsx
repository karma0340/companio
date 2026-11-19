import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Lock, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

export default function SafetyPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "1. 100% Sovereign ID Verification",
      desc: "Every single companion and member must submit valid government Aadhaar or PAN documents. Our moderation team cross-verifies details before any profile goes live.",
    },
    {
      icon: MapPin,
      title: "2. Strictly Public Neutral Venues",
      desc: "Meetups in private residences, hotel rooms, or secluded vehicles are strictly prohibited by platform rules and result in instant permanent bans.",
    },
    {
      icon: Lock,
      title: "3. Escrow Financial Settlement",
      desc: "No direct cash transactions between members and companions. Fees are protected in Razorpay escrow and only released after physical 4-digit PIN verification.",
    },
    {
      icon: AlertTriangle,
      title: "4. Rapid SOS & Location Protocol",
      desc: "Instant live GPS sharing and direct emergency contact dispatch embedded directly into every active booking screen in two taps.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFCFF] py-16 text-slate-900">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Trust & Safety Center</span>
          </div>

          <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            How we keep meetups safe.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Our zero-compromise security architecture ensures peace of mind for both companions and members.
          </p>
        </div>

        {/* Platonic Guarantee Callout */}
        <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8 sm:flex items-center gap-6">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-600 shrink-0 mb-4 sm:mb-0 inline-block">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">The Strictly Platonic Promise</h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">
              Companio is strictly non-romantic and non-sexual. Physical contact is limited to a polite greeting handshake. Any boundary testing, harassment, or solicitation results in immediate forfeiture of funds, account termination, and reporting to authorities.
            </p>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-black transition active:scale-95"
          >
            <span>Explore verified profiles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
