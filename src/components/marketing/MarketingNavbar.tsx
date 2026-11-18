"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, UserCheck, LogOut } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

export function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.reload();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#262626] bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F7]">
          Companio<span className="text-[#D4AF37]">.</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center space-x-8 text-sm font-medium text-[#8E8E93] md:flex">
          <Link href="/explore" className="transition hover:text-white">
            Explore
          </Link>
          <Link href="/how-it-works" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="/safety" className="transition hover:text-white">
            Safety
          </Link>
          <Link href="/become-a-companion" className="transition hover:text-white">
            Become a Companion
          </Link>
          <Link href="/about" className="transition hover:text-white">
            About Us
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/app/dashboard"
                className="flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white border border-[#333] transition hover:bg-[#252525]"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>{user.name || user.phone}</span>
                {user.isUnlocked && (
                  <span className="ml-1 rounded bg-[#D4AF37]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#D4AF37]">
                    PRO
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="rounded-full p-2 text-[#8E8E93] hover:text-white hover:bg-[#1A1A1A] transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white border border-[#333] transition hover:bg-[#252525]"
            >
              Sign In
            </button>
          )}

          <Link
            href="/explore"
            className="rounded-full bg-[#F5F5F7] px-5 py-2 text-xs font-bold text-black transition hover:bg-[#E5E5E7]"
          >
            Find a companion
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-[#8E8E93] hover:text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#262626] bg-[#0E0E0E]/98 px-6 py-6 md:hidden animate-in slide-in-from-top-2 backdrop-blur-xl shadow-2xl">
          <nav className="flex flex-col space-y-3.5 text-sm font-semibold text-[#A1A1A6]">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-white border-b border-[#1E1E1E]"
            >
              <span>Explore Companions</span>
              <span className="text-xs text-[#D4AF37] font-bold">126+ Cities</span>
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Safety Centre & SOS</span>
            </Link>
            <Link
              href="/become-a-companion"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-[#D4AF37] hover:underline"
            >
              Become a Companion (Earn ₹499+/hr)
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              About Companio
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              Contact & Grievance
            </Link>

            {/* PWA Portal Switch */}
            <div className="pt-2">
              <Link
                href="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#1A1A1A] border border-[#D4AF37]/40 py-2.5 text-xs font-bold text-[#D4AF37]"
              >
                <span>Switch to Marketplace PWA →</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-[#262626] flex flex-col gap-2.5">
              {user ? (
                <div className="flex items-center justify-between bg-[#141414] border border-[#262626] p-3 rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-white">{user.name || "Member"}</div>
                    <div className="text-[11px] text-[#8E8E93]">{user.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/app/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-red-400 hover:text-red-300 ml-1"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full rounded-full bg-[#D4AF37] py-3 text-center text-xs font-bold text-black shadow-md"
                >
                  Sign In via Mobile OTP
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </header>
  );
}
