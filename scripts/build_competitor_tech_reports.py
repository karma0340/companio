import os

BASE_DIR = r"C:\Users\Dell\Documents\codes\trycompanio\TRYCOMPANIO-RND"
comp_dir = os.path.join(BASE_DIR, "05-COMPETITOR-RESEARCH")
tech_dir = os.path.join(BASE_DIR, "06-TECHNICAL-RESEARCH")
os.makedirs(comp_dir, exist_ok=True)
os.makedirs(tech_dir, exist_ok=True)

# 05-COMPETITOR-RESEARCH/direct-competitors.md
with open(os.path.join(comp_dir, "direct-competitors.md"), "w", encoding="utf-8") as f:
    f.write("""# Direct Competitors — In-Person Platonic Companion Platforms in India

## 1. Competitive Landscape Overview

The Indian market for direct, in-person platonic companion booking features a fragmented landscape of emerging startups, legacy rental directories, and specialized lifestyle services:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   DIRECT COMPETITOR BENCHMARK SPECTRUM                           │
├────────────────────┬─────────────────────────────────────────────────────────────┤
│ Premium Concierge  │ KoPartner (kopartner.in) | Snapmate (snapmate.in)           │
│ (₹1,000 - ₹2,000/hr)│ Target: Affluent professionals, senior care, luxury plus-ones│
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ Mid-Tier Escrow    │ TryCompanio (trycompanio.in)                                │
│ (₹300 - ₹800/hr)   │ Target: Corporate transplants, café chats, fitness, gigs    │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ Budget Packages    │ RentalFriend.in (rentalfriend.in)                           │
│ (₹299 for 3 hrs)   │ Target: College students, casual budget hangouts            │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ Zero-Custody P2P   │ PlusOneStar (plusonestar.com)                               │
│ (0% Commission)    │ Target: Gen Z concert-goers, gala plus-ones, tech early adopters│
└────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 2. In-Depth Teardown of Direct Competitors

### 1. KoPartner (`kopartner.in` / `kopartner.pro`)
- **Website:** [https://kopartner.in](https://kopartner.in)
- **Positioning:** Emotional wellness, social companionship, and lifestyle support service.
- **Geographic Footprint:** Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, Kolkata.
- **Business Model:** Two-sided booking marketplace charging an upfront advance booking fee (~₹99) + premium hourly partner rates.
- **Pricing:**
  - *Elder Care & Medical Support:* ₹1,000 / hour
  - *Casual Hangouts & Café Chats:* ₹1,500 / hour
  - *Clubbing, Parties & Event Plus-Ones:* ₹2,000 / hour
- **Core Strengths:** Broad service breadth (elder care, travel companion, medical appointment buddy); established brand presence in multiple metros.
- **Core Weaknesses:** Prohibitively expensive for young adults (₹3,000+ for a standard outing); manual booking flow; dated website UX.
- **Screenshot Proof:**
  ![KoPartner Screenshot](file:///C:/Users/Dell/Documents/codes/trycompanio/TRYCOMPANIO-RND/05-COMPETITOR-RESEARCH/competitor-screenshots/kopartner.png)

---

### 2. PlusOneStar (`plusonestar.com`)
- **Website:** [https://plusonestar.com](https://plusonestar.com)
- **Positioning:** Purpose-based, zero-custody platonic companionship for events, concerts, galas, and social outings.
- **Geographic Footprint:** Bengaluru, Mumbai, Delhi NCR.
- **Business Model:** 0% platform commission model. Zero-custody peer coordination where users negotiate rates directly.
- **Pricing:** Free platform access; peer-negotiated meetup compensation.
- **Core Strengths:** Advanced safety engineering: 3D biometric liveness KYC, strict privacy preservation, zero platform take-rate appealing to Gen Z.
- **Core Weaknesses:** Zero-commission model limits monetization and marketing runway; lacks escrow dispute mediation.
- **Screenshot Proof:**
  ![PlusOneStar Screenshot](file:///C:/Users/Dell/Documents/codes/trycompanio/TRYCOMPANIO-RND/05-COMPETITOR-RESEARCH/competitor-screenshots/plusonestar.png)

---

### 3. RentalFriend India (`rentalfriend.in` / `rentafriends.in`)
- **Website:** [https://rentalfriend.in](https://rentalfriend.in)
- **Positioning:** Low-cost platonic companion booking service for coffee, events, weddings, city tours, and emotional vent chats.
- **Geographic Footprint:** Mumbai, Pune, Delhi NCR.
- **Business Model:** Fixed packaged duration plans.
- **Pricing:**
  - *Social Buddy Plan:* ₹299 for up to 3 hours
  - *Event Companion Plan:* ₹499 for up to 6 hours
  - *Premium Daily Plan:* ₹999 / day
- **Core Strengths:** Extremely low barrier to entry (₹299 is accessible to any college student).
- **Core Weaknesses:** Low payouts mean companions frequently cancel or ghost; website built on basic legacy templates without live safety telemetry.
- **Screenshot Proof:**
  ![RentalFriend Screenshot](file:///C:/Users/Dell/Documents/codes/trycompanio/TRYCOMPANIO-RND/05-COMPETITOR-RESEARCH/competitor-screenshots/rentalfriend.png)

---

### 4. Snapmate (`snapmate.in`)
- **Website:** [https://snapmate.in](https://snapmate.in) (Devlayers Technology)
- **Positioning:** Lifestyle concierge providing background-verified companions ("GoPartners") for social and personal tasks.
- **Geographic Footprint:** Gurugram, Delhi NCR.
- **Business Model:** On-demand hourly booking via Razorpay integration; platform retains 25-30% margin.
- **Pricing:** Flat tiered rates: ₹1,000/hr (Elder care), ₹1,500/hr (Hangout), ₹2,000/hr (Shopping, Clubbing, Movies).
- **Strengths:** Clear corporate framing; transparent pricing tiers.
- **Weaknesses:** Feels like staffing personal assistants rather than organic peer friendship.

---

### 5. Friendy App (`friendy.in`)
- **Website:** [https://friendy.in](https://friendy.in) (Google Play App)
- **Positioning:** Native Android "rent-a-friend" app for casual companionship in India.
- **Business Model:** In-app coin micro-transactions to unlock chats + peer-negotiated hourly meetup fees.
- **Pricing:** In-app coin packs (₹50 to ₹500).
- **Strengths:** Native mobile presence on Google Play Store.
- **Weaknesses:** Inundated with spam and fake accounts; frequent complaints regarding pay-to-chat paywalls; weak automated KYC.
""")

# 05-COMPETITOR-RESEARCH/indirect-competitors.md
with open(os.path.join(comp_dir, "indirect-competitors.md"), "w", encoding="utf-8") as f:
    f.write("""# Indirect Competitors & Alternative Social Discovery Models

## 1. Landscape of Substitute Solutions

While direct competitors replicate the 1-on-1 companion booking model, Indian consumers solve social isolation through four primary substitute categories:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   INDIRECT COMPETITOR SEGMENTS                                   │
├─────────────────────┬────────────────────────────────────────────────────────────┤
│ Group Dinner Clubs  │ Timeleft (timeleft.com) — 6 strangers dinner on Wednesdays │
├─────────────────────┼────────────────────────────────────────────────────────────┤
│ Dating App Platonic │ Bumble BFF (bumble.com/bff) — Free mutual swiping           │
├─────────────────────┼────────────────────────────────────────────────────────────┤
│ Vernacular Audio    │ FRND App (frnd.app) — Gamified virtual audio coin rooms    │
├─────────────────────┼────────────────────────────────────────────────────────────┤
│ Curated House Party │ Playace (playace.co) — Paid weekend house parties & games   │
├─────────────────────┼────────────────────────────────────────────────────────────┤
│ Sports Discovery    │ Playo (playo.co) — Badminton, cricket & football buddies    │
└─────────────────────┴────────────────────────────────────────────────────────────┘
```

---

## 2. In-Depth Teardown of Indirect Competitors

### 1. Timeleft (`timeleft.com`)
- **The Concept:** Weekly algorithmically curated dinners connecting 6 strangers in public restaurants every Wednesday evening across Paris, New York, London, Mumbai, and Bengaluru.
- **Business Model:** Ticket / Subscription model: ~₹400 to ₹999 per seat ticket; diners pay for their own restaurant meals (~₹1,200 to ₹2,500).
- **Strengths:** Outstanding psychological safety (meeting 5 strangers at a restaurant table eliminates 1-on-1 pressure); high viral word-of-mouth.
- **Weaknesses:** Rigid schedule (Wednesday dinners only); expensive restaurant bill barrier for young students.

### 2. Bumble BFF (`bumble.com/bff`)
- **The Concept:** Dedicated platonic friendship mode within the global Bumble dating application.
- **Business Model:** Freemium app with premium subscriptions (Bumble Boost / Premium: ₹499 to ₹1,499/month).
- **Strengths:** Enormous global brand trust, millions of active profiles, free core usage.
- **Weaknesses:** Massive "swipe fatigue" and ghosting. Over 90% of chat matches never translate into real-life meetups because neither party has financial commitment.

### 3. FRND App (`frnd.app`)
- **The Concept:** Krafton-backed vernacular audio chat and gamified companion platform targeting Tier-2/3 Indian youth.
- **Business Model:** Virtual micro-gifting and pay-per-minute audio coins (~₹10 to ₹100+).
- **Strengths:** Exceptional monetization mechanics; zero physical safety liability (strictly virtual/audio).
- **Weaknesses:** Entirely digital/virtual; cannot solve the desire for in-person, physical shared experiences.

### 4. Playace (`playace.co`)
- **The Concept:** Community platform organizing curated weekend house parties, board game evenings, and social mixers in private apartments across Bengaluru, Mumbai, and Delhi.
- **Business Model:** Cover charge tickets (₹800 to ₹2,800 per party); platform splits revenue with host.
- **Strengths:** Vibrant, high-energy party atmosphere; food and beverages included.
- **Weaknesses:** Restricted to weekend evenings in domestic settings; not suitable for daytime casual café or gym companionship.

### 5. Playo (`playo.co`)
- **The Concept:** Sports venue booking and activity partner matchmaking app (Badminton, Football, Cricket, Tennis).
- **Business Model:** Court booking commissions + convenience fees.
- **Strengths:** Solves the companionship dilemma around a structured sport activity; highly active sports community.
- **Weaknesses:** Limited to sports and athletic venues; does not address cultural, dining, or event companionship.
""")

# 05-COMPETITOR-RESEARCH/competitor-comparison.md
with open(os.path.join(comp_dir, "competitor-comparison.md"), "w", encoding="utf-8") as f:
    f.write("""# Competitor Comparison Matrix & Positioning Teardown

## 1. Master Competitor Comparison Matrix

| Competitor Name | Model Type | Core Geography | Demand Pricing | Supply Earnings | Trust & Safety Layer | Primary Weakness |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TryCompanio** | **Pass + Hourly Escrow** | **Pan-India (60+ Cities)** | **₹99.50 pass + ₹300-800/hr** | **70% net payout via UPI** | **Manual Govt ID badge, Escrow, SOS Snapshot** | **No native app yet, early brand recognition** |
| **KoPartner** | Advance Fee + Hourly | Delhi, Mumbai, Bengaluru | ₹99 fee + ₹1,000-2,000/hr | ~75-80% partner split | Advance verification, manual booking | Prohibitive hourly cost, dated website UX |
| **PlusOneStar** | Zero-Custody P2P | Bengaluru, Mumbai | Free access (Direct peer rate) | 100% peer payment | 3D Biometric Liveness KYC | Zero platform take-rate limits monetization |
| **RentalFriend** | Packaged Flat Rates | Mumbai, Pune, Delhi | ₹299 (3 hrs) / ₹499 (6 hrs) | ~65% payout share | Basic manual checks | Low companion payout leads to high cancellations |
| **Snapmate** | Hourly Concierge | Gurugram, Delhi NCR | ₹1,000 - ₹2,000 / hr | 70-75% split | Background check branding | High price; feels like hiring domestic staff |
| **Timeleft** | Group Ticket + Meal | Mumbai, Bengaluru, Global | ₹400-999 ticket + meal cost | Restaurant partner margins | Group of 6 in public restaurant | Limited to Wednesday group dinners only |
| **Bumble BFF** | Freemium Swiping | Global / Pan-India | Free / ₹499-1,499 sub | None (Unpaid peer effort) | Photo selfie verification | 90%+ ghosting rate, zero meetup guarantee |
| **RentAFriend** | Global Directory Sub | Global (US/UK/India) | $19.99/mo (~₹1,650) | 100% of hourly fee | Legacy self-certification | Outdated 2000s LAMP UI, zero safety telemetry |

---

## 2. Competitive Positioning Map

```
                     HIGH HOURLY COST / CONCIERGE
                                 ▲
                                 │       KoPartner
                                 │       Snapmate
                                 │
                                 │
     LOW REAL-LIFE               │                 HIGH REAL-LIFE
     MEETUP CONVERSION           │                 MEETUP COMMITMENT
   ◄─────────────────────────────┼─────────────────────────────►
       Bumble BFF                │          TRYCOMPANIO (Sweet Spot)
       (Swipe & Ghost)           │          (Pass + Escrow + SOS)
                                 │
       FRND App                  │          RentalFriend.in
       (Virtual Audio Only)      │          (Budget Packages)
                                 │
                                 ▼
                     LOW HOURLY COST / FREEMIUM
```

### TryCompanio's Strategic Defensibility Moats:
1. **The ₹99.50 Micro-Pass vs. Monthly SaaS:** By avoiding aggressive auto-renewing subscriptions, Companio aligns with Indian consumer psychology while preserving healthy upfront margins.
2. **Escrow Dispute Mediation:** The 4-digit in-person exchange ensures that members only pay when a companion physically shows up, while companions are guaranteed payment without bargaining.
3. **Hyper-Localized SEO Footprint:** 66 programmatic city landing pages create an organic acquisition moat over competitors who rely entirely on expensive paid Google Search ads.
""")

# 06-TECHNICAL-RESEARCH/technology-stack.md
with open(os.path.join(tech_dir, "technology-stack.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Comprehensive Technology Stack Architecture

## 1. Confirmed vs. Probable Technology Stack

Reconnaissance of public DNS records, HTTP headers, DOM structure, Content Security Policies (CSP), and build fingerprints confirms the following modern cloud architecture:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          TRYCOMPANIO TECHNOLOGY STACK                            │
├─────────────────┬────────────────────────────────────────────────┬───────────────┤
│ LAYER           │ TECHNOLOGY / SERVICE                           │ VERIFICATION  │
├─────────────────┼────────────────────────────────────────────────┼───────────────┤
│ Frontend        │ Next.js (App Router, Server Components - RSC)  │ CONFIRMED     │
│ UI Framework    │ React 18+ / React DOM                          │ CONFIRMED     │
│ Styling         │ Tailwind CSS (`antialiased h-full`)            │ CONFIRMED     │
│ Icons & Media   │ Lucide Icons, HTML5 Video                      │ CONFIRMED     │
│ 3D Graphics     │ Spline (`https://*.spline.design`)             │ CONFIRMED     │
│ Mapping         │ OpenStreetMap + MapTiler + ArcGIS Online       │ CONFIRMED     │
│ Edge & Hosting  │ Vercel Serverless Platform (`x-vercel-cache`)  │ CONFIRMED     │
│ Edge Security   │ Cloudflare Anycast CDN & WAF                   │ CONFIRMED     │
│ Asset Storage   │ Vercel Blob Storage (`*.public.blob...`)       │ CONFIRMED     │
│ Custom CDN      │ `cdn.trycompanio.in`                           │ CONFIRMED     │
│ Payment Gateway │ Razorpay (`checkout.razorpay.com`)             │ CONFIRMED     │
│ Error Telemetry │ Sentry (`o4511769047072768.ingest.sentry.io`)  │ CONFIRMED     │
│ Product Metrics │ PostHog (`us.i.posthog.com`)                   │ CONFIRMED     │
│ Web Analytics   │ Google Tag Manager, Google Analytics 4, Vercel │ CONFIRMED     │
│ Ad Tracking     │ Meta Pixel, Snapchat Pixel, DoubleClick Ads    │ CONFIRMED     │
│ Database        │ PostgreSQL with Prisma ORM on Neon/Supabase    │ PROBABLE      │
│ SSL / TLS       │ Let's Encrypt (DV), 2-Year HSTS with Preload   │ CONFIRMED     │
└─────────────────┴────────────────────────────────────────────────┴───────────────┘
```

---

## 2. Frontend Architecture Inspection

- **Framework:** Next.js utilizing the modern App Router architecture (`_next/static` assets, `rsc`, `next-router-state-tree`).
- **Rendering Model:** Hybrid SSG/ISR. Static pages are generated at build time and cached at edge locations with an edge cache-control stale time of 300 seconds (`x-nextjs-stale-time: 300`).
- **3D & Interactive Elements:** Spline WebGL components embedded dynamically via CSP permissions to create interactive hero and badge animations.
- **Geolocation & Mapping:** Dual mapping integration:
  - OpenStreetMap (`tile.openstreetmap.org`) for base vector tiles.
  - MapTiler (`api.maptiler.com`) and ArcGIS Online (`server.arcgisonline.com`) for high-resolution locality geocoding and companion radar search.
""")

# 06-TECHNICAL-RESEARCH/infrastructure.md
with open(os.path.join(tech_dir, "infrastructure.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Cloud Infrastructure & Network Reconnaissance

## 1. DNS & Network Configuration

- **Domain:** `trycompanio.in` / `www.trycompanio.in`
- **Authoritative Nameservers:**
  - `ajay.ns.cloudflare.com`
  - `jo.ns.cloudflare.com`
- **Cloudflare Anycast IPs:**
  - IPv4: `104.21.43.45`, `172.67.219.94`
  - IPv6: `2606:4700:3031::ac43:db5e`, `2606:4700:3034::6815:2b2d`
- **Mail Server (MX):** No MX records configured. Transactional emails and OTP delivery operate via third-party API gateways (Resend / SendGrid / Postmark). Support inquiries route to `trycompanio@gmail.com`.
- **Search Verification (TXT):**
  - `google-site-verification=P8pXsjJ9BSwm9qE-MB1-a-YPl3Q5Qv-s0kGDq4sWYWw` (Google Search Console active).

---

## 2. Edge Routing & Caching Topology

```
             CLIENT BROWSER (User / Companion)
                            │
                            ▼
          CLOUDFLARE EDGE NETWORK (Global Anycast)
       • DDoS Mitigation & WAF
       • SSL Termination & HTTP/3 (QUIC)
       • Cloudflare Web Analytics
                            │
                            ▼
          VERCEL EDGE NETWORK (Vercel DPL: dpl_7pujk...)
       • Edge Cache (x-vercel-cache: HIT/MISS)
       • Next.js Serverless Function Execution
       • Incremental Static Regeneration (ISR 300s)
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
    VERCEL BLOB STORAGE          MANAGED POSTGRESQL DB
    (Photos, ID Uploads)         (Profiles, Bookings, Wallet)
```

- **Protocol Support:** HTTP/3 (QUIC) enabled via Cloudflare with `alt-svc: h3=":443"; ma=86400`.
- **Cache Strategy:** Edge caching via Vercel with automatic stale-while-revalidate headers (`public, max-age=0, must-revalidate`).
""")

# 06-TECHNICAL-RESEARCH/integrations.md
with open(os.path.join(tech_dir, "integrations.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Third-Party Integrations & API Ecosystem

## 1. Financial & Payment Gateway Integration

### Razorpay Integration
- **Client Script:** `https://checkout.razorpay.com/v1/checkout.js`
- **Telemetry Endpoints:** `api.razorpay.com`, `lumberjack.razorpay.com`
- **Capabilities:**
  - Supports UPI (Google Pay, PhonePe, Paytm, CRED), Net Banking, and Debit/Credit Cards.
  - Razorpay Escrow / Route integration for holding booking funds prior to meetup completion.
  - Razorpay Payouts API for automated bank transfers to companion UPI VPA handles within 24 hours.

---

## 2. Product Analytics, Telemetry & Ad Tracking

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THIRD-PARTY INTEGRATION MATRIX                  │
├─────────────────────┬──────────────────────────────────────────────────┤
│ PostHog             │ In-app event telemetry, user session recordings, │
│ (us.i.posthog.com)  │ conversion funnel drop-off analytics             │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Sentry              │ Real-time error logging, CSP violation monitoring│
│ (*.ingest.sentry.io)│ Production project: o4511769047072768            │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Meta Pixel          │ Tracks conversions from Instagram Reels and      │
│ (connect.facebook)  │ Facebook ad campaigns to pass purchases          │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Snapchat Pixel      │ Conversion tracking for Gen Z social campaigns   │
│ (tr.snapchat.com)   │                                                  │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Google Tag Manager  │ Container managing Google Analytics 4 tags & Ads │
│ (googletagmanager)  │ conversion scripts                               │
└─────────────────────┴──────────────────────────────────────────────────┘
```
""")

# 06-TECHNICAL-RESEARCH/technical-observations.md
with open(os.path.join(tech_dir, "technical-observations.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Technical Observations, Security Signals & Crawl Directives

## 1. Security Header & Policy Analysis

| Header | Production Value | Security Implication |
| :--- | :--- | :--- |
| `X-Frame-Options` | `DENY` | Prevents UI redressing and clickjacking attacks. |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME-type sniffing vulnerabilities. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Enforces HTTPS strictly for 2 full years with browser preload. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Strips sensitive path data on cross-origin requests. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` | Restricts camera/mic access; restricts geolocation to own origin. |
| `Content-Security-Policy` | `report-only` (Sentry ingest) | **Key Observation:** CSP is currently running in report-only mode rather than enforced mode, indicating ongoing policy tuning. |

---

## 2. Robots.txt & Artificial Intelligence Crawler Policies

Companio's `robots.txt` exhibits a highly deliberate and modern crawler configuration:

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /book/
Disallow: /dashboard
Disallow: /companion-dashboard
Disallow: /receipt/

User-Agent: GPTBot
User-Agent: OAI-SearchBot
User-Agent: ClaudeBot
User-Agent: PerplexityBot
User-Agent: Google-Extended
User-Agent: CCBot
User-Agent: Applebot-Extended
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /book/
Disallow: /dashboard
Disallow: /companion-dashboard
Disallow: /receipt/

Sitemap: https://www.trycompanio.in/sitemap.xml
```

### Strategic Observations:
1. **AI Search Engine Ingestion:** Unlike legacy sites that blanket-block AI crawlers, Companio explicitly permits all major LLM agents (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Applebot-Extended`) to crawl and index public pages. This ensures Companio appears in generative search engine answers (ChatGPT Search, Perplexity, Claude).
2. **Functional Route Protection:** Sensitive transactional pathways (`/book/`, `/dashboard`, `/companion-dashboard`, `/receipt/`, `/admin/`, `/api/`) are shielded from search engine scrapers.
""")

print("Competitor and Technical research reports built successfully.")
