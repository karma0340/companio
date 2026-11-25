const fs = require('fs');
const path = require('path');

const mappings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cloudinary-companion-urls.json'), 'utf8'));

// 1. Update src/lib/data/companions.ts
const companionsTsPath = path.resolve(__dirname, '../src/lib/data/companions.ts');
let content = fs.readFileSync(companionsTsPath, 'utf8');

for (const item of mappings) {
  // Replace /companions/girlX.jpg or /companions/manX.jpg for that companion ID
  const pattern = new RegExp(`(id:\\s*['"]${item.id}['"][\\s\\S]*?avatarUrl:\\s*['"])[^'"]+(['"])`);
  content = content.replace(pattern, `$1${item.clearAvatarUrl}$2`);
}
fs.writeFileSync(companionsTsPath, content, 'utf8');
console.log('✓ Updated src/lib/data/companions.ts with Cloudinary CDN URLs');

// 2. Update prisma/seed.ts if it has /companions/ paths
const seedTsPath = path.resolve(__dirname, '../prisma/seed.ts');
if (fs.existsSync(seedTsPath)) {
  let seedContent = fs.readFileSync(seedTsPath, 'utf8');
  for (const item of mappings) {
    const pattern = new RegExp(`(id:\\s*['"]${item.id}['"][\\s\\S]*?avatarUrl:\\s*['"])[^'"]+(['"][\\s\\S]*?blurredAvatarUrl:\\s*['"])[^'"]+(['"])`);
    seedContent = seedContent.replace(pattern, `$1${item.clearAvatarUrl}$2${item.blurredAvatarUrl}$3`);
  }
  fs.writeFileSync(seedTsPath, seedContent, 'utf8');
  console.log('✓ Updated prisma/seed.ts with Cloudinary CDN URLs');
}
