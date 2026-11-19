import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'sunny' | 'pink' | 'dark' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-lime text-ink hover:bg-[#b8e82a]',
      sunny: 'bg-sunny text-ink hover:bg-[#f0c22e]',
      pink: 'bg-pink text-ink hover:bg-[#f56ebc]',
      dark: 'bg-ink text-paper hover:bg-[#262626]',
      outline: 'bg-white text-ink hover:bg-paper-deep',
      ghost: 'bg-transparent text-ink border-transparent shadow-none hover:bg-paper-deep hover:border-ink',
      danger: 'bg-danger text-white hover:bg-red-600',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
      md: 'px-5 py-2.5 text-sm font-extrabold rounded-xl',
      lg: 'px-7 py-3.5 text-base font-extrabold rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 border-brutal shadow-brutal font-display tracking-tight cursor-pointer select-none btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
