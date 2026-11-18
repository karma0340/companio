# Companio - Dual-Platform Companionship Ecosystem & Central Gateway

A pixel-for-pixel, full-stack software clone of the Companio network across its dual-domain consumer architecture, unified central backend, and real-time coordination gateway.

---

## Architecture Overview

Companio operates as a dual-platform ecosystem powered by a single central backend and database:

1. **`trycompanio.in` (Dark Luxury Marketing Showroom & Pass Paywall):**
   - Palette: `#0A0A0A` Onyx, `#D4AF37` Gold, `#FFFFFF`, `#1C1C1E` Glassmorphism.
   - Typography: Serif display headers paired with clean sans-serif UI typography.
   - Core Features: "Never go alone." hero, 220px x 293px Moment Tiles carousel, 24-hour visual day scenario journey ("From sunrise walk to evening show"), live 1.2 Lakh+ member counter, Razorpay Access Pass paywall (₹99.50 to ₹999.50), blurred/unblurred portrait gating, and dedicated companion profiles (`/companion/[id]`).
   - Mobile: Native sticky bottom navigation (Home, Explore, Guide, Sign In) matching live DOM specifications.

2. **`getcompanio.in` (Neo-Brutalist Marketplace PWA & Operational App):**
   - Palette: `#FFF8EE` Warm Paper, `#141414` Ink, `#C6F432` Lime, `#FFD23F` Yellow, `#FF7AC6` Pink.
   - Typography: Heavyweight Neo-Brutalist display with 2px-3px solid borders and 4px-7px hard drop shadows.
   - Core Features: "Find a buddy, not a date." hero, 8 activity category badges, 3-step workflow, "Free today" live feed, host earnings calculator slider (₹45,000+ monthly projection), floating mobile PWA install banner, and member/host dashboards.
   - Mobile: Brutalist bottom navigation (Marketplace, Explore, Bookings, Host Mode).

3. **`api.trycompanio.in` (Unified REST API & Real-Time Gateway):**
   - Single central backend serving both frontends from a unified PostgreSQL database (Prisma ORM).
   - Real-time WebSocket gateway on `/rt` (port 3001) for coordination chat, live location broadcasts, and automated regex contact shielding.
   - Transparent escrow calculation engine (₹706.00 escrow: ₹499 host fee + ₹175.42 connection fee + ₹31.58 GST).
   - In-person 4-digit PIN verification handshake protocol, 60-minute session countdown clock, emergency 112 SOS dispatch, and instant Cashfree UPI payout settlements.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components & Route Handlers)
- **Language:** TypeScript 5.5+
- **Styling:** Tailwind CSS with dual-theme configurations
- **Database & ORM:** PostgreSQL with Prisma ORM
- **Real-Time Communication:** Node.js WebSocket / Socket.io (`/rt` namespace)
- **Payment Gateways:** Razorpay (Passes & Escrow) + Cashfree (Instant UPI Payouts) with zero-config sandbox fallbacks
- **Icons:** Lucide Icons (Strictly no emojis across UI)

---

## Project Structure

```
trycompanio/
├── prisma/
│   └── schema.prisma              # Unified database models (User, Companion, Booking, Pass, etc.)
├── public/
│   ├── assets/
│   │   ├── hosts/                 # Mirrored high-resolution companion portraits
│   │   └── moments/               # Mirrored 30 WebP moment carousel tiles
│   └── manifest.json              # PWA standalone manifest configuration
├── server/
│   └── ws-server.ts               # Standalone real-time WebSocket gateway on port 3001
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Dark luxury showroom routes (trycompanio.in)
│   │   │   ├── companion/[id]/    # Dedicated companion profile
│   │   │   ├── explore/           # Verified directory & pass gating
│   │   │   └── page.tsx           # Showroom homepage
│   │   ├── (app)/                 # Neo-Brutalist marketplace & PWA routes (getcompanio.in)
│   │   │   ├── app/page.tsx       # Marketplace homepage
│   │   │   ├── booking/[id]/      # Escrow booking & venue selection
│   │   │   ├── chat/[id]/         # Real-time coordination room
│   │   │   ├── host/dashboard/    # Host SLA acceptance & UPI cashout
│   │   │   └── session/[id]/      # PIN handshake & 60-min timer
│   │   └── api/                   # Unified REST API routes
│   ├── components/
│   │   ├── auth/                  # Phone OTP authentication modal
│   │   ├── marketing/             # Showroom components (Cards, PaywallModal, MobileNav)
│   │   └── marketplace/           # Neo-Brutalist components (Header, Footer, BottomNav)
│   ├── lib/                       # Business logic (Escrow, session cookies, regex filters)
│   ├── middleware.ts              # Multi-domain hostname routing middleware
│   └── types/                     # Shared TypeScript contracts
├── scripts/                       # Verification test suites & data seeders
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18.17+ or Node.js 20+
- PostgreSQL database (or utilize the automatic sandbox fallback mode)

### Installation

1. Clone repository:
```bash
git clone https://github.com/karma0340/companio.git
cd companio
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

4. Initialize database:
```bash
npx prisma generate
npx prisma db push
```

### Running Locally

1. Start the WebSocket real-time gateway (port 3001):
```bash
npx tsx server/ws-server.ts
```

2. In a separate terminal, start the Next.js development server (port 3000):
```bash
npm run dev
```

3. Open in browser:
   - Marketing Showroom: `http://localhost:3000/`
   - Marketplace PWA: `http://localhost:3000/app`
   - Verified Directory: `http://localhost:3000/explore`

---

## Verification & Testing

Run the full end-to-end audit test suites:
```bash
python scripts/verify_dual_platform_e2e.py
python scripts/verify_responsiveness.py
npx tsx scripts/test_live_phase6_api.ts
```

Total Test Pass Rate: **93 / 93 checks passed (100%)**.

---

## Compliance & Legal Notice

This software implementation adheres to:
- India Digital Personal Data Protection Act (DPDPA 2023)
- RoC Delhi statutory disclosures (TRYCOMPANIOLABS LLP, LLPIN ACY-1464)
- Platonic verification protocols with zero dating/solicitation tolerance
