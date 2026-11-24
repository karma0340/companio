'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, Printer, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function PassReceiptPage() {
  const params = useParams();
  const passId = String(params.passId || 'cmwuuqflo000iij08si4zdb03');
  const { user, memberProfile } = useAuth();
  const [currentDate, setCurrentDate] = useState<string>('24 Nov 2026');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  const invoiceNumber = `CMPN-${new Date().getFullYear()}-${passId.slice(-6).toUpperCase()}`;
  const userName = memberProfile?.fullName || user?.name || 'Member';
  const userPhone = user?.phone || '+91 85434 52677';
  const tierName = user?.activePassTier ? user.activePassTier.replace(/_/g, ' ') : '3 MONTH PASS';

  return (
    <div className="min-h-screen bg-paper text-ink p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-2xl space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between no-print">
          <Link
            href="/dashboard?tab=account"
            className="flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Account</span>
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border-2 border-ink bg-white px-3.5 py-1.5 text-xs font-black shadow-brutal-xs hover:bg-paper transition cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Invoice Printable Card */}
        <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-10 shadow-brutal-lg space-y-8">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-ink/20 pb-6">
            <div>
              <div className="font-display text-2xl font-black text-ink">
                Meetzy<span className="text-pink-600">Club</span>
              </div>
              <p className="text-xs font-bold text-ink-muted mt-1">
                Official Access Pass Tax Invoice &amp; Payment Receipt
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 uppercase mt-2">
                <CheckCircle2 className="h-3 w-3" />
                <span>Payment Confirmed &middot; Razorpay Secure</span>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs font-bold space-y-1">
              <div>Invoice: <span className="font-black text-ink">{invoiceNumber}</span></div>
              <div>Date: <span className="font-black text-ink">{currentDate}</span></div>
              <div>GSTIN: <span className="text-ink">07AAACM1234F1Z8</span></div>
            </div>
          </div>

          {/* Billed To / From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="font-black uppercase tracking-wider text-ink-muted block text-[10px]">
                Billed To
              </span>
              <div className="font-display text-sm font-black text-ink">{userName}</div>
              <div className="font-mono text-ink-soft">{userPhone}</div>
              {user?.email && <div className="text-ink-soft">{user.email}</div>}
            </div>

            <div className="space-y-1">
              <span className="font-black uppercase tracking-wider text-ink-muted block text-[10px]">
                Issued By
              </span>
              <div className="font-display text-sm font-black text-ink">Meetzy Club Technologies Pvt Ltd</div>
              <div className="text-ink-soft">Verified Platonic Social Platform</div>
              <div className="text-ink-soft">New Delhi &middot; Chandigarh &middot; Bengaluru</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-2xl border-2 border-ink overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper border-b-2 border-ink text-ink font-black uppercase text-[11px]">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 font-medium">
                <tr>
                  <td className="p-3">
                    <div className="font-display font-black text-ink capitalize">
                      {tierName} Access Pass
                    </div>
                    <div className="text-[11px] text-ink-soft">
                      Unlocks full companion profiles, unblurred photos, and direct booking requests across all open cities.
                    </div>
                  </td>
                  <td className="p-3 text-center font-mono">1</td>
                  <td className="p-3 text-right font-mono font-bold">₹422.88</td>
                </tr>
                <tr className="bg-paper/50">
                  <td colSpan={2} className="p-3 text-right font-bold text-ink-muted">
                    Integrated GST (18%):
                  </td>
                  <td className="p-3 text-right font-mono font-bold">₹76.12</td>
                </tr>
                <tr className="bg-sunny/30 font-display">
                  <td colSpan={2} className="p-3 text-right text-sm font-black text-ink">
                    Total Paid:
                  </td>
                  <td className="p-3 text-right text-base font-black text-ink">₹499.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Policy Callout */}
          <div className="rounded-xl border border-ink/20 bg-paper p-3 text-[11px] text-ink-soft leading-relaxed space-y-1 font-medium">
            <div className="font-bold text-ink">Important Note:</div>
            <p>
              The access pass unlocks companion profiles and messaging. Each meetup is paid separately at the companion's hourly rate before the session starts, held safely in Meetzy Club Escrow.
            </p>
          </div>

          {/* Footer Sign */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-ink/20 pt-4 text-[10px] text-ink-muted font-bold gap-2">
            <div>This is a computer-generated tax invoice. No signature is required.</div>
            <div>support@trycompanio.in</div>
          </div>
        </div>
      </div>
    </div>
  );
}
