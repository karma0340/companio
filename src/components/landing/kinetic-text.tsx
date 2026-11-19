'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhraseItem {
  text: string;
  badgeBg: string;
}

const PHRASES: PhraseItem[] = [
  { text: 'gym workouts', badgeBg: 'bg-lime text-ink' },
  { text: 'indie movies', badgeBg: 'bg-sunny text-ink' },
  { text: 'cafe chats', badgeBg: 'bg-paper-deep text-ink' },
  { text: 'food walks', badgeBg: 'bg-tangerine text-ink' },
  { text: 'photo walks', badgeBg: 'bg-sky-soft text-ink' },
  { text: 'live comedy', badgeBg: 'bg-pink-soft text-ink' },
  { text: 'cafe co-work', badgeBg: 'bg-mint-soft text-ink' },
];

export function KineticText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const current = PHRASES[index];

  return (
    <span className="relative inline-flex items-center align-middle overflow-hidden py-1 px-1 max-w-full">
      <AnimatePresence mode="wait">
        <motion.span
          key={current.text}
          initial={{ y: 24, opacity: 0, filter: 'blur(4px)', rotateX: -30 }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)', rotateX: 0 }}
          exit={{ y: -24, opacity: 0, filter: 'blur(4px)', rotateX: 30 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className={`inline-block whitespace-nowrap rounded-2xl border-brutal px-3 py-0.5 font-display font-black text-[0.85em] shadow-brutal-sm align-middle ${current.badgeBg}`}
        >
          {current.text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
