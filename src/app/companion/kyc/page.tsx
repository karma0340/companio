'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Upload,
  Lock,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import { uploadImageAction } from '@/app/actions/upload';

interface KycFormData {
  fullName: string;
  dob: string;
  aadhaarNumber: string;
  upiId: string;
}

export default function HostKYCPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, memberProfile, hostProfile, activeRole, isAuthenticated, isLoading, refreshSession, upgradeToHost } =
    useAuth();

  const [step, setStep] = useState<number>(1);
  const [aadhaarRawDigits, setAadhaarRawDigits] = useState<string>('');
  const [aadhaarFileName, setAadhaarFileName] = useState<string>('');
  const [aadhaarImageBase64, setAadhaarImageBase64] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [kycReference, setKycReference] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<KycFormData>({
    defaultValues: {
      fullName: '',
      dob: '',
      aadhaarNumber: '',
      upiId: '',
    },
    mode: 'onChange',
  });

  // Prefill legal name from member profile if available
  useEffect(() => {
    if (memberProfile?.fullName && memberProfile.fullName !== 'Togethr Member') {
      setValue('fullName', memberProfile.fullName, { shouldValidate: true });
    }
  }, [memberProfile, setValue]);

  // If already approved host, offer redirect to host dashboard
  useEffect(() => {
    if (!isLoading && activeRole === 'host' && hostProfile?.verificationStatus === 'approved') {
      router.push('/companion/dashboard');
    }
  }, [activeRole, hostProfile, isLoading, router]);

  const legalName = watch('fullName');
  const dob = watch('dob');
  const upiId = watch('upiId');

  // Handle Aadhaar typing with strict 12-digit number-only restriction & auto-spacing
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarRawDigits(digitsOnly);

    const chunks = digitsOnly.match(/.{1,4}/g);
    const formatted = chunks ? chunks.join(' ') : digitsOnly;
    setValue('aadhaarNumber', formatted, { shouldValidate: true });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error('The selected photo is larger than 8MB. Please select a smaller photo.', 'File Too Large');
        return;
      }

      setAadhaarFileName(file.name);
      setIsUploadingPhoto(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setAadhaarImageBase64(base64);

        try {
          const res = await uploadImageAction(base64, 'made4togethr/kyc');
          if (res.success && res.url) {
            setUploadedImageUrl(res.url);
            toast.success('Your ID photo has been uploaded securely.', 'Photo Uploaded');
          } else {
            console.warn('Upload fallback to direct base64');
          }
        } catch (uploadErr) {
          console.error('Upload error:', uploadErr);
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const goToStep2 = () => {
    if (!legalName || legalName.trim().length < 2) {
      toast.error('Please enter your full legal name as shown on your ID card.', 'Name Required');
      return;
    }

    if (!dob) {
      toast.error('Please select your date of birth. You must be 18 or older to join.', 'Date of Birth Required');
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      toast.error('You must be at least 18 years of age to host on Togethr.', 'Age Requirement');
      return;
    }

    if (aadhaarRawDigits.length !== 12) {
      if (aadhaarRawDigits.length === 0) {
        toast.error('Please enter your 12-digit Aadhaar number.', 'Aadhaar Number Required');
      } else {
        toast.error(
          `Aadhaar number must be exactly 12 digits. You have entered ${aadhaarRawDigits.length} digit${aadhaarRawDigits.length === 1 ? '' : 's'}.`,
          'Incomplete Aadhaar Number'
        );
      }
      return;
    }

    setStep(2);
  };

  const goToStep3 = () => {
    if (!aadhaarFileName && !uploadedImageUrl && !aadhaarImageBase64) {
      toast.error('Please select and upload a clear photo of the front side of your Aadhaar card.', 'Photo ID Required');
      return;
    }
    if (isUploadingPhoto) {
      toast.info('Please wait a moment while your photo finishes uploading.', 'Uploading in Progress');
      return;
    }
    setStep(3);
  };

  const onSubmitFinal = async (data: KycFormData) => {
    if (!data.upiId || !data.upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. yourname@okaxis, 9876543210@upi).', 'Valid UPI ID Required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/companion/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName.trim(),
          dob: data.dob,
          aadhaarNumber: aadhaarRawDigits,
          aadhaarImage: uploadedImageUrl || aadhaarImageBase64 || aadhaarFileName || 'uploaded-aadhaar-front.jpg',
          upiId: data.upiId.trim(),
        }),
      });

      let json: any = {};
      try {
        json = await res.json();
      } catch {
        // Fallback for non-JSON
      }

      if (!res.ok || !json.success) {
        toast.error(json.error || 'Failed to complete verification. Please try again.', 'Verification Error');
        return;
      }

      // Upgrade Zustand state reactively
      if (json.hostProfile) {
        upgradeToHost(json.hostProfile);
      }
      await refreshSession();

      setSubmitted(true);
      setKycReference(json.kycReference || '#CMP-8921');
      toast.success(
        'Congratulations! You are now an approved and verified Host on Togethr.',
        'Profile Verified & Approved'
      );
    } catch (err) {
      console.error('Upgrade submission error:', err);
      toast.error(
        'Something went wrong while completing your verification. Please try again.',
        'Connection Error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-3xl border-brutal bg-white p-6 sm:p-12 shadow-brutal-lg space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="lime" size="sm">
                Host Verification
              </Badge>
              <Badge variant="sunny" size="sm">
                Step {step} of 3
              </Badge>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-black text-ink">
              Verify your Host Profile
            </h1>

            <p className="font-body text-xs sm:text-sm text-ink-soft leading-relaxed">
              To keep meetups safe for everyone, all Togethr companions confirm their identity with an Aadhaar card and photo before meeting members in public.
            </p>
          </div>

          {submitted ? (
            /* Success State */
            <div className="rounded-2xl border-brutal bg-lime-soft p-8 text-center space-y-5 animate-in fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-brutal bg-lime shadow-brutal-sm text-ink">
                <ShieldCheck className="h-8 w-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-black text-ink">
                  You are now a Verified Host!
                </h2>
                <span className="inline-block rounded-lg border-brutal-sm bg-white px-3 py-1 font-mono text-xs font-black text-ink">
                  Reference: {kycReference}
                </span>
              </div>

              {uploadedImageUrl && (
                <div className="rounded-xl border-brutal-sm bg-white p-3 max-w-xs mx-auto space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-ink">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>ID Document Saved</span>
                  </div>
                  <div className="relative h-28 w-full rounded-lg overflow-hidden border border-ink/20 bg-paper">
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded Document"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <p className="font-body text-xs sm:text-sm text-ink-soft leading-relaxed max-w-md mx-auto">
                Welcome to the host community, <strong>{legalName || 'Host'}</strong>! Your Host profile has been activated and your verified badge is now live. You can start receiving meetup requests immediately.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/companion/dashboard">
                  <Button variant="primary" size="md">
                    Go to Host Dashboard →
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="md">
                    Browse All Companions
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step 1: Personal & Aadhaar Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="border-b-brutal-sm pb-2">
                    <h3 className="font-display text-lg font-black text-ink">
                      1. Personal & ID Details
                    </h3>
                    <p className="font-body text-xs text-ink-muted">
                      Please enter your name exactly as it appears on your government document.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block font-display text-xs font-black uppercase text-ink">
                        Full Legal Name (as printed on your ID)
                      </label>
                      <input
                        type="text"
                        {...register('fullName', { required: true })}
                        placeholder="Full name as printed on ID"
                        className="w-full rounded-xl border-brutal bg-white px-3.5 py-3 font-display text-xs sm:text-sm font-bold text-ink placeholder:text-ink-muted/60 focus:outline-none focus:shadow-brutal"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="block font-display text-xs font-black uppercase text-ink">
                        Date of Birth (18+ Only)
                      </label>
                      <input
                        type="date"
                        {...register('dob', { required: true })}
                        className="w-full rounded-xl border-brutal bg-white px-3.5 py-3 font-display text-xs sm:text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                      />
                      <span className="block text-[11px] font-medium text-ink-muted">
                        You must be at least 18 years of age to host on Togethr.
                      </span>
                    </div>

                    {/* 12-Digit Aadhaar Number */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block font-display text-xs font-black uppercase text-ink">
                          12-Digit Aadhaar Number
                        </label>
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
                            aadhaarRawDigits.length === 12
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                              : aadhaarRawDigits.length > 0
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-paper text-ink-muted border-ink/20'
                          }`}
                        >
                          {aadhaarRawDigits.length} / 12 digits
                        </span>
                      </div>

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={14}
                        value={watch('aadhaarNumber')}
                        onChange={handleAadhaarChange}
                        placeholder="XXXX XXXX XXXX"
                        className={`w-full rounded-xl border-brutal bg-white px-3.5 py-3 font-mono text-sm sm:text-base font-bold tracking-wider text-ink placeholder:text-ink-muted/50 focus:outline-none focus:shadow-brutal ${
                          aadhaarRawDigits.length === 12 ? 'border-emerald-700 bg-emerald-50/20' : ''
                        }`}
                      />

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px] text-ink-muted">
                          Only numbers allowed. Kept strictly confidential for safety.
                        </span>
                        {aadhaarRawDigits.length === 12 ? (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Exactly 12 digits entered
                          </span>
                        ) : aadhaarRawDigits.length > 0 ? (
                          <span className="text-[11px] text-amber-700 font-bold">
                            Need {12 - aadhaarRawDigits.length} more digit{12 - aadhaarRawDigits.length === 1 ? '' : 's'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-brutal flex justify-end">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={goToStep2}
                      disabled={aadhaarRawDigits.length !== 12 || !legalName.trim() || !dob}
                    >
                      Continue to Step 2 →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Upload Front Photo of Aadhaar */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="border-b-brutal-sm pb-2">
                    <h3 className="font-display text-lg font-black text-ink">
                      2. Upload Photo of Your ID
                    </h3>
                    <p className="font-body text-xs text-ink-muted">
                      Please upload a clear, readable front photo of your Aadhaar card for record-keeping.
                    </p>
                  </div>

                  <label className="block rounded-2xl border-brutal border-dashed bg-paper/50 p-8 text-center space-y-3 cursor-pointer hover:bg-paper-deep transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {isUploadingPhoto ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Loader2 className="h-8 w-8 text-lavender animate-spin" />
                        <span className="font-display text-xs font-black text-ink">
                          Uploading photo safely...
                        </span>
                        <span className="text-[11px] text-ink-muted">
                          Saving your document securely
                        </span>
                      </div>
                    ) : uploadedImageUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative h-28 w-44 rounded-xl border-brutal overflow-hidden bg-white shadow-brutal-sm">
                          <img
                            src={uploadedImageUrl}
                            alt="Aadhaar Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-400">
                          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                          <span>Photo uploaded successfully</span>
                        </div>
                        <span className="text-[11px] text-ink-muted">
                          {aadhaarFileName} (Click to change file)
                        </span>
                      </div>
                    ) : aadhaarFileName ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileCheck2 className="h-10 w-10 text-lime" />
                        <span className="font-display text-sm font-black text-ink">
                          {aadhaarFileName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-lime font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>File selected (Click to replace)</span>
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-ink-muted" />
                        <span className="block font-display text-xs font-extrabold text-ink">
                          Click to select Aadhaar Front Photo (PNG, JPG, WEBP)
                        </span>
                        <span className="text-[11px] text-ink-muted block">
                          Up to 8MB. Must be clear and easily readable.
                        </span>
                      </>
                    )}
                  </label>

                  <div className="pt-4 border-t-brutal flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl border-brutal bg-white px-5 py-2.5 font-display text-xs font-bold text-ink hover:bg-paper-deep btn-press"
                    >
                      ← Back
                    </button>

                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={goToStep3}
                      disabled={isUploadingPhoto || (!uploadedImageUrl && !aadhaarFileName)}
                    >
                      Continue to Step 3 →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payout Details & Platonic Commitment */}
              {step === 3 && (
                <form onSubmit={handleSubmit(onSubmitFinal)} className="space-y-5">
                  <div className="border-b-brutal-sm pb-2">
                    <h3 className="font-display text-lg font-black text-ink">
                      3. Where Should We Send Your Earnings?
                    </h3>
                    <p className="font-body text-xs text-ink-muted">
                      Your earnings are sent directly to your bank account after every completed meetup.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block font-display text-xs font-black uppercase text-ink">
                        Your UPI ID (Google Pay, PhonePe, Paytm, etc.)
                      </label>
                      <input
                        type="text"
                        {...register('upiId', { required: true })}
                        placeholder="e.g. mobile@okaxis or name@upi"
                        className="w-full rounded-xl border-brutal bg-white px-3.5 py-3 font-display text-xs sm:text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                      />
                      <span className="block text-[11px] text-ink-muted">
                        Double check your UPI handle to receive quick payments.
                      </span>
                    </div>

                    <div className="rounded-2xl border-brutal bg-paper-deep/40 p-4 space-y-1.5 text-xs text-ink">
                      <strong className="text-ink font-display font-black block">
                        Our Community Promise:
                      </strong>
                      <p className="font-body text-ink-soft leading-relaxed">
                        I agree to maintain a strictly platonic, respectful environment, meet members only in public venues, and follow all safety guidelines.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t-brutal flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={isSubmitting}
                      className="rounded-xl border-brutal bg-white px-5 py-2.5 font-display text-xs font-bold text-ink hover:bg-paper-deep btn-press disabled:opacity-50"
                    >
                      ← Back
                    </button>

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isSubmitting || !upiId.trim()}
                    >
                      {isSubmitting ? 'Submitting Details...' : 'Complete Verification →'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
