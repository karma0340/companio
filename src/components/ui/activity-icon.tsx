'use client';

import React from 'react';
import {
  Dumbbell,
  Clapperboard,
  ShoppingBag,
  Coffee,
  Compass,
  Ticket,
  UtensilsCrossed,
  BookOpen,
  Camera,
  Laugh,
  Footprints,
  Briefcase,
  Flame,
  Trophy,
  Gamepad2,
  Home,
  Luggage,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

export const ACTIVITY_ICONS_MAP: Record<string, LucideIcon> = {
  'gym-partner': Dumbbell,
  'movie-buddy': Clapperboard,
  'shopping-buddy': ShoppingBag,
  'coffee-chat': Coffee,
  'city-guide': Compass,
  'event-plus-one': Ticket,
  'food-walk': UtensilsCrossed,
  'study-buddy': BookOpen,
  'photo-walk': Camera,
  'comedy-and-shows': Laugh,
  'walk-and-talk': Footprints,
  'career-chat': Briefcase,
  'festival-buddy': Flame,
  'sports-partner': Trophy,
  'gaming-partner': Gamepad2,
  'settle-in-buddy': Home,
  'travel-buddy': Luggage,
};

interface ActivityIconProps {
  slug: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animated?: boolean;
  variant?: 'inline' | 'tile';
  bgVariant?: 'lime' | 'sunny' | 'pink' | 'sky' | 'lavender' | 'paper';
}

const SIZE_CLASSES = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-7 w-7',
  '2xl': 'h-10 w-10',
};

const TILE_SIZES = {
  xs: 'p-1 rounded-md',
  sm: 'p-1.5 rounded-lg',
  md: 'p-2 rounded-xl',
  lg: 'p-2.5 rounded-xl',
  xl: 'p-4 rounded-2xl',
  '2xl': 'p-5 rounded-3xl',
};

const BG_CLASSES = {
  lime: 'bg-lime text-ink',
  sunny: 'bg-sunny text-ink',
  pink: 'bg-pink text-ink',
  sky: 'bg-sky text-ink',
  lavender: 'bg-lavender text-white',
  paper: 'bg-paper-deep text-ink',
};

export function ActivityIcon({
  slug,
  size = 'sm',
  className = '',
  animated = false,
  variant = 'inline',
  bgVariant = 'paper',
}: ActivityIconProps) {
  const IconComponent = ACTIVITY_ICONS_MAP[slug] || Sparkles;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.sm;

  const animationClass = animated
    ? 'transition-transform duration-200 ease-out group-hover:scale-115 group-hover:-rotate-6 hover:scale-115 hover:-rotate-6'
    : '';

  if (variant === 'tile') {
    const tileClass = TILE_SIZES[size] || TILE_SIZES.md;
    const bgClass = BG_CLASSES[bgVariant] || BG_CLASSES.paper;
    return (
      <span
        className={`inline-flex items-center justify-center border-brutal-sm shadow-brutal-xs ${tileClass} ${bgClass} ${className}`}
      >
        <IconComponent
          className={`${sizeClass} shrink-0 stroke-[2.25] ${animationClass}`}
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <IconComponent
      className={`${sizeClass} shrink-0 stroke-[2.25] ${animationClass} ${className}`}
      aria-hidden="true"
    />
  );
}
