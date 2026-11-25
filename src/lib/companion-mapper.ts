import { ActivityCategory, Companion } from "@/lib/types";

export function mapToActivityCategories(activities: string[] = []): ActivityCategory[] {
  const mapping: Record<string, ActivityCategory> = {
    coffee: "coffee-chat",
    cafe: "coffee-chat",
    shopping: "shopping-buddy",
    styling: "shopping-buddy",
    photo: "photo-walk",
    candid: "photo-walk",
    comedy: "comedy-and-shows",
    shows: "comedy-and-shows",
    city: "city-guide",
    walk: "walk-and-talk",
    gym: "gym-partner",
    fitness: "gym-partner",
    museum: "city-guide",
    art: "city-guide",
    book: "study-buddy",
    reading: "study-buddy",
    study: "study-buddy",
    food: "food-walk",
    crawl: "food-walk",
    eats: "food-walk",
    "co-working": "career-chat",
    career: "career-chat",
    badminton: "sports-partner",
    tennis: "sports-partner",
    cycling: "sports-partner",
    sports: "sports-partner",
    run: "sports-partner",
    board: "gaming-partner",
    arcade: "gaming-partner",
    games: "gaming-partner",
    movie: "movie-buddy",
    event: "event-plus-one",
    concert: "event-plus-one",
    festival: "festival-buddy",
    travel: "travel-buddy",
  };

  const categories = new Set<ActivityCategory>();
  for (const act of activities) {
    const lower = String(act).toLowerCase();
    let matched = false;
    for (const [key, cat] of Object.entries(mapping)) {
      if (lower.includes(key)) {
        categories.add(cat);
        matched = true;
      }
    }
    if (!matched) categories.add("coffee-chat");
  }
  if (categories.size === 0) categories.add("coffee-chat");
  return Array.from(categories);
}

export function normalizeCompanionGender(gender?: string | null): "female" | "male" | "non-binary" {
  const normalized = typeof gender === "string" ? gender.trim().toLowerCase() : "";
  if (normalized === "male") return "male";
  if (normalized === "female") return "female";
  return "non-binary";
}

export function mapApiCompanionToCard(c: any): Companion {
  const rawActs: string[] = Array.isArray(c.acceptedActivities) ? c.acceptedActivities : [];
  const slots: string[] = Array.isArray(c.availabilitySlots) ? c.availabilitySlots : [];

  return {
    id: c.id,
    name: c.displayName || c.name,
    age: Number(c.age) || 24,
    gender: normalizeCompanionGender(c.gender),
    city: (c.citySlug || (c.city ? String(c.city).toLowerCase() : "chandigarh")).trim(),
    area: c.locality || c.area || c.city || "",
    tagline: c.shortBio || c.tagline || "",
    about: c.bio || c.about || c.shortBio || "",
    avatarUrl: c.avatarUrl,
    languages: Array.isArray(c.spokenLanguages) && c.spokenLanguages.length > 0
      ? c.spokenLanguages
      : Array.isArray(c.languages)
      ? c.languages
      : ["English", "Hindi"],
    hourlyRate: Number(c.hourlyRate) || 499,
    verifiedId: true,
    verifiedPhoto: true,
    rating: Number(c.ratingAverage ?? c.rating ?? 5.0),
    reviewCount: Number(c.totalReviews ?? c.reviewCount ?? 0),
    meetupsCount: Number(c.completedMeetups ?? c.meetupsCount ?? 0),
    activities: mapToActivityCategories(rawActs),
    rawActivities: rawActs,
    preferredVenues: Array.isArray(c.preferredVenues) ? c.preferredVenues : [],
    isFreeToday: c.isAvailable ?? c.isFreeToday ?? true,
    isWeekendOnly: slots.some((s) => s.toLowerCase().includes("weekend")),
    acceptsWomenOnly: false,
    memberSince: "2026",
    availability:
      slots.length > 0
        ? slots.map((slot) => ({ days: slot, hours: "Flexible" }))
        : [{ days: "By Schedule", hours: "Flexible" }],
    reviews: Array.isArray(c.reviews) ? c.reviews : [],
  };
}
