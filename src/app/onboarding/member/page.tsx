'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { CheckCircle2, MapPin, Navigation, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import { CITIES } from '@/lib/data/cities';
import { AvatarVector, GenderType } from '@/components/ui/avatar-vector';

interface OnboardingFormValues {
  fullName: string;
  gender: 'female' | 'male';
  city: string;
  area: string;
  bio: string;
  emergencyContact: string;
  referralCode?: string;
}

const POPULAR_QUICK_CITIES = [
  { slug: 'chandigarh', label: 'Chandigarh' },
  { slug: 'mohali', label: 'Mohali' },
  { slug: 'panchkula', label: 'Panchkula' },
  { slug: 'delhi', label: 'Delhi NCR' },
  { slug: 'mumbai', label: 'Mumbai' },
  { slug: 'bengaluru', label: 'Bengaluru' },
  { slug: 'pune', label: 'Pune' },
  { slug: 'hyderabad', label: 'Hyderabad' },
];

export default function MemberOnboardingPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, refreshSession } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState<{
    cityName: string;
    area: string;
  } | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderType | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm<OnboardingFormValues>({
    defaultValues: {
      fullName: '',
      gender: 'male',
      city: 'bengaluru',
      area: '',
      bio: '',
      emergencyContact: '',
      referralCode: '',
    },
  });

  // Pre-fill name from Google or existing auth profile
  React.useEffect(() => {
    if (user?.name && user.name !== 'Member') {
      setValue('fullName', user.name);
    }
  }, [user, setValue]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRef = localStorage.getItem('companio_referral_code');
      if (savedRef) {
        setValue('referralCode', savedRef.toUpperCase());
      }
    }
  }, [setValue]);

  const currentCity = watch('city');
  const fullName = watch('fullName');
  const emergencyContact = watch('emergencyContact');
  const isNameValid = Boolean(fullName && fullName.trim().length >= 2);
  const isEmergencyValid = !emergencyContact || emergencyContact.trim().length === 0 || emergencyContact.replace(/\D/g, '').length === 10;
  const isGenderValid = selectedGender !== null;
  const canSubmit = isNameValid && isEmergencyValid && isGenderValid;

  const handleGenderSelect = (gender: 'female' | 'male') => {
    setSelectedGender(gender);
    setValue('gender', gender);
  };

  const handleQuickCitySelect = (slug: string) => {
    setValue('city', slug, { shouldValidate: true });
    setLocationDetected(null);
  };

  const handleDetectLiveLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.', 'Location Error');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const res = await fetch(`/api/location/detect?lat=${lat}&lng=${lng}`);
          const data = await res.json();

          if (res.ok && data.success) {
            setValue('city', data.city, { shouldValidate: true });
            if (data.area) {
              setValue('area', data.area, { shouldValidate: true });
            }
            setLocationDetected({
              cityName: data.cityName,
              area: data.area || '',
            });
            toast.success(
              `Live location set to ${data.cityName}${data.area ? ` (${data.area})` : ''}`,
              'Location Detected'
            );
          } else {
            toast.error(
              'Could not pinpoint exact city from coordinates. Please select your city below.',
              'Location Check'
            );
          }
        } catch {
          toast.error(
            'Unable to resolve coordinates. Please select your city manually.',
            'Location Error'
          );
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        let errorMsg = 'Please allow location permission in your browser or select your city manually.';
        if (err.code === 1) {
          errorMsg = 'Location permission denied. Please enable location access or select manually.';
        }
        toast.error(errorMsg, 'Location Permission');
      },
      {
        timeout: 8000,
        enableHighAccuracy: true,
        maximumAge: 60000,
      }
    );
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    if (submitting) return;

    if (!selectedGender) {
      toast.error('Please select your gender (Male or Female).', 'Gender Required');
      return;
    }

    const trimmedName = data.fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Please enter your name (at least 2 characters).', 'Name Required');
      return;
    }

    if (data.emergencyContact) {
      const cleanContact = data.emergencyContact.replace(/\D/g, '');
      if (cleanContact.length !== 10) {
        toast.error('Emergency contact number must be exactly 10 digits.', 'Check Phone Number');
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/user/member-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          fullName: trimmedName,
          gender: selectedGender,
        }),
      });

      let json: any = {};
      try {
        json = await res.json();
      } catch {
        // Fallback for non-JSON response
      }

      if (!res.ok) {
        if (res.status === 401) {
          toast.error(
            'Your login session has expired. Please sign in again with your mobile number.',
            'Session Expired'
          );
          router.push('/login');
          return;
        }

        toast.error(
          json.error || (res.status >= 500
            ? 'Unable to save your details right now. Please try again in a moment.'
            : 'Please check your details and try again.'),
          'Unable to Save Profile'
        );
        return;
      }

      await refreshSession();
      toast.success('Your profile is ready! Welcome to Meetzy Club.', 'Profile Completed');
      router.push('/explore');
    } catch (err) {
      const isNetwork = typeof navigator !== 'undefined' && (!navigator.onLine || (err instanceof Error && err.message.toLowerCase().includes('fetch')));
      const friendlyMessage = isNetwork
        ? 'Unable to connect to the server. Please check your internet connection and try again.'
        : 'Something went wrong while saving your profile. Please try again.';
      toast.error(friendlyMessage, 'Connection Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-lg rounded-3xl border-brutal bg-white p-6 sm:p-10 shadow-brutal-lg space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Badge variant="lime" size="sm">
                Profile Setup
              </Badge>
              <Badge variant="sunny" size="sm">
                +100 Coins Active
              </Badge>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black text-ink">
              Create Your Profile
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-soft leading-relaxed">
              Add your basic details so verified companions know who they are meeting.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="block font-display text-xs font-black uppercase text-ink">
                Select Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGenderSelect('female')}
                  className={`flex items-center justify-between rounded-xl border-brutal p-3.5 transition-all cursor-pointer ${selectedGender === 'female'
                    ? 'bg-pink text-ink shadow-brutal-sm'
                    : 'bg-white text-ink hover:bg-paper-deep'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AvatarVector gender="female" size="sm" bgVariant="pink" />
                    <span className="font-display text-sm font-black">Female</span>
                  </div>
                  {selectedGender === 'female' && <CheckCircle2 className="h-4 w-4 text-ink" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenderSelect('male')}
                  className={`flex items-center justify-between rounded-xl border-brutal p-3.5 transition-all cursor-pointer ${selectedGender === 'male'
                    ? 'bg-sky text-ink shadow-brutal-sm'
                    : 'bg-white text-ink hover:bg-paper-deep'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AvatarVector gender="male" size="sm" bgVariant="sky" />
                    <span className="font-display text-sm font-black">Male</span>
                  </div>
                  {selectedGender === 'male' && <CheckCircle2 className="h-4 w-4 text-ink" />}
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="block font-display text-xs font-black uppercase text-ink">
                Your Name
              </label>
              <input
                type="text"
                {...register('fullName', { required: true })}
                placeholder="Enter your name"
                className="w-full rounded-xl border-brutal bg-paper-deep/30 px-3.5 py-3 font-display text-sm font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal"
              />
              <span className="text-[11px] text-ink-muted">
                This name will be shown when you request a meetup.
              </span>
            </div>

            {/* Live Location / City Section */}
            <div className="space-y-3 rounded-2xl border-2 border-ink bg-paper/60 p-4 shadow-brutal-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-display text-xs font-black uppercase text-ink">
                  <MapPin className="h-4 w-4 text-ink shrink-0" />
                  <span>Your Location</span>
                </div>

                <button
                  type="button"
                  onClick={handleDetectLiveLocation}
                  disabled={detectingLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-ink bg-[#D4F7A5] hover:bg-[#c3ec8d] font-display text-xs font-black text-ink shadow-brutal-xs active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {detectingLocation ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-ink" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="h-3.5 w-3.5 text-ink" />
                      <span>Detect Live Location</span>
                    </>
                  )}
                </button>
              </div>

              {locationDetected && (
                <div className="flex items-center gap-2 rounded-xl border border-ink bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>
                    Detected: {locationDetected.cityName}
                    {locationDetected.area ? ` (${locationDetected.area})` : ''}
                  </span>
                </div>
              )}

              {/* Quick-tap City Pills */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-ink-muted">
                  Quick Select City:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_QUICK_CITIES.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => handleQuickCitySelect(c.slug)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${currentCity === c.slug
                        ? 'border-ink bg-ink text-paper shadow-brutal-xs'
                        : 'border-ink/30 bg-white text-ink hover:border-ink hover:bg-paper-deep'
                        }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Dropdown & Area Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block font-display text-[11px] font-black uppercase text-ink">
                    City Dropdown
                  </label>
                  <select
                    {...register('city')}
                    className="w-full rounded-xl border-brutal bg-white px-3 py-2.5 font-display text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                  >
                    {CITIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-display text-[11px] font-black uppercase text-ink">
                    Neighbourhood / Area
                  </label>
                  <input
                    type="text"
                    {...register('area')}
                    placeholder="e.g. Sector 17, Phase 7, Indiranagar"
                    className="w-full rounded-xl border-brutal bg-white px-3 py-2.5 font-display text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                  />
                </div>
              </div>
            </div>

            {/* About You */}
            <div className="space-y-1.5">
              <label className="block font-display text-xs font-black uppercase text-ink">
                About You (Optional)
              </label>
              <textarea
                rows={2}
                {...register('bio')}
                placeholder="e.g. Love coffee chats, gym workouts, and exploring new cafes."
                className="w-full rounded-xl border-brutal bg-paper-deep/30 px-3.5 py-2.5 font-display text-xs sm:text-sm font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal"
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1.5">
              <label className="block font-display text-xs font-black uppercase text-ink">
                Emergency Contact Number (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-xs font-black text-ink-muted">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  {...register('emergencyContact')}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border-brutal bg-paper-deep/30 pl-12 pr-4 py-3 font-mono text-sm font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal"
                />
              </div>
              <span className="text-[11px] text-ink-muted">
                Kept strictly confidential. Used only if SOS is triggered during a meetup.
              </span>
            </div>

            {/* Referral Code */}
            <div className="space-y-1.5">
              <label className="block font-display text-xs font-black uppercase text-ink">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                maxLength={10}
                {...register('referralCode')}
                placeholder="e.g. HLTCC8QF"
                className="w-full rounded-xl border-brutal bg-paper-deep/30 px-3.5 py-3 font-mono text-sm font-bold text-ink uppercase focus:bg-white focus:outline-none focus:shadow-brutal"
              />
              <span className="text-[11px] text-ink-muted">
                Were you invited by a friend? Enter their referral code so they earn 100 coins after your first meetup!
              </span>
            </div>

            {!canSubmit && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-900 animate-in fade-in space-y-1">
                {!isGenderValid && <div>• Please select your gender (Male or Female).</div>}
                {!isNameValid && <div>• Please enter your full name (at least 2 characters).</div>}
                {!isEmergencyValid && <div>• Emergency contact number must be exactly 10 digits.</div>}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={submitting || !canSubmit}
            >
              {submitting ? 'Saving Profile...' : 'Complete Profile & Explore Companions →'}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
