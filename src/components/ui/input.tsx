import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block font-display text-sm font-extrabold text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border-brutal bg-white px-4 py-3 font-body text-sm font-medium text-ink placeholder:text-ink-muted/60 transition-all focus:outline-none focus:shadow-brutal focus:border-ink',
            error && 'border-danger focus:border-danger focus:shadow-brutal',
            className
          )}
          {...props}
        />
        {helperText && !error && <p className="text-xs font-medium text-ink-soft">{helperText}</p>}
        {error && <p className="text-xs font-bold text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
