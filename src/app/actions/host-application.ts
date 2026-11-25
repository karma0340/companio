'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadHostAvatar } from '@/lib/cloudinary';
import { getSession, setSessionCookie } from '@/lib/session';
import { HOST_REGISTRATION_FEE } from '@/lib/data';
import { HostPackTier } from '@/types';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { creditCoins } from '@/lib/wallet';
import { CoinTransactionType } from '@prisma/client';

export interface SubmitHostApplicationInput {
  fullName: string;
  displayName?: string;
  phone?: string;
  gender?: string;
  age?: number | string;
  city: string;
  locality?: string;
  travelRadiusKm?: number;
  bio: string;
  hourlyRate: number;
  activities: string[];
  spokenLanguages?: string[];
  availabilitySlots?: string[];
  preferredVenues?: string[];
  packTier?: HostPackTier;
  avatarImage?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export async function submitHostApplicationAction(input: SubmitHostApplicationInput) {
  try {
    const session = await getSession();
    if (!session?.userId || !session?.phone) {
      return {
        success: false,
        error: 'Please sign in and verify your mobile number via SMS OTP before applying.',
      };
    }

    if (!input.fullName?.trim() || !input.city?.trim()) {
      return { success: false, error: 'Full name and city are required.' };
    }

    const numericAge = parseInt(String(input.age || '24'), 10);
    if (isNaN(numericAge) || numericAge < 18 || numericAge > 70) {
      return { success: false, error: 'Hosts must be between 18 and 70 years old.' };
    }

    const packTier: HostPackTier = HOST_REGISTRATION_FEE.tier;
    const packOption = {
      tier: HOST_REGISTRATION_FEE.tier,
      name: HOST_REGISTRATION_FEE.name,
      basePrice: HOST_REGISTRATION_FEE.basePrice,
      taxesAndCharges: HOST_REGISTRATION_FEE.taxesAndCharges,
      price: HOST_REGISTRATION_FEE.totalPrice,
      durationDays: HOST_REGISTRATION_FEE.durationDays,
      promoCoins: HOST_REGISTRATION_FEE.promoCoins,
    };

    // Verify Razorpay signature for host package checkout
    const orderId = String(input.razorpayOrderId || '');
    const paymentId = String(input.razorpayPaymentId || '');
    if (!paymentId) {
      return {
        success: false,
        error: 'Host package payment is required to publish your companion profile.',
      };
    }

    const sigCheck = verifyRazorpaySignature(orderId, paymentId, input.razorpaySignature);
    if (!sigCheck.isValid) {
      return {
        success: false,
        error: sigCheck.reason || 'Payment verification failed. Please retry payment.',
      };
    }

    const cleanDisplayName =
      input.displayName?.trim() || input.fullName.trim().split(' ')[0] || 'Verified Host';
    const lastInitial = input.fullName.trim().split(' ').slice(-1)[0]?.charAt(0) || 'H';
    const masked = `${cleanDisplayName} ${lastInitial}***`;

    // Upload avatar to Cloudinary if configured, else retain data URL / uploaded URL
    let avatarUrl =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    let blurredAvatarUrl = avatarUrl;

    if (input.avatarImage && input.avatarImage.startsWith('data:')) {
      try {
        const avatarRes = await uploadHostAvatar(input.avatarImage);
        avatarUrl = avatarRes.avatarUrl;
        blurredAvatarUrl = avatarRes.blurredAvatarUrl;
      } catch (uploadErr) {
        console.warn('[CLOUDINARY AVATAR FALLBACK]:', uploadErr);
        avatarUrl = input.avatarImage;
        blurredAvatarUrl = input.avatarImage;
      }
    } else if (input.avatarImage && input.avatarImage.startsWith('http')) {
      avatarUrl = input.avatarImage;
      blurredAvatarUrl = input.avatarImage;
    }

    // Resolve or create City
    const citySlug = input.city.toLowerCase().trim().replace(/\s+/g, '-');
    let cityRecord = await prisma.city.findFirst({
      where: {
        OR: [{ slug: citySlug }, { name: { equals: input.city.trim(), mode: 'insensitive' } }],
      },
    });

    if (!cityRecord) {
      cityRecord = await prisma.city.create({
        data: {
          name: input.city.trim().charAt(0).toUpperCase() + input.city.trim().slice(1),
          slug: citySlug,
          state: 'India',
        },
      });
    }

    // Locate the authenticated user record (never create or hijack another phone's account)
    const existingUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { companion: true },
    });

    if (!existingUser) {
      return {
        success: false,
        error: 'Your session account could not be found. Please sign in again.',
      };
    }

    const preservedMemberName =
      existingUser.name && existingUser.name !== 'Member'
        ? existingUser.name
        : input.fullName.trim();

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: preservedMemberName,
        role: 'COMPANION',
        isKycVerified: true,
        onboardingCompleted: true,
        gender: existingUser.gender || input.gender || 'female',
        city: existingUser.city || cityRecord.slug,
        area: existingUser.area || input.locality?.trim() || null,
      },
    });

    const packExpiresAt = new Date(Date.now() + packOption.durationDays * 24 * 60 * 60 * 1000);
    const availabilitySlots =
      input.availabilitySlots && input.availabilitySlots.length > 0
        ? input.availabilitySlots
        : ['Weekdays (Mon-Fri)', 'Weekends (Sat-Sun)'];
    const preferredVenues =
      input.preferredVenues && input.preferredVenues.length > 0
        ? input.preferredVenues
        : ['Artisan Coffee Shops', 'Open Promenades & Parks'];

    const safeRate = Math.min(1299, Math.max(399, Number(input.hourlyRate) || 499));
    const spokenLanguages =
      input.spokenLanguages && input.spokenLanguages.length > 0
        ? input.spokenLanguages
        : ['English', 'Hindi'];
    const acceptedActivities =
      input.activities && input.activities.length > 0
        ? input.activities
        : ['Coffee & Conversations', 'City Walk'];

    // Save HostApplication record
    const application = await prisma.hostApplication.create({
      data: {
        phone: existingUser.phone || input.phone || '',
        fullName: input.fullName.trim(),
        city: cityRecord.name,
        locality: input.locality?.trim() || null,
        travelRadiusKm: input.travelRadiusKm || 10,
        hourlyRate: safeRate,
        platonicAgreed: true,
        safetyPledgeAgreed: true,
        availabilitySlots,
        preferredVenues,
        packTier: packOption.tier,
        razorpayOrderId: orderId || null,
        razorpayPaymentId: paymentId,
        selfieVideoUrl: avatarUrl,
        registrationFee: packOption.basePrice,
        gstAmount: packOption.taxesAndCharges,
        totalAmountPaid: packOption.price,
        applicationFeePaid: true,
        paymentId,
        screeningStatus: 'APPROVED',
      },
    });

    // Upsert Companion profile
    const companion = await prisma.companion.upsert({
      where: { userId: existingUser.id },
      update: {
        displayName: cleanDisplayName,
        maskedName: masked,
        age: numericAge,
        gender: input.gender || 'female',
        avatarUrl,
        blurredAvatarUrl,
        cityId: cityRecord.id,
        locality: input.locality?.trim() || null,
        travelRadiusKm: input.travelRadiusKm || 10,
        bio: input.bio.trim(),
        shortBio: input.bio.trim().slice(0, 115),
        hourlyRate: safeRate,
        spokenLanguages,
        acceptedActivities,
        availabilitySlots,
        preferredVenues,
        hostPackTier: packOption.tier,
        hostPackExpiresAt: packExpiresAt,
        photoVerified: true,
        isAvailable: true,
      },
      create: {
        userId: existingUser.id,
        displayName: cleanDisplayName,
        maskedName: masked,
        age: numericAge,
        gender: input.gender || 'female',
        avatarUrl,
        blurredAvatarUrl,
        cityId: cityRecord.id,
        locality: input.locality?.trim() || null,
        travelRadiusKm: input.travelRadiusKm || 10,
        bio: input.bio.trim(),
        shortBio: input.bio.trim().slice(0, 115),
        hourlyRate: safeRate,
        spokenLanguages,
        acceptedActivities,
        availabilitySlots,
        preferredVenues,
        hostPackTier: packOption.tier,
        hostPackExpiresAt: packExpiresAt,
        photoVerified: true,
        ratingAverage: 5.0,
        totalReviews: 0,
        completedMeetups: 0,
        isAvailable: true,
      },
    });

    // Record financial transaction & promo coins for Host Registration (99.50 + 13.50 taxes = 113 INR)
    await prisma.transaction.create({
      data: {
        userId: existingUser.id,
        type: 'HOST_REGISTRATION',
        amount: packOption.price,
        feeAmount: packOption.taxesAndCharges,
        netAmount: packOption.basePrice,
        gateway: 'RAZORPAY',
        gatewayTransactionId: paymentId,
        status: 'SUCCESS',
      },
    }).catch((err) => console.warn('[HOST TX WARN]:', err));

    if (packOption.promoCoins > 0) {
      const existingPromo = await prisma.coinTransaction.findFirst({
        where: { userId: existingUser.id, referenceId: `host_pack_${paymentId}` },
      });
      if (!existingPromo) {
        await creditCoins({
          userId: existingUser.id,
          amount: packOption.promoCoins,
          type: CoinTransactionType.TOPUP_BONUS,
          description: `${packOption.name} welcome bonus (+${packOption.promoCoins} Coins)`,
          referenceId: `host_pack_${paymentId}`,
        }).catch((err) => console.warn('[HOST PROMO COINS WARN]:', err));
      }
    }

    await setSessionCookie({
      userId: updatedUser.id,
      phone: updatedUser.phone || '',
      email: updatedUser.email || null,
      name: updatedUser.name || cleanDisplayName,
      role: 'COMPANION',
      activeRole: 'host',
      avatarUrl,
      isUnlocked: Boolean(updatedUser.isUnlocked),
      activePassTier: updatedUser.activePassTier,
      passExpiresAt: updatedUser.passExpiresAt ? updatedUser.passExpiresAt.toISOString() : null,
    });

    try {
      revalidatePath('/explore');
      revalidatePath('/companions');
      revalidatePath('/become-a-companion');
      revalidatePath('/companion/dashboard');
    } catch {}

    return {
      success: true,
      applicationId: application.id,
      companionId: companion.id,
      companionName: companion.displayName,
      packName: packOption.name,
    };
  } catch (error) {
    console.error('[SUBMIT HOST APPLICATION ERROR]:', error);
    return {
      success: false,
      error: 'Failed to submit host application. Please check your details and try again.',
    };
  }
}
