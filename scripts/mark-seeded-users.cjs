const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SEEDED_HOST_PHONES = Array.from({ length: 20 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  return `+9198112233${num}`;
});

const SEEDED_DEMO_MEMBER_PHONES = ['+919999999901', '+919999999902'];

async function main() {
  const allTargetPhones = [...SEEDED_HOST_PHONES, ...SEEDED_DEMO_MEMBER_PHONES];

  const updated = await prisma.user.updateMany({
    where: {
      phone: { in: allTargetPhones },
    },
    data: {
      isSeeded: true,
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
      isSeeded: true,
      companion: {
        select: {
          id: true,
          displayName: true,
          city: { select: { name: true } },
        },
      },
    },
  });

  const genuineCount = await prisma.user.count({
    where: { isSeeded: false },
  });

  console.log(`Updated ${updated.count} seeded user records.`);
  console.log(`Total isSeeded=true users: ${seededList.length}`);
  console.log(`Total genuine (isSeeded=false) users untouched: ${genuineCount}`);

  for (const u of seededList) {
    const label = u.companion
      ? `${u.companion.displayName} (${u.companion.id}) - ${u.companion.city?.name || 'Unknown'}`
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
