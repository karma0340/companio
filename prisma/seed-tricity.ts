import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTricity() {
  console.log("[Seed Tricity] Starting Chandigarh, Mohali & Panchkula companion seeding...");

  // 1. Ensure Chandigarh, Mohali, Panchkula cities exist in DB
  const tricityCities = [
    {
      name: "Chandigarh",
      slug: "chandigarh",
      state: "Punjab/Haryana",
      metaTitle: "Hire Verified Companions in Chandigarh | Meetzy Club",
      metaDescription: "Connect with verified platonic companions in Sector 17, Sector 35, and Sukhna Lake.",
    },
    {
      name: "Mohali",
      slug: "mohali",
      state: "Punjab",
      metaTitle: "Hire Verified Companions in Mohali | Meetzy Club",
      metaDescription: "Find verified companions in Phase 3B2, Phase 7, and Mohali IT Park.",
    },
    {
      name: "Panchkula",
      slug: "panchkula",
      state: "Haryana",
      metaTitle: "Hire Verified Companions in Panchkula | Meetzy Club",
      metaDescription: "Connect with verified companions in Sector 8, Sector 20, and MDC Panchkula.",
    },
  ];

  const cityMap: Record<string, string> = {};
  for (const c of tricityCities) {
    const cityRecord = await prisma.city.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        state: c.state,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        isActive: true,
      },
      create: {
        name: c.name,
        slug: c.slug,
        state: c.state,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        isActive: true,
      },
    });
    cityMap[c.slug] = cityRecord.id;
    console.log(`[City] Ready: ${c.name} (${cityRecord.id})`);
  }

  // 2. 8 Authentic Tricity Companions Data
  const companions = [
    {
      id: "simran-chd",
      phone: "+919876540001",
      name: "Simran Kaur",
      displayName: "Simran",
      maskedName: "Simran K***",
      citySlug: "chandigarh",
      locality: "Sector 17 / Sector 35",
      gender: "female",
      age: 23,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Masters student at Panjab University. Love exploring cozy coffee corners in Sector 35, sunset strolls along Sukhna Lake, and casual conversations about music, films, and art.",
      shortBio: "PU student. Sector 35 coffee spots & Sukhna Lake sunset walks.",
      hourlyRate: 549.00,
      spokenLanguages: ["Punjabi", "Hindi", "English"],
      acceptedActivities: ["Coffee & Conversations", "City Walk & Exploration", "Sunset & Park Strolls", "Book Cafes & Reading"],
      ratingAverage: 4.95,
      totalReviews: 34,
      upiId: "simrankaur@okaxis",
    },
    {
      id: "harleen-mohali",
      phone: "+919876540002",
      name: "Harleen Dhillon",
      displayName: "Harleen",
      maskedName: "Harleen D***",
      citySlug: "mohali",
      locality: "Phase 3B2 / IT Park",
      gender: "female",
      age: 25,
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "UI/UX designer working in Mohali IT Park. Big foodie who knows the best dessert and cafe joints across Phase 3B2. Great company for co-working sessions or indie music gigs.",
      shortBio: "Designer in Mohali IT Park. Phase 3B2 cafes, co-working & gigs.",
      hourlyRate: 599.00,
      spokenLanguages: ["Punjabi", "Hindi", "English"],
      acceptedActivities: ["Coffee & Conversations", "Co-Working Focus Partner", "Food Crawl & Street Eats", "Comedy & Live Shows"],
      ratingAverage: 5.0,
      totalReviews: 46,
      upiId: "harleend@okhdfcbank",
    },
    {
      id: "gurpreet-chd",
      phone: "+919876540003",
      name: "Gurpreet Singh",
      displayName: "Gurpreet",
      maskedName: "Gurpreet S***",
      citySlug: "chandigarh",
      locality: "Sector 35 / Sector 22",
      gender: "male",
      age: 26,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Fitness coach and digital marketer living in Sector 35. Reliable gym spotter, badminton rally buddy, and loves exploring the Sector 17 plaza on weekends over good espresso.",
      shortBio: "Fitness coach in Sector 35. Gym spotter & badminton buddy.",
      hourlyRate: 499.00,
      spokenLanguages: ["Punjabi", "Hindi", "English"],
      acceptedActivities: ["Gym & Fitness Spotting", "Badminton & Tennis", "Coffee & Conversations", "Food Crawl & Street Eats"],
      ratingAverage: 4.88,
      totalReviews: 29,
      upiId: "gurpreets@paytm",
    },
    {
      id: "navneet-pune",
      phone: "+919876540004",
      name: "Navneet Kaur",
      displayName: "Navneet",
      maskedName: "Navneet K***",
      citySlug: "panchkula",
      locality: "Sector 8 / MDC",
      gender: "female",
      age: 24,
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Literature graduate and photography lover in Panchkula. Passionate about quiet book cafes, photo walks through the Rose Garden, and authentic conversations without awkward silences.",
      shortBio: "Literature lover in Panchkula. Rose Garden walks & book cafes.",
      hourlyRate: 549.00,
      spokenLanguages: ["Punjabi", "Hindi", "English"],
      acceptedActivities: ["Book Cafes & Reading", "Photo Walk & Candid Shots", "Coffee & Conversations", "City Walk & Exploration"],
      ratingAverage: 4.92,
      totalReviews: 38,
      upiId: "navneetk@ybl",
    },
    {
      id: "aman-chd",
      phone: "+919876540005",
      name: "Aman Gill",
      displayName: "Aman",
      maskedName: "Aman G***",
      citySlug: "chandigarh",
      locality: "Sector 26 / Sector 7",
      gender: "male",
      age: 27,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Sound engineer and acoustic guitarist based in Sector 26. Zero awkward pauses, excellent listener, and always excited to explore live music gigs, indie cafes, and scenic weekend drives.",
      shortBio: "Sector 26 music producer. Acoustic gigs & lively chats.",
      hourlyRate: 599.00,
      spokenLanguages: ["Punjabi", "Hindi", "English"],
      acceptedActivities: ["Comedy & Live Shows", "Coffee & Conversations", "City Walk & Exploration", "Flea Markets & Thrifting"],
      ratingAverage: 4.9,
      totalReviews: 24,
      upiId: "amangill@icici",
    },
    {
      id: "jasleen-chd",
      phone: "+919876540006",
      name: "Jasleen Virdi",
      displayName: "Jasleen",
      maskedName: "Jasleen V***",
      citySlug: "chandigarh",
      locality: "Sector 9 / Sector 10",
      gender: "female",
      age: 23,
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Fashion styling enthusiast and specialty bakery lover in Sector 9 inner market. Honest shopping opinion, wardrobe consultant, and great companion for artisanal cafe visits.",
      shortBio: "Stylist in Sector 9. Shopping buddy & bakery hopping.",
      hourlyRate: 649.00,
      spokenLanguages: ["English", "Hindi", "Punjabi"],
      acceptedActivities: ["Shopping & Styling Buddy", "Coffee & Conversations", "Food Crawl & Street Eats", "Photo Walk & Candid Shots"],
      ratingAverage: 5.0,
      totalReviews: 31,
      upiId: "jasleenv@okaxis",
    },
    {
      id: "kabir-mohali",
      phone: "+919876540007",
      name: "Kabir Ahluwalia",
      displayName: "Kabir",
      maskedName: "Kabir A***",
      citySlug: "mohali",
      locality: "Phase 7 / Phase 5",
      gender: "male",
      age: 25,
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Architectural researcher and morning cyclist. Passionate about early morning rides along Sukhna Lake, board games over cold brew, and focused co-working at specialty coffee shops.",
      shortBio: "Architectural researcher. Morning cycling & Sukhna walks.",
      hourlyRate: 499.00,
      spokenLanguages: ["Punjabi", "Hindi", "English"],
      acceptedActivities: ["Weekend Morning Cycling", "Board Games & Arcades", "Co-Working Focus Partner", "Sunset & Park Strolls"],
      ratingAverage: 4.85,
      totalReviews: 21,
      upiId: "kabirahlu@paytm",
    },
    {
      id: "tanya-pkl",
      phone: "+919876540008",
      name: "Tanya Sharma",
      displayName: "Tanya",
      maskedName: "Tanya S***",
      citySlug: "panchkula",
      locality: "Sector 20 / Sector 14",
      gender: "female",
      age: 24,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      blurredAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&blur=15&q=30",
      bio: "Content writer and art enthusiast living in Panchkula. Love visiting art exhibitions at Punjab Kala Bhawan, tea talks in Sector 8, and exploring quiet green trails across Tricity.",
      shortBio: "Content creator in Panchkula. Art exhibitions & tea cafes.",
      hourlyRate: 599.00,
      spokenLanguages: ["Hindi", "English", "Punjabi"],
      acceptedActivities: ["Museums & Art Galleries", "Coffee & Conversations", "City Walk & Exploration", "Book Cafes & Reading"],
      ratingAverage: 4.95,
      totalReviews: 39,
      upiId: "tanyas@okaxis",
    },
  ];

  for (const c of companions) {
    const cityId = cityMap[c.citySlug] || cityMap["chandigarh"];

    // 1. Upsert User
    const user = await prisma.user.upsert({
      where: { phone: c.phone },
      update: {
        name: c.name,
        role: "COMPANION",
        gender: c.gender,
        city: c.citySlug === "mohali" ? "Mohali" : c.citySlug === "panchkula" ? "Panchkula" : "Chandigarh",
        area: c.locality,
        bio: c.bio,
        isKycVerified: true,
        onboardingCompleted: true,
      },
      create: {
        phone: c.phone,
        name: c.name,
        role: "COMPANION",
        gender: c.gender,
        city: c.citySlug === "mohali" ? "Mohali" : c.citySlug === "panchkula" ? "Panchkula" : "Chandigarh",
        area: c.locality,
        bio: c.bio,
        isKycVerified: true,
        onboardingCompleted: true,
        coinBalance: 100,
        creditBalance: 100,
      },
    });

    // 2. Upsert Companion
    const compRecord = await prisma.companion.upsert({
      where: { userId: user.id },
      update: {
        displayName: c.displayName,
        maskedName: c.maskedName,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        cityId: cityId,
        locality: c.locality,
        bio: c.bio,
        shortBio: c.shortBio,
        hourlyRate: c.hourlyRate,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        upiId: c.upiId,
        isAvailable: true,
        photoVerified: true,
      },
      create: {
        id: c.id,
        userId: user.id,
        displayName: c.displayName,
        maskedName: c.maskedName,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        cityId: cityId,
        locality: c.locality,
        bio: c.bio,
        shortBio: c.shortBio,
        hourlyRate: c.hourlyRate,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        upiId: c.upiId,
        isAvailable: true,
        photoVerified: true,
      },
    });

    console.log(`[Companion Seeded] ${c.displayName} (${c.citySlug.toUpperCase()}) - ${c.locality} - ₹${c.hourlyRate}/hr`);
  }

  console.log("\n[SUCCESS] Successfully seeded all 8 Tricity companion profiles into Neon PostgreSQL!");
  await prisma.$disconnect();
}

seedTricity().catch((e) => {
  console.error("[SEED ERROR]:", e);
  process.exit(1);
});
