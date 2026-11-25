const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');

// 1. Read .env file directly
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || 'da9c3vejh';
const api_key = process.env.CLOUDINARY_CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET;

if (!api_key || !api_secret) {
  console.error('[Error] Cloudinary API Key or Secret missing in .env!');
  process.exit(1);
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

const COMPANIONS_MAPPING = [
  // 10 Women
  { id: 'ananya-del', localFile: 'public/companions/girl1.jpg', name: 'Ananya' },
  { id: 'priya-blr', localFile: 'public/companions/girl2.jpg', name: 'Priya' },
  { id: 'sneha-mum', localFile: 'public/companions/girl3.jpg', name: 'Sneha' },
  { id: 'tanvi-chd', localFile: 'public/companions/girl4.jpg', name: 'Tanvi' },
  { id: 'rhea-pune', localFile: 'public/companions/girl5.jpg', name: 'Rhea' },
  { id: 'isha-hyd', localFile: 'public/companions/girl6.jpg', name: 'Isha' },
  { id: 'meera-del', localFile: 'public/companions/girl7.jpg', name: 'Meera' },
  { id: 'dia-mum', localFile: 'public/companions/girl8.jpg', name: 'Dia' },
  { id: 'kritika-blr', localFile: 'public/companions/girl9.jpg', name: 'Kritika' },
  { id: 'simran-chd', localFile: 'public/companions/girl10.jpg', name: 'Simran' },
  // 5 Men
  { id: 'aarav-mum', localFile: 'public/companions/man1.jpg', name: 'Aarav' },
  { id: 'kabir-del', localFile: 'public/companions/man2.jpg', name: 'Kabir' },
  { id: 'rohan-pune', localFile: 'public/companions/man3.jpg', name: 'Rohan' },
  { id: 'aditya-blr', localFile: 'public/companions/man4.jpg', name: 'Aditya' },
  { id: 'vikram-chd', localFile: 'public/companions/man5.jpg', name: 'Vikram' },
];

const prisma = new PrismaClient();

async function migrate() {
  console.log(`[Cloudinary Migration] Starting migration for ${COMPANIONS_MAPPING.length} companions to cloud: ${cloud_name}...`);

  const results = [];

  for (const item of COMPANIONS_MAPPING) {
    const fullPath = path.resolve(__dirname, '..', item.localFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`[Missing File] ${fullPath} does not exist!`);
      continue;
    }

    console.log(`[Uploading] ${item.name} (${item.id}) from ${item.localFile}...`);

    try {
      const uploadRes = await cloudinary.uploader.upload(fullPath, {
        folder: 'meetzy/companions',
        public_id: item.id,
        overwrite: true,
        resource_type: 'image',
        tags: ['meetzy', 'companion', 'v1'],
      });

      // Construct optimized URLs
      // 1. Clear Avatar with auto-format, auto-quality, smart face crop
      const clearAvatarUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/${uploadRes.public_id}.jpg`;
      // 2. Blurred Avatar with auto-format, auto-quality, blur transform
      const blurredAvatarUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/${uploadRes.public_id}.jpg`;

      console.log(`  ✓ Cloudinary uploaded: ${clearAvatarUrl}`);

      // Update Database
      const updated = await prisma.companion.update({
        where: { id: item.id },
        data: {
          avatarUrl: clearAvatarUrl,
          blurredAvatarUrl: blurredAvatarUrl,
        },
      });

      console.log(`  ✓ Database updated for companion: ${updated.id} (${updated.displayName})`);

      results.push({
        id: item.id,
        name: item.name,
        clearAvatarUrl,
        blurredAvatarUrl,
        success: true,
      });
    } catch (err) {
      console.error(`  ✗ Error migrating ${item.id}:`, err.message || err);
      results.push({
        id: item.id,
        name: item.name,
        error: err.message || String(err),
        success: false,
      });
    }
  }

  console.log('\n[Summary] Migration Results:');
  console.table(results.map(r => ({
    id: r.id,
    name: r.name,
    status: r.success ? 'SUCCESS' : 'FAILED',
    url: r.clearAvatarUrl ? r.clearAvatarUrl.substring(0, 70) + '...' : 'N/A'
  })));

  const successCount = results.filter(r => r.success).length;
  console.log(`\nSuccessfully migrated ${successCount}/${COMPANIONS_MAPPING.length} companions to Cloudinary and Neon DB!`);

  // Write mapping JSON to file so seed and static files can use it easily
  const mappingOutputPath = path.resolve(__dirname, 'cloudinary-companion-urls.json');
  fs.writeFileSync(mappingOutputPath, JSON.stringify(results, null, 2));
  console.log(`Saved URL mappings to ${mappingOutputPath}`);
}

migrate()
  .catch(e => {
    console.error('[Fatal Migration Error]:', e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
