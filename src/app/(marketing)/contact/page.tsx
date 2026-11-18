"use client";

import React, { useState } from "react";
import { Mail, ShieldAlert, Wrench, CreditCard, HelpCircle, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("payment");
  const [isSent, setIsSent] = useState<boolean>(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const categories = [
    { id: "safety", title: "Report a safety problem", icon: ShieldAlert, desc: "Harassment, inappropriate conduct, or emergency reports" },
    { id: "tech", title: "Something isn't working", icon: Wrench, desc: "Sign-in, photo upload issues, or page crashes" },
    { id: "payment", title: "Credits or a payment", icon: CreditCard, desc: "Pass activation, wallet cashout, refund requests" },
    { id: "general", title: "Help using Companio", icon: HelpCircle, desc: "Booking rules, becoming a host, account details" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
          <Mail className="h-3.5 w-3.5" />
          <span>Support & Statutory Grievance Redressal</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl font-extrabold text-white sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-3 text-sm text-[#8E8E93] max-w-md mx-auto">
          Choose a topic below to ensure your message reaches the appropriate support desk.
        </p>
      </div>

      {/* Category Selector Grid */}
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`cursor-pointer rounded-2xl border p-5 transition ${
                isSelected
                  ? "border-[#D4AF37] bg-[#1A1A1A] shadow-md shadow-[#D4AF37]/10"
                  : "border-[#262626] bg-[#121212] hover:border-[#383838]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${isSelected ? "text-[#D4AF37]" : "text-[#8E8E93]"}`} />
                <h3 className="font-serif text-base font-bold text-white">{cat.title}</h3>
              </div>
              <p className="mt-2 text-xs text-[#8E8E93] leading-relaxed">{cat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Contact Form */}
      <div className="rounded-2xl border border-[#262626] bg-[#121212] p-8">
        {isSent ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-3 font-serif text-xl font-bold text-white">Ticket Submitted Successfully</h3>
            <p className="mt-2 text-xs text-[#8E8E93]">
              Your support ticket reference #TKT-{Date.now().toString().slice(-6)} has been created. A support officer will respond via SMS/email within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSent(false);
                setForm({ name: "", phone: "", message: "" });
              }}
              className="mt-6 rounded-full border border-[#333] px-6 py-2 text-xs font-semibold text-white hover:bg-[#202020]"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#8E8E93]">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Mehta"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8E8E93]">Registered Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 99XXXXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8E8E93]">Message or Complaint Details</label>
              <textarea
                required
                rows={4}
                placeholder="Please describe your issue with specific booking IDs, payment IDs, or questions..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#2B2B2B] bg-[#181818] px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto rounded-full bg-[#D4AF37] px-8 py-3 text-xs font-bold text-black hover:bg-[#E5C158] transition"
            >
              Submit Ticket to Support Team
            </button>
          </form>
        )}
      </div>

      {/* Statutory Grievance Redressal Card */}
      <div className="mt-12 rounded-2xl border border-[#262626] bg-[#0A0A0A] p-6 text-xs text-[#8E8E93]">
        <div className="font-serif text-sm font-bold text-white mb-2">
          Statutory Grievance Redressal Officer
        </div>
        <p className="leading-relaxed">
          In compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, the details of our Grievance Redressal Officer are published below:
        </p>
        <div className="mt-3 grid gap-1 text-[#BBB]">
          <div><strong className="text-white">Officer Name:</strong> Suraj Choudhary</div>
          <div><strong className="text-white">Entity:</strong> Companio Labs Operations Hub, Jaipur, Rajasthan</div>
          <div><strong className="text-white">Email:</strong> grievance@trycompanio.in</div>
          <div><strong className="text-white">SLA:</strong> Grievances acknowledged within 24 hours and resolved within 15 business days.</div>
        </div>
      </div>
    </div>
  );
}
