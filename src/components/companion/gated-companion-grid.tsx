'use client';

import React, { useState } from 'react';
import { Companion } from '@/lib/types';
import { CompanionCard } from './companion-card';
import { UnlockProfileModal } from '@/components/pass/unlock-profile-modal';
import { useAuth } from '@/context/auth-context';

interface GatedCompanionGridProps {
  companions: Companion[];
}

export function GatedCompanionGrid({ companions }: GatedCompanionGridProps) {
  const { user } = useAuth();
  const isUnlocked = Boolean(user?.isUnlocked);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companions.map((comp) => (
          <CompanionCard
            key={comp.id}
            companion={comp}
            isLocked={!isUnlocked}
            onUnlockClick={(c) => {
              setSelectedCompanion(c);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      <UnlockProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companion={selectedCompanion}
      />
    </>
  );
}
