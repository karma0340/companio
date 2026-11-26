const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_SEEDED_UPI_ID = 'mtyagi12@ybl';

const SEEDED_HOST_PHONES = Array.from({ length: 25 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  return `+9198112233${num}`;
});

const SEEDED_DEMO_MEMBER_PHONES = ['+919999999901', '+919999999902'];

async function main() {
  const allTargetPhones = [...SEEDED_HOST_PHONES, ...SEEDED_DEMO_MEMBER_PHONES];

  const updatedUsers = await prisma.user.updateMany({
    where: {
      phone: { in: allTargetPhones },
    },
    data: {
      isSeeded: true,
    },
  });

  // Update UPI ID strictly on seeded companions only — never touch genuine hosts
  const updatedCompanions = await prisma.companion.updateMany({
    where: {
      user: {
        isSeeded: true,
      },
    },
    data: {
      upiId: DEFAULT_SEEDED_UPI_ID,
      upiVerified: false,
      razorpayFundAccountId: null,
    },
  });

  const seededList = await prisma.user.findMany({
    where: { isSeeded: true },
    orderBy: [{ role: 'asc' }, { phone: 'asc' }],
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      companion: {
        select: {
          id: true,
          displayName: true,
          upiId: true,
          city: { select: { name: true } },
        },
      },
    },
  });

  const genuineUsersCount = await prisma.user.count({
    where: { isSeeded: false },
  });

  const genuineCompanions = await prisma.companion.findMany({
    where: { user: { isSeeded: false } },
    select: { id: true, displayName: true, upiId: true },
  });

  console.log(`Marked ${updatedUsers.count} seeded user records (isSeeded=true).`);
  console.log(`Updated UPI ID to ${DEFAULT_SEEDED_UPI_ID} on ${updatedCompanions.count} seeded companion profiles.`);
  console.log(`Total isSeeded=true users: ${seededList.length}`);
  console.log(`Total genuine (isSeeded=false) users untouched: ${genuineUsersCount}`);
  console.log(`Total genuine (isSeeded=false) companions untouched: ${genuineCompanions.length}`);

  for (const u of seededList) {
    const label = u.companion
      ? `${u.companion.displayName} (${u.companion.id}) - ${u.companion.city?.name || 'Unknown'} | UPI: ${u.companion.upiId}`
      : `${u.name || 'Demo Member'} (${u.role})`;
    console.log(`  - ${u.phone} | ${label}`);
  }
}

main()
  .catch((err) => {
    console.error('[MARK SEEDED USERS ERROR]:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
