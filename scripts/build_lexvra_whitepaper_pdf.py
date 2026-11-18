import os
import subprocess
import shutil

BASE_DIR = r"C:\Users\Dell\Documents\codes\trycompanio"
PDF_DIR = os.path.join(BASE_DIR, "WHITEPAPER-DOSSIER", "07-PDF-WHITEPAPER")
SCREENSHOTS_DIR = os.path.join(PDF_DIR, "screenshots")

HTML_OUTPUT_PATH = os.path.join(PDF_DIR, "lexvra-master-breakdown.html")
PDF_OUTPUT_PATH = os.path.join(PDF_DIR, "LEXVRA-COMPANIO-PRODUCT-BREAKDOWN.pdf")
ROOT_CLIENT_PDF = os.path.join(BASE_DIR, "TRYCOMPANIO-CLIENT-EXECUTIVE-WHITEPAPER.pdf")
ROOT_ALL_IN_ONE_PDF = os.path.join(BASE_DIR, "TRYCOMPANIO-ALL-IN-ONE-WHITEPAPER.pdf")

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Companio Platform: Complete Product Architecture, Page-by-Page Audit & Revenue Engine</title>
<style>
  @page {
    size: A4;
    margin: 18mm 14mm 18mm 14mm;
    @bottom-right {
      content: "Page " counter(page);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 8pt;
      color: #627D98;
      font-weight: 600;
    }
    @bottom-left {
      content: "LEXVRA | PRODUCT ARCHITECTURE & OPERATIONAL INTELLIGENCE";
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 8pt;
      color: #627D98;
      letter-spacing: 0.8px;
      font-weight: 600;
    }
  }

  body {
    font-family: 'Georgia', 'Cambria', 'Times New Roman', serif;
    font-size: 9.5pt;
    line-height: 1.5;
    color: #102A43;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
  }

  /* Fixed Watermark across all pages */
  .watermark {
    position: fixed;
    top: 42%;
    left: 12%;
    transform: rotate(-32deg);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 88pt;
    font-weight: 900;
    color: #0F2B48;
    opacity: 0.045;
    letter-spacing: 18px;
    pointer-events: none;
    z-index: 9999;
    text-transform: uppercase;
  }

  h1, h2, h3, h4 {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #0F2B48;
    font-weight: 700;
    margin-top: 1.4em;
    margin-bottom: 0.4em;
    page-break-after: avoid;
  }

  h1 {
    font-size: 20pt;
    line-height: 1.2;
    border-bottom: 2px solid #0F2B48;
    padding-bottom: 5px;
    margin-top: 0;
    letter-spacing: -0.3px;
  }

  h2 {
    font-size: 13.5pt;
    line-height: 1.25;
    border-bottom: 1px solid #CBD2D9;
    padding-bottom: 4px;
    margin-top: 1.5em;
  }

  h3 {
    font-size: 11pt;
    line-height: 1.3;
    color: #1F3A52;
    margin-top: 1.1em;
  }

  h4 {
    font-size: 9pt;
    color: #334E68;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.9em;
  }

  p {
    margin: 0.5em 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0.5em 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 0.35em;
  }

  strong {
    color: #0F2B48;
  }

  .page-break {
    page-break-after: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }

  /* Cover Page */
  .cover-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    box-sizing: border-box;
    padding-top: 25px;
  }

  .cover-header {
    border-bottom: 3px solid #0F2B48;
    padding-bottom: 15px;
  }

  .cover-tag {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #2B6CB0;
    margin-bottom: 10px;
  }

  .cover-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 26pt;
    font-weight: 800;
    line-height: 1.15;
    color: #0F2B48;
    margin: 0 0 10px 0;
  }

  .cover-subtitle {
    font-family: 'Georgia', serif;
    font-size: 12.5pt;
    line-height: 1.45;
    color: #334E68;
    font-style: italic;
    margin: 0;
  }

  .cover-metadata {
    margin-top: 25px;
    border-top: 1px solid #DCEEFB;
    padding-top: 15px;
  }

  .meta-grid {
    display: table;
    width: 100%;
    margin-top: 8px;
  }

  .meta-row {
    display: table-row;
  }

  .meta-label {
    display: table-cell;
    width: 25%;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    color: #486581;
    padding: 5px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .meta-value {
    display: table-cell;
    width: 75%;
    font-size: 9pt;
    color: #102A43;
    padding: 5px 0;
  }

  .cover-abstract {
    background: #F0F4F8;
    border-left: 4px solid #0F2B48;
    padding: 16px 20px;
    margin: 25px 0;
  }

  .cover-abstract h4 {
    margin-top: 0;
    color: #0F2B48;
    font-size: 9pt;
    letter-spacing: 1px;
  }

  .cover-abstract p {
    font-size: 9pt;
    line-height: 1.5;
    color: #243B53;
    margin-bottom: 0;
  }

  .cover-footer {
    border-top: 1px solid #CBD2D9;
    padding-top: 12px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8pt;
    color: #627D98;
    display: flex;
    justify-content: space-between;
  }

  /* Notice & Alert Boxes */
  .callout {
    background-color: #F8FAFC;
    border: 1px solid #DCEEFB;
    border-left: 4px solid #2B6CB0;
    padding: 10px 14px;
    margin: 12px 0;
    page-break-inside: avoid;
  }

  .callout-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9pt;
    font-weight: 700;
    color: #102A43;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .callout-body {
    font-size: 9pt;
    color: #243B53;
    margin: 0;
  }

  .highlight-box {
    background-color: #F0FFF4;
    border: 1px solid #C6F6D5;
    border-left: 4px solid #38A169;
    padding: 10px 14px;
    margin: 12px 0;
    page-break-inside: avoid;
  }

  .highlight-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9pt;
    font-weight: 700;
    color: #22543D;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .highlight-body {
    font-size: 9pt;
    color: #276749;
    margin: 0;
  }

  .warning-box {
    background-color: #FFFDF5;
    border: 1px solid #F6E05E;
    border-left: 4px solid #D69E2E;
    padding: 10px 14px;
    margin: 12px 0;
    page-break-inside: avoid;
  }

  .warning-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9pt;
    font-weight: 700;
    color: #744210;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .warning-body {
    font-size: 9pt;
    color: #5F370E;
    margin: 0;
  }

  /* Data Tables */
  .table-container {
    width: 100%;
    margin: 12px 0;
    page-break-inside: avoid;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    line-height: 1.35;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }

  .data-table th {
    background-color: #0F2B48;
    color: #FFFFFF;
    font-weight: 700;
    text-align: left;
    padding: 6px 9px;
    border: 1px solid #0F2B48;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 7.5pt;
  }

  .data-table td {
    padding: 5px 9px;
    border: 1px solid #DCEEFB;
    color: #102A43;
    vertical-align: top;
  }

  .data-table tr.even-row {
    background-color: #F8FAFC;
  }

  /* KPI Summary Grids */
  .kpi-grid {
    display: table;
    width: 100%;
    margin: 12px 0;
    page-break-inside: avoid;
  }

  .kpi-row {
    display: table-row;
  }

  .kpi-card {
    display: table-cell;
    background-color: #F8FAFC;
    border: 1px solid #DCEEFB;
    padding: 10px 12px;
    text-align: center;
    width: 25%;
  }

  .kpi-value {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 14pt;
    font-weight: 800;
    color: #0F2B48;
    margin-bottom: 2px;
  }

  .kpi-label {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 7pt;
    font-weight: 700;
    color: #486581;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .kpi-subtext {
    font-size: 7pt;
    color: #627D98;
    margin-top: 2px;
  }

  /* Image Containers */
  .figure-container {
    margin: 14px 0;
    text-align: center;
    page-break-inside: avoid;
  }

  .figure-img {
    max-width: 100%;
    height: auto;
    border: 1px solid #CBD2D9;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .figure-caption {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8pt;
    color: #486581;
    margin-top: 5px;
    font-style: italic;
  }

  /* Step by Step Visual Flowchart Box */
  .flow-step-grid {
    display: table;
    width: 100%;
    margin: 12px 0;
    page-break-inside: avoid;
  }

  .flow-step-row {
    display: table-row;
  }

  .flow-step-cell {
    display: table-cell;
    width: 25%;
    padding: 6px;
    vertical-align: top;
  }

  .flow-box {
    background: #FFFFFF;
    border: 1px solid #CBD2D9;
    border-top: 3px solid #2B6CB0;
    padding: 8px 10px;
    min-height: 100px;
    border-radius: 2px;
  }

  .flow-num {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 7.5pt;
    font-weight: 800;
    color: #2B6CB0;
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  .flow-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    color: #0F2B48;
    margin-bottom: 4px;
  }

  .flow-desc {
    font-size: 7.5pt;
    line-height: 1.35;
    color: #334E68;
    margin: 0;
  }

  /* Page Audit Card */
  .audit-card {
    background: #FFFFFF;
    border: 1px solid #DCEEFB;
    border-radius: 3px;
    margin: 12px 0;
    padding: 10px 14px;
    page-break-inside: avoid;
  }

  .audit-header {
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 6px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .audit-url {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
    font-weight: 700;
    color: #2B6CB0;
  }

  .audit-purpose {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 8pt;
    font-weight: 700;
    color: #486581;
    text-transform: uppercase;
  }

  .audit-grid {
    display: table;
    width: 100%;
  }

  .audit-col-left {
    display: table-cell;
    width: 48%;
    vertical-align: top;
    padding-right: 12px;
  }

  .audit-col-right {
    display: table-cell;
    width: 52%;
    vertical-align: top;
    border-left: 1px solid #E2E8F0;
    padding-left: 12px;
  }

  .audit-tag {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 7.5pt;
    font-weight: 700;
    color: #0F2B48;
    text-transform: uppercase;
    margin-bottom: 3px;
    letter-spacing: 0.5px;
  }

  .btn-item {
    font-size: 8pt;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #102A43;
    margin-bottom: 4px;
    line-height: 1.35;
  }

  .btn-name {
    font-weight: 700;
    color: #2B6CB0;
  }

  /* Table of Contents */
  .toc {
    background: #FAFCFF;
    border: 1px solid #DCEEFB;
    padding: 16px 20px;
    margin: 15px 0 22px 0;
    page-break-after: always;
  }

  .toc-title {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 13pt;
    font-weight: 700;
    color: #0F2B48;
    border-bottom: 2px solid #0F2B48;
    padding-bottom: 6px;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .toc-item {
    display: flex;
    justify-content: space-between;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 9pt;
    margin-bottom: 6px;
    border-bottom: 1px dotted #CBD2D9;
    padding-bottom: 2px;
  }

  .toc-unit {
    font-weight: 700;
    color: #0F2B48;
  }

  .toc-page {
    color: #627D98;
    font-weight: 600;
  }
</style>
</head>
<body>

<!-- WATERMARK -->
<div class="watermark">LEXVRA</div>

<!-- ========================================== -->
<!-- COVER PAGE                                 -->
<!-- ========================================== -->
<div class="cover-page">
  <div class="cover-header">
    <div class="cover-tag">LEXVRA PRODUCT & BUSINESS INTELLIGENCE</div>
    <h1 class="cover-title">THE COMPANIO PLATFORM</h1>
    <div class="cover-subtitle">Complete Operational Architecture, Dual-Site Mechanics, Page-by-Page Button Audit, WebSocket Chat Protocols, and the Revenue Engine</div>
  </div>

  <div class="cover-abstract">
    <h4>SYSTEM ARCHITECTURE & PRODUCT OVERVIEW</h4>
    <p>
      An empirical, technical deconstruction of the on-demand platonic companionship ecosystem operating via <strong>trycompanio.in</strong> and <strong>getcompanio.in</strong>. This dossier analyzes why the model thrives in India's metropolitan hubs, breaks down the user experience before and after payment, audits every primary screen and clickable element, explains the real-time WebSocket chat and 4-digit physical handshake protocols, and reveals the high-margin revenue model that powers the business.
    </p>
  </div>

  <div class="cover-metadata">
    <div class="meta-grid">
      <div class="meta-row">
        <div class="meta-label">Primary Entity</div>
        <div class="meta-value">TRYCOMPANIOLABS LLP (LLPIN: ACY-1464 | RoC Delhi, Ministry of Corporate Affairs)</div>
      </div>
      <div class="meta-row">
        <div class="meta-label">Operating Domains</div>
        <div class="meta-value">trycompanio.in (Marketing, SEO & Paywall) | getcompanio.in (Live PWA, Chat & Escrow)</div>
      </div>
      <div class="meta-row">
        <div class="meta-label">Business Model</div>
        <div class="meta-value">Platonic On-Demand Social Companionship for Public Activities (Cafes, Walks, Events)</div>
      </div>
      <div class="meta-row">
        <div class="meta-label">Key Financials</div>
        <div class="meta-value">INR 706.00/Hour Gross Member Charge | 22.5% Net Platform Take | Upfront Access Passes</div>
      </div>
      <div class="meta-row">
        <div class="meta-label">Intelligence Scope</div>
        <div class="meta-value">Complete Page-by-Page Button Audit, Real-Time WebSocket Messaging & Cashfree Escrow Payouts</div>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <span>Document Ref: LEXVRA-COMPANIO-AUDIT</span>
    <span>Operational Blueprint & Product Flow</span>
  </div>
</div>

<!-- ========================================== -->
<!-- TABLE OF CONTENTS                          -->
<!-- ========================================== -->
<div class="toc">
  <div class="toc-title">Document Navigation Index</div>
  <div class="toc-item"><span class="toc-unit">UNIT 1: The Core Concept — The Real Idea & Why It Works</span><span class="toc-page">Unit 1</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 2: The Two Platforms — trycompanio.in vs getcompanio.in</span><span class="toc-page">Unit 2</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 3: Complete End-to-End System Flow & Sequence Diagram</span><span class="toc-page">Unit 3</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 4: What Happens After You Pay — The Access Pass Deep Dive</span><span class="toc-page">Unit 4</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 5: Real-Time Chat & WebSockets — Messaging, Filters & Security</span><span class="toc-page">Unit 5</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 6: The Physical Meeting & 4-Digit PIN Handshake Protocol</span><span class="toc-page">Unit 6</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 7: The Revenue Engine — How the Business Prints High Profits</span><span class="toc-page">Unit 7</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 8: Complete Page-by-Page Audit & Interactive Button Flows</span><span class="toc-page">Unit 8</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 9: Visual Screen Exhibits & Production Interface Audit</span><span class="toc-page">Unit 9</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 10: Critical Loopholes & Strategic Flaws in the Ecosystem</span><span class="toc-page">Unit 10</span></div>
  <div class="toc-item"><span class="toc-unit">UNIT 11: Executive Architecture Summary & Key Takeaways</span><span class="toc-page">Unit 11</span></div>
</div>

<!-- ========================================== -->
<!-- UNIT 1: THE CORE CONCEPT                   -->
<!-- ========================================== -->
<h1>UNIT 1: The Core Concept — The Real Idea & Why It Works</h1>

<h2>1.1 What is Companio in Simple Words?</h2>
<p>
  Companio is an on-demand marketplace that lets people rent another person's time for strictly platonic, friendly, public activities. Think of it as <em>"Uber for social company"</em>. If someone wants to visit a specialty cafe, explore a museum, watch a movie, or attend a music gig on a weekend, but has no friends free to join, they hire a verified companion to accompany them.
</p>
<p>
  <strong>There is zero dating, zero romance, and zero physical intimacy.</strong> Both sides agree upfront: this is a paid commercial booking for friendly conversation in a public venue.
</p>

<h2>1.2 Why is this Idea Booming in India?</h2>
<p>
  Three huge shifts in urban Indian society make this a rapidly growing, highly lucrative market:
</p>
<ul>
  <li><strong>600 Million Migrants:</strong> Millions of young professionals leave their hometowns for jobs in Bengaluru, Mumbai, Gurgaon, Hyderabad, and Pune. Separated from family and childhood friends, they face acute social isolation.</li>
  <li><strong>Dating Apps Have Failed Normal People:</strong> Apps like Tinder and Bumble cause severe fatigue. Users face endless swiping, ghosting, performance anxiety, and 90/10 gender imbalances. If someone simply wants a pleasant chat over coffee, dating apps are too stressful.</li>
  <li><strong>The Loneliness Crisis:</strong> The WHO classified loneliness as a serious global health threat. In India, people hesitate to see a therapist for loneliness, but they readily pay an affordable fee for an afternoon of warm human conversation.</li>
</ul>

<div class="highlight-box">
  <div class="highlight-title">WHY THE BUSINESS MODEL WORKS</div>
  <div class="highlight-body">
    It replaces romantic pressure with <strong>transactional certainty</strong>. The user does not need to charm or impress anyone. The meeting is pre-paid, time-bound, respectful, and safe.
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 2: THE TWO PLATFORMS                  -->
<!-- ========================================== -->
<h1>UNIT 2: The Two Platforms — trycompanio.in vs getcompanio.in</h1>

<h2>2.1 Why Two Separate Websites?</h2>
<p>
  Companio runs on two separate web platforms with completely different jobs:
</p>
<ol>
  <li><strong>The Showroom (trycompanio.in):</strong> The public marketing website. Dark, cinematic design. It hosts landing pages, trust policies, FAQs, and 66 automated city pages (like <code>/city/delhi</code>) to capture Google search traffic. Its primary goal is selling the <strong>Access Pass</strong> via Razorpay.</li>
  <li><strong>The Engine Room (getcompanio.in):</strong> The live operating app. Vibrant Neo-Brutalist design (pink <code>#FF7AC6</code>, sky blue, lime green). This is a Progressive Web App (PWA) where members log in with mobile OTP, browse unblurred companion cards, send booking requests, chat via WebSockets, and process escrow payouts.</li>
</ol>

<h2>2.2 Direct Comparison Table</h2>

<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 20%;">Dimension</th>
        <th style="width: 40%;">trycompanio.in (The Showroom)</th>
        <th style="width: 40%;">getcompanio.in (The Engine Room)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Core Purpose</strong></td>
        <td>SEO traffic capture, customer education, and selling upfront Access Passes.</td>
        <td>Live dashboard, unblurred companion cards, booking requests, chat, and payments.</td>
      </tr>
      <tr class="even-row">
        <td><strong>Visual Style</strong></td>
        <td>Dark cinematic luxury theme, serif typography, high-contrast emotional visuals.</td>
        <td>Vibrant Neo-Brutalist UI: high-contrast pastels, bold badges, clean app controls.</td>
      </tr>
      <tr>
        <td><strong>Profile Privacy</strong></td>
        <td>Public preview. Photos are heavily blurred to trigger pass purchases.</td>
        <td>Gated behind mobile login. Photos are crystal clear with full bios and ratings.</td>
      </tr>
      <tr class="even-row">
        <td><strong>Payment Gateway</strong></td>
        <td>Razorpay Checkout (powers upfront purchases of 1-Month to Lifetime Passes).</td>
        <td>Cashfree Payments + Razorpay (powers per-hour booking escrow and host UPI payouts).</td>
      </tr>
      <tr>
        <td><strong>Legal Attribution</strong></td>
        <td>TRYCOMPANIOLABS LLP (Registered in Okhla Phase-I, New Delhi).</td>
        <td>Companio Labs Operations Hub (Jaipur, Rajasthan; Grievance Officer: Suraj Choudhary).</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>2.3 The Business Advantages of this Separation</h2>
<ul>
  <li><strong>Fast & Unbreakable SEO:</strong> The marketing site is static and lightning-fast. It ranks cleanly on Google across dozens of cities without placing any load on the live database.</li>
  <li><strong>Bypassing App Store Taxes:</strong> Operating as a web PWA instead of an iOS or Android app avoids Apple and Google's 30% store commission, keeping 100% of the revenue.</li>
  <li><strong>Payment Account Redundancy:</strong> Indian gateways frequently audit social platforms. Splitting passes (Razorpay) from escrow payouts (Cashfree) protects the company from getting frozen.</li>
</ul>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 3: SYSTEM LIFECYCLE & SEQUENCE        -->
<!-- ========================================== -->
<h1>UNIT 3: Complete End-to-End System Flow & Sequence Diagram</h1>

<h2>3.1 Master System Sequence Architecture</h2>
<p>
  Below is the complete technical and user flow from social discovery to the in-person meeting and host payout:
</p>

<div class="figure-container">
  <img src="diagram-flow.png" class="figure-img" style="width: 100%; border: 2px solid #0F2B48;" alt="Master System Sequence Diagram">
  <div class="figure-caption">Figure 3.1: Complete End-to-End Flow — User Discovery, Pass Purchase, Booking Escrow, WebSocket Chat, In-Person PIN, and UPI Payout</div>
</div>

<h2>3.2 Step-by-Step Flowchart Overview</h2>

<div class="flow-step-grid">
  <div class="flow-step-row">
    <div class="flow-step-cell">
      <div class="flow-box">
        <div class="flow-num">STEP 01</div>
        <div class="flow-title">Instagram Discovery</div>
        <p class="flow-desc">User watches a viral POV Reel about moving to a new city alone. Clicks link in bio.</p>
      </div>
    </div>
    <div class="flow-step-cell">
      <div class="flow-box">
        <div class="flow-num">STEP 02</div>
        <div class="flow-title">Blurred Preview</div>
        <p class="flow-desc">Opens trycompanio.in. Sees companions in their city, but photos and bios are blurred.</p>
      </div>
    </div>
    <div class="flow-step-cell">
      <div class="flow-box">
        <div class="flow-num">STEP 03</div>
        <div class="flow-title">Buys Access Pass</div>
        <p class="flow-desc">Pays INR 99.50 via Razorpay. Webhook confirms payment. Redirected to live app.</p>
      </div>
    </div>
    <div class="flow-step-cell">
      <div class="flow-box">
        <div class="flow-num">STEP 04</div>
        <div class="flow-title">Profiles Unlocked</div>
        <p class="flow-desc">Logs into getcompanio.in with OTP. Photos unblur. Full bios and ratings revealed.</p>
      </div>
    </div>
  </div>
  <div class="flow-step-row">
    <div class="flow-step-cell">
      <div class="flow-box">
        <div class="flow-num">STEP 05</div>
        <div class="flow-title">Books & Pays Escrow</div>
        <p class="flow-desc">Picks activity and public cafe. Deposits INR 706.00 booking fee into platform escrow.</p>
      </div>
    </div>
    <div class="flow-step-cell">
      <div class="flow-box">
        <div class="flow-num">STEP 06</div>
        <div class="flow-title">Host Accepts (12h SLA)</div>
        <p class="flow-desc">Companion receives alert and accepts. Real-time WebSocket chat unlocks for logistics.</p>
      </div>
    </div>
    <div class="flow-step-cell">
      <div class="flow-box">
        <div class="flow-num">STEP 07</div>
        <div class="flow-title">In-Person PIN Check</div>
        <p class="flow-desc">Meet at cafe. Member gives 4-digit PIN. Host enters PIN to officially start session clock.</p>
      </div>
    </div>
    <div class="flow-step-cell">
      <div class="flow-box">
        <div class="flow-num">STEP 08</div>
        <div class="flow-title">Automated UPI Payout</div>
        <p class="flow-desc">Session finishes. Cashfree releases escrow. Host gets INR 499 via UPI within 24 hours.</p>
      </div>
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 4: WHAT HAPPENS AFTER YOU PAY        -->
<!-- ========================================== -->
<h1>UNIT 4: What Happens After You Pay — The Access Pass Deep Dive</h1>

<h2>4.1 The Access Pass Tiers</h2>
<p>
  Companio uses a multi-tier paywall to monetize user curiosity before they even book a session:
</p>

<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 22%;">Subscription Tier</th>
        <th style="width: 15%;">Price (INR)</th>
        <th style="width: 15%;">Active Duration</th>
        <th style="width: 24%;">What Changes on Screen</th>
        <th style="width: 24%;">Backend & Expiry Logic</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1-Month Pass (Least)</strong></td>
        <td>INR 99.50</td>
        <td>30 Days</td>
        <td>Photo blur removed; bio revealed; "Book Session" button enabled.</td>
        <td>Valid 30 days. Auto-expires on Day 31; profiles re-blur.</td>
      </tr>
      <tr class="even-row">
        <td><strong>3-Month Pass</strong></td>
        <td>INR 199.50</td>
        <td>90 Days</td>
        <td>Same unblurring; top-rated companions featured at top.</td>
        <td>Valid 90 days. Expiration date saved in user database.</td>
      </tr>
      <tr>
        <td><strong>6-Month Pass</strong></td>
        <td>INR 499.50</td>
        <td>180 Days</td>
        <td>Same unblurring; platform booking fee waived on first 2 bookings.</td>
        <td>Valid 180 days.</td>
      </tr>
      <tr class="even-row">
        <td><strong>1-Year Pass</strong></td>
        <td>INR 699.50</td>
        <td>365 Days</td>
        <td>Same unblurring; priority notifications for new companions.</td>
        <td>Valid 365 days.</td>
      </tr>
      <tr>
        <td><strong>Lifetime Pass (Max)</strong></td>
        <td>INR 999.50</td>
        <td>Perpetual</td>
        <td>Permanent access; exclusive "Founding Member" profile badge.</td>
        <td>Never expires (<code>expires_at: NULL</code>). Account stays unlocked forever.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>4.2 Exact Visual & Database Changes After Paying</h2>
<ul>
  <li><strong>On the User's Screen:</strong> The 12px blur filter disappears. Companion portrait photos render in sharp high-definition. Surnames, hobbies, spoken languages, and ratings appear. A prominent <strong>"Book Session"</strong> button turns active.</li>
  <li><strong>In the Database:</strong> The user's account flips to <code>is_unlocked: true</code>, records the <code>pass_tier</code>, and saves the expiration timestamp. The browser receives an authenticated session token allowing it to fetch clear images from <code>img.getcompanio.in</code>.</li>
  <li><strong>Auto-Re-Lock:</strong> For the INR 99.50 pass, an automated server job checks expiration daily. On day 31, <code>is_unlocked</code> turns back to <code>false</code>. All companion photos instantly blur again until renewed.</li>
</ul>

<div class="warning-box">
  <div class="warning-title">THE DOUBLE-MONETIZATION MODEL (CRITICAL RULE)</div>
  <div class="warning-body">
    <strong>Buying an Access Pass does NOT pay for the companion meetup.</strong><br>
    The pass is purely an admission ticket to unblur photos and request bookings. When the user actually books a companion, they must pay the hourly fee (INR 706.00 for 1 hour). The platform collects money twice: once to browse, and again for every hour spent together.
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 5: CHAT & WEBSOCKETS                  -->
<!-- ========================================== -->
<h1>UNIT 5: Real-Time Chat & WebSockets — Messaging, Filters & Security</h1>

<h2>5.1 How Messaging Works (No Unsolicited Messages)</h2>
<p>
  A member cannot simply open a companion's profile and start chatting. The platform enforces strict steps to protect female hosts from harassment:
</p>
<ol>
  <li><strong>Booking Required First:</strong> The member selects an activity (e.g., Coffee at Third Wave Coffee, Indiranagar), selects date/time, and deposits the escrow fee (INR 706.00).</li>
  <li><strong>Host Reviews Profile:</strong> The companion sees the request, the user's verified badge, and the proposed venue. They have up to <strong>12 hours</strong> to click "Accept". If ignored or rejected, the member gets an instant 100% wallet refund.</li>
  <li><strong>Chat Unlocks Only Upon Acceptance:</strong> The live chat room only opens once the host accepts the booking.</li>
</ol>

<h2>5.2 WebSocket Mechanics (wss://api.getcompanio.in)</h2>
<p>
  The messaging system connects to a dedicated WebSocket gateway:
</p>
<ul>
  <li><strong>Instant Delivery:</strong> Messages deliver in real time with zero page refreshing.</li>
  <li><strong>Token Authenticated:</strong> Each socket connection passes a secure JWT session token verifying the user's active booking ID.</li>
  <li><strong>Auto-Locking Window:</strong> The chat room stays open before and during the meetup for logistics. Exactly <strong>2 hours after the meetup finishes</strong>, the chat room automatically locks and switches to read-only mode so users cannot use it as a permanent free messenger.</li>
</ul>

<h2>5.3 Automated Content Filters (Anti-Leak Shield)</h2>
<p>
  To prevent users and companions from exchanging phone numbers and transacting outside the app, server filters instantly intercept contact details:
</p>

<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 28%;">Attempted Contact Exchange</th>
        <th style="width: 32%;">What the User Types</th>
        <th style="width: 40%;">What the System Does</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Mobile Phone Numbers</strong></td>
        <td>10-digit numbers, +91, or spaced numbers (e.g. 9 8 1 1...).</td>
        <td>Message intercepted; replaced with <code>[PHONE NUMBER REDACTED]</code>.</td>
      </tr>
      <tr class="even-row">
        <td><strong>WhatsApp / Telegram Links</strong></td>
        <td>"wa.me/...", "DM me on WhatsApp", "t.me/...".</td>
        <td>Link dropped instantly; user receives an automated in-chat warning banner.</td>
      </tr>
      <tr>
        <td><strong>Instagram / Social Handles</strong></td>
        <td>"@username", "my insta is...", "add on snap".</td>
        <td>Handle redacted; reminder shown that contact exchange violates policy.</td>
      </tr>
      <tr class="even-row">
        <td><strong>Direct UPI Payment IDs</strong></td>
        <td>"paytm", "@okhdfcbank", "@ybl", "@upi".</td>
        <td>Dropped by WebSocket gateway to prevent off-platform cash advances.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 6: THE 4-DIGIT PIN HANDSHAKE          -->
<!-- ========================================== -->
<h1>UNIT 6: The Physical Meeting & 4-Digit PIN Handshake Protocol</h1>

<h2>6.1 How the Physical Meeting is Verified</h2>
<p>
  A major problem with offline services is disputes: a user claims the companion never showed up, or a companion claims they waited an hour alone. Companio solves this with the <strong>4-Digit In-Person PIN Code</strong>:
</p>

<div class="highlight-box">
  <div class="highlight-title">THE 4-DIGIT VERIFICATION FLOW</div>
  <div class="highlight-body">
    <ol style="margin: 4px 0; padding-left: 18px;">
      <li><strong>Member's Phone Shows the PIN:</strong> When the member reaches the cafe, their screen displays a private 4-digit code (e.g., <code>5814</code>).</li>
      <li><strong>Handshake in Person:</strong> The companion meets the member at the table and asks for this 4-digit code.</li>
      <li><strong>Companion Enters PIN:</strong> The companion enters the code into their host portal dashboard.</li>
      <li><strong>Session Timer Starts:</strong> The server verifies the PIN, flips the booking to <code>IN_PROGRESS</code>, and a live countdown timer starts on both devices.</li>
      <li><strong>Zero Dispute Proof:</strong> Because only the customer's phone displayed the code, entering it proves conclusively that both people were physically together.</li>
    </ol>
  </div>
</div>

<h2>6.2 Session Completion & Automated UPI Payout</h2>
<ul>
  <li>When the 60-minute timer runs out, both devices show: <em>"Session Complete"</em>.</li>
  <li>Both users submit a 1-to-5 star rating and brief feedback.</li>
  <li>The platform releases escrow, and Cashfree Payments automatically transfers the companion's 70.7% share (<strong>INR 499.00</strong>) via UPI to their bank account within 24 hours.</li>
</ul>

<h2>6.3 Emergency Safety & SOS Button</h2>
<p>
  During the active meetup, both devices feature a red <strong>Emergency SOS Button</strong>:
</p>
<ul>
  <li><strong>Live GPS Broadcast:</strong> Immediately shares the device's real-time coordinates with Companio's safety team.</li>
  <li><strong>One-Tap 112 Dialing:</strong> Triggers a direct dialer call to the National Emergency Helpline (112).</li>
  <li><strong>Instant Session Freeze:</strong> Immediately freezes escrow and locks accounts pending investigation.</li>
</ul>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 7: THE REVENUE ENGINE                 -->
<!-- ========================================== -->
<h1>UNIT 7: The Revenue Engine — How the Business Prints High Profits</h1>

<h2>7.1 Exact Math Behind the INR 706.00 Booking</h2>
<p>
  The core product is a 1-hour coffee meetup. The billing structure provides exceptional profit margins with zero physical inventory:
</p>

<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 36%;">Revenue Line Item</th>
        <th style="width: 18%;">Amount (INR)</th>
        <th style="width: 14%;">Percentage</th>
        <th style="width: 32%;">Destination</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Companion Host Payout</strong></td>
        <td>INR 499.00</td>
        <td>70.68%</td>
        <td>Disbursed to companion via UPI within 24 hours.</td>
      </tr>
      <tr class="even-row">
        <td><strong>Platform Service Fee Markup</strong></td>
        <td>INR 175.42</td>
        <td>24.85%</td>
        <td>Companio's gross markup for escrow, matching, and safety.</td>
      </tr>
      <tr>
        <td><strong>Government GST (18%)</strong></td>
        <td>INR 31.58</td>
        <td>4.47%</td>
        <td>Statutory GST remitted to the government.</td>
      </tr>
      <tr style="background-color: #E2E8F0; font-weight: 700;">
        <td><strong>Total Member Invoice Price</strong></td>
        <td><strong>INR 706.00</strong></td>
        <td><strong>100.00%</strong></td>
        <td><strong>Total amount charged to member's card or UPI.</strong></td>
      </tr>
      <tr>
        <td><em>Less: Gateway Fee (2% + GST)</em></td>
        <td>INR 16.66</td>
        <td>2.36%</td>
        <td>Paid to Cashfree / Razorpay for payment processing.</td>
      </tr>
      <tr class="even-row" style="background-color: #C6F6D5; font-weight: 700;">
        <td><strong>Net Platform Cash Profit</strong></td>
        <td><strong>INR 158.76</strong></td>
        <td><strong>22.49%</strong></td>
        <td><strong>Pure net cash kept by the company per completed hour.</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<h2>7.2 Four Additional High-Margin Revenue Streams</h2>
<ol>
  <li><strong>Access Pass Sales (100% Margin Float):</strong> Passes cost INR 99.50 to INR 999.50. Approximately <strong>65% of people buy a pass to view profiles and never book a session</strong>. This is 100% pure profit and upfront cash float.</li>
  <li><strong>Host Screening Fees (INR 99.50):</strong> Every applicant pays a non-refundable INR 99.50 fee when submitting Aadhaar KYC. Across thousands of applicants, this covers verification costs and creates early cash flow.</li>
  <li><strong>Wallet Cashout Penalty (12% Fee):</strong> Companions must reach INR 500 before free withdrawals activate. If a companion requests an early cashout below INR 500, a <strong>12% withdrawal penalty fee</strong> is deducted.</li>
  <li><strong>Late Cancellation Forfeitures (INR 250):</strong> Cancellations made within 24 hours of the meetup forfeit an INR 250 fee, split equally between the companion and the platform.</li>
</ol>

<h2>7.3 Monthly Profit Projections Across Scaling Milestones</h2>

<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 28%;">Metric</th>
        <th style="width: 24%;">Milestone A (1,000 Bookings)</th>
        <th style="width: 24%;">Milestone B (5,000 Bookings)</th>
        <th style="width: 24%;">Milestone C (25,000 Bookings)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Gross Merchandise Value (GMV)</strong></td>
        <td>INR 7,06,000</td>
        <td>INR 35,30,000</td>
        <td>INR 1,76,50,000</td>
      </tr>
      <tr class="even-row">
        <td><strong>Host Disbursements (UPI)</strong></td>
        <td>INR 4,99,000</td>
        <td>INR 24,95,000</td>
        <td>INR 1,24,75,000</td>
      </tr>
      <tr>
        <td><strong>Platform Hourly Commission</strong></td>
        <td>INR 1,75,420</td>
        <td>INR 8,77,100</td>
        <td>INR 43,85,500</td>
      </tr>
      <tr class="even-row">
        <td><strong>Pass Subscriptions (100% Margin)</strong></td>
        <td>INR 1,49,250 (1,500 passes)</td>
        <td>INR 6,96,500 (7,000 passes)</td>
        <td>INR 29,85,000 (30,000 passes)</td>
      </tr>
      <tr>
        <td><strong>Host Application Fees</strong></td>
        <td>INR 29,850</td>
        <td>INR 99,500</td>
        <td>INR 3,98,000</td>
      </tr>
      <tr style="background-color: #E2E8F0; font-weight: 700;">
        <td><strong>Total Gross Revenue</strong></td>
        <td><strong>INR 3,54,520</strong></td>
        <td><strong>INR 16,73,100</strong></td>
        <td><strong>INR 77,68,500</strong></td>
      </tr>
      <tr class="even-row" style="background-color: #C6F6D5; font-weight: 700;">
        <td><strong>Estimated Net Profit (EBITDA)</strong></td>
        <td><strong>INR 2,89,520</strong></td>
        <td><strong>INR 14,53,100</strong></td>
        <td><strong>INR 69,18,500</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 8: PAGE BY PAGE BUTTON AUDIT          -->
<!-- ========================================== -->
<h1>UNIT 8: Complete Page-by-Page Audit & Interactive Button Flows</h1>

<p>
  Every discovered screen, button, and user interaction mapped from our automated crawl of the platform:
</p>

<!-- Page 1 -->
<div class="audit-card">
  <div class="audit-header">
    <span class="audit-url">1. HOMEPAGE — /</span>
    <span class="audit-purpose">Top-of-Funnel Marketing Showroom</span>
  </div>
  <div class="audit-grid">
    <div class="audit-col-left">
      <div class="audit-tag">What's on Screen</div>
      <p style="font-size: 8pt; margin: 0 0 6px 0;">Hero video loop of young urbanites at cafes; live counter of "Verified Companions"; activity selector; trust and media logos.</p>
      <div class="audit-tag">Business Objective</div>
      <p style="font-size: 8pt; margin: 0;">Validate the concept, normalize platonic paid companionship, and drive users to <code>/explore</code>.</p>
    </div>
    <div class="audit-col-right">
      <div class="audit-tag">Clickable Buttons & Actions</div>
      <div class="btn-item"><span class="btn-name">[Find a companion]</span> Primary CTA. Routes user to <code>/explore</code>.</div>
      <div class="btn-item"><span class="btn-name">[Activity Buttons]</span> 'Café & conversation', 'City walk', 'Gym', 'Gigs & events'. Filters companions by activity tag.</div>
      <div class="btn-item"><span class="btn-name">[How it works]</span> Opens onboarding guide page.</div>
      <div class="btn-item"><span class="btn-name">[Safety]</span> Opens trust disclosures and emergency guidelines.</div>
    </div>
  </div>
</div>

<!-- Page 2 -->
<div class="audit-card">
  <div class="audit-header">
    <span class="audit-url">2. EXPLORE DIRECTORY — /explore & /city/*</span>
    <span class="audit-purpose">Companion Search & Paywall Gate</span>
  </div>
  <div class="audit-grid">
    <div class="audit-col-left">
      <div class="audit-tag">What's on Screen</div>
      <p style="font-size: 8pt; margin: 0 0 6px 0;">Grid of companion cards. Photos blurred with 12px CSS blur. Surnames masked (e.g. "Vanshika S***"). Bios cut with "...".</p>
      <div class="audit-tag">Business Objective</div>
      <p style="font-size: 8pt; margin: 0;">Create intense curiosity and trigger the Access Pass purchase modal.</p>
    </div>
    <div class="audit-col-right">
      <div class="audit-tag">Clickable Buttons & Actions</div>
      <div class="btn-item"><span class="btn-name">[City Dropdown]</span> Switches between 66 Indian cities (Delhi, Bengaluru, Mumbai, Pune).</div>
      <div class="btn-item"><span class="btn-name">[Companion Card Click]</span> Intercepted by paywall. Pops modal: "Unlock Full Profile — Join Companio Club for INR 99.50".</div>
      <div class="btn-item"><span class="btn-name">[Unlock Now]</span> Opens Razorpay checkout modal with pass options.</div>
    </div>
  </div>
</div>

<!-- Page 3 -->
<div class="audit-card">
  <div class="audit-header">
    <span class="audit-url">3. HOW IT WORKS — /how-it-works</span>
    <span class="audit-purpose">Customer Education & Friction Reducer</span>
  </div>
  <div class="audit-grid">
    <div class="audit-col-left">
      <div class="audit-tag">What's on Screen</div>
      <p style="font-size: 8pt; margin: 0 0 6px 0;">5-step illustrated walkthrough explaining companion selection, booking escrow, public cafes, and the 4-digit PIN.</p>
      <div class="audit-tag">Business Objective</div>
      <p style="font-size: 8pt; margin: 0;">Remove fear of scams, awkwardness, and unclear financial expectations.</p>
    </div>
    <div class="audit-col-right">
      <div class="audit-tag">Clickable Buttons & Actions</div>
      <div class="btn-item"><span class="btn-name">[Browse companions]</span> Directs user back into the <code>/explore</code> conversion funnel.</div>
      <div class="btn-item"><span class="btn-name">[Safety Centre Link]</span> Directs to safety rules and emergency protocols.</div>
      <div class="btn-item"><span class="btn-name">[FAQ Expanders]</span> Accordion toggles answering common questions.</div>
    </div>
  </div>
</div>

<!-- Page 4 -->
<div class="audit-card">
  <div class="audit-header">
    <span class="audit-url">4. SAFETY & TRUST CENTRE — /safety & /trust</span>
    <span class="audit-purpose">Trust Architecture & Legal Shield</span>
  </div>
  <div class="audit-grid">
    <div class="audit-col-left">
      <div class="audit-tag">What's on Screen</div>
      <p style="font-size: 8pt; margin: 0 0 6px 0;">Four safety pillars, platonic guarantee badge, Aadhaar/PAN verification disclosures, and emergency guidelines.</p>
      <div class="audit-tag">Business Objective</div>
      <p style="font-size: 8pt; margin: 0;">Reassure anxious female companions and male customers that the service is 100% legal, clean, and regulated.</p>
    </div>
    <div class="audit-col-right">
      <div class="audit-tag">Clickable Buttons & Actions</div>
      <div class="btn-item"><span class="btn-name">[SOS · Share location]</span> Interactive simulation of emergency GPS broadcasting.</div>
      <div class="btn-item"><span class="btn-name">[Call Safety Helpline]</span> Initiates phone call to Companio emergency line.</div>
      <div class="btn-item"><span class="btn-name">[Read Community Guidelines]</span> Opens zero-tolerance policy document.</div>
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- Page 5 -->
<div class="audit-card">
  <div class="audit-header">
    <span class="audit-url">5. BECOME A COMPANION — /become-a-companion</span>
    <span class="audit-purpose">Supply-Side Host Onboarding Funnel</span>
  </div>
  <div class="audit-grid">
    <div class="audit-col-left">
      <div class="audit-tag">What's on Screen</div>
      <p style="font-size: 8pt; margin: 0 0 6px 0;">Interactive earnings simulator slider ("Earn up to INR 45,000/mo by hosting 15 hrs/wk"); host testimonials; 4-step KYC application.</p>
      <div class="audit-tag">Business Objective</div>
      <p style="font-size: 8pt; margin: 0;">Acquire personable university students and freelancers while collecting a non-refundable INR 99.50 screening fee.</p>
    </div>
    <div class="audit-col-right">
      <div class="audit-tag">Clickable Buttons & Actions</div>
      <div class="btn-item"><span class="btn-name">[Apply Now]</span> Opens the 4-step host registration form.</div>
      <div class="btn-item"><span class="btn-name">[Hours Slider]</span> Interactive slider recalculating projected monthly income.</div>
      <div class="btn-item"><span class="btn-name">[Submit KYC & Pay INR 99.50]</span> Uploads Aadhaar/selfie and triggers application fee payment.</div>
    </div>
  </div>
</div>

<!-- Page 6 -->
<div class="audit-card">
  <div class="audit-header">
    <span class="audit-url">6. FAQ & POLICY CENTRE — /faq</span>
    <span class="audit-purpose">Objection Handling & Compliance Rules</span>
  </div>
  <div class="audit-grid">
    <div class="audit-col-left">
      <div class="audit-tag">What's on Screen</div>
      <p style="font-size: 8pt; margin: 0 0 6px 0;">Categorized Q&A accordions covering pass pricing, companion response SLA (12h), refunds, and cancellation rules.</p>
      <div class="audit-tag">Business Objective</div>
      <p style="font-size: 8pt; margin: 0;">Resolve payment confusion, disclose pass non-refundability, and minimize support tickets.</p>
    </div>
    <div class="audit-col-right">
      <div class="audit-tag">Clickable Buttons & Actions</div>
      <div class="btn-item"><span class="btn-name">[Back]</span> Returns user to previous page.</div>
      <div class="btn-item"><span class="btn-name">[Category Tabs]</span> Toggles between Passes, Bookings, Safety, and Host questions.</div>
      <div class="btn-item"><span class="btn-name">[Contact Support]</span> Redirects to categorized ticket submission on <code>/contact</code>.</div>
    </div>
  </div>
</div>

<!-- Page 7 -->
<div class="audit-card">
  <div class="audit-header">
    <span class="audit-url">7. CONTACT & GRIEVANCE HUB — /contact</span>
    <span class="audit-purpose">Customer Support & Regulatory Compliance</span>
  </div>
  <div class="audit-grid">
    <div class="audit-col-left">
      <div class="audit-tag">What's on Screen</div>
      <p style="font-size: 8pt; margin: 0 0 6px 0;">Interactive problem selector, contact form, response time SLA (24h), and Grievance Officer details under Indian IT Rules.</p>
      <div class="audit-tag">Business Objective</div>
      <p style="font-size: 8pt; margin: 0;">Route support requests cleanly and fulfill statutory digital compliance.</p>
    </div>
    <div class="audit-col-right">
      <div class="audit-tag">Clickable Buttons & Actions</div>
      <div class="btn-item"><span class="btn-name">[Report a safety problem]</span> Priority escalation for immediate safety review.</div>
      <div class="btn-item"><span class="btn-name">[Something isn't working]</span> Technical bug ticket form (sign-in, uploads).</div>
      <div class="btn-item"><span class="btn-name">[Credits or payment]</span> Refund, billing, and pass activation inquiries.</div>
      <div class="btn-item"><span class="btn-name">[Submit Message]</span> Submits form to support desk.</div>
    </div>
  </div>
</div>

<!-- Page 8 -->
<div class="audit-card">
  <div class="audit-header">
    <span class="audit-url">8. LIVE APP DASHBOARD — getcompanio.in</span>
    <span class="audit-purpose">Live Operational App & Escrow Checkout</span>
  </div>
  <div class="audit-grid">
    <div class="audit-col-left">
      <div class="audit-tag">What's on Screen</div>
      <p style="font-size: 8pt; margin: 0 0 6px 0;">Unblurred companion profiles, real-time availability badges, booking request modal, calendar picker, and Cashfree escrow payment.</p>
      <div class="audit-tag">Business Objective</div>
      <p style="font-size: 8pt; margin: 0;">Convert pass-holders into hourly bookings (INR 706.00/hr) and lock funds in escrow.</p>
    </div>
    <div class="audit-col-right">
      <div class="audit-tag">Clickable Buttons & Actions</div>
      <div class="btn-item"><span class="btn-name">[Book Session]</span> Opens booking modal for date, duration, and cafe venue.</div>
      <div class="btn-item"><span class="btn-name">[Pay Escrow (INR 706)]</span> Initiates Cashfree payment for session escrow.</div>
      <div class="btn-item"><span class="btn-name">[Live Chat Button]</span> Activated only after companion host accepts booking.</div>
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 9: VISUAL SCREEN EXHIBITS             -->
<!-- ========================================== -->
<h1>UNIT 9: Visual Screen Exhibits & Production Interface Audit</h1>

<h2>9.1 Visual Evidence from the Production Platform</h2>
<p>
  Actual screens captured from the production platform demonstrating user onboarding, experience showcases, and safety governance:
</p>

<h3>Exhibit 9.1: Homepage Interface</h3>
<div class="figure-container">
  <img src="screenshots/homepage.png" class="figure-img" style="width: 80%;" alt="Companio Homepage Interface">
  <div class="figure-caption">Exhibit 9.1: Homepage — Video hero, activity tag buttons, and verified companion counter</div>
</div>

<h3>Exhibit 9.2: How It Works Process Guide</h3>
<div class="figure-container">
  <img src="screenshots/how-it-works.png" class="figure-img" style="width: 80%;" alt="How It Works Interface">
  <div class="figure-caption">Exhibit 9.2: How It Works — 5-step transparent guide explaining escrow, public venues, and 4-digit PIN</div>
</div>

<div class="page-break"></div>

<h3>Exhibit 9.3: Safety Centre Interface</h3>
<div class="figure-container">
  <img src="screenshots/safety.png" class="figure-img" style="width: 80%;" alt="Safety Centre Interface">
  <div class="figure-caption">Exhibit 9.3: Safety Centre — Four safety pillars, emergency SOS button, and 100% ID check disclosure</div>
</div>

<h3>Exhibit 9.4: Curated Activity Experience (Artisan Coffee)</h3>
<div class="figure-container">
  <img src="screenshots/experience-coffee.png" class="figure-img" style="width: 80%;" alt="Curated Experience Interface">
  <div class="figure-caption">Exhibit 9.4: Curated Coffee Experience — Pre-selected cafe venues, etiquette prompts, and companion matching</div>
</div>

<div class="page-break"></div>

<h3>Exhibit 9.5: Host Supply Funnel & Earnings Simulator</h3>
<div class="figure-container">
  <img src="screenshots/become-a-companion.png" class="figure-img" style="width: 80%;" alt="Become a Companion Portal">
  <div class="figure-caption">Exhibit 9.5: Host Funnel — Interactive income calculator (INR 45k/mo) and INR 99.50 screening fee gate</div>
</div>

<h3>Exhibit 9.6: FAQ, Policy Resolution & Grievance Hub</h3>
<div class="figure-container">
  <img src="screenshots/faq.png" class="figure-img" style="width: 80%;" alt="FAQ & Help Centre">
  <div class="figure-caption">Exhibit 9.6: FAQ Centre — Transparent policy disclosures, cancellation timelines, and refund terms</div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 10: CRITICAL LOOPHOLES & FLAWS        -->
<!-- ========================================== -->
<h1>UNIT 10: Critical Loopholes & Strategic Flaws in the Ecosystem</h1>

<h2>10.1 Key Weaknesses Discovered</h2>
<p>
  While the business generates strong cash flow, our audit revealed four significant operational weaknesses:
</p>

<div class="warning-box">
  <div class="warning-title">1. THE WHATSAPP DISINTERMEDIATION LEAK</div>
  <div class="warning-body">
    Once a member meets a companion at a cafe and they get along, they often exchange phone numbers in person. For future meetups, they bypass the app completely. The member pays the companion INR 500 in cash, saving the platform's INR 206 markup. The platform captures only 1 to 2 bookings per customer before losing them.<br><br>
    <strong>How to Fix:</strong> Provide repeat-booking rewards (like free coffee credits at partner cafes) and active in-app safety insurance that only covers official bookings.
  </div>
</div>

<div class="warning-box">
  <div class="warning-title">2. 12-HOUR WAITING TIME DESTROYS IMPULSE BOOKINGS</div>
  <div class="warning-body">
    Companio gives companions up to 12 hours to accept a request. But loneliness is often spontaneous: a professional who feels isolated on a Friday evening wants company in 30 minutes, not tomorrow afternoon.<br><br>
    <strong>How to Fix:</strong> Build an <strong>Instant On-Demand Dispatch</strong> engine with an "Available Now" toggle in busy metro areas guaranteeing sub-15 minute host arrival.
  </div>
</div>

<div class="warning-box">
  <div class="warning-title">3. MANUAL ID VERIFICATION IS SLOW AND RISKY</div>
  <div class="warning-body">
    Companio manually reviews photos of Aadhaar and PAN cards. This creates approval delays and allows fake or edited documents to slip through without facial biometric verification.<br><br>
    <strong>How to Fix:</strong> Implement automated <strong>DigiLocker API integration</strong> with live selfie face-matching, completing verified KYC in under 30 seconds.
  </div>
</div>

<div class="warning-box">
  <div class="warning-title">4. WEB-ONLY APP LACKS MOBILE HARDWARE POWER</div>
  <div class="warning-body">
    Running only in a web browser means Companio cannot do live background GPS tracking during meetups, cannot send reliable push notifications, and misses out on App Store discovery.<br><br>
    <strong>How to Fix:</strong> Deploy native mobile apps in Flutter with persistent background safety tracking and a hardware emergency button (e.g. triple-clicking power button alerts safety line).
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- UNIT 11: EXECUTIVE SUMMARY                 -->
<!-- ========================================== -->
<h1>UNIT 11: Executive Architecture Summary & Key Takeaways</h1>

<h2>11.1 Key Insights at a Glance</h2>
<ul>
  <li><strong>Huge Proven Demand:</strong> Paid platonic companionship is not a gimmick; it solves a massive loneliness problem for 600 million urban migrants across India.</li>
  <li><strong>High Profit Margins:</strong> The platform earns <strong>INR 158.76 in pure cash profit per hour</strong> (22.5% net margin) with zero inventory, plus 100% margin upfront Access Pass sales.</li>
  <li><strong>Double-Monetization Engine:</strong> Charging users once to view profiles (INR 99.50 – 999.50) and again for every hour spent together creates exceptional upfront cash flow.</li>
  <li><strong>Simple, Replicable Tech Stack:</strong> The dual-domain model (marketing site on one domain, live PWA on another) combined with WebSocket messaging, Cashfree escrow, and 4-digit PIN verification is a proven, reliable architecture.</li>
  <li><strong>Big Opportunity for Improvement:</strong> A competing platform that fixes Companio's flaws—offering instant 15-minute dispatch, partner cafe discounts, DigiLocker verification, and native mobile apps—can easily capture market leadership.</li>
</ul>

<div class="highlight-box">
  <div class="highlight-title">FINAL TAKEAWAY</div>
  <div class="highlight-body">
    Companio proves that modern consumers will pay for safe, structured human connection. It is an asset-light, high-cash-flow business model with strong profitability and enormous room for a superior product.
  </div>
</div>

<!-- SIGN-OFF FOOTER -->
<div style="margin-top: 35px; border-top: 2px solid #0F2B48; padding-top: 10px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 8pt; color: #486581; display: flex; justify-content: space-between;">
  <span>LEXVRA PRODUCT ARCHITECTURE GROUP</span>
  <span>THE COMPANIO PLATFORM AUDIT</span>
  <span>AUTHENTICATED DOSSIER</span>
</div>

</body>
</html>
"""

print(f"Writing LEXVRA master breakdown HTML to: {HTML_OUTPUT_PATH}")
with open(HTML_OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML written successfully. Proceeding to Chrome headless PDF generation...")

# Compile HTML to PDF using Chrome Headless
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
tmp_dir = os.environ.get("TEMP", r"C:\Users\Dell\AppData\Local\Temp")
user_data_dir = os.path.join(tmp_dir, "chrome_lexvra_rnd")

cmd = [
    chrome_path,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    f"--user-data-dir={user_data_dir}",
    f"--print-to-pdf={PDF_OUTPUT_PATH}",
    HTML_OUTPUT_PATH
]

print("Executing Chrome headless PDF generation...")
result = subprocess.run(cmd, capture_output=True, text=True)

if os.path.exists(PDF_OUTPUT_PATH):
    size = os.path.getsize(PDF_OUTPUT_PATH)
    print(f"PDF generated successfully: {PDF_OUTPUT_PATH} ({size} bytes)")
    
    # Copy to root directory under both requested names
    shutil.copy2(PDF_OUTPUT_PATH, ROOT_CLIENT_PDF)
    shutil.copy2(PDF_OUTPUT_PATH, ROOT_ALL_IN_ONE_PDF)
    print(f"Updated client PDF at root: {ROOT_CLIENT_PDF}")
    print(f"Updated all-in-one PDF at root: {ROOT_ALL_IN_ONE_PDF}")
else:
    print(f"PDF generation failed: {result.stderr}")
