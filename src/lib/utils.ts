import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PriceBreakdown } from "./types";
import { calculateEscrowBreakdown } from "./escrow";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculatePrice(hourlyRate: number, durationHours: number): PriceBreakdown {
  const breakdown = calculateEscrowBreakdown(hourlyRate, durationHours);

  return {
    hourlyRate: breakdown.hourlyRate,
    durationHours: breakdown.durationHours,
    hostSubtotal: breakdown.grossAmount,
    connectionFee: breakdown.platformFee,
    gst: breakdown.gstAmount,
    totalPayable: breakdown.totalAmount,
  };
}

export function generateStartCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
