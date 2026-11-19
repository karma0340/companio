import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PriceBreakdown } from "./types";

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
  const hostSubtotal = hourlyRate * durationHours;
  // Transparent Companio safety, escrow & verification fee (~18%)
  const connectionFee = Math.round(hostSubtotal * 0.18);
  // Statutory 18% GST on the connection fee
  const gst = Math.round(connectionFee * 0.18);
  const totalPayable = hostSubtotal + connectionFee + gst;

  return {
    hourlyRate,
    durationHours,
    hostSubtotal,
    connectionFee,
    gst,
    totalPayable,
  };
}

export function generateStartCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
