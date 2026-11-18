import os

DOSSIER_DIR = r"C:\Users\Dell\Documents\codes\trycompanio\WHITEPAPER-DOSSIER"

subdirs = [
    "01-THE-CORE-IDEA",
    "02-PROBLEM-AND-SOLUTION",
    "03-HOW-IT-WORKS",
    "04-REVENUE-GENERATION",
    "05-LOOPHOLES-AND-WEAKNESSES",
    "06-THE-SUPERIOR-ALTERNATIVE",
    "07-PDF-WHITEPAPER"
]

for sd in subdirs:
    os.makedirs(os.path.join(DOSSIER_DIR, sd), exist_ok=True)

# 01-THE-CORE-IDEA/01-what-is-the-idea.md
with open(os.path.join(DOSSIER_DIR, "01-THE-CORE-IDEA", "01-what-is-the-idea.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 1.1: What Is the Idea?

## Executive Definition

Companio (operated via the website trycompanio.in by TRYCOMPANIOLABS LLP) is a paid marketplace for booking local companions for everyday social activities in public spaces across Indian cities.

The concept is simple: if someone wants to visit a coffee shop, walk in a park, go to the gym, attend a music concert, or visit an art gallery, but does not have a friend available to join them, they can hire a vetted local person to accompany them for an hourly fee.

---

## What It Is and What It Is Not

To understand this business, it is essential to draw a clear operational line between what Companio provides and what it strictly prohibits.

### What It Is
1. **A Platonic Friendship Service:** It connects two adults for shared public activities.
2. **An Activity-Based Booking Engine:** Every booking is anchored to a specific public place and activity, such as having coffee at Third Wave Coffee or walking through Cubbon Park.
3. **An Escrow-Protected Marketplace:** The customer pays upfront, but the money is held safely by the platform until both people meet in person and verify each other.
4. **A Flexible Earning Model:** Ordinary individuals (college students, fitness trainers, local residents) can earn income by offering their spare time to accompany others.

### What It Is Not
1. **It is not a dating application:** Romantic advances, flirting, and dating expectations are strictly banned.
2. **It is not an adult or escort service:** Any commercial sexual solicitation or physical intimacy results in an immediate permanent ban and forfeiture of funds under Indian law.
3. **It is not a home-visit service:** Meetups are strictly forbidden in private residences, hotel rooms, or secluded areas. All meetings must take place in daylight public venues.

---

## The Core Product Proposition

The entire business is built around a single slogan: **"Never go alone."**

It targets the hesitation people feel when they want to do something enjoyable in their city but stay home because going by themselves feels uncomfortable, awkward, or unsafe.
""")

# 01-THE-CORE-IDEA/02-why-the-idea.md
with open(os.path.join(DOSSIER_DIR, "01-THE-CORE-IDEA", "02-why-the-idea.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 1.2: Why Was This Idea Created?

## The Social and Economic Background

The idea was created as a direct response to massive demographic shifts occurring across metropolitan India over the last decade.

---

## 1. The Internal Migration Wave

India has over 600 million internal migrants. Every year, millions of young educated adults leave their families, hometowns, and childhood friend circles in Tier-2 and Tier-3 towns to work in major technology and corporate hubs such as:
- Bengaluru (Koramangala, HSR Layout, Whitefield)
- Delhi NCR (Gurugram CyberHub, Noida Sector 62)
- Mumbai (Bandra-Kurla Complex, Andheri)
- Hyderabad (HITEC City, Gachibowli)
- Pune (Hinjawadi, Kharadi)

When these professionals arrive, they face a severe social deficit:
- They live in rented apartments or paying-guest (PG) accommodations.
- Many work in hybrid or remote setups, limiting workplace social interaction.
- Outside of office hours, they frequently spend entire weekends in isolation.

---

## 2. The Breakdown of Dating Applications

For years, people moving to new cities downloaded dating applications (such as Tinder, Bumble, or Hinge) hoping to find friends. 

However, dating apps suffer from severe structural issues:
1. **Mismatched Intentions:** One person wants casual romance, the other wants a serious relationship, and neither finds a simple friend.
2. **Superficiality and Ghosting:** The swipe mechanic reduces people to photos. Over 90 percent of matches never meet in real life.
3. **Safety Concerns for Women:** Female users face unwanted sexual advances, harassment, and aggressive messaging.

Companio identified that millions of people do not want a date; they simply want a reliable person to grab coffee with on a Saturday afternoon without any romantic pressure.

---

## 3. The Need to Remove Stigma and Scams

Historically, informal websites (such as classified ads or unmonitored forums) offering "friend rental" in India rapidly degenerated into fronts for extortion, scams, or illegal services.

Companio was designed to formalize this market through:
- Registered corporate identity (TRYCOMPANIOLABS LLP, New Delhi).
- Government ID verification (Aadhaar and PAN card checks).
- An escrow payment mechanism via Razorpay.
- A legally documented zero-tolerance policy against non-platonic behavior.
""")

# 02-PROBLEM-AND-SOLUTION/01-the-problem.md
with open(os.path.join(DOSSIER_DIR, "02-PROBLEM-AND-SOLUTION", "01-the-problem.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 2.1: The Core Problems Faced by Customers

## 1. Chronic Urban Isolation

Industry research shows that between 43 percent and 58 percent of urban adults in Indian metros report frequent feelings of loneliness. 

Unlike small towns where community life is embedded in extended families and local neighborhoods, Indian metropolitan life is fragmented. High rents, long commute times, and demanding work hours make forming new organic adult friendships extremely difficult.

---

## 2. Activity Cancellation and Hesitation

Millions of urban adults regularly abandon activities they enjoy because they lack an accompanying partner:
- **Live Gigs and Music Festivals:** A user buys a concert ticket (such as Diljit Dosanjh, Coldplay, or an indie band). Their friend cancels at the last minute. Going alone feels intimidating, so the user stays home and wastes an expensive ticket.
- **Fitness Accountability:** A user struggles to maintain a workout routine. They need a spotter at the gym or a running partner at 6:00 AM to keep them disciplined.
- **Exploring the City:** A newcomer wants to try famous street food, explore heritage monuments, or visit a new art gallery, but feels self-conscious walking around alone.

---

## 3. The Unreliability of Casual Online Acquaintances

When people attempt to make friends through social media groups or free community forums, they face chronic unreliability:
- People confirm plans online and then fail to show up (flaking).
- There is no accountability because no money or formal verification is involved.
- Users waste hours coordinating with strangers who disappear on the day of the meetup.

---

## 4. Personal Safety and Fraud Vulnerability

Meeting strangers from the internet in India carries legitimate safety risks:
- Risk of harassment or stalking.
- Financial fraud (fake QR codes, bill-padding scams at restaurants).
- Identity misrepresentation (catfishing).

Without a verified intermediary that checks identification and tracks transactions, cautious individuals—particularly women—refuse to participate in online-to-offline meetups.
""")

# 02-PROBLEM-AND-SOLUTION/02-the-solution.md
with open(os.path.join(DOSSIER_DIR, "02-PROBLEM-AND-SOLUTION", "02-the-solution.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 2.2: How TryCompanio Solves These Problems

## The Three Pillars of the Solution

Companio addresses these challenges through a structured, three-part framework: **Contractual Clarity**, **Financial Escrow**, and **Physical Safety Verification**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TRYCOMPANIO SOLUTION PILLARS                      │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. CONTRACTUAL     │ 2. FINANCIAL       │ 3. PHYSICAL                  │
│    CLARITY         │    ESCROW          │    SAFETY                    │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ • Strictly platonic│ • Funds held by    │ • Manual Aadhaar/PAN check   │
│ • Clear hourly fee │   Razorpay escrow  │ • Daylight public venues only│
│ • No romance games │ • 4-digit PIN code │ • Floating in-app SOS        │
│ • Zero obligations │ • Instant wallet   │ • 1-tap WhatsApp location    │
│   after the meetup │   refund if host   │   snapshot to trusted        │
│                    │   fails to show    │   emergency contacts         │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

---

## 1. Transactional and Platonic Clarity

Companio removes the vulnerability of friendship-making by making it explicitly transactional:
- The customer is paying for the companion's time and social presence.
- The companion is contracted to be present, attentive, and helpful.
- Because it is paid, both sides understand the boundaries: there are no false expectations of romance, future dating obligations, or awkward emotional ambiguity.

---

## 2. Guaranteed Attendance via Financial Escrow

By introducing money into the interaction, Companio eliminates the unreliability of free platforms:
- The customer pays upfront into a secure escrow account managed via Razorpay.
- The companion knows their compensation (70 percent of the fee) is guaranteed once they complete the booking.
- If the companion cancels or fails to show up, the money is instantly refunded to the customer's wallet.
- If the customer shows up, they release the payment only after meeting in person.

---

## 3. Systematic Safety Architecture

Companio implements four safety checkpoints:
1. **Government Identity Screening:** Every companion must submit an Aadhaar card or PAN card along with a photograph, receiving an "ID-Checked" badge upon manual review.
2. **Public-Place Mandate:** All meetups must take place in verified public commercial venues (coffee shops, shopping malls, registered parks).
3. **Four-Digit PIN Code Handshake:** The customer holds a private 4-digit code. They only reveal this code to the companion after meeting face-to-face and feeling safe. The companion cannot claim payment without this code.
4. **Emergency Telemetry:** During the meetup, a persistent SOS button allows users to export a real-time GPS snapshot and booking confirmation directly to emergency contacts.
""")

# 03-HOW-IT-WORKS/01-for-members-journey.md
with open(os.path.join(DOSSIER_DIR, "03-HOW-IT-WORKS", "01-for-members-journey.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 3.1: How It Works for Members (Customers)

## Step-by-Step Customer Journey

```
Step 1: Discovery & Filter
  User visits trycompanio.in -> selects city (e.g., Delhi) and activity (e.g., Coffee)

Step 2: Preview Cards
  User views available companions (sees first name, age, languages, ID-checked badge)

Step 3: Account Sign-In & Pass Purchase
  User signs in via email OTP -> purchases access pass (from 99.50 INR for 1 month)

Step 4: Booking Proposal
  User selects companion -> chooses date, time, duration, and specific public venue

Step 5: Escrow Payment
  User deposits hourly meetup fee via Razorpay UPI -> funds held in escrow

Step 6: Companion Review
  Companion receives alert -> has up to 12 daylight hours to accept or decline

Step 7: In-App Chat Unlocks
  Upon acceptance, in-app chat opens -> both parties confirm table / exact meeting spot

Step 8: In-Person Meetup & PIN Code Handshake
  Both meet at public venue -> customer shares secret 4-digit code -> escrow releases

Step 9: Review & Re-Booking
  Customer rates experience (1 to 5 stars) -> leaves qualitative feedback
```

---

## Detailed Explanation of Key Steps

### The Pass Purchase Gate
Before a customer can see a companion's full bio, complete photo gallery, or booking calendar, they must buy an access pass:
- **1 Month:** 99.50 INR
- **3 Months:** 249.50 INR
- **12 Months:** 499.50 INR
- **Lifetime:** 999.50 INR

These passes do **not** auto-renew, which protects customers from unwanted monthly recurring credit card debits.

### The Booking Proposal
The customer chooses:
- **Activity:** Café chat, city walk, live event, gym session, or museum tour.
- **Time:** Must be scheduled at least 2 hours in advance.
- **Location:** Must be a named public venue (e.g., "Starbucks, CyberHub, Gurugram").

### The Meetup Handshake
When meeting in person, the customer's phone displays a confidential 4-digit numeric code. The customer is instructed:
> *"Only share this code after you have met your companion in person and feel comfortable."*

When the companion enters this code into their companion dashboard, the system logs the booking as successfully completed and releases the payout.
""")

# 03-HOW-IT-WORKS/02-for-companions-journey.md
with open(os.path.join(DOSSIER_DIR, "03-HOW-IT-WORKS", "02-for-companions-journey.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 3.2: How It Works for Companions (Hosts)

## Step-by-Step Host Onboarding & Earning Flow

```
Step 1: Application Portal
  Host visits trycompanio.in/become-a-companion -> reviews earnings calculator

Step 2: Profile & Verification Form
  Submits full name, date of birth (must be 18+), city, phone number, and bio

Step 3: Application Fee Payment
  Pays 99.50 INR application review fee (waived if already holding an active pass)

Step 4: Activity & Rate Configuration
  Selects activities offered -> sets custom hourly rate (typically 300 to 800 INR/hr)

Step 5: Document & Photo Upload
  Uploads government Aadhaar card or PAN card + clear personal portrait

Step 6: Compliance Review (SLA: 48 Hours)
  TryCompanio operations team inspects ID validity -> issues "ID-Checked" badge

Step 7: Receiving Booking Alerts
  Host receives booking notification -> reviews customer name, time, and public venue

Step 8: Acceptance or Decline
  Host accepts booking -> chat opens (host has complete autonomy to decline any booking)

Step 9: Completing Meetup & Receiving Payout
  Host attends meetup -> collects 4-digit code -> enters code in portal
  70% payout credited to wallet -> transferred via UPI within 24 hours
```

---

## Host Earnings Structure

Companions are classified as independent service providers. 

### Payout Split:
- **Standard Bookings (Up to 1,000 INR):** Companion receives **70 percent** of the gross fee; Companio retains 30 percent.
- **Higher Bookings (Over 1,000 INR):** Companion receives **68 percent**; Companio retains 32 percent.
- **Taxes:** The platform take-rate includes applicable Goods and Services Tax (GST).

### Practical Example:
- A companion sets an hourly rate of 400 INR.
- They complete a 2-hour café chat booking (Total: 800 INR).
- The companion earns **560 INR net**.
- The payout is disbursed directly to their bank account via UPI within 24 hours.
""")

# 03-HOW-IT-WORKS/03-the-meetup-and-safety-process.md
with open(os.path.join(DOSSIER_DIR, "03-HOW-IT-WORKS", "03-the-meetup-and-safety-process.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 3.3: The Meetup and Safety Process

## The In-Person Verification Protocol

To prevent disputes, misunderstandings, and safety risks, Companio enforces strict rules during the physical interaction.

---

## 1. Pre-Meetup Safety Rules

1. **Keep Communications In-App:** Customers and companions are advised to keep all coordination inside the platform chat prior to meeting.
2. **Face-to-Photo Check:** When arriving at the venue, the customer is prompted to visually verify that the companion matches their profile photo.
3. **Public Commercial Settings Only:** Meetups must occur in high-traffic commercial spaces. If a party suggests moving to a private home, car, or hotel room, the user is instructed to immediately cancel the meetup and alert support.

---

## 2. In-Meetup Safety Telemetry

During an active booking, the application displays a persistent safety banner containing:
- **The In-App SOS Button:** Tapping this button generates an instant location snapshot containing the user's current GPS coordinates, the companion's name, and the venue details, ready to send via WhatsApp or SMS to emergency contacts.
- **Safety Support Hotline:** Direct access to Companio’s emergency support line (+91 91794 93270).
- **National Emergency Directive:** Prominent instructions to call 112 (National Emergency Helpline) in the event of immediate danger.

---

## 3. The 4-Digit Completion Handshake

```
┌──────────────────────────────┐              ┌──────────────────────────────┐
│       CUSTOMER SCREEN        │              │       COMPANION SCREEN       │
├──────────────────────────────┤              ├──────────────────────────────┤
│ "Meetup in Progress"         │              │ "Meetup in Progress"         │
│ Secret Handshake Code:       │  In-Person   │ Enter Customer's 4-Digit Code│
│ [ 7  4  2  9 ]               │ ───────────► │ [ _  _  _  _ ]               │
│ "Only share this after you   │   Handover   │                              │
│ meet and feel comfortable."  │              │ [ Verify & Claim Payout ]    │
└──────────────────────────────┘              └──────────────────────────────┘
```

This handshake protects both parties:
- The customer cannot be charged if the companion fails to show up.
- The companion cannot be cheated out of payment once they have physically arrived and met the customer.
""")

# 04-REVENUE-GENERATION/01-how-it-makes-money.md
with open(os.path.join(DOSSIER_DIR, "04-REVENUE-GENERATION", "01-how-it-makes-money.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 4.1: How the Business Generates Revenue

## The Four Revenue Streams

Companio does not rely on a single income source. It generates revenue through four distinct components:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPANIO REVENUE STREAMS                        │
├──────────────────────────┬──────────────────────┬──────────────────────┤
│ STREAM                   │ CHARGED TO           │ AMOUNT / PERCENTAGE  │
├──────────────────────────┼──────────────────────┼──────────────────────┤
│ 1. Access Passes         │ Customers (Members)  │ 99.50 to 999.50 INR  │
│ 2. Marketplace Take-Rate │ Companions (Hosts)   │ 30% to 32% of GMV    │
│ 3. Host Application Fee  │ Prospective Hosts    │ 99.50 INR (one-time) │
│ 4. Wallet Cashout Fee    │ Withdrawing Users    │ 12% processing fee   │
└──────────────────────────┴──────────────────────┴──────────────────────┘
```

---

## 1. Access Passes (Upfront Monetization)

Companio charges customers an upfront fee simply to view full profiles and initiate bookings:
- **1-Month Pass:** 99.50 INR
- **3-Month Pass:** 249.50 INR
- **12-Month Pass:** 499.50 INR
- **Lifetime Pass:** 999.50 INR

### Strategic Purpose:
- This filters out casual browsers and non-serious users.
- It provides immediate positive cash flow before any meetups occur.
- Because passes do not auto-renew, chargeback rates and consumer complaints regarding hidden billing are kept near zero.

---

## 2. Marketplace Take-Rate (Transactional Commission)

Every time a meetup is completed, the platform takes a commission:
- **Bookings up to 1,000 INR:** 30 percent take-rate.
- **Bookings exceeding 1,000 INR:** 32 percent take-rate.

This is automatically deducted from the escrow payout before transferring funds to the companion's UPI account.

---

## 3. Companion Application Fee (Supply Monetization)

When an individual applies to become a companion, they must pay an application inspection fee of **99.50 INR**.
- This fee is non-refundable, even if their application is rejected.
- It covers the administrative cost of human review of Aadhaar and PAN documents.
- It also acts as an anti-spam filter, preventing thousands of fake or low-intent applicants from overwhelming the review team.

---

## 4. Wallet Cashout Fee (Financial Arbitrage)

When bookings are cancelled, funds are returned to the customer's in-app wallet as platform credits (1 credit = 1 INR).
- If the customer uses the credits to book another companion, no fee is charged.
- However, if the customer requests a cash withdrawal from their wallet back to their personal bank account, Companio deducts a **12 percent processing fee**.
""")

# 04-REVENUE-GENERATION/02-unit-economics-and-cash-flow.md
with open(os.path.join(DOSSIER_DIR, "04-REVENUE-GENERATION", "02-unit-economics-and-cash-flow.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 4.2: Unit Economics and Financial Breakdown

## Transaction Math per Meetup

To understand the profitability of the model, consider two typical customer booking scenarios.

---

## Scenario 1: Standard 2-Hour Café Chat

- **Companion Stated Hourly Rate:** 400.00 INR
- **Total Meetup Duration:** 2 Hours
- **Gross Merchandise Value (GMV):** 800.00 INR
- **Allocated Access Pass Revenue (Assumes 2 meetups/month on 99.50 pass):** 49.75 INR
- **Total Gross Platform Collection:** **849.75 INR**

### Cost and Payout Deductions:
- **Companion Payout (70% of 800 INR):** 560.00 INR
- **Payment Gateway Processing Fee (Razorpay ~2%):** 16.00 INR
- **Total Payout & Processing Cost:** 576.00 INR

### Net Profitability:
- **Net Platform Margin per Meetup:** **273.75 INR**
- **Net Margin Percentage:** **32.2 percent**

---

## Scenario 2: 4-Hour Concert / Music Event Plus-One

- **Companion Stated Hourly Rate:** 750.00 INR
- **Total Meetup Duration:** 4 Hours
- **Gross Merchandise Value (GMV):** 3,000.00 INR
- **Total Gross Platform Collection:** **3,000.00 INR**

### Cost and Payout Deductions:
- **Companion Payout (68% on amounts over 1,000 INR):** 2,040.00 INR
- **Payment Gateway Cost (Razorpay ~2%):** 60.00 INR
- **Total Payout & Processing Cost:** 2,100.00 INR

### Net Profitability:
- **Net Platform Margin per Meetup:** **900.00 INR**
- **Net Margin Percentage:** **30.0 percent**

---

## Monthly Financial Model at Scale (Estimated)

Based on TryCompanio's database size (over 120,000 registered accounts across 126 cities), a steady-state monthly operating estimate demonstrates solid unit profitability:

| Operational Metric | Estimated Monthly Volume | Monthly Value (INR) |
| :--- | :--- | :--- |
| **Active Member Pass Holders** | 1,500 active passes / month | 1,49,250 INR |
| **Completed Meetups (GMV)** | 1,000 meetups @ 800 INR average | 8,00,000 INR |
| **Platform Take-Rate (30% of GMV)**| 30% retained | 2,40,000 INR |
| **New Host Application Fees** | 250 applicants @ 99.50 INR | 24,875 INR |
| **Wallet Cashout Arbitrage** | 12% on 1,00,000 INR withdrawals | 12,000 INR |
| **Total Monthly Revenue** | — | **4,26,125 INR (~$5,100 USD)** |
| **Annualized Revenue Run Rate** | — | **51,13,500 INR (~$61,500 USD)** |

*(Note: These projections represent financial modeling derived from documented public pricing and platform parameters.)*
""")

# 05-LOOPHOLES-AND-WEAKNESSES/01-what-it-lacks.md
with open(os.path.join(DOSSIER_DIR, "05-LOOPHOLES-AND-WEAKNESSES", "01-what-it-lacks.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 5.1: What TryCompanio Lacks (Feature & Technical Gaps)

## Critical Product Deficiencies

Despite its early success, TryCompanio has significant feature and operational gaps that leave it highly vulnerable to a well-engineered competitor.

---

## 1. No Native Mobile Application (Web-Only Architecture)

TryCompanio operates strictly as a web application (built on Next.js). It has no native iOS or Android mobile application in app stores.

### Why this is a major weakness:
- **No Background Push Notifications:** When a user requests a booking, the companion receives an email or must check their dashboard. This causes severe delays in response time.
- **No Background GPS Telemetry:** The web browser cannot track live location in the background if the user locks their screen or switches apps.
- **Session Expiry on Mobile Browsers:** Mobile users frequently have to log back in via email OTP, creating friction.

---

## 2. No On-Demand or Instant Booking

All bookings require advance scheduling:
- Users must book at least 2 hours ahead.
- The companion has up to 12 daylight hours to accept or decline.

In modern cities where people make spontaneous decisions ("I am at a café right now and want company for an hour"), TryCompanio cannot fulfill the request. There is no real-time radar showing who is available immediately.

---

## 3. High Upfront Host Application Friction

Charging prospective companions 99.50 INR to apply creates a major supply bottleneck:
- College students and young freelancers resent paying upfront before knowing if they will get bookings.
- In competitive gig economies (Uber, Swiggy, Zomato), onboarding is free.
- This policy slows down host density in newly launched cities.

---

## 4. Manual 48-Hour Identity Verification Delay

Companio relies on human staff to manually inspect photographs of Aadhaar cards and PAN cards:
- It takes up to 48 hours for a companion profile to be approved.
- Human review does not verify if the Aadhaar number is active in real time against the UIDAI database.
- Modern automated e-KYC (such as DigiLocker APIs) can verify identity in under 60 seconds.

---

## 5. Zero Editorial SEO Content

While the website includes a `/blog` directory, it has **zero published articles**:
- The platform captures almost no organic search traffic for high-intent queries like *"how to make friends in Bangalore"* or *"find a gym buddy in Delhi"*.
- It relies entirely on viral social media reels and direct branded search.
""")

# 05-LOOPHOLES-AND-WEAKNESSES/02-business-risks-and-vulnerabilities.md
with open(os.path.join(DOSSIER_DIR, "05-LOOPHOLES-AND-WEAKNESSES", "02-business-risks-and-vulnerabilities.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 5.2: Business Risks and Platform Loopholes

## Critical Vulnerabilities in the Business Model

---

## 1. The Disintermediation Loophole (Platform Leakage)

The single greatest commercial threat to TryCompanio is that it is easily bypassed after the first meetup:
- A customer pays the pass fee and books a companion for a 2-hour café chat.
- During the meetup, both parties realize they enjoy each other's company.
- They exchange WhatsApp phone numbers or Instagram handles.
- For the next meetup, the customer pays the companion directly via UPI, saving the platform's 30 percent take-rate.

Companio provides **zero incentive** for users to keep bookings on the platform once initial trust is established.

---

## 2. Brand Contamination and Legal Exposure

In India, any platform offering companion booking operates under constant legal risk:
- **The Risk of Misuse:** If bad actors use the platform to arrange commercial adult services or private home visits, the company faces immediate criminal investigation under the Immoral Traffic (Prevention) Act (ITPA 1956).
- **Payment Gateway Freezes:** Payment aggregators like Razorpay operate under strict compliance rules. A single viral scandal or police report can trigger immediate freezing of merchant escrow accounts.

---

## 3. Social Stigma and Embarrassment

Many urban Indians still feel self-conscious admitting they paid for a companion:
- Customers rarely share their bookings on personal social media.
- This limits organic word-of-mouth referral growth compared to traditional social apps.
- The platform must constantly spend marketing effort to acquire new demand.

---

## 4. Lack of Public Founder Transparency

The designated partners (Hardik Kedar and Prashant Yadav) maintain zero public presence on professional networks such as LinkedIn:
- In a business where personal safety and background checks are the core product, an anonymous or invisible leadership team creates skepticism among educated corporate users.
""")

# 06-THE-SUPERIOR-ALTERNATIVE/01-how-to-build-a-better-product.md
with open(os.path.join(DOSSIER_DIR, "06-THE-SUPERIOR-ALTERNATIVE", "01-how-to-build-a-better-product.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 6.1: How to Build a Superior Competing Product

## The Strategic Blueprint: Building "Tribo"

To capture market share from TryCompanio, a new venture should be built under the brand **Tribo** (representing community, trust, and shared activities).

---

## Six Structural Upgrades to Leapfrog TryCompanio

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TRIBO PRODUCT DIFFERENTIATORS                     │
├────────────────────┬───────────────────────────────────────────────────┤
│ 1. Free Host       │ 100% free companion onboarding. Absorb 15 INR     │
│    Onboarding      │ e-KYC cost as acquisition expense.                │
├────────────────────┼───────────────────────────────────────────────────┤
│ 2. Instant         │ Automated Aadhaar OTP verification via DigiLocker │
│    DigiLocker KYC  │ API. Profile approved in under 60 seconds.        │
├────────────────────┼───────────────────────────────────────────────────┤
│ 3. Native Mobile   │ Flutter cross-platform iOS & Android app with     │
│    Apps            │ instant push alerts and background SOS geofence.  │
├────────────────────┼───────────────────────────────────────────────────┤
│ 4. Small-Group     │ Curated 4-person activity tables (board games,    │
│    Pods (3-5 users)│ dinners, runs) to eliminate 1-on-1 awkwardness.   │
├────────────────────┼───────────────────────────────────────────────────┤
│ 5. Real-Time Radar │ Live map showing verified companions available    │
│    ("Near Me")     │ within 3 km for immediate meetups.                │
├────────────────────┼───────────────────────────────────────────────────┤
│ 6. Anti-Leakage    │ In-app loyalty karma points + partner café coffee │
│    Incentives      │ discounts (15% off) that make off-platform booking│
│                    │ economically disadvantageous.                     │
└────────────────────┴───────────────────────────────────────────────────┘
```

---

## 1. Zero-Friction Host Supply Model
- Eliminate the 99.50 INR upfront fee.
- Free onboarding attracts thousands of university students and fitness trainers, solving the geographic liquidity problem instantly.

---

## 2. Instant Automated DigiLocker Verification
- Replace human document review with an automated DigiLocker API (via Cashfree Verification or Setu).
- The user completes Aadhaar OTP verification and facial match in 60 seconds.
- Trust badges are issued automatically without a 48-hour delay.

---

## 3. Curated Small-Group Activity Pods
- Introduce small-group experiences alongside 1-on-1 bookings:
  - Table of 4 for Saturday coffee chat.
  - Group of 5 for Sunday morning Cubbon Park run.
  - Table of 4 for board games at a café.
- Group activities eliminate the social anxiety and dating pressure of 1-on-1 meetups, making the platform far more welcoming to introverted users and cautious female members.

---

## 4. Merchant Venue Partnerships & Anti-Leakage
- Partner with established coffee chains (Blue Tokai, Third Wave Coffee) and fitness centers (Cult.fit).
- When a booking is made on Tribo, both users get a 15 percent discount QR code on their café bill.
- If they meet off-platform for cash, they lose their coffee discount, their safety insurance, and their platform reputation score.
""")

# 06-THE-SUPERIOR-ALTERNATIVE/02-mvp-action-plan-and-budget.md
with open(os.path.join(DOSSIER_DIR, "06-THE-SUPERIOR-ALTERNATIVE", "02-mvp-action-plan-and-budget.md"), "w", encoding="utf-8") as f:
    f.write("""# Section 6.2: MVP Action Plan, Budget, and Execution Timeline

## Six-Month Phased Execution Plan

```
  MONTHS 1 - 2: BUILD               MONTHS 3 - 4: PILOT               MONTHS 5 - 6: EXPAND
┌──────────────────────────────┐   ┌──────────────────────────────┐   ┌──────────────────────────────┐
│ • Flutter iOS & Android App  │   │ • Launch in Bengaluru Only   │   │ • Expand to Delhi NCR & Mum  │
│ • DigiLocker API Integration │   │ • Onboard 150 Seed Hosts     │   │ • Roll out Partner Café QRs  │
│ • Escrow Payment Gateway     │   │ • 4-Person Activity Pods     │   │ • 60-Sec Video Icebreaker    │
│ • Cloud Backend Setup        │   │ • Targeted Micro-Reels       │   │ • B2B Corporate HR Pilot     │
└──────────────────────────────┘   └──────────────────────────────┘   └──────────────────────────────┘
```

---

## Capital Requirement & Budget Breakdown (INR)

*(All figures represent estimated market costs for launching a high-performance technology startup in India.)*

| Budget Item | Duration / Allocation | Estimated Cost (INR) |
| :--- | :--- | :--- |
| **2 Senior Full-Stack Developers (Flutter + Node)**| 6 Months @ 1,50,000 INR / month each | 18,00,000 INR |
| **1 Backend & DevOps Engineer** | 6 Months @ 1,50,000 INR / month | 9,00,000 INR |
| **1 UI/UX Product Designer** | 2 Months (Contract) | 3,00,000 INR |
| **DigiLocker / Cashfree KYC API Credits** | 5,000 automated verifications @ 15 INR | 75,000 INR |
| **AWS Cloud Infrastructure & Database** | 6 Months @ 20,000 INR / month | 1,20,000 INR |
| **Legal Counsel, Incorporation & DPDPA Compliance**| Statutory filings & escrow drafting | 1,50,000 INR |
| **Payment Gateway Merchant Escrow Setup** | Security deposit & setup fees | 50,000 INR |
| **Hyper-Local Launch Marketing (Bengaluru Pilot)**| 3 Months targeted short-form campaigns | 6,00,000 INR |
| **TOTAL ESTIMATED SEED CAPITAL TO LAUNCH MVP** | — | **39,95,000 INR (~$48,000 USD)** |

---

## Three-Year Commercial Projection (Estimated Model)

| Commercial Metric | Year 1 (Bengaluru Pilot) | Year 2 (Top 5 Metros) | Year 3 (Pan-India 25 Cities) |
| :--- | :--- | :--- | :--- |
| **Active Cities** | 1 (Bengaluru) | 5 (Blr, Del, Mum, Hyd, Pune) | 25 Metros & Tier-2 Hubs |
| **Monthly Active Users** | 15,000 | 75,000 | 250,000 |
| **Monthly Completed Meetups** | 1,200 | 8,500 | 35,000 |
| **Average Meetup GMV** | 750 INR | 850 INR | 900 INR |
| **Gross Marketplace GMV / Month** | 9,00,000 INR | 72,25,000 INR | 3,15,00,000 INR |
| **Net Platform Revenue / Month** | 4,15,000 INR | 28,50,000 INR | 1,22,00,000 INR |
| **Annualized Net Revenue Run Rate** | **49.8 Lakhs INR (~$60k)**| **3.42 Crores INR (~$410k)** | **14.6 Crores INR (~$1.75M)**|

---

## Strategic Summary

TryCompanio proved that the demand for verified, paid platonic companionship is real. However, their reliance on mobile web, 12-hour response latency, manual document checks, and upfront application fees creates an immediate opportunity for a superior, mobile-first competitor.

By building **Tribo** with **automated DigiLocker verification, 4-person activity pods, instant booking radar, and zero onboarding fees**, a challenger venture can capture the dominant position in India's emerging loneliness economy.
""")

print("All dossier markdown files written successfully.")
