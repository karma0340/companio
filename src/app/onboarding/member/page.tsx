'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
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
}

export default function MemberOnboardingPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, refreshSession } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [selectedGender, setSelectedGender] = useState<GenderType>('female');

  const { register, handleSubmit, setValue } = useForm<OnboardingFormValues>({
    defaultValues: {
      fullName: '',
      gender: 'female',
      city: 'bengaluru',
      area: '',
      bio: '',
      emergencyContact: '',
    },
  });

  const handleGenderSelect = (gender: 'female' | 'male') => {
    setSelectedGender(gender);
    setValue('gender', gender);
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    if (submitting) return;

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
      toast.success('Your profile is ready! Welcome to Togethr.', 'Profile Completed');
      router.push('/profile');
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
                  className={`flex items-center justify-between rounded-xl border-brutal p-3.5 transition-all cursor-pointer ${
                    selectedGender === 'female'
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
                  className={`flex items-center justify-between rounded-xl border-brutal p-3.5 transition-all cursor-pointer ${
                    selectedGender === 'male'
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

            {/* City & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-display text-xs font-black uppercase text-ink">
                  Your City
                </label>
                <select
                  {...register('city')}
                  className="w-full rounded-xl border-brutal bg-white px-3.5 py-3 font-display text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                >
                  {CITIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-display text-xs font-black uppercase text-ink">
                  Your Area
                </label>
                <input
                  type="text"
                  {...register('area')}
                  placeholder="e.g. Indiranagar, HSR, Bandra"
                  className="w-full rounded-xl border-brutal bg-paper-deep/30 px-3.5 py-3 font-display text-sm font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal"
                />
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
                  placeholder="98765 43210"
                  className="w-full rounded-xl border-brutal bg-paper-deep/30 pl-12 pr-4 py-3 font-mono text-sm font-bold text-ink focus:bg-white focus:outline-none focus:shadow-brutal"
                />
              </div>
              <span className="text-[11px] text-ink-muted">
                Kept strictly private and only used in emergencies.
              </span>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={submitting}
              >
                <span>{submitting ? 'Saving your details...' : 'Save & Continue →'}</span>
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
