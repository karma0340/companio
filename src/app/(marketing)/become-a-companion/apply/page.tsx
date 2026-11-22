"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  FileText,
  Trash2,
  UserCheck,
  Instagram,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { submitHostApplicationAction } from "@/app/actions/host-application";
import { useAuth } from "@/context/auth-context";
import { CITIES } from "@/lib/data/cities";

/**
 * Compresses an image client-side via HTML5 Canvas before base64 encoding.
 * Keeps max dimension at 1280px and JPEG quality at 0.8.
 * Reduces 5-15MB camera photos to crisp ~150-250KB payloads in <100ms.
 */
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshSession } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [applicationRef, setApplicationRef] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states - empty defaults, Chandigarh priority, neutral placeholders
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
    idType: "Aadhaar Card (Masked)",
    idNumber: "",
    socialHandle: "",
    agreePlatonic: true,
  });

  // Photo states & live previews
  const [avatarBase64, setAvatarBase64] = useState<string>("");
  const [avatarFileName, setAvatarFileName] = useState<string>("");
  const [isAvatarProcessing, setIsAvatarProcessing] = useState<boolean>(false);

  const [idDocBase64, setIdDocBase64] = useState<string>("");
  const [idDocFileName, setIdDocFileName] = useState<string>("");
  const [isIdDocProcessing, setIsIdDocProcessing] = useState<boolean>(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const idDocInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill phone and name from URL or authenticated session
  useEffect(() => {
    const urlPhone = searchParams.get("phone") || "";
    const sessionPhone = user?.phone || "";
    const initialPhone = urlPhone || sessionPhone;

    if (initialPhone) {
      const cleanDigits = initialPhone.replace(/\D/g, "").slice(-10);
      setFormData((prev) => ({
        ...prev,
        phone: prev.phone || cleanDigits,
      }));
    }

    if (user?.name && user.name.toLowerCase() !== "member") {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        displayName: prev.displayName || user.name?.split(" ")[0] || "",
      }));
    }
  }, [searchParams, user]);

  const handleActivityToggle = (act: string) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(act);
      return {
        ...prev,
        activities: exists
          ? prev.activities.filter((a) => a !== act)
          : [...prev.activities, act],
      };
    });
  };

  // Avatar handler with compression & FileReader fallback
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
      // Fallback directly to FileReader
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
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  // ID Document handler with compression & FileReader fallback
  const handleIdDocFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIdDocProcessing(true);
    setIdDocFileName(file.name);
    try {
      const compressed = await compressImage(file, 1280, 0.85);
      setIdDocBase64(compressed);
      setErrorMessage(null);
    } catch {
      // Fallback directly to FileReader
      const reader = new FileReader();
      reader.onload = (readEvt) => {
        if (readEvt.target?.result) {
          setIdDocBase64(readEvt.target.result as string);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsIdDocProcessing(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  // Step-by-step required fields check to control Next Step button
  const phoneDigits = formData.phone.replace(/\D/g, "");
  const ageNum = parseInt(formData.age, 10);

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

  const isStep3Valid = Boolean(formData.agreePlatonic);

  const canProceed =
    step === 1 ? isStep1Valid :
    step === 2 ? isStep2Valid :
    isStep3Valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // STEP 1 VALIDATION
    if (step === 1) {
      const phoneCheck = validateIndianMobileNumber(formData.phone);
      if (!phoneCheck.isValid) {
        setErrorMessage(phoneCheck.error || "Please enter a valid 10-digit Indian mobile number.");
        return;
      }
      if (!formData.fullName.trim()) {
        setErrorMessage("Please enter your full legal name.");
        return;
      }
      const ageNum = parseInt(formData.age, 10);
      if (!formData.age || isNaN(ageNum) || ageNum < 18 || ageNum > 70) {
        setErrorMessage("Please enter a valid age (must be at least 18 years old).");
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // STEP 2 VALIDATION
    if (step === 2) {
      if (!formData.displayName.trim()) {
        setErrorMessage("Please enter a public display name.");
        return;
      }
      if (!avatarBase64) {
        setErrorMessage("Please upload a clear profile photo so members know who they are meeting.");
        return;
      }
      if (!formData.bio.trim() || formData.bio.trim().length < 15) {
        setErrorMessage("Please write a short bio of at least 15 characters.");
        return;
      }
      if (formData.activities.length === 0) {
        setErrorMessage("Please select at least one activity you enjoy.");
        return;
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // STEP 3 VALIDATION & FINAL SUBMISSION
    if (step === 3) {
      if (!formData.agreePlatonic) {
        setErrorMessage("You must agree to the strictly platonic code and public venues policy.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await submitHostApplicationAction({
          fullName: formData.fullName.trim(),
          displayName: formData.displayName.trim(),
          phone: formData.phone.trim(),
          gender: formData.gender,
          age: parseInt(formData.age, 10) || 18,
          city: formData.city,
          locality: formData.locality.trim() || undefined,
          travelRadiusKm: Number(formData.travelRadiusKm) || 10,
          bio: formData.bio.trim(),
          hourlyRate: parseInt(formData.hourlyRate, 10) || 499,
          activities: formData.activities,
          spokenLanguages: formData.languages.split(",").map((s) => s.trim()).filter(Boolean),
          idType: formData.idType,
          idNumber: formData.idNumber.trim() || undefined,
          socialHandle: formData.socialHandle.trim() || undefined,
          avatarImage: avatarBase64 || undefined,
          idDocumentImage: idDocBase64 || undefined,
          registrationFeePaid: true,
          paymentId: `free_submission_${Date.now()}`,
        });

        if (res.success) {
          setApplicationRef(res.applicationId || "HST-2026-REG");
          setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
          await refreshSession();
        } else {
          setErrorMessage(res.error || "Failed to submit host application. Please check details.");
        }
      } catch (err) {
        console.error("[HOST APPLICATION SUBMIT ERROR]:", err);
        setErrorMessage("Submission error. Please verify your connection and try again.");
      } finally {
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

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Back Navigation */}
          <Link
            href="/become-a-companion"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-ink hover:underline tracking-tight"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Companion Overview</span>
          </Link>

          {/* APPLICATION SUBMITTED SUCCESS VIEW */}
          {isSubmitted ? (
            <div className="border-brutal shadow-brutal bg-white p-6 sm:p-10 space-y-6 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-[#D4F7A5] text-ink font-black text-xl shadow-brutal-xs">
                  <CheckCircle2 className="h-7 w-7 text-ink" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-ink">
                    Application Submitted Successfully!
                  </h2>
                  <p className="text-xs font-bold text-ink-muted">
                    Reference ID: <span className="font-mono font-black text-ink">{applicationRef}</span>
                  </p>
                </div>
              </div>

              <div className="border-2 border-ink bg-paper p-5 space-y-3 shadow-brutal-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-ink">
                  Welcome to Meetzy Club Host Community!
                </h3>
                <ul className="text-xs font-medium space-y-2 text-ink-soft">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Your host profile has been created and saved in our verified system.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Our trust &amp; safety team will send a quick WhatsApp message to greet you and verify your preferences.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>You can now open your Host Dashboard to manage your availability, hourly rates, and bio.</span>
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
                  <span>Explore Companions</span>
                </Link>
              </div>
            </div>
          ) : (
            /* APPLICATION FORM */
            <div className="border-brutal shadow-brutal bg-white p-6 sm:p-10 space-y-8">
              {/* Header & Step Tracker */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="border-2 border-ink bg-sunny px-3 py-1 text-xs font-black uppercase tracking-wider inline-block">
                    Host Application
                  </span>
                  <span className="border-2 border-ink bg-pink/25 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-ink inline-flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Private &amp; Confidential</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                  Become a Verified Companion
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-medium text-ink/70">
                  Earn INR 499 - 1,299/hour sharing your city. Strictly platonic, public venues only.
                </p>

                {/* Step Indicators: 3 Clean Steps */}
                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
                  <div
                    className={`border-2 border-ink p-2 font-black uppercase transition ${step >= 1 ? "bg-lime text-ink shadow-brutal-sm" : "bg-paper text-ink/40"
                      }`}
                  >
                    1. Info
                  </div>
                  <div
                    className={`border-2 border-ink p-2 font-black uppercase transition ${step >= 2 ? "bg-lime text-ink shadow-brutal-sm" : "bg-paper text-ink/40"
                      }`}
                  >
                    2. Persona &amp; Photo
                  </div>
                  <div
                    className={`border-2 border-ink p-2 font-black uppercase transition ${step >= 3 ? "bg-lime text-ink shadow-brutal-sm" : "bg-paper text-ink/40"
                      }`}
                  >
                    3. Simple Verification
                  </div>
                </div>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="border-2 border-danger bg-danger/10 p-3.5 text-xs font-bold text-danger flex items-center gap-2 shadow-brutal-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: Personal Details */}
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
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          WhatsApp Mobile Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 font-mono text-xs font-bold text-ink-muted">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="Enter 10-digit mobile number"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                              })
                            }
                            className="w-full border-2 border-ink bg-paper pl-12 pr-3.5 py-2.5 text-xs font-mono font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gender Selection */}
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
                            className={`border-2 border-ink p-2.5 text-center text-xs font-black uppercase transition-all cursor-pointer ${formData.gender === g.id
                              ? "bg-pink text-ink shadow-brutal-sm"
                              : "bg-paper text-ink hover:bg-paper-deep"
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
                          placeholder="e.g. Sector 17, Phase 3B2, etc."
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

                {/* STEP 2: Companion Persona & Photo */}
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
                          This is the name visible on your public companion profile card.
                        </p>
                      </div>

                      {/* Photo Upload with Live Thumbnail Preview */}
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
                                <span className="text-xs font-black text-ink block truncate max-w-[150px]">
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
                                className="border border-ink bg-white px-2 py-1 text-[10px] font-black uppercase hover:bg-paper-deep"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAvatarBase64("");
                                  setAvatarFileName("");
                                }}
                                className="p-1 text-danger hover:bg-danger/10 rounded"
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
                            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-ink bg-paper p-3.5 hover:bg-paper-deep transition text-center cursor-pointer active:scale-[0.99]"
                          >
                            <Upload className="h-4 w-4 text-ink" />
                            <span className="text-xs font-black text-ink">
                              {isAvatarProcessing ? "Compressing photo..." : "Upload Profile Photo (Click to choose)"}
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
                        {!avatarBase64 && (
                          <p className="mt-1 text-[11px] font-bold text-amber-800">
                            * Photo is required to continue to Step 3.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Hourly Rate (INR)
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
                        <p className="mt-1 text-[11px] font-bold text-ink/60">
                          Recommended: INR 499 – 799/hour for new companions.
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
                              className={`border-2 border-ink p-2.5 text-left text-xs transition ${isSelected
                                ? "bg-lime font-black shadow-brutal-sm"
                                : "bg-paper font-bold hover:bg-black/5"
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
                        placeholder="Tell verified members about yourself, your hobbies, favorite spots in your city, and what topics you enjoy talking about..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full border-2 border-ink bg-paper p-3 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Simple & Private Verification */}
                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in">
                    {/* Privacy Reassurance Banner */}
                    <div className="border-2 border-ink bg-[#E8DEFF] p-4 space-y-2 shadow-brutal-sm">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-ink shrink-0" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-ink">
                          Private &amp; Confidential Verification
                        </h3>
                      </div>
                      <p className="text-xs font-medium text-ink-soft leading-relaxed">
                        To maintain a trusted and safe community, we ask for a simple identity proof. Your document is stored with 256-bit encryption and is NEVER displayed to members or on your public profile.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          Document Type
                        </label>
                        <select
                          value={formData.idType}
                          onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink focus:outline-none"
                        >
                          <option value="Aadhaar Card (Masked)">Aadhaar Card (Masked)</option>
                          <option value="Driving License">Driving License</option>
                          <option value="Student / College ID">Student / College ID</option>
                          <option value="Work / Employee ID">Work / Employee ID</option>
                          <option value="Voter ID">Voter ID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-ink mb-1">
                          ID Number / Last 4 Digits (Optional)
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="e.g. Last 4 digits (1234)"
                          value={formData.idNumber}
                          onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                          className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Single Document Upload */}
                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1">
                        Upload ID Photo (Clear Photo of Card)
                      </label>

                      {idDocBase64 ? (
                        <div className="border-2 border-ink bg-paper p-3 flex items-center justify-between shadow-brutal-sm">
                          <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-ink" />
                            <div>
                              <span className="text-xs font-black text-ink block truncate max-w-[200px]">
                                {idDocFileName || "id-document.jpg"}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                <Check className="h-3 w-3" /> Document Ready
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => idDocInputRef.current?.click()}
                              className="border border-ink bg-white px-2 py-1 text-[10px] font-black uppercase hover:bg-paper-deep"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIdDocBase64("");
                                setIdDocFileName("");
                              }}
                              className="p-1 text-danger hover:bg-danger/10 rounded"
                              title="Remove document"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => idDocInputRef.current?.click()}
                          className="w-full flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-ink bg-white p-5 hover:bg-paper-deep transition text-center min-h-[90px] cursor-pointer active:scale-[0.99]"
                        >
                          <Upload className="h-5 w-5 text-ink/70" />
                          <span className="text-xs font-black text-ink">
                            {isIdDocProcessing ? "Compressing document..." : "Upload Document Photo (Click to choose file)"}
                          </span>
                          <span className="text-[10px] font-bold text-ink-muted">
                            Aadhaar, Driving License, Student ID or Work ID
                          </span>
                        </button>
                      )}

                      <input
                        id="id-doc-upload-input"
                        ref={idDocInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleIdDocFile}
                        className="hidden"
                      />
                    </div>

                    {/* Optional Social Profile */}
                    <div>
                      <label className="block text-xs font-black uppercase text-ink mb-1 flex items-center gap-1.5">
                        <Instagram className="h-3.5 w-3.5 text-pink-600" />
                        <span>Social Profile (Optional for Faster Approval)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. @your_instagram or linkedin.com/in/username"
                        value={formData.socialHandle}
                        onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                        className="w-full border-2 border-ink bg-paper px-3.5 py-2.5 text-xs font-bold text-ink placeholder:text-ink/40 focus:outline-none"
                      />
                    </div>

                    {/* Strict Platonic Policy Checkbox */}
                    <div className="border-2 border-ink bg-white p-4 shadow-brutal-sm">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={formData.agreePlatonic}
                          onChange={(e) => setFormData({ ...formData, agreePlatonic: e.target.checked })}
                          className="mt-0.5 h-4 w-4 border-2 border-ink accent-ink"
                        />
                        <span className="text-xs font-bold text-ink leading-relaxed">
                          I agree to Meetzy Club&apos;s Strictly Platonic &amp; Public Venues policy. All meetups are 100% platonic in open public places only; romantic or sexual propositions are strictly prohibited and result in immediate ban.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Navigation Controls */}
                <div className="space-y-2.5 pt-4 border-t-2 border-ink">
                  {!canProceed && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                      <span>
                        {step === 1 && "Please enter your full legal name, 10-digit mobile number, and age (18+) to enable Next Step."}
                        {step === 2 && (!avatarBase64 ? "Please upload your profile photo to enable Next Step." : formData.bio.trim().length < 15 ? "Please write a short bio of at least 15 characters to enable Next Step." : "Please fill in all required fields to enable Next Step.")}
                        {step === 3 && "Please check the strictly platonic policy box to enable Submit."}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setStep(step - 1);
                        }}
                        className="border-2 border-ink bg-paper px-6 py-2.5 text-xs font-black uppercase shadow-brutal btn-press cursor-pointer"
                      >
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !canProceed}
                      className="border-2 border-ink bg-ink px-8 py-3 text-xs font-black uppercase tracking-wider text-white shadow-brutal btn-press disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <span>
                        {step === 3
                          ? isSubmitting
                            ? "Submitting Application..."
                            : "Submit Application →"
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
