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
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0.25rem)" }}
      >
        <div className="flex h-14 items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-colors ${
                  item.isActive
                    ? "font-bold text-slate-900"
                    : "font-medium text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className={`h-4 w-4 ${item.isActive ? "text-slate-900" : "text-slate-400"}`} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}

          {/* User Sign In / Profile Tab */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center font-medium text-slate-500 hover:text-slate-800"
          >
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-[10px]">{user ? "Account" : "Sign In"}</span>
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
