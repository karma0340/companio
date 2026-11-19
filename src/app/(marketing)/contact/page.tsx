"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ShieldAlert, CreditCard, HelpCircle, CheckCircle2, Phone, MapPin, Send } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("payment");
  const [isSent, setIsSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const [ticketRef, setTicketRef] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    { id: "payment", label: "Escrow & Payments", icon: CreditCard },
    { id: "safety", label: "Safety & Grievance", icon: ShieldAlert },
    { id: "verification", label: "Host Verification & KYC", icon: CheckCircle2 },
    { id: "general", label: "General Inquiry", icon: HelpCircle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to submit ticket. Please try again.");
      } else {
        setTicketRef(data.referenceCode || `TIC-${Date.now().toString().slice(-6)}`);
        setIsSent(true);
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Header */}
          <div className="border-brutal shadow-brutal bg-sunny p-8 sm:p-12 text-center">
            <span className="inline-block border-2 border-ink bg-white px-3 py-1 text-xs font-black uppercase tracking-wider mb-4">
              24/7 Support Desk
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-ink tracking-tight">
              Contact &amp; Grievance Redressal
            </h1>
            <p className="mt-3 text-xs sm:text-sm font-bold text-ink/80 max-w-xl mx-auto">
              Need assistance with an escrow booking, verification, or community safety concern? Our operations desk responds within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2 border-brutal shadow-brutal bg-white p-6 sm:p-8">
              {isSent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center border-3 border-ink bg-lime shadow-brutal">
                    <CheckCircle2 className="h-8 w-8 text-ink" />
                  </div>
                  <h2 className="text-2xl font-black uppercase text-ink">Ticket Dispatched</h2>
                  <p className="text-xs font-bold text-ink/70 max-w-sm mx-auto">
                    Your inquiry has been submitted. Reference ID #{ticketRef || "TIC-REGISTERED"}. A trust officer will reach out via email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false);
                      setForm({ name: "", phone: "", email: "", message: "" });
                    }}
                    className="border-2 border-ink bg-ink px-6 py-2.5 text-xs font-black uppercase text-white shadow-brutal btn-press"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="border-2 border-danger bg-danger/10 p-3 text-xs font-black text-danger">
                      {errorMessage}
                    </div>
                  )}
                  {/* Category Selector */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-ink mb-2">
                      Topic Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 border-2 border-ink p-3 text-left transition ${
                              isSelected
                                ? "bg-lime font-black shadow-brutal"
                                : "bg-paper font-bold hover:bg-black/5"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="text-xs truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter 10-digit mobile number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-ink mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-ink mb-1">
                      Message Details
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please provide complete context regarding your meetup ID, transaction reference, or inquiry..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border-2 border-ink bg-paper p-3.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full border-2 border-ink bg-ink py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? "Submitting Ticket..." : "Submit Support Ticket"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Statutory Grievance Officer & Contact Cards */}
            <div className="space-y-6">
              <div className="border-brutal shadow-brutal bg-white p-6 space-y-3">
                <span className="border border-ink bg-sunny px-2 py-0.5 text-[10px] font-black uppercase">
                  IT Rules 2021 Compliance
                </span>
                <h3 className="text-sm font-black uppercase text-ink">Grievance Officer</h3>
                <div className="text-xs font-bold text-ink/80 space-y-1">
                  <p>Officer: Mohit Tyagi</p>
                  <p>Designation: Grievance Redressal Officer</p>
                  <p>Email: <a href="mailto:grievance@companio.in" className="underline">grievance@companio.in</a></p>
                  <p>Response SLA: Within 24-48 hours</p>
                </div>
              </div>

              <div className="border-brutal shadow-brutal bg-white p-6 space-y-3">
                <h3 className="text-sm font-black uppercase text-ink">Registered Office</h3>
                <div className="text-xs font-bold text-ink/80 space-y-1">
                  <p>TRYCOMPANIOLABS LLP</p>
                  <p>DPT 808B, DLF Prime Tower</p>
                  <p>Okhla Phase-I, New Delhi – 110020</p>
                  <p>LLPIN: ACY-1464</p>
                </div>
              </div>

              <div className="border-brutal shadow-brutal bg-lime p-6">
                <h3 className="text-xs font-black uppercase text-ink">Urgent Safety Assistance</h3>
                <p className="mt-1 text-xs font-bold text-ink/80">
                  For active in-person emergency situations, dial 112 directly or use the in-app SOS button on your session screen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
