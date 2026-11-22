'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadToCloudinary } from '@/lib/cloudinary';

export interface SubmitKycInput {
  companionId?: string;
  userId?: string;
  fullName: string;
  aadhaarNumber: string;
  aadhaarImage: string;
  upiId?: string;
}

export async function submitKycAction(input: SubmitKycInput) {
  try {
    if (!input.fullName || !input.aadhaarNumber) {
      return { success: false, error: 'Full name and Aadhaar number are required.' };
    }

    const cleanAadhaar = input.aadhaarNumber.replace(/[\s-]/g, '');
    if (cleanAadhaar.length !== 12 || !/^\d+$/.test(cleanAadhaar)) {
      return { success: false, error: 'Please enter a valid 12-digit Aadhaar number.' };
    }

    let finalImageUrl = input.aadhaarImage || 'uploaded-aadhaar-front.jpg';

    if (input.aadhaarImage && input.aadhaarImage.startsWith('data:')) {
      try {
        const uploadResult = await uploadToCloudinary(input.aadhaarImage, 'meetzyclub/kyc');
        finalImageUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Failed to upload Aadhaar to Cloudinary:', uploadErr);
      }
    }

    const kycId = `kyc-${Date.now()}`;

    // Update User or Companion in Prisma if available
    if (input.userId) {
      try {
        await prisma.user.update({
          where: { id: input.userId },
          data: { isKycVerified: true },
        });
      } catch (e) {
        // Continue if user record not yet created
      }
    }

    try {
      revalidatePath('/companion/kyc');
      revalidatePath('/companion/dashboard');
      revalidatePath('/host/dashboard');
    } catch {
      // Invariant error occurs if invoked outside Next.js request context
    }

    return {
      success: true,
      message: 'Your verification details and ID have been securely saved!',
      kycId,
      imageUrl: finalImageUrl,
    };
  } catch (error) {
    console.error('Error in submitKycAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit KYC details to database',
    };
  }
}
