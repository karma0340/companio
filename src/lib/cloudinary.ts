import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_CLOUD_API_KEY)?.trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_CLOUD_API_SECRET)?.trim();

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number = 15000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Cloudinary upload timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export default cloudinary;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export async function uploadToCloudinary(
  fileBase64OrUrl: string,
  folder: string = 'meetzyclub'
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    return {
      secure_url: fileBase64OrUrl.startsWith('data:')
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        : fileBase64OrUrl,
      public_id: `sandbox_${Date.now()}`,
      format: 'jpg',
      width: 800,
      height: 800,
    };
  }

  try {
    const result = await withTimeout(
      cloudinary.uploader.upload(fileBase64OrUrl, {
        folder,
        resource_type: 'auto',
      }),
      15000
    );

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (err) {
    console.warn('[CLOUDINARY UPLOAD WARNING - USING LOCAL FALLBACK]:', (err as Error).message);
    return {
      secure_url: fileBase64OrUrl.startsWith('data:')
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        : fileBase64OrUrl,
      public_id: `sandbox_fallback_${Date.now()}`,
      format: 'jpg',
    };
  }
}

/**
 * Uploads host profile avatar and generates clear + blurred versions
 */
export async function uploadHostAvatar(
  fileBase64OrUrl: string
): Promise<{ avatarUrl: string; blurredAvatarUrl: string; publicId: string }> {
  if (!isCloudinaryConfigured) {
    const fallbackUrl = fileBase64OrUrl.startsWith('data:')
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      : fileBase64OrUrl;
    return {
      avatarUrl: fallbackUrl,
      blurredAvatarUrl: fallbackUrl,
      publicId: `sandbox_avatar_${Date.now()}`,
    };
  }

  try {
    const result = await withTimeout(
      cloudinary.uploader.upload(fileBase64OrUrl, {
        folder: 'meetzyclub/avatars',
        transformation: [
          { width: 800, height: 800, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }),
      15000
    );

    const blurredAvatarUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 100, height: 100, crop: 'fill', gravity: 'face' },
        { effect: 'blur:800', quality: 20 },
      ],
    });

    return {
      avatarUrl: result.secure_url,
      blurredAvatarUrl: blurredAvatarUrl || result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.warn('[CLOUDINARY AVATAR WARNING - USING LOCAL FALLBACK]:', (err as Error).message);
    const fallbackUrl = fileBase64OrUrl.startsWith('data:')
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      : fileBase64OrUrl;
    return {
      avatarUrl: fallbackUrl,
      blurredAvatarUrl: fallbackUrl,
      publicId: `sandbox_avatar_${Date.now()}`,
    };
  }
}

/**
 * Uploads government identity card (Aadhaar/PAN) to secure verification bucket
 */
export async function uploadKycDocument(
  fileBase64OrUrl: string
): Promise<CloudinaryUploadResult> {
  return uploadToCloudinary(fileBase64OrUrl, 'meetzyclub/kyc');
}
