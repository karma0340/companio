"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";
import MarketplaceBottomNav from "@/components/marketplace/MarketplaceBottomNav";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setWalletBalance(data.user.walletBalance || 0);
        }
      })
      .catch(() => {});
  }, []);

  // For the marketplace home page /app, render full-bleed without the internal app header
  if (pathname === "/app") {
    return (
      <div className="min-h-screen bg-[#FFF8EE] text-[#141414] font-sans pb-16 md:pb-0">
        {children}
        <MarketplaceBottomNav />
      </div>
    );
  }

  // For internal operational app routes (dashboard, booking, chat, session, host)
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#102A43] font-sans flex flex-col justify-between">
      {/* Top App Bar with Neo-Brutalist styling */}
      <header className="sticky top-0 z-40 border-b-2 border-[#102A43] bg-white px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/app/dashboard" className="flex items-center gap-2">
              <span className="rounded-md bg-[#FF7AC6] border-2 border-[#102A43] px-2 py-0.5 text-xs font-black uppercase text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]">
                PWA
              </span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#102A43]">
                Companio App
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/app/dashboard"
              className="flex items-center gap-1.5 rounded-lg border-2 border-[#102A43] bg-[#E9FF70] px-3 py-1 text-xs font-black text-[#102A43] shadow-[2px_2px_0px_0px_#102A43]"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>₹{walletBalance.toFixed(2)}</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-bold text-[#486581] hover:text-[#102A43] transition-colors"
            >
              Exit to Showroom
            </Link>
          </div>
        </div>
      </header>

      {/* Main App Content Area with mobile bottom padding */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MarketplaceBottomNav />
    </div>
  );
}
