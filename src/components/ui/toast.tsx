'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  error: (message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message }: Omit<ToastItem, 'id'>) => {
      // Prevent duplicate toasts with the exact same message
      setToasts((prev) => {
        if (prev.some((t) => t.message === message)) {
          return prev;
        }
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        // Keep maximum 3 toasts visible at once
        const trimmed = prev.length >= 3 ? prev.slice(prev.length - 2) : prev;
        return [...trimmed, { id, type, title, message }];
      });

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 4000);
    },
    []
  );

  const error = useCallback(
    (message: string, title?: string) => {
      let finalMessage = message || 'Something went wrong. Please try again.';
      let finalTitle = title || 'Unable to Proceed';

      // Catch and translate technical developer/browser exceptions into friendly user language
      const lower = String(finalMessage).toLowerCase();
      if (
        lower.includes('failed to fetch') ||
        lower.includes('networkerror') ||
        lower.includes('load failed') ||
        lower.includes('connection refused')
      ) {
        finalMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        finalTitle = title || 'Connection Problem';
      } else if (lower.includes('unauthorized') || lower.includes('session expired')) {
        finalMessage = 'Your login session has expired. Please sign in again with your phone number.';
        finalTitle = title || 'Session Expired';
      }

      addToast({ type: 'error', title: finalTitle, message: finalMessage });
    },
    [addToast]
  );

  const success = useCallback(
    (message: string, title: string = 'Success') => {
      addToast({ type: 'success', title, message });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, title: string = 'Important Notice') => {
      addToast({ type: 'warning', title, message });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, title: string = 'Notice') => {
      addToast({ type: 'info', title, message });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, error, success, warning, info }}>
      {children}

      {/* Fixed Toast Container at Top Right */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          let bgClass = 'bg-white';
          let borderClass = 'border-ink';
          let icon = <Info className="h-5 w-5 text-ink shrink-0" />;

          if (t.type === 'error') {
            bgClass = 'bg-[#FFF2F0]';
            borderClass = 'border-ink';
            icon = <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />;
          } else if (t.type === 'success') {
            bgClass = 'bg-[#F0FDF4]';
            borderClass = 'border-ink';
            icon = <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />;
          } else if (t.type === 'warning') {
            bgClass = 'bg-[#FEFCE8]';
            borderClass = 'border-ink';
            icon = <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-2xl border-brutal p-4 shadow-brutal-lg transition-all transform animate-in slide-in-from-top-3 fade-in duration-200 ${bgClass} ${borderClass}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{icon}</div>
                <div className="flex-1 space-y-1">
                  {t.title && (
                    <h4 className="font-display text-sm font-black text-ink leading-tight">
                      {t.title}
                    </h4>
                  )}
                  <p className="font-body text-xs font-semibold text-ink-soft leading-snug">
                    {t.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="rounded-lg p-1 text-ink-muted hover:text-ink hover:bg-black/5 transition-colors"
                  aria-label="Dismiss toast"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
