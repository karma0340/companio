import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[Seed] Starting database seeding for Companio...");

  // 1. Seed Cities
  const citiesData = [
    { name: "Delhi", slug: "delhi", state: "Delhi NCR", metaTitle: "Hire Companions in Delhi | Companio", metaDescription: "Find verified companions in Connaught Place, Hauz Khas, and South Delhi." },
    { name: "Bengaluru", slug: "bengaluru", state: "Karnataka", metaTitle: "Hire Companions in Bengaluru | Companio", metaDescription: "Connect with verified companions in Koramangala, Indiranagar, and HSR Layout." },
    { name: "Mumbai", slug: "mumbai", state: "Maharashtra", metaTitle: "Hire Companions in Mumbai | Companio", metaDescription: "Find companions for coffee and marine drive walks in Bandra and Colaba." },
    { name: "Pune", slug: "pune", state: "Maharashtra", metaTitle: "Hire Companions in Pune | Companio", metaDescription: "Connect with verified companions in Koregaon Park and Kalyani Nagar." },
    { name: "Hyderabad", slug: "hyderabad", state: "Telangana", metaTitle: "Hire Companions in Hyderabad | Companio", metaDescription: "Find verified companions in Jubilee Hills and Gachibowli." },
  ];

  const seededCities: Record<string, string> = {};
  for (const city of citiesData) {
    const record = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
    seededCities[city.slug] = record.id;
  }
  console.log(`[Seed] Seeded ${Object.keys(seededCities).length} cities.`);

  // 2. Seed Activities
  const activitiesData = [
    { title: "Café & Conversation", slug: "coffee", description: "Grab artisan coffee, unwind, and enjoy good conversation in a cozy cafe.", suggestedDuration: 1, icon: "coffee" },
    { title: "City Walk & Exploration", slug: "city-walk", description: "Stroll through scenic streets, parks, historical markets, and hidden alleys.", suggestedDuration: 2, icon: "map-pin" },
    { title: "Gym & Fitness Spotting", slug: "gym", description: "Get a workout partner, spotter, or running companion to keep you motivated.", suggestedDuration: 1, icon: "dumbbell" },
    { title: "Gigs, Standup & Events", slug: "events", description: "Never go to comedy shows, live concerts, or food festivals alone.", suggestedDuration: 3, icon: "ticket" },
    { title: "Museum & Art Galleries", slug: "museum", description: "Explore contemporary art, heritage exhibits, and cultural spaces together.", suggestedDuration: 2, icon: "palette" },
  ];

  const seededActivities: Record<string, string> = {};
  for (const act of activitiesData) {
    const record = await prisma.activity.upsert({
      where: { slug: act.slug },
      update: {},
      create: act,
    });
    seededActivities[act.slug] = record.id;
  }
  console.log(`[Seed] Seeded ${Object.keys(seededActivities).length} activities.`);

  // 3. Seed Companions
  const companionsData = [
    {
      phone: "+919811223301",
      name: "Vanshika Sharma",
      displayName: "Vanshika",
      maskedName: "Vanshika S***",
      citySlug: "delhi",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Masters in Psychology student at DU. Passionate about indie music, specialty roasteries in Hauz Khas, and thoughtful conversations about books and urban life.",
      shortBio: "DU Psychology student. Love coffee & indie books.",
      hourlyRate: 499.00,
      spokenLanguages: ["English", "Hindi"],
      acceptedActivities: ["Café & Conversation", "Museum & Art Galleries", "City Walk"],
      ratingAverage: 4.9,
      totalReviews: 28,
      upiId: "vanshika@okhdfcbank",
    },
    {
      phone: "+919811223302",
      name: "Kritika Sen",
      displayName: "Kritika",
      maskedName: "Kritika S***",
      citySlug: "bengaluru",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "UI/UX Designer working in Indiranagar. Big foodie, sourdough enthusiast, and weekend runner around Cubbon Park. Fluent in tech and design banter.",
      shortBio: "Designer in Indiranagar. Foodie & Cubbon runner.",
      hourlyRate: 549.00,
      spokenLanguages: ["English", "Hindi", "Bengali"],
      acceptedActivities: ["Café & Conversation", "City Walk & Exploration", "Gym & Fitness Spotting"],
      ratingAverage: 5.0,
      totalReviews: 42,
      upiId: "kritika@okaxis",
    },
    {
      phone: "+919811223303",
      name: "Rohan Malhotra",
      displayName: "Rohan",
      maskedName: "Rohan M***",
      citySlug: "mumbai",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Screenwriter and podcast host based in Bandra. Great listener with endless stories about Mumbai film culture and retro architecture.",
      shortBio: "Bandra writer. Film culture & retro architecture.",
      hourlyRate: 499.00,
      spokenLanguages: ["English", "Hindi", "Marathi"],
      acceptedActivities: ["Café & Conversation", "Gigs, Standup & Events", "City Walk & Exploration"],
      ratingAverage: 4.8,
      totalReviews: 19,
      upiId: "rohan@paytm",
    },
    {
      phone: "+919811223304",
      name: "Ananya Roy",
      displayName: "Ananya",
      maskedName: "Ananya R***",
      citySlug: "bengaluru",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Fintech analyst by day, contemporary art enthusiast on weekends. Love exploring quiet corners of Bengaluru, artisan matcha, and gallery exhibitions.",
      shortBio: "Fintech analyst. Love art galleries & quiet cafes.",
      hourlyRate: 599.00,
      spokenLanguages: ["English", "Hindi"],
      acceptedActivities: ["Museum & Art Galleries", "Café & Conversation"],
      ratingAverage: 5.0,
      totalReviews: 31,
      upiId: "ananya@ybl",
    },
  ];

  for (const c of companionsData) {
    const user = await prisma.user.upsert({
      where: { phone: c.phone },
      update: {},
      create: {
        phone: c.phone,
        name: c.name,
        role: "COMPANION",
        isKycVerified: true,
      },
    });

    await prisma.companion.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        displayName: c.displayName,
        maskedName: c.maskedName,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        cityId: seededCities[c.citySlug],
        bio: c.bio,
        shortBio: c.shortBio,
        hourlyRate: c.hourlyRate,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        upiId: c.upiId,
      },
    });
  }
  console.log(`[Seed] Seeded ${companionsData.length} companions.`);

  // 4. Seed Demo Members
  const demoUnlockedUser = await prisma.user.upsert({
    where: { phone: "+919999999901" },
    update: {},
    create: {
      phone: "+919999999901",
      name: "Aditya Mehta",
      role: "MEMBER",
      isUnlocked: true,
      activePassTier: "ONE_MONTH",
      passExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days ahead
      walletBalance: 1500.00,
    },
  });

  const demoLockedUser = await prisma.user.upsert({
    where: { phone: "+919999999902" },
    update: {},
    create: {
      phone: "+919999999902",
      name: "Saurabh Verma",
      role: "MEMBER",
      isUnlocked: false,
      walletBalance: 0.00,
    },
  });

  console.log("[Seed] Seeded demo members (Unlocked: Aditya, Locked: Saurabh).");
  console.log("[Seed] Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("[Seed] Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
