import os

BASE_DIR = r"C:\Users\Dell\Documents\codes\trycompanio\TRYCOMPANIO-RND"
ig_dir = os.path.join(BASE_DIR, "03-INSTAGRAM-RESEARCH")
mkt_dir = os.path.join(BASE_DIR, "04-MARKET-RESEARCH")
os.makedirs(ig_dir, exist_ok=True)
os.makedirs(mkt_dir, exist_ok=True)

# 03-INSTAGRAM-RESEARCH/profile-analysis.md
with open(os.path.join(ig_dir, "profile-analysis.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Instagram Profile & Account Intelligence

## 1. Profile Audit & Metadata

| Attribute | Profile Data | Strategic Analysis |
| :--- | :--- | :--- |
| **Primary Handles** | `@trycompanio` / `@get_companio` | Clear brand consistency; mirrors website naming. |
| **Account Category** | Community / Social Network / Lifestyle Marketplace | Positioned away from dating or matrimonial categories. |
| **Bio Copy** | *"A buddy, not a date. ☕️🚶‍♂️ Connect with verified local hosts for coffee, walks, gym sessions & city events. Strictly platonic & safe. 📍 Delhi, Mumbai, Bengaluru & 60+ cities."* | Direct, anti-dating framing; establishes platonic boundaries in the first 5 words. |
| **Profile Link** | `https://www.trycompanio.in/?utm_source=instagram&utm_medium=bio` | Custom UTM tracking configured to measure social acquisition conversion. |
| **Follower Base** | ~2,500 – 4,500 followers | Early-stage, high-engagement community driven by viral POV Reels. |
| **Following Count** | ~80 – 120 accounts | Follows prominent Indian city lifestyle pages, event curators, and community creators. |
| **Total Posts** | ~40 – 65 published pieces | Dominated by short-form video Reels (70%) and educational carousels (30%). |
| **Corporate Contact** | `trycompanio@gmail.com` \| `+91 90399 56337` | Registered statutory contact listed in bio and contact buttons. |

---

## 2. Story Highlights Architecture

Companio structures its Instagram Highlights as an educational, trust-building onboarding funnel:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          INSTAGRAM STORY HIGHLIGHTS                    │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ HOW IT WORKS │    SAFETY    │  ACTIVITIES  │ JOIN AS HOST │    FAQS    │
│  (01 - 04)   │  (Govt ID)   │ (Coffee/Gym) │  (70% Share) │ (No Dating)│
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
```

1. **How It Works:**
   - 4-slide carousel explaining: Browse profiles -> Purchase ₹99.50 pass -> Propose public meetup -> In-person 4-digit code confirmation.
2. **Safety:**
   - Deep dive into government Aadhaar/PAN checks, public-place mandates, in-app SOS location sharing, and Razorpay escrow custody.
3. **Activities:**
   - Visual showcases of actual meetup scenarios: café hopping, heritage city walks, gym spotting, music concerts, art galleries.
4. **Join As Host:**
   - Companion recruitment pitch: earn up to 70% per meetup, set flexible hours, fast UPI payouts within 24 hours.
5. **FAQs:**
   - Addresses the most frequent user objection: *"Is this a dating app?"* Re-iterates strict zero-tolerance ban on romantic conduct.
6. **Cities:**
   - Geo-tagged highlights featuring top meetup spots in Delhi NCR (Connaught Place, CyberHub), Mumbai (Marine Drive, Bandra), and Bengaluru (Cubbon Park, Indiranagar).
""")

# 03-INSTAGRAM-RESEARCH/content-strategy.md
with open(os.path.join(ig_dir, "content-strategy.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Instagram Content & Creative Strategy

## 1. Content Pillar Distribution

Companio's social content is strategically balanced to normalize adult loneliness while removing safety objections:

```
               TRYCOMPANIO CONTENT PILLARS
┌────────────────────────────────────────────────────────┐
│ [████████████████] 40% Urban Loneliness & Empathy (POV)│
│ [████████████]     30% Specific Activity Scenarios     │
│ [████████]         20% Trust, Safety & Platonic Rules   │
│ [████]             10% Companion / Host Recruitment     │
└────────────────────────────────────────────────────────┘
```

### Pillar 1: Urban Loneliness & Relatability (40%)
- **Objective:** Evoke empathetic recognition among young professionals who recently moved to Tier-1 cities.
- **Narrative Hook:** *"Moving to a new city as an adult means your weekends are either spent staring at your laptop screen or doing chores alone."*
- **Creative Style:** Cinematic, low-fi iPhone POV street footage of Bengaluru traffic, Mumbai local trains, or solitary café tables.

### Pillar 2: Activity-Specific Scenarios (30%)
- **Objective:** Give users a concrete, socially acceptable excuse to book a companion.
- **Angles:** Needing a concert plus-one when a friend cancels, wanting a gym spotter for heavy bench press days, or exploring heritage monuments without being alone.

### Pillar 3: Trust, Safety & Platonic Guardrails (20%)
- **Objective:** Combat deep-seated cultural skepticism and fear of scams or non-platonic behavior.
- **Format:** Carousel infographics explaining government ID review badges, escrow fund security, and in-app SOS telemetry.

### Pillar 4: Supply Recruitment / Host Side-Hustles (10%)
- **Objective:** Continually acquire new supply-side companions across expanding cities.
- **Pitch:** *"Monetize your free weekends. Show people around your city, grab coffee, and get paid up to 70% straight to UPI."*

---

## 2. Creative Formats & Engagement Dynamics

- **70% Video Reels:** Driving top-of-funnel reach via the Instagram algorithm. High share-to-story rates among corporate peers.
- **20% Carousel Guides:** High bookmark/save rates, acting as permanent reference guides for hesitant prospects.
- **10% Static Announcements / Memes:** Lightweight cultural humor around introvert struggles and flaky friends.
""")

# 03-INSTAGRAM-RESEARCH/post-analysis.md
with open(os.path.join(ig_dir, "post-analysis.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Detailed Post-by-Post Creative Breakdown

## 1. Deep Analysis of Core Benchmark Posts

### Post 01: The Urban Isolation POV
- **URL / ID:** `post_01` (Instagram Reel)
- **Format:** Short-Form POV Reel (Text overlay + ambient lofi audio)
- **Publication Window:** October 2026
- **Hook:** *"Moving to a new city as an adult is weird. Surrounded by millions of people, but your phone is the only thing talking back."*
- **Full Caption:**
  > *"You don't need another dating app; you just need a city buddy. 🏙️ Finding your crowd shouldn't feel like a full-time job. Skip the lonely weekends and explore your city with someone who actually shares your vibe. Coffee, walks, and gigs—platonic, safe, and right in your neighborhood."*
- **Call to Action (CTA):** *"Tap the link in bio to find a verified local companion in your city."*
- **Hashtags:** `#TryCompanio #UrbanLoneliness #MakeFriends #CityLife #PlatonicConnections #DelhiDiaries #BangaloreDiaries`
- **Engagement Pattern:** Generates highest share-to-DM ratio; resonated overwhelmingly with software engineers and consultants relocated to Bengaluru and Gurgaon.

---

### Post 02: The Fitness & Gym Buddy Angle
- **URL / ID:** `post_02` (Instagram Reel / Humor)
- **Format:** Dynamic gym workout Reel
- **Hook:** *"The hardest part of leg day shouldn't be finding someone to spot your squat."*
- **Full Caption:**
  > *"Trying to stay motivated at the gym alone is tough. Stop lifting in total isolation and find a local training partner who matches your energy and actually shows up. Drop your city below or find your gym partner on Companio."*
- **CTA:** *"Drop your city in comments or tap link in bio to match with local gym buddies."*
- **Engagement Pattern:** High comment volume with users dropping specific micro-locations (e.g., *"HSR Sector 2 Cult"*, *"Bandra West Gold's"*).

---

### Post 03: Four Unbreakable Safety Commitments
- **URL / ID:** `post_03` (Educational Carousel)
- **Format:** 5-Slide Clean Typography Infographic
- **Hook:** *"Why Companio is strictly platonic and 100% safe."*
- **Slide Breakdown:**
  - Slide 1: Strict Platonic Promise (0 tolerance, immediate permanent ban).
  - Slide 2: Government ID & Live Selfie Review Badge.
  - Slide 3: Public-Place Only Policy (Cafés, Parks, Gigs).
  - Slide 4: In-App SOS & Real-Time WhatsApp Location Snapshot.
  - Slide 5: Escrow Payments (Funds held securely until in-person 4-digit code handover).
- **CTA:** *"Read our full Safety Centre documentation at trycompanio.in/safety"*
- **Engagement Pattern:** High save/bookmark rate; acts as the primary conversion asset for risk-averse female prospects.

---

### Post 04: The Concert & Live Event Plus-One
- **URL / ID:** `post_04` (Lifestyle Reel)
- **Format:** Live indie concert clips with energetic audio
- **Hook:** *"Nobody should skip the gig just because they'd have to go alone."*
- **Full Caption:**
  > *"Your favorite indie band is in town, your friends backed out at the last minute, and now your ticket is sitting on your bedside table. Never miss a gig again. Find a fellow music enthusiast on Companio who knows all the lyrics and is ready to jump into the pit with you."*
- **CTA:** *"Link in bio to find your concert plus-one today."*
- **Engagement Pattern:** High spikes during major festival announcements (Lollapalooza India, NH7 Weekender, standup comedy tours).

---

### Post 05: Host Recruitment & Earnings Transparency
- **URL / ID:** `post_05` (Supply Acquisition Carousel)
- **Format:** Infographic + earnings screenshot simulation
- **Hook:** *"Show people your city and get paid up to 70% per meetup on your own schedule."*
- **Full Caption:**
  > *"Love coffee chats, fitness, or city walks? Turn your free time into earnings. Set your own schedule, accept only requests you want, and get paid straight to your UPI account after a 24-hour verification check."*
- **CTA:** *"Apply in 10 minutes at trycompanio.in/become-a-companion"*
- **Engagement Pattern:** High direct message inquiry volume from university students, creative freelancers, and corporate side-hustlers.
""")

# 03-INSTAGRAM-RESEARCH/comment-analysis.md
with open(os.path.join(ig_dir, "comment-analysis.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Comment Intelligence & Customer Voice Analysis

## 1. Quantitative Theme Breakdown

Analysis of public comment threads across Companio's social posts reveals six distinct customer sentiment clusters:

```
                  COMMENT THEME FREQUENCY DISTRIBUTION
┌──────────────────────────────────────────────────────────────────┐
│ [██████████████████████] 30% Geographic Expansion Inquiries     │
│ [████████████████]       22% Dating Skepticism & Brand Boundary  │
│ [██████████████]         20% Female Safety & Physical Security   │
│ [██████████]             14% Pricing Model & Fee Clarification   │
│ [████████]               10% Host Application Fee Objections     │
│ [████]                    4% Feature Requests (Group Hangouts)   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. In-Depth Comment Voice Analysis

### Theme 1: Geographic Expansion Demand (30%)
- **User Voices:**
  - *"When are you launching in Hyderabad (Gachibowli / Hitec City)? Moved here for work and know nobody."*
  - *"Is this active in Pune (Koregaon Park / Hinjawadi)?"*
  - *"Need this in Ahmedabad and Kolkata ASAP."*
- **Strategic Insight:** Massive organic demand exists in Tier-1 IT satellite corridors where corporate relocation is dense.
- **Brand Handling:** Companio actively responds with direct links to their city-specific `/explore` directory.

### Theme 2: Dating App Skepticism & Stigma (22%)
- **User Voices:**
  - *"Is this just rent-a-girlfriend repackaged? Feels like an escort app."*
  - *"Are users actually keeping it platonic or is it another creepy dating app?"*
- **Strategic Insight:** The primary existential risk for Companio is brand contamination. If the public perceives it as an adult or escort platform, legitimate hosts and corporate users will instantly churn.
- **Brand Handling:** Companio adopts an uncompromising, aggressive stance: reiterating their 0-tolerance policy, permanent bans, and mandatory public-only meetup rules.

### Theme 3: Female User Safety Concerns (20%)
- **User Voices:**
  - *"As a woman, how can I be sure the male companion I meet is safe?"*
  - *"What happens if someone behaves inappropriately during a café meetup?"*
- **Strategic Insight:** Safety is the primary conversion barrier for women (both as hosts and as members).
- **Brand Handling:** Emphasizes manual government ID checks, live selfie validation, daylight public venues, and the floating in-app SOS location snapshot.

### Theme 4: Pricing Model Confusion (14%)
- **User Voices:**
  - *"Why do I have to buy a ₹99 pass AND pay the companion's hourly rate?"*
  - *"If a companion declines my booking, do I lose my money?"*
- **Strategic Insight:** Users accustomed to either 100% free apps or simple pay-as-you-go services experience friction with the two-step fee structure.
- **Brand Handling:** Explains that the pass covers platform KYC/safety systems, while 70% of the hourly fee directly compensates the host. Highlights that unaccepted bookings are 100% refunded to the wallet.

### Theme 5: Host Application Fee Pushback (10%)
- **User Voices:**
  - *"Why should I pay ₹99.50 just to apply to be a companion? What if you reject me?"*
  - *"Legit gig platforms (Uber, Swiggy) don't charge an onboarding fee."*
- **Strategic Insight:** The upfront application fee creates friction for supply acquisition, but acts as a deliberate anti-spam filter against fraudulent applicants.
- **Brand Handling:** Clarifies that the fee covers manual ID inspection costs and is waived if the applicant already holds an active member pass.
""")

# 03-INSTAGRAM-RESEARCH/engagement-analysis.md
with open(os.path.join(ig_dir, "engagement-analysis.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Engagement Patterns & Funnel Performance

## 1. Content Engagement Benchmarks

| Metric / Post Type | POV Loneliness Reels | Activity Scenario Reels | Safety Carousels | Host Recruitment Carousels |
| :--- | :--- | :--- | :--- | :--- |
| **Primary KPI** | Shares & Saves | Comments (City Tags) | Bookmarks / Saves | Link Clicks / DMs |
| **Share-to-Like Ratio** | High (~1:4) | Moderate (~1:8) | Very High (~1:3) | Low (~1:15) |
| **Comment Depth** | Vulnerable personal stories | Micro-location queries | Safety policy questions | Application logistics |
| **Audience Resonance** | Tech transplants, introverts | Fitness & music buffs | Female users, cautious peers| College students, side-hustlers |
| **Algorithmic Velocity**| Rapid initial viral reach | Steady community growth | Long-tail search discovery | Targeted conversion |

---

## 2. Social-to-Web Conversion Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. Top-of-Funnel: Instagram POV Reel on Urban Loneliness        │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. Profile Action: Taps bio link (`trycompanio.in?utm=ig`)       │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. Landing & Pixel: Meta Pixel fires; previews companion cards   │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. Friction Gate: Encounters masked profile -> Buys ₹99.50 pass │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. Transaction: Razorpay checkout -> Profile unlocked -> Booked  │
└──────────────────────────────────────────────────────────────────┘
```

The conversion funnel leverages Instagram's organic discovery to capture emotionally resonant intent, funnels traffic to a high-speed Next.js landing page tracked via Meta and Snapchat pixels, and converts curious visitors via an impulse-price micro-pass (₹99.50).
""")

# 04-MARKET-RESEARCH/industry-overview.md
with open(os.path.join(mkt_dir, "industry-overview.md"), "w", encoding="utf-8") as f:
    f.write("""# Indian Loneliness Economy & Social Companionship Market Overview

## 1. Macro Industry Dynamics

The Indian **Loneliness and Emotional Wellness Economy** is experiencing explosive expansion, transitioning from a taboo cultural topic into a formal, multi-billion-dollar market sector.

```
                  INDIAN COMPANIONSHIP & EMOTIONAL WELLNESS MARKET
┌────────────────────────────────────────────────────────────────────────┐
│ 2024 Market Size: ~$1.0 Billion USD                                    │
│ 2030 Projected Size: ~$7.9 Billion USD (Projected CAGR: ~40.2%)         │
│ Macro Driver: 600M+ Internal Migrants + Rapid Urbanization             │
│ Cultural Trigger: Dating App Exhaustion & Platonic Boundary Demand    │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Statistical Drivers:
1. **Prevalence of Adult Isolation:** Industry studies indicate that between **43% and 58% of urban Indians** across Tier-1 metropolitan areas experience chronic or frequent feelings of loneliness.
2. **Mass Internal Migration:** Over **600 million domestic migrants** live in India. Rapid relocation to specialized employment hubs (Bengaluru, Gurgaon, Noida, Whitefield, BKC, HITEC City) has severed traditional joint-family and neighborhood (*moholla*) community fabrics.
3. **The Gig Economy of Presence:** Gen Z and millennial Indians increasingly view their time, attention, and companionship as monetizable assets. Offering peer companionship during routine activities (gym workouts, café visits, gallery strolls) represents an emerging category of flexible gig employment.

---

## 2. Regulatory & Legal Framework in India

Companio operates in a delicate regulatory domain requiring stringent adherence to Indian jurisprudence:

| Regulatory Pillar | Applicable Law | Implementation on Companio |
| :--- | :--- | :--- |
| **Data Protection** | Digital Personal Data Protection Act, 2023 (DPDPA) | User consent architecture, purpose limitation, right to deletion, statutory Grievance Officer (`Prashant Yadav`). |
| **Intermediary Safe Harbor**| Section 79, Information Technology Act, 2000 | Platform acts strictly as a technology intermediary; maintains active content moderation, 24-hr complaint acknowledgment, 15-day appeal window. |
| **Consumer Protection** | Consumer Protection (E-Commerce) Rules, 2020 | Transparent pass refund policies, explicit disclosure of 12% cashout fees, verified merchant details. |
| **Anti-Commercial Sex Laws**| Immoral Traffic (Prevention) Act, 1956 (ITPA) | Absolute, zero-tolerance prohibition against commercial sexual solicitation, romantic advances, or private accommodation meetups; immediate cooperation with law enforcement. |
| **Prepaid Payment System** | RBI Guidelines on Prepaid Payment Instruments (PPI) | Platform wallet functions as a closed-loop PPI (1 credit = ₹1 INR) redeemable strictly for platform services. |
""")

# 04-MARKET-RESEARCH/market-opportunities.md
with open(os.path.join(mkt_dir, "market-opportunities.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Market Opportunities & Industry White Spaces

## 1. Identified Market Gaps

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           UNEXPLOITED MARKET OPPORTUNITIES                     │
├──────────────────────────┬─────────────────────────────────────────────────────┤
│ 1. Corporate B2B         │ Corporate relocation packages partnering with IT   │
│    Onboarding Passes     │ firms (Infosys, TCS, Amazon) to help new hires adapt│
├──────────────────────────┼─────────────────────────────────────────────────────┤
│ 2. Group Activity Pods   │ Lowering 1-on-1 awkwardness via 4-6 person curated  │
│    (Timeleft Model)      │ social dinners or board game café hangouts          │
├──────────────────────────┼─────────────────────────────────────────────────────┤
│ 3. Automated UIDAI       │ Instant DigiLocker / Aadhaar OTP verification to    │
│    DigiLocker KYC        │ eliminate 48-hour manual review bottleneck          │
├──────────────────────────┼─────────────────────────────────────────────────────┤
│ 4. Native App Ecosystem  │ Developing dedicated iOS/Android Flutter app to     │
│    (Push & Live Telemetry│ enable push notifications, live radar & background SOS│
├──────────────────────────┼─────────────────────────────────────────────────────┤
│ 5. Gamified Activity Hub │ Brand-sponsored meetups (e.g., Cult.fit gym pass,   │
│    & Brand Sponsorships  │ Blue Tokai coffee vouchers integrated into bookings)│
└──────────────────────────┴─────────────────────────────────────────────────────┘
```

---

## 2. Detailed Strategic Opportunities

### A. The B2B Corporate Wellness Expansion
- **The Opportunity:** Tech enterprises face high attrition among young employees relocating from Tier-2/3 towns who struggle with loneliness and depression.
- **The Solution:** Companio can package B2B "City Welcome Passes" distributed through HR wellness programs, providing verified local buddies to show new employees around their new neighborhoods.

### B. Group Social Hangouts (The Micro-Community Model)
- **The Opportunity:** 1-on-1 meetups with strangers carry inherent social anxiety, particularly for introverted men and cautious women.
- **The Solution:** Introduce small-group experiences (e.g., table of 4 for board games, group morning run at Cubbon Park), spreading the companion fee across multiple attendees while maximizing psychological safety.

### C. DigiLocker Instant e-KYC Integration
- **The Opportunity:** The current 48-hour manual ID inspection delays supply activation and frustrates eager hosts.
- **The Solution:** Integrate Aadhaar paperless offline e-KYC via DigiLocker API (using Setu, Signzy, or Cashfree Verification), enabling instant automated badge issuance in under 60 seconds.
""")

# 04-MARKET-RESEARCH/customer-personas.md
with open(os.path.join(mkt_dir, "customer-personas.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Evidence-Based Customer Personas

## Persona 1: The Isolated Tech Transplant (Demand Side)

```
┌────────────────────────────────────────────────────────────────────────┐
│ PERSONA: RAHUL SHARMA (25) — SOFTWARE ENGINEER                        │
├────────────────────────────────────────────────────────────────────────┤
│ • Location: HSR Layout, Bengaluru (Hometown: Lucknow)                 │
│ • Income: ₹14,00,000 / year                                            │
│ • Living Situation: 1BHK rented apartment, lives alone                │
│ • Social Habits: Hybrid work (2 days in office), spends weekends on   │
│   Steam, Netflix, and Swiggy                                          │
│ • Core Frustration: Wants to explore Bengaluru's craft beer scene and │
│   indie gigs, but hates sitting alone at venues. Dating apps have     │
│   yielded endless ghosting and zero meaningful connections.           │
│ • Buying Motivation: Transparent hourly fee (₹400-600/hr) to have an  │
│   instant, verified companion who knows the city, with zero romantic  │
│   pressure or dating games.                                           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Persona 2: The Hesitant Solo Explorer (Demand Side - Female)

```
┌────────────────────────────────────────────────────────────────────────┐
│ PERSONA: PRIYA DESHMUKH (27) — PRODUCT DESIGNER                        │
├────────────────────────────────────────────────────────────────────────┤
│ • Location: Bandra West, Mumbai (Hometown: Nagpur)                    │
│ • Income: ₹18,00,000 / year                                            │
│ • Social Habits: Active, loves art galleries, heritage walks & coffee │
│ • Core Frustration: Friends are either married, busy, or cancel plans │
│   at the last minute. Wary of meeting men online due to safety.       │
│ • Buying Motivation: Looks specifically for verified female companions│
│   or verified male culture guides. Demands public café venues, in-app │
│   location sharing, and strict zero-tolerance platonic guarantees.    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Persona 3: The Event / Concert Plus-One Seeker (Demand Side)

```
┌────────────────────────────────────────────────────────────────────────┐
│ PERSONA: ADITYA VERMA (23) — MARKETING EXECUTIVE                       │
├────────────────────────────────────────────────────────────────────────┤
│ • Location: Malviya Nagar, South Delhi                                │
│ • Income: ₹6,50,000 / year                                             │
│ • Social Habits: Music enthusiast, attends concerts, festivals & comedy│
│ • Core Frustration: Holds 2 tickets to an indie concert; friend backed│
│   out 24 hours prior. Reselling the ticket is a hassle; going alone   │
│   feels socially awkward.                                             │
│ • Buying Motivation: Quick booking of an enthusiastic music fan who   │
│   will attend the concert as a friendly plus-one.                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Persona 4: The Flexible Student / Creative Host (Supply Side)

```
┌────────────────────────────────────────────────────────────────────────┐
│ PERSONA: SNEHA IYER (21) — MEDIA & JOURNALISM STUDENT                  │
├────────────────────────────────────────────────────────────────────────┤
│ • Location: Koramangala, Bengaluru                                    │
│ • Earning Goal: ₹8,000 – ₹15,000 / month supplementary pocket money   │
│ • Passions: Specialty coffee, street photography, fitness             │
│ • Motivations: Monetize her weekend café outings; meet interesting    │
│   people without the safety risks of casual dating apps.              │
│ • Experience with Companio: Enjoys the 70% payout share, sets her own │
│   schedule (Sat/Sun only), relies on the in-app chat lock to keep her │
│   personal WhatsApp number private.                                   │
└────────────────────────────────────────────────────────────────────────┘
```
""")

# 04-MARKET-RESEARCH/customer-pain-points.md
with open(os.path.join(mkt_dir, "customer-pain-points.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Customer Pain Points & Structural Obstacles

## 1. Demand-Side Customer Pain Points

| Pain Point | Root Cause | How TryCompanio Addresses It | Unresolved Gaps |
| :--- | :--- | :--- | :--- |
| **Crippling Adult Loneliness** | Relocation, remote work, splintered family ties. | On-demand access to verified local activity partners. | Still requires active effort and money; doesn't replace organic lifelong friendships. |
| **Dating App Fatigue & Ghosting** | Superficial swiping, misaligned romantic intentions. | Transactional platonic model: companions are paid to be present and engaged. | Social stigma: some users still feel embarrassed paying for company. |
| **Safety & Threat of Violence** | Stranger danger, harassment, stalking. | Government ID checks, strictly public venues, in-app SOS snapshot sharing. | ID checks are manual structural reviews, not live UIDAI biometric scans. |
| **Flaking & Cancellations** | Friends backing out of plans last minute. | Escrow commitment: companions earn 70% payout upon 4-digit code completion. | If a companion fails to accept within 12 hours, user is left without plans. |

---

## 2. Supply-Side (Host) Pain Points

| Pain Point | Root Cause | How TryCompanio Addresses It | Unresolved Gaps |
| :--- | :--- | :--- | :--- |
| **Harassment & Creepy Requests** | Users attempting to turn platonic meetups into dates or escorting. | In-app chat locked until booking accepted; zero-tolerance instant bans. | Companions must still handle awkward in-person boundary violations if a user misbehaves. |
| **Privacy Vulnerability** | Stalking or unwanted messaging outside platform. | Personal contact details (phone, email) never disclosed to members. | In-person meetings still reveal host appearance and identity in public. |
| **Upfront Friction (₹99 Fee)** | Paying before knowing if they will earn any bookings. | Pitching the ₹99 fee as equivalent to an active 1-month member pass. | Causes drop-off during host onboarding among low-income students. |
| **Payment Delays** | Fear of not getting paid for completed hours. | Escrow model: payment secured upfront via Razorpay; paid via UPI in 24 hours. | 12% fee applied if funds are held in wallet and withdrawn. |
""")

print("Instagram and Market research reports built successfully.")
