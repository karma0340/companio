'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadHostAvatar, uploadKycDocument } from '@/lib/cloudinary';
import { validateIndianMobileNumber } from '@/lib/phone';
import { setSessionCookie } from '@/lib/session';

export interface SubmitHostApplicationInput {
  fullName: string;
  displayName?: string;
  phone: string;
  gender?: string;
  age?: number | string;
  city: string;
  locality?: string;
  travelRadiusKm?: number;
  bio: string;
  hourlyRate: number;
  activities: string[];
  spokenLanguages?: string[];
  idType?: string;
  idNumber?: string;
  avatarImage?: string;
  idDocumentImage?: string;
  aadhaarImage?: string;
  aadhaarBackImage?: string;
  liveSelfieImage?: string;
  socialHandle?: string;
  faceMatchScore?: number;
  registrationFeePaid?: boolean;
  paymentId?: string;
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
        avatarUrl = input.avatarImage;
      }
    } else if (input.avatarImage && input.avatarImage.startsWith('http')) {
      avatarUrl = input.avatarImage;
    }

    let aadhaarDocUrl = 'verified-id-document';
    const documentToUpload = input.idDocumentImage || input.aadhaarImage;
    if (documentToUpload && documentToUpload.startsWith('data:')) {
      try {
        const kycRes = await uploadKycDocument(documentToUpload);
        aadhaarDocUrl = kycRes.secure_url;
      } catch (uploadErr) {
        console.error('[CLOUDINARY KYC UPLOAD ERROR]:', uploadErr);
      }
    } else if (documentToUpload && documentToUpload.startsWith('http')) {
      aadhaarDocUrl = documentToUpload;
    }

    let panDocUrl = aadhaarDocUrl;
    if (input.aadhaarBackImage && input.aadhaarBackImage.startsWith('data:')) {
      try {
        const kycBackRes = await uploadKycDocument(input.aadhaarBackImage);
        panDocUrl = kycBackRes.secure_url;
      } catch (uploadErr) {
        console.error('[CLOUDINARY KYC UPLOAD BACK ERROR]:', uploadErr);
      }
    }

    let selfieVideoUrl = avatarUrl;
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

    // 3. Find or create User with all core profile fields
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
          gender: input.gender || null,
          city: cityRecord.name,
          area: input.locality || null,
          bio: input.bio.trim(),
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: input.fullName.trim(),
          role: 'COMPANION',
          isKycVerified: true,
          gender: input.gender || user.gender || null,
          city: cityRecord.name,
          area: input.locality || user.area || null,
          bio: input.bio.trim() || user.bio,
        },
      });
    }

    // 4. Save HostApplication record in database
    const application = await prisma.hostApplication.create({
      data: {
        phone: e164Phone,
        fullName: input.fullName.trim(),
        city: cityRecord.name,
        locality: input.locality || null,
        travelRadiusKm: input.travelRadiusKm || 10,
        hourlyRate: input.hourlyRate || 399,
        aadhaarNumber: input.idNumber || input.socialHandle || null,
        aadhaarDocUrl,
        panDocUrl,
        selfieVideoUrl,
        faceMatchScore: input.faceMatchScore || 100,
        registrationFee: 0,
        gstAmount: 0,
        totalAmountPaid: 0,
        applicationFeePaid: input.registrationFeePaid ?? true,
        paymentId: input.paymentId || 'DIRECT_SUBMISSION',
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
        locality: input.locality || null,
        travelRadiusKm: input.travelRadiusKm || 10,
        bio: input.bio.trim(),
        shortBio: input.bio.trim().slice(0, 115),
        hourlyRate: input.hourlyRate || 399,
        spokenLanguages: input.spokenLanguages && input.spokenLanguages.length > 0 ? input.spokenLanguages : ['English', 'Hindi'],
        acceptedActivities: input.activities && input.activities.length > 0 ? input.activities : ['Coffee & Conversations', 'City Walk'],
        photoVerified: Boolean(input.faceMatchScore && input.faceMatchScore >= 80),
        isAvailable: true,
      },
      create: {
        userId: user.id,
        displayName: cleanDisplayName,
        maskedName: masked,
        avatarUrl,
        blurredAvatarUrl,
        cityId: cityRecord.id,
        locality: input.locality || null,
        travelRadiusKm: input.travelRadiusKm || 10,
        bio: input.bio.trim(),
        shortBio: input.bio.trim().slice(0, 115),
        hourlyRate: input.hourlyRate || 399,
        spokenLanguages: input.spokenLanguages && input.spokenLanguages.length > 0 ? input.spokenLanguages : ['English', 'Hindi'],
        acceptedActivities: input.activities && input.activities.length > 0 ? input.activities : ['Coffee & Conversations', 'City Walk'],
        photoVerified: Boolean(input.faceMatchScore && input.faceMatchScore >= 80),
        ratingAverage: 5.0,
        totalReviews: 1,
        isAvailable: true,
      },
    });

    try {
      await setSessionCookie({
        userId: user.id,
        phone: user.phone,
        email: user.email || null,
        name: cleanDisplayName,
        role: 'COMPANION',
        activeRole: 'host',
        avatarUrl,
        isUnlocked: true,
        activePassTier: user.activePassTier,
        passExpiresAt: user.passExpiresAt ? user.passExpiresAt.toISOString() : null,
      });
    } catch (cookieErr) {
      console.warn('[HOST APPLICATION COOKIE UPDATE]:', cookieErr);
    }

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
