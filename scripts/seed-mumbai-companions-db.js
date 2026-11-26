const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MUMBAI_CITY_ID = '2ae6f6bb-1c22-4ccd-ab7e-98179be9e074';

const NEW_MUMBAI_COMPANIONS = [
  {
    id: 'anvi-mum',
    phone: '+919811223321',
    name: 'Anvi Deshmukh',
    displayName: 'Anvi',
    maskedName: 'Anvi D***',
    age: 23,
    gender: 'female',
    locality: 'Bandra West (Pali Hill & Ranwar)',
    hourlyRate: 649.00,
    ratingAverage: 4.96,
    totalReviews: 34,
    completedMeetups: 26,
    shortBio: 'Visual stylist in Pali Hill. Ranwar village walks, Subko brews & Carter Road sunsets.',
    bio: 'Visual stylist and ceramic arts enthusiast based in Pali Hill. I love exploring the quiet Portuguese lanes of Ranwar Village, iced pour-overs at Subko, visiting weekend flea pop-ups, and peaceful sunset strolls along Carter Road.',
    spokenLanguages: ['English', 'Hindi', 'Marathi'],
    acceptedActivities: ['Coffee & Conversations', 'Photo Walk & Candid Shots', 'Sunset & Park Strolls', 'Flea Markets & Thrifting'],
    availabilitySlots: ['Weekdays (Mon-Fri)', 'Evenings (5 PM - 9 PM)'],
    preferredVenues: ['Subko Coffee Roasters Bandra', 'Birdsong Organic Cafe', 'Carter Road Promenade'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/anvi-mum.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/anvi-mum.jpg',
    upiId: 'anvideshmukh@okhdfcbank',
  },
  {
    id: 'kiara-mum',
    phone: '+919811223322',
    name: 'Kiara Mehta',
    displayName: 'Kiara',
    maskedName: 'Kiara M***',
    age: 24,
    gender: 'female',
    locality: 'Juhu & Versova',
    hourlyRate: 599.00,
    ratingAverage: 4.94,
    totalReviews: 41,
    completedMeetups: 33,
    shortBio: 'Branding consultant in Juhu. Sea-facing brunch cafes, beach walks & design talks.',
    bio: 'Digital branding consultant living near Juhu beach. High-energy, warm, and approachable. Always up for sea-facing brunch dates, fresh sourdough pastries, beach sunset walks, and collaborative creative brainstorming.',
    spokenLanguages: ['English', 'Hindi', 'Gujarati'],
    acceptedActivities: ['Coffee & Conversations', 'Food Crawl & Street Eats', 'Sunset & Park Strolls', 'Co-Working Focus Partner'],
    availabilitySlots: ['Weekends (Sat-Sun)', 'Flexible / On Request'],
    preferredVenues: ['Prithvi Cafe Juhu', 'Silver Beach Cafe', 'Soho House Sea-facing Lounge'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/kiara-mum.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/kiara-mum.jpg',
    upiId: 'kiaramehta@icici',
  },
  {
    id: 'sanya-mum',
    phone: '+919811223323',
    name: 'Sanya Kapoor',
    displayName: 'Sanya',
    maskedName: 'Sanya K***',
    age: 25,
    gender: 'female',
    locality: 'Colaba & Marine Drive',
    hourlyRate: 799.00,
    ratingAverage: 4.97,
    totalReviews: 48,
    completedMeetups: 40,
    shortBio: 'Gallery coordinator in Colaba. NCPA theater evenings, art exhibitions & Marine Drive.',
    bio: 'Art gallery coordinator and classical music enthusiast living in South Mumbai. Sophisticated, well-read, and great listener. Ideal companion for evening theater at NCPA, Jehangir Art Gallery exhibitions, and peaceful midnight drives along Marine Drive.',
    spokenLanguages: ['English', 'Hindi'],
    acceptedActivities: ['Museums & Art Galleries', 'Indie Cinema & Film Clubs', 'Coffee & Conversations', 'City Walk & Exploration'],
    availabilitySlots: ['Evenings (6 PM - 10 PM)', 'Weekends (Sat-Sun)'],
    preferredVenues: ['Kala Ghoda Cafe', 'NCPA Atrium Nariman Point', 'Marine Drive Sea Face'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/sanya-mum.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/sanya-mum.jpg',
    upiId: 'sanyakapoor@okaxis',
  },
  {
    id: 'navya-mum',
    phone: '+919811223324',
    name: 'Navya Joshi',
    displayName: 'Navya',
    maskedName: 'Navya J***',
    age: 22,
    gender: 'female',
    locality: 'Lower Parel (Palladium) & Worli',
    hourlyRate: 549.00,
    ratingAverage: 4.89,
    totalReviews: 22,
    completedMeetups: 17,
    shortBio: 'Media student in Lower Parel. Palladium sneaker shopping, arcades & Worli ice creams.',
    bio: 'Media science student and sneaker culture enthusiast based near Lower Parel. Fun, easygoing plus-one for shopping runs at Phoenix Palladium, trying out classic arcade games, and late-night artisan ice-cream walks at Worli Seaface.',
    spokenLanguages: ['English', 'Hindi', 'Marathi'],
    acceptedActivities: ['Shopping & Styling Buddy', 'Board Games & Arcades', 'Coffee & Conversations', 'Comedy & Live Shows'],
    availabilitySlots: ['Weekdays (Mon-Fri)', 'Flexible / On Request'],
    preferredVenues: ['Phoenix Palladium Courtyard', 'The Bombay Canteen', 'Worli Seaface Promenade'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/navya-mum.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/navya-mum.jpg',
    upiId: 'navyajoshi@paytm',
  },
  {
    id: 'myra-mum',
    phone: '+919811223325',
    name: 'Myra Singhania',
    displayName: 'Myra',
    maskedName: 'Myra S***',
    age: 24,
    gender: 'female',
    locality: 'Khar West & BKC',
    hourlyRate: 699.00,
    ratingAverage: 4.92,
    totalReviews: 29,
    completedMeetups: 21,
    shortBio: 'PR strategist in BKC. Gourmet pop-ups, comedy nights & high-energy conversations.',
    bio: 'PR & talent strategist working in BKC. Dynamic, witty, and well-traveled. Perfect companion for gourmet dining pop-ups, mocktail tastings, live stand-up comedy shows in Bandra, and stimulating discussions on culture and media.',
    spokenLanguages: ['English', 'Hindi'],
    acceptedActivities: ['Coffee & Conversations', 'Comedy & Live Shows', 'Food Crawl & Street Eats', 'Flea Markets & Thrifting'],
    availabilitySlots: ['Evenings (5 PM - 9 PM)', 'Weekends (Sat-Sun)'],
    preferredVenues: ['Craft Deli BKC', 'The Bagel Shop Bandra', 'That Comedy Club Bandra'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/myra-mum.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/myra-mum.jpg',
    upiId: 'myrasinghania@kotak',
  },
];

async function seed() {
  console.log(`[DB Seed] Seeding ${NEW_MUMBAI_COMPANIONS.length} Mumbai companions into Neon PostgreSQL...`);

  // Verify Mumbai City exists
  const mumbaiCity = await prisma.city.findUnique({
    where: { id: MUMBAI_CITY_ID },
  });
  if (!mumbaiCity) {
    console.error(`[Error] Mumbai city with ID ${MUMBAI_CITY_ID} not found!`);
    process.exit(1);
  }
  console.log(`✓ Mumbai City verified: ${mumbaiCity.name} (${mumbaiCity.slug})`);

  for (const c of NEW_MUMBAI_COMPANIONS) {
    console.log(`Processing ${c.name} (${c.id})...`);

    // 1. Upsert User
    const user = await prisma.user.upsert({
      where: { phone: c.phone },
      update: {
        name: c.name,
        gender: c.gender,
        role: 'COMPANION',
        city: 'mumbai',
        area: c.locality,
        isKycVerified: true,
      },
      create: {
        phone: c.phone,
        name: c.name,
        role: 'COMPANION',
        gender: c.gender,
        city: 'mumbai',
        area: c.locality,
        isKycVerified: true,
        walletBalance: 0,
        coinBalance: 100,
        creditBalance: 100,
      },
    });

    // 2. Upsert Companion
    const companion = await prisma.companion.upsert({
      where: { id: c.id },
      update: {
        userId: user.id,
        displayName: c.displayName,
        maskedName: c.maskedName,
        age: c.age,
        gender: c.gender,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        cityId: MUMBAI_CITY_ID,
        bio: c.bio,
        shortBio: c.shortBio,
        hourlyRate: c.hourlyRate,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        availabilitySlots: c.availabilitySlots,
        preferredVenues: c.preferredVenues,
        locality: c.locality,
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        completedMeetups: c.completedMeetups,
        isAvailable: true,
        upiId: c.upiId,
      },
      create: {
        id: c.id,
        userId: user.id,
        displayName: c.displayName,
        maskedName: c.maskedName,
        age: c.age,
        gender: c.gender,
        avatarUrl: c.avatarUrl,
        blurredAvatarUrl: c.blurredAvatarUrl,
        cityId: MUMBAI_CITY_ID,
        bio: c.bio,
        shortBio: c.shortBio,
        hourlyRate: c.hourlyRate,
        spokenLanguages: c.spokenLanguages,
        acceptedActivities: c.acceptedActivities,
        availabilitySlots: c.availabilitySlots,
        preferredVenues: c.preferredVenues,
        locality: c.locality,
        ratingAverage: c.ratingAverage,
        totalReviews: c.totalReviews,
        completedMeetups: c.completedMeetups,
        isAvailable: true,
        upiId: c.upiId,
      },
    });

    console.log(`  ✓ Companion saved: ${companion.displayName} (Hourly: ₹${companion.hourlyRate}, Rating: ${companion.ratingAverage})`);
  }

  // Summary
  const totalCompanions = await prisma.companion.count();
  const mumbaiCompanions = await prisma.companion.count({
    where: { cityId: MUMBAI_CITY_ID },
  });

  console.log(`\n========================================`);
  console.log(`[Success] Database Seeding Complete!`);
  console.log(`Total Companions in DB: ${totalCompanions} (Expected: 25)`);
  console.log(`Mumbai Companions in DB: ${mumbaiCompanions} (Expected: 8)`);
  console.log(`========================================\n`);
}

seed()
  .catch((e) => {
    console.error('[Seeding Error]:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
