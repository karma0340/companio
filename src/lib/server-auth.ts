import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { User, MemberProfile, HostProfile } from "@/lib/store/useAppStore";

export interface InitialAuthSnapshot {
  authenticated: boolean;
  user: User | null;
  memberProfile: MemberProfile | null;
  hostProfile: HostProfile | null;
  activeRole: "member" | "host";
}

export async function getInitialAuthSnapshot(): Promise<InitialAuthSnapshot> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        authenticated: false,
        user: null,
        memberProfile: null,
        hostProfile: null,
        activeRole: "member",
      };
    }

    const cleanSessionPhone = session.phone ? session.phone.replace(/[\s-]/g, "") : "";
    const e164SessionPhone = cleanSessionPhone
      ? cleanSessionPhone.startsWith("+91")
        ? cleanSessionPhone
        : `+91${cleanSessionPhone}`
      : "";

    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          companion: {
            include: { city: true },
          },
          passes: {
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (!dbUser && e164SessionPhone) {
        dbUser = await prisma.user.findUnique({
          where: { phone: e164SessionPhone },
          include: {
            companion: {
              include: { city: true },
            },
            passes: {
              where: { status: "ACTIVE" },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });
      }
    } catch (dbErr) {
      console.warn("[SERVER AUTH DB LOOKUP]:", (dbErr as Error).message);
    }

    let hostProfile: HostProfile | null = null;
    let memberProfile: MemberProfile = {
      id: session.userId,
      fullName: session.name || "Member",
      phone: session.phone || "",
      city: "bengaluru",
      gender: undefined,
      onboardingCompleted: false,
    };

    const resolvedRole = dbUser?.role || session.role || "MEMBER";
    const resolvedActiveRole: "member" | "host" =
      session.activeRole === "host" && (dbUser?.companion || resolvedRole === "COMPANION")
        ? "host"
        : resolvedRole === "COMPANION"
        ? "host"
        : "member";

    let userDetails: User;

    if (dbUser) {
      const latestPass = dbUser.passes?.[0];
      const isPassValid =
        latestPass &&
        (!latestPass.validUntil || new Date(latestPass.validUntil) > new Date());
      const isUserUnlocked = Boolean(dbUser.isUnlocked) || Boolean(isPassValid);

      const resolvedName = dbUser.name || session.name || "Member";
      const resolvedPhone = dbUser.phone || "";
      const resolvedCity = dbUser.city || dbUser.companion?.city?.slug || "bengaluru";
      const resolvedArea = dbUser.area || dbUser.companion?.locality || "";
      const resolvedBio = dbUser.bio || dbUser.companion?.bio || "";
      const resolvedGender = dbUser.gender || dbUser.companion?.gender || undefined;
      const isMemberCompleted = Boolean(dbUser.onboardingCompleted && resolvedGender);

      userDetails = {
        id: dbUser.id,
        phone: resolvedPhone,
        email: dbUser.email,
        name: resolvedName,
        avatarUrl: dbUser.companion?.avatarUrl || dbUser.avatarUrl || null,
        role: resolvedRole,
        activeRole: resolvedActiveRole,
        accountStatus: "active",
        isUnlocked: isUserUnlocked,
        activePassTier: isUserUnlocked
          ? dbUser.activePassTier || (latestPass ? String(latestPass.tier) : "ONE_MONTH")
          : null,
        passExpiresAt: (latestPass?.validUntil || dbUser.passExpiresAt)?.toISOString?.() || null,
        walletBalance: Number(dbUser.walletBalance || 0),
        coinBalance: dbUser.coinBalance ?? 100,
        creditBalance: Number(dbUser.creditBalance ?? 100),
        referralCode: dbUser.referralCode,
        city: resolvedCity,
        area: resolvedArea,
        bio: resolvedBio,
        gender: resolvedGender,
        emergencyContact: dbUser.emergencyContact || "",
        onboardingCompleted: isMemberCompleted,
      };

      if (dbUser.companion) {
        const c = dbUser.companion;
        hostProfile = {
          id: c.id,
          userId: dbUser.id,
          displayName: c.displayName,
          age: c.age,
          gender: c.gender || dbUser.gender || undefined,
          city: c.city?.name || "Bengaluru",
          citySlug: c.city?.slug || resolvedCity,
          locality: c.locality || "",
          bio: c.bio || "",
          travelRadiusKm: c.travelRadiusKm || 10,
          hostLevel: c.hostLevel || "NEW",
          completedMeetups: c.completedMeetups || 0,
          ratingAverage: c.ratingAverage || 5.0,
          totalReviews: c.totalReviews || 0,
          hourlyRate: Number(c.hourlyRate),
          spokenLanguages: Array.isArray(c.spokenLanguages) ? c.spokenLanguages : [],
          acceptedActivities: Array.isArray(c.acceptedActivities) ? c.acceptedActivities : [],
          availabilitySlots: Array.isArray(c.availabilitySlots) ? c.availabilitySlots : [],
          preferredVenues: Array.isArray(c.preferredVenues) ? c.preferredVenues : [],
          hostPackTier: c.hostPackTier || null,
          hostPackExpiresAt: c.hostPackExpiresAt?.toISOString?.() || null,
          upiId: c.upiId || "",
          avatarUrl: c.avatarUrl,
          verificationStatus: "approved",
          isFreeToday: c.isAvailable,
          photoVerified: c.photoVerified,
          walletBalance: Number(dbUser.walletBalance || 0),
        };
      }

      memberProfile = {
        id: dbUser.id,
        fullName: resolvedName,
        phone: resolvedPhone,
        gender: resolvedGender,
        city: resolvedCity,
        area: resolvedArea,
        bio: resolvedBio,
        avatarUrl: dbUser.avatarUrl || undefined,
        emergencyContact: dbUser.emergencyContact || "",
        onboardingCompleted: isMemberCompleted,
      };
    } else {
      userDetails = {
        id: session.userId,
        phone: session.phone || "",
        email: session.email || null,
        name: session.name || "Member",
        avatarUrl: session.avatarUrl || null,
        role: session.role,
        activeRole: resolvedActiveRole,
        accountStatus: "active",
        isUnlocked: session.isUnlocked,
        activePassTier: session.activePassTier || null,
        passExpiresAt: session.passExpiresAt || null,
        walletBalance: 0,
        coinBalance: 100,
        creditBalance: 100,
        referralCode: null,
      };
    }

    const lookupPhone = userDetails.phone || e164SessionPhone;
    if (!hostProfile && lookupPhone) {
      try {
        const hostApp = await prisma.hostApplication.findFirst({
          where: { phone: lookupPhone },
          orderBy: { createdAt: "desc" },
        });
        if (hostApp) {
          hostProfile = {
            id: hostApp.id,
            userId: userDetails.id,
            displayName: hostApp.fullName,
            city: hostApp.city,
            locality: hostApp.locality || "",
            travelRadiusKm: hostApp.travelRadiusKm || 10,
            hourlyRate: Number(hostApp.hourlyRate || 499),
            availabilitySlots: Array.isArray(hostApp.availabilitySlots) ? hostApp.availabilitySlots : [],
            preferredVenues: Array.isArray(hostApp.preferredVenues) ? hostApp.preferredVenues : [],
            hostPackTier: hostApp.packTier || null,
            avatarUrl: hostApp.selfieVideoUrl || undefined,
            verificationStatus:
              hostApp.screeningStatus.toLowerCase() === "approved" ? "approved" : "pending",
            isFreeToday: false,
            photoVerified: Boolean(hostApp.faceMatchScore && hostApp.faceMatchScore >= 80),
            walletBalance: Number(userDetails.walletBalance || 0),
          };
        }
      } catch (appErr) {
        console.warn("[SERVER AUTH HOSTAPP WARN]:", (appErr as Error).message);
      }
    }

    return {
      authenticated: true,
      user: userDetails,
      memberProfile,
      hostProfile,
      activeRole: resolvedActiveRole,
    };
  } catch (err) {
    if ((err as { digest?: string })?.digest !== "DYNAMIC_SERVER_USAGE") {
      console.warn("[GET INITIAL AUTH SNAPSHOT ERROR]:", err);
    }
    return {
      authenticated: false,
      user: null,
      memberProfile: null,
      hostProfile: null,
      activeRole: "member",
    };
  }
}
