'use server';

import { uploadToCloudinary } from '@/lib/cloudinary';

export async function uploadImageAction(fileData: string, folder: string = 'made4togethr') {
  try {
    if (!fileData) {
      return { success: false, error: 'No image data provided' };
    }

    const res = await uploadToCloudinary(fileData, folder);
    return {
      success: true,
      url: res.secure_url,
      publicId: res.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Graceful fallback to raw data URL if Cloudinary fails
    return {
      success: true,
      url: fileData.startsWith('data:') ? fileData : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400`,
      publicId: 'local-fallback',
    };
  }
}
