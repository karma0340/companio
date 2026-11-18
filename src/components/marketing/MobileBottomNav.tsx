"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, User } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

export function MobileBottomNav() {
  const pathname = usePathname();
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

  // Do not render bottom tab nav on companion profile pages because they have their own sticky action bar (Unlock pass)
  if (pathname.startsWith("/companion/")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Explore",
      href: "/explore",
      icon: Compass,
      isActive: pathname.startsWith("/explore"),
    },
    {
      label: "Guide",
      href: "/how-it-works",
      icon: BookOpen,
      isActive: pathname === "/how-it-works" || pathname === "/safety",
    },
  ];

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t transition-transform duration-200"
        style={{
          background: "rgb(251, 252, 255)",
          borderTopColor: "rgba(20, 26, 46, 0.1)",
          boxShadow: "0 -2px 12px rgba(20, 26, 46, 0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0.25rem)",
        }}
      >
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-2.5 min-h-[56px] text-xs leading-tight font-sans font-semibold text-center transition-all active:scale-[0.94] ${
                  item.isActive
                    ? "text-[#194FE6]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="relative inline-flex rounded-full">
                  <Icon
                    className={`h-[22px] w-[22px] ${
                      item.isActive ? "text-[#194FE6]" : "text-slate-500"
                    }`}
                    strokeWidth={item.isActive ? 2 : 1.5}
                  />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* User Sign in / Profile Tab (1:1 Parity) */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-2.5 min-h-[56px] text-xs leading-tight font-sans font-semibold text-center text-slate-500 hover:text-slate-800 transition-all active:scale-[0.94]"
          >
            <span className="relative inline-flex rounded-full">
              <User
                className="h-[22px] w-[22px] text-slate-500"
                strokeWidth={1.5}
              />
            </span>
            <span>{user ? "Account" : "Sign in"}</span>
          </button>
        </div>
      </nav>

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
