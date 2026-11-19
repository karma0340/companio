import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'lime' | 'sunny' | 'pink' | 'lavender' | 'sky' | 'paper' | 'dark' | 'outline' | 'danger';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'paper', size = 'md', children, ...props }: BadgeProps) {
  const variantClasses = {
    lime: 'bg-lime text-ink',
    sunny: 'bg-sunny text-ink',
    pink: 'bg-pink text-ink',
    lavender: 'bg-lavender text-white',
    sky: 'bg-sky text-ink',
    paper: 'bg-paper-deep text-ink',
    dark: 'bg-ink text-paper',
    outline: 'bg-white text-ink',
    danger: 'bg-danger text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-bold rounded-md',
    md: 'px-3 py-1 text-xs font-bold rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border-brutal-sm shadow-brutal-sm font-display tracking-wide uppercase select-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
