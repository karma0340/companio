'use client';

import React from 'react';

export type GenderType = 'female' | 'male' | 'other';

interface AvatarVectorProps {
  gender?: GenderType | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  bgVariant?: 'sunny' | 'lime' | 'pink' | 'lavender' | 'sky';
}

const BG_COLORS = {
  sunny: '#FFE600',
  lime: '#A3E635',
  pink: '#FF4D8D',
  lavender: '#8B5CF6',
  sky: '#38BDF8',
};

export function AvatarVector({
  gender = 'female',
  size = 'md',
  className = '',
  bgVariant = 'sunny',
}: AvatarVectorProps) {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
    xl: 'h-32 w-32',
  };

  const isMale = gender === 'male';
  const bgColor = BG_COLORS[bgVariant] || BG_COLORS.sunny;

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-2xl border-brutal bg-white overflow-hidden shadow-brutal-sm ${sizeMap[size]} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {isMale ? (
        /* Male Flat Vector Character (Neo-Brutalist clean geometric vector) */
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle / head backdrop */}
          <circle cx="50" cy="50" r="46" fill={bgColor} />

          {/* Shoulders / Torso with jacket */}
          <path
            d="M18 96 C18 78 30 72 50 72 C70 72 82 78 82 96 Z"
            fill="#1E293B"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Inner Shirt Collar */}
          <path
            d="M42 72 L50 82 L58 72 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Neck */}
          <rect
            x="43"
            y="56"
            width="14"
            height="18"
            fill="#FFD2A6"
            stroke="#000000"
            strokeWidth="3"
          />

          {/* Head & Ears */}
          <circle cx="31" cy="46" r="6" fill="#FFD2A6" stroke="#000000" strokeWidth="3" />
          <circle cx="69" cy="46" r="6" fill="#FFD2A6" stroke="#000000" strokeWidth="3" />
          <ellipse
            cx="50"
            cy="46"
            rx="19"
            ry="22"
            fill="#FFD2A6"
            stroke="#000000"
            strokeWidth="3.5"
          />

          {/* Cool Modern Haircut (Flat dark vector with stylish swept quiff) */}
          <path
            d="M30 40 C30 26 38 18 50 18 C64 18 70 24 70 34 C64 30 54 28 44 32 C36 34 32 37 30 40 Z"
            fill="#0F172A"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M30 38 L30 46 C32 46 34 42 34 40 Z"
            fill="#0F172A"
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* Eyes (Friendly geometric dots) */}
          <circle cx="43" cy="46" r="3" fill="#000000" />
          <circle cx="57" cy="46" r="3" fill="#000000" />

          {/* Eyebrows */}
          <path d="M40 40 L46 40" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 40 L60 40" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />

          {/* Smile */}
          <path
            d="M45 54 Q50 59 55 54"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ) : (
        /* Female Flat Vector Character (Neo-Brutalist clean geometric vector) */
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle cx="50" cy="50" r="46" fill={bgColor} />

          {/* Long Hair Back Flow */}
          <path
            d="M26 42 C24 64 26 78 30 88 C34 94 66 94 70 88 C74 78 76 64 74 42 C74 22 66 16 50 16 C34 16 26 22 26 42 Z"
            fill="#18181B"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Shoulders / Torso with pastel crewneck */}
          <path
            d="M20 96 C20 80 32 74 50 74 C68 74 80 80 80 96 Z"
            fill="#FF4D8D"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Neck */}
          <rect
            x="44"
            y="58"
            width="12"
            height="18"
            fill="#FFDEB8"
            stroke="#000000"
            strokeWidth="3"
          />

          {/* Face */}
          <ellipse
            cx="50"
            cy="48"
            rx="18"
            ry="20"
            fill="#FFDEB8"
            stroke="#000000"
            strokeWidth="3.5"
          />

          {/* Front Hair Bangs / Parting */}
          <path
            d="M32 40 C34 26 42 22 50 22 C58 22 66 26 68 40 C62 34 56 32 50 34 C44 32 38 34 32 40 Z"
            fill="#18181B"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Cute Hoop Earrings */}
          <circle cx="31" cy="52" r="3.5" stroke="#FFE600" strokeWidth="2.5" fill="none" />
          <circle cx="69" cy="52" r="3.5" stroke="#FFE600" strokeWidth="2.5" fill="none" />

          {/* Eyes with Lashes */}
          <circle cx="43" cy="48" r="2.8" fill="#000000" />
          <circle cx="57" cy="48" r="2.8" fill="#000000" />
          <path d="M41 45 L39 43" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
          <path d="M59 45 L61 43" stroke="#000000" strokeWidth="2" strokeLinecap="round" />

          {/* Cheerful Blush Dots */}
          <circle cx="38" cy="53" r="3" fill="#FDA4AF" opacity="0.8" />
          <circle cx="62" cy="53" r="3" fill="#FDA4AF" opacity="0.8" />

          {/* Bright Smile */}
          <path
            d="M45 56 Q50 61 55 56"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}
