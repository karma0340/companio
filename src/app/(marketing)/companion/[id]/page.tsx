import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Camera,
  Star,
  MapPin,
  Languages,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Clock,
  HeartHandshake,
  Users,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PriceSummary } from '@/components/booking/price-summary';
import { Badge } from '@/components/ui/badge';
import { ActivityIcon } from '@/components/ui/activity-icon';
import { StatusPulse } from '@/components/ui/status-pulse';
import { getCompanionById, getCompanions } from '@/lib/data';
import { ACTIVITIES } from '@/lib/data/activities';
import { ActivityCategory } from '@/lib/types';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface CompanionProfilePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CompanionProfilePageProps): Promise<Metadata> {
  const companion = await getCompanionById(params.id);
  if (!companion) return { title: 'Companion Not Found | Meetzy Club' };

  return {
    title: `${companion.name}, ${companion.age} — Verified Companion in ${companion.area} (₹${companion.hourlyRate}/hr) | Meetzy Club`,
    description: `Book a verified meetup with ${companion.name} in ${companion.area}. "${companion.tagline}" 100% platonic & escrow protected on Meetzy Club.`,
  };
}

export default async function CompanionProfilePage({ params }: CompanionProfilePageProps) {
  const id = params.id;
  const companion = await getCompanionById(id);

  if (!companion) {
    notFound();
  }

  const companionActivities = companion.activities
    .map((slug) => ACTIVITIES.find((a) => a.slug === slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back Link */}
          <div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 font-display text-xs font-black text-ink hover:text-lavender transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all companions</span>
            </Link>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols): Companion Details & Schedule */}
            <div className="lg:col-span-8 space-y-8">
              {/* Profile Header Card */}
              <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Avatar */}
                  <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-2xl border-brutal bg-paper-deep shadow-brutal-sm">
                    <Image
                      src={companion.avatarUrl}
                      alt={companion.name}
                      fill
                      sizes="(max-width: 640px) 112px, 144px"
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Identity Info */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="font-display text-3xl sm:text-4xl font-black text-ink">
                        {companion.name}
                      </h1>
                      <span className="font-display text-2xl font-bold text-ink-muted">
                        · {companion.age}
                      </span>

                      {companion.isFreeToday && (
                        <Badge variant="lime" size="sm" className="inline-flex items-center gap-1.5">
                          <StatusPulse size="xs" status="active" />
                          <span>Free Today</span>
                        </Badge>
                      )}

                      {companion.acceptsWomenOnly && (
                        <Badge variant="pink" size="sm" className="inline-flex items-center gap-1.5">
                          <ShieldCheck className="h-3 w-3 text-pink-700 stroke-[2.25]" />
                          <span>Women Hosts Only</span>
                        </Badge>
                      )}
                    </div>

                    <p className="font-display text-base sm:text-lg font-bold text-ink-soft leading-snug">
                      "{companion.tagline}"
                    </p>

                    {/* Verification Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border-brutal-sm bg-lime px-2.5 py-1 text-xs font-black uppercase text-ink shadow-brutal-sm">
                        <ShieldCheck className="h-4 w-4" />
                        Mobile OTP Verified
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-lg border-brutal-sm bg-sunny px-2.5 py-1 text-xs font-black uppercase text-ink shadow-brutal-sm">
                        <Camera className="h-4 w-4" />
                        Photo Reviewed
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-lg border-brutal-sm bg-pink-soft px-2.5 py-1 text-xs font-black uppercase text-ink">
                        <HeartHandshake className="h-4 w-4" />
                        100% Platonic
                      </span>
                    </div>

                    {/* Location, Stats & Languages */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-bold text-ink-soft">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-ink" />
                        <span>
                          {companion.area}, {companion.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-sunny text-ink" />
                        <span className="font-extrabold text-ink">{companion.rating.toFixed(1)}</span>
                        <span>({companion.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-ink" />
                        <span>{companion.meetupsCount} meetups</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Languages className="h-3.5 w-3.5 text-ink" />
                        <span>{companion.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-3 pt-4 border-t-brutal-sm">
                  <h3 className="font-display text-lg font-black text-ink">About {companion.name}</h3>
                  <p className="font-body text-sm sm:text-base text-ink-soft leading-relaxed whitespace-pre-line">
                    {companion.about}
                  </p>
                </div>
              </div>

              {/* Activities Offered Section */}
              <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-black text-ink">
                    What {companion.name} is Up For
                  </h3>
                  <p className="font-body text-xs text-ink-soft">
                    Choose one of these approved activities when booking your session.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {companionActivities.map((act) => act && (
                    <div
                      key={act.slug}
                      className="flex items-center gap-3.5 rounded-2xl border-brutal-sm bg-paper p-3.5 shadow-brutal-xs"
                    >
                      <ActivityIcon slug={act.slug} size="md" variant="tile" animated />
                      <div>
                        <h4 className="font-display text-sm font-extrabold text-ink">
                          {act.name}
                        </h4>
                        <p className="font-body text-xs text-ink-soft mt-0.5">
                          {act.tagline}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Availability Schedule */}
              <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-4">
                <h3 className="font-display text-xl font-black text-ink flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-ink" />
                  <span>Availability Schedule</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {companion.availability.map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border-brutal-sm bg-paper-deep p-3 text-xs font-bold"
                    >
                      <span className="text-ink">{slot.days}</span>
                      <span className="font-mono text-ink-muted flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {slot.hours}
                      </span>
                    </div>
                  ))}
                </div>

                {companion.preferredVenues && companion.preferredVenues.length > 0 && (
                  <div className="pt-3 border-t-brutal-sm space-y-2">
                    <p className="font-display text-xs font-black uppercase tracking-wider text-ink-muted">
                      Preferred Public Venues
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {companion.preferredVenues.map((venue) => (
                        <span
                          key={venue}
                          className="inline-flex items-center gap-1 rounded-lg border-brutal-sm bg-sunny/60 px-2.5 py-1 text-xs font-bold text-ink"
                        >
                          <MapPin className="h-3 w-3 text-ink" />
                          {venue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-black text-ink">
                    Verified Reviews ({companion.reviews.length})
                  </h3>
                  <div className="flex items-center gap-1 rounded-lg border-brutal-sm bg-sunny px-2 py-0.5 text-xs font-black text-ink">
                    <Star className="h-3.5 w-3.5 fill-ink text-ink" />
                    <span>{companion.rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {companion.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border-brutal-sm bg-paper p-4 space-y-2 shadow-brutal-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-black text-ink">
                            {rev.authorName}
                          </span>
                          <span className="text-xs text-ink-muted">· {rev.authorCity}</span>
                        </div>
                        <span className="text-[11px] text-ink-muted">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        <Badge variant="lime" size="sm">
                          {rev.activityName}
                        </Badge>
                        <div className="flex text-sunny">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-sunny text-ink" />
                          ))}
                        </div>
                      </div>

                      <p className="font-body text-xs sm:text-sm text-ink-soft leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Sticky Price Calculator & Book Button */}
            <div className="lg:col-span-4">
              <PriceSummary companion={companion} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
