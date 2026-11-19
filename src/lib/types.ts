export type ActivityCategory =
  | 'gym-partner'
  | 'movie-buddy'
  | 'city-guide'
  | 'study-buddy'
  | 'shopping-buddy'
  | 'event-plus-one'
  | 'coffee-chat'
  | 'travel-buddy'
  | 'gaming-partner'
  | 'walk-and-talk'
  | 'food-walk'
  | 'festival-buddy'
  | 'sports-partner'
  | 'photo-walk'
  | 'comedy-and-shows'
  | 'career-chat'
  | 'settle-in-buddy';

export interface Activity {
  slug: ActivityCategory;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  bgHex: string;
  textHex?: string;
  badgeBg: string;
}

export interface City {
  slug: string;
  name: string;
  state: string;
  popularAreas: string[];
  activeCount: number;
}

export interface AvailabilitySlot {
  days: string; // e.g., "Mon — Fri", "Sat — Sun"
  hours: string; // e.g., "10:00 – 18:00"
}

export interface Review {
  id: string;
  authorName: string;
  authorCity: string;
  rating: number;
  date: string;
  activityName: string;
  comment: string;
}

export interface Companion {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary';
  city: string;
  area: string;
  tagline: string;
  about: string;
  avatarUrl: string;
  languages: string[];
  hourlyRate: number; // in INR
  verifiedId: boolean;
  verifiedPhoto: boolean;
  rating: number; // e.g. 4.9
  reviewCount: number;
  meetupsCount: number;
  activities: ActivityCategory[];
  isFreeToday: boolean;
  isWeekendOnly?: boolean;
  acceptsWomenOnly?: boolean;
  memberSince: string;
  availability: AvailabilitySlot[];
  reviews: Review[];
}

export interface BookingDetails {
  companionId: string;
  activitySlug: ActivityCategory;
  date: string;
  startTime: string;
  durationHours: number;
  meetingPoint: string;
  note?: string;
}

export interface PriceBreakdown {
  hourlyRate: number;
  durationHours: number;
  hostSubtotal: number;
  connectionFee: number;
  gst: number;
  totalPayable: number;
}
