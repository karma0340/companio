import { CompanionSummary, CitySummary, ActivitySummary, PassTierOption, HostPackOption, HostPackTier } from "@/types";
import { ActivityCategory } from "./types";
import { prisma } from "./prisma";
import { scoreFuzzyMatch } from "./fuzzy";
import { mapToActivityCategories, normalizeCompanionGender } from "./companion-mapper";

const CITY_SEARCH_ALIASES: Record<string, string[]> = {
  chandigarh: ["chd", "tricity", "sector 17", "sector 35", "sukhna lake"],
  mohali: ["tricity", "sahibzada ajit singh nagar", "phase 3b2"],
  panchkula: ["tricity", "pkl"],
  delhi: ["new delhi", "delhi ncr", "ncr", "gurgaon", "gurugram", "noida", "south delhi", "hkv", "connaught place"],
  mumbai: ["bombay", "bom", "bandra", "colaba", "juhu", "powai", "andheri"],
  bengaluru: ["bangalore", "blr", "indiranagar", "koramangala", "hsr layout", "whitefield"],
  pune: ["poona", "pnq", "koregaon park", "kalyani nagar", "baner"],
  hyderabad: ["hyd", "cyberabad", "jubilee hills", "banjara hills", "gachibowli"],
  jaipur: ["pink city", "jai", "c-scheme", "malviya nagar"],
  kolkata: ["calcutta", "ccu", "park street", "salt lake"],
  ahmedabad: ["amdavad", "amd", "sg highway", "bodakdev"],
  lucknow: ["lko", "gomti nagar", "hazratganj"],
  chennai: ["madras", "maa", "adyar", "besant nagar"],
  indore: ["idr", "vijay nagar"],
  ludhiana: ["ludh", "sarabha nagar", "model town"],
  amritsar: ["asr", "ranjit avenue"],
  dehradun: ["ddn", "rajpur road"],
  kochi: ["cochin", "ernakulam", "fort kochi"],
  goa: ["panaji", "anjuna", "baga", "candolim"],
  surat: ["vesu", "piplod"],
  bhopal: ["arera colony", "mp nagar"],
  vadodara: ["baroda", "alkapuri"],
};

function resolveCityTargetSlugs(input: string): string[] {
  const clean = input.trim().toLowerCase();
  if (!clean || clean === "all") return [];
  if (clean === "tricity") return ["chandigarh", "mohali", "panchkula"];

  const matched = new Set<string>([clean]);
  for (const [slug, aliases] of Object.entries(CITY_SEARCH_ALIASES)) {
    if (slug === clean || aliases.some((a) => a === clean || clean.includes(a) || a.includes(clean))) {
      matched.add(slug);
    }
  }
  return Array.from(matched);
}

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

export interface PaginatedCompanionsQuery {
  city?: string;
  activity?: string;
  freeToday?: boolean;
  weekendOnly?: boolean;
  womenOnly?: boolean;
  gender?: 'all' | 'female' | 'male';
  q?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCompanionsResult {
  companions: CompanionSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  cityCounts: Record<string, number>;
}

export async function getCompanionsPaginated(
  query: PaginatedCompanionsQuery = {}
): Promise<PaginatedCompanionsResult> {
  const safePage = Math.max(1, Number(query.page) || 1);
  const safeLimit = Math.min(48, Math.max(1, Number(query.limit) || 12));

  try {
    const dbCompanions = await prisma.companion.findMany({
      include: {
        city: true,
        user: { select: { gender: true } },
      },
      orderBy: [{ ratingAverage: 'desc' }, { completedMeetups: 'desc' }, { createdAt: 'desc' }],
    });

    const cityCounts: Record<string, number> = {};
    for (const c of dbCompanions) {
      const slug = c.city?.slug?.toLowerCase();
      if (slug) cityCounts[slug] = (cityCounts[slug] || 0) + 1;
    }

    let mapped: Array<CompanionSummary & { _score?: number }> = dbCompanions.map((c) => ({
      id: c.id,
      name: c.displayName,
      displayName: c.displayName,
      maskedName: c.maskedName,
      age: c.age || 24,
      gender: normalizeCompanionGender(c.gender || c.user?.gender),
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

    if (query.city && query.city !== 'all') {
      const targetSlugs = resolveCityTargetSlugs(query.city);
      const targetCityLower = query.city.trim().toLowerCase();
      mapped = mapped.filter(
        (c) =>
          targetSlugs.includes(c.citySlug.toLowerCase()) ||
          c.city.toLowerCase() === targetCityLower ||
          c.city.toLowerCase().includes(targetCityLower)
      );
    }

    if (query.activity && query.activity !== 'all') {
      const targetAct = query.activity.toLowerCase();
      const actWords = targetAct.replace(/-/g, ' ');
      mapped = mapped.filter((c) => {
        const categories = mapToActivityCategories(c.acceptedActivities || []);
        const rawMatch = (c.acceptedActivities || []).some((a) =>
          a.toLowerCase().includes(actWords)
        );
        return categories.includes(targetAct as ActivityCategory) || rawMatch;
      });
    }

    if (query.freeToday) {
      mapped = mapped.filter((c) => c.isAvailable);
    }

    if (query.weekendOnly) {
      mapped = mapped.filter((c) =>
        (c.availabilitySlots || []).some((slot) =>
          slot.toLowerCase().includes('weekend')
        )
      );
    }

    const requestedGender =
      query.gender && query.gender !== 'all'
        ? query.gender.toLowerCase()
        : query.womenOnly
        ? 'female'
        : null;

    if (requestedGender === 'female' || requestedGender === 'male') {
      mapped = mapped.filter((c) => (c.gender || '').toLowerCase() === requestedGender);
    }

    if (query.q && query.q.trim().length > 0) {
      const searchStr = query.q.trim();
      mapped = mapped
        .map((c) => {
          const cityAliases = CITY_SEARCH_ALIASES[c.citySlug.toLowerCase()] || [];
          const genderTags =
            c.gender === 'female'
              ? ['woman', 'women', 'female', 'women host', 'female host']
              : c.gender === 'male'
              ? ['man', 'men', 'male', 'men host', 'male host']
              : [];
          return {
            ...c,
            _score: scoreFuzzyMatch(searchStr, [
              c.displayName,
              c.name,
              c.city,
              c.citySlug,
              ...cityAliases,
              c.locality,
              ...genderTags,
              ...(c.acceptedActivities || []),
              ...(c.spokenLanguages || []),
              ...(c.availabilitySlots || []),
              c.shortBio,
              c.bio,
            ]),
          };
        })
        .filter((c) => (c._score || 0) > 0)
        .sort((a, b) => (b._score || 0) - (a._score || 0));
    } else {
      mapped = interleaveCompanions(mapped, Boolean(query.city && query.city !== 'all'));
    }

    const total = mapped.length;
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const offset = (safePage - 1) * safeLimit;
    const paged = mapped.slice(offset, offset + safeLimit).map(({ _score, ...rest }) => rest);

    return {
      companions: paged,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasMore: offset + paged.length < total,
      cityCounts,
    };
  } catch (err) {
    console.error('[GET COMPANIONS PAGINATED ERROR]:', err);
    return {
      companions: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
      totalPages: 1,
      hasMore: false,
      cityCounts: {},
    };
  }
}

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
        user: { select: { gender: true } },
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
        gender: normalizeCompanionGender(c.gender || c.user?.gender),
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
        const targetAct = activitySlug.toLowerCase();
        const cleanAct = targetAct.replace(/-/g, ' ');
        mapped = mapped.filter((c) => {
          const categories = mapToActivityCategories(c.acceptedActivities || []);
          const rawMatch = c.acceptedActivities.some((act) =>
            act.toLowerCase().includes(cleanAct)
          );
          return categories.includes(targetAct as ActivityCategory) || rawMatch;
        });
      }

      const isCityFiltered = Boolean(citySlug && citySlug !== 'all');
      return interleaveCompanions(mapped, isCityFiltered);
    }
  } catch (err) {
    console.error('[GET COMPANIONS ERROR]:', err);
  }

  return [];
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
        user: { select: { gender: true } },
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
        gender: normalizeCompanionGender(c.gender || c.user?.gender),
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
        rawActivities: c.acceptedActivities,
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
    return [];
  } catch (err) {
    console.error('[GET CITIES ERROR]:', err);
    return [];
  }
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
    return [];
  } catch (err) {
    console.error('[GET ACTIVITIES ERROR]:', err);
    return [];
  }
}
