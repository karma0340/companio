import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'da9c3vejh',
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY || '136395137633638',
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET || 'xTSYaEQDh9J5mlkwdD-igOSMnhM',
  secure: true,
});

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
  folder: string = 'companio'
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(fileBase64OrUrl, {
    folder,
    resource_type: 'auto',
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}
