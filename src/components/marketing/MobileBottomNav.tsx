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
      isActive: pathname.startsWith("/explore") || pathname.startsWith("/companion"),
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.5)]"
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
                  item.isActive ? "text-[#D4AF37]" : "text-[#8E8E93] hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${item.isActive ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
                <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          {/* Account / Sign-in Item */}
          {user ? (
            <Link
              href="/app/dashboard"
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-colors ${
                pathname.startsWith("/app") ? "text-[#D4AF37]" : "text-[#8E8E93] hover:text-white"
              }`}
            >
              <div className="relative">
                <User className="h-5 w-5 stroke-[1.6]" />
                {user.isUnlocked && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#D4AF37]"></span>
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-tight">App Portal</span>
            </Link>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center text-[#8E8E93] hover:text-white transition-colors"
            >
              <User className="h-5 w-5 stroke-[1.6]" />
              <span className="text-[10px] font-semibold tracking-tight">Sign In</span>
            </button>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </>
  );
}
