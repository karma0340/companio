'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Calendar,
  Sparkles,
  Edit3,
  LogOut,
  Save,
  ArrowRight,
  KeyRound,
  Coins,
  Wallet,
  Copy,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/auth-context';
import { CITIES } from '@/lib/data/cities';
import { AvatarVector, GenderType } from '@/components/ui/avatar-vector';
import { validateIndianMobileNumber } from '@/lib/phone';

interface ProfileFormValues {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  bio: string;
  emergencyContact: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const { user, memberProfile, hostProfile, isAuthenticated, isLoading, refreshSession, logout } =
    useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activePass, setActivePass] = useState<any>(null);
  const [loadingPass, setLoadingPass] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const cleanPhone = (user?.phone || memberProfile?.phone || '').replace(/\D/g, '').slice(-10);
  const hasSavedPhone = cleanPhone.length === 10;
  const displayPhone = hasSavedPhone
    ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
    : (user?.email || 'No mobile linked');

  const gender: GenderType = (memberProfile?.gender as GenderType) === 'male' ? 'male' : 'female';
  const [editGender, setEditGender] = useState<GenderType>(gender);

  useEffect(() => {
    if (memberProfile?.gender) {
      setEditGender(memberProfile.gender === 'male' ? 'male' : 'female');
    }
  }, [memberProfile]);

  useEffect(() => {
    async function fetchPass() {
      try {
        const res = await fetch('/api/passes/active');
        const data = await res.json();
        if (data.isUnlocked && data.activePass) {
          setActivePass(data.activePass);
        }
      } catch (e) {
        // pass check optional
      } finally {
        setLoadingPass(false);
      }
    }
    if (isAuthenticated) {
      fetchPass();
    }
  }, [isAuthenticated]);

  const { register, handleSubmit, reset, watch } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: memberProfile?.fullName || '',
      phone: cleanPhone || '',
      city: memberProfile?.city || 'bengaluru',
      area: memberProfile?.area || '',
      bio: memberProfile?.bio || '',
      emergencyContact: memberProfile?.emergencyContact || '',
    },
  });

  const editedFullName = watch('fullName');
  const isProfileValid = Boolean(editedFullName && editedFullName.trim().length >= 2);

  // Sync form values when memberProfile or user loads
  useEffect(() => {
    if (memberProfile || user) {
      reset({
        fullName:
          memberProfile?.fullName === 'Meetzy Club Member' || memberProfile?.fullName === 'Member'
            ? user?.name && user.name !== 'Member'
              ? user.name
              : ''
            : memberProfile?.fullName || user?.name || '',
        phone: (user?.phone || memberProfile?.phone || '').replace(/\D/g, '').slice(-10),
        city: memberProfile?.city || user?.city || 'bengaluru',
        area: memberProfile?.area || user?.area || '',
        bio: memberProfile?.bio || user?.bio || '',
        emergencyContact: memberProfile?.emergencyContact || user?.emergencyContact || '',
      });
    }
  }, [memberProfile, user, reset]);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?next=/profile');
    }
  }, [isLoading, isAuthenticated, router]);

  // If profile is incomplete or still has placeholder name, redirect to profile creation form
  useEffect(() => {
    if (!isLoading && isAuthenticated && memberProfile) {
      if (!memberProfile.onboardingCompleted || !memberProfile.fullName || memberProfile.fullName === 'Meetzy Club Member') {
        router.push('/onboarding/member');
      }
    }
  }, [isLoading, isAuthenticated, memberProfile, router]);

  const onSaveProfile = async (data: ProfileFormValues) => {
    if (submitting) return;

    const trimmedName = data.fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Please enter your name (at least 2 characters).', 'Name Required');
      return;
    }

    if (data.phone && data.phone.trim().length > 0) {
      const phoneCheck = validateIndianMobileNumber(data.phone);
      if (!phoneCheck.isValid) {
        toast.error(phoneCheck.error || 'Please enter a valid 10-digit Indian mobile number.', 'Check Mobile Number');
        return;
      }
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
          phone: data.phone ? data.phone.replace(/\D/g, '').slice(-10) : '',
          fullName: trimmedName,
          gender: editGender,
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
      setIsEditing(false);
      toast.success('Your profile changes have been saved!', 'Profile Updated');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-paper">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 font-display font-black text-ink">
          Loading your profile...
        </main>
        <Footer />
      </div>
    );
  }

  const profileName = memberProfile?.fullName || 'Member';

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Card with Assigned Avatar */}
          <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal-lg flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <AvatarVector
                gender={gender}
                size="xl"
                bgVariant={gender === 'female' ? 'pink' : 'sky'}
                className="shadow-brutal"
              />

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge variant="lime" size="sm">
                    Verified Member
                  </Badge>
                  <span className="text-xs font-mono font-bold text-ink-muted">
                    {displayPhone}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-black text-ink">
                  {profileName}
                </h1>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold text-ink-soft">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-lavender" />
                    <span className="capitalize">{memberProfile?.city || 'Bengaluru'}</span>
                    {memberProfile?.area ? `, ${memberProfile.area}` : ''}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{gender} Member</span>
                </div>

                {memberProfile?.bio && (
                  <p className="font-body text-xs sm:text-sm text-ink-soft max-w-md pt-1">
                    "{memberProfile.bio}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <Button
                variant={isEditing ? 'outline' : 'primary'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
              </Button>
            </div>
          </div>

          {/* Wallet & Coins Card */}
          <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-ink" />
                  <h2 className="font-display text-lg font-black uppercase text-ink">
                    Wallet &amp; Coin Balance
                  </h2>
                </div>
                <p className="text-xs font-bold text-ink-soft">
                  Coins power direct in-app messaging with verified hosts (10 Coins/message). Meetup bookings are paid safely in INR via Razorpay Escrow.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border-brutal-sm bg-[#D4F7A5] px-4 py-2 text-ink shadow-brutal-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-ink/70">Balance</div>
                  <div className="font-display text-lg font-black">{user?.coinBalance ?? 100} Coins</div>
                </div>

                <Link href="/wallet">
                  <Button variant="primary" size="sm">
                    <span>Top Up Wallet →</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t-2 border-ink/10">
              <div className="rounded-xl border-2 border-ink bg-paper p-3 space-y-1">
                <div className="text-[10px] font-black uppercase text-ink-muted">Accept-First Chat</div>
                <div className="font-display text-sm font-black text-ink">10 Coins / message</div>
                <div className="text-[10px] font-medium text-ink-soft">Opens after Host accepts request</div>
              </div>

              <div className="rounded-xl border-2 border-ink bg-paper p-3 space-y-1">
                <div className="text-[10px] font-black uppercase text-ink-muted">Signup Bonus</div>
                <div className="font-display text-sm font-black text-ink">100 Free Coins</div>
                <div className="text-[10px] font-medium text-ink-soft">Used first for in-app chat messages</div>
              </div>

              <div className="rounded-xl border-2 border-ink bg-paper p-3 space-y-1">
                <div className="text-[10px] font-black uppercase text-ink-muted">Your Referral Code</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black tracking-wider text-ink">{user?.referralCode || 'COMPANIO'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (user?.referralCode && typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(user.referralCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }
                    }}
                    className="p-1 rounded hover:bg-paper-deep text-ink cursor-pointer"
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="text-[10px] font-medium text-ink-soft">Earn 100 coins per meetup</div>
                <Link href="/wallet" className="text-[10px] font-black text-ink underline hover:text-ink-soft block pt-0.5">
                  View Invite Stats and Ledger →
                </Link>
              </div>
            </div>
          </div>

          {/* Edit Form or Details View */}
          {isEditing ? (
            <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-6 animate-in fade-in">
              <div className="border-b-brutal-sm pb-3">
                <h2 className="font-display text-xl font-black text-ink">Edit Profile</h2>
                <p className="text-xs text-ink-muted">
                  Update your name, city, and details.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-5">
                {/* Gender Selection */}
                <div className="space-y-1.5">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditGender('male')}
                      className={`flex items-center justify-between rounded-xl border-brutal p-3 transition-all cursor-pointer ${
                        editGender === 'male'
                          ? 'bg-sky text-ink shadow-brutal-sm'
                          : 'bg-white text-ink hover:bg-paper-deep'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AvatarVector gender="male" size="sm" bgVariant="sky" />
                        <span className="font-display text-xs font-black">Male Member</span>
                      </div>
                      {editGender === 'male' && <Check className="h-4 w-4 text-ink" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditGender('female')}
                      className={`flex items-center justify-between rounded-xl border-brutal p-3 transition-all cursor-pointer ${
                        editGender === 'female'
                          ? 'bg-pink text-ink shadow-brutal-sm'
                          : 'bg-white text-ink hover:bg-paper-deep'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AvatarVector gender="female" size="sm" bgVariant="pink" />
                        <span className="font-display text-xs font-black">Female Member</span>
                      </div>
                      {editGender === 'female' && <Check className="h-4 w-4 text-ink" />}
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    Your Name
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: true })}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border-brutal bg-white px-3.5 py-2.5 font-display text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-display text-xs font-black uppercase text-ink">
                      Mobile Number (+91)
                    </label>
                    {hasSavedPhone && (
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded">
                        Saved
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-xs font-black text-ink-muted">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      readOnly={hasSavedPhone}
                      {...register('phone')}
                      placeholder="Enter 10-digit mobile number"
                      className={`w-full rounded-xl border-brutal pl-12 pr-4 py-2.5 font-mono text-sm font-bold text-ink focus:outline-none ${
                        hasSavedPhone ? 'bg-paper-deep/50 cursor-not-allowed' : 'bg-white focus:shadow-brutal'
                      }`}
                    />
                  </div>
                  {!hasSavedPhone && (
                    <span className="text-[11px] text-ink-muted block">
                      Add your 10-digit mobile number so your account works seamlessly across bookings and Host Studio.
                    </span>
                  )}
                </div>

                {/* City & Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-display text-xs font-black uppercase text-ink">
                      City
                    </label>
                    <select
                      {...register('city')}
                      className="w-full rounded-xl border-brutal bg-white px-3.5 py-2.5 font-display text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
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
                      Area
                    </label>
                    <input
                      type="text"
                      {...register('area')}
                      placeholder="e.g. Indiranagar, Koramangala, Bandra"
                      className="w-full rounded-xl border-brutal bg-white px-3.5 py-2.5 font-display text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                    />
                  </div>
                </div>

                {/* Short Bio */}
                <div className="space-y-1.5">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    About You
                  </label>
                  <textarea
                    rows={2}
                    {...register('bio')}
                    placeholder="Tell companions about your hobbies, favorite cafes, or gym routine..."
                    className="w-full rounded-xl border-brutal bg-white px-3.5 py-2.5 font-display text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="space-y-1.5">
                  <label className="block font-display text-xs font-black uppercase text-ink">
                    Emergency Contact Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-xs font-black text-ink-muted">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      {...register('emergencyContact')}
                      placeholder="Enter 10-digit number"
                      className="w-full rounded-xl border-brutal bg-white pl-12 pr-4 py-2.5 font-mono text-sm font-bold text-ink focus:outline-none focus:shadow-brutal"
                    />
                  </div>
                  <span className="text-[11px] text-ink-muted">
                    Kept strictly private and only used in emergencies.
                  </span>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button type="submit" variant="primary" size="md" disabled={submitting || !isProfileValid}>
                    <Save className="h-4 w-4" />
                    <span>{submitting ? 'Saving...' : 'Save Profile'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* Quick Access Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* My Meetups Card */}
              <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-lavender" />
                    <h3 className="font-display text-lg font-black text-ink">My Meetups</h3>
                  </div>
                  <Badge variant="lime" size="sm">
                    Protected
                  </Badge>
                </div>
                <p className="font-body text-xs text-ink-soft">
                  Track your booked companion sessions, check start codes, and review completed meetups.
                </p>
                <Link href="/bookings" className="block pt-2">
                  <Button variant="primary" size="sm" fullWidth>
                    <span>View All Meetups →</span>
                  </Button>
                </Link>
              </div>

              {/* Host Portal Promotion or Status */}
              <div className="rounded-2xl border-brutal bg-sunny p-6 shadow-brutal space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-ink" />
                    <h3 className="font-display text-lg font-black text-ink">
                      {hostProfile?.verificationStatus === 'approved'
                        ? 'Host Portal Active'
                        : 'Earn as a Companion'}
                    </h3>
                  </div>
                  <Badge variant="dark" size="sm">
                    {hostProfile?.verificationStatus === 'approved' ? 'Verified' : '₹600/hr'}
                  </Badge>
                </div>

                <p className="font-body text-xs text-ink-soft">
                  {hostProfile?.verificationStatus === 'approved'
                    ? 'Manage your incoming meetup requests, code verifications, and available earnings wallet.'
                    : 'Get paid to accompany verified members to cafes, gym workouts, movies, and city walks.'}
                </p>

                {hostProfile?.verificationStatus === 'approved' ? (
                  <Link href="/companion/dashboard" className="block pt-2">
                    <Button variant="dark" size="sm" fullWidth>
                      <KeyRound className="h-4 w-4" />
                      <span>Open Host Dashboard →</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/become-a-companion" className="block pt-2">
                    <Button variant="dark" size="sm" fullWidth>
                      <span>Apply to Become a Host →</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Account Security & Sign Out Section */}
          <div className="rounded-2xl border-brutal bg-white p-6 shadow-brutal flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display text-sm font-black text-ink">Account Security</h4>
              <p className="text-xs text-ink-muted">
                {hasSavedPhone
                  ? `Logged in on this device via verified phone number ${displayPhone}.`
                  : user?.email
                  ? `Logged in on this device via ${user.email}.`
                  : 'Logged in on this device via Meetzy Club.'}
              </p>
            </div>

            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                await logout();
              }}
              className="inline-flex items-center gap-2 rounded-xl border-brutal bg-danger/10 px-4 py-2 font-display text-xs font-black text-danger hover:bg-danger hover:text-white transition-colors btn-press cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out of Meetzy Club</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
