"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Calendar, ShieldCheck } from "lucide-react";

export default function MarketplaceBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Marketplace",
      href: "/app",
      icon: Home,
      isActive: pathname === "/app",
    },
    {
      label: "Explore",
      href: "/explore",
      icon: Compass,
      isActive: pathname === "/explore" || pathname.startsWith("/companion"),
    },
    {
      label: "Bookings",
      href: "/app/dashboard",
      icon: Calendar,
      isActive: pathname === "/app/dashboard" || pathname.startsWith("/app/booking"),
    },
    {
      label: "Host Mode",
      href: "/app/host/dashboard",
      icon: ShieldCheck,
      isActive: pathname.startsWith("/app/host"),
    },
  ];

  return (
    <nav
      aria-label="Marketplace mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#141414] bg-[#FFF8EE] shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0.25rem)" }}
    >
      <div className="flex h-14 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-center transition-transform active:scale-95 ${
                item.isActive ? "text-[#141414]" : "text-neutral-500 hover:text-[#141414]"
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-lg px-2 py-0.5 transition-colors ${
                  item.isActive
                    ? "bg-[#C6F432] border border-[#141414] shadow-[1px_1px_0_0_#141414]"
                    : "bg-transparent border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4 stroke-[2.2]" />
              </div>
              <span className={`text-[10px] tracking-tight ${item.isActive ? "font-black" : "font-bold"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
