/**
 * Meetzy Club Unified 70/30 Escrow & Revenue Split Engine
 *
 * Fixed across ALL Host Packages:
 * - Member pays listed meetup amount: hourlyRate * durationHours (Taxes & gateway included)
 * - Host Take-Home Share: 70% fixed (credited to Host Wallet upon PIN-verified completion)
 * - Platform Allocation: 30% (covers statutory GST, Razorpay processing charges, SOS/safety ops & platform revenue)
 */

export const HOST_SHARE_RATIO = 0.70;
export const PLATFORM_SHARE_RATIO = 0.30;

export interface EscrowBreakdown {
  hourlyRate: number;
  durationHours: number;
  grossAmount: number;
  companionFee: number;       // 70% credited to Host Wallet
  platformShareTotal: number; // 30% all-inclusive platform allocation
  platformFee: number;        // Net platform + gateway + safety share inside 30%
  gstAmount: number;          // Statutory 18% GST component inside 30%
  razorpayEstimate: number;   // ~2.36% Razorpay fee + GST inside 30%
  totalAmount: number;        // Member total payable
  hostSharePercent: number;
  platformSharePercent: number;
}

export function calculateEscrowBreakdown(
  hourlyRate: number,
  durationHours: number = 1
): EscrowBreakdown {
  const safeRate = Math.max(0, Number(hourlyRate) || 0);
  const safeHours = Math.max(1, Number(durationHours) || 1);

  const grossAmount = Math.round(safeRate * safeHours * 100) / 100;
  const companionFee = Math.round(grossAmount * HOST_SHARE_RATIO * 100) / 100;
  const platformShareTotal = Math.round((grossAmount - companionFee) * 100) / 100;

  // Statutory 18% GST included inside the 30% platform share
  const gstAmount = Math.round((platformShareTotal - platformShareTotal / 1.18) * 100) / 100;
  const razorpayEstimate = Math.round(grossAmount * 0.0236 * 100) / 100;
  const platformFee = Math.round((platformShareTotal - gstAmount) * 100) / 100;

  return {
    hourlyRate: safeRate,
    durationHours: safeHours,
    grossAmount,
    companionFee,
    platformShareTotal,
    platformFee,
    gstAmount,
    razorpayEstimate,
    totalAmount: grossAmount,
    hostSharePercent: 70,
    platformSharePercent: 30,
  };
}
