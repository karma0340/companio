import Link from "next/link";
import React from "react";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MobileBottomNav } from "@/components/marketing/MobileBottomNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7] font-sans selection:bg-[#D4AF37] selection:text-black flex flex-col justify-between">
      {/* Interactive Responsive Navbar */}
      <MarketingNavbar />

      {/* Main Content Area with Mobile Bottom Nav Padding */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      {/* Mobile Sticky Bottom Navigation (Exact trycompanio.in spec) */}
      <MobileBottomNav />

      {/* Marketing Footer */}
      <footer className="border-t border-[#262626] bg-[#050505] py-14 text-sm text-[#8E8E93]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-4 pb-12 border-b border-[#1C1C1C]">
            {/* Brand Info */}
            <div className="md:col-span-2">
              <Link href="/" className="font-serif text-2xl font-bold text-white">
                Companio<span className="text-[#D4AF37]">.</span>
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-[#8E8E93] max-w-md">
                India&apos;s premier on-demand platonic companionship marketplace. Connecting urban adults for safe, respectful, public social activities across 60+ metropolitan cities.
              </p>
              <div className="mt-4 text-[11px] text-[#555]">
                Operated by TRYCOMPANIOLABS LLP • RoC Delhi (LLPIN: ACY-1464)
              </div>
            </div>

            {/* Explore & Product Links */}
            <div>
              <h4 className="font-serif text-sm font-bold text-white mb-3">Explore</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/explore" className="hover:text-white">All Companions</Link></li>
                <li><Link href="/city/delhi" className="hover:text-white">Delhi Companions</Link></li>
                <li><Link href="/city/bengaluru" className="hover:text-white">Bengaluru Companions</Link></li>
                <li><Link href="/city/mumbai" className="hover:text-white">Mumbai Companions</Link></li>
                <li><Link href="/experience/coffee" className="hover:text-white">Coffee Experiences</Link></li>
                <li><Link href="/become-a-companion" className="text-[#D4AF37] hover:underline font-semibold">Become a Companion</Link></li>
              </ul>
            </div>

            {/* Trust & Legal Links */}
            <div>
              <h4 className="font-serif text-sm font-bold text-white mb-3">Trust & Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/safety" className="hover:text-white">Safety Centre</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/community-guidelines" className="hover:text-white">Community Guidelines</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/refunds" className="hover:text-white">Refund Policy</Link></li>
                <li><Link href="/contact" className="hover:text-white">Grievance Redressal</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#555] gap-4">
            <div>
              © Companio Ecosystem. All rights reserved. Strictly platonic public experiences only.
            </div>
            <div className="flex gap-4">
              <span>Public Venues Only</span>
              <span>•</span>
              <span>Escrow Safe</span>
              <span>•</span>
              <span>100% ID Checks</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
