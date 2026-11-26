const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DELHI_CITY_ID = 'e5323911-caf6-4c5b-b611-b5c236c1aba4';

const NEW_DELHI_COMPANIONS = [
  {
    id: 'tara-del',
    phone: '+919811223316',
    name: 'Tara Sengupta',
    displayName: 'Tara',
    maskedName: 'Tara S***',
    age: 23,
    gender: 'female',
    locality: 'Hauz Khas Village & Green Park',
    hourlyRate: 599.00,
    ratingAverage: 4.93,
    totalReviews: 31,
    completedMeetups: 24,
    shortBio: 'Architecture grad in Hauz Khas. Specialty brews, indie books & heritage walks.',
    bio: 'Architecture graduate and avid sketcher based around Hauz Khas. I love finding quiet reading nooks in South Delhi, discovering single-origin espresso roasteries, and exploring historical stepwells and art pop-ups.',
    spokenLanguages: ['English', 'Hindi', 'Bengali'],
    acceptedActivities: ['Coffee & Conversations', 'Book Cafes & Reading', 'Museums & Art Galleries', 'Sunset & Park Strolls'],
    availabilitySlots: ['Weekdays (Mon-Fri)', 'Evenings (5 PM - 9 PM)'],
    preferredVenues: ['Blue Tokai Hauz Khas', 'Kunzum Travel Cafe', 'Deer Park Promenades'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/tara-del.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/tara-del.jpg',
    upiId: 'tarasengupta@okhdfcbank',
    sampleReviews: [
      { score: 5, comment: 'Tara was such a warm companion! We visited a quiet roastery in Hauz Khas and had a fantastic discussion on architecture and books.' },
      { score: 5, comment: 'Great listener and knows the coolest spots around Green Park. 100% recommended!' },
    ],
  },
  {
    id: 'ishita-del',
    phone: '+919811223317',
    name: 'Ishita Malhotra',
    displayName: 'Ishita',
    maskedName: 'Ishita M***',
    age: 24,
    gender: 'female',
    locality: 'Connaught Place & Khan Market',
    hourlyRate: 649.00,
    ratingAverage: 4.97,
    totalReviews: 44,
    completedMeetups: 38,
    shortBio: 'Content strategist in CP. Brunch connoisseur, flea markets & candid photo walks.',
    bio: 'Digital media strategist living in Central Delhi. High-energy, easygoing plus-one for weekend brunch crawls in CP, vintage vinyl shopping, aesthetic photo walks, and spontaneous indie standup comedy shows.',
    spokenLanguages: ['English', 'Hindi', 'Punjabi'],
    acceptedActivities: ['Coffee & Conversations', 'Food Crawl & Street Eats', 'Photo Walk & Candid Shots', 'Comedy & Live Shows'],
    availabilitySlots: ['Weekends (Sat-Sun)', 'Flexible / On Request'],
    preferredVenues: ['Cafe Turtle Khan Market', 'United Coffee House CP', 'Sunder Nursery'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/ishita-del.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/ishita-del.jpg',
    upiId: 'ishitamalhotra@icici',
    sampleReviews: [
      { score: 5, comment: 'Ishita has infectious positive energy! We explored Khan Market book cafes and clicked some great candid photos.' },
      { score: 5, comment: 'Super spontaneous and hilarious. Had the best brunch meetup in CP.' },
    ],
  },
  {
    id: 'zoya-del',
    phone: '+919811223318',
    name: 'Zoya Qureshi',
    displayName: 'Zoya',
    maskedName: 'Zoya Q***',
    age: 24,
    gender: 'female',
    locality: 'Greater Kailash (GK-1) & Saket',
    hourlyRate: 699.00,
    ratingAverage: 4.91,
    totalReviews: 28,
    completedMeetups: 20,
    shortBio: 'Fashion stylist in GK-1. M Block shopping runs, rooftop sundowners & gig nights.',
    bio: 'Fashion merchandising consultant in GK-1. Great eye for aesthetics, honest shopping advice, and wardrobe styling. Enjoy rooftop music sessions, live jazz gigs, and relaxed conversations over artisanal tea.',
    spokenLanguages: ['English', 'Hindi', 'Urdu'],
    acceptedActivities: ['Shopping & Styling Buddy', 'Comedy & Live Shows', 'Flea Markets & Thrifting', 'Coffee & Conversations'],
    availabilitySlots: ['Evenings (6 PM - 10 PM)', 'Weekends (Sat-Sun)'],
    preferredVenues: ['Music & Mount GK-1', 'Select Citywalk Open Plazas', 'Champa Gali'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/zoya-del.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/zoya-del.jpg',
    upiId: 'zoyastyle@okaxis',
    sampleReviews: [
      { score: 5, comment: 'Zoya gave such helpful styling advice during our M Block shopping afternoon. Extremely polite and well-spoken!' },
      { score: 5, comment: 'Top-tier companion for indie gigs and relaxed rooftop coffee.' },
    ],
  },
  {
    id: 'avani-del',
    phone: '+919811223319',
    name: 'Avani Sharma',
    displayName: 'Avani',
    maskedName: 'Avani S***',
    age: 22,
    gender: 'female',
    locality: 'Mandi House & Lodhi Art District',
    hourlyRate: 549.00,
    ratingAverage: 4.88,
    totalReviews: 19,
    completedMeetups: 15,
    shortBio: 'Theater & arts curator at Mandi House. Lodhi murals, plays & late-night chai.',
    bio: 'Performing arts student and gallery volunteer. Passionate about Hindi theater at Kamani & Shri Ram Centre, mural photography across Lodhi Art District, and candid conversations over roadside kulhad chai.',
    spokenLanguages: ['English', 'Hindi'],
    acceptedActivities: ['Museums & Art Galleries', 'Indie Cinema & Film Clubs', 'City Walk & Exploration', 'Coffee & Conversations'],
    availabilitySlots: ['Weekdays (Mon-Fri)', 'Flexible / On Request'],
    preferredVenues: ['Triveni Terrace Cafe', 'India Habitat Centre Open Atrium', 'Lodhi Gardens'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/avani-del.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/avani-del.jpg',
    upiId: 'avanidrama@paytm',
    sampleReviews: [
      { score: 5, comment: 'Avani showed me the best hidden murals in Lodhi and had so many stories about theater in Mandi House. Very thoughtful person!' },
      { score: 5, comment: 'Charming and articulate. Had a very refreshing walk at Triveni Terrace.' },
    ],
  },
  {
    id: 'riddhi-del',
    phone: '+919811223320',
    name: 'Riddhi Kapoor',
    displayName: 'Riddhi',
    maskedName: 'Riddhi K***',
    age: 25,
    gender: 'female',
    locality: 'Aerocity & Vasant Kunj',
    hourlyRate: 749.00,
    ratingAverage: 4.95,
    totalReviews: 36,
    completedMeetups: 30,
    shortBio: 'Brand consultant in Aerocity. Chic lounge cafes, design chats & evening walks.',
    bio: 'Corporate brand strategist based in Aerocity. Professional, articulate, and well-traveled. Perfect companion for business lounge chats, design summits, luxury retail window shopping, and fine cafe dining.',
    spokenLanguages: ['English', 'Hindi'],
    acceptedActivities: ['Coffee & Conversations', 'Co-Working Focus Partner', 'Food Crawl & Street Eats', 'City Walk & Exploration'],
    availabilitySlots: ['Evenings (5 PM - 9 PM)', 'Weekends (Sat-Sun)'],
    preferredVenues: ['Worldmark Aerocity', 'Promenade Vasant Kunj', 'Roseate House Cafe'],
    avatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/meetzy/companions/riddhi-del.jpg',
    blurredAvatarUrl: 'https://res.cloudinary.com/da9c3vejh/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/meetzy/companions/riddhi-del.jpg',
    upiId: 'riddhikapoor@kotak',
    sampleReviews: [
      { score: 5, comment: 'Riddhi was exceptionally polite and articulate. Great co-working discussion at Worldmark Aerocity!' },
      { score: 5, comment: 'High-end hospitality and effortless conversationalist. 5 stars all the way.' },
    ],
  },
];

async function seed() {
  console.log(`[DB Seed] Seeding ${NEW_DELHI_COMPANIONS.length} Delhi companions into Neon PostgreSQL...`);

  // Verify Delhi City exists
  const delhiCity = await prisma.city.findUnique({
    where: { id: DELHI_CITY_ID },
  });
  if (!delhiCity) {
    console.error(`[Error] Delhi city with ID ${DELHI_CITY_ID} not found!`);
    process.exit(1);
  }
  console.log(`✓ Delhi City verified: ${delhiCity.name} (${delhiCity.slug})`);

  // Find a verified member to link sample reviews to
  const sampleMember = await prisma.user.findFirst({
    where: { role: 'MEMBER' },
    select: { id: true, name: true },
  });

  for (const c of NEW_DELHI_COMPANIONS) {
    console.log(`Processing ${c.name} (${c.id})...`);

    // 1. Upsert User
    const user = await prisma.user.upsert({
      where: { phone: c.phone },
      update: {
        name: c.name,
        gender: c.gender,
        role: 'COMPANION',
        city: 'delhi',
        area: c.locality,
        isKycVerified: true,
        isSeeded: true,
      },
      create: {
        phone: c.phone,
        name: c.name,
        role: 'COMPANION',
        gender: c.gender,
        city: 'delhi',
        area: c.locality,
        isKycVerified: true,
        isSeeded: true,
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
        cityId: DELHI_CITY_ID,
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
        cityId: DELHI_CITY_ID,
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
  const delhiCompanions = await prisma.companion.count({
    where: { cityId: DELHI_CITY_ID },
  });

  console.log(`\n========================================`);
  console.log(`[Success] Database Seeding Complete!`);
  console.log(`Total Companions in DB: ${totalCompanions} (Expected: 20)`);
  console.log(`Delhi Companions in DB: ${delhiCompanions} (Expected: 8)`);
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
