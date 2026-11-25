"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { validateIndianMobileNumber } from "@/lib/phone";
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Upload,
  Lock,
  Trash2,
  Check,
  Phone,
  Loader2,
  Wallet,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { submitHostApplicationAction } from "@/app/actions/host-application";
import { useAuth } from "@/context/auth-context";
import { CITIES } from "@/lib/data/cities";
import { HOST_REGISTRATION_FEE } from "@/lib/data";
import { HostPackTier } from "@/types";
import { openRazorpayCheckout } from "@/lib/payments/razorpay";
import { useToast } from "@/components/ui/toast";
import { useWebOtp } from "@/hooks/use-web-otp";
import { triggerCelebration } from "@/components/ui/celebration";

function compressImage(file: File, maxDim: number = 1280, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function CompanionApplyForm() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const { user, hostProfile, isAuthenticated, isLoading: authLoading, refreshSession } = useAuth();

  const urlPack = (searchParams.get("pack") || "").toUpperCase() as HostPackTier;
  const initialPack: HostPackTier =
    urlPack === "STARTER" || urlPack === "ELITE" ? urlPack : "PRO";

  // Inline OTP Gate state for unauthenticated visitors
  const [authPhone, setAuthPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [applicationRef, setApplicationRef] = useState<string>("");
  const [confirmedPackName, setConfirmedPackName] = useState<string>("Pro Host Pack");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "female",
    phone: "",
    city: "Chandigarh",
    locality: "",
    travelRadiusKm: 10,
    age: "",
    displayName: "",
    bio: "",
    hourlyRate: "499",
    languages: "English, Hindi, Punjabi",
    activities: ["Coffee & Conversations", "Cafe Hopping"],
    availability: ["Weekdays (Mon-Fri)", "Weekends (Sat-Sun)"],
    preferredVenues: ["Artisan Coffee Shops", "Open Promenades & Parks"],
    packTier: initialPack as HostPackTier,
    agreePublicOnly: true,
    agreePlatonic: true,
    agreeEscrowPin: true,
    agreeTerms: true,
  });

  const [avatarBase64, setAvatarBase64] = useState<string>("");
  const [avatarFileName, setAvatarFileName] = useState<string>("");
  const [isAvatarProcessing, setIsAvatarProcessing] = useState<boolean>(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Pre-fill verified phone and existing profile values from authenticated session
  useEffect(() => {
    const sessionPhone = user?.phone || "";
    if (sessionPhone) {
      const cleanDigits = sessionPhone.replace(/\D/g, "").slice(-10);
      setFormData((prev) => ({
        ...prev,
        phone: cleanDigits,
      }));
    }

    if (user?.name && user.name.toLowerCase() !== "member") {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        displayName: prev.displayName || hostProfile?.displayName || user.name?.split(" ")[0] || "",
      }));
    }

    if (hostProfile?.avatarUrl && !avatarBase64) {
      setAvatarBase64(hostProfile.avatarUrl);
      setAvatarFileName("current-avatar.jpg");
    }
  }, [user, hostProfile, avatarBase64]);

  const handleSendAuthOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const validation = validateIndianMobileNumber(authPhone);
    if (!validation.isValid) {
      setAuthError(validation.error || "Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: validation.e164 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Could not dispatch SMS OTP. Please retry.");
        return;
      }
      setOtpSent(true);
      setResendCooldown(60);
      toast.success(`6-digit OTP sent via SMS to +91 ${validation.formatted}`, "OTP Sent");
    } catch {
      setAuthError("Network error sending SMS code. Please check your connection.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtpValue = async (cleanCode: string) => {
    setAuthError(null);
    if (cleanCode.length !== 6) {
      setAuthError("Please enter the 6-digit SMS code.");
      return;
    }

    const validation = validateIndianMobileNumber(authPhone);
    if (!validation.isValid) {
      setAuthError("Invalid mobile number.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: validation.e164,
          code: cleanCode,
          intent: "host",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Incorrect OTP. Please try again.");
        return;
      }
      await refreshSession();
      triggerCelebration("Mobile Verified! +100 Bonus Coins");
      toast.success("Mobile number verified! Continue with your Host Profile.", "Verified");
    } catch {
      setAuthError("Verification error. Please retry.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  useWebOtp({
    enabled: !isAuthenticated && otpSent && !isVerifyingOtp,
    onCode: (autoCode) => {
      setOtpCode(autoCode);
      verifyOtpValue(autoCode);
    },
  });

  const handleVerifyAuthOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtpValue(otpCode.trim());
  };

  const handleActivityToggle = (act: string) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(act);
      return {
        ...prev,
        activities: exists ? prev.activities.filter((a) => a !== act) : [...prev.activities, act],
      };
    });
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAvatarProcessing(true);
    setAvatarFileName(file.name);
    try {
      const compressed = await compressImage(file, 800, 0.85);
      setAvatarBase64(compressed);
      setErrorMessage(null);
    } catch {
      const reader = new FileReader();
      reader.onload = (readEvt) => {
        if (readEvt.target?.result) {
          setAvatarBase64(readEvt.target.result as string);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsAvatarProcessing(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAvailabilityToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.availability.includes(item);
      return {
        ...prev,
        availability: exists ? prev.availability.filter((a) => a !== item) : [...prev.availability, item],
      };
    });
  };

  const handleVenueToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.preferredVenues.includes(item);
      return {
        ...prev,
        preferredVenues: exists
          ? prev.preferredVenues.filter((v) => v !== item)
          : [...prev.preferredVenues, item],
      };
    });
  };

  const phoneDigits = formData.phone.replace(/\D/g, "");
  const ageNum = parseInt(formData.age, 10);
  const hourlyNum = Math.min(1299, Math.max(399, parseInt(formData.hourlyRate, 10) || 499));
  const selectedPack = {
    tier: HOST_REGISTRATION_FEE.tier,
    name: HOST_REGISTRATION_FEE.name,
    basePrice: HOST_REGISTRATION_FEE.basePrice,
    taxesAndCharges: HOST_REGISTRATION_FEE.taxesAndCharges,
    price: HOST_REGISTRATION_FEE.totalPrice,
    durationLabel: HOST_REGISTRATION_FEE.durationLabel,
    promoCoins: HOST_REGISTRATION_FEE.promoCoins,
  };
  const hostHourlyNet70 = Math.round(hourlyNum * 0.70);
  const platformFee30 = Math.round(hourlyNum * 0.30);

  const isStep1Valid = Boolean(
    formData.fullName.trim().length >= 2 &&
      phoneDigits.length === 10 &&
      formData.gender &&
      formData.city &&
      formData.age &&
      !isNaN(ageNum) &&
      ageNum >= 18 &&
      ageNum <= 70
  );

  const isStep2Valid = Boolean(
    formData.displayName.trim().length >= 2 &&
      Boolean(avatarBase64) &&
      formData.hourlyRate &&
      formData.languages.trim().length > 0 &&
      formData.activities.length > 0 &&
      formData.bio.trim().length >= 15
  );

  const isStep3Valid = Boolean(
    formData.availability.length > 0 &&
      formData.preferredVenues.length > 0 &&
      formData.agreePublicOnly &&
      formData.agreePlatonic &&
      formData.agreeEscrowPin &&
      formData.agreeTerms
  );

  const canProceed = step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : isStep3Valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (step === 1) {
      if (!isStep1Valid) {
        setErrorMessage("Please enter your full legal name and valid age (18+).");
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (step === 2) {
      if (!isStep2Valid) {
        setErrorMessage("Please complete your display name, headshot photo, activities, and bio (15+ chars).");
        return;
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (step === 3) {
      if (!isStep3Valid) {
        setErrorMessage("Please select availability, preferred venues, and accept all 4 safety pledges.");
        return;
      }

      setIsSubmitting(true);
      try {
        // 1. Create Razorpay Order for selected Host Pack
        const orderRes = await fetch("/api/host/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packTier: selectedPack.tier }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          throw new Error(orderData.error || "Failed to initialize Host Package payment.");
        }

        // 2. Open Razorpay Checkout Modal
        await openRazorpayCheckout({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Meetzy Club Host Portal",
          description: `${selectedPack.name} (${selectedPack.durationLabel})`,
          order_id: orderData.orderId,
          prefill: {
            name: formData.fullName.trim(),
            contact: `+91${phoneDigits}`,
          },
          theme: { color: "#141414" },
          handler: async (paymentResponse) => {
            try {
              const res = await submitHostApplicationAction({
                fullName: formData.fullName.trim(),
                displayName: formData.displayName.trim(),
                phone: user?.phone || `+91${phoneDigits}`,
                gender: formData.gender,
                age: ageNum,
                city: formData.city,
                locality: formData.locality.trim() || undefined,
                travelRadiusKm: Number(formData.travelRadiusKm) || 10,
                bio: formData.bio.trim(),
                hourlyRate: hourlyNum,
                activities: formData.activities,
                spokenLanguages: formData.languages
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                availabilitySlots: formData.availability,
                preferredVenues: formData.preferredVenues,
                packTier: selectedPack.tier,
                avatarImage: avatarBase64 || undefined,
                razorpayOrderId: paymentResponse.razorpay_order_id || orderData.orderId,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              });

              if (res.success) {
                setApplicationRef(res.applicationId || "HST-2026-REG");
                setConfirmedPackName(res.packName || selectedPack.name);
                setIsSubmitted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
                triggerCelebration("Host Profile Live on Meetzy Club!");
                await refreshSession();
                toast.success(`${selectedPack.name} activated!`, "Host Profile Live");
              } else {
                setErrorMessage(res.error || "Failed to activate host profile.");
              }
            } catch {
              setErrorMessage("Error saving host profile after payment.");
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
        });
      } catch (err) {
        console.error("[HOST APPLICATION SUBMIT ERROR]:", err);
        setErrorMessage((err as Error).message || "Payment initiation failed. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const AVAILABLE_ACTIVITIES = [
    "Coffee & Conversations",
    "Cafe Hopping",
    "Gym Buddy",
    "Live Events & Concerts",
    "Museum Visit",
    "Book Cafes",
    "Morning Run",
    "Food Walks",
    "Shopping & Styling",
    "City Walk",
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Link
            href="/become-a-companion"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-ink hover:underline tracking-tight"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Host Packages Overview</span>
          </Link>

          {/* MANDATORY OTP VERIFICATION GATE FOR LOGGED-OUT VISITORS */}
          {authLoading ? (
            <div className="border-brutal shadow-brutal bg-white p-10 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-ink" />
              <p className="text-xs font-black uppercase text-ink">Checking verified session...</p>
            </div>
          ) : !isAuthenticated ? (
            <div className="border-brutal shadow-brutal-lg bg-white p-6 sm:p-10 space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 border-2 border-ink bg-sunny px-3 py-1 text-xs font-black uppercase">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Step 0 &middot; Mobile OTP Verification</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                  Verify Your Mobile Number First
                </h1>
                <p className="text-xs sm:text-sm font-medium text-ink-soft leading-relaxed">
                  To prevent duplicate accounts and keep both your Member and Host profiles on <strong>one single verified number</strong>, verify your 10-digit mobile number via SMS OTP first.
                </p>
              </div>

              {authError && (
                <div className="border-2 border-danger bg-danger/10 p-3 text-xs font-bold text-danger flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendAuthOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-ink mb-1.5">
                      Indian Mobile Number (+91)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 font-mono text-xs font-black text-ink-muted">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        required
                        placeholder="Enter 10-digit mobile number"
                        value={authPhone}
                        onChange={(e) => {
                          setAuthPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          setAuthError(null);
                        }}
                        className="w-full border-2 border-ink bg-paper pl-12 pr-4 py-2.5 text-sm font-mono font-bold text-ink focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp || authPhone.length !== 10}
                    className="w-full border-2 border-ink bg-ink text-white py-3 text-xs font-black uppercase tracking-wider shadow-brutal btn-press disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSendingOtp ? "Sending SMS OTP..." : "Send Verification OTP ->"}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAuthOtp} className="space-y-4">
                  <div className="flex items-center justify-between border-2 border-ink bg-paper p-3 text-xs font-bold">
                    <span>
                      SMS OTP sent to <strong className="font-mono">+91 {authPhone}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                        setAuthError(null);
                      }}
                      className="text-lavender font-black underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-ink mb-1.5">
                      Enter 6-Digit SMS OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      required
                      placeholder="6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full border-2 border-ink bg-paper py-3 text-center text-xl font-mono font-black tracking-widest text-ink focus:bg-white focus:outline-none"
                    />
                    <p className="mt-1.5 text-[11px] font-semibold text-ink-muted">
                      On mobile, incoming SMS OTP auto-detects when received; on laptops, enter the 6-digit SMS code manually.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpCode.length !== 6}
                    className="w-full border-2 border-ink bg-lime text-ink py-3 text-xs font-black uppercase tracking-wider shadow-brutal btn-press disabled:opacity-40 cursor-pointer"
                  >
                    {isVerifyingOtp ? "Verifying OTP..." : "Verify & Continue to Host Form ->"}
                  </button>

                  {resendCooldown > 0 && (
                    <p className="text-center text-[11px] font-bold text-ink-muted">
                      Resend available in {resendCooldown}s
                    </p>
                  )}
                </form>
              )}
            </div>
          ) : isSubmitted ? (
            /* SUCCESS VIEW */
            <div className="border-brutal shadow-brutal bg-white p-6 sm:p-10 space-y-6 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-[#D4F7A5] text-ink shadow-brutal-xs">
                  <CheckCircle2 className="h-7 w-7 text-ink" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-ink">
                    Host Profile Activated!
                  </h2>
                  <p className="text-xs font-bold text-ink-muted">
                    {confirmedPackName} &middot; Ref <span className="font-mono font-black text-ink">{applicationRef}</span>
                  </p>
                </div>
              </div>

              <div className="border-2 border-ink bg-paper p-5 space-y-3 shadow-brutal-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-ink">
                  You Are Live on Meetzy Club!
                </h3>
                <ul className="text-xs font-medium space-y-2 text-ink-soft">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Your companion profile is now live on <strong>/explore</strong> with your uploaded photo, availability, and 70% payout guarantee.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bonus promotional Chat Coins from your pack have been added to your single unified wallet.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Manage incoming requests, edit availability, add your UPI ID, and track 70% earnings inside your Host Dashboard.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/companion/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-ink bg-ink text-white px-7 py-3 text-xs font-black uppercase tracking-wider shadow-brutal btn-press"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Go to Host Dashboard</span>
                </Link>
                <Link
                  href="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-ink bg-white text-ink px-7 py-3 text-xs font-black uppercase tracking-wider shadow-brutal btn-press"
                >
                  <span>View Live on Explore</span>
                </Link>
              </div>
            </div>
          ) : (
            /* 3-STEP HOST APPLICATION FORM */
            <div className="border-brutal shadow-brutal bg-white p-5 sm:p-10 space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="border-2 border-ink bg-sunny px-3 py-1 text-xs font-black uppercase tracking-wider inline-block">
                    Host Application
                  </span>
                  <span className="border-2 border-ink bg-[#D4F7A5] px-2.5 py-1 text-xs font-black uppercase tracking-wider text-ink inline-flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Fixed 70% Host Share</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                  Become a Verified Companion
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-medium text-ink/70">
                  Earn 70% fixed payout on every meetup (INR 399 - 1,299/hr). Strictly platonic, public venues only.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs">
                  <div className={`border-2 border-ink p-2 font-black uppercase transition ${step >= 1 ? "bg-lime text-ink shadow-brutal-sm" : "bg-paper text-ink/40"}`}>
                    1. Verified Info
                  </div>
                  <div className={`border-2 border-ink p-2 font-black uppercase transition ${step >= 2 ? "bg-lime text-ink shadow-brutal-sm" : "bg-paper text-ink/40"}`}>
                    2. Persona &amp; Photo
                  </div>
                  <div className={`border-2 border-ink p-2 font-black uppercase transition ${step >= 3 ? "bg-lime text-ink shadow-brutal-sm" : "bg-paper text-ink/40"}`}>
                    3. Pack &amp; Safety
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="border-2 border-danger bg-danger/10 p-3.5 text-xs font-bold text-danger flex items-center gap-2 shadow-brutal-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: Verified Personal Details */}
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Full Legal Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your full legal name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-black uppercase text-ink">
                            Verified Mobile Number
                          </label>
                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded">
                            OTP Verified
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 font-mono text-xs font-bold text-ink-muted">
                            +91
                          </span>
                          <input
                            type="tel"
                            readOnly
                            value={formData.phone}
                            className="w-full border-2 border-ink bg-paper-deep/50 pl-12 pr-3.5 py-2.5 text-xs font-mono font-bold text-ink cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1.5">
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "female", label: "Female" },
                          { id: "male", label: "Male" },
                          { id: "other", label: "Other" },
                        ].map((g) => (
                          <button
                            type="button"
                            key={g.id}
                            onClick={() => setFormData({ ...formData, gender: g.id })}
                            className={`border-2 border-ink p-2.5 text-center text-xs font-black uppercase transition-all cursor-pointer ${
                              formData.gender === g.id ? "bg-pink text-ink shadow-brutal-sm" : "bg-paper text-ink hover:bg-paper-deep"
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Primary Metropolitan City
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none"
                        >
                          {CITIES.map((c) => (
                            <option key={c.slug} value={c.name}>
                              {c.name} ({c.state})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Preferred Locality / Area
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sector 17, Indiranagar, Bandra"
                          value={formData.locality}
                          onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        Your Age (Must be 18+)
                      </label>
                      <input
                        type="number"
                        min={18}
                        max={70}
                        required
                        placeholder="Enter age (18+)"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Persona & Photo */}
                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Public Display Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter display name (e.g. First name)"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                        />
                        <p className="mt-1 text-[11px] font-bold text-ink/60">
                          Visible on your public companion profile card.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Profile Avatar Photo (Clear Headshot)
                        </label>

                        {avatarBase64 ? (
                          <div className="border-2 border-ink bg-paper p-2.5 flex items-center justify-between shadow-brutal-sm">
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={avatarBase64}
                                alt="Profile Avatar Preview"
                                className="w-12 h-12 rounded-full border-2 border-ink object-cover"
                              />
                              <div>
                                <span className="text-xs font-black text-ink block truncate max-w-[140px]">
                                  {avatarFileName || "profile-photo.jpg"}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                  <Check className="h-3 w-3" /> Ready
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                className="border border-ink bg-white px-2 py-1 text-[10px] font-black uppercase hover:bg-paper-deep cursor-pointer"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAvatarBase64("");
                                  setAvatarFileName("");
                                }}
                                className="p-1 text-danger hover:bg-danger/10 rounded cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-ink bg-paper p-3.5 hover:bg-paper-deep transition text-center cursor-pointer"
                          >
                            <Upload className="h-4 w-4 text-ink" />
                            <span className="text-xs font-black text-ink">
                              {isAvatarProcessing ? "Compressing photo..." : "Upload Profile Photo"}
                            </span>
                          </button>
                        )}

                        <input
                          id="avatar-upload-input"
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Hourly Rate (INR 399 - 1,299)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 font-bold text-xs text-ink-muted">
                            INR
                          </span>
                          <input
                            type="number"
                            min={399}
                            max={1299}
                            required
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                            className="w-full border-2 border-ink bg-paper pl-12 pr-3.5 py-2.5 text-xs font-mono font-bold text-ink focus:outline-none"
                          />
                        </div>
                        <p className="mt-1 text-[11px] font-bold text-emerald-700">
                          You take home 70% = INR {hostHourlyNet70}/hr (30% = INR {platformFee30} covers taxes, Razorpay &amp; safety)
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Spoken Languages
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. English, Hindi, Punjabi"
                          value={formData.languages}
                          onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-2">
                        Accepted Activities (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {AVAILABLE_ACTIVITIES.map((act) => {
                          const isSelected = formData.activities.includes(act);
                          return (
                            <button
                              type="button"
                              key={act}
                              onClick={() => handleActivityToggle(act)}
                              className={`border-2 border-ink p-2.5 text-left text-xs transition cursor-pointer ${
                                isSelected ? "bg-lime font-black shadow-brutal-sm" : "bg-paper font-bold hover:bg-black/5"
                              }`}
                            >
                              {act}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        Short Bio / About You
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell members about yourself, your hobbies, favorite public spots, and topics you enjoy talking about..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full border-2 border-ink bg-paper p-3 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Host Package (70-30 Fixed) + Availability + Safety Pledges */}
                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in">
                    {/* Privacy Banner */}
                    <div className="border-2 border-ink bg-[#E8DEFF] p-4 space-y-1.5 shadow-brutal-sm">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-ink shrink-0" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-ink">
                          Privacy by Default &mdash; No Government ID Required
                        </h3>
                      </div>
                      <p className="text-xs font-medium text-ink-soft leading-relaxed">
                        We do <strong>NOT</strong> collect Aadhaar cards or biometrics. Your verified mobile number stays private and masked.
                      </p>
                    </div>

                    {/* Transparent INR 113 Host Registration Checkout Summary */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black uppercase text-ink">
                          Host Registration Fee (Includes All Taxes)
                        </label>
                        <span className="text-[10px] font-black uppercase bg-[#D4F7A5] border border-ink px-2 py-0.5">
                          70-30 Payout Guaranteed
                        </span>
                      </div>

                      <div className="border-2 border-ink bg-white p-4 space-y-2 shadow-brutal-sm text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink-soft">Host Registration Charges</span>
                          <span className="font-mono font-bold text-ink">
                            INR {selectedPack.basePrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink-soft">All Due Taxes &amp; Gateway Fees</span>
                          <span className="font-mono font-bold text-ink">
                            INR {selectedPack.taxesAndCharges.toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t-2 border-ink/15 pt-2 flex items-center justify-between font-display text-base font-black text-ink">
                          <span>Total Payable Today</span>
                          <span className="font-mono">INR {selectedPack.price}.00</span>
                        </div>
                        <div className="pt-1 text-[11px] font-bold text-emerald-700">
                          Includes 1-Year Active Directory Listing + {selectedPack.promoCoins} Bonus Chat Coins
                        </div>
                      </div>

                      {/* Live Earnings Breakdown for User's Chosen Hourly Rate */}
                      <div className="border-2 border-ink bg-sunny/35 p-3.5 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-black uppercase text-ink">
                          <Wallet className="h-3.5 w-3.5" />
                          <span>Your Live Earnings Preview at INR {hourlyNum}/hr</span>
                        </div>
                        <div className="flex justify-between font-bold text-ink-soft">
                          <span>Member pays per hour:</span>
                          <span className="font-mono text-ink">INR {hourlyNum}</span>
                        </div>
                        <div className="flex justify-between font-black text-emerald-800">
                          <span>You take home (70% Fixed):</span>
                          <span className="font-mono">INR {hostHourlyNet70} / hr</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-medium text-ink-muted">
                          <span>Taxes, Razorpay gateway &amp; platform safety (30%):</span>
                          <span className="font-mono">INR {platformFee30} / hr</span>
                        </div>
                      </div>
                    </div>

                    {/* Weekly Availability */}
                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1.5">
                        Weekly Availability
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          "Weekdays (Mon-Fri)",
                          "Weekends (Sat-Sun)",
                          "Evenings (5-9 PM)",
                          "Flexible / On Request",
                        ].map((item) => {
                          const isSelected = formData.availability.includes(item);
                          return (
                            <button
                              type="button"
                              key={item}
                              onClick={() => handleAvailabilityToggle(item)}
                              className={`border-2 border-ink p-2 text-center text-xs font-black transition cursor-pointer ${
                                isSelected ? "bg-lime text-ink shadow-brutal-xs" : "bg-paper text-ink-muted hover:bg-white"
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred Public Venues */}
                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1.5">
                        Preferred Public Venues
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          "Artisan Coffee Shops",
                          "Open Promenades & Parks",
                          "Malls & Shopping Centers",
                          "Cultural Spaces & Museums",
                        ].map((v) => {
                          const isSelected = formData.preferredVenues.includes(v);
                          return (
                            <button
                              type="button"
                              key={v}
                              onClick={() => handleVenueToggle(v)}
                              className={`border-2 border-ink p-2 text-center text-xs font-black transition cursor-pointer ${
                                isSelected ? "bg-sunny text-ink shadow-brutal-xs" : "bg-paper text-ink-muted hover:bg-white"
                              }`}
                            >
                              {v}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4 Safety Pledges */}
                    <div className="space-y-2.5 pt-1">
                      <label className="block text-xs font-black uppercase text-ink">
                        Safety &amp; Community Commitments
                      </label>

                      <div className="border-2 border-ink bg-white p-3.5 space-y-3 shadow-brutal-sm">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.agreePublicOnly}
                            onChange={(e) => setFormData({ ...formData, agreePublicOnly: e.target.checked })}
                            className="mt-0.5 h-4 w-4 border-2 border-ink accent-ink"
                          />
                          <span className="text-xs font-bold text-ink leading-relaxed">
                            <strong>Strictly Public Places:</strong> 100% of meetups take place in open public venues (cafes, promenades, malls, museums). NEVER private homes or hotel rooms.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer border-t border-ink/10 pt-2.5">
                          <input
                            type="checkbox"
                            checked={formData.agreePlatonic}
                            onChange={(e) => setFormData({ ...formData, agreePlatonic: e.target.checked })}
                            className="mt-0.5 h-4 w-4 border-2 border-ink accent-ink"
                          />
                          <span className="text-xs font-bold text-ink leading-relaxed">
                            <strong>100% Platonic &amp; Zero Tolerance:</strong> Strictly platonic social company only. Romantic or adult solicitation leads to immediate ban.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer border-t border-ink/10 pt-2.5">
                          <input
                            type="checkbox"
                            checked={formData.agreeEscrowPin}
                            onChange={(e) => setFormData({ ...formData, agreeEscrowPin: e.target.checked })}
                            className="mt-0.5 h-4 w-4 border-2 border-ink accent-ink"
                          />
                          <span className="text-xs font-bold text-ink leading-relaxed">
                            <strong>70-30 Escrow Payout &amp; 4-Digit Start PIN:</strong> Session starts only when I enter the member&apos;s 4-digit PIN in person, and 70% of the meetup rate credits to my Host Wallet upon completion.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer border-t border-ink/10 pt-2.5">
                          <input
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                            className="mt-0.5 h-4 w-4 border-2 border-ink accent-ink"
                          />
                          <span className="text-xs font-bold text-ink leading-relaxed">
                            <strong>Terms &amp; Privacy Agreement:</strong> I confirm I am 18+ and accept the <Link href="/terms" className="underline font-black">Terms of Service</Link>, <Link href="/privacy" className="underline font-black">Privacy Policy</Link>, and <Link href="/community-guidelines" className="underline font-black">Community Guidelines</Link>.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="space-y-2.5 pt-4 border-t-2 border-ink">
                  <div className="flex items-center justify-between gap-2">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setStep(step - 1);
                        }}
                        className="border-2 border-ink bg-paper px-5 py-2.5 text-xs font-black uppercase shadow-brutal btn-press cursor-pointer"
                      >
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !canProceed}
                      className="border-2 border-ink bg-ink px-6 sm:px-8 py-3 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <span>
                        {step === 3
                          ? isSubmitting
                            ? "Opening Razorpay..."
                            : `Pay INR ${selectedPack.price} & Launch Profile`
                          : "Next Step"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center font-display font-black text-ink">
          Loading companion application...
        </div>
      }
    >
      <CompanionApplyForm />
    </Suspense>
  );
}
