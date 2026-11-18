import os
import subprocess
import shutil

BASE_DIR = r"C:\Users\Dell\Documents\codes\trycompanio\WHITEPAPER-DOSSIER\07-PDF-WHITEPAPER"
HTML_PATH = os.path.join(BASE_DIR, "master-whitepaper.html")
PDF_PATH = os.path.join(BASE_DIR, "TRYCOMPANIO-MASTER-EXECUTIVE-WHITEPAPER.pdf")
ROOT_PDF_PATH = r"C:\Users\Dell\Documents\codes\trycompanio\TRYCOMPANIO-MASTER-EXECUTIVE-WHITEPAPER.pdf"

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TryCompanio & GetCompanio: Comprehensive Business Architecture, Product Mechanics & Strategic Master Whitepaper</title>
<style>
  @page {
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
    @bottom-right {
      content: "Page " counter(page);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 8pt;
      color: #627D98;
    }
    @bottom-left {
      content: "CONFIDENTIAL | INSTITUTIONAL PRODUCT & BUSINESS WHITEPAPER";
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 8pt;
      color: #627D98;
      letter-spacing: 0.5px;
    }
  }

  body {
    font-family: 'Georgia', 'Cambria', 'Times New Roman', serif;
    font-size: 10pt;
    line-height: 1.5;
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
    padding-top: 30px;
    box-sizing: border-box;
  }

  .cover-header {
    border-bottom: 3px solid #0F2B48;
    padding-bottom: 15px;
  }

  .cover-tag {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #B45309;
    margin-bottom: 10px;
  }

  .cover-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 24pt;
    font-weight: 800;
    line-height: 1.15;
    color: #0A192F;
    margin: 0 0 12px 0;
  }

  .cover-subtitle {
    font-size: 11.5pt;
    color: #334E68;
    font-style: italic;
    line-height: 1.4;
    margin: 0 0 20px 0;
  }

  .cover-metadata-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    border-top: 1px solid #D9E2EC;
    border-bottom: 1px solid #D9E2EC;
    padding: 16px 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8.5pt;
  }

  .meta-item strong {
    color: #0A192F;
    display: block;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .cover-summary {
    background-color: #F8FAFC;
    border-left: 4px solid #0F2B48;
    padding: 14px 18px;
    font-size: 9pt;
    color: #243B53;
    line-height: 1.45;
  }

  .cover-footer {
    border-top: 1px solid #D9E2EC;
    padding-top: 12px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 7.5pt;
    color: #627D98;
    display: flex;
    justify-content: space-between;
  }

  /* Typography */
  h1 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 14.5pt;
    font-weight: 700;
    color: #0A192F;
    border-bottom: 1.5px solid #0F2B48;
    padding-bottom: 5px;
    margin-top: 24px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }

  .section-label {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #B45309;
    margin-bottom: 3px;
  }

  h2 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 11.5pt;
    font-weight: 700;
    color: #102A43;
    margin-top: 16px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }

  h3 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9.5pt;
    font-weight: 700;
    color: #243B53;
    margin-top: 12px;
    margin-bottom: 5px;
    page-break-after: avoid;
  }

  p {
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 18px;
  }

  li {
    margin-bottom: 3px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8pt;
    page-break-inside: avoid;
  }

  th {
    background-color: #0F2B48;
    color: #FFFFFF;
    text-align: left;
    padding: 6px 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid #0F2B48;
  }

  td {
    padding: 5px 8px;
    border: 1px solid #D9E2EC;
    color: #102A43;
  }

  tr:nth-child(even) td {
    background-color: #F8FAFC;
  }

  /* Boxes & Callouts */
  .callout-box {
    background-color: #F8FAFC;
    border-left: 4px solid #0F2B48;
    padding: 10px 14px;
    margin: 12px 0;
    font-size: 9pt;
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
    margin: 12px 0;
    font-size: 9pt;
    color: #78350F;
    page-break-inside: avoid;
  }

  .diagram-box {
    background-color: #F0F4F8;
    border: 1px solid #D9E2EC;
    padding: 10px 12px;
    margin: 12px 0;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 7pt;
    line-height: 1.3;
    color: #0A192F;
    white-space: pre;
    overflow-x: hidden;
    page-break-inside: avoid;
  }

  .image-container {
    text-align: center;
    margin: 14px 0;
    page-break-inside: avoid;
  }

  .image-container img {
    max-width: 100%;
    height: auto;
    border: 1px solid #D9E2EC;
    border-radius: 4px;
  }

  .image-caption {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 7.5pt;
    color: #627D98;
    font-style: italic;
    margin-top: 4px;
  }

  .page-break {
    page-break-before: always;
  }

  .toc-container {
    background-color: #F8FAFC;
    border: 1px solid #D9E2EC;
    padding: 16px 20px;
    margin: 16px 0;
    page-break-after: always;
  }

  .toc-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 12pt;
    font-weight: 700;
    color: #0A192F;
    border-bottom: 2px solid #0F2B48;
    padding-bottom: 5px;
    margin-bottom: 12px;
  }

  .toc-item {
    display: flex;
    justify-content: space-between;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8.5pt;
    margin-bottom: 6px;
    border-bottom: 1px dotted #CBD2D9;
    padding-bottom: 2px;
  }

  .toc-num {
    font-weight: 700;
    color: #B45309;
    margin-right: 6px;
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
    font-size: 8pt;
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
    <div class="cover-tag">Executive Strategy Whitepaper & Master Technical Intelligence Dossier</div>
    <div class="cover-title">THE COMPANIO PLATFORM: BUSINESS ARCHITECTURE, DUAL-DOMAIN MECHANICS, TECHNICAL RECONNAISSANCE & COMPLETE STRATEGIC BLUEPRINT</div>
    <div class="cover-subtitle">A Comprehensive, Line-by-Line Investigation into TryCompanio & GetCompanio: Architecture, Codebase Telemetry, Subscription Economics, Chatting Flows, Platform Vulnerabilities, and Next-Generation Market Opportunities</div>
  </div>

  <div class="cover-metadata-grid">
    <div class="meta-item">
      <strong>Target Ecosystem</strong>
      TryCompanio (trycompanio.in) & GetCompanio (getcompanio.in)
    </div>
    <div class="meta-item">
      <strong>Corporate Legal Entity</strong>
      TRYCOMPANIOLABS LLP (LLPIN: ACY-1464 | RoC-Delhi)
    </div>
    <div class="meta-item">
      <strong>Designated Officers</strong>
      Prashant Yadav (New Delhi) & Suraj Choudhary (Jaipur)
    </div>
    <div class="meta-item">
      <strong>Document Date & Status</strong>
      November 17, 2026 | Verified Complete Master Edition
    </div>
    <div class="meta-item">
      <strong>Investigative Scope</strong>
      Frontend/Backend Code, Escrow, WebSockets, Firebase, Cashfree & Razorpay
    </div>
    <div class="meta-item">
      <strong>Classification</strong>
      Institutional Product Architecture & Investment Strategy Whitepaper
    </div>
  </div>

  <div class="cover-summary">
    <strong>Executive Statement:</strong> This master whitepaper presents the complete reverse-engineered architecture of Companio. It resolves the dual-domain relationship between <code>trycompanio.in</code> (the acquisition and SEO engine) and <code>getcompanio.in</code> (the live operational PWA marketplace). It provides exhaustive line-by-line breakdowns of all frontend and backend flows, subscription paywall logic (from the minimum 99.50 INR pass to the maximum 999.50 INR lifetime tier), real-time WebSocket chat protocols, financial waterfalls, structural flaws, and the comprehensive blueprint for building a superior category leader.
  </div>

  <div class="cover-footer">
    <span>Institutional Research Whitepaper</span>
    <span>Document Ref: CMP-MSTR-WP-2026</span>
  </div>
</div>

<!-- ================= TABLE OF CONTENTS ================= -->
<div class="toc-container">
  <div class="toc-title">TABLE OF CONTENTS</div>
  
  <div class="toc-item">
    <div><span class="toc-num">01.</span><span class="toc-name">Executive Summary & Corporate Registry Dossier</span></div>
    <div class="toc-page">Section 1</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">02.</span><span class="toc-name">The Core Thesis: Why This Idea Works & Generates Profit</span></div>
    <div class="toc-page">Section 2</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">03.</span><span class="toc-name">The Dual-Domain Discovery: TryCompanio vs. GetCompanio</span></div>
    <div class="toc-page">Section 3</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">04.</span><span class="toc-name">End-to-End System Sequence: From Instagram Reel to UPI Payout</span></div>
    <div class="toc-page">Section 4</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">05.</span><span class="toc-name">Subscription Tiers & Paywall Mechanics: 99.50 INR to 999.50 INR</span></div>
    <div class="toc-page">Section 5</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">06.</span><span class="toc-name">Frontend & Backend Architecture: Next.js, Firebase, Cashfree & WebSockets</span></div>
    <div class="toc-page">Section 6</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">07.</span><span class="toc-name">Complete Page-by-Page Workflow & Screen Breakdown</span></div>
    <div class="toc-page">Section 7</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">08.</span><span class="toc-name">Chatting Flow, Safety Telemetry & In-Person Handshake Mechanics</span></div>
    <div class="toc-page">Section 8</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">09.</span><span class="toc-name">Financial Waterfall: How the Platform Makes Money (The 706 INR Math)</span></div>
    <div class="toc-page">Section 9</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">10.</span><span class="toc-name">Pros, Cons, Loopholes & Business Model Vulnerabilities</span></div>
    <div class="toc-page">Section 10</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">11.</span><span class="toc-name">The Competitor Landscape: Direct Platforms vs. Indirect Substitutes</span></div>
    <div class="toc-page">Section 11</div>
  </div>
  <div class="toc-item">
    <div><span class="toc-num">12.</span><span class="toc-name">The Superior Challenger Blueprint: 'Tribo' Architecture & MVP Plan</span></div>
    <div class="toc-page">Section 12</div>
  </div>
</div>

<!-- ================= SECTION 1 ================= -->
<div class="section-label">SECTION 01</div>
<h1>EXECUTIVE SUMMARY & CORPORATE REGISTRY DOSSIER</h1>

<h2>1.1 Identity of the Enterprise</h2>
<p>Companio operates as an on-demand, peer-to-peer (P2P) localized social marketplace connecting individuals with verified local companions for strictly platonic, everyday public activities across Indian cities.</p>

<div class="exhibit-title">EXHIBIT 1: STATUTORY CORPORATE PROFILE</div>
<table>
  <thead>
    <tr>
      <th style="width: 30%;">CORPORATE ATTRIBUTE</th>
      <th style="width: 70%;">OFFICIAL REGULATORY RECORD</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Commercial Brand Names</strong></td>
      <td>Companio / TryCompanio / GetCompanio</td>
    </tr>
    <tr>
      <td><strong>Operating Legal Entity</strong></td>
      <td><strong>TRYCOMPANIOLABS LLP</strong></td>
    </tr>
    <tr>
      <td><strong>Registration Identifier</strong></td>
      <td>LLPIN: <strong>ACY-1464</strong> (Ministry of Corporate Affairs, Government of India)</td>
    </tr>
    <tr>
      <td><strong>Incorporation Date & RoC</strong></td>
      <td>May 14, 2026 | Registrar of Companies, Delhi (RoC-Delhi)</td>
    </tr>
    <tr>
      <td><strong>Statutory Registered Office</strong></td>
      <td>DPT 808B, F 79-80, 8th Floor, DLF Prime Tower, Okhla Industrial Area Phase-I, New Delhi — 110020</td>
    </tr>
    <tr>
      <td><strong>Operational Safety Office</strong></td>
      <td>Companio Labs Operations Centre, Jaipur, Rajasthan</td>
    </tr>
    <tr>
      <td><strong>Designated Partners</strong></td>
      <td>Hardik Kedar & Prashant Yadav</td>
    </tr>
    <tr>
      <td><strong>Statutory Grievance Officers</strong></td>
      <td>Prashant Yadav (New Delhi HQ) & Suraj Choudhary (Jaipur Operations)</td>
    </tr>
    <tr>
      <td><strong>Official Communication Channels</strong></td>
      <td>Email: <code>trycompanio@gmail.com</code> / <code>safety@getcompanio.in</code> | Emergency Line: <code>+91 91794 93270</code></td>
    </tr>
  </tbody>
</table>

<!-- ================= SECTION 2 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 02</div>
<h1>THE CORE THESIS: WHY THIS IDEA WORKS & GENERATES PROFIT</h1>

<h2>2.1 The Crisis of the "Internal Migrant" in Urban India</h2>
<p>India is experiencing an unprecedented rural-to-urban and Tier-2 to Tier-1 migration wave. Over <strong>600 million internal migrants</strong> reside within the country. High-growth technology, financial, and manufacturing hubs have concentrated tens of millions of unmarried, educated young adults into corporate clusters:</p>
<ul>
  <li><strong>Bengaluru:</strong> Koramangala, HSR Layout, Indiranagar, Bellandur, Whitefield.</li>
  <li><strong>Delhi NCR:</strong> Gurugram CyberHub, Golf Course Extension, Noida Sector 62.</li>
  <li><strong>Mumbai:</strong> Bandra-Kurla Complex (BKC), Powai, Lower Parel, Andheri West.</li>
  <li><strong>Hyderabad & Pune:</strong> HITEC City, Gachibowli, Hinjawadi, Viman Nagar.</li>
</ul>

<p>These individuals arrive without childhood friendship circles or family safety nets. They work demanding corporate schedules, reside in single-room rented accommodations or paying-guest (PG) hostels, and experience acute weekend isolation. Academic and market studies indicate that between <strong>43 percent and 58 percent</strong> of urban adults in Indian metros report persistent feelings of loneliness.</p>

<h2>2.2 Why Dating Apps Failed to Solve This Need</h2>
<p>For over a decade, young adults downloaded dating applications (Tinder, Bumble, Hinge) in an attempt to build a social circle. However, dating applications have failed to satisfy casual social needs due to four structural defects:</p>
<ol>
  <li><strong>The Romantic Mismatch:</strong> Dating apps carry an unavoidable expectation of romantic or sexual pursuit. Users seeking simple activity partners are subjected to unwanted romantic pressure.</li>
  <li><strong>The Swipe-and-Ghost Dynamic:</strong> Because swiping is frictionless and free, users accumulate hundreds of matches but lack the commitment to meet. Over 90 percent of matches never translate into a physical meeting.</li>
  <li><strong>Harassment of Female Users:</strong> Women on dating platforms face aggressive behavior, unsolicited explicit messages, and safety fears, resulting in high churn among female users.</li>
  <li><strong>The Exhaustion of Small Talk:</strong> Users spend days texting back and forth without ever leaving their rooms.</li>
</ol>

<h2>2.3 Why Transactional Platonic Presence Is Commercially Brilliant</h2>
<p>Companio succeeded by removing emotional ambiguity through an explicitly transactional model:</p>
<ul>
  <li><strong>Rejection Is Eliminated:</strong> The user does not need to worry about being attractive, charming, or romantically desirable. They are hiring a local companion for their time.</li>
  <li><strong>Guaranteed Attendance via Money:</strong> Because the companion earns 70 percent of the booking fee, they do not flake. Financial commitment guarantees physical presence.</li>
  <li><strong>Clear Boundaries:</strong> Because it is strictly platonic and public-only, both parties enter the meeting knowing exactly what is expected. There are no awkward dating expectations or post-meetup obligations.</li>
</ul>

<!-- ================= SECTION 3 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 03</div>
<h1>THE DUAL-DOMAIN DISCOVERY: TRYCOMPANIO VS. GETCOMPANIO</h1>

<h2>3.1 The Two Halves of the Business Ecosystem</h2>
<p>A critical discovery from our technical inspection is that the business operates across two distinct domains, each fulfilling a specialized operational purpose:</p>

<div class="exhibit-title">EXHIBIT 2: DUAL-DOMAIN ARCHITECTURAL MATRIX</div>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">OPERATIONAL PARAMETER</th>
      <th style="width: 37%;">TRYCOMPANIO (trycompanio.in)</th>
      <th style="width: 38%;">GETCOMPANIO (getcompanio.in)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Core Function</strong></td>
      <td><strong>The Showroom:</strong> Top-of-funnel marketing, search engine optimization (SEO), brand vision, and access pass sales.</td>
      <td><strong>The Engine Room:</strong> The interactive web app, unmasked companion listings, real-time WebSocket chat, and booking engine.</td>
    </tr>
    <tr>
      <td><strong>Visual Aesthetic</strong></td>
      <td>Dark, cinematic, high-end editorial serif typography (Fraunces + Inter), 3D Spline embeds, video backgrounds.</td>
      <td>Vibrant Neo-Brutalist design system (bold black borders, pastel color blocks in pink `#FF7AC6`, sky blue, lime, yellow).</td>
    </tr>
    <tr>
      <td><strong>Hosting & Network</strong></td>
      <td>Vercel Global Edge Network with Incremental Static Regeneration (ISR 300s).</td>
      <td>Vercel Serverless Edge + Dedicated API Cluster at <code>api.getcompanio.in</code>.</td>
    </tr>
    <tr>
      <td><strong>Chat Infrastructure</strong></td>
      <td>None (Informational only).</td>
      <td><strong>Live WebSockets:</strong> <code>wss://api.getcompanio.in</code>.</td>
    </tr>
    <tr>
      <td><strong>Payment Infrastructure</strong></td>
      <td><strong>Razorpay</strong> exclusively (selling access passes).</td>
      <td><strong>Dual Integration: Cashfree</strong> (escrow and instant UPI payouts) + <strong>Razorpay</strong>.</td>
    </tr>
    <tr>
      <td><strong>Asset CDN</strong></td>
      <td><code>cdn.trycompanio.in</code> + Vercel Blob Storage.</td>
      <td>Dedicated Image CDN: <code>https://img.getcompanio.in/</code>.</td>
    </tr>
    <tr>
      <td><strong>Mobile Strategy</strong></td>
      <td>Responsive web pages.</td>
      <td><strong>Progressive Web App (PWA):</strong> Web manifest, installable on mobile home screens.</td>
    </tr>
  </tbody>
</table>

<!-- ================= SECTION 4 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 04</div>
<h1>END-TO-END SYSTEM SEQUENCE: FROM INSTAGRAM REEL TO UPI PAYOUT</h1>

<h2>4.1 The Complete System Lifecycle</h2>
<p>Below is the verified end-to-end operational sequence tracing how an urban customer moves from initial social media awareness to physical meetup fulfillment and companion compensation:</p>

<div class="image-container">
  <img src="diagram-flow.png" alt="Complete System Sequence Diagram">
  <div class="image-caption">EXHIBIT 3: Complete Sequence Architecture: User Journey across Social, trycompanio.in, Payment Gateways, and getcompanio.in</div>
</div>

<h2>4.2 Step-by-Step Technical Execution</h2>
<ol>
  <li><strong>Top-of-Funnel Discovery:</strong> The prospective customer views an emotionally resonant short-form video Reel on Instagram posted by <code>@get_companio</code> highlighting the isolation of living in Bengaluru or Gurugram alone.</li>
  <li><strong>Traffic Ingestion:</strong> The user taps the link in the Instagram bio, containing custom UTM tracking parameters (<code>?utm_source=instagram&utm_medium=bio</code>) pointing to <code>trycompanio.in</code>.</li>
  <li><strong>Showroom Landing:</strong> <code>trycompanio.in</code> serves a high-speed cached landing page from Vercel Edge. The user sees the headline <em>"Never go alone"</em>, activity categories, and masked companion cards.</li>
  <li><strong>Pass Paywall Gate:</strong> The user attempts to view a full profile. The platform displays the Razorpay pass checkout modal. The user selects an access pass (e.g., 99.50 INR for 1 month) and pays via UPI.</li>
  <li><strong>Webhook Confirmation:</strong> Razorpay dispatches a secure server-to-server webhook confirming the transaction. The database updates the user's account with an active pass credential.</li>
  <li><strong>Handover to Operational App:</strong> The user is authenticated and transitioned into <code>getcompanio.in</code> (the active PWA platform).</li>
  <li><strong>Unmasked Directory Display:</strong> <code>getcompanio.in</code> queries <code>api.getcompanio.in</code> and renders unmasked companion cards (e.g., Vanshika in Delhi at 499 INR/hr, Kritika in Jaipur at 499 INR/hr).</li>
  <li><strong>Booking Submission:</strong> The customer selects a companion, chooses an activity (Café Chat), proposes a public commercial venue (e.g., Starbucks), selects a time (minimum 2 hours notice), and deposits the meetup fee into Cashfree escrow.</li>
  <li><strong>Companion Notification:</strong> The backend dispatches a real-time notification to the companion's dashboard.</li>
  <li><strong>Companion Acceptance (12-Hour SLA):</strong> The companion reviews the proposed public venue and accepts the booking.</li>
  <li><strong>WebSocket In-App Chat:</strong> The backend opens a secure WebSocket channel (<code>wss://api.getcompanio.in</code>). Both parties confirm table details without exchanging private phone numbers.</li>
  <li><strong>In-Person Meetup & PIN Code Handshake:</strong> Both parties meet at the public café. The customer reveals a private 4-digit code displayed on their phone. The companion enters this code into their dashboard.</li>
  <li><strong>Disbursement:</strong> The code verifies successful fulfillment. Cashfree releases 70 percent of the meetup fee directly to the companion's UPI bank account within 24 hours.</li>
</ol>

<!-- ================= SECTION 5 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 05</div>
<h1>SUBSCRIPTION TIERS & PAYWALL MECHANICS: 99.50 INR TO 999.50 INR</h1>

<h2>5.1 What Happens When a User Pays: Frontend vs. Backend</h2>
<p>To understand the platform's monetization engine, we analyzed what happens across the codebase when a customer purchases the minimum entry pass (99.50 INR) versus the maximum lifetime pass (999.50 INR):</p>

<div class="exhibit-title">EXHIBIT 4: PASS TIERS COMPARATIVE CODE LOGIC</div>
<table>
  <thead>
    <tr>
      <th>TIER NAME</th>
      <th>PRICE (INR)</th>
      <th>DURATION</th>
      <th>DATABASE RECORD (`passExpiryDate`)</th>
      <th>ACCESS BEHAVIOR AFTER EXPIRY</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1-Month Pass (Minimum)</strong></td>
      <td>99.50 INR</td>
      <td>30 Calendar Days</td>
      <td>Set to <code>current_timestamp + 30 days</code></td>
      <td>Profiles re-masked; booking button disabled. Past receipts remain viewable.</td>
    </tr>
    <tr>
      <td><strong>3-Month Pass</strong></td>
      <td>249.50 INR</td>
      <td>90 Calendar Days</td>
      <td>Set to <code>current_timestamp + 90 days</code></td>
      <td>Profiles re-masked; booking button disabled.</td>
    </tr>
    <tr>
      <td><strong>12-Month Pass</strong></td>
      <td>499.50 INR</td>
      <td>365 Calendar Days</td>
      <td>Set to <code>current_timestamp + 365 days</code></td>
      <td>Profiles re-masked; booking button disabled.</td>
    </tr>
    <tr>
      <td><strong>Lifetime Pass (Maximum)</strong></td>
      <td>999.50 INR</td>
      <td>Perpetual</td>
      <td>Set to <code>NULL</code> or year 2099 (Perpetual flag)</td>
      <td>Permanent unmasked access across all 126 cities. Never pay pass fee again.</td>
    </tr>
  </tbody>
</table>

<h2>5.2 Detailed Frontend and Backend Flow During Pass Purchase</h2>
<ul>
  <li><strong>Frontend Trigger:</strong> On <code>trycompanio.in/explore</code>, companion cards render in a masked state (last names truncated to *"Pat..."*, photographs slightly blurred, direct booking buttons replaced by *"Unlock Profile"*).</li>
  <li><strong>Modal Invocation:</strong> Clicking *"Unlock Profile"* opens the Razorpay Checkout component with four selectable radio options (99.50, 249.50, 499.50, 999.50 INR).</li>
  <li><strong>Backend API Call:</strong> The client triggers <code>POST /api/create-order</code>. The Next.js backend contacts Razorpay API to generate a cryptographically signed <code>order_id</code>.</li>
  <li><strong>Payment Execution:</strong> The user completes payment via UPI (PhonePe, Google Pay, Paytm) or card. Razorpay verifies the transaction and emits a success payload containing <code>razorpay_payment_id</code> and <code>razorpay_signature</code>.</li>
  <li><strong>Server-Side Verification:</strong> The client submits the signature to <code>POST /api/verify-pass</code>. The server verifies the HMAC-SHA256 signature against the Razorpay Secret Key.</li>
  <li><strong>Database Mutation:</strong> The user record updates: <code>isPassActive = true</code>, and <code>passTier = '1_MONTH'</code> (or <code>'LIFETIME'</code>).</li>
  <li><strong>Session Refresh & Unmasking:</strong> The JWT session cookie refreshes. The React state flips <code>isUnlocked = true</code>. All companion cards unmask: high-resolution photos, full bios, and the *"Request Meetup"* CTA become active.</li>
</ul>

<div class="warning-box">
  <strong>Critical Clarification on Pass vs. Meetup Fee:</strong> The pass fee grants access to the verified network and chat functionality; it <em>does not</em> pay for the companion's time. When booking a companion (e.g., Vanshika at 499 INR/hr), the member must pay the companion's hourly fee plus platform service charges separately into escrow.
</div>

<!-- ================= SECTION 6 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 06</div>
<h1>FRONTEND & BACKEND ARCHITECTURE: NEXT.JS, FIREBASE, CASHFREE & WEBSOCKETS</h1>

<h2>6.1 Production Technology Breakdown</h2>
<p>Deep-dive scraping of production script manifests, Content Security Policies, and network bundles confirms the exact modern technical stack:</p>

<div class="diagram-box">
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          COMPLETE PRODUCTION ARCHITECTURE                        │
├─────────────────┬────────────────────────────────────────────────┬───────────────┤
│ ARCHITECTURE    │ TECHNOLOGY EMPLOYED                            │ ROLE          │
├─────────────────┼────────────────────────────────────────────────┼───────────────┤
│ Client Frontend │ Next.js 15+ (React Server Components, App Dir) │ Web App / PWA │
│ UI Styling      │ Tailwind CSS + Lucide Vector Icons             │ Styling       │
│ Authentication  │ Google Firebase Auth (companio-3880a)          │ Identity      │
│ API Engine      │ Dedicated Node.js Cluster (api.getcompanio.in) │ Backend       │
│ Live Messaging  │ WebSockets (wss://api.getcompanio.in)          │ Real-Time Chat│
│ Image CDN       │ img.getcompanio.in                             │ Media Delivery│
│ Escrow & Payout │ Cashfree SDK (sdk.cashfree.com) + Razorpay     │ Payments      │
│ Edge & DNS      │ Cloudflare Anycast CDN (HTTP/3 QUIC)           │ Edge WAF      │
│ Telemetry       │ PostHog (us.i.posthog.com) + Sentry Ingest     │ Analytics     │
└─────────────────┴────────────────────────────────────────────────┴───────────────┘
</div>

<h2>6.2 Database Architecture Clues (Inferred from DOM State)</h2>
<p>From the Next.js production hydration state on companion pages, the companion data schema contains the following verified attributes:</p>
<ul>
  <li><code>id</code> (String): CUID unique identifier (e.g., <code>cmwi1spuf00g3sw7ye35ri7me</code>).</li>
  <li><code>userId</code> (String): Associated account reference.</li>
  <li><code>name</code> (String): Display name (e.g., "Vanshika", "Kritika Soni").</li>
  <li><code>gender</code> (Enum): <code>FEMALE</code> / <code>MALE</code>.</li>
  <li><code>age</code> (Integer): Verified age (e.g., 21, 22).</li>
  <li><code>hourlyRate</code> (Integer): Custom hourly rate in INR (e.g., 499).</li>
  <li><code>categories</code> (Array): Tags like <code>movie-buddy</code>, <code>study-buddy</code>, <code>coffee-chat</code>.</li>
  <li><code>languages</code> (Array): Languages spoken (e.g., English, Hindi, Rajasthani).</li>
  <li><code>photoVerified</code> (Boolean): Live face match confirmed.</li>
  <li><code>verified</code> (Boolean): Government ID structural check passed.</li>
  <li><code>womenOnly</code> (Boolean): Host restricts bookings to female members only.</li>
  <li><code>freeWeekend</code> / <code>freeToday</code> (Boolean): Availability flags.</li>
</ul>

<!-- ================= SECTION 7 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 07</div>
<h1>COMPLETE PAGE-BY-PAGE WORKFLOW & SCREEN BREAKDOWN</h1>

<h2>7.1 Comprehensive Screen Audit</h2>
<p>Below is the complete walkthrough of every core page across the platform, including captured visual evidence:</p>

<div class="image-container">
  <img src="screenshots/homepage.png" alt="Homepage Screenshot" style="max-height: 280px;">
  <div class="image-caption">EXHIBIT 5A: trycompanio.in Homepage — Dark Cinematic Aesthetic with Activity Selectors</div>
</div>

<div class="image-container">
  <img src="screenshots/safety.png" alt="Safety Page Screenshot" style="max-height: 280px;">
  <div class="image-caption">EXHIBIT 5B: Safety Centre — Outlining Platonic Commitments, ID Checks & In-App SOS</div>
</div>

<div class="image-container">
  <img src="screenshots/become-a-companion.png" alt="Host Onboarding Screenshot" style="max-height: 280px;">
  <div class="image-caption">EXHIBIT 5C: Companion Onboarding Portal — Earnings Simulator & Application Funnel</div>
</div>

<div class="image-container">
  <img src="screenshots/experience-coffee.png" alt="Experience Page Screenshot" style="max-height: 280px;">
  <div class="image-caption">EXHIBIT 5D: Experience Landing Page — Real Companion Cards across Indian Metros</div>
</div>

<!-- ================= SECTION 8 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 08</div>
<h1>CHATTING FLOW, SAFETY TELEMETRY & IN-PERSON HANDSHAKE MECHANICS</h1>

<h2>8.1 The In-App Chatting Flow</h2>
<p>To prevent harassment, stalking, and off-platform leakage prior to booking, the chatting architecture operates under strict state controls:</p>

<div class="diagram-box">
PRE-BOOKING STATE:
Customer browses companion profile -> Chat is LOCKED.
No direct messaging or contact exchange permitted.
                          │
                          ▼
BOOKING PROPOSAL STATE:
Customer deposits escrow fee -> Proposes public café & time.
Companion receives alert -> Reviews proposed venue.
                          │
                          ▼
ACCEPTANCE TRIGGER:
Companion taps "Accept Booking" in dashboard.
API initiates WebSocket connection (wss://api.getcompanio.in).
                          │
                          ▼
ACTIVE CHAT STATE:
Private chat opens -> Filtered for profanity and phone number patterns.
Parties coordinate table location (e.g. "Sitting near the glass window in blue shirt").
                          │
                          ▼
POST-MEETUP STATE:
Meetup completes -> 4-digit code entered -> Chat permanently archives after 24 hours.
</div>

<h2>8.2 In-Person PIN Code Handshake & Cashfree Settlement</h2>
<ul>
  <li>When the customer arrives at the venue, their screen displays a randomized <strong>4-digit numeric code</strong> (e.g., <code>7429</code>).</li>
  <li>The customer verifies that the companion physically matches their profile photo and feels comfortable.</li>
  <li>The customer shares the 4-digit code with the companion.</li>
  <li>The companion enters the code on their device, which issues a signed request to <code>api.getcompanio.in/complete-booking</code>.</li>
  <li>The backend signals the Cashfree Escrow service, transferring 70 percent of the meetup funds to the companion's wallet balance.</li>
  <li>Companions can withdraw funds from their wallet to any UPI ID once their balance reaches the <strong>500 INR minimum withdrawal threshold</strong>.</li>
</ul>

<!-- ================= SECTION 9 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 09</div>
<h1>FINANCIAL WATERFALL: HOW THE PLATFORM MAKES MONEY</h1>

<h2>9.1 The Real Transaction Math: The "706 INR" Teardown</h2>
<p>On production profile pages (e.g., Vanshika in Delhi), the companion's stated rate is <strong>499 INR per hour</strong>, but the customer is charged <strong>706 INR total for 1 hour</strong>. Below is the exact financial breakdown reverse-engineered from production checkout data:</p>

<div class="exhibit-title">EXHIBIT 6: EXACT PRICING WATERFALL PER 1-HOUR BOOKING</div>
<table>
  <thead>
    <tr>
      <th>FINANCIAL COMPONENT</th>
      <th style="text-align: right;">AMOUNT (INR)</th>
      <th>PERCENTAGE / FORMULA</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Companion Stated Hourly Rate</td>
      <td style="text-align: right;">499.00 INR</td>
      <td>Base host fee (100% of stated rate)</td>
    </tr>
    <tr>
      <td>Platform Service Fee Markup</td>
      <td style="text-align: right;">175.42 INR</td>
      <td>~35.15% platform convenience fee</td>
    </tr>
    <tr>
      <td>Goods & Services Tax (GST @ 18% on platform fee)</td>
      <td style="text-align: right;">31.58 INR</td>
      <td>18% statutory tax on service markup</td>
    </tr>
    <tr style="font-weight: 700; background-color: #E2E8F0;">
      <td>TOTAL BILLED TO CUSTOMER</td>
      <td style="text-align: right;">706.00 INR</td>
      <td>Total displayed on production booking button</td>
    </tr>
    <tr>
      <td>Companion Payout Share (Paid via UPI)</td>
      <td style="text-align: right;">-499.00 INR</td>
      <td>Host receives 100% of their stated hourly rate</td>
    </tr>
    <tr>
      <td>Payment Gateway Processing Cost (~2% Cashfree)</td>
      <td style="text-align: right;">-14.12 INR</td>
      <td>Transaction cost deducted by gateway</td>
    </tr>
    <tr style="font-weight: 700; background-color: #D1FAE5; color: #065F46;">
      <td>NET PLATFORM PROFIT PER 1-HOUR BOOKING</td>
      <td style="text-align: right;">161.30 INR</td>
      <td>Pure net margin earned on zero inventory</td>
    </tr>
  </tbody>
</table>

<h2>9.2 Additional Profit Engines</h2>
<ol>
  <li><strong>Pass Sales:</strong> Customers pay 99.50 to 999.50 INR upfront before ever booking. Many users purchase a pass out of curiosity but never complete a booking, delivering near 100% gross margin cash flow.</li>
  <li><strong>Host Onboarding Fees:</strong> Prospective companions pay a non-refundable 99.50 INR fee to submit their ID for review.</li>
  <li><strong>Wallet Cashout Arbitrage:</strong> Cancelled bookings convert into wallet credits. If a user withdraws cash back to their bank rather than re-booking, the platform charges a <strong>12 percent withdrawal fee</strong>.</li>
  <li><strong>Unclaimed Balances (Float):</strong> Expired or abandoned wallet balances remain in the company's escrow bank accounts.</li>
</ol>

<!-- ================= SECTION 10 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 10</div>
<h1>PROS, CONS, LOOPHOLES & BUSINESS MODEL VULNERABILITIES</h1>

<h2>10.1 Platform Pros (Why It Works Well)</h2>
<ul>
  <li><strong>High Cultural Clarity:</strong> The uncompromising anti-dating positioning protects the platform from legal and social condemnation.</li>
  <li><strong>Negative Working Capital:</strong> Customers pay pass fees and escrow deposits upfront, giving the company strong operating cash flow.</li>
  <li><strong>Zero Inventory Liability:</strong> The platform owns no physical spaces and employs no staff companions; hosts are independent contractors.</li>
  <li><strong>Programmatic Organic SEO:</strong> 66 indexed city pages generate steady organic discovery without relying entirely on paid ad spend.</li>
</ul>

<h2>10.2 Critical Loopholes and Vulnerabilities</h2>
<div class="exhibit-title">EXHIBIT 7: STRUCTURAL VULNERABILITY AUDIT</div>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">VULNERABILITY</th>
      <th style="width: 40%;">DESCRIPTION OF FLAW</th>
      <th style="width: 35%;">BUSINESS RISK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Off-Platform Leakage</strong></td>
      <td>Once a member and companion meet in person and establish trust, they exchange phone numbers.</td>
      <td>Future meetups happen directly for cash/UPI; platform loses recurring revenue after CAC is spent.</td>
    </tr>
    <tr>
      <td><strong>2. 12-Hour Confirmation Lag</strong></td>
      <td>Companions have up to 12 daylight hours to accept or decline booking requests.</td>
      <td>Loses spontaneous, on-demand urban demand (e.g. "I want coffee right now").</td>
    </tr>
    <tr>
      <td><strong>3. Host Onboarding Friction</strong></td>
      <td>Charging prospective hosts 99.50 INR upfront to apply.</td>
      <td>Suppresses supply liquidity, particularly among college students and fitness trainers.</td>
    </tr>
    <tr>
      <td><strong>4. Manual KYC Review</strong></td>
      <td>Human staff manually inspect uploaded Aadhaar images (up to 48 hours).</td>
      <td>Scaling bottleneck; does not verify live UIDAI biometric or OTP records.</td>
    </tr>
    <tr>
      <td><strong>5. Web-Only Limitations</strong></td>
      <td>No native iOS/Android mobile apps in app stores.</td>
      <td>Missing background push alerts, no lock-screen emergency SOS, browser session timeouts.</td>
    </tr>
  </tbody>
</table>

<!-- ================= SECTION 11 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 11</div>
<h1>THE COMPETITOR LANDSCAPE: DIRECT PLATFORMS VS. INDIRECT SUBSTITUTES</h1>

<div class="exhibit-title">EXHIBIT 8: COMPETITIVE LANDSCAPE MATRIX</div>
<table>
  <thead>
    <tr>
      <th>COMPETITOR</th>
      <th>MODEL TYPE</th>
      <th>PRICING</th>
      <th>STRENGTHS</th>
      <th>PRIMARY WEAKNESS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>TryCompanio / GetCompanio</strong></td>
      <td>Pass + Hourly Escrow</td>
      <td>99.50 pass + 499/hr</td>
      <td>Strict platonic promise, programmatic SEO, dual payment gateways.</td>
      <td>No native app, 12-hr lag, off-platform leakage.</td>
    </tr>
    <tr>
      <td><strong>KoPartner</strong></td>
      <td>Advance Fee + Hourly Concierge</td>
      <td>1,000 to 2,000 INR/hr</td>
      <td>Covers senior care and medical accompaniment.</td>
      <td>Prohibitively expensive for youth; dated website UX.</td>
    </tr>
    <tr>
      <td><strong>PlusOneStar</strong></td>
      <td>Zero-Custody P2P</td>
      <td>Free access (Peer agreed rate)</td>
      <td>3D biometric liveness KYC, 0% platform commission.</td>
      <td>No escrow dispute mediation; weak monetization runway.</td>
    </tr>
    <tr>
      <td><strong>RentalFriend India</strong></td>
      <td>Packaged Duration Plans</td>
      <td>299 INR (3 hrs)</td>
      <td>Low cost accessible to students.</td>
      <td>Low companion payouts cause chronic cancellations.</td>
    </tr>
    <tr>
      <td><strong>Timeleft</strong></td>
      <td>Group Dinner Tickets</td>
      <td>400-999 ticket + meal</td>
      <td>Matches 6 strangers for dinner; zero 1-on-1 pressure.</td>
      <td>Restricted to Wednesday group dinners only.</td>
    </tr>
    <tr>
      <td><strong>Bumble BFF</strong></td>
      <td>Freemium Dating App Mode</td>
      <td>Free / 499-1,499 sub</td>
      <td>Massive global brand trust and active user base.</td>
      <td>Severe swipe fatigue; 90%+ conversations ghost.</td>
    </tr>
  </tbody>
</table>

<!-- ================= SECTION 12 ================= -->
<div class="page-break"></div>
<div class="section-label">SECTION 12</div>
<h1>THE SUPERIOR CHALLENGER BLUEPRINT: 'TRIBO' ARCHITECTURE & MVP PLAN</h1>

<h2>12.1 The Concept: "Tribo"</h2>
<p>We propose developing <strong>Tribo</strong>, positioned as <strong>"India's On-Demand Real-Life Social & Activity Network."</strong> It solves TryCompanio's six biggest structural flaws through six concrete architectural leapfrogs:</p>

<div class="exhibit-title">EXHIBIT 9: TRIBO LEAPFROG SPECIFICATION</div>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">FEATURE</th>
      <th style="width: 35%;">TRYCOMPANIO (INCUMBENT)</th>
      <th style="width: 40%;">TRIBO (PROPOSED LEAPFROG)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Host Onboarding</strong></td>
      <td>99.50 INR upfront application fee.</td>
      <td><strong>100% Free; Platform absorbs 15 INR e-KYC fee as CAC.</strong></td>
    </tr>
    <tr>
      <td><strong>KYC Verification</strong></td>
      <td>Up to 48 hours (Manual human review).</td>
      <td><strong>Under 60 Seconds (Automated DigiLocker Aadhaar OTP).</strong></td>
    </tr>
    <tr>
      <td><strong>Discovery Mode</strong></td>
      <td>Static filtered directory list.</td>
      <td><strong>Live Radial Companion Radar (<3 km radius) for spontaneous meets.</strong></td>
    </tr>
    <tr>
      <td><strong>Social Format</strong></td>
      <td>1-on-1 private meetups only.</td>
      <td><strong>1-on-1 Meetups + Curated 4-Person Activity Pods (Lowers anxiety).</strong></td>
    </tr>
    <tr>
      <td><strong>Pre-Meetup Check</strong></td>
      <td>Static photographs only.</td>
      <td><strong>60-Second In-App WebRTC Video Icebreaker.</strong></td>
    </tr>
    <tr>
      <td><strong>Anti-Leakage Engine</strong></td>
      <td>None (Users transact off-platform).</td>
      <td><strong>Partner Venue QR Codes (15% off café bill) + Karma Points.</strong></td>
    </tr>
  </tbody>
</table>

<h2>12.2 Estimated MVP Development Budget & Capital Requirements</h2>

<div class="exhibit-title">EXHIBIT 10: ESTIMATED 6-MONTH MVP CAPITAL BUDGET (INR)</div>
<table>
  <thead>
    <tr>
      <th>EXPENDITURE LINE ITEM</th>
      <th>RESOURCE ALLOCATION</th>
      <th style="text-align: right;">ESTIMATED COST (INR)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2 Senior Flutter Engineers (iOS & Android)</td>
      <td>6 Months @ 1,50,000 INR / month each</td>
      <td style="text-align: right;">18,00,000 INR</td>
    </tr>
    <tr>
      <td>1 Backend & Cloud DevOps Engineer</td>
      <td>6 Months @ 1,50,000 INR / month</td>
      <td style="text-align: right;">9,00,000 INR</td>
    </tr>
    <tr>
      <td>1 UI/UX Product Designer</td>
      <td>Contract Design Lead (2 Months)</td>
      <td style="text-align: right;">3,00,000 INR</td>
    </tr>
    <tr>
      <td>DigiLocker / Cashfree KYC Verification API</td>
      <td>5,000 automated verifications @ 15 INR</td>
      <td style="text-align: right;">75,000 INR</td>
    </tr>
    <tr>
      <td>AWS Cloud Infrastructure & Database</td>
      <td>6 Months @ 20,000 INR / month</td>
      <td style="text-align: right;">1,20,000 INR</td>
    </tr>
    <tr>
      <td>Legal Incorporation, DPDPA Audit & Escrow Setup</td>
      <td>Statutory counsel & payment aggregator bonding</td>
      <td style="text-align: right;">2,00,000 INR</td>
    </tr>
    <tr>
      <td>Hyper-Local Launch Marketing (Bengaluru Pilot)</td>
      <td>Short-form creator partnerships (3 Months)</td>
      <td style="text-align: right;">6,00,000 INR</td>
    </tr>
    <tr style="font-weight: 700; background-color: #D1FAE5; color: #065F46;">
      <td>TOTAL ESTIMATED SEED CAPITAL TO LAUNCH MVP</td>
      <td>6-Month Runway to Product-Market Fit</td>
      <td style="text-align: right;">39,95,000 INR (~$48,000 USD)</td>
    </tr>
  </tbody>
</table>

<h2>12.3 Strategic Verdict</h2>
<p>TryCompanio and GetCompanio have pioneered and validated a lucrative social category in India. By separating their operations into a marketing/SEO machine (TryCompanio) and a real-time web application (GetCompanio), they established early profitability. However, their reliance on mobile web, 12-hour booking delays, upfront host application fees, and vulnerability to platform leakage leave an immediate opportunity for a superior competitor. By executing <strong>Tribo</strong> with <strong>zero-fee onboarding, automated 60-second DigiLocker e-KYC, small-group activity pods, live radar, and partner café discounts</strong>, a challenger startup can capture the dominant market position in India's emerging $7.9 billion companionship market.</p>

<div class="callout-box" style="text-align: center; margin-top: 30px;">
  <strong>END OF MASTER STRATEGIC WHITEPAPER</strong><br>
  Compiled by Autonomous Senior Startup Strategy & Product Architecture Consortium &bull; November 2026
</div>

</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Master HTML source written to: {HTML_PATH}")

# Compile HTML to Master PDF using Chrome Headless
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
tmp_dir = os.environ.get("TEMP", r"C:\Users\Dell\AppData\Local\Temp")
user_data_dir = os.path.join(tmp_dir, "chrome_master_whitepaper_rnd")

cmd = [
    chrome_path,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    f"--user-data-dir={user_data_dir}",
    f"--print-to-pdf={PDF_PATH}",
    HTML_PATH
]

print("Executing Chrome headless Master PDF compilation...")
result = subprocess.run(cmd, capture_output=True, text=True)

if os.path.exists(PDF_PATH):
    size = os.path.getsize(PDF_PATH)
    print(f"Master PDF compiled successfully: {PDF_PATH} ({size:,} bytes)")
    shutil.copy2(PDF_PATH, ROOT_PDF_PATH)
    print(f"Copied Master PDF to root: {ROOT_PDF_PATH}")
else:
    print(f"PDF compilation failed: {result.stderr}")
