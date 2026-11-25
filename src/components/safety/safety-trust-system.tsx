'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SafeguardItem {
  title: string;
  color: string;
  iconPath: string;
  body: string;
}

const SAFEGUARDS: SafeguardItem[] = [
  {
    title: 'OTP-Verified Hosts',
    color: '#C8F53C',
    iconPath:
      'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M16 11l2 2 4-4',
    body: 'Every host verifies their real Indian mobile number via live SMS OTP, submits a clear public profile photo, sets preferred public venues, and signs our strictly platonic Code of Conduct—zero Aadhaar or biometric storage required.',
  },
  {
    title: 'Escrow Protection',
    color: '#FFB84D',
    iconPath: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
    body: 'Funds never go directly to the host upfront. Payment sits in an escrow vault until the meetup is mutually completed via code exchange. If a host cancels or fails to appear, your money is refunded automatically.',
  },
  {
    title: '4-Digit Start Codes',
    color: '#FF7AC6',
    iconPath: 'M4 9h16 M4 15h16 M10 3L8 21 M16 3l-2 18',
    body: "A unique 4-digit code is generated on the member's screen. When you meet in person, you verbally exchange this code. The host enters it to activate the timer. This prevents disputes and confirms physical presence.",
  },
  {
    title: 'Public Places Only',
    color: '#B7A2FF',
    iconPath:
      'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    body: 'Meetups are restricted to verified public spaces: cafés, malls, gym chains, cultural venues, and hotel lobbies. Private residences, hotel rooms, and secluded areas are strictly forbidden and trigger an instant ban.',
  },
  {
    title: '1-Tap SOS & Live Location',
    color: '#FF6B6B',
    iconPath:
      'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9v4 M12 17h.01',
    body: 'During an active meetup, both member and companion have access to a persistent SOS trigger. You can share your live coordinates with designated emergency contacts or alert local authorities directly.',
  },
  {
    title: 'Private by Default',
    color: '#34D399',
    iconPath:
      'M3 3l18 18 M10.6 6.1A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.9 M6.6 6.6A17 17 0 0 0 2 12s4 6 10 6a9.7 9.7 0 0 0 4-.9 M9.9 9.9a3 3 0 0 0 4.2 4.2',
    body: "Your phone number, email, and full legal address are never displayed publicly. All coordination happens through Meetzy Club's in-app communication channels to protect your personal privacy.",
  },
];

const TIP_DATA = [
  {
    lead: 'Always meet in broad daylight or well-lit public venues.',
    detail: 'Choose coffee shops, shopping centres, or popular public parks with steady foot traffic.',
  },
  {
    lead: 'Never accept off-platform payments.',
    detail:
      'If a host or member asks you to pay via UPI directly outside Meetzy Club, reject them immediately. Off-platform transactions void our escrow and safety protections.',
  },
  {
    lead: 'Trust your intuition.',
    detail:
      'If someone makes you feel uncomfortable at any point, leave the venue immediately, and notify our 24/7 safety team.',
  },
];

export function SafetyTrustSystem() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [readTips, setReadTips] = useState<Record<number, boolean>>({});
  const [animKey, setAnimKey] = useState(0);

  const n = SAFEGUARDS.length;
  const currentItem = SAFEGUARDS[active];

  // Auto-advance timer (4.5 seconds medium pace) when not paused and not hovered
  useEffect(() => {
    if (isPaused || isHovered) return;

    const timer = setTimeout(() => {
      setActive((prev) => (prev + 1) % n);
      setAnimKey((k) => k + 1);
    }, 4500);

    return () => clearTimeout(timer);
  }, [active, isPaused, isHovered, n]);

  const selectSafeguard = (index: number) => {
    setActive(index);
    setAnimKey((k) => k + 1);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % n);
    setAnimKey((k) => k + 1);
  };

  const handlePrev = () => {
    setActive((prev) => (prev + n - 1) % n);
    setAnimKey((k) => k + 1);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const toggleTip = (index: number) => {
    setReadTips((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const tipsReadCount = TIP_DATA.filter((_, i) => !!readTips[i]).length;
  const allTipsRead = tipsReadCount === TIP_DATA.length;

  return (
    <div className="w-full box-border bg-[#FFF9EA] text-[#111] font-sans py-12 px-4 sm:px-6 md:pb-24 flex flex-col items-center">
      <style jsx global>{`
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes fillProg {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        @keyframes sweep {
          to {
            background-size: 100% 78%;
          }
        }
        @keyframes pingDanger {
          0% {
            box-shadow: 0 0 0 0 rgba(229, 72, 77, 0.55);
          }
          100% {
            box-shadow: 0 0 0 12px rgba(229, 72, 77, 0);
          }
        }
        @keyframes pop {
          from {
            opacity: 0;
            transform: scale(0.4);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes stamp {
          from {
            opacity: 0;
            transform: rotate(-14deg) scale(1.9);
          }
          to {
            opacity: 1;
            transform: rotate(-8deg) scale(1);
          }
        }
        @keyframes radarRing {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes nudge {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        @keyframes bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .anim-rise {
          animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .anim-rise-d1 {
          animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.08s both;
        }
        .anim-rise-d2 {
          animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.18s both;
        }
        .anim-rise-d3 {
          animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both;
        }

        .highlight-mark {
          background: linear-gradient(#c8f53c, #c8f53c) left 88% / 0% 78% no-repeat;
          animation: sweep 0.7s 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .dot-ping {
          animation: pingDanger 1.6s ease-out infinite;
        }
        .anim-stamp {
          animation: stamp 0.55s 0.35s cubic-bezier(0.3, 1.6, 0.5, 1) both;
          transform: rotate(-8deg);
        }
        .anim-ring {
          animation: radarRing 1.9s ease-out infinite;
        }
        .anim-nudge {
          animation: nudge 1.4s ease-in-out infinite;
        }
        .anim-bob {
          animation: bob 2.4s ease-in-out infinite;
        }
        .anim-pop {
          animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both;
        }

        .tile-press {
          transition: background 0.25s ease, box-shadow 0.2s ease, transform 0.2s ease,
            translate 0.2s ease;
        }
        .tile-press:hover {
          translate: -2px -2px;
        }

        .pill-press {
          transition: translate 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
        }
        .pill-press:hover {
          translate: -2px -2px;
          box-shadow: 6px 6px 0 #111;
        }

        .tip-card-anim {
          transition: background 0.3s ease;
        }
      `}</style>

      <div className="w-full max-w-[960px] flex flex-col gap-11">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="anim-rise bg-[#DCC8FF] border-2 border-[#111] rounded-full px-3.5 py-1.5 text-[11px] font-extrabold tracking-widest uppercase">
            SAFETY ARCHITECTURE
          </span>

          <h1 className="anim-rise-d1 m-0 font-display font-extrabold text-[clamp(36px,6.4vw,64px)] leading-[1.08] tracking-[-0.02em] text-balance text-[#111]">
            Safety isn&apos;t a feature.
            <br />
            <span className="highlight-mark px-2 inline-block">It&apos;s the product.</span>
          </h1>

          <p className="anim-rise-d2 m-0 max-w-[600px] text-base leading-relaxed text-[#4a4a4a] text-balance">
            Meetzy Club was designed from day one around safety, trust, and accountability. Every host,
            member, payment, and meetup is governed by strict, verified safeguards.
          </p>
        </div>

        {/* EMERGENCY CALLOUT */}
        <div className="anim-rise-d3 border-2 border-[#E5484D] bg-[#FFE1E1] rounded-[20px] p-5 sm:p-6 flex flex-wrap gap-4 sm:gap-6 items-center justify-between">
          <div className="flex-1 basis-[360px] min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-xs font-extrabold tracking-wider text-[#B42318] uppercase">
              <span className="dot-ping w-2.5 h-2.5 rounded-full bg-[#E5484D] shrink-0" />
              IN-PERSON EMERGENCY IN INDIA?
            </div>
            <div className="font-display font-extrabold text-[clamp(20px,3.4vw,28px)] leading-tight text-[#111]">
              Dial{' '}
              <span className="border-b-[3px] border-[#E5484D] text-[#E5484D]">112</span> for
              immediate emergency police services.
            </div>
            <div className="text-sm leading-relaxed text-[#5a4545]">
              Our 24/7 Trust &amp; Safety Desk is monitored directly at{' '}
              <b className="text-[#111]">meetzyclub@gmail.com</b> with priority incident response
              within 15 minutes.
            </div>
          </div>

          <a
            href="tel:112"
            className="pill-press shrink-0 bg-[#FF6B6B] text-[#111] border-2 border-[#111] rounded-[14px] shadow-[4px_4px_0_#111] px-6 py-3.5 font-display font-extrabold text-lg"
          >
            Call 112
          </a>
        </div>

        {/* THE MEETZY CLUB TRUST SYSTEM: 6 TILES & DETAIL PANEL */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-baseline justify-between">
            <h2 className="m-0 font-display font-extrabold text-[clamp(24px,4vw,32px)] text-[#111]">
              The Meetzy Club Trust System
            </h2>
            <span className="text-sm font-medium text-[#555]">
              Tap any safeguard to see how it protects you
            </span>
          </div>

          {/* 6 Grid Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {SAFEGUARDS.map((s, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => selectSafeguard(idx)}
                  className={`tile-press text-left flex flex-col justify-between gap-3 min-w-0 min-h-[112px] p-3.5 border-2 border-[#111] rounded-[16px] text-[#111] ${
                    isActive
                      ? 'shadow-[2px_2px_0_#111] translate-x-[2px] translate-y-[2px]'
                      : 'bg-white shadow-[4px_4px_0_#111]'
                  }`}
                  style={{
                    backgroundColor: isActive ? s.color : '#ffffff',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-10 h-10 rounded-[10px] border-2 border-[#111] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#111"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d={s.iconPath} />
                      </svg>
                    </span>
                    <span className="font-display font-extrabold text-sm text-[#111] opacity-55">
                      {idx + 1}
                    </span>
                  </div>
                  <span className="font-display font-bold text-base leading-tight">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Detail Panel */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white border-2 border-[#111] rounded-[24px] shadow-[6px_6px_0_#111] p-4 sm:p-6 md:p-8 flex flex-col gap-6"
          >
            {/* Progress Indicator Segments */}
            <div className="flex gap-1.5">
              {SAFEGUARDS.map((_, i) => {
                const isDone = i < active;
                const isCurrent = i === active;
                return (
                  <div
                    key={i}
                    className="flex-1 min-w-0 h-1.5 rounded-full bg-[#EDE6D2] overflow-hidden"
                  >
                    {isDone && <div className="h-full bg-[#111]" />}
                    {isCurrent && (
                      <div
                        key={animKey}
                        className="h-full bg-[#111] origin-left"
                        style={{
                          animation: 'fillProg 4.5s linear forwards',
                          animationPlayState: isPaused || isHovered ? 'paused' : 'running',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Panel Body: Left Copy + Right Visual Mockup */}
            <div className="anim-rise flex flex-wrap gap-6 md:gap-8 items-center min-h-[300px]">
              {/* Left Column: Details */}
              <div className="flex-1 basis-[320px] min-w-0 flex flex-col gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-14 h-14 shrink-0 rounded-[16px] border-2 border-[#111] shadow-[3px_3px_0_#111] flex items-center justify-center"
                    style={{ backgroundColor: currentItem.color }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#111"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={currentItem.iconPath} />
                    </svg>
                  </div>
                  <div className="text-xs font-extrabold tracking-widest text-[#555] uppercase">
                    SAFEGUARD {active + 1} OF {n}
                  </div>
                </div>

                <h3 className="m-0 font-display font-extrabold text-[clamp(24px,4vw,34px)] leading-tight text-balance text-[#111]">
                  {currentItem.title}
                </h3>

                <p className="m-0 max-w-[60ch] text-[16.5px] leading-relaxed text-[#3d3d3d]">
                  {currentItem.body}
                </p>
              </div>

              {/* Right Column: Visual Mockup */}
              <div className="flex-1 basis-[280px] min-w-0 flex justify-center">
                <div className="w-full max-w-[320px] box-border bg-[#FFF9EA] border-2 border-[#111] rounded-[20px] shadow-[4px_4px_0_#111] p-4 flex flex-col gap-3.5 relative">
                  <span className="self-start text-[10px] font-extrabold tracking-widest text-[#555] border-[1.5px] border-[#111] rounded-full px-2 py-0.5 bg-white uppercase">
                    EXAMPLE
                  </span>

                  {/* 1. Verified Hosts Visual */}
                  {active === 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="relative bg-white border-2 border-[#111] rounded-[14px] p-3.5 flex gap-3 items-center">
                        <div className="w-[52px] h-[52px] rounded-[10px] border-2 border-[#111] bg-[#C8F53C] shrink-0 flex items-center justify-center">
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M20 21a8 8 0 0 0-16 0 M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <div className="h-2.5 w-[80%] bg-[#E4DCC3] rounded-md" />
                          <div className="h-2.5 w-[55%] bg-[#E4DCC3] rounded-md" />
                          <div className="h-2.5 w-[68%] bg-[#E4DCC3] rounded-md" />
                        </div>
                        <div className="anim-stamp absolute -right-1.5 -top-3.5 bg-[#C8F53C] border-2 border-[#111] rounded-[10px] px-2.5 py-1 font-display font-extrabold text-[13px] tracking-wider flex items-center gap-1 shadow-sm">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                          VERIFIED
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-white border-2 border-[#111] rounded-full px-2.5 py-0.5 text-xs font-bold">
                          SMS OTP
                        </span>
                        <span className="bg-white border-2 border-[#111] rounded-full px-2.5 py-0.5 text-xs font-bold">
                          Clear Photo
                        </span>
                        <span className="bg-white border-2 border-[#111] rounded-full px-2.5 py-0.5 text-xs font-bold">
                          Public Venues
                        </span>
                        <span className="bg-[#C8F53C] border-2 border-[#111] rounded-full px-2.5 py-0.5 text-xs font-bold">
                          Platonic Pledge
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. Escrow Protection Visual */}
                  {active === 1 && (
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex flex-col items-center gap-1.5 min-w-0">
                          <div className="w-[52px] h-[52px] rounded-[14px] border-2 border-[#111] bg-white flex items-center justify-center font-extrabold text-sm">
                            You
                          </div>
                        </div>
                        <svg
                          className="anim-nudge"
                          width="26"
                          height="14"
                          viewBox="0 0 26 14"
                          fill="none"
                          stroke="#111"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M2 7h20 M16 2l6 5-6 5" />
                        </svg>
                        <div className="anim-bob w-[68px] h-[68px] rounded-[18px] border-2 border-[#111] bg-[#FFB84D] shadow-[3px_3px_0_#111] flex items-center justify-center shrink-0">
                          <svg
                            width="34"
                            height="34"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#111"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4" />
                          </svg>
                        </div>
                        <svg
                          width="26"
                          height="14"
                          viewBox="0 0 26 14"
                          fill="none"
                          stroke="#111"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="opacity-35"
                        >
                          <path d="M2 7h20 M16 2l6 5-6 5" />
                        </svg>
                        <div className="flex flex-col items-center gap-1.5 min-w-0">
                          <div className="w-[52px] h-[52px] rounded-[14px] border-2 border-[#111] bg-white flex items-center justify-center font-extrabold text-sm">
                            Host
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="bg-white border-2 border-[#111] rounded-[12px] p-2 text-[13px] font-bold">
                          Held in escrow until the meetup is complete
                        </div>
                        <div className="bg-[#CFF5E3] border-2 border-[#111] rounded-[12px] p-2 text-[13px] font-bold">
                          Host cancels or no-show? Automatic refund
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. 4-Digit Start Codes Visual */}
                  {active === 2 && (
                    <div className="flex flex-col gap-3.5">
                      <div className="text-xs font-bold text-[#555]">
                        Start code on the member&apos;s screen
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="anim-pop flex-1 aspect-square max-w-[64px] bg-white border-2 border-[#111] rounded-[12px] shadow-[3px_3px_0_#111] flex items-center justify-center font-display font-extrabold text-[28px]"
                          style={{ animationDelay: '0.05s' }}
                        >
                          4
                        </div>
                        <div
                          className="anim-pop flex-1 aspect-square max-w-[64px] bg-white border-2 border-[#111] rounded-[12px] shadow-[3px_3px_0_#111] flex items-center justify-center font-display font-extrabold text-[28px]"
                          style={{ animationDelay: '0.15s' }}
                        >
                          8
                        </div>
                        <div
                          className="anim-pop flex-1 aspect-square max-w-[64px] bg-white border-2 border-[#111] rounded-[12px] shadow-[3px_3px_0_#111] flex items-center justify-center font-display font-extrabold text-[28px]"
                          style={{ animationDelay: '0.25s' }}
                        >
                          2
                        </div>
                        <div
                          className="anim-pop flex-1 aspect-square max-w-[64px] bg-[#FF7AC6] border-2 border-[#111] rounded-[12px] shadow-[3px_3px_0_#111] flex items-center justify-center font-display font-extrabold text-[28px]"
                          style={{ animationDelay: '0.35s' }}
                        >
                          7
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="bg-white border-2 border-[#111] rounded-[12px] p-2 text-[13px] font-bold">
                          You say the code out loud
                        </div>
                        <div className="bg-[#C8F53C] border-2 border-[#111] rounded-[12px] p-2 text-[13px] font-bold">
                          Host enters it and the timer starts
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Public Places Only Visual */}
                  {active === 3 && (
                    <div className="flex flex-col gap-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {['Café', 'Mall', 'Gym chain', 'Cultural venue', 'Hotel lobby'].map(
                          (place, pIdx) => (
                            <span
                              key={place}
                              className="anim-pop inline-flex items-center gap-1 bg-[#CFF5E3] border-2 border-[#111] rounded-full px-2.5 py-1 text-xs font-bold"
                              style={{ animationDelay: `${0.05 + pIdx * 0.07}s` }}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#111"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                              {place}
                            </span>
                          )
                        )}
                      </div>
                      <div className="h-[2px] bg-[#111] opacity-15" />
                      <div className="flex flex-wrap gap-1.5">
                        {['Private residence', 'Hotel room', 'Secluded area'].map((place, pIdx) => (
                          <span
                            key={place}
                            className="anim-pop inline-flex items-center gap-1 bg-[#FFD6D6] border-2 border-[#111] rounded-full px-2.5 py-1 text-xs font-bold"
                            style={{ animationDelay: `${0.45 + pIdx * 0.07}s` }}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#111"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M6 6l12 12 M18 6L6 18" />
                            </svg>
                            {place}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. 1-Tap SOS Visual */}
                  {active === 4 && (
                    <div className="flex flex-col items-center gap-4 py-2">
                      <div className="relative w-24 h-24 my-2">
                        <span className="anim-ring absolute inset-0 rounded-full bg-[#FF6B6B]" />
                        <span
                          className="anim-ring absolute inset-0 rounded-full bg-[#FF6B6B]"
                          style={{ animationDelay: '0.95s' }}
                        />
                        <div className="absolute inset-0 rounded-full bg-[#FF6B6B] border-2 border-[#111] shadow-[4px_4px_0_#111] flex items-center justify-center font-display font-extrabold text-2xl tracking-wider text-[#111]">
                          SOS
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white border-2 border-[#111] rounded-[12px] px-3 py-1.5 text-[13px] font-bold">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#111"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                        </svg>
                        Live location shared
                      </div>
                    </div>
                  )}

                  {/* 6. Private by Default Visual */}
                  {active === 5 && (
                    <div className="flex flex-col gap-2">
                      <div className="bg-white border-2 border-[#111] rounded-[12px] p-2 flex justify-between gap-2 text-[13px]">
                        <b>Phone</b>
                        <span className="tracking-widest text-[#555]">+91 ••••• •••••</span>
                      </div>
                      <div className="bg-white border-2 border-[#111] rounded-[12px] p-2 flex justify-between gap-2 text-[13px]">
                        <b>Email</b>
                        <span className="tracking-widest text-[#555]">••••••@••••.com</span>
                      </div>
                      <div className="bg-white border-2 border-[#111] rounded-[12px] p-2 flex justify-between gap-2 text-[13px]">
                        <b>Address</b>
                        <span className="tracking-widest text-[#555]">•••••••••••••</span>
                      </div>
                      <div className="bg-[#34D399] border-2 border-[#111] rounded-[12px] p-2 text-[13px] font-bold">
                        Chat happens inside Meetzy Club
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Controls: Back, Next, Pause/Resume */}
            <div className="flex flex-wrap gap-2.5 items-center pt-2">
              <button
                type="button"
                onClick={handlePrev}
                className="pill-press bg-white text-[#111] border-2 border-[#111] rounded-[12px] shadow-[3px_3px_0_#111] px-4 py-2 font-bold text-sm min-h-[44px]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="pill-press bg-[#C8F53C] text-[#111] border-2 border-[#111] rounded-[12px] shadow-[3px_3px_0_#111] px-4 py-2 font-bold text-sm min-h-[44px]"
              >
                Next
              </button>
              <button
                type="button"
                onClick={togglePause}
                className="pill-press ml-auto bg-white text-[#111] border-2 border-[#111] rounded-[12px] shadow-[3px_3px_0_#111] px-4 py-2 font-bold text-sm min-h-[44px]"
              >
                {isPaused ? 'Resume tour' : 'Pause tour'}
              </button>
            </div>
          </div>
        </div>

        {/* SAFETY TIPS FOR EVERY MEETUP */}
        <div className="bg-white border-2 border-[#111] rounded-[24px] shadow-[6px_6px_0_#111] p-5 sm:p-7 md:p-8 flex flex-col gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
            <h2 className="m-0 font-display font-extrabold text-[clamp(22px,3.6vw,28px)] text-[#111]">
              Our Safety Tips for Every Meetup
            </h2>
            <span className="bg-[#FFF9EA] border-2 border-[#111] rounded-full px-3 py-1 text-xs sm:text-sm font-extrabold">
              {tipsReadCount} of {TIP_DATA.length} read
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIP_DATA.map((tip, idx) => {
              const isRead = !!readTips[idx];
              return (
                <div
                  key={idx}
                  className="tip-card-anim border-2 border-[#111] rounded-[16px] shadow-[3px_3px_0_#111] p-4 flex flex-col gap-3 min-w-0"
                  style={{
                    backgroundColor: isRead ? '#F1FBCB' : '#FFF9EA',
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full border-2 border-[#111] flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isRead ? '#34D399' : '#ffffff',
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#111"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>

                  <div className="font-display font-bold text-base leading-snug text-[#111]">
                    {tip.lead}
                  </div>

                  <div className="text-sm leading-relaxed text-[#4a4a4a] flex-1">
                    {tip.detail}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTip(idx)}
                    className="pill-press self-start text-[#111] border-2 border-[#111] rounded-[10px] shadow-[2px_2px_0_#111] px-3.5 py-1.5 font-bold text-xs sm:text-sm min-h-[38px]"
                    style={{
                      backgroundColor: isRead ? '#C8F53C' : '#ffffff',
                    }}
                  >
                    {isRead ? 'Got it ✓' : 'Mark as read'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* All Tips Read Celebration Banner */}
          {allTipsRead && (
            <div className="anim-rise bg-[#C8F53C] border-2 border-[#111] rounded-[14px] p-4 font-display font-extrabold text-base sm:text-lg text-[#111]">
              You&apos;re ready to meet safely. Find a verified host next.
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/explore"
              className="pill-press bg-[#C8F53C] text-[#111] border-2 border-[#111] rounded-[14px] shadow-[4px_4px_0_#111] px-5 py-3 font-extrabold text-sm sm:text-base inline-block"
            >
              Browse Verified Hosts →
            </Link>
            <Link
              href="/community-guidelines"
              className="pill-press bg-white text-[#111] border-2 border-[#111] rounded-[14px] shadow-[4px_4px_0_#111] px-5 py-3 font-extrabold text-sm sm:text-base inline-block"
            >
              Read Community Guidelines
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
