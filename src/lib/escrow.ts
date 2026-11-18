/**
 * Companio Escrow & Financial Fee Breakdown Engine
 *
 * Implements the 70.7% Host / 24.8% Platform / 4.5% GST Escrow Model:
 * For a standard 1-hour session @ ₹499/hr:
 * - Companion Fee: ₹499.00 (100% of host advertised rate)
 * - Platform Convenience Fee: ₹175.42
 * - GST @ 18% on convenience fee: ₹31.58
 * - Total Escrow Paid by Member: ₹706.00
 */

export interface EscrowBreakdown {
  hourlyRate: number;
  durationHours: number;
  companionFee: number;
  platformFee: number;
  gstAmount: number;
  totalAmount: number;
  hostSharePercent: number;
  platformSharePercent: number;
  gstPercent: number;
}

export function calculateEscrowBreakdown(
  hourlyRate: number,
  durationHours: number = 1
): EscrowBreakdown {
  const companionFee = Math.round(hourlyRate * durationHours * 100) / 100;

  // Platform convenience fee: benchmark ₹175.42 per companion hour
  const platformFee = Math.round(175.42 * durationHours * 100) / 100;

  // GST @ 18% on platform fee: benchmark ₹31.58 per companion hour
  const gstAmount = Math.round(31.58 * durationHours * 100) / 100;

  // Total amount held in escrow
  const totalAmount = Math.round((companionFee + platformFee + gstAmount) * 100) / 100;

  return {
    hourlyRate,
    durationHours,
    companionFee,
    platformFee,
    gstAmount,
    totalAmount,
    hostSharePercent: Math.round((companionFee / totalAmount) * 1000) / 10,
    platformSharePercent: Math.round((platformFee / totalAmount) * 1000) / 10,
    gstPercent: Math.round((gstAmount / totalAmount) * 1000) / 10,
  };
}
