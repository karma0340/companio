'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Info, ShieldCheck, Lock, Briefcase } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Accordion } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'safety' | 'payments' | 'hosts'>('all');

  const allFaqs = [
    {
      id: 'g-1',
      category: 'general',
      question: 'What is made4togethr (Togethr)?',
      answer:
        'Togethr is an Indian on-demand platform that connects users with verified local hosts for strictly platonic, activity-based companionship in public places (e.g. gym spotter, movie buddy, city guide, cafe chats, shopping companion, or event plus-one).',
    },
    {
      id: 'g-2',
      category: 'general',
      question: 'Is Togethr a dating or matrimonial service?',
      answer:
        'No. We are 100% platonic. We explicitly prohibit dating, romantic solicitation, adult services, or escorting. Any user attempting romantic advances is immediately banned from the platform with zero tolerance.',
    },
    {
      id: 'g-3',
      category: 'general',
      question: 'Who can use Togethr?',
      answer:
        'Anyone aged 18 or older who holds a valid Indian government-issued photo ID (Aadhaar, Passport, or Voter ID) and agrees to our community standards and public-place meetup rules.',
    },
    {
      id: 's-1',
      category: 'safety',
      question: 'How are hosts and members verified?',
      answer:
        'Every single host submits a government ID and completes a live selfie match. Our human safety team cross-references phone numbers and identity documents before any profile goes live on the platform.',
    },
    {
      id: 's-2',
      category: 'safety',
      question: 'What is the 4-digit start code?',
      answer:
        'When your booking is confirmed, a private 4-digit code is generated on your screen. When you meet your companion at the public venue, you share this code verbally. The host enters it on their device to officially begin the session timer. Without the code, no meetup is recognized and no escrow is released.',
    },
    {
      id: 's-3',
      category: 'safety',
      question: 'Where can meetups take place?',
      answer:
        'Exclusively public venues: coffee shops, shopping malls, public parks, gym franchises, metro lobbies, or cultural events. Private homes, hotel rooms, or secluded areas are strictly forbidden.',
    },
    {
      id: 'p-1',
      category: 'payments',
      question: 'How does the Escrow Payment Vault work?',
      answer:
        'When you request a meetup, your payment is placed safely into an escrow vault. The companion does not receive the funds until the meetup is mutually completed via the 4-digit code. If the companion declines, cancels, or fails to attend, 100% of your funds are returned immediately.',
    },
    {
      id: 'p-2',
      category: 'payments',
      question: 'What payment methods are supported?',
      answer:
        'We support all major Indian payment rails: UPI (Google Pay, PhonePe, Paytm), debit/credit cards (Visa, Mastercard, RuPay), and NetBanking through verified payment gateways.',
    },
    {
      id: 'p-3',
      category: 'payments',
      question: 'What is the Togethr Connection Fee and GST?',
      answer:
        'Togethr charges an 18% connection fee on the host subtotal to cover ID verification, 24/7 trust desk support, and escrow banking infrastructure. Indian statutory GST (18%) is applied only to this connection fee, not to the host earnings.',
    },
    {
      id: 'h-1',
      category: 'hosts',
      question: 'How do hosts get paid?',
      answer:
        'Once a meetup concludes, your earned amount is credited instantly to your Togethr Host Wallet. You can withdraw funds directly to your verified bank account via UPI with one tap.',
    },
    {
      id: 'h-2',
      category: 'hosts',
      question: 'Can I choose to accept meetups only from women?',
      answer:
        'Yes! Female hosts can turn on the "Women-Only" filter in their profile settings. Once enabled, only verified female members are able to request meetups with you.',
    },
  ];

  const filteredFaqs =
    activeCategory === 'all'
      ? allFaqs
      : allFaqs.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge variant="sunny" size="md">
              Knowledge Base
            </Badge>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-ink">
              Questions, answered.
            </h1>

            <p className="font-body text-base sm:text-lg text-ink-soft">
              Clear, transparent answers about our platform, trust safeguards, payments, and meetup rules.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All Questions', icon: Sparkles },
              { id: 'general', label: 'About Togethr', icon: Info },
              { id: 'safety', label: 'Trust & Safety', icon: ShieldCheck },
              { id: 'payments', label: 'Payments & Escrow', icon: Lock },
              { id: 'hosts', label: 'Host Earnings', icon: Briefcase },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`inline-flex items-center gap-1.5 rounded-full border-brutal-sm px-4 py-1.5 font-display text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-ink text-paper shadow-brutal-sm'
                      : 'bg-white text-ink hover:bg-paper-deep'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 stroke-[2.25] ${isSelected ? 'text-sunny' : 'text-ink-soft'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Accordion Directory */}
          <Accordion items={filteredFaqs} />

          {/* Still Need Help Box */}
          <div className="rounded-3xl border-brutal bg-white p-8 text-center shadow-brutal space-y-3">
            <h3 className="font-display text-2xl font-black text-ink">
              Still have a question?
            </h3>
            <p className="font-body text-sm text-ink-soft max-w-md mx-auto">
              Our support and safety team is active 24/7 to assist with bookings, verification, or questions.
            </p>
            <div className="pt-2">
              <a href="mailto:support@made4togethr.com">
                <Button variant="primary" size="md">
                  <span>Contact Togethr Support →</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
