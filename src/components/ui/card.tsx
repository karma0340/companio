import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'paper' | 'sunny' | 'lime' | 'pink' | 'lavender';
  shadowSize?: 'sm' | 'md' | 'lg' | 'none';
  interactive?: boolean;
}

export function Card({
  className,
  variant = 'white',
  shadowSize = 'md',
  interactive = false,
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    white: 'bg-white text-ink',
    paper: 'bg-paper text-ink',
    sunny: 'bg-sunny text-ink',
    lime: 'bg-lime text-ink',
    pink: 'bg-pink text-ink',
    lavender: 'bg-lavender text-white',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-brutal-sm',
    md: 'shadow-brutal',
    lg: 'shadow-brutal-lg',
  };

  return (
    <div
      className={cn(
        'border-brutal rounded-2xl overflow-hidden',
        variantClasses[variant],
        shadowClasses[shadowSize],
        interactive && 'btn-press hover:translate-x-[-2px] hover:translate-y-[-2px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
