import { CompanionSummary, CitySummary, ActivitySummary, PassTierOption } from "@/types";
import { prisma } from "./prisma";

export const PASS_TIER_OPTIONS: PassTierOption[] = [
  {
    tier: "ONE_MONTH",
    name: "1-Month Pass",
    price: 99.50,
    durationDays: 30,
    tagline: "Great for trying out the platform",
    features: [
      "Unblur all companion profiles",
      "Full biographies & reviews",
      "Unlock booking requests",
      "Active for 30 calendar days",
    ],
  },
  {
    tier: "THREE_MONTH",
    name: "3-Month Pass",
    price: 199.50,
    durationDays: 90,
    tagline: "Most popular for new city residents",
    features: [
      "All 1-Month features included",
      "Priority companion matching",
      "Active for 90 calendar days",
    ],
    isPopular: true,
  },
  {
    tier: "SIX_MONTH",
    name: "6-Month Pass",
    price: 499.50,
    durationDays: 180,
    tagline: "Best value for regular social meetups",
    features: [
      "All 3-Month features included",
      "Zero platform fee on first 2 bookings",
      "Active for 180 calendar days",
    ],
  },
  {
    tier: "ONE_YEAR",
    name: "1-Year Pass",
    price: 699.50,
    durationDays: 365,
    tagline: "Full year of companion access",
    features: [
      "Early access to newly verified hosts",
      "Exclusive seasonal activities",
      "Active for 365 calendar days",
    ],
  },
  {
    tier: "LIFETIME",
    name: "Lifetime Pass",
    price: 999.50,
    durationDays: null,
    tagline: "Permanent access forever",
    features: [
      "Never expires — permanent access",
      "Founding Member badge on profile",
      "Direct VIP concierge support",
    ],
  },
];

export const MOCK_CITIES: CitySummary[] = [
  { id: "city_01", name: "Delhi", slug: "delhi", state: "Delhi NCR", isActive: true, companionCount: 42 },
  { id: "city_02", name: "Bengaluru", slug: "bengaluru", state: "Karnataka", isActive: true, companionCount: 68 },
  { id: "city_03", name: "Mumbai", slug: "mumbai", state: "Maharashtra", isActive: true, companionCount: 54 },
  { id: "city_04", name: "Pune", slug: "pune", state: "Maharashtra", isActive: true, companionCount: 29 },
  { id: "city_05", name: "Hyderabad", slug: "hyderabad", state: "Telangana", isActive: true, companionCount: 33 },
];

export const MOCK_ACTIVITIES: ActivitySummary[] = [
  { id: "act_01", title: "Café & Conversation", slug: "coffee", description: "Grab artisan coffee, unwind, and enjoy good conversation in a cozy cafe.", suggestedDuration: 1, icon: "coffee" },
  { id: "act_02", title: "City Walk & Exploration", slug: "city-walk", description: "Stroll through scenic streets, parks, historical markets, and hidden alleys.", suggestedDuration: 2, icon: "map-pin" },
  { id: "act_03", title: "Gym & Fitness Spotting", slug: "gym", description: "Get a workout partner, spotter, or running companion to keep you motivated.", suggestedDuration: 1, icon: "dumbbell" },
  { id: "act_04", title: "Gigs, Standup & Events", slug: "events", description: "Never go to comedy shows, live concerts, or food festivals alone.", suggestedDuration: 3, icon: "ticket" },
  { id: "act_05", title: "Museum & Art Galleries", slug: "museum", description: "Explore contemporary art, heritage exhibits, and cultural spaces together.", suggestedDuration: 2, icon: "palette" },
];

export const MOCK_COMPANIONS: CompanionSummary[] = [
  {
    id: "comp_01",
    name: "Vanshika Sharma",
    displayName: "Vanshika",
    maskedName: "Vanshika S***",
    city: "Delhi NCR",
    citySlug: "delhi",
    hourlyRate: 499,
    ratingAverage: 4.9,
    totalReviews: 28,
    spokenLanguages: ["English", "Hindi"],
    acceptedActivities: ["Café & Conversation", "Museum & Art Galleries", "City Walk & Exploration"],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    blurredAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&blur=15&q=30",
    bio: "Masters in Psychology student at DU. Passionate about indie music, specialty roasteries in Hauz Khas, and thoughtful conversations about books and urban life.",
    shortBio: "DU Psychology student. Love coffee & indie books.",
    isAvailable: true,
  },
  {
    id: "comp_02",
    name: "Kritika Sen",
    displayName: "Kritika",
    maskedName: "Kritika S***",
    city: "Bengaluru",
    citySlug: "bengaluru",
    hourlyRate: 549,
    ratingAverage: 5.0,
    totalReviews: 42,
    spokenLanguages: ["English", "Hindi", "Bengali"],
    acceptedActivities: ["Café & Conversation", "City Walk & Exploration", "Gym & Fitness Spotting"],
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    blurredAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=50&blur=15&q=30",
    bio: "UI/UX Designer working in Indiranagar. Big foodie, sourdough enthusiast, and weekend runner around Cubbon Park. Fluent in tech and design banter.",
    shortBio: "Designer in Indiranagar. Foodie & Cubbon runner.",
    isAvailable: true,
  },
  {
    id: "comp_03",
    name: "Rohan Malhotra",
    displayName: "Rohan",
    maskedName: "Rohan M***",
    city: "Mumbai",
    citySlug: "mumbai",
    hourlyRate: 499,
    ratingAverage: 4.8,
    totalReviews: 19,
    spokenLanguages: ["English", "Hindi", "Marathi"],
    acceptedActivities: ["Café & Conversation", "Gigs, Standup & Events", "City Walk & Exploration"],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    blurredAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&blur=15&q=30",
    bio: "Screenwriter and podcast host based in Bandra. Great listener with endless stories about Mumbai film culture and retro architecture.",
    shortBio: "Bandra writer. Film culture & retro architecture.",
    isAvailable: true,
  },
  {
    id: "comp_04",
    name: "Ananya Roy",
    displayName: "Ananya",
    maskedName: "Ananya R***",
    city: "Bengaluru",
    citySlug: "bengaluru",
    hourlyRate: 599,
    ratingAverage: 5.0,
    totalReviews: 31,
    spokenLanguages: ["English", "Hindi"],
    acceptedActivities: ["Museum & Art Galleries", "Café & Conversation"],
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    blurredAvatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=50&blur=15&q=30",
    bio: "Fintech analyst by day, contemporary art enthusiast on weekends. Love exploring quiet corners of Bengaluru, artisan matcha, and gallery exhibitions.",
    shortBio: "Fintech analyst. Love art galleries & quiet cafes.",
    isAvailable: true,
  },
  {
    id: "comp_05",
    name: "Kashish Agarwal",
    displayName: "Kashish",
    maskedName: "Kashish A***",
    city: "Bengaluru",
    citySlug: "bengaluru",
    hourlyRate: 499,
    ratingAverage: 4.9,
    totalReviews: 28,
    spokenLanguages: ["English", "Hindi", "Kannada"],
    acceptedActivities: ["Shopping Buddy", "Café & Conversation", "City Walk & Exploration"],
    avatarUrl: "/assets/hosts/kashish.webp",
    blurredAvatarUrl: "/assets/hosts/locked_kritika.webp",
    bio: "Show me around? No — let me show you around Bengaluru. Best cafes, hidden rooftop spots, and honest shopping advice.",
    shortBio: "Bengaluru local guide. Shopping & hidden cafes.",
    isAvailable: true,
  },
  {
    id: "comp_06",
    name: "Shameera Khan",
    displayName: "Shameera",
    maskedName: "Shameera K***",
    city: "Mumbai",
    citySlug: "mumbai",
    hourlyRate: 599,
    ratingAverage: 5.0,
    totalReviews: 42,
    spokenLanguages: ["English", "Hindi"],
    acceptedActivities: ["City Walk & Exploration", "Gigs, Standup & Events", "Café & Conversation"],
    avatarUrl: "/assets/hosts/shameera.webp",
    blurredAvatarUrl: "/assets/hosts/locked_kritika.webp",
    bio: "Your friendly companion for coffee, Marine Drive strolls, and live indie concerts. Great energy and zero awkward pauses.",
    shortBio: "Marine Drive walks & live gigs enthusiast.",
    isAvailable: true,
  },
  {
    id: "comp_07",
    name: "Akash Verma",
    displayName: "Akash",
    maskedName: "Akash V***",
    city: "Bengaluru",
    citySlug: "bengaluru",
    hourlyRate: 499,
    ratingAverage: 4.8,
    totalReviews: 19,
    spokenLanguages: ["English", "Hindi"],
    acceptedActivities: ["Gym & Fitness Spotting", "Café & Conversation"],
    avatarUrl: "/assets/hosts/akash.webp",
    blurredAvatarUrl: "/assets/hosts/locked_kritika.webp",
    bio: "Tech professional and fitness spotter in Indiranagar. Reliable workout partner, form check buddy, and tech banter over coffee.",
    shortBio: "Indiranagar fitness spotter & tech buddy.",
    isAvailable: true,
  },
  {
    id: "comp_08",
    name: "Samridhi Sharma",
    displayName: "Samridhi",
    maskedName: "Samridhi S***",
    city: "Delhi NCR",
    citySlug: "delhi",
    hourlyRate: 499,
    ratingAverage: 4.9,
    totalReviews: 34,
    spokenLanguages: ["English", "Hindi"],
    acceptedActivities: ["Café & Conversation", "Museum & Art Galleries"],
    avatarUrl: "/assets/hosts/samridhi.webp",
    blurredAvatarUrl: "/assets/hosts/locked_kritika.webp",
    bio: "Cafeholic who loves visiting contemporary art exhibitions, vintage bookshops, and quiet coffee roasters in Khan Market.",
    shortBio: "Khan Market coffee roasteries & art lover.",
    isAvailable: true,
  },
];

export async function getCompanions(citySlug?: string, activitySlug?: string): Promise<CompanionSummary[]> {
  try {
    const where: Record<string, unknown> = { isAvailable: true };
    if (citySlug) {
      where.city = { slug: citySlug };
    }
    const dbCompanions = await prisma.companion.findMany({
      where,
      include: { city: true },
      take: 20,
    });

    if (dbCompanions && dbCompanions.length > 0) {
      return dbCompanions.map((c) => ({
        id: c.id,
        name: c.displayName,
        displayName: c.displayName,
        maskedName: c.maskedName,
        city: c.city.name,
        citySlug: c.city.slug,
        hourlyRate: Number(c.hourlyRate),
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        bio: c.bio,
        shortBio: c.shortBio,
        isAvailable: c.isAvailable,
      }));
    }
  } catch (err) {
    // Database fallback
  }

  // Fallback to verified mock dataset
  let results = [...MOCK_COMPANIONS];
  if (citySlug) {
    results = results.filter((c) => c.citySlug.toLowerCase() === citySlug.toLowerCase());
  }
  if (activitySlug) {
    results = results.filter((c) =>
      c.acceptedActivities.some((act) => act.toLowerCase().includes(activitySlug.toLowerCase()))
    );
  }
  return results;
}

export async function getCities(): Promise<CitySummary[]> {
  try {
    const dbCities = await prisma.city.findMany({
      where: { isActive: true },
    });
    if (dbCities && dbCities.length > 0) {
      return dbCities.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        state: c.state,
        isActive: c.isActive,
      }));
    }
  } catch (err) {
    // Fallback
  }
  return MOCK_CITIES;
}

export async function getActivities(): Promise<ActivitySummary[]> {
  try {
    const dbActivities = await prisma.activity.findMany();
    if (dbActivities && dbActivities.length > 0) {
      return dbActivities.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        description: a.description,
        suggestedDuration: a.suggestedDuration,
        icon: a.icon,
      }));
    }
  } catch (err) {
    // Fallback
  }
  return MOCK_ACTIVITIES;
}
