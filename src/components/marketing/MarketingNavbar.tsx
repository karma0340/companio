"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Shield, User, LogOut, Heart } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md text-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand Logo with Gradient Heart Icon (Image 2 & 3 Parity) */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-1.5 shadow-xs">
            <Heart className="h-full w-full fill-white text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Companio
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center space-x-7 text-sm font-medium text-slate-600 md:flex">
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

        {/* Right CTA Actions */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link
            href="/safety"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            <span>Safety</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-200 transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>{user.name || "Member Dashboard"}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full bg-[#101828] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-black transition"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/safety"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700"
          >
            <Shield className="h-3 w-3 text-slate-500" />
            <span>Safety</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-900"
            >
              Explore
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-900"
            >
              How it works
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-900"
            >
              Contact Us
            </Link>
            <Link
              href="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-900"
            >
              Safety
            </Link>

            <div className="pt-2 border-t border-slate-100">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-xl bg-slate-100 py-2.5 text-center text-xs font-bold text-slate-800"
                  >
                    Member Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 text-xs text-red-600 font-semibold"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full rounded-xl bg-[#101828] py-2.5 text-center text-xs font-bold text-white shadow-xs hover:bg-black"
                >
                  Sign in
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Auth Modal Trigger */}
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
