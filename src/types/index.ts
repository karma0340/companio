/**
 * Shared Type Definitions for Companio Platform
 */

export type PassTier = "ONE_MONTH" | "THREE_MONTH" | "SIX_MONTH" | "ONE_YEAR" | "LIFETIME";

export interface PassTierOption {
  tier: PassTier;
  name: string;
  price: number;
  durationDays: number | null; // null for lifetime
  tagline: string;
  features: string[];
  isPopular?: boolean;
}

export interface CompanionSummary {
  id: string;
  name: string;
  displayName: string;
  maskedName: string;
  avatarUrl: string;
  blurredAvatarUrl: string;
  city: string;
  citySlug: string;
  bio: string;
  shortBio: string;
  hourlyRate: number;
  ratingAverage: number;
  totalReviews: number;
  spokenLanguages: string[];
  acceptedActivities: string[];
  isAvailable: boolean;
}

export interface CitySummary {
  id: string;
  name: string;
  slug: string;
  state: string;
  isActive: boolean;
  companionCount?: number;
}

export interface ActivitySummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  suggestedDuration: number;
  icon: string;
}

export interface BookingDetails {
  bookingId: string;
  bookingNumber: string;
  memberId: string;
  companionId: string;
  companionName: string;
  activityTitle: string;
  venueName: string;
  venueAddress: string;
  scheduledDate: string;
  durationHours: number;
  totalAmount: number;
  companionFee: number;
  platformFee: number;
  gstAmount: number;
  status: "PENDING_ACCEPTANCE" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  verificationPin?: string;
}

export interface ChatMessagePayload {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  isRedacted: boolean;
  redactionReason?: string;
  sentAt: string;
}
