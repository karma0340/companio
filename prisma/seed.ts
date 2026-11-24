import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[Seed] Starting comprehensive database seeding for Meetzy Club...");

  // 1. Seed Cities (Major Metro Cities across India)
  const citiesData = [
    { name: "Delhi NCR", slug: "delhi", state: "Delhi NCR", metaTitle: "Hire Verified Companions in Delhi NCR | Meetzy Club", metaDescription: "Find verified companions in Connaught Place, Hauz Khas, Khan Market, and Cyber Hub." },
    { name: "Bengaluru", slug: "bengaluru", state: "Karnataka", metaTitle: "Hire Verified Companions in Bengaluru | Meetzy Club", metaDescription: "Connect with verified companions in Koramangala, Indiranagar, Church Street, and HSR Layout." },
    { name: "Mumbai", slug: "mumbai", state: "Maharashtra", metaTitle: "Hire Verified Companions in Mumbai | Meetzy Club", metaDescription: "Find companions for cafes, gigs, and Marine Drive strolls in Bandra, Colaba, and Juhu." },
    { name: "Chandigarh", slug: "chandigarh", state: "Punjab/Haryana", metaTitle: "Hire Verified Companions in Chandigarh | Meetzy Club", metaDescription: "Find companions for Sector 17 cafes and Sukhna Lake walks." },
    { name: "Pune", slug: "pune", state: "Maharashtra", metaTitle: "Hire Verified Companions in Pune | Meetzy Club", metaDescription: "Connect with verified companions in Koregaon Park, Kalyani Nagar, and FC Road." },
    { name: "Hyderabad", slug: "hyderabad", state: "Telangana", metaTitle: "Hire Verified Companions in Hyderabad | Meetzy Club", metaDescription: "Find verified companions in Jubilee Hills, Banjara Hills, and Gachibowli." },
    { name: "Chennai", slug: "chennai", state: "Tamil Nadu", metaTitle: "Hire Verified Companions in Chennai | Meetzy Club", metaDescription: "Connect with companions for beach walks and cafes in Besant Nagar and Alwarpet." },
    { name: "Kolkata", slug: "kolkata", state: "West Bengal", metaTitle: "Hire Verified Companions in Kolkata | Meetzy Club", metaDescription: "Explore heritage book alleys and colonial cafes in Park Street and Salt Lake." },
    { name: "Ahmedabad", slug: "ahmedabad", state: "Gujarat", metaTitle: "Hire Verified Companions in Ahmedabad | Meetzy Club", metaDescription: "Connect with verified companions for evening riverfront strolls and food walks." },
    { name: "Mohali", slug: "mohali", state: "Punjab", metaTitle: "Hire Verified Companions in Mohali | Meetzy Club", metaDescription: "Find verified companions in Phase 3B2, Phase 7, and Mohali IT Park." },
    { name: "Panchkula", slug: "panchkula", state: "Haryana", metaTitle: "Hire Verified Companions in Panchkula | Meetzy Club", metaDescription: "Connect with verified companions in Sector 8, Sector 20, and MDC Panchkula." },
  ];

  const seededCities: Record<string, string> = {};
  for (const city of citiesData) {
    const record = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        name: city.name,
        state: city.state,
        metaTitle: city.metaTitle,
        metaDescription: city.metaDescription,
        isActive: true,
      },
      create: city,
    });
    seededCities[city.slug] = record.id;
  }
  console.log(`[Seed] Seeded ${Object.keys(seededCities).length} active cities.`);

  // 2. Seed Activities (17 Common Platonic Social Activities)
  const activitiesData = [
    { title: "Coffee & Conversations", slug: "coffee-chat", description: "Grab artisan coffee, unwind, and enjoy honest conversation in a cozy cafe.", suggestedDuration: 1, icon: "coffee" },
    { title: "City Walk & Exploration", slug: "city-walk", description: "Stroll through scenic streets, parks, historical markets, and hidden viewpoints.", suggestedDuration: 2, icon: "map-pin" },
    { title: "Gym & Fitness Spotting", slug: "gym-partner", description: "Get a dedicated workout partner, spotter, or running companion to keep you motivated.", suggestedDuration: 1, icon: "dumbbell" },
    { title: "Comedy & Live Shows", slug: "comedy-and-shows", description: "Never go to comedy clubs, indie gigs, or live concerts alone.", suggestedDuration: 3, icon: "ticket" },
    { title: "Museums & Art Galleries", slug: "museum-and-art", description: "Explore contemporary art exhibitions, heritage galleries, and design studios together.", suggestedDuration: 2, icon: "palette" },
    { title: "Food Crawl & Street Eats", slug: "food-walk", description: "Discover neighborhood street food alleys, secret dessert spots, and culinary joints.", suggestedDuration: 2, icon: "utensils" },
    { title: "Book Cafes & Reading", slug: "book-cafes", description: "Quiet co-reading companion for independent bookstores and library cafes.", suggestedDuration: 2, icon: "book-open" },
    { title: "Shopping & Styling Buddy", slug: "shopping-buddy", description: "Get honest opinions, fashion advice, and a friendly plus-one for shopping streets.", suggestedDuration: 2, icon: "shopping-bag" },
    { title: "Badminton & Tennis", slug: "sports-buddy", description: "Rally partner for weekend turf tennis, badminton, or squash sessions.", suggestedDuration: 1, icon: "activity" },
    { title: "Co-Working Focus Partner", slug: "coworking-partner", description: "Accountability buddy for focused productivity sessions at specialty coffee shops.", suggestedDuration: 3, icon: "laptop" },
    { title: "Photo Walk & Candid Shots", slug: "photo-walk", description: "Explore scenic urban architectural lanes with a companion who loves taking candid shots.", suggestedDuration: 2, icon: "camera" },
    { title: "Board Games & Arcades", slug: "board-games", description: "Challenge someone to Catan, Scrabble, or classic arcade games over milkshakes.", suggestedDuration: 2, icon: "dices" },
    { title: "Sunset & Park Strolls", slug: "park-walk", description: "Peaceful evening walks across Cubbon Park, Lodhi Gardens, or waterfronts.", suggestedDuration: 1, icon: "sun" },
    { title: "Flea Markets & Thrifting", slug: "thrift-shopping", description: "Treasure hunt through vintage pop-ups, handmade markets, and vinyl record stores.", suggestedDuration: 2, icon: "tag" },
    { title: "Indie Cinema & Film Clubs", slug: "indie-cinema", description: "Watch arthouse films and discuss cinema over tea afterwards.", suggestedDuration: 3, icon: "film" },
    { title: "Weekend Morning Cycling", slug: "cycling", description: "Early morning cycling partner along tree-lined boulevards and quiet outskirts.", suggestedDuration: 2, icon: "bike" },
    { title: "Language & Cultural Exchange", slug: "language-exchange", description: "Practice conversational English, Hindi, French, or regional languages casually.", suggestedDuration: 1, icon: "languages" },
  ];

  const seededActivities: Record<string, string> = {};
  for (const act of activitiesData) {
    const record = await prisma.activity.upsert({
      where: { slug: act.slug },
      update: {
        title: act.title,
        description: act.description,
        icon: act.icon,
        suggestedDuration: act.suggestedDuration,
      },
      create: act,
    });
    seededActivities[act.slug] = record.id;
  }
  console.log(`[Seed] Seeded ${Object.keys(seededActivities).length} activities.`);

  // Clean out legacy mock companions & reviews to guarantee a fresh Indian dataset
  console.log("[Seed] Cleaning legacy reviews, bookings, and companions...");
  try {
    await prisma.reviewRating.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.companion.deleteMany({});
    await prisma.user.deleteMany({
      where: { role: "COMPANION" },
    });
    console.log("[Seed] Legacy companion data cleaned successfully.");
  } catch (err) {
    console.warn("[Seed] Note during clean: ", err);
  }

  // 3. Seed 15 Authentic Indian Companions (10 Women, 5 Men)
  const companionsData = [
    // 10 Women
    {
      id: "ananya-del",
      phone: "+919811223301",
      name: "Ananya Sharma",
      displayName: "Ananya",
      maskedName: "Ananya S***",
      gender: "female",
      citySlug: "delhi",
      avatarUrl: "/companions/girl1.jpg",
      blurredAvatarUrl: "/companions/girl1-blur.jpg",
      bio: "Literature graduate and visual storyteller based in South Delhi. Love exploring quiet artisan coffee houses in Khan Market, discussing contemporary fiction, and strolling through Lodhi Art District.",
      shortBio: "Literature graduate in South Delhi. Khan Market cafes & Lodhi Art District.",
      hourlyRate: 599.00,
      spokenLanguages: ["English", "Hindi"],
      acceptedActivities: ["Coffee & Conversations", "City Walk & Exploration", "Museums & Art Galleries", "Book Cafes & Reading"],
      ratingAverage: 4.95,
      totalReviews: 34,
      upiId: "ananyasharma@okaxis",
    },
    {
      id: "priya-blr",
      phone: "+919811223302",
      name: "Priya Nair",
      displayName: "Priya",
      maskedName: "Priya N***",
      gender: "female",
      citySlug: "bengaluru",
      avatarUrl: "/companions/girl2.jpg",
      blurredAvatarUrl: "/companions/girl2-blur.jpg",
      bio: "UI/UX designer and specialty coffee enthusiast. I know all the quietest roasteries on 12th Main Indiranagar and love catching indie standup comedy shows on weekends.",
      shortBio: "Product designer in Indiranagar. Specialty coffee roasteries & comedy gigs.",
      hourlyRate: 649.00,
      spokenLanguages: ["English", "Hindi", "Kannada"],
      acceptedActivities: ["Coffee & Conversations", "Comedy & Live Shows", "Co-Working Focus Partner", "Food Crawl & Street Eats"],
      ratingAverage: 5.0,
      totalReviews: 42,
      upiId: "priyanair@okhdfcbank",
    },
    {
      id: "sneha-mum",
      phone: "+919811223303",
      name: "Sneha Kulkarni",
      displayName: "Sneha",
      maskedName: "Sneha K***",
      gender: "female",
      citySlug: "mumbai",
      avatarUrl: "/companions/girl3.jpg",
      blurredAvatarUrl: "/companions/girl3-blur.jpg",
      bio: "Media planner and sunset enthusiast in Bandra. Great plus-one for cafe hopping, boutique art pop-ups, and peaceful evening sea-face walks along Marine Drive.",
      shortBio: "Bandra media planner. Bandra cafes & Marine Drive evening walks.",
      hourlyRate: 699.00,
      spokenLanguages: ["English", "Hindi", "Marathi"],
      acceptedActivities: ["Sunset & Park Strolls", "Photo Walk & Candid Shots", "Food Crawl & Street Eats", "Shopping & Styling Buddy"],
      ratingAverage: 4.92,
      totalReviews: 38,
      upiId: "snehak@icici",
    },
    {
      id: "tanvi-chd",
      phone: "+919811223304",
      name: "Tanvi Verma",
      displayName: "Tanvi",
      maskedName: "Tanvi V***",
      gender: "female",
      citySlug: "chandigarh",
      avatarUrl: "/companions/girl4.jpg",
      blurredAvatarUrl: "/companions/girl4-blur.jpg",
      bio: "Fashion styling student at NIFT. Your friendly shopping companion for Elante Mall and Sector 17 heritage plazas. Gives totally honest feedback and keeps things fun.",
      shortBio: "Fashion styling student. Elante shopping & Sector 17 coffee strolls.",
      hourlyRate: 549.00,
      spokenLanguages: ["English", "Hindi", "Punjabi"],
      acceptedActivities: ["Shopping & Styling Buddy", "Coffee & Conversations", "City Walk & Exploration"],
      ratingAverage: 4.88,
      totalReviews: 29,
      upiId: "tanviverma@okaxis",
    },
    {
      id: "rhea-pune",
      phone: "+919811223305",
      name: "Rhea Sengupta",
      displayName: "Rhea",
      maskedName: "Rhea S***",
      gender: "female",
      citySlug: "pune",
      avatarUrl: "/companions/girl5.jpg",
      blurredAvatarUrl: "/companions/girl5-blur.jpg",
      bio: "Psychology researcher and indie cinema lover. Up for German Bakery coffee chats in Koregaon Park, art screenings, and sincere conversations about life and books.",
      shortBio: "Researcher in Koregaon Park. Indie films & coffee chats.",
      hourlyRate: 599.00,
      spokenLanguages: ["English", "Hindi", "Bengali"],
      acceptedActivities: ["Indie Cinema & Film Clubs", "Coffee & Conversations", "Co-Working Focus Partner", "Book Cafes & Reading"],
      ratingAverage: 4.94,
      totalReviews: 31,
      upiId: "rheasengupta@ybl",
    },
    {
      id: "isha-hyd",
      phone: "+919811223306",
      name: "Isha Deshmukh",
      displayName: "Isha",
      maskedName: "Isha D***",
      gender: "female",
      citySlug: "hyderabad",
      avatarUrl: "/companions/girl6.jpg",
      blurredAvatarUrl: "/companions/girl6-blur.jpg",
      bio: "Architecture apprentice in Jubilee Hills. Enthusiastic about old city heritage walks, hidden local bakeries, weekend thrifting, and playing badminton.",
      shortBio: "Architect in Jubilee Hills. Old city food walks & flea markets.",
      hourlyRate: 599.00,
      spokenLanguages: ["English", "Hindi", "Telugu"],
      acceptedActivities: ["Food Crawl & Street Eats", "Flea Markets & Thrifting", "City Walk & Exploration", "Badminton & Tennis"],
      ratingAverage: 5.0,
      totalReviews: 25,
      upiId: "ishad@okaxis",
    },
    {
      id: "meera-del",
      phone: "+919811223307",
      name: "Meera Kapoor",
      displayName: "Meera",
      maskedName: "Meera K***",
      gender: "female",
      citySlug: "delhi",
      avatarUrl: "/companions/girl7.jpg",
      blurredAvatarUrl: "/companions/girl7-blur.jpg",
      bio: "Certified personal fitness trainer & marathoner. Need a serious workout spotter to push your PRs, or a morning running partner around CyberHub and Saket? Positive energy guaranteed.",
      shortBio: "Fitness coach in CyberHub. Workout spotter & running buddy.",
      hourlyRate: 699.00,
      spokenLanguages: ["English", "Hindi"],
      acceptedActivities: ["Gym & Fitness Spotting", "Sunset & Park Strolls", "Coffee & Conversations"],
      ratingAverage: 4.96,
      totalReviews: 45,
      upiId: "meerakapoor@paytm",
    },
    {
      id: "dia-mum",
      phone: "+919811223308",
      name: "Dia Mathur",
      displayName: "Dia",
      maskedName: "Dia M***",
      gender: "female",
      citySlug: "mumbai",
      avatarUrl: "/companions/girl8.jpg",
      blurredAvatarUrl: "/companions/girl8-blur.jpg",
      bio: "Contemporary art student in Colaba. Love exploring Kala Ghoda galleries, vintage vinyl record shops, and finding quiet rooftop cafes with sea breeze.",
      shortBio: "Art curator in Colaba. Kala Ghoda galleries & vintage record shops.",
      hourlyRate: 649.00,
      spokenLanguages: ["English", "Hindi", "Gujarati"],
      acceptedActivities: ["Museums & Art Galleries", "Photo Walk & Candid Shots", "Shopping & Styling Buddy", "Coffee & Conversations"],
      ratingAverage: 4.87,
      totalReviews: 28,
      upiId: "diamathur@okaxis",
    },
    {
      id: "kritika-blr",
      phone: "+919811223309",
      name: "Kritika Joshi",
      displayName: "Kritika",
      maskedName: "Kritika J***",
      gender: "female",
      citySlug: "bengaluru",
      avatarUrl: "/companions/girl9.jpg",
      blurredAvatarUrl: "/companions/girl9-blur.jpg",
      bio: "Product marketer in Koramangala. Great company for board game cafes, focused co-working sprints at Third Wave, and fun conversations over Boba tea.",
      shortBio: "Marketer in Koramangala. Board game cafes & co-working.",
      hourlyRate: 599.00,
      spokenLanguages: ["English", "Hindi"],
      acceptedActivities: ["Board Games & Arcades", "Co-Working Focus Partner", "Coffee & Conversations"],
      ratingAverage: 4.93,
      totalReviews: 36,
      upiId: "kritikaj@okhdfcbank",
    },
    {
      id: "simran-chd",
      phone: "+919811223310",
      name: "Simran Kaur",
      displayName: "Simran",
      maskedName: "Simran K***",
      gender: "female",
      citySlug: "chandigarh",
      avatarUrl: "/companions/girl10.jpg",
      blurredAvatarUrl: "/companions/girl10-blur.jpg",
      bio: "Morning sports enthusiast living near Sukhna Lake. Passionate about sunrise cycling down tree-lined boulevards, weekend badminton matches, and healthy breakfast bowls.",
      shortBio: "Sports enthusiast near Sukhna Lake. Sunrise cycling & badminton.",
      hourlyRate: 549.00,
      spokenLanguages: ["English", "Hindi", "Punjabi"],
      acceptedActivities: ["Gym & Fitness Spotting", "Weekend Morning Cycling", "Badminton & Tennis", "Coffee & Conversations"],
      ratingAverage: 5.0,
      totalReviews: 33,
      upiId: "simrankaur@okaxis",
    },

    // 5 Men
    {
      id: "aarav-mum",
      phone: "+919811223311",
      name: "Aarav Mehta",
      displayName: "Aarav",
      maskedName: "Aarav M***",
      gender: "male",
      citySlug: "mumbai",
      avatarUrl: "/companions/man1.jpg",
      blurredAvatarUrl: "/companions/man1-blur.jpg",
      bio: "Fitness consultant and tennis player in Bandra West. Reliable spotter for gym workouts, weekend turf badminton rallies, or grabbing protein smoothies after training.",
      shortBio: "Fitness coach in Bandra. Dedicated gym spotter & tennis partner.",
      hourlyRate: 599.00,
      spokenLanguages: ["English", "Hindi", "Gujarati"],
      acceptedActivities: ["Gym & Fitness Spotting", "Badminton & Tennis", "Coffee & Conversations", "City Walk & Exploration"],
      ratingAverage: 4.91,
      totalReviews: 31,
      upiId: "aaravmehta@okaxis",
    },
    {
      id: "kabir-del",
      phone: "+919811223312",
      name: "Kabir Malhotra",
      displayName: "Kabir",
      maskedName: "Kabir M***",
      gender: "male",
      citySlug: "delhi",
      avatarUrl: "/companions/man2.jpg",
      blurredAvatarUrl: "/companions/man2-blur.jpg",
      bio: "Podcast producer and cinephile based in Gurgaon. Love discovering standup comedy clubs, watching IMAX releases, and hitting late-night street food joints at CyberHub.",
      shortBio: "Podcast producer in Gurgaon. Comedy clubs, IMAX & CyberHub food.",
      hourlyRate: 649.00,
      spokenLanguages: ["English", "Hindi", "Punjabi"],
      acceptedActivities: ["Comedy & Live Shows", "Indie Cinema & Film Clubs", "Food Crawl & Street Eats"],
      ratingAverage: 5.0,
      totalReviews: 37,
      upiId: "kabirmalhotra@paytm",
    },
    {
      id: "rohan-pune",
      phone: "+919811223313",
      name: "Rohan Kulkarni",
      displayName: "Rohan",
      maskedName: "Rohan K***",
      gender: "male",
      citySlug: "pune",
      avatarUrl: "/companions/man3.jpg",
      blurredAvatarUrl: "/companions/man3-blur.jpg",
      bio: "Software developer and cycling enthusiast in Kalyani Nagar. Ideal buddy for productive cafe co-working sessions or quiet weekend morning cycling along Pashan trails.",
      shortBio: "Software developer in Kalyani Nagar. Co-working sprints & cycling.",
      hourlyRate: 499.00,
      spokenLanguages: ["English", "Hindi", "Marathi"],
      acceptedActivities: ["Co-Working Focus Partner", "Weekend Morning Cycling", "Book Cafes & Reading"],
      ratingAverage: 4.85,
      totalReviews: 24,
      upiId: "rohank@okhdfcbank",
    },
    {
      id: "aditya-blr",
      phone: "+919811223314",
      name: "Aditya Rao",
      displayName: "Aditya",
      maskedName: "Aditya R***",
      gender: "male",
      citySlug: "bengaluru",
      avatarUrl: "/companions/man4.jpg",
      blurredAvatarUrl: "/companions/man4-blur.jpg",
      bio: "Freelance street photographer and board gamer on Church Street. Great plus-one for candid photo walks, exploring retro alleys, and gaming marathons over filter coffee.",
      shortBio: "Street photographer on Church Street. Photo walks & board games.",
      hourlyRate: 549.00,
      spokenLanguages: ["English", "Hindi", "Kannada"],
      acceptedActivities: ["Photo Walk & Candid Shots", "Board Games & Arcades", "City Walk & Exploration"],
      ratingAverage: 4.93,
      totalReviews: 29,
      upiId: "adityarao@ybl",
    },
    {
      id: "vikram-chd",
      phone: "+919811223315",
      name: "Vikram Singhania",
      displayName: "Vikram",
      maskedName: "Vikram S***",
      gender: "male",
      citySlug: "chandigarh",
      avatarUrl: "/companions/man5.jpg",
      blurredAvatarUrl: "/companions/man5-blur.jpg",
      bio: "Civil architect and badminton lover in Sector 26. Friendly guide for Sukhna Lake walks, architectural heritage tours, and friendly weekend tennis sessions.",
      shortBio: "Architect in Sector 26. Sukhna Lake walks & tennis matches.",
      hourlyRate: 599.00,
      spokenLanguages: ["English", "Hindi", "Punjabi"],
      acceptedActivities: ["City Walk & Exploration", "Coffee & Conversations", "Badminton & Tennis", "Gym & Fitness Spotting"],
      ratingAverage: 4.92,
      totalReviews: 35,
      upiId: "vikramsingh@okaxis",
    },
  ];

  for (const c of companionsData) {
    console.log(`[Seed] Seeding companion: ${c.displayName} (${c.gender}, ${c.citySlug})...`);
    const user = await prisma.user.upsert({
      where: { phone: c.phone },
      update: {
        name: c.name,
        role: "COMPANION",
        gender: c.gender,
        isKycVerified: true,
      },
      create: {
        phone: c.phone,
        name: c.name,
        role: "COMPANION",
        gender: c.gender,
        isKycVerified: true,
      },
    });

    const companionRecord = await prisma.companion.upsert({
      where: { userId: user.id },
      update: {
        displayName: c.displayName,
        maskedName: c.maskedName,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        cityId: seededCities[c.citySlug] || seededCities["delhi"],
        bio: c.bio,
        shortBio: c.shortBio,
        hourlyRate: c.hourlyRate,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        upiId: c.upiId,
        isAvailable: true,
      },
      create: {
        id: c.id,
        userId: user.id,
        displayName: c.displayName,
        maskedName: c.maskedName,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        cityId: seededCities[c.citySlug] || seededCities["delhi"],
        bio: c.bio,
        shortBio: c.shortBio,
        hourlyRate: c.hourlyRate,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        upiId: c.upiId,
        isAvailable: true,
      },
    });

    // Seed realistic Indian verified member review for each companion
    const reviewerNames = [
      "Arjun Kapoor", "Megha Nambiar", "Karan Singhal", "Pooja Hegde",
      "Varun Joshi", "Divya Menon", "Sahil Batra", "Shreya Iyer",
      "Nikhil Tyagi", "Rachit Bansal", "Tarun Khanna", "Anjali Deshmukh"
    ];
    const reviewerName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
    const reviewerPhone = `+91999900${c.phone.slice(-4)}`;
    const reviewerUser = await prisma.user.upsert({
      where: { phone: reviewerPhone },
      update: {
        name: reviewerName,
      },
      create: {
        phone: reviewerPhone,
        name: reviewerName,
        role: "MEMBER",
      },
    });

    const bookingRecord = await prisma.booking.upsert({
      where: { bookingNumber: `CMP-SEED-${c.id}` },
      update: {},
      create: {
        id: `seed-bk-${c.id}`,
        bookingNumber: `CMP-SEED-${c.id}`,
        memberId: reviewerUser.id,
        companionId: companionRecord.id,
        cityId: seededCities[c.citySlug] || seededCities["delhi"],
        activityId: seededActivities["coffee-chat"] || Object.values(seededActivities)[0],
        scheduledDate: new Date(Date.now() - 3 * 86400000),
        durationHours: 2,
        venueName: "Artisan Roastery Cafe",
        venueAddress: "Public High Street",
        totalAmount: 1200.00,
        companionFee: 1000.00,
        platformFee: 169.49,
        gstAmount: 30.51,
        verificationPin: "8421",
        pinVerifiedAt: new Date(Date.now() - 3 * 86400000),
        status: "COMPLETED",
        escrowStatus: "RELEASED_TO_HOST",
        hostAcceptanceDeadline: new Date(Date.now() - 2 * 86400000),
      },
    });

    const sampleComments = [
      `Had such a refreshing time with ${c.displayName}! We met at a public cafe and felt completely at ease from the first minute. Zero awkwardness and great conversation!`,
      `Meeting ${c.displayName} was wonderful! Completely respectful, punctual, and genuine. Looking forward to booking again.`,
      `Super easy to talk to, completely authentic, and strictly platonic. A great companion experience in the city!`,
    ];
    const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];

    await prisma.reviewRating.upsert({
      where: { bookingId: bookingRecord.id },
      update: {},
      create: {
        id: `rev-${c.id}-1`,
        bookingId: bookingRecord.id,
        memberId: reviewerUser.id,
        companionId: companionRecord.id,
        score: 5,
        comment,
      },
    });
  }
  console.log(`[Seed] Seeded ${companionsData.length} verified Indian companions (10 Women, 5 Men) with reviews.`);

  // 4. Seed Demo Members
  await prisma.user.upsert({
    where: { phone: "+919999999901" },
    update: { isUnlocked: true, activePassTier: "ONE_MONTH" },
    create: {
      phone: "+919999999901",
      name: "Aditya Mehta",
      role: "MEMBER",
      isUnlocked: true,
      activePassTier: "ONE_MONTH",
      passExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      walletBalance: 1500.00,
    },
  });

  await prisma.user.upsert({
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

  console.log("[Seed] Seeded demo members.");
  console.log("[Seed] All database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("[Seed] Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
