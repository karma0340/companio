import React from "react";
import { ShieldCheck, MapPin, Lock, AlertTriangle, PhoneCall, CheckCircle } from "lucide-react";
import { SosSimulator } from "@/components/marketing/SosSimulator";

export default function SafetyPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "1. 100% Sovereign ID Verification",
      desc: "Every single companion and member must submit valid government Aadhaar and PAN documents. We cross-verify details before any profile goes live.",
    },
    {
      icon: MapPin,
      title: "2. Strictly Public Neutral Venues",
      desc: "Meetups in private apartments, hotel rooms, or secluded vehicles are strictly prohibited by system rules and result in instant permanent bans.",
    },
    {
      icon: Lock,
      title: "3. Escrow Financial Settlement",
      desc: "No direct cash transactions between members and companions. Fees are protected in escrow and only released after physical 4-digit PIN verification.",
    },
    {
      icon: AlertTriangle,
      title: "4. Rapid SOS & 112 Protocol",
      desc: "Instant live GPS sharing and direct routing to India's National Emergency Response Center (112) embedded directly into the active booking dashboard.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Trust, Safety & Platonic Integrity</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          Safety Centre
        </h1>
        <p className="mt-3 text-sm text-[#8E8E93] max-w-xl mx-auto sm:text-base">
          Our zero-compromise security architecture guarantees peace of mind for both companions and members.
        </p>
      </div>

      {/* Platonic Guarantee Callout */}
      <div className="mt-12 rounded-2xl border border-[#D4AF37]/40 bg-[#161616] p-8 text-center sm:text-left sm:flex items-center gap-6">
        <div className="rounded-full bg-[#D4AF37]/10 p-3 border border-[#D4AF37]/30 text-[#D4AF37] shrink-0">
          <CheckCircle className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-white">The Platonic Promise</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#A1A1A6] sm:text-sm">
            Companio is strictly non-romantic and non-sexual. Physical contact is limited to a polite greeting handshake. Any boundary testing, harassment, or solicitation results in immediate forfeiture of funds, account termination, and reporting to legal authorities.
          </p>
        </div>
      </div>

      {/* Four Pillars */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="rounded-2xl border border-[#262626] bg-[#121212] p-8">
              <Icon className="h-7 w-7 text-[#D4AF37]" />
              <h3 className="mt-4 font-serif text-lg font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#8E8E93] sm:text-sm">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Live SOS Simulator */}
      <div className="mt-16">
        <SosSimulator />
      </div>

      {/* Emergency Helpline Contacts */}
      <div className="mt-16 rounded-2xl border border-[#262626] bg-[#0F0F0F] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-[#D4AF37]" />
            <span>24/7 Safety Helpline</span>
          </h4>
          <p className="mt-1 text-xs text-[#8E8E93]">
            Our incident response team is available 24 hours a day, 7 days a week.
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href="tel:112"
            className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
          >
            Emergency: 112
          </a>
          <a
            href="/contact"
            className="rounded-full border border-[#333] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#202020] transition"
          >
            Grievance Officer
          </a>
        </div>
      </div>
    </div>
  );
}
