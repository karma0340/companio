import os
import subprocess

HTML_PATH = r"C:\Users\Dell\Documents\codes\trycompanio\WHITEPAPER-DOSSIER\07-PDF-WHITEPAPER\whitepaper-source.html"
PDF_PATH = r"C:\Users\Dell\Documents\codes\trycompanio\WHITEPAPER-DOSSIER\07-PDF-WHITEPAPER\TRYCOMPANIO-EXECUTIVE-WHITEPAPER.pdf"
ROOT_PDF_PATH = r"C:\Users\Dell\Documents\codes\trycompanio\TRYCOMPANIO-EXECUTIVE-WHITEPAPER.pdf"

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TryCompanio: Business Architecture, Competitive Analysis & Strategic Opportunity Whitepaper</title>
<style>
  @page {
    size: A4;
    margin: 22mm 18mm 22mm 18mm;
    @bottom-right {
      content: "Page " counter(page);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 8pt;
      color: #627D98;
    }
    @bottom-left {
      content: "CONFIDENTIAL | STRATEGIC RESEARCH WHITEPAPER";
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 8pt;
      color: #627D98;
      letter-spacing: 0.5px;
    }
  }

  body {
    font-family: 'Georgia', 'Cambria', 'Times New Roman', serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #102A43;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
  }

  /* Cover Page */
  .cover-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    padding-top: 40px;
    box-sizing: border-box;
  }

  .cover-header {
    border-bottom: 3px solid #0F2B48;
    padding-bottom: 15px;
  }

  .cover-tag {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #B45309;
    margin-bottom: 12px;
  }

  .cover-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 26pt;
    font-weight: 800;
    line-height: 1.15;
    color: #0A192F;
    margin: 0 0 14px 0;
  }

  .cover-subtitle {
    font-size: 13pt;
    color: #334E68;
    font-style: italic;
    line-height: 1.4;
    margin: 0 0 25px 0;
  }

  .cover-metadata-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    border-top: 1px solid #D9E2EC;
    border-bottom: 1px solid #D9E2EC;
    padding: 20px 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9pt;
  }

  .meta-item strong {
    color: #0A192F;
    display: block;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }

  .cover-summary {
    background-color: #F8FAFC;
    border-left: 4px solid #0F2B48;
    padding: 16px 20px;
    font-size: 9.5pt;
    color: #243B53;
    line-height: 1.5;
  }

  .cover-footer {
    border-top: 1px solid #D9E2EC;
    padding-top: 15px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8pt;
    color: #627D98;
    display: flex;
    justify-content: space-between;
  }

  /* Document Typography */
  h1 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 16pt;
    font-weight: 700;
    color: #0A192F;
    border-bottom: 1.5px solid #0F2B48;
    padding-bottom: 6px;
    margin-top: 28px;
    margin-bottom: 14px;
    page-break-after: avoid;
  }

  .section-label {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #B45309;
    margin-bottom: 4px;
  }

  h2 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 12.5pt;
    font-weight: 700;
    color: #102A43;
    margin-top: 20px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }

  h3 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5pt;
    font-weight: 700;
    color: #243B53;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: justify;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 12px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  th {
    background-color: #0F2B48;
    color: #FFFFFF;
    text-align: left;
    padding: 7px 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid #0F2B48;
  }

  td {
    padding: 6px 10px;
    border: 1px solid #D9E2EC;
    color: #102A43;
  }

  tr:nth-child(even) td {
    background-color: #F8FAFC;
  }

  /* Callouts & Quotes */
  .callout-box {
    background-color: #F8FAFC;
    border-left: 4px solid #0F2B48;
    padding: 10px 14px;
    margin: 14px 0;
    font-size: 9.5pt;
    color: #243B53;
    page-break-inside: avoid;
  }

  .callout-box strong {
    color: #0A192F;
  }

  .warning-box {
    background-color: #FFFBEB;
    border-left: 4px solid #B45309;
    padding: 10px 14px;
    margin: 14px 0;
    font-size: 9.5pt;
    color: #78350F;
    page-break-inside: avoid;
  }

  .diagram-box {
    background-color: #F0F4F8;
    border: 1px solid #D9E2EC;
    padding: 12px 14px;
    margin: 14px 0;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 7.5pt;
    line-height: 1.35;
    color: #0A192F;
    white-space: pre;
    overflow-x: hidden;
    page-break-inside: avoid;
  }

  .page-break {
    page-break-before: always;
  }

  /* Table of Contents */
  .toc-container {
    background-color: #F8FAFC;
    border: 1px solid #D9E2EC;
    padding: 18px 22px;
    margin: 20px 0;
    page-break-after: always;
  }

  .toc-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 13pt;
    font-weight: 700;
    color: #0A192F;
    border-bottom: 2px solid #0F2B48;
    padding-bottom: 6px;
    margin-bottom: 14px;
  }

  .toc-item {
    display: flex;
    justify-content: space-between;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9pt;
    margin-bottom: 8px;
    border-bottom: 1px dotted #CBD2D9;
    padding-bottom: 3px;
  }

  .toc-num {
    font-weight: 700;
    color: #B45309;
    margin-right: 8px;
  }

  .toc-name {
    color: #102A43;
    font-weight: 600;
  }

  .toc-page {
    color: #627D98;
    font-weight: 700;
  }

  .exhibit-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    color: #334E68;
    margin-bottom: 4px;
  }
</style>
</head>
<body>

<!-- ================= COVER PAGE ================= -->
<div class="cover-page">
  <div class="cover-header">
    <div class="cover-tag">Strategic Research Whitepaper & Market Intelligence Dossier</div>
    <div class="cover-title">TRYCOMPANIO: BUSINESS ARCHITECTURE, MARKET INTELLIGENCE & STRATEGIC PRODUCT BLUEPRINT</div>
    <div class="cover-subtitle">A Rigorous Examination of India's Platonic Companionship Economy, Operational Mechanics, Business Flaws, and Next-Generation Market Opportunities</div>
  </div>

  <div class="cover-metadata-grid">
    <div class="meta-item">
      <strong>Target Entity</strong>
      TRYCOMPANIOLABS LLP (trycompanio.in)
    </div>
    <div class="meta-item">
      <strong>Corporate Registration</strong>
      LLPIN: ACY-1464 | RoC Delhi
    </div>
    <div class="meta-item">
      <strong>Research Consortium</strong>
      Senior Business Analyst & Product Architecture Team
    </div>
    <div class="meta-item">
      <strong>Publication Date</strong>
      November 17, 2026
    </div>
    <div class="meta-item">
      <strong>Investigative Scope</strong>
      Product Reverse-Engineering, Tech Stack, Competitors & Unit Economics
    </div>
    <div class="meta-item">
      <strong>Classification</strong>
      Executive Strategy Whitepaper (Institutional Grade)
    </div>
  </div>

  <div class="cover-summary">
    <strong>Executive Statement:</strong> This document provides a comprehensive institutional whitepaper on TryCompanio, analyzing the business drivers behind India's emerging paid platonic companionship sector. It breaks down the exact operational flow, financial unit economics, structural vulnerabilities, and competitive gaps of the incumbent platform, and outlines a complete strategic blueprint for building a dominant market competitor.
  </div>

  <div class="cover-footer">
    <span>Private Corporate Intelligence Report</span>
    <span>Document ID: TC-WP-2026-V1</span>
  </div>
</div>

<!-- ================= TABLE OF CONTENTS ================= -->
<div class="toc-container">
  <div class="toc-title">TABLE OF CONTENTS</div>
  
  <div class="toc-item">
    <div><span class="toc-num">01.</span><span class="toc-name">The Core Idea: What It Is and What It Prohibits</span></div>
    <div class="toc-page">Page 3</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">02.</span><span class="toc-name">Why the Idea Exists: Urban Migration & The Loneliness Deficit</span></div>
    <div class="toc-page">Page 4</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">03.</span><span class="toc-name">Problem-Solution Framework: Eliminating Social Friction</span></div>
    <div class="toc-page">Page 5</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">04.</span><span class="toc-name">End-to-End Operational Mechanics: The 9-Stage User Journey</span></div>
    <div class="toc-page">Page 6</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">05.</span><span class="toc-name">Safety Architecture: Verification, Escrow & In-Person Handshakes</span></div>
    <div class="toc-page">Page 7</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">06.</span><span class="toc-name">Revenue Generation: The Four Revenue Streams</span></div>
    <div class="toc-page">Page 8</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">07.</span><span class="toc-name">Financial Unit Economics: Transaction Waterfall & Margins</span></div>
    <div class="toc-page">Page 9</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">08.</span><span class="toc-name">Technical Reconnaissance: Production Stack & Infrastructure</span></div>
    <div class="toc-page">Page 10</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">09.</span><span class="toc-name">Product Loopholes & Flaws: What TryCompanio Lacks</span></div>
    <div class="toc-page">Page 11</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">10.</span><span class="toc-name">The Superior Challenger: Strategic Blueprint for 'Tribo'</span></div>
    <div class="toc-page">Page 12</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">11.</span><span class="toc-name">Feature-by-Feature Direct Competitive Comparison</span></div>
    <div class="toc-page">Page 13</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">12.</span><span class="toc-name">Six-Month MVP Roadmap, Capital Budget & Strategic Verdict</span></div>
    <div class="toc-page">Page 14</div>
  </div>
</div>

<!-- ================= SECTION 1 ================= -->
<div class="section-label">SECTION 01</div>
<h1>THE CORE IDEA: WHAT IT IS AND WHAT IT PROHIBITS</h1>

<h2>1.1 Executive Definition</h2>
<p>Companio (operated commercially via <code>trycompanio.in</code> by <strong>TRYCOMPANIOLABS LLP</strong>) is a paid on-demand marketplace that connects urban individuals with verified local companions for strictly non-romantic, everyday social activities in public spaces across Indian metropolitan cities.</p>

<p>The core proposition is straightforward: if an individual wants to visit a coffee shop, take a walk through an urban park, work out at a gym, attend a music festival, or tour an art gallery, but lacks an accompanying friend, they can book a vetted local companion for a fixed hourly fee.</p>

<h2>1.2 Boundary Definition: What It Is vs. What It Is Not</h2>
<p>To analyze this business model objectively, clear operational boundaries must be established between its licensed offerings and strictly banned conduct.</p>

<div class="exhibit-title">EXHIBIT 1: BOUNDARY TAXONOMY MATRIX</div>
<table>
  <thead>
    <tr>
      <th style="width: 50%;">WHAT THE PLATFORM PROVIDES</th>
      <th style="width: 50%;">WHAT THE PLATFORM STRICTLY BANS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Platonic Social Presence:</strong> Contracted human companionship for social, athletic, and cultural activities.</td>
      <td><strong>Dating & Romantic Solicitation:</strong> Flirting, dating expectations, and romantic proposals are cause for immediate permanent ban.</td>
    </tr>
    <tr>
      <td><strong>Public-Only Meetups:</strong> All interactions occur in daylight, commercial public places (cafés, parks, gyms, malls).</td>
      <td><strong>Private Residences & Hotel Rooms:</strong> Strict prohibition against home visits, hotel bookings, or secluded settings.</td>
    </tr>
    <tr>
      <td><strong>Financial Escrow Protection:</strong> Funds held securely via Razorpay until in-person 4-digit code verification.</td>
      <td><strong>Adult or Escrow Bypass Services:</strong> Zero tolerance for commercial sex, physical intimacy, or cash-in-hand arrangements.</td>
    </tr>
    <tr>
      <td><strong>Identity Verification:</strong> Companions undergo government identity document checks (Aadhaar/PAN).</td>
      <td><strong>Anonymous or Unverified Hosts:</strong> Unverified profiles cannot list services or receive booking payouts.</td>
    </tr>
  </tbody>
</table>

<div class="callout-box">
  <strong>The Brand Slogan:</strong> <em>"Never go alone."</em> The company addresses the psychological hesitation that causes millions of urban adults to stay inside their apartments rather than enjoying their city because doing activities alone feels uncomfortable or stigmatizing.
</div>

<!-- ================= SECTION 2 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 02</div>
<h1>WHY THE IDEA EXISTS: URBAN MIGRATION & THE LONELINESS DEFICIT</h1>

<h2>2.1 The Indian Internal Migration Wave</h2>
<p>India is experiencing an unprecedented internal migration phenomenon. Over <strong>600 million internal migrants</strong> live within the country. Annually, hundreds of thousands of educated young adults migrate from Tier-2 and Tier-3 towns to concentrated employment corridors:</p>
<ul>
  <li><strong>Bengaluru:</strong> Koramangala, HSR Layout, Indiranagar, Whitefield (IT & Venture Capital).</li>
  <li><strong>Delhi NCR:</strong> Gurugram CyberHub, Golf Course Road, Noida Sector 62 (Corporate & Fintech).</li>
  <li><strong>Mumbai:</strong> Bandra-Kurla Complex (BKC), Lower Parel, Andheri (Banking & Media).</li>
  <li><strong>Hyderabad:</strong> HITEC City, Gachibowli, Madhapur (Software & Pharma).</li>
</ul>

<p>Upon arrival, these young professionals enter an acute social vacuum. They reside in rented single-room flats or paying-guest (PG) facilities. Many work hybrid schedules, limiting organic peer interaction. Outside working hours, they frequently spend entire weekends in absolute physical isolation.</p>

<h2>2.2 The Structural Failure of Dating Applications</h2>
<p>Historically, relocated professionals turned to dating applications (such as Tinder, Bumble, or Hinge) in search of casual companionship. However, dating applications have failed to solve this need due to fundamental structural flaws:</p>
<ol>
  <li><strong>Mismatched Intentions:</strong> Dating platforms inherently carry romantic and sexual expectations. Users seeking simple, casual companionship find themselves entangled in unwanted romantic pressure.</li>
  <li><strong>Extreme Ghosting Rates:</strong> Because dating apps rely on free, low-investment swiping, over 90 percent of digital matches never translate into a real-life meeting.</li>
  <li><strong>Safety and Harassment Risks for Women:</strong> Female users face aggressive advances, unwanted explicit messages, and persistent safety concerns, driving high churn among female users.</li>
</ol>

<h2>2.3 Removing Historical Stigma and Fraud</h2>
<p>Historically, informal classified portals offering "companion rental" in India rapidly degenerated into vehicles for financial extortion, QR-code scams, or illicit services. TryCompanio was established to institutionalize this sector by introducing legal accountability (TRYCOMPANIOLABS LLP), Aadhaar-backed identification, escrow custody, and explicit platonic community guidelines.</p>

<div class="diagram-box">
MACRO MARKET CONTEXT: THE INDIAN LONELINESS ECONOMY
• Prevalence of Chronic Urban Loneliness: 43% to 58% of metro adults
• Addressable Population: 35M+ unmarried urban corporate transplants
• Projected Market Size: $1.0B (2024) growing to $7.9B by 2030 (CAGR: 40.2%)
• Core Demand Trigger: Dating app exhaustion + Desire for safe public activity partners
</div>

<!-- ================= SECTION 3 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 03</div>
<h1>PROBLEM-SOLUTION FRAMEWORK: ELIMINATING SOCIAL FRICTION</h1>

<h2>3.1 The Customer Problem Space</h2>
<p>TryCompanio addresses four specific behavioral obstacles that prevent individuals from participating in urban social life:</p>

<div class="exhibit-title">EXHIBIT 2: CUSTOMER PROBLEM VS. PLATFORM SOLUTION MATRIX</div>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">PROBLEM DOMAIN</th>
      <th style="width: 35%;">MARKET REALITY</th>
      <th style="width: 40%;">TRYCOMPANIO SOLUTION</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Activity Abandonment</strong></td>
      <td>Users hold tickets to concerts or want to visit museum exhibits, but cancel plans because friends back out last minute.</td>
      <td>Provides an on-demand, verified partner dedicated to that specific event with zero flaking.</td>
    </tr>
    <tr>
      <td><strong>Fitness Inconsistency</strong></td>
      <td>Individuals struggle to maintain gym discipline or morning running routines when exercising in total isolation.</td>
      <td>Connects users with local fitness accountability partners and gym spotters.</td>
    </tr>
    <tr>
      <td><strong>Stranger Danger</strong></td>
      <td>Meeting strangers from online forums carries physical security risks, particularly for women.</td>
      <td>Mandates verified government ID, public commercial venues, and real-time in-app SOS telemetry.</td>
    </tr>
    <tr>
      <td><strong>Social Awkwardness</strong></td>
      <td>Asking acquaintances to hang out creates fear of rejection and emotional vulnerability.</td>
      <td>A transparent transactional model removes rejection: companions are contracted to be present and engaged.</td>
    </tr>
  </tbody>
</table>

<h2>3.2 The Standardized Activity Taxonomy</h2>
<p>Companio structures its service around six standardized everyday activity categories, avoiding open-ended or ambiguous requests:</p>
<ul>
  <li><strong>Café Chats:</strong> One-on-one conversations at verified third-wave coffee shops (Blue Tokai, Third Wave Coffee, Starbucks).</li>
  <li><strong>City Walks:</strong> Guided strolls through historical heritage sites, architectural districts, and urban waterfronts.</li>
  <li><strong>Live Events & Gigs:</strong> Plus-one companions for live indie music concerts, standup comedy shows, and cultural festivals.</li>
  <li><strong>Gym Buddies:</strong> Workout spotters, fitness accountability peers, and running partners.</li>
  <li><strong>Museum Visits:</strong> Accompaniment for art gallery exhibitions, cultural installations, and heritage museums.</li>
  <li><strong>Elder Company:</strong> Verified, respectful social companionship and walking partners for isolated senior citizens.</li>
</ul>

<!-- ================= SECTION 4 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 04</div>
<h1>END-TO-END OPERATIONAL MECHANICS: THE 9-STAGE USER JOURNEY</h1>

<h2>4.1 The Two-Sided Marketplace Lifecycle</h2>
<p>The platform coordinates demand (Members) and supply (Companions) through a synchronized, 9-stage operational sequence:</p>

<div class="diagram-box">
STAGE 01: DISCOVERY & FILTERING
Customer visits trycompanio.in -> Filters by City (e.g. Bengaluru) and Activity (e.g. Café Chats).
                          │
                          ▼
STAGE 02: PROFILE PREVIEW
Views masked companion cards (First name, age, languages, verified badge, activity tags).
                          │
                          ▼
STAGE 03: PASS PURCHASE PAYWALL
Customer logs in via email OTP -> Buys Access Pass (from 99.50 INR) -> Full bio & calendar unlock.
                          │
                          ▼
STAGE 04: BOOKING PROPOSAL SUBMISSION
Selects companion -> Proposes Date, Time (minimum 2 hrs notice), Duration, and Named Public Venue.
                          │
                          ▼
STAGE 05: ESCROW PAYMENT DEPOSIT
Customer deposits total meetup fee into Razorpay Escrow -> Funds safely frozen.
                          │
                          ▼
STAGE 06: COMPANION ACCEPTANCE (SLA: 12 HOURS)
Companion receives notification -> Reviews venue and time -> Has 12 daylight hours to accept.
                          │
                          ▼
STAGE 07: IN-APP CHAT UNLOCKS
Upon companion acceptance, private in-app chat opens -> Exact table/meeting point confirmed.
                          │
                          ▼
STAGE 08: IN-PERSON MEETUP & 4-DIGIT PIN HANDSHAKE
Both meet in public -> Customer shares secret 4-digit code -> Companion submits code -> Escrow releases.
                          │
                          ▼
STAGE 09: DISBURSEMENT & REVIEW
Companion receives 70% UPI payout within 24 hours -> Customer submits mutual 5-star rating.
</div>

<h2>4.2 Asymmetric Communication Architecture</h2>
<p>A critical architectural feature of TryCompanio is the <strong>asymmetric communication lock</strong>. Prospective customers cannot directly message a companion prior to booking. The chat channel unlocks <em>only after</em> the companion has explicitly reviewed the proposed public venue and accepted the booking. This shields companions from unwanted harassment, solicitation, and unpaid conversational demands.</p>

<!-- ================= SECTION 5 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 05</div>
<h1>SAFETY ARCHITECTURE: VERIFICATION, ESCROW & IN-PERSON HANDSHAKES</h1>

<h2>5.1 The Four Verification Pillars</h2>
<p>To operate legally and ethically in the Indian market, Companio relies on a multi-tiered safety architecture designed to eliminate disputes and guarantee physical security:</p>

<div class="exhibit-title">EXHIBIT 3: TRUST AND SAFETY ENFORCEMENT LAYERS</div>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">SAFETY LAYER</th>
      <th style="width: 35%;">OPERATIONAL MECHANISM</th>
      <th style="width: 40%;">LEGAL & SECURITY IMPACT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Identity Verification</strong></td>
      <td>Companions submit government Aadhaar or PAN card + live photographic portrait.</td>
      <td>Deters bad actors; creates full audit trail for law enforcement under DPDPA 2023.</td>
    </tr>
    <tr>
      <td><strong>Venue Enforcement</strong></td>
      <td>Meetups restricted strictly to public, high-traffic commercial spaces.</td>
      <td>Eliminates private-space vulnerability; prevents illicit solicitation.</td>
    </tr>
    <tr>
      <td><strong>4-Digit Code Handshake</strong></td>
      <td>Customer holds private 4-digit PIN; revealed to host only after in-person arrival.</td>
      <td>Prevents financial fraud; guarantees payment release only upon actual physical fulfillment.</td>
    </tr>
    <tr>
      <td><strong>In-App SOS Telemetry</strong></td>
      <td>Persistent floating button exports live GPS coordinates to emergency contacts via WhatsApp/SMS.</td>
      <td>Provides real-time distress escalation; connected to support hotline (+91 91794 93270).</td>
    </tr>
  </tbody>
</table>

<h2>5.2 Financial Escrow Protection Logic</h2>
<p>The escrow mechanism acts as an impartial financial referee between two strangers:</p>
<ul>
  <li><strong>Customer Protection:</strong> If a companion fails to accept within 12 hours, cancels the meetup, or fails to appear at the venue, the full booking fee is automatically refunded to the customer's wallet.</li>
  <li><strong>Companion Protection:</strong> Because the meetup fee is deposited into escrow prior to the meetup, the companion is guaranteed their 70 percent payout without having to negotiate or demand cash in person.</li>
</ul>

<div class="warning-box">
  <strong>Regulatory Acknowledgment:</strong> On its official disclosure pages, TryCompanio transparently clarifies that its "ID-Checked" badge represents manual structural document review rather than direct biometric UIDAI API authentication. This honesty protects the entity against consumer fraud liability.
</div>

<!-- ================= SECTION 6 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 06</div>
<h1>REVENUE GENERATION: THE FOUR REVENUE STREAMS</h1>

<h2>6.1 Revenue Model Overview</h2>
<p>TryCompanio does not rely on a single revenue channel. It combines upfront access fees, marketplace commission take-rates, onboarding fees, and withdrawal arbitrage into a diversified monetization engine:</p>

<div class="exhibit-title">EXHIBIT 4: COMPANIO REVENUE STREAM BREAKDOWN</div>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">REVENUE STREAM</th>
      <th style="width: 20%;">CHARGED TO</th>
      <th style="width: 25%;">PRICING SCHEDULE</th>
      <th style="width: 30%;">COMMERCIAL OBJECTIVE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Member Access Passes</strong></td>
      <td>Demand (Customers)</td>
      <td>1 Month: 99.50 INR<br>3 Months: 249.50 INR<br>12 Months: 499.50 INR<br>Lifetime: 999.50 INR</td>
      <td>Filters non-serious browsers; generates immediate upfront positive cash flow. Passes do not auto-renew.</td>
    </tr>
    <tr>
      <td><strong>2. Marketplace Take-Rate</strong></td>
      <td>Supply (Companions)</td>
      <td>30% on meetups &le; 1,000 INR<br>32% on meetups &gt; 1,000 INR<br><em>(Includes applicable GST)</em></td>
      <td>Core transactional monetization extracted from gross hourly booking fees upon code completion.</td>
    </tr>
    <tr>
      <td><strong>3. Host Application Fee</strong></td>
      <td>Supply (Applicants)</td>
      <td>99.50 INR (One-time, non-refundable)</td>
      <td>Offsets manual administrative costs of Aadhaar document review; filters out fraudulent applicants.</td>
    </tr>
    <tr>
      <td><strong>4. Wallet Cashout Fee</strong></td>
      <td>All Users</td>
      <td>12% processing fee on wallet withdrawals to bank account</td>
      <td>Incentivizes retaining credits inside platform wallet; extracts arbitrage on cash withdrawals.</td>
    </tr>
  </tbody>
</table>

<h2>6.2 Strategic Value of Non-Renewing Passes</h2>
<p>A notable commercial decision is that TryCompanio's access passes do <strong>not</strong> auto-renew. In India, recurring auto-debit mandates (e-mandates) require two-factor authentication and frequently trigger consumer friction and payment failures. By utilizing non-renewing one-time passes, Companio reduces chargebacks, builds trust, and triggers recurring impulse re-purchases.</p>

<!-- ================= SECTION 7 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 07</div>
<h1>FINANCIAL UNIT ECONOMICS: TRANSACTION WATERFALL & MARGINS</h1>

<h2>7.1 Transaction Math: Standard 2-Hour Café Booking</h2>
<p>The financial mechanics of an average booking demonstrate strong unit profitability:</p>

<div class="exhibit-title">EXHIBIT 5: UNIT ECONOMICS PER 2-HOUR CAFÉ MEETUP</div>
<table>
  <thead>
    <tr>
      <th>FINANCIAL LINE ITEM</th>
      <th style="text-align: right;">AMOUNT (INR)</th>
      <th style="text-align: right;">PERCENTAGE OF GMV</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Companion Stated Rate (400 INR / hour &times; 2 hours)</td>
      <td style="text-align: right;">800.00 INR</td>
      <td style="text-align: right;">100.0%</td>
    </tr>
    <tr>
      <td>Allocated Access Pass Revenue (Assumes 2 meetups on 99.50 pass)</td>
      <td style="text-align: right;">49.75 INR</td>
      <td style="text-align: right;">6.2%</td>
    </tr>
    <tr style="font-weight: 700; background-color: #E2E8F0;">
      <td>GROSS PLATFORM COLLECTION</td>
      <td style="text-align: right;">849.75 INR</td>
      <td style="text-align: right;">106.2%</td>
    </tr>
    <tr>
      <td>Companion Payout Share (70% of 800 INR)</td>
      <td style="text-align: right;">-560.00 INR</td>
      <td style="text-align: right;">-70.0%</td>
    </tr>
    <tr>
      <td>Payment Gateway Processing Cost (Razorpay ~2%)</td>
      <td style="text-align: right;">-16.00 INR</td>
      <td style="text-align: right;">-2.0%</td>
    </tr>
    <tr style="font-weight: 700; background-color: #FEF3C7; color: #78350F;">
      <td>NET PLATFORM CONTRIBUTION MARGIN</td>
      <td style="text-align: right;">273.75 INR</td>
      <td style="text-align: right;">32.2% Net Margin</td>
    </tr>
  </tbody>
</table>

<h2>7.2 Monthly Financial Projection Model (Steady State)</h2>
<p>Based on TryCompanio's reported database scale (120,000+ registered profiles across 126 cities), a steady-state monthly operating model indicates attractive capital efficiency:</p>

<div class="exhibit-title">EXHIBIT 6: ESTIMATED MONTHLY FINANCIAL RUN RATE</div>
<table>
  <thead>
    <tr>
      <th>REVENUE COMPONENT</th>
      <th>MONTHLY VOLUME</th>
      <th style="text-align: right;">MONTHLY VALUE (INR)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Member Access Passes</td>
      <td>1,500 Active Passes @ 99.50 INR</td>
      <td style="text-align: right;">1,49,250 INR</td>
    </tr>
    <tr>
      <td>Platform Take-Rate (30% on Meetups)</td>
      <td>1,000 Completed Meetups (8,00,000 INR GMV)</td>
      <td style="text-align: right;">2,40,000 INR</td>
    </tr>
    <tr>
      <td>Companion Application Fees</td>
      <td>250 Applicants @ 99.50 INR</td>
      <td style="text-align: right;">24,875 INR</td>
    </tr>
    <tr>
      <td>Wallet Cashout Arbitrage (12%)</td>
      <td>1,00,000 INR in Gross Withdrawals</td>
      <td style="text-align: right;">12,000 INR</td>
    </tr>
    <tr style="font-weight: 700; background-color: #D1FAE5; color: #065F46;">
      <td>TOTAL MONTHLY NET REVENUE</td>
      <td>—</td>
      <td style="text-align: right;">4,26,125 INR (~$5,100 USD)</td>
    </tr>
    <tr style="font-weight: 700; background-color: #E2E8F0;">
      <td>ANNUALIZED REVENUE RUN RATE</td>
      <td>—</td>
      <td style="text-align: right;">51,13,500 INR (~$61,500 USD)</td>
    </tr>
  </tbody>
</table>

<!-- ================= SECTION 8 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 08</div>
<h1>TECHNICAL RECONNAISSANCE: PRODUCTION STACK & INFRASTRUCTURE</h1>

<h2>8.1 Confirmed Technical Architecture</h2>
<p>Reconnaissance of public DNS records, HTTP response headers, CSP directives, and build fingerprints confirms that TryCompanio operates a modern JAMstack cloud architecture:</p>

<div class="exhibit-title">EXHIBIT 7: TECHNICAL STACK & INFRASTRUCTURE SPECIFICATION</div>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">LAYER</th>
      <th style="width: 45%;">PRODUCTION TECHNOLOGY</th>
      <th style="width: 30%;">VERIFICATION EVIDENCE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend Framework</strong></td>
      <td>Next.js 15+ (App Router, React Server Components - RSC)</td>
      <td>Confirmed via <code>_next/static</code> and <code>x-nextjs-prerender</code>.</td>
    </tr>
    <tr>
      <td><strong>Styling & Design</strong></td>
      <td>Tailwind CSS, Lucide Icons, Spline 3D WebGL</td>
      <td>Class structures, font imports, Spline CSP permissions.</td>
    </tr>
    <tr>
      <td><strong>Edge & Hosting</strong></td>
      <td>Vercel Global Edge Network (ISR 300s edge caching)</td>
      <td>Confirmed via <code>x-vercel-cache</code> and deployment IDs.</td>
    </tr>
    <tr>
      <td><strong>CDN & Edge Security</strong></td>
      <td>Cloudflare Anycast CDN & WAF (HTTP/3 QUIC)</td>
      <td>Confirmed via <code>CF-RAY</code> and nameservers (ajay.ns / jo.ns).</td>
    </tr>
    <tr>
      <td><strong>Payment Gateway</strong></td>
      <td>Razorpay (Escrow, Route, Payouts API)</td>
      <td>Confirmed via CSP connect-src (api.razorpay.com).</td>
    </tr>
    <tr>
      <td><strong>Product Telemetry</strong></td>
      <td>PostHog Product Analytics + Sentry Error Monitoring</td>
      <td>Confirmed via CSP endpoints (us.i.posthog.com / sentry.io).</td>
    </tr>
    <tr>
      <td><strong>Mapping Engine</strong></td>
      <td>OpenStreetMap + MapTiler + ArcGIS Online</td>
      <td>Confirmed via CSP image-src tile endpoints.</td>
    </tr>
  </tbody>
</table>

<h2>8.2 Search Engine & AI Crawler Directives (Robots.txt Analysis)</h2>
<p>Inspection of <code>trycompanio.in/robots.txt</code> reveals an advanced, AI-conscious indexing strategy:</p>
<ul>
  <li><strong>Full AI Ingestion Allowed:</strong> The platform explicitly allows <code>GPTBot</code>, <code>ClaudeBot</code>, <code>PerplexityBot</code>, <code>Applebot-Extended</code>, and <code>Google-Extended</code> to crawl and index public pages, ensuring the platform appears in generative AI search results.</li>
  <li><strong>Functional Route Protection:</strong> Sensitive operational routes (<code>/api/</code>, <code>/admin/</code>, <code>/book/</code>, <code>/dashboard/</code>, <code>/companion-dashboard/</code>, <code>/receipt/</code>) are shielded from indexation.</li>
</ul>

<!-- ================= SECTION 9 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 09</div>
<h1>PRODUCT LOOPHOLES & FLAWS: WHAT TRYCOMPANIO LACKS</h1>

<h2>9.1 Six Structural Flaws in the Incumbent Model</h2>
<p>Despite its initial market validation, TryCompanio has significant structural deficiencies that make it vulnerable to displacement by an agile, well-engineered challenger:</p>

<div class="exhibit-title">EXHIBIT 8: TRYCOMPANIO LOOPHOLE & VULNERABILITY AUDIT</div>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">VULNERABILITY</th>
      <th style="width: 40%;">STRUCTURAL FLAW</th>
      <th style="width: 35%;">BUSINESS IMPACT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Web-Only Architecture</strong></td>
      <td>Operates strictly as a responsive web app; no native iOS or Android apps in stores.</td>
      <td>Cannot deliver reliable background push notifications; no lock-screen emergency SOS widget.</td>
    </tr>
    <tr>
      <td><strong>2. 12-Hour Booking Lag</strong></td>
      <td>Companions have up to 12 hours to respond; zero instant-booking capability.</td>
      <td>Loses spontaneous, on-demand urban demand (e.g., weekend afternoon plans).</td>
    </tr>
    <tr>
      <td><strong>3. Host Fee Friction</strong></td>
      <td>Charges companions 99.50 INR upfront to apply.</td>
      <td>Chokes host supply; discourages university students from joining as companions.</td>
    </tr>
    <tr>
      <td><strong>4. Manual 48-Hour KYC</strong></td>
      <td>Relies on human staff to manually verify uploaded Aadhaar photos.</td>
      <td>Creates a 48-hour onboarding delay; fails to verify live UIDAI database records.</td>
    </tr>
    <tr>
      <td><strong>5. Platform Leakage</strong></td>
      <td>Provides zero economic incentive against off-platform disintermediation.</td>
      <td>Users and hosts exchange phone numbers on meetup 1, bypassing the platform on meetup 2.</td>
    </tr>
    <tr>
      <td><strong>6. Empty Blog / SEO Void</strong></td>
      <td>Directory <code>/blog</code> exists with zero published articles.</td>
      <td>Abandons thousands of high-intent organic search queries around urban loneliness.</td>
    </tr>
  </tbody>
</table>

<div class="warning-box">
  <strong>The Disintermediation Trap:</strong> TryCompanio bears 100 percent of the customer acquisition cost (CAC) through social media ads, but captures zero recurring lifetime value (LTV) if customers and companions simply meet off-platform for cash after their initial introduction.
</div>

<!-- ================= SECTION 10 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 10</div>
<h1>THE SUPERIOR CHALLENGER: STRATEGIC BLUEPRINT FOR 'TRIBO'</h1>

<h2>10.1 Concept & Brand Positioning</h2>
<p>We propose building <strong>Tribo</strong> (derived from <em>Tribe</em> and <em>Community</em>), positioned as <strong>"India's On-Demand Real-Life Social & Activity Network."</strong></p>
<p>Unlike TryCompanio's transactional and solitary framing, Tribo positions companionship as a dynamic lifestyle network for shared activities, active wellness, and cultural exploration.</p>

<h2>10.2 The Six Architectural Leapfrog Upgrades</h2>
<ol>
  <li><strong>100% Free Host Onboarding:</strong> Remove the 99.50 INR host application fee entirely. Absorb the 15 INR automated e-KYC fee as customer acquisition cost, instantly unlocking dense companion liquidity.</li>
  <li><strong>Automated DigiLocker e-KYC (<60 Seconds):</strong> Integrate automated Aadhaar OTP verification via Setu or Cashfree Verification, approving hosts in under 60 seconds with live UIDAI validation.</li>
  <li><strong>Curated 4-Person Activity Pods:</strong> Introduce small-group experiences (table of 4 for Saturday coffee, group of 5 for Sunday morning runs). Group dynamics eliminate the social awkwardness and dating pressure of 1-on-1 meetups.</li>
  <li><strong>Instant Companion Radar ("Live Now"):</strong> Interactive radial map showing background-verified companions available within 3 km for spontaneous meetups within 45 minutes.</li>
  <li><strong>60-Second Video Icebreaker Call:</strong> An encrypted in-app WebRTC video call unlocking 1 hour before the meetup. Both parties verify physical appearance and conversational vibe without exchanging phone numbers.</li>
  <li><strong>Anti-Leakage Merchant Integrations:</strong> Partner with established café chains (Blue Tokai, Third Wave Coffee) and gyms (Cult.fit). Meeting through Tribo generates an in-app QR code providing 15% off the café bill, making off-platform meetings economically disadvantageous.</li>
</ol>

<!-- ================= SECTION 11 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 11</div>
<h1>FEATURE-BY-FEATURE DIRECT COMPETITIVE COMPARISON</h1>

<div class="exhibit-title">EXHIBIT 9: FEATURE-BY-FEATURE BENCHMARK: TRYCOMPANIO VS. TRIBO</div>
<table>
  <thead>
    <tr>
      <th style="width: 22%;">FEATURE DOMAIN</th>
      <th style="width: 38%;">TRYCOMPANIO (CURRENT INCUMBENT)</th>
      <th style="width: 40%;">TRIBO (PROPOSED CHALLENGER)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Platform Delivery</strong></td>
      <td>Mobile Web Application (Next.js PWA).</td>
      <td><strong>Native Cross-Platform Mobile Apps (Flutter for iOS & Android).</strong></td>
    </tr>
    <tr>
      <td><strong>Host Onboarding Fee</strong></td>
      <td>99.50 INR non-refundable fee.</td>
      <td><strong>100% Free; Platform absorbs KYC cost.</strong></td>
    </tr>
    <tr>
      <td><strong>KYC Verification Speed</strong></td>
      <td>Up to 48 hours (Manual human review).</td>
      <td><strong>Under 60 Seconds (Automated DigiLocker / Aadhaar OTP).</strong></td>
    </tr>
    <tr>
      <td><strong>Discovery Paradigm</strong></td>
      <td>Static city-wide filtered directory list.</td>
      <td><strong>Live Radial Map Radar (<3 km radius) + Directory.</strong></td>
    </tr>
    <tr>
      <td><strong>Interaction Formats</strong></td>
      <td>1-on-1 private meetups only.</td>
      <td><strong>1-on-1 Meetups + Curated 4-Person Activity Pods.</strong></td>
    </tr>
    <tr>
      <td><strong>Pre-Meetup Verification</strong></td>
      <td>Static uploaded photographs only.</td>
      <td><strong>60-Second In-App WebRTC Video Icebreaker.</strong></td>
    </tr>
    <tr>
      <td><strong>Booking Latency</strong></td>
      <td>Up to 12 hours response window.</td>
      <td><strong>Instant Book ("Live Now") or 2-Hour Maximum SLA.</strong></td>
    </tr>
    <tr>
      <td><strong>Consumer Pricing Model</strong></td>
      <td>Pass Fee (99.50+) + Hourly Meetup Fee.</td>
      <td><strong>All-in-One Transparent Pricing (Zero pass gate).</strong></td>
    </tr>
    <tr>
      <td><strong>Safety Telemetry</strong></td>
      <td>Manual Web Share API text snapshot.</td>
      <td><strong>Background Geofencing + Live Native SOS.</strong></td>
    </tr>
    <tr>
      <td><strong>Disintermediation Defense</strong></td>
      <td>None (Easily bypassed after meetup 1).</td>
      <td><strong>In-App Karma Points + 15% Partner Café Discounts.</strong></td>
    </tr>
  </tbody>
</table>

<!-- ================= SECTION 12 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 12</div>
<h1>SIX-MONTH MVP ROADMAP, CAPITAL BUDGET & STRATEGIC VERDICT</h1>

<h2>12.1 Estimated Capital Expenditure to Launch MVP (INR)</h2>
<p>The estimated seed capital required to develop, launch, and validate Tribo across a 6-month operational runway in an initial pilot market (Bengaluru) is outlined below:</p>

<div class="exhibit-title">EXHIBIT 10: ESTIMATED MVP CAPITAL BUDGET</div>
<table>
  <thead>
    <tr>
      <th>EXPENDITURE LINE ITEM</th>
      <th>ALLOCATION & DETAILS</th>
      <th style="text-align: right;">ESTIMATED COST (INR)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Senior Mobile Engineers (Flutter)</td>
      <td>2 Developers &times; 6 Months @ 1,50,000 INR/mo</td>
      <td style="text-align: right;">18,00,000 INR</td>
    </tr>
    <tr>
      <td>Backend & Cloud DevOps Engineer</td>
      <td>1 Engineer &times; 6 Months @ 1,50,000 INR/mo</td>
      <td style="text-align: right;">9,00,000 INR</td>
    </tr>
    <tr>
      <td>UI/UX Product Designer</td>
      <td>Contract Design Lead (2 Months)</td>
      <td style="text-align: right;">3,00,000 INR</td>
    </tr>
    <tr>
      <td>DigiLocker / Cashfree KYC API Credits</td>
      <td>5,000 automated verifications @ 15 INR</td>
      <td style="text-align: right;">75,000 INR</td>
    </tr>
    <tr>
      <td>AWS Cloud Infrastructure & Database</td>
      <td>6 Months @ 20,000 INR/mo</td>
      <td style="text-align: right;">1,20,000 INR</td>
    </tr>
    <tr>
      <td>Legal Incorporation & DPDPA Compliance</td>
      <td>LLP formation, Terms of Service, Escrow drafting</td>
      <td style="text-align: right;">1,50,000 INR</td>
    </tr>
    <tr>
      <td>Payment Gateway Escrow Merchant Setup</td>
      <td>Cashfree / Razorpay Route security setup</td>
      <td style="text-align: right;">50,000 INR</td>
    </tr>
    <tr>
      <td>Targeted Launch Marketing (Bengaluru Pilot)</td>
      <td>Short-form video creator campaigns (3 Months)</td>
      <td style="text-align: right;">6,00,000 INR</td>
    </tr>
    <tr style="font-weight: 700; background-color: #D1FAE5; color: #065F46;">
      <td>TOTAL ESTIMATED SEED CAPITAL</td>
      <td>6-Month Runway to Product-Market Fit</td>
      <td style="text-align: right;">39,95,000 INR (~$48,000 USD)</td>
    </tr>
  </tbody>
</table>

<h2>12.2 Phased 6-Month Execution Timeline</h2>
<ul>
  <li><strong>Months 1 – 2 (Core Build):</strong> Develop Flutter mobile client, implement Cashfree escrow payment splits, integrate DigiLocker automated e-KYC, and configure AWS serverless infrastructure.</li>
  <li><strong>Months 3 – 4 (Bengaluru Pilot):</strong> Launch exclusively in Bengaluru (Koramangala, HSR Layout, Indiranagar). Onboard 150 verified seed hosts with zero fees. Launch 4-person café and running activity pods.</li>
  <li><strong>Months 5 – 6 (Regional Expansion):</strong> Roll out partner café QR discounts, activate in-app 60-second video icebreakers, expand to Mumbai and Delhi NCR, and initiate corporate B2B relocation pilots.</li>
</ul>

<h2>12.3 Strategic Verdict</h2>
<p>TryCompanio has validated that paid platonic companionship is a viable and lucrative commercial category in modern India. However, its web-only architecture, 12-hour booking delays, upfront host fees, and vulnerability to platform leakage leave an immediate opportunity for a superior competitor. By executing <strong>Tribo</strong> with <strong>zero-fee onboarding, automated DigiLocker verification, small-group activity pods, live radar, and partner café discounts</strong>, a challenger startup can build the definitive category leader in India's emerging $7.9 billion companionship market.</p>

<div class="callout-box" style="text-align: center; margin-top: 30px;">
  <strong>END OF WHITE PAPER PRESENTATION</strong><br>
  Prepared by Senior Startup Strategy & Product Architecture Consortium &bull; November 2026
</div>

</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML whitepaper source written to: {HTML_PATH}")

# Compile HTML to PDF using Chrome Headless
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
tmp_dir = os.environ.get("TEMP", r"C:\Users\Dell\AppData\Local\Temp")
user_data_dir = os.path.join(tmp_dir, "chrome_whitepaper_rnd")

cmd = [
    chrome_path,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    f"--user-data-dir={user_data_dir}",
    f"--print-to-pdf={PDF_PATH}",
    HTML_PATH
]

print("Executing Chrome headless PDF generation...")
result = subprocess.run(cmd, capture_output=True, text=True)

if os.path.exists(PDF_PATH):
    size = os.path.getsize(PDF_PATH)
    print(f"PDF generated successfully: {PDF_PATH} ({size} bytes)")
    # Also copy to root workspace for easy access
    import shutil
    shutil.copy2(PDF_PATH, ROOT_PDF_PATH)
    print(f"Copied master PDF to root: {ROOT_PDF_PATH}")
else:
    print(f"PDF generation failed: {result.stderr}")
