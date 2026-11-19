import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Heart } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { ACTIVITIES } from '@/lib/data/activities';
import { CITIES } from '@/lib/data/cities';

export function Footer() {
  return (
    <footer className="w-full border-t-brutal bg-paper-deep pt-16 pb-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />

            <p className="font-display text-lg font-bold text-ink leading-snug">
              Find a buddy, not a date.
            </p>

            <p className="font-body text-sm text-ink-soft leading-relaxed max-w-sm">
              Verified local companions for the things that are better together — gym, movies, coffee chats, food walks, and city explorations. 100% platonic, 18+, safety-first.
            </p>

            {/* Emergency & Trust Highlight Box */}
            <div className="rounded-2xl border-brutal bg-white p-4 shadow-brutal-sm space-y-2">
              <div className="flex items-center gap-2 text-danger font-display text-xs font-black uppercase">
                <ShieldAlert className="h-4 w-4" />
                <span>24/7 Safety Protocol</span>
              </div>
              <p className="text-xs text-ink-soft">
                Emergency in India? Call <strong className="text-ink">112</strong> immediately.
              </p>
              <p className="text-xs text-ink-soft">
                Safety & Moderation Desk:{' '}
                <a href="mailto:safety@made4togethr.com" className="font-bold underline text-ink">
                  safety@made4togethr.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Popular Activities */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-ink">
              Activities
            </h4>
            <ul className="space-y-2 font-display text-xs font-bold text-ink-soft">
              {ACTIVITIES.slice(0, 7).map((act) => (
                <li key={act.slug}>
                  <Link
                    href={`/explore/${act.slug}`}
                    className="hover:text-lavender hover:underline transition-colors flex items-center gap-2 group"
                  >
                    <ActivityIcon slug={act.slug} size="xs" animated />
                    <span>{act.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/explore" className="text-lavender underline font-extrabold">
                  View all 17 activities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Cities */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-ink">
              Cities
            </h4>
            <ul className="space-y-2 font-display text-xs font-bold text-ink-soft">
              {CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}/companions`}
                    className="hover:text-lavender hover:underline transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Platform & Trust */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-black uppercase tracking-wider text-ink">
              Togethr
            </h4>
            <ul className="space-y-2 font-display text-xs font-bold text-ink-soft">
              <li>
                <Link href="/about" className="hover:text-lavender hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-lavender hover:underline">
                  Membership Passes
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-lavender hover:underline">
                  Contact &amp; Grievance
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-lavender hover:underline">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-lavender hover:underline">
                  Safety & Verification
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-lavender hover:underline">
                  Trust & ID Checks
                </Link>
              </li>
              <li>
                <Link href="/become-a-companion" className="hover:text-lavender hover:underline">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-lavender hover:underline">
                  Questions & Answers
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-lavender hover:underline">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-lavender hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-lavender hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-lavender hover:underline">
                  Refund Policy (100% Escrow)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Made in India */}
        <div className="mt-12 pt-8 border-t-brutal flex flex-col sm:flex-row items-center justify-between gap-4 font-display text-xs font-bold text-ink-soft">
          <div className="flex items-center gap-1.5">
            <span>© 2026 made4togethr Labs. Strictly platonic companionship.</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border-brutal-sm shadow-brutal-sm text-ink">
            <span>Crafted with care in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
