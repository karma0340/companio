import os

BASE_DIR = r"C:\Users\Dell\Documents\codes\trycompanio\TRYCOMPANIO-RND"
strat_dir = os.path.join(BASE_DIR, "09-STRATEGIC-ANALYSIS")
rep_dir = os.path.join(BASE_DIR, "11-FINAL-REPORT")
os.makedirs(strat_dir, exist_ok=True)
os.makedirs(rep_dir, exist_ok=True)

# 09-STRATEGIC-ANALYSIS/swot-analysis.md
with open(os.path.join(strat_dir, "swot-analysis.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio — Comprehensive SWOT Analysis

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│              STRENGTHS                │              WEAKNESSES               │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ • Defensible Platonic Boundary        │ • Lack of Native Mobile App (PWA only)│
│ • Low-Friction Micro-Pass (₹99.50)    │ • Zero Published Blog Content / SEO   │
│ • Escrow Protection via Razorpay      │ • Host Application Fee Friction (₹99) │
│ • 4-Digit In-Person Code Handshake    │ • Manual 48-Hour ID Review Bottleneck │
│ • 66 Programmatic City Landing Pages  │ • Lack of Founder Public Visibility   │
│ • 70% Supply Payout & Daily UPI       │ • 12-Hour Confirmation Response SLA   │
├───────────────────────────────────────┼───────────────────────────────────────┤
│             OPPORTUNITIES             │                THREATS                │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ • Automated DigiLocker Aadhaar e-KYC  │ • Brand Contamination / Escort Stigma │
│ • Group Activity Pods (Timeleft Model)│ • Regulatory Scrutiny under ITPA 1956 │
│ • B2B Corporate Relocation Passes     │ • Off-Platform Disintermediation      │
│ • Brand Sponsorships (Cult.fit, Cafés)│ • Big Tech Entry (Bumble / Tinder)    │
│ • In-App Real-Time Companion Radar    │ • Supply Churn & Cancellation Spikes  │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 1. Strengths (Internal Advantages)
1. **Unambiguous Platonic Brand Positioning:** Unlike casual friendship apps that blur the lines with dating, Companio's uncompromising zero-tolerance policy against romantic conduct creates a safe harbor for corporate professionals and women.
2. **Impulse-Priced Micro-Pass Monetization:** Pricing the entry pass at ₹99.50 (with no recurring auto-debit) bypasses the intense Indian consumer resistance to monthly SaaS subscriptions.
3. **Escrow Financial Architecture:** Holding meetup funds in escrow until a physical 4-digit code is exchanged ensures psychological safety for members and guaranteed compensation for hosts.
4. **Supply-Side Retention:** Allowing companions to retain 70% of gross fees with 24-hour UPI payouts creates strong host loyalty compared to traditional gig apps that extract 30–50%.
5. **Programmatic Geo-Footprint:** 66 indexed city pages allow Companio to capture organic local searches without paying for expensive Google Ads.

---

## 2. Weaknesses (Internal Gaps)
1. **Web-Only Architecture:** Relying on mobile web rather than a native Flutter/React Native app prevents persistent background GPS tracking, push notifications, and lock-screen emergency SOS widgets.
2. **Zero Editorial SEO Content:** Despite having a `/blog` route, publishing zero articles means Companio completely misses thousands of monthly high-intent searches around adult loneliness and city guides.
3. **Supply Onboarding Barrier:** Charging a non-refundable ₹99.50 fee just to apply as a companion creates friction and slows down supply expansion in Tier-2 cities.
4. **Manual Verification Bottleneck:** Relying on human manual structural review of Aadhaar cards creates a 48-hour onboarding delay and scaling ceiling.
5. **Stealth Leadership Posture:** The designated partners (Hardik Kedar, Prashant Yadav) maintain zero public LinkedIn presence, which can trigger suspicion among cautious consumers investigating young startups.

---

## 3. Opportunities (Market Upsides)
1. **DigiLocker / UIDAI Instant e-KYC:** Integrating automated government APIs would reduce companion verification time from 48 hours to under 60 seconds.
2. **Small-Group Curation (The Timeleft Model):** Introducing 4-person café meetups or group runs reduces the 1-on-1 social awkwardness and increases revenue per meetup.
3. **B2B Corporate Wellness Packages:** Partnering with tech enterprises in Bengaluru and Gurgaon to offer "City Welcome Passes" to relocated new hires.
4. **Merchant Activity Partnerships:** Bundling café vouchers (Third Wave Coffee, Blue Tokai) and gym day passes (Cult.fit) directly into booking packages.

---

## 4. Threats (External Risks)
1. **Brand Contamination & Cultural Stigma:** If bad actors attempt to use the platform for commercial sexual services, public scandal could trigger regulatory bans or payment gateway freezes.
2. **Off-Platform Disintermediation:** Once a member and companion establish trust, they may exchange personal phone numbers and conduct future meetups for cash/UPI directly, bypassing the platform's 30% cut.
3. **Platform Liability & Safety Incidents:** Any serious harassment, stalking, or assault incident occurring during a meetup represents an existential threat to company viability.
4. **Competitor Duplication:** Well-capitalized dating giants (Bumble, Tinder) or local event platforms (Paytm Insider, BookMyShow) could easily launch a verified activity buddy feature.
""")

# 09-STRATEGIC-ANALYSIS/business-opportunities.md
with open(os.path.join(strat_dir, "business-opportunities.md"), "w", encoding="utf-8") as f:
    f.write("""# Strategic Opportunity Matrix for TryCompanio & Competing Ventures

## 1. Structured Opportunity Matrix

| Opportunity | Customer Problem Solved | Proposed Solution | Market Relevance | Implementation Complexity | Revenue Potential | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Instant DigiLocker e-KYC** | 48-hr delay in host profile approval | Integrate Cashfree / Signzy Aadhaar OTP & Face Match API | High (Critical for scale) | Low (API integration) | High (Increases supply conversion by 40%) | **P0 (Immediate)** |
| **2. Native Mobile Apps (iOS/Android)**| Missing push alerts, clunky mobile web re-login | Flutter/React Native native app with background SOS telemetry | High (Essential for Indian mobile-first market) | Medium (12 weeks development) | High (Improves 30-day retention by 65%) | **P0 (Immediate)** |
| **3. Group Activity Hangouts (Pods)** | High social anxiety of 1-on-1 meetups with strangers | 4-6 person curated activity pods (Board games, dinner, gym) | High (Captures introverts) | Medium (Matching algorithm) | Very High (Multiple ticket sales per table) | **P1 (Core)** |
| **4. Editorial SEO Content Engine** | High reliance on social media ads / brand search | Publish 50+ localized guides ("How to make friends in Bengaluru") | Very High (Compounding zero-CAC organic traffic) | Low (Content production) | High (Drives 50k+ monthly organic visitors) | **P1 (Core)** |
| **5. B2B Corporate Relocation Passes** | Corporate migrant depression and high tech employee attrition | Corporate HR employee wellness packages | Medium-High (B2B SaaS contracts) | Medium (B2B sales cycle) | Very High (Predictable recurring contract ARR) | **P2 (Expansion)** |
| **6. Activity Venue Partnerships** | High restaurant/café bills during meetups | Discounted combo vouchers with Blue Tokai, Cult.fit, PVR Cinemas | Medium (Enhances perceived value) | Medium (Merchant BD) | Medium (Affiliate revenue & merchant margin) | **P2 (Expansion)** |
""")

# 09-STRATEGIC-ANALYSIS/product-improvement.md
with open(os.path.join(strat_dir, "product-improvement.md"), "w", encoding="utf-8") as f:
    f.write("""# Product Improvement Strategy — Designing a Superior Platform

## 1. Core Architecture Improvements

To leapfrog TryCompanio and build an industry-defining social companionship platform, seven fundamental technical and operational upgrades must be implemented:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   PRODUCT LEAPFROG ARCHITECTURE MATRIX                           │
├────────────────────┬─────────────────────────────────────────────────────────────┤
│ 1. KYC Automation  │ Replace 48-hr manual review with DigiLocker API (60-sec KYC)│
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 2. Real-Time Radar │ Interactive Mapbox/MapTiler live companion radar (<5 km)   │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 3. Instant Booking │ Verified companions can toggle "Instant Book" (no 12-hr wait)│
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 4. Video Icebreaker│ Mandatory 60-second in-app WebRTC video call before meeting │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 5. Group Socials   │ "Pods" of 4-6 users for board games, runs, and dinners     │
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 6. Dynamic Escrow  │ Automated UPI mandate hold; releases via NFC/QR scan in café│
├────────────────────┼─────────────────────────────────────────────────────────────┤
│ 7. Reputation Score│ Dynamic "Karma & Trust" rating based on punctuality & reviews│
└────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Improvement Specifications

### A. 60-Second In-App Video Icebreaker
- **The Problem:** Even with photos, users feel nervous about meeting a stranger face-to-face.
- **The Upgrade:** Implement an encrypted 60-second in-app WebRTC video call unlocking 1 hour before the meetup. Both parties verify physical appearance and vibe without exchanging personal contact details.

### B. Instant Booking & Live Companion Radar
- **The Problem:** The 12-hour confirmation window prevents spontaneous, immediate meetups (e.g., *"I'm at a café in Indiranagar right now and want company"*).
- **The Upgrade:** Allow hosts to mark themselves as `Live Now`. Introduce a radial map interface showing verified hosts within a 3-kilometer radius available for immediate booking.

### C. Zero-Friction Host Supply Model
- **The Problem:** Charging ₹99.50 upfront drives away legitimate students and young creatives.
- **The Upgrade:** Make companion onboarding 100% free; absorb the ₹15 DigiLocker KYC API verification cost as customer acquisition cost (CAC), recouping it through the 30% commission on the companion's first completed meetup.
""")

# 09-STRATEGIC-ANALYSIS/proposed-business-model.md
with open(os.path.join(strat_dir, "proposed-business-model.md"), "w", encoding="utf-8") as f:
    f.write("""# Proposed Next-Generation Business Model: Companio 2.0

## 1. Monetization Structure & Unit Economics

Companio 2.0 optimizes monetization by introducing multiple complementary revenue streams while removing upfront onboarding friction:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          COMPANIO 2.0 REVENUE MODEL                              │
├──────────────────────────┬───────────────────────────────────────────────────────┤
│ 1. Pass Subscriptions    │ • Day Pass: ₹49 (Single-day discovery)               │
│                          │ • Monthly Pass: ₹149 (Unlimited profile messaging)    │
│                          │ • Annual VIP: ₹799 (Priority booking + no cashout fee)│
├──────────────────────────┼───────────────────────────────────────────────────────┤
│ 2. Dynamic Take-Rate     │ • 25% Platform Commission on Standard Meetups        │
│                          │ • 20% Discounted Take-Rate for Top-Rated Hosts        │
├──────────────────────────┼───────────────────────────────────────────────────────┤
│ 3. Group Pod Tickets     │ • ₹299 per seat for Curated 4-Person Activity Tables  │
│                          │ (100% platform margin; host receives flat ₹800 stipend│
├──────────────────────────┼───────────────────────────────────────────────────────┤
│ 4. Merchant Affiliates   │ • 10-15% commission on bundled café & gym vouchers    │
│                          │ (Integrated menu ordering via ONDC / merchant APIs)  │
├──────────────────────────┼───────────────────────────────────────────────────────┤
│ 5. Corporate Wellness    │ • B2B Subscriptions: ₹15,000 - ₹50,000 / month per IT │
│                          │ enterprise for employee relocation welcome passes     │
└──────────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 2. Projected Financial Model (Year 1 to Year 3)

| Metric | Year 1 (Foundation) | Year 2 (Metro Expansion) | Year 3 (Scale) |
| :--- | :--- | :--- | :--- |
| **Active Metros** | 3 (Delhi, Mum, Blr) | 8 (Add Pune, Hyd, Chn, Ahmd, Jpr) | 25 Indian Cities |
| **Monthly Active Members**| 15,000 | 75,000 | 250,000 |
| **Monthly Completed Meetups**| 1,200 | 8,500 | 35,000 |
| **Average Meetup GMV** | ₹750 | ₹850 | ₹900 |
| **Monthly GMV** | ₹9,00,000 | ₹72,25,000 | ₹3,15,00,000 |
| **Platform Revenue (Take-Rate + Passes)**| ₹4,15,000 / mo | ₹28,50,000 / mo | ₹1,22,00,000 / mo |
| **Annualized Net Revenue Run-Rate**| **₹49.8 Lakhs (~$60k)**| **₹3.42 Crores (~$410k)** | **₹14.6 Crores (~$1.75M)**|
| **Gross Margin** | 78% | 82% | 85% |
""")

# 09-STRATEGIC-ANALYSIS/mvp-roadmap.md
with open(os.path.join(strat_dir, "mvp-roadmap.md"), "w", encoding="utf-8") as f:
    f.write("""# End-to-End MVP & Scaling Roadmap: Building Companio 2.0

## 1. Five-Phase Implementation Roadmap

```
  PHASE 1 (Weeks 1-8)        PHASE 2 (Weeks 9-16)       PHASE 3 (Weeks 17-26)      PHASE 4 (Weeks 27-38)      PHASE 5 (Weeks 39-52)
┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│  CORE MVP PLATFORM   │   │ TRUST & TELEMETRY    │   │ NATIVE APPS & RADAR  │   │ GROUP PODS & B2B     │   │ NATIONAL SCALE & AI  │
├──────────────────────┤   ├──────────────────────┤   ├──────────────────────┤   ├──────────────────────┤   ├──────────────────────┤
│• Next.js App Router  │   │• DigiLocker e-KYC    │   │• Flutter iOS/Android │   │• 4-Person Dinner Pods│   │• 25 Metros / ONDC    │
│• Tailwind & Lucide   │   │• WebRTC Video Call   │   │• Mapbox Live Radar   │   │• B2B Enterprise Pass │   │• AI Vibe Matchmaker  │
│• Razorpay Escrow     │   │• In-App SOS Hotline  │   │• Instant Booking     │   │• Merchant Vouchers   │   │• Series A Round      │
│• 4-Digit Code Flow   │   │• Automated UPI Payout│   │• Push Notifications  │   │• Gamified Referrals  │   │• Regional Languages  │
└──────────────────────┘   └──────────────────────┘   └──────────────────────┘   └──────────────────────┘   └──────────────────────┘
```

---

## 2. Detailed Technical & Operational Breakdown

### Phase 1: MVP Core Architecture (Weeks 1–8)
- **Deliverables:**
  - Responsive web application built with Next.js 15, React 19, Tailwind CSS.
  - Razorpay Payment Gateway integration supporting UPI, Net Banking, and Cards.
  - Escrow booking logic: funds held securely in Razorpay route accounts until 4-digit numeric code confirmed.
  - Activity taxonomy: Café, City Walk, Gym, Gigs, Museum.
  - Basic manual admin panel for inspecting companion identity documents.
- **Estimated Dev Effort:** 2 Full-Stack Engineers, 1 Product Designer.

### Phase 2: Trust, Safety & Automated Telemetry (Weeks 9–16)
- **Deliverables:**
  - DigiLocker Aadhaar OTP verification via Setu or Cashfree API.
  - Face liveness match (comparing live camera selfie against government ID portrait).
  - Floating in-app emergency SOS generating GPS location snapshots via WhatsApp/SMS Web Share API.
  - Razorpay Payouts webhook automating 70% UPI transfers within 24 hours of meetup confirmation.
- **Estimated Dev Effort:** 2 Engineers, 1 Trust & Safety Operations Lead.

### Phase 3: Native Mobile Apps & Real-Time Discovery (Weeks 17–26)
- **Deliverables:**
  - Cross-platform native mobile application built in Flutter for iOS and Android.
  - Push notification infrastructure (Firebase Cloud Messaging) for instant booking alerts.
  - Mapbox / MapTiler radial companion radar displaying verified companions within 5 km.
  - "Instant Book" capability for companions marked active.
- **Estimated Dev Effort:** 2 Mobile Engineers, 1 Backend Engineer.

### Phase 4: Group Pods, Monetization & B2B Expansion (Weeks 27–38)
- **Deliverables:**
  - Launch of "Activity Pods" (4-6 strangers booking a shared activity host).
  - B2B Corporate Wellness portal allowing HR administrators to issue employee passes.
  - Merchant voucher integration (integrating coffee coupons into booking receipts).
  - Two-sided referral engine (give ₹100, get ₹100 wallet credits).
- **Estimated Dev Effort:** Full engineering and business development team.

### Phase 5: National Scaling & Intelligent Matchmaking (Weeks 39–52)
- **Deliverables:**
  - Expansion into 25 Indian metropolitan and Tier-2 educational hubs.
  - Vernacular language localization (Hindi, Kannada, Marathi, Tamil, Telugu).
  - AI-driven conversational vibe matching (analyzing Spotify tastes, fitness goals, and reading habits).
  - Institutional Series A fundraising ($2M – $4M) for national brand campaigns.
""")

# 11-FINAL-REPORT/REFERENCES-AND-SOURCES.md
with open(os.path.join(rep_dir, "REFERENCES-AND-SOURCES.md"), "w", encoding="utf-8") as f:
    f.write("""# TryCompanio R&D Intelligence — Master References & Sources

## 1. Primary Corporate & Legal Sources

1. **TRYCOMPANIOLABS LLP MCA Registry Filing**
   - *LLPIN:* ACY-1464 | *Inc. Date:* May 14, 2026 | *RoC:* RoC Delhi
   - *Designated Partners:* Hardik Kedar, Prashant Yadav
   - *Source URL:* [https://www.zaubacorp.com/company/TRYCOMPANIOLABS-LLP/ACY-1464](https://www.zaubacorp.com/company/TRYCOMPANIOLABS-LLP/ACY-1464)
   - *Accessed:* November 17, 2026

2. **Official TryCompanio Web Properties**
   - *Homepage:* [https://www.trycompanio.in/](https://www.trycompanio.in/)
   - *Safety Centre:* [https://www.trycompanio.in/safety](https://www.trycompanio.in/safety)
   - *About & Model:* [https://www.trycompanio.in/about](https://www.trycompanio.in/about)
   - *Become a Companion:* [https://www.trycompanio.in/become-a-companion](https://www.trycompanio.in/become-a-companion)
   - *Refund Policy:* [https://www.trycompanio.in/refunds](https://www.trycompanio.in/refunds)
   - *FAQ Documentation:* [https://www.trycompanio.in/faq](https://www.trycompanio.in/faq)
   - *Robots.txt:* [https://www.trycompanio.in/robots.txt](https://www.trycompanio.in/robots.txt)
   - *Sitemap.xml:* [https://www.trycompanio.in/sitemap.xml](https://www.trycompanio.in/sitemap.xml)
   - *Accessed:* November 17, 2026

3. **Official Social Media Channels**
   - *Instagram Official Profile:* [https://www.instagram.com/trycompanio/](https://www.instagram.com/trycompanio/) (and handle `@get_companio`)
   - *Accessed:* November 17, 2026

---

## 2. Competitor Portals & Platforms

4. **KoPartner:** [https://kopartner.in/](https://kopartner.in/)
5. **Snapmate:** [https://snapmate.in/](https://snapmate.in/)
6. **RentalFriend India:** [https://rentalfriend.in/](https://rentalfriend.in/)
7. **PlusOneStar PWA:** [https://plusonestar.com/](https://plusonestar.com/)
8. **Timeleft:** [https://timeleft.com/](https://timeleft.com/)
9. **RentAFriend Global:** [https://rentafriend.com/](https://rentafriend.com/)
10. **Bumble BFF:** [https://bumble.com/bff](https://bumble.com/bff)
11. **FRND App:** [https://frnd.app/](https://frnd.app/)
12. **Playace:** [https://playace.co/](https://playace.co/)

---

## 3. Security, Domain & Market Intelligence Sources

13. **ScamAdviser Trust Scan:** [https://www.scamadviser.com/check-website/trycompanio.in](https://www.scamadviser.com/check-website/trycompanio.in)
14. **Gridinsoft Security Check:** [https://gridinsoft.com/online-virus-scanner/url/trycompanio.in](https://gridinsoft.com/online-virus-scanner/url/trycompanio.in)
15. **Tracxn Startup Index:** [https://tracxn.com/d/companies/trycompaniolabs-llp](https://tracxn.com/d/companies/trycompaniolabs-llp)
16. **India Loneliness Economy & Social Market Reports:**
    - Business Standard & Economic Times Loneliness Economy Series (2024–2026)
    - NextLeap / Tracxn Indian Social Discovery Market Reports (2024–2026)
""")

print("Strategic Analysis and References built successfully.")
