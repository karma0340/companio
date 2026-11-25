'use client';

import React from 'react';
import { Companion } from '@/lib/types';
import { CompanionCard } from './companion-card';

interface GatedCompanionGridProps {
  companions: Companion[];
}

export function GatedCompanionGrid({ companions }: GatedCompanionGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {companions.map((comp, idx) => (
        <CompanionCard key={comp.id} companion={comp} priority={idx < 4} />
      ))}
    </div>
  );
}
