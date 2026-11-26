const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Read .env file directly
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

const DELHI_COMPANIONS = [
  { id: 'tara-del', localFile: 'public/companions/girl11.jpg', name: 'Tara Sengupta' },
  { id: 'ishita-del', localFile: 'public/companions/girl12.jpg', name: 'Ishita Malhotra' },
  { id: 'zoya-del', localFile: 'public/companions/girl13.jpg', name: 'Zoya Qureshi' },
  { id: 'avani-del', localFile: 'public/companions/girl14.jpg', name: 'Avani Sharma' },
  { id: 'riddhi-del', localFile: 'public/companions/girl15.jpg', name: 'Riddhi Kapoor' },
];

async function uploadAll() {
  console.log(`[Cloudinary Upload] Uploading 5 Delhi companions to cloud "${cloud_name}"...`);
  const uploadedResults = [];

  for (const item of DELHI_COMPANIONS) {
    const fullPath = path.resolve(__dirname, '..', item.localFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`[File Missing] ${fullPath} not found!`);
      continue;
    }

    console.log(`Uploading ${item.name} (${item.id}) from ${item.localFile}...`);
    try {
      const uploadRes = await cloudinary.uploader.upload(fullPath, {
        folder: 'meetzy/companions',
        public_id: item.id,
        overwrite: true,
        resource_type: 'image',
        tags: ['meetzy', 'delhi-expansion', 'companion'],
      });

      const clearAvatarUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face/${uploadRes.public_id}.jpg`;
      const blurredAvatarUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/f_auto,q_auto,c_fill,w_800,h_1000,g_face,e_blur:1000/${uploadRes.public_id}.jpg`;

      console.log(`  ✓ Uploaded: ${uploadRes.public_id}`);
      console.log(`    Clear: ${clearAvatarUrl}`);

      uploadedResults.push({
        id: item.id,
        name: item.name,
        publicId: uploadRes.public_id,
        clearAvatarUrl,
        blurredAvatarUrl,
      });
    } catch (err) {
      console.error(`  ✗ Upload failed for ${item.id}:`, err.message);
    }
  }

  const outputPath = path.resolve(__dirname, 'delhi-companions-cloudinary-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedResults, null, 2), 'utf8');
  console.log(`\n[Finished] Uploaded ${uploadedResults.length}/5 companions. Saved to ${outputPath}`);
}

uploadAll();
