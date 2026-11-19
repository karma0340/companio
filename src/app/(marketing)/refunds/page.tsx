import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RotateCcw, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "100% Escrow Refund Policy & Cancellation Rules",
  description:
    "Zero-risk meetups. Instant automated refunds if your host declines, cancels, or fails to attend. Transparent consumer protection.",
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
              When do you receive an automated 100% refund?
            </h2>

            <div className="space-y-4 font-body text-sm sm:text-base text-ink-soft leading-relaxed">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Host Declines Request:</strong> If the host is unavailable and declines your request, 100% of your funds are credited back instantly.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Host Fails to Respond (Timeout):</strong> Requests expire automatically after 4 hours if not accepted. 100% refund is initiated automatically.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Host No-Show:</strong> If the companion fails to meet you at the public venue or start code is never exchanged, 100% of the payment is returned to you.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Advance Cancellation by Member:</strong> You can cancel freely with a 100% refund up to 4 hours before the scheduled start time.
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
