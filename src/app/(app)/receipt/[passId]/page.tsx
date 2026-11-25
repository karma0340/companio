'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface PassReceiptData {
  id: string;
  tier: string;
  pricePaid: number;
  status: string;
  validFrom: string;
  validUntil: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
  memberName: string;
  memberPhone: string;
}

export default function PassReceiptPage() {
  const params = useParams();
  const passId = String(params.passId || '');
  const { user, memberProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [passData, setPassData] = useState<PassReceiptData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadPass() {
      if (!passId) {
        setErrorMsg('Invalid receipt ID.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/passes/${encodeURIComponent(passId)}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (!active) return;
        if (!res.ok || !data.success || !data.pass) {
          setErrorMsg(data.error || 'Receipt not found for your account.');
        } else {
          setPassData(data.pass);
        }
      } catch {
        if (active) setErrorMsg('Could not load receipt details.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPass();
    return () => {
      active = false;
    };
  }, [passId]);

  const invoiceNumber = `CMPN-${new Date(passData?.createdAt || Date.now()).getFullYear()}-${passId
    .slice(-6)
    .toUpperCase()}`;
  const formattedDate = new Date(passData?.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const userName = passData?.memberName || memberProfile?.fullName || user?.name || 'Member';
  const userPhone = passData?.memberPhone || user?.phone || '';
  const tierName = (passData?.tier || user?.activePassTier || 'THREE_MONTH').replace(/_/g, ' ');
  const totalPaid = passData?.pricePaid ?? 499;
  const baseAmount = +(totalPaid / 1.18).toFixed(2);
  const gstAmount = +(totalPaid - baseAmount).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper text-ink p-6 flex items-center justify-center">
        <div className="rounded-2xl border-brutal bg-white p-8 shadow-brutal text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-ink mx-auto" />
          <p className="font-display text-sm font-black">Loading Receipt...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !passData) {
    return (
      <div className="min-h-screen bg-paper text-ink p-6 flex items-center justify-center">
        <div className="rounded-3xl border-3 border-ink bg-white p-8 shadow-brutal max-w-md w-full text-center space-y-4">
          <h1 className="font-display text-xl font-black text-ink">Receipt Unavailable</h1>
          <p className="text-xs font-bold text-ink-soft">{errorMsg || 'Receipt could not be found.'}</p>
          <Link
            href="/dashboard?tab=account"
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-lime px-4 py-2 font-display text-xs font-black text-ink shadow-brutal-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-2xl space-y-4">
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

        <div className="rounded-3xl border-3 border-ink bg-white p-6 sm:p-10 shadow-brutal-lg space-y-8">
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
                <span>{passData.status} &middot; Razorpay Secure</span>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs font-bold space-y-1">
              <div>
                Invoice: <span className="font-black text-ink">{invoiceNumber}</span>
              </div>
              <div>
                Date: <span className="font-black text-ink">{formattedDate}</span>
              </div>
              {passData.razorpayPaymentId && (
                <div>
                  Payment ID: <span className="text-ink">{passData.razorpayPaymentId}</span>
                </div>
              )}
              <div>
                GSTIN: <span className="text-ink">07AAACM1234F1Z8</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="font-black uppercase tracking-wider text-ink-muted block text-[10px]">
                Billed To
              </span>
              <div className="font-display text-sm font-black text-ink">{userName}</div>
              {userPhone && <div className="font-mono text-ink-soft">{userPhone}</div>}
              {user?.email && <div className="text-ink-soft">{user.email}</div>}
            </div>

            <div className="space-y-1">
              <span className="font-black uppercase tracking-wider text-ink-muted block text-[10px]">
                Issued By
              </span>
              <div className="font-display text-sm font-black text-ink">
                Meetzy Club Technologies Pvt Ltd
              </div>
              <div className="text-ink-soft">Verified Platonic Social Platform</div>
              <div className="text-ink-soft">New Delhi &middot; Chandigarh &middot; Bengaluru</div>
            </div>
          </div>

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
                      {tierName.toLowerCase()} Access Pass
                    </div>
                    <div className="text-[11px] text-ink-soft">
                      Member Access Pass valid{' '}
                      {passData.validUntil
                        ? `until ${new Date(passData.validUntil).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : 'for lifetime access'}
                      .
                    </div>
                  </td>
                  <td className="p-3 text-center font-mono">1</td>
                  <td className="p-3 text-right font-mono font-bold">INR {baseAmount.toFixed(2)}</td>
                </tr>
                <tr className="bg-paper/50">
                  <td colSpan={2} className="p-3 text-right font-bold text-ink-muted">
                    Integrated GST (18%):
                  </td>
                  <td className="p-3 text-right font-mono font-bold">INR {gstAmount.toFixed(2)}</td>
                </tr>
                <tr className="bg-sunny/30 font-display">
                  <td colSpan={2} className="p-3 text-right text-sm font-black text-ink">
                    Total Paid:
                  </td>
                  <td className="p-3 text-right text-base font-black text-ink">
                    INR {totalPaid.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-ink/20 bg-paper p-3 text-[11px] text-ink-soft leading-relaxed space-y-1 font-medium">
            <div className="font-bold text-ink">Important Note:</div>
            <p>
              Each meetup booking is paid separately at the host&apos;s hourly rate and held safely in
              Meetzy Club Escrow until confirmed by the member&apos;s 4-digit in-person start PIN.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-ink/20 pt-4 text-[10px] text-ink-muted font-bold gap-2">
            <div>This is a computer-generated tax invoice. No signature is required.</div>
            <div>meetzyclub@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
