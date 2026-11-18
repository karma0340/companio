"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, Compass, HelpCircle, UserPlus, ArrowUpRight } from "lucide-react";

export default function MarketplaceHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installed, setInstalled] = useState(false);

  const handleInstallClick = () => {
    setInstalled(true);
    alert("Companio PWA ready to install. Tap Share -> Add to Home Screen in your browser.");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8EE] border-b-2 border-[#141414]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[64px] sm:h-[68px] flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/app" className="flex items-center gap-2">
            <span className="font-black text-xl sm:text-2xl tracking-tight text-[#141414] font-serif uppercase">
              COMPANIO
            </span>
            <span className="bg-[#C6F432] text-[#141414] text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-[#141414]">
              APP
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#141414]">
          <Link href="/explore" className="hover:text-amber-800 transition-colors">
            Explore
          </Link>
          <Link href="/how-it-works" className="hover:text-amber-800 transition-colors">
            How it works
          </Link>
          <Link href="/safety" className="hover:text-amber-800 transition-colors">
            Safety
          </Link>
          <Link href="/become-a-companion" className="hover:text-amber-800 transition-colors">
            Become a host
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleInstallClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD23F] text-[#141414] font-black text-xs uppercase tracking-wider rounded-lg border-2 border-[#141414] shadow-[3px_3px_0_0_#141414] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_#141414] transition-all"
          >
            {installed ? "Installed" : "Install App"}
          </button>
          
          <Link
            href="/explore"
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#141414] text-[#FFF8EE] font-black text-xs sm:text-sm rounded-lg border-2 border-[#141414] shadow-[2px_2px_0_0_#C6F432] sm:shadow-[3px_3px_0_0_#C6F432] hover:bg-neutral-800 transition-all"
          >
            Find Company
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#141414] bg-white border-2 border-[#141414] rounded-lg shadow-[2px_2px_0_0_#141414] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF8EE] border-b-2 border-[#141414] px-4 py-5 space-y-3 animate-in slide-in-from-top-2 shadow-lg">
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-base font-black text-[#141414] border-b border-neutral-300"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="h-5 w-5" />
              <span>Explore Companions</span>
            </div>
            <span className="text-xs font-bold text-amber-900">48+ Hosts →</span>
          </Link>

          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-sm font-bold text-[#141414]"
          >
            <HelpCircle className="h-4 w-4" />
            <span>How it Works (3 Steps)</span>
          </Link>

          <Link
            href="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-sm font-bold text-[#141414]"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Trust & Safety (Escrow + SOS)</span>
          </Link>

          <Link
            href="/become-a-companion"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-sm font-black text-[#141414] text-amber-900"
          >
            <UserPlus className="h-4 w-4" />
            <span>Become a Host (Earn ₹45,000+)</span>
          </Link>

          {/* Switch to Showroom Link */}
          <div className="pt-2 border-t border-neutral-300">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-xs font-bold text-neutral-600 hover:text-black"
            >
              <span>Visit Dark Luxury Showroom (trycompanio.in)</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleInstallClick();
              }}
              className="w-full py-3 bg-[#FFD23F] text-[#141414] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#141414] shadow-[3px_3px_0_0_#141414] active:shadow-none"
            >
              Add Companio PWA to Home Screen
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
