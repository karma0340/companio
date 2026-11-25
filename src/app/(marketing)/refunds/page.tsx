import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RotateCcw, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "Escrow Refund Policy (75% Refund / 25% Cancellation Fee)",
  description:
    "Transparent escrow protection: if a booking is cancelled, declined, or expires before start verification, 75% is refunded automatically after a 25% processing and cancellation fee.",
};

export default function RefundsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge variant="lime" size="md">
              Consumer Protection
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink">
              Escrow Refund Policy
            </h1>

            <p className="font-body text-base sm:text-lg text-ink-soft">
              Zero-risk booking. Your funds are held safely in escrow and never released without mutual verification.
            </p>
          </div>

          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-12 shadow-brutal-lg space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink">
              How do 75% Escrow Refunds &amp; 25% Deductions work?
            </h2>

            <div className="space-y-4 font-body text-sm sm:text-base text-ink-soft leading-relaxed">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Member Cancellation:</strong> If you cancel a pending or confirmed meetup before PIN verification, a 25% cancellation and gateway processing fee is deducted and <strong>75% is refunded</strong> directly to your original payment method.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Host Declines or Fails to Respond (12-Hour SLA):</strong> If the host declines or the reservation expires after 12 hours, a 25% processing fee applies and <strong>75% is released back</strong> automatically.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>No PIN Exchange, Zero Host Release:</strong> A host never receives their 70% share unless you meet in person and verify the 4-digit start PIN.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t-brutal-sm flex justify-center">
              <Link href="/explore">
                <Button variant="primary" size="lg">
                  <span>Explore Companions with Escrow Protection →</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
