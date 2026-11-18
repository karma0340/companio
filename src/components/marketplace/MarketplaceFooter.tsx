import React from "react";
import Link from "next/link";

export default function MarketplaceFooter() {
  return (
    <footer className="bg-[#141414] text-[#FFF8EE] border-t-4 border-[#C6F432] pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <span className="font-black text-2xl tracking-tight text-white font-serif uppercase">
              COMPANIO
            </span>
            <p className="text-sm text-neutral-400">
              Verified local buddies for gym, movies, coffee & city walks in India. 100% platonic, 18+, safety-first.
            </p>
            <div className="pt-2">
              <a
                href="https://instagram.com/get_companio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#FFD23F] hover:underline"
              >
                Follow on Instagram @get_companio
              </a>
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-2">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#C6F432]">
              Popular Activities
            </h4>
            <ul className="space-y-1.5 text-sm text-neutral-300">
              <li><Link href="/explore" className="hover:text-white">Gym Partner</Link></li>
              <li><Link href="/explore" className="hover:text-white">Movie Buddy</Link></li>
              <li><Link href="/explore" className="hover:text-white">City Guide</Link></li>
              <li><Link href="/explore" className="hover:text-white">Study Buddy</Link></li>
              <li><Link href="/explore" className="hover:text-white">Shopping Companion</Link></li>
              <li><Link href="/explore" className="hover:text-white">Event Plus-One</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div className="space-y-2">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#FFD23F]">
              Top Cities
            </h4>
            <ul className="space-y-1.5 text-sm text-neutral-300">
              <li><Link href="/city/delhi" className="hover:text-white">Delhi NCR</Link></li>
              <li><Link href="/city/mumbai" className="hover:text-white">Mumbai</Link></li>
              <li><Link href="/city/bengaluru" className="hover:text-white">Bengaluru</Link></li>
              <li><Link href="/city/pune" className="hover:text-white">Pune</Link></li>
              <li><Link href="/city/hyderabad" className="hover:text-white">Hyderabad</Link></li>
              <li><Link href="/city/jaipur" className="hover:text-white">Jaipur</Link></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-2">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#FF7AC6]">
              Trust & Safety
            </h4>
            <ul className="space-y-1.5 text-sm text-neutral-300">
              <li><Link href="/safety" className="hover:text-white">Safety Center & SOS</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white">How Escrow Works</Link></li>
              <li><Link href="/community-guidelines" className="hover:text-white">Community Guidelines</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="hover:text-white">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Statutory Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© 2026 Companio Network. Operational PWA Marketplace Platform.</p>
          <p>Strictly Platonic. Zero Romance or Dating Solicitation Tolerated.</p>
        </div>
      </div>
    </footer>
  );
}
