'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  className?: string;
}

export function Accordion({ items, defaultOpenIndex, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpenIndex !== undefined ? defaultOpenIndex : 0
  );

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.id || idx}
            className="border-brutal rounded-2xl bg-white shadow-brutal overflow-hidden transition-all"
          >
            <button
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between p-5 text-left font-display font-bold text-base sm:text-lg text-ink hover:bg-paper-deep/60 transition-colors cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <span className="pr-4">{item.question}</span>
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-brutal-sm bg-sunny transition-transform duration-200',
                  isOpen ? 'rotate-180 bg-lime' : 'rotate-0'
                )}
              >
                <ChevronDown className="h-5 w-5 text-ink stroke-[2.5]" />
              </div>
            </button>
            {isOpen && (
              <div className="border-t-brutal-sm bg-paper/40 p-5 pt-3 font-body text-sm sm:text-base leading-relaxed text-ink-soft">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
