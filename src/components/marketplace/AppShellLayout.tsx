"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Shield, Compass, BookOpen, User, Wallet } from "lucide-react";
import { MobileBottomNav } from "@/components/marketing/MobileBottomNav";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [user, setUser] = useState<{ id: string; name?: string; role: string; isUnlocked: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setWalletBalance(data.user.walletBalance || 0);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Modern Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          {/* Logo with Gradient Heart Icon */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="Companio home">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-1.5 shadow-xs">
              <Heart className="h-full w-full fill-white text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Companio
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/explore" className="transition hover:text-slate-900">
              Explore
            </Link>
            <Link href="/how-it-works" className="transition hover:text-slate-900">
              How it works
            </Link>
            <Link href="/become-a-companion" className="transition hover:text-slate-900">
              Become a Companion
            </Link>
          </nav>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            <Link
              href="/safety"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              <span>Safety</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-800 transition"
            >
              <User className="h-3.5 w-3.5" />
              <span>{user?.name || "Member Portal"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}
