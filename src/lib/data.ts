import { CompanionSummary, CitySummary, ActivitySummary, PassTierOption } from "@/types";
import { ActivityCategory } from "./types";
import { prisma } from "./prisma";

export const PASS_TIER_OPTIONS: PassTierOption[] = [
  {
    tier: "ONE_MONTH",
    name: "1 month",
    price: 99.50,
    durationDays: 30,
    tagline: "30 days full access",
    features: [
      "Unblur all companion profiles",
      "Full biographies & verified reviews",
      "Send unlimited booking requests",
      "Active for 30 calendar days",
    ],
  },
  {
    tier: "THREE_MONTH",
    name: "3 months",
    price: 249.50,
    durationDays: 90,
    tagline: "Save 16% vs monthly · ₹83 a month · 90 days full access",
    features: [
      "All 1-month features included",
      "Save 16% compared to monthly pass",
      "Priority companion response window",
      "Active for 90 calendar days",
    ],
    isPopular: true,
  },
  {
    tier: "ONE_YEAR",
    name: "12 months",
    price: 499.50,
    durationDays: 365,
    tagline: "Best value · ₹41 a month · 365 days full access",
    features: [
      "Best long-term value at ₹41/month",
      "Unlimited profile views across India",
      "Early access to newly verified companions",
      "Active for 365 calendar days",
    ],
  },
  {
    tier: "LIFETIME",
    name: "Lifetime",
    price: 999.50,
    durationDays: null,
    tagline: "Pay once. Access for life.",
    features: [
      "Never expires — permanent full access",
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
    id: "c-qkk6qfv6",
    name: "Kinjal Patel",
    displayName: "Kinjal",
    maskedName: "Kinjal P***",
    city: "Mumbai",
    citySlug: "mumbai",
    hourlyRate: 499,
    ratingAverage: 4.9,
    totalReviews: 24,
    spokenLanguages: ["English", "Hindi"],
    acceptedActivities: ["Café Chat", "City Walk", "Live Events"],
    avatarUrl: "/assets/hosts/app-cmtnws9m701cxgm0bp1we6wry-photo-YTB1xlijCZeUJ6Gw9XK6rLhesOw2VE.jpg",
    blurredAvatarUrl: "/assets/hosts/app-cmtka4tk7000ai3098m7ugzlv-photo-locked.jpg",
    bio: "Lover of quiet coastal coffee corners, live music gigs, and deep conversations over evening walks.",
    shortBio: "Bandra West coastal coffee & evening walks.",
    isAvailable: true,
    isPreview: true,
  },
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
    avatarUrl: "/assets/hosts/vanshika.webp",
    blurredAvatarUrl: "/assets/hosts/app-cmt2uql1v003wjs04txo35j7k-locked.jpg",
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
    if (citySlug && citySlug !== 'all') {
      where.city = { slug: citySlug.toLowerCase() };
    }
    const dbCompanions = await prisma.companion.findMany({
      where,
      include: {
        city: true,
        reviewsReceived: {
          include: { member: true },
          take: 5,
        },
      },
      orderBy: { ratingAverage: 'desc' },
      take: 50,
    });

    if (dbCompanions && dbCompanions.length > 0) {
      let mapped = dbCompanions.map((c) => ({
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

      if (activitySlug && activitySlug !== 'all') {
        const cleanAct = activitySlug.toLowerCase().replace(/-/g, ' ');
        mapped = mapped.filter((c) =>
          c.acceptedActivities.some((act) => act.toLowerCase().includes(cleanAct))
        );
      }

      return mapped;
    }
  } catch (err) {
    console.error('[GET COMPANIONS ERROR]:', err);
  }

  return [];
}

function mapToActivityCategories(activities: string[] = []): ActivityCategory[] {
  const mapping: Record<string, ActivityCategory> = {
    'coffee': 'coffee-chat',
    'cafe': 'coffee-chat',
    'shopping': 'shopping-buddy',
    'styling': 'shopping-buddy',
    'photo': 'photo-walk',
    'candid': 'photo-walk',
    'comedy': 'comedy-and-shows',
    'shows': 'comedy-and-shows',
    'city': 'city-guide',
    'walk': 'walk-and-talk',
    'gym': 'gym-partner',
    'fitness': 'gym-partner',
    'museum': 'city-guide',
    'art': 'city-guide',
    'book': 'study-buddy',
    'reading': 'study-buddy',
    'food': 'food-walk',
    'crawl': 'food-walk',
    'eats': 'food-walk',
    'co-working': 'career-chat',
    'career': 'career-chat',
    'badminton': 'sports-partner',
    'tennis': 'sports-partner',
    'cycling': 'sports-partner',
    'sports': 'sports-partner',
    'sunset': 'walk-and-talk',
    'board': 'gaming-partner',
    'arcade': 'gaming-partner',
    'games': 'gaming-partner',
    'flea': 'shopping-buddy',
    'thrifting': 'shopping-buddy',
    'movie': 'movie-buddy',
    'event': 'event-plus-one',
  };

  const categories = new Set<ActivityCategory>();

  for (const act of activities) {
    const lower = act.toLowerCase();
    let matched = false;
    for (const [key, cat] of Object.entries(mapping)) {
      if (lower.includes(key)) {
        categories.add(cat);
        matched = true;
      }
    }
    if (!matched) {
      categories.add('coffee-chat');
    }
  }

  if (categories.size === 0) {
    categories.add('coffee-chat');
  }

  return Array.from(categories);
}

export async function getCompanionById(id: string) {
  try {
    const slugName = id.replace(/-[a-z]{3}$/i, '');
    const c = await prisma.companion.findFirst({
      where: {
        OR: [
          { id },
          { displayName: { equals: id, mode: 'insensitive' } },
          { displayName: { equals: slugName, mode: 'insensitive' } },
        ],
      },
      include: {
        city: true,
        reviewsReceived: {
          include: { member: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (c) {
      return {
        id: c.id,
        name: c.displayName,
        displayName: c.displayName,
        maskedName: c.maskedName,
        age: 24,
        gender: 'female' as const,
        city: c.city.slug,
        area: `${c.city.name} Central`,
        tagline: c.shortBio,
        about: c.bio,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        languages: c.spokenLanguages,
        spokenLanguages: c.spokenLanguages,
        hourlyRate: Number(c.hourlyRate),
        verifiedId: true,
        verifiedPhoto: true,
        rating: c.ratingAverage,
        ratingAverage: c.ratingAverage,
        reviewCount: c.totalReviews,
        totalReviews: c.totalReviews,
        meetupsCount: c.totalReviews,
        activities: mapToActivityCategories(c.acceptedActivities),
        acceptedActivities: c.acceptedActivities,
        isFreeToday: c.isAvailable,
        isAvailable: c.isAvailable,
        acceptsWomenOnly: false,
        memberSince: '2026',
        availability: [
          { days: 'Mon — Fri', hours: '18:00 – 21:00' },
          { days: 'Sat — Sun', hours: '11:00 – 20:00' },
        ],
        reviews: c.reviewsReceived.map((r) => ({
          id: r.id,
          authorName: r.member?.name || 'Verified Member',
          authorCity: c.city.name,
          rating: r.score,
          date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          activityName: 'Coffee & Conversations',
          comment: r.comment || 'Great experience and wonderful conversations.',
        })),
      };
    }
  } catch (err) {
    console.error('[GET COMPANION BY ID ERROR]:', err);
  }
  return null;
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
