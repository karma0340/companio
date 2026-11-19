import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldCheck,
  Camera,
  Lock,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: "Trust, ID Checks & Background Verification",
  description:
    "Complete transparency on how made4togethr authenticates government IDs, validates live facial selfies, and enforces public meetup rules.",
};

export default function TrustPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge variant="sunny" size="md">
              Trust & Transparency
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink">
              How we check every profile.
            </h1>

            <p className="font-body text-base sm:text-lg text-ink-soft">
              A transparent breakdown of what our verification covers, what we do not do, and our safety guarantees.
            </p>
          </div>

          <div className="rounded-3xl border-brutal bg-white p-8 sm:p-12 shadow-brutal-lg space-y-8">
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-black text-ink">
                What we verify before any profile goes live:
              </h2>

              <div className="space-y-3 font-body text-sm text-ink-soft">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Government ID Authentication:</strong> We verify the authenticity of Indian Aadhaar, Passport, or Voter ID records.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>3D Live Video Facial Match:</strong> AI and human review verify that the person creating the profile matches their government document photo.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>OTP Phone Verification:</strong> Mobile numbers are verified via real-time OTP checks and checked against fraud risk registries.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4 pt-6 border-t-brutal-sm">
              <h2 className="font-display text-2xl font-black text-ink">
                What we do not do, and will never pretend to:
              </h2>
              <div className="rounded-2xl border-brutal-sm bg-paper p-5 font-body text-xs sm:text-sm text-ink-soft space-y-2">
                <p>
                  • We do not conduct invasive criminal police background investigations in every state.
                </p>
                <p>
                  • We cannot replace your common sense. Always meet in daylight public venues and never enter private residences or hotel rooms.
                </p>
              </div>
            </section>

            <div className="pt-6 border-t-brutal-sm flex justify-center">
              <Link href="/explore">
                <Button variant="primary" size="lg">
                  <span>Explore ID-Verified Companions →</span>
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
