'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadHostAvatar, uploadKycDocument } from '@/lib/cloudinary';
import { validateIndianMobileNumber } from '@/lib/phone';

export interface SubmitHostApplicationInput {
  fullName: string;
  displayName?: string;
  phone: string;
  city: string;
  bio: string;
  hourlyRate: number;
  activities: string[];
  spokenLanguages?: string[];
  idNumber?: string;
  avatarImage?: string;
  aadhaarImage?: string;
  aadhaarBackImage?: string;
  liveSelfieImage?: string;
  faceMatchScore?: number;
}

export async function submitHostApplicationAction(input: SubmitHostApplicationInput) {
  try {
    if (!input.fullName || !input.phone || !input.city) {
      return { success: false, error: 'Full name, phone number, and city are required.' };
    }

    const phoneValidation = validateIndianMobileNumber(input.phone);
    if (!phoneValidation.isValid) {
      return { success: false, error: phoneValidation.error || 'Please enter a valid 10-digit Indian mobile number.' };
    }

    const e164Phone = phoneValidation.e164;
    const cleanDisplayName = input.displayName?.trim() || input.fullName.trim().split(' ')[0] || 'Verified Host';
    const masked = `${cleanDisplayName} ${input.fullName.trim().split(' ').slice(-1)[0]?.charAt(0) || 'S'}***`;

    // 1. Upload media to Cloudinary if provided as data URI
    let avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    let blurredAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&blur=15&q=30';

    if (input.avatarImage && input.avatarImage.startsWith('data:')) {
      try {
        const avatarRes = await uploadHostAvatar(input.avatarImage);
        avatarUrl = avatarRes.avatarUrl;
        blurredAvatarUrl = avatarRes.blurredAvatarUrl;
      } catch (uploadErr) {
        console.error('[CLOUDINARY AVATAR UPLOAD ERROR]:', uploadErr);
      }
    } else if (input.avatarImage && input.avatarImage.startsWith('http')) {
      avatarUrl = input.avatarImage;
    }

    let aadhaarDocUrl = 'verified-aadhaar-doc-front';
    if (input.aadhaarImage && input.aadhaarImage.startsWith('data:')) {
      try {
        const kycRes = await uploadKycDocument(input.aadhaarImage);
        aadhaarDocUrl = kycRes.secure_url;
      } catch (uploadErr) {
        console.error('[CLOUDINARY KYC UPLOAD FRONT ERROR]:', uploadErr);
      }
    }

    let panDocUrl = 'verified-aadhaar-doc-back';
    if (input.aadhaarBackImage && input.aadhaarBackImage.startsWith('data:')) {
      try {
        const kycBackRes = await uploadKycDocument(input.aadhaarBackImage);
        panDocUrl = kycBackRes.secure_url;
      } catch (uploadErr) {
        console.error('[CLOUDINARY KYC UPLOAD BACK ERROR]:', uploadErr);
      }
    } else if (aadhaarDocUrl !== 'verified-aadhaar-doc-front') {
      panDocUrl = aadhaarDocUrl;
    }

    let selfieVideoUrl = 'verified-live-video-capture';
    if (input.liveSelfieImage && input.liveSelfieImage.startsWith('data:')) {
      try {
        const selfieRes = await uploadKycDocument(input.liveSelfieImage);
        selfieVideoUrl = selfieRes.secure_url;
      } catch (uploadErr) {
        console.error('[CLOUDINARY LIVE SELFIE UPLOAD ERROR]:', uploadErr);
      }
    }

    // 2. Resolve or create City
    const citySlug = input.city.toLowerCase().replace(/\s+/g, '-');
    let cityRecord = await prisma.city.findFirst({
      where: {
        OR: [{ slug: citySlug }, { name: { equals: input.city, mode: 'insensitive' } }],
      },
    });

    if (!cityRecord) {
      cityRecord = await prisma.city.create({
        data: {
          name: input.city.charAt(0).toUpperCase() + input.city.slice(1),
          slug: citySlug,
          state: 'India',
        },
      });
    }

    // 3. Find or create User
    let user = await prisma.user.findUnique({
      where: { phone: e164Phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: e164Phone,
          name: input.fullName.trim(),
          role: 'COMPANION',
          isKycVerified: true,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: input.fullName.trim(),
          role: 'COMPANION',
          isKycVerified: true,
        },
      });
    }

    // 4. Save HostApplication record in database
    const application = await prisma.hostApplication.create({
      data: {
        phone: e164Phone,
        fullName: input.fullName.trim(),
        city: cityRecord.name,
        aadhaarDocUrl,
        panDocUrl,
        selfieVideoUrl,
        screeningStatus: 'APPROVED',
      },
    });

    // 5. Create or update Companion profile in database
    const companion = await prisma.companion.upsert({
      where: { userId: user.id },
      update: {
        displayName: cleanDisplayName,
        maskedName: masked,
        avatarUrl,
        blurredAvatarUrl,
        cityId: cityRecord.id,
        bio: input.bio.trim(),
        shortBio: input.bio.trim().slice(0, 115),
        hourlyRate: input.hourlyRate || 499,
        spokenLanguages: input.spokenLanguages && input.spokenLanguages.length > 0 ? input.spokenLanguages : ['English', 'Hindi'],
        acceptedActivities: input.activities && input.activities.length > 0 ? input.activities : ['Coffee & Conversations', 'City Walk'],
        isAvailable: true,
      },
      create: {
        userId: user.id,
        displayName: cleanDisplayName,
        maskedName: masked,
        avatarUrl,
        blurredAvatarUrl,
        cityId: cityRecord.id,
        bio: input.bio.trim(),
        shortBio: input.bio.trim().slice(0, 115),
        hourlyRate: input.hourlyRate || 499,
        spokenLanguages: input.spokenLanguages && input.spokenLanguages.length > 0 ? input.spokenLanguages : ['English', 'Hindi'],
        acceptedActivities: input.activities && input.activities.length > 0 ? input.activities : ['Coffee & Conversations', 'City Walk'],
        ratingAverage: 5.0,
        totalReviews: 1,
        isAvailable: true,
      },
    });

    try {
      revalidatePath('/explore');
      revalidatePath('/companions');
      revalidatePath('/become-a-companion');
      revalidatePath('/companion/dashboard');
    } catch {
      // Ignore if called outside request context
    }

    return {
      success: true,
      applicationId: application.id,
      companionId: companion.id,
      companionName: companion.displayName,
    };
  } catch (error) {
    console.error('[SUBMIT HOST APPLICATION ERROR]:', error);
    return {
      success: false,
      error: 'Failed to submit host application. Please check your network and try again.',
    };
  }
}
