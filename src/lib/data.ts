import {
  CompanionSummary,
  CitySummary,
  ActivitySummary,
  PassTierOption,
  HostPackOption,
  HostPackTier,
} from "@/types";
import { ActivityCategory } from "./types";
import { prisma } from "./prisma";

export const HOST_REGISTRATION_FEE = {
  tier: "STARTER" as HostPackTier,
  name: "Verified Host Registration",
  basePrice: 99.5,
  taxesAndCharges: 13.5,
  totalPrice: 113,
  durationDays: 365,
  durationLabel: "1 Year Active Listing",
  hostSharePercent: 70 as const,
  platformSharePercent: 30 as const,
  promoCoins: 100,
};

export const HOST_PACK_OPTIONS: HostPackOption[] = [
  {
    tier: "STARTER",
    name: "Verified Host Registration",
    price: 113,
    durationDays: 365,
    durationLabel: "INR 99.50 + INR 13.50 Taxes",
    tagline: "INR 99.50 registration charge + INR 13.50 due taxes & gateway fees = INR 113 total",
    hostSharePercent: 70,
    platformSharePercent: 30,
    promoCoins: 100,
    maxMonthlyBookings: null,
    isPopular: true,
    features: [
      "Full 1-year active Verified Host directory listing on /explore",
      "Fixed 70% payout on every completed meetup (30% covers GST, Razorpay & safety ops)",
      "Same mobile number connects Member and Host dashboards cleanly",
      "+100 Bonus Chat Coins included with your registration",
    ],
  },
];

export const PASS_TIER_OPTIONS: PassTierOption[] = [
  {
    tier: "ONE_MONTH",
    name: "1 month",
    price: 199,
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
    price: 499,
    durationDays: 90,
    tagline: "Save 16% vs monthly · ₹166 a month · 90 days full access",
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
    price: 999,
    durationDays: 365,
    tagline: "Best value · ₹82 a month · 365 days full access",
    features: [
      "Best long-term value at ₹82/month",
      "Unlimited profile views across India",
      "Early access to newly verified companions",
      "Active for 365 calendar days",
    ],
  },
  {
    tier: "LIFETIME",
    name: "Lifetime",
    price: 1999,
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/dia-mum.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/dia-mum.jpg",
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/ananya-del.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/ananya-del.jpg",
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/kritika-blr.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/kritika-blr.jpg",
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/rohan-pune.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/rohan-pune.jpg",
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/priya-blr.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/priya-blr.jpg",
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/tanvi-chd.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/tanvi-chd.jpg",
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/sneha-mum.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/sneha-mum.jpg",
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/aarav-mum.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/aarav-mum.jpg",
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
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/meera-del.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/meera-del.jpg",
    bio: "Cafeholic who loves visiting contemporary art exhibitions, vintage bookshops, and quiet coffee roasters in Khan Market.",
    shortBio: "Khan Market coffee roasteries & art lover.",
    isAvailable: true,
  },
  {
    id: "tara-del",
    name: "Tara Sengupta",
    displayName: "Tara",
    maskedName: "Tara S***",
    city: "Delhi NCR",
    citySlug: "delhi",
    locality: "Hauz Khas Village",
    hourlyRate: 599,
    ratingAverage: 4.93,
    totalReviews: 31,
    spokenLanguages: ["English", "Hindi", "Bengali"],
    acceptedActivities: ["Coffee & Conversations", "Book Cafes & Reading", "Museums & Art Galleries", "Sunset & Park Strolls"],
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/tara-del.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/tara-del.jpg",
    bio: "Architecture graduate and avid sketcher based around Hauz Khas. I love finding quiet reading nooks in South Delhi, discovering single-origin espresso roasteries, and exploring historical stepwells and art pop-ups.",
    shortBio: "Architecture grad in Hauz Khas. Specialty brews & indie books.",
    isAvailable: true,
  },
  {
    id: "ishita-del",
    name: "Ishita Malhotra",
    displayName: "Ishita",
    maskedName: "Ishita M***",
    city: "Delhi NCR",
    citySlug: "delhi",
    locality: "Connaught Place",
    hourlyRate: 649,
    ratingAverage: 4.97,
    totalReviews: 44,
    spokenLanguages: ["English", "Hindi", "Punjabi"],
    acceptedActivities: ["Coffee & Conversations", "Food Crawl & Street Eats", "Photo Walk & Candid Shots", "Comedy & Live Shows"],
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/ishita-del.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/ishita-del.jpg",
    bio: "Digital media strategist living in Central Delhi. High-energy, easygoing plus-one for weekend brunch crawls in CP, vintage vinyl shopping, aesthetic photo walks, and spontaneous indie standup comedy shows.",
    shortBio: "Content strategist in CP. Brunch connoisseur & photo walks.",
    isAvailable: true,
  },
  {
    id: "zoya-del",
    name: "Zoya Qureshi",
    displayName: "Zoya",
    maskedName: "Zoya Q***",
    city: "Delhi NCR",
    citySlug: "delhi",
    locality: "Greater Kailash 1",
    hourlyRate: 699,
    ratingAverage: 4.91,
    totalReviews: 28,
    spokenLanguages: ["English", "Hindi", "Urdu"],
    acceptedActivities: ["Shopping & Styling Buddy", "Comedy & Live Shows", "Flea Markets & Thrifting", "Coffee & Conversations"],
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/zoya-del.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/zoya-del.jpg",
    bio: "Fashion merchandising consultant in GK-1. Great eye for aesthetics, honest shopping advice, and wardrobe styling. Enjoy rooftop music sessions, live jazz gigs, and relaxed conversations over artisanal tea.",
    shortBio: "Fashion stylist in GK-1. Shopping runs & gig nights.",
    isAvailable: true,
  },
  {
    id: "avani-del",
    name: "Avani Sharma",
    displayName: "Avani",
    maskedName: "Avani S***",
    city: "Delhi NCR",
    citySlug: "delhi",
    locality: "Mandi House",
    hourlyRate: 549,
    ratingAverage: 4.88,
    totalReviews: 19,
    spokenLanguages: ["English", "Hindi"],
    acceptedActivities: ["Museums & Art Galleries", "Indie Cinema & Film Clubs", "City Walk & Exploration", "Coffee & Conversations"],
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/avani-del.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/avani-del.jpg",
    bio: "Performing arts student and gallery volunteer. Passionate about Hindi theater at Kamani & Shri Ram Centre, mural photography across Lodhi Art District, and candid conversations over roadside kulhad chai.",
    shortBio: "Theater & arts curator at Mandi House. Lodhi murals & plays.",
    isAvailable: true,
  },
  {
    id: "riddhi-del",
    name: "Riddhi Kapoor",
    displayName: "Riddhi",
    maskedName: "Riddhi K***",
    city: "Delhi NCR",
    citySlug: "delhi",
    locality: "Aerocity",
    hourlyRate: 749,
    ratingAverage: 4.95,
    totalReviews: 36,
    spokenLanguages: ["English", "Hindi"],
    acceptedActivities: ["Coffee & Conversations", "Co-Working Focus Partner", "Food Crawl & Street Eats", "City Walk & Exploration"],
    avatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/riddhi-del.jpg",
    blurredAvatarUrl: "https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/riddhi-del.jpg",
    bio: "Corporate brand strategist based in Aerocity. Professional, articulate, and well-traveled. Perfect companion for business lounge chats, design summits, luxury retail window shopping, and fine cafe dining.",
    shortBio: "Brand consultant in Aerocity. Chic lounge cafes & design chats.",
    isAvailable: true,
  },
];

/**
 * Organically interleaves companions across cities/localities to prevent unnatural sequential clumping
 */
function interleaveCompanions<T extends { citySlug?: string; locality?: string }>(items: T[], isCityFiltered: boolean): T[] {
  if (items.length <= 2) return items;

  if (isCityFiltered) {
    // Single city: semi-deterministic skip rotation to distribute localities organically
    const result: T[] = [];
    const copy = [...items];
    let i = 0;
    while (copy.length > 0) {
      const idx = (i * 3) % copy.length;
      result.push(copy.splice(idx, 1)[0]);
      i++;
    }
    return result;
  }

  // All cities: balanced round-robin interleave across cities
  const cityBuckets: Record<string, T[]> = {};
  for (const item of items) {
    const key = (item.citySlug || 'other').toLowerCase();
    if (!cityBuckets[key]) cityBuckets[key] = [];
    cityBuckets[key].push(item);
  }

  const result: T[] = [];
  const cityKeys = Object.keys(cityBuckets).sort((a, b) => cityBuckets[b].length - cityBuckets[a].length);
  let remaining = items.length;

  while (remaining > 0) {
    let added = 0;
    for (const city of cityKeys) {
      const bucket = cityBuckets[city];
      if (bucket && bucket.length > 0) {
        result.push(bucket.shift()!);
        remaining--;
        added++;
      }
    }
    if (added === 0) break;
  }

  return result;
}

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
        age: c.age || 24,
        gender: (c.gender || 'female') as 'female' | 'male' | 'non-binary',
        city: c.city.name,
        citySlug: c.city.slug,
        locality: c.locality || c.city.name,
        hourlyRate: Number(c.hourlyRate),
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        completedMeetups: c.completedMeetups || 0,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        availabilitySlots: c.availabilitySlots || [],
        preferredVenues: c.preferredVenues || [],
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

      const isCityFiltered = Boolean(citySlug && citySlug !== 'all');
      return interleaveCompanions(mapped, isCityFiltered);
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
        age: c.age || 24,
        gender: (c.gender || 'female') as 'female' | 'male' | 'non-binary',
        city: c.city.slug,
        area: c.locality || `${c.city.name} Central`,
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
        meetupsCount: c.completedMeetups || c.totalReviews,
        activities: mapToActivityCategories(c.acceptedActivities),
        acceptedActivities: c.acceptedActivities,
        preferredVenues: c.preferredVenues || [],
        isFreeToday: c.isAvailable,
        isAvailable: c.isAvailable,
        acceptsWomenOnly: false,
        memberSince: new Date(c.createdAt).getFullYear().toString() || '2026',
        availability: c.availabilitySlots && c.availabilitySlots.length > 0
          ? c.availabilitySlots.map((slot) => ({ days: slot, hours: 'Public Venues Only' }))
          : [
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
