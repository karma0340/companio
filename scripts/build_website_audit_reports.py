import os

BASE_DIR = r"C:\Users\Dell\Documents\codes\trycompanio\TRYCOMPANIO-RND\02-WEBSITE-RESEARCH"
os.makedirs(BASE_DIR, exist_ok=True)

# 02-WEBSITE-RESEARCH/complete-website-audit.md
with open(os.path.join(BASE_DIR, "complete-website-audit.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Complete Website Audit & UX Inspection

## 1. Executive Summary of Audit

A complete browser and source-code audit was conducted on [https://www.trycompanio.in/](https://www.trycompanio.in/). The web platform is a modern, responsive Single Page Application / Server-Side Rendered (SSR) web app built with Next.js and Tailwind CSS, hosted on Vercel's global edge network, and fronted by Cloudflare.

The site is designed with a high-conversion, editorial aesthetic tailored to Indian urban youth and corporate transplants. It combines dark cinematic video hero elements, clean typography, interactive activity selectors, and persistent trust badges to overcome the inherent cultural skepticism surrounding commercial companionship in India.

![Homepage Screenshot](file:///C:/Users/Dell/Documents/codes/trycompanio/TRYCOMPANIO-RND/02-WEBSITE-RESEARCH/screenshots/homepage.png)

---

## 2. Global Navigation & Layout Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ [Logo: COMPANIO]   Explore (/explore)   How It Works   Contact   [Safety Badge] │ [Sign In] │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│                          HERO SECTION: "NEVER GO ALONE."                      │
│                  [Video Background / Dark Overlay / CTAs]                     │
│               [Button: Find a Companion]   [Button: How It Works]             │
│                                                                               │
├───────────────────────────────────────────────────────────────────────────────┤
│   ACTIVITY PLANS CAROUSEL: Café Chats | City Walks | Gigs | Gym | Museums     │
├───────────────────────────────────────────────────────────────────────────────┤
│   FULL-DAY SCENARIO JOURNEY: Dawn Walk -> Gym -> Midday Coffee -> Concert     │
├───────────────────────────────────────────────────────────────────────────────┤
│   DATABASE COUNTER: 1.2 Lakh+ Signed Up | 126 Cities Open (Hourly Synced)     │
├───────────────────────────────────────────────────────────────────────────────┤
│   SAFETY ANCHORS: ID Reviewed | Razorpay Escrow | In-App SOS | Zero Romance   │
├───────────────────────────────────────────────────────────────────────────────┤
│   FOOTER: Activities | City Links (60+) | Company | Legal (DPDPA) | Safety   │
│   STICKY BOTTOM BANNER: In-app SOS & Location Sharing (Free)                  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Desktop Header
- **Brand Identity:** Minimalist sans-serif "COMPANIO" wordmark linking to `/`.
- **Primary Links:**
  - `Explore` (`/explore`): Companion discovery filter.
  - `How it works` (`/how-it-works`): 5-step onboarding guide.
  - `Contact Us` (`/contact`): Categorized support hub.
  - `Safety Badge` (`/safety`): Green pill badge highlighting ID checks and SOS.
- **Authentication Action:** High-contrast `Sign In` / `Login` button (`/login`).

### Mobile Navigation
- **Responsive Header:** Hamburger / compact brand header with `Explore`, `Guide`, and `Contact` icon.
- **Persistent Bottom App Bar:** Fixed two-tab bottom navigation (`Explore`, `Guide`) replicating native iOS/Android mobile application ergonomics.

### Footer & Compliance Anchors
- **Legal Compliance:** Comprehensive links to Terms of Service, Community Guidelines, Privacy Policy, Refund Policy, Delivery Policy, Cookie Policy, Accessibility Statement, and Cookie Settings.
- **Statutory Corporate Details:** Explicitly displays `© TRYCOMPANIOLABS LLP. LLPIN ACY-1464. Grievance Officer: Prashant Yadav`.
- **Trust Badges:** Verified Razorpay secured payment badge, manual profile review badge, and strictly platonic guarantee icon.
- **Persistent Safety Banner:** Sticky bottom banner on all mobile and desktop viewports reading: *"In-app SOS & location sharing to share any meetup with someone you trust, free."*

---

## 3. Visual & Design System Audit

| Design Attribute | Implementation Details | UX Assessment |
| :--- | :--- | :--- |
| **Typography** | • Display Serif: *Fraunces* (Warm, editorial, trustworthy)<br>• Body Sans: *Inter* (High-legibility geometric sans-serif) | Excellent readability; bridges the gap between warm lifestyle editorial and modern tech utility. |
| **Color Palette** | • Background: Dark slate / obsidian (`#0b0f19`)<br>• Accents: Forest emerald green (`#10b981`), warm amber gold, crisp white text | Emerald green signals safety and verified legitimacy; dark canvas gives premium VIP exclusivity. |
| **Interactive Media** | • Hero video background: `hero-desktop-v4.mp4` / `hero-phone-v5.mp4`<br>• 3D Spline interactive models (`spline.design`) | High-end visual appeal that immediately distinguishes it from cheap scam/dating classifieds. |
| **Card Components** | Rounded container cards with subtle frosted-glass blur (`backdrop-blur-md`), verified shield icons, and status tags (`Available now`). | Clear, scannable information hierarchy. |
| **Form Inputs** | Clean floating labels, input masks for Indian mobile numbers (`+91`), and auto-advancing OTP fields. | Frictionless mobile form completion. |

---

## 4. Performance & Technical Inspection

- **Framework:** Next.js with React Server Components (RSC) and Turbopack bundler.
- **Rendering Strategy:** Hybrid Static Site Generation (SSG) + Incremental Static Regeneration (ISR) with a 300-second (`x-nextjs-stale-time: 300`) edge revalidation cycle for city listings.
- **Edge CDN Caching:** Cloudflare Enterprise anycast IP routing (`CF-RAY` headers) paired with Vercel edge caching (`x-vercel-cache: HIT`).
- **Asset Delivery:** Custom asset domain `cdn.trycompanio.in` + Vercel Blob Storage (`*.public.blob.vercel-storage.com`) for media and photos.
- **Security Headers:**
  - `X-Frame-Options: DENY` (Anti-clickjacking protection active)
  - `X-Content-Type-Options: nosniff` (MIME sniffing disabled)
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (2-year HSTS)
  - `Content-Security-Policy-Report-Only`: Reporting security anomalies to Sentry telemetry without breaking third-party tags.

---

## 5. Visual Proof: Key Page Captures

| Page | Captured Evidence |
| :--- | :--- |
| **Safety Centre** | ![Safety](file:///C:/Users/Dell/Documents/codes/trycompanio/TRYCOMPANIO-RND/02-WEBSITE-RESEARCH/screenshots/safety.png) |
| **How It Works** | ![How It Works](file:///C:/Users/Dell/Documents/codes/trycompanio/TRYCOMPANIO-RND/02-WEBSITE-RESEARCH/screenshots/how-it-works.png) |
| **Become a Companion** | ![Become a Companion](file:///C:/Users/Dell/Documents/codes/trycompanio/TRYCOMPANIO-RND/02-WEBSITE-RESEARCH/screenshots/become-a-companion.png) |
| **Experience: Coffee** | ![Coffee Experience](file:///C:/Users/Dell/Documents/codes/trycompanio/TRYCOMPANIO-RND/02-WEBSITE-RESEARCH/screenshots/experience-coffee.png) |
""")

# 02-WEBSITE-RESEARCH/page-inventory.md
with open(os.path.join(BASE_DIR, "page-inventory.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Complete Page Inventory & Sitemap Analysis

## 1. Complete Web Properties Inventory

The web crawler identified **90+ total indexable URLs** across core marketing, discovery, supply-side acquisition, legal compliance, and programmatic SEO geo-pages:

| URL Path | Page Title | Primary Function | Conversion Objective | Access Rule |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Companio \| Connect, Meet, and Experience | Brand Homepage & Value Prop | Direct to `/explore` or `/how-it-works` | Public |
| `/explore` | Explore companions, Companio | Companion Search & Directory | Trigger Pass Purchase to Unlock | Public Preview / Gated Full |
| `/how-it-works` | How it works, Companio | User Onboarding & Process Guide | Reduce checkout friction | Public |
| `/safety` | Safety Centre, Companio | Trust Architecture & SOS Guide | Establish safety reassurance | Public |
| `/about` | About us, Companio | Mission, Vision & Founders Story | Long-term brand affinity | Public |
| `/become-a-companion` | Become a Companion, Companio | Supply Acquisition Funnel | Complete 4-step KYC application | Public |
| `/faq` | FAQ, Companio | Frequently Asked Questions | Overcome objections & pricing queries | Public |
| `/contact` | Contact us, Companio | Categorized Customer Support | Submit support/grievance tickets | Public |
| `/trust` | Trust & ID checks, Companio | Verification Transparency | Disclose Aadhaar verification limits | Public |
| `/verify` | Check who you are meeting | Pre-Meetup Protocol Guide | Safety education for in-person meets | Public |
| `/community-guidelines`| Community Guidelines | Code of Conduct & Enforcement | Legal zero-tolerance defense | Public |
| `/refunds` | Refund policy, Companio | Wallet & Pass Cancellation Terms | Statutory consumer compliance | Public |
| `/terms` | Terms of Service | Master Legal Agreement | DPDPA & IT Act compliance | Public |
| `/privacy` | Privacy policy | Data Handling & User Rights | Privacy compliance & data deletion | Public |
| `/delivery` | Delivery policy | Digital Fulfillment Disclosures | Razorpay merchant underwriting | Public |
| `/cookies` | Cookie policy | Tracking & Consent Notice | Privacy transparency | Public |
| `/accessibility` | Accessibility, Companio | Accessibility Standards | WCAG alignment | Public |
| `/careers` | Careers, Companio | Stealth Talent Recruitment | Candidate introductions | Public |
| `/press` | Press & media, Companio | Media Kit & Press Inquiries | PR inquiries & brand assets | Public |
| `/experience/coffee` | Book a Cafe Chat in India | Activity SEO & Booking | Book café companion | Public Preview |
| `/experience/city-walk`| Book a City Walk in India | Activity SEO & Booking | Book walking companion | Public Preview |
| `/experience/events` | Book a Live Event Companion | Activity SEO & Booking | Book concert/gig companion | Public Preview |
| `/experience/gym` | Book a Gym Buddy in India | Activity SEO & Booking | Book workout partner | Public Preview |
| `/experience/museum` | Book a Museum Visit Companion | Activity SEO & Booking | Book cultural companion | Public Preview |
| `/{city}/companions` | Platonic Companions in [City] | 66 Programmatic Geo Pages | Local organic search capture | Public Preview |
| `/login` | Sign In \| Companio | Member / Companion Login | Email OTP Authentication | Public |
| `/dashboard` | User Dashboard | Client Booking Management | Re-booking & wallet management | Authenticated |
| `/companion-dashboard` | Companion Dashboard | Host Bookings & UPI Payouts | Accept meetups & withdraw earnings | Authenticated |

---

## 2. Programmatic City SEO Clusters (66 Cities Documented)

Companio deploys an aggressive programmatic local SEO architecture targeting urban hubs across 18 Indian states:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   TRYCOMPANIO NATIONAL GEO-TARGETING MATRIX                      │
├───────────────────┬──────────────────────────────────────────────────────────────┤
│ REGION / STATE    │ COVERED CITIES IN SITEMAP                                    │
├───────────────────┼──────────────────────────────────────────────────────────────┤
│ Delhi NCR         │ Delhi, Noida, Gurugram, Faridabad, Ghaziabad                 │
│ Maharashtra       │ Mumbai, Navi Mumbai, Thane, Pune, Nagpur, Nashik, Aurangabad,│
│                   │ Kolhapur, Kalyan-Dombivli, Vasai-Virar                       │
│ Karnataka         │ Bengaluru, Mysuru                                            │
│ Tamil Nadu        │ Chennai                                                      │
│ Telangana & AP    │ Hyderabad, Visakhapatnam, Vijayawada                         │
│ Gujarat           │ Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar              │
│ Rajasthan         │ Jaipur, Jodhpur, Udaipur, Kota                               │
│ Uttar Pradesh     │ Lucknow, Kanpur, Agra, Varanasi, Prayagraj, Meerut, Gorakhpur│
│ Madhya Pradesh    │ Indore, Bhopal, Gwalior, Jabalpur                            │
│ Punjab & Haryana  │ Chandigarh, Ludhiana, Amritsar, Jalandhar, Patiala, Bathinda, │
│                   │ Ambala, Hisar, Karnal                                        │
│ West Bengal       │ Kolkata, Siliguri                                            │
│ Bihar & Jharkhand │ Patna, Ranchi                                                │
│ Chhattisgarh      │ Raipur, Bhilai, Bilaspur                                     │
│ Kerala & Goa      │ Kochi, Panaji                                                │
│ Uttarakhand & NE  │ Dehradun, Guwahati                                           │
└───────────────────┴──────────────────────────────────────────────────────────────┘
```

Each city page automatically populates with localized landing copy referencing prominent regional landmarks (e.g., Hauz Khas in Delhi, Marine Drive in Mumbai, Koramangala in Bengaluru), capturing intent-heavy search queries like *"how to find friends in [City]"* or *"platonic companion in [City]"*.
""")

# 02-WEBSITE-RESEARCH/feature-analysis.md
with open(os.path.join(BASE_DIR, "feature-analysis.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Detailed Feature Analysis & Breakdown

## 1. Feature Taxonomy

Companio's feature architecture is split into five functional categories:

```
                                  TRYCOMPANIO FEATURES
                                           │
    ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
    ▼                  ▼                   ▼                   ▼                  ▼
Discovery &        Booking &           Trust &             Supply-Side         Financial &
Exploration         Chat Flow           Safety Telemetry    Management          Wallet Systems
```

---

## 2. Comprehensive Feature Matrix

### A. Discovery & Exploration Features
1. **Activity Taxonomy Filter:** Users can instantly segment companions by activity:
   - *Café Chats:* Casual 1-on-1 conversations in public coffee shops.
   - *City Walks:* Exploring parks, heritage corridors, or evening promenades.
   - *Live Events & Gigs:* Plus-one companions for concerts, standup shows, and indie gigs.
   - *Gym Buddies:* Workout spotters, running partners, and fitness accountability peers.
   - *Museum & Culture Visits:* Gallery companions for art, history, and cultural exhibits.
   - *Elder Company:* Verified social companionship for senior citizens.
2. **Companion Card Masking & Previews:**
   - Public preview cards display: First Name, Verified Badge, Age, City, Language Proficiencies (e.g., English, Hindi, Gujarati), and Activities Offered.
   - Full identity, high-resolution photo galleries, bio narratives, and direct booking calendars are gated behind an active **Companio Pass**.
3. **Availability State Indicators:**
   - Real-time `Available now` badges indicating hosts currently open for immediate same-day bookings (minimum 2 hours advance booking notice required).

### B. Booking & Communication Flow
1. **Time & Venue Scheduling Engine:**
   - Member proposes date, start time, duration (hourly blocks), and specifies an exact **public place** (e.g., Starbucks CyberHub, Blue Tokai Bandra).
2. **Asymmetric Messaging Lock:**
   - Direct messaging remains locked until the requested companion formally reviews and accepts the booking proposal. This prevents unwanted harassment, solicitation, or spamming of hosts.
3. **12-Hour Companion Acceptance SLA:**
   - Companions are provided a 12-hour response window (excluding the nighttime window from 11 PM to 8 AM). If the companion does not accept within this timeframe, the booking automatically expires and escrow funds are instantly returned to the member's wallet.

### C. Trust & Safety Telemetry
1. **4-Digit In-Person Handshake Verification:**
   - A unique 4-digit numeric code is generated on the member's application. The member only shares this code with the companion in person after meeting at the public venue and verifying identity. Entering the code releases the escrow payment.
2. **In-App SOS & Location Snapshot:**
   - A persistent floating SOS button accessible during an active booking. With one tap, users can generate a secure GPS location snapshot and booking summary directly to their trusted emergency contacts via WhatsApp or SMS.
3. **Government ID Review Badge:**
   - Companions undergo manual ID validation (checking structural validity of Aadhaar card or PAN card against live selfie submission).
4. **Safety Line Support:**
   - Direct escalation line (`+91 91794 93270`) and designated statutory grievance officer (`Prashant Yadav`).

### D. Supply-Side Management (Host Portal)
1. **4-Step Companion Onboarding Application:**
   - *Step 1:* Personal profile, age verification (18+), phone validation, and ₹99.50 application fee.
   - *Step 2:* Selection of offered activities and custom hourly rate configuration (₹300 to ₹1,500/hr).
   - *Step 3:* Upload of government identity card (Aadhaar/PAN) and high-resolution photo.
   - *Step 4:* Two-day manual review SLA before public profile activation.
2. **Interactive Earnings Calculator:**
   - Dynamic simulation widget demonstrating potential monthly earnings (e.g., completing 2 meetups/month at ₹1,999 results in ₹2,719 net monthly take-home).
3. **Host Availability Toggles:**
   - Instant pause/resume switches allowing companions to hide their profiles during exams, travel, or busy work weeks.

### E. Financial & Wallet Architecture
1. **Closed-Loop Prepaid Wallet (1:1 INR):**
   - Refunds and credits are stored as platform wallet credits redeemable for future bookings.
2. **UPI Payout Gateway:**
   - Direct bank disbursements to companion UPI addresses within 24 hours of completed meetups.
3. **12% Cashout Arbitrage:**
   - A 12% operational processing fee applied to user wallet withdrawals back to external bank accounts.
""")

# 02-WEBSITE-RESEARCH/user-journeys.md
with open(os.path.join(BASE_DIR, "user-journeys.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — User Journeys & End-to-End Workflows

## 1. Journey A: The New Member (Demand Side)

```
[Discovery]
   │  • Sees Instagram POV Reel: "Moved to Bengaluru alone"
   ▼
[Landing on trycompanio.in]
   │  • Views hero: "Never go alone"
   │  • Checks sitemap counter: "1.2L+ signed up, 126 cities open"
   │  • Inspects Safety Centre: reads "Platonic Promise"
   ▼
[Companion Browsing]
   │  • Visits /explore -> Filters by "Bengaluru" + "Café Chats"
   │  • Sees preview cards (Name, age, activities, "ID-checked" badge)
   │  • Clicks "Unlock Profile"
   ▼
[Paywall & Registration]
   │  • Enters mobile/email -> Authenticates via OTP
   │  • Selects 1-Month Pass (₹99.50) -> Pays via Razorpay UPI
   │  • Profile details, bios, and schedules unlock
   ▼
[Booking Request]
   │  • Picks companion "Aarav" (Agra/Bangalore)
   │  • Selects Saturday, 4:00 PM, 2 Hours @ Third Wave Coffee, Indiranagar
   │  • Deposits ₹800 meetup fee into Razorpay Escrow
   ▼
[Companion Confirmation]
   │  • Aarav accepts booking within 4 hours
   │  • In-app chat thread unlocks; both confirm table location
   ▼
[The In-Person Meetup]
   │  • Both arrive at public café
   │  • Member verifies companion photo matches face
   │  • Member shares 4-digit meetup code with Aarav
   │  • SOS button remains live on member screen
   ▼
[Post-Meetup Completion]
   │  • Aarav inputs 4-digit code into dashboard -> Escrow releases
   │  • Member rates experience 5 stars; leaves qualitative review
```

---

## 2. Journey B: The Companion Host (Supply Side)

```
[Recruitment Discovery]
   │  • Sees Instagram carousel: "Show people your city & earn up to 70%"
   ▼
[Host Landing Page: /become-a-companion]
   │  • Uses earnings calculator: sees ₹2,719+ monthly projection
   │  • Reads requirements: 18+, Govt ID required, strictly platonic
   ▼
[4-Step Application Submission]
   │  • Step 1: Personal info (Name, DOB, City, Contact)
   │  • Step 2: Pays ₹99.50 application fee (waived if active pass holder)
   │  • Step 3: Selects activities (Café, City Walk) & sets rate (₹450/hr)
   │  • Step 4: Uploads Aadhaar/PAN image + clear live selfie
   ▼
[Review & Approval SLA]
   │  • TryCompanio team validates structural integrity of ID within 48 hrs
   │  • Profile approved; "ID-Checked" badge issued; listing goes live
   ▼
[Receiving & Managing Requests]
   │  • Receives booking alert: "2-hr Coffee Chat at CyberHub Gurgaon"
   │  • Reviews member profile and proposed public venue
   │  • Clicks "Accept Booking" (Chat unlocks)
   ▼
[Fulfillment & Payout]
   │  • Attends meetup; completes 2-hour café conversation
   │  • Receives 4-digit code from member; submits code in portal
   │  • ₹630 (70% of ₹900) credited to wallet
   │  • UPI auto-disbursement initiates within 24 hours
```

---

## 3. Journey C: Cancellation & Refund Flow

```
[Booking Cancellation Trigger]
   │
   ├──────────────────────────────┬──────────────────────────────┐
   ▼                              ▼                              ▼
Companion Declines / Times Out  Member Cancels >2 hrs Ahead    Companion No-Show
   │                              │                              │
   │ Escrow automatically         │ Instant full refund to       │ Member alerts Safety
   │ reverts                      │ member wallet (no penalty)   │ Support Line / SOS
   ▼                              ▼                              ▼
[100% Wallet Credit Provisioned (1 Credit = ₹1 INR)] ─────────► [Support Investigation]
   │                                                             │ Companion penalized
   ▼                                                             │ or permanently banned
[Member Decision: Re-book or Cash Out]
   │
   ├─► Option 1: Re-book another companion immediately (0% fee)
   │
   └─► Option 2: Request Bank Withdrawal -> 12% Processing Fee -> Funds in bank (5-7 days)
```
""")

print("Website research reports built successfully.")
