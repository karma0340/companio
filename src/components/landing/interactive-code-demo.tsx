'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, KeyRound, Check, RefreshCw } from 'lucide-react';

interface InteractiveCodeDemoProps {
  className?: string;
}

export function InteractiveCodeDemo({ className = '' }: InteractiveCodeDemoProps) {
  const [code, setCode] = useState(['7', '4', '9', '2']);
  const [isShuffling, setIsShuffling] = useState(false);

  const generateNewCode = () => {
    setIsShuffling(true);

    setTimeout(() => {
      const newDigits = [
        Math.floor(1 + Math.random() * 8).toString(),
        Math.floor(Math.random() * 9).toString(),
        Math.floor(Math.random() * 9).toString(),
        Math.floor(1 + Math.random() * 8).toString(),
      ];
      setCode(newDigits);
      setIsShuffling(false);
    }, 350);
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border-brutal bg-white p-4 sm:p-5 shadow-brutal transition-all hover:shadow-brutal-lg ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-brutal-sm bg-lime text-ink shadow-brutal-xs">
            <KeyRound className="h-5 w-5 stroke-[2.25]" />
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border-brutal-sm bg-sunny-soft px-2 py-0.5 font-display text-[10px] font-black uppercase text-ink">
            <Sparkles className="h-3 w-3 text-ink" />
            Interactive Demo
          </span>
        </div>

        <h3 className="font-display text-lg font-black text-ink leading-tight">
          Secret 4-Digit Meetup Code
        </h3>
        <p className="font-body text-xs text-ink-soft mt-1 leading-relaxed">
          Both parties verify this code only in person at the venue. Never get scammed or stood up.
        </p>
      </div>

      {/* Interactive Compact Code Display */}
      <div className="my-2 rounded-xl border-brutal-sm bg-paper p-3 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          {code.map((digit, idx) => (
            <motion.div
              key={`${idx}-${digit}`}
              initial={{ scale: 0.7, y: -6 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22, delay: idx * 0.04 }}
              className="flex h-10 w-9 items-center justify-center rounded-lg border-brutal-sm bg-white font-display text-xl font-black text-ink shadow-brutal-xs"
            >
              {digit}
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          onClick={generateNewCode}
          disabled={isShuffling}
          className="inline-flex items-center gap-1.5 rounded-lg border-brutal-sm bg-sunny px-3 py-1 font-display text-[11px] font-black text-ink shadow-brutal-xs hover:bg-lime active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${isShuffling ? 'animate-spin' : ''}`} />
          <span>Shuffle Code</span>
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border-brutal-sm bg-mint-soft p-2 text-xs font-bold text-ink">
        <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
        <span className="text-[11px]">Timer & funds unlock on code match only.</span>
      </div>
    </div>
  );
}
