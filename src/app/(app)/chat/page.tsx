"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ShieldCheck, MapPin, Clock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingRecord } from "@/lib/bookings";
import { useAuth } from "@/context/auth-context";

export default function ChatIndexPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        }
      })
      .catch((err) => console.error("Error fetching bookings for chat index:", err))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="rounded-3xl border-brutal bg-sunny p-6 sm:p-8 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-white px-3 py-1 text-xs font-black uppercase text-ink shadow-brutal-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                <span>Shielded In-App Messaging</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-ink">
                Meetup Conversations
              </h1>
              <p className="text-xs sm:text-sm font-bold text-ink-soft">
                Coordinate public venue meetups safely—phone numbers stay masked automatically.
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-ink bg-ink text-white px-5 py-2.5 text-xs font-black uppercase shadow-brutal-sm hover:bg-black transition shrink-0"
            >
              <Sparkles className="h-4 w-4 text-lime" />
              <span>Explore Hosts</span>
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="rounded-3xl border-brutal bg-white p-12 text-center shadow-brutal">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-ink" />
            </div>
          ) : !isAuthenticated ? (
            <div className="rounded-3xl border-brutal bg-white p-10 text-center shadow-brutal space-y-4">
              <MessageSquare className="mx-auto h-10 w-10 text-ink-muted" />
              <h2 className="font-display text-xl font-black text-ink">Sign in to view conversations</h2>
              <p className="text-xs text-ink-soft max-w-sm mx-auto">
                Verify your mobile number via SMS OTP to access your shielded booking chats.
              </p>
              <Link
                href="/login?next=/chat"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-ink text-white px-6 py-2.5 text-xs font-black uppercase shadow-brutal-sm"
              >
                <span>Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-3xl border-brutal bg-white p-10 text-center shadow-brutal space-y-3">
              <MessageSquare className="mx-auto h-9 w-9 text-ink-muted" />
              <p className="font-display text-lg font-black text-ink">No active conversations yet</p>
              <p className="text-xs text-ink-soft max-w-sm mx-auto">
                Unlock a direct chat or request a meetup from any companion profile to start talking.
              </p>
              <div className="pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-ink bg-lime text-ink font-black px-6 py-2.5 text-xs uppercase shadow-brutal-sm hover:bg-sunny transition"
                >
                  <span>Browse Companions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((b) => {
                const isHostViewer = Boolean(user?.id && b.companionUserId === user.id);
                const partnerName = isHostViewer ? b.memberName : b.companionName;
                return (
                <Link
                  key={b.id}
                  href={`/chat/${b.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-brutal bg-white p-5 shadow-brutal transition hover:shadow-brutal-lg"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-paper-deep flex items-center justify-center">
                      {isHostViewer ? (
                        <span className="font-display text-lg font-black text-ink">
                          {partnerName.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={b.companionAvatar}
                          alt={partnerName}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-base font-black text-ink truncate">
                          {partnerName}
                        </h2>
                        <span className="rounded-lg border border-ink bg-paper px-2 py-0.5 text-[10px] font-black uppercase text-ink">
                          {isHostViewer ? "Member" : "Host"}
                        </span>
                        <span className="rounded-lg border border-ink bg-[#D4F7A5] px-2 py-0.5 text-[10px] font-black uppercase text-ink">
                          {b.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-ink-muted">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 text-ink shrink-0" />
                          <span>{b.venueName}</span>
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-ink shrink-0" />
                          <span>
                            {new Date(b.scheduledDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              timeZone: "Asia/Kolkata",
                            })}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-xl border-2 border-ink bg-ink text-white px-4 py-2 text-xs font-black uppercase shadow-brutal-xs group-hover:bg-black transition">
                      <span>Open Chat</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
