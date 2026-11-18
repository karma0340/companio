import Link from "next/link";
import React from "react";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MobileBottomNav } from "@/components/marketing/MobileBottomNav";
import { Heart } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 font-sans flex flex-col justify-between">
      {/* Interactive Responsive Navbar */}
      <MarketingNavbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

      {/* Light Theme Clean Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 text-sm text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-4 pb-10 border-b border-slate-100">
            {/* Brand Info */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-1 shadow-xs">
                  <Heart className="h-full w-full fill-white text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Companio
                </span>
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-slate-500 max-w-md">
                India&apos;s premier on-demand platonic companionship marketplace. Connecting urban adults for safe, respectful, public social activities across metropolitan cities.
              </p>
              <div className="mt-3 text-[11px] text-slate-400">
                TRYCOMPANIOLABS LLP · DPT 808B, DLF Prime Tower, Okhla Phase-I, New Delhi – 110020 · LLPIN ACY-1464
              </div>
            </div>

            {/* Explore & Product Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Explore</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/explore" className="hover:text-slate-900">All Companions</Link></li>
                <li><Link href="/city/delhi" className="hover:text-slate-900">Delhi NCR Companions</Link></li>
                <li><Link href="/city/bengaluru" className="hover:text-slate-900">Bengaluru Companions</Link></li>
                <li><Link href="/city/mumbai" className="hover:text-slate-900">Mumbai Companions</Link></li>
                <li><Link href="/experience/coffee" className="hover:text-slate-900">Café & Coffee Meetups</Link></li>
                <li><Link href="/become-a-companion" className="text-blue-600 hover:underline font-semibold">Become a Companion</Link></li>
              </ul>
            </div>

            {/* Trust & Legal Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Trust & Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/safety" className="hover:text-slate-900">Safety Centre</Link></li>
                <li><Link href="/how-it-works" className="hover:text-slate-900">How It Works</Link></li>
                <li><Link href="/community-guidelines" className="hover:text-slate-900">Community Guidelines</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
                <li><Link href="/refunds" className="hover:text-slate-900">Refund Policy</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900">Grievance Officer</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              © TRYCOMPANIOLABS LLP. All rights reserved. Strictly platonic, public venues only.
            </div>
            <div className="flex gap-4 text-[11px]">
              <span>Public Venues Only</span>
              <span>•</span>
              <span>Escrow Protected</span>
              <span>•</span>
              <span>100% ID Checks</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
