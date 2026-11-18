"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Headset, Shield, Heart } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

export function MarketingNavbar() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name?: string; phone: string; isUnlocked: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md text-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16">
        {/* Brand Logo with Gradient Heart Icon (Image 2 Parity) */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Companio home">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-1.5 shadow-xs">
            <Heart className="h-full w-full fill-white text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Companio
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/explore" className="transition hover:text-slate-900">
            Explore
          </Link>
          <Link href="/how-it-works" className="transition hover:text-slate-900">
            How it works
          </Link>
          <Link href="/contact" className="transition hover:text-slate-900">
            Contact Us
          </Link>
        </nav>

        {/* Desktop Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/safety"
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            <span>Safety</span>
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-200 transition"
            >
              Dashboard
            </Link>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full bg-[#101828] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-black transition"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile Header Right: Headset / Support Icon Only (Exact Image 2 Parity) */}
        <div className="flex items-center md:hidden">
          <Link
            href="/contact"
            aria-label="Contact Support"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition active:scale-95"
          >
            <Headset className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          window.location.reload();
        }}
      />
    </header>
  );
}
