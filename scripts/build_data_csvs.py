import csv
import os

BASE_DIR = r"C:\Users\Dell\Documents\codes\trycompanio\TRYCOMPANIO-RND\10-DATA"
os.makedirs(BASE_DIR, exist_ok=True)

# 1. website_pages.csv
pages_data = [
    ["https://www.trycompanio.in/", "Companio | Connect, Meet, and Experience the City Together", "Homepage & Value Proposition", "Find a companion", "Public", "Hero video, stats counter, activity picker, trust badges", "200 OK", "2026-11-16"],
    ["https://www.trycompanio.in/explore", "Explore companions, Companio", "Companion Discovery Directory", "Unlock profile", "Public preview / Gated full", "Filter by city & activity, companion preview cards, ID badges", "200 OK", "Dynamic"],
    ["https://www.trycompanio.in/how-it-works", "How it works, Companio", "Customer Onboarding Guide", "Browse companions", "Public", "5-step illustrated guide, escrow explainer, SOS protocol", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/safety", "Safety Centre, Companio", "Trust & Safety Documentation", "Call safety line / 112", "Public", "Platonic promise, 4 safety pillars, SOS snapshot, hotline", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/about", "About us, Companio", "Company Mission & Business Model", "Informational", "Public", "Founding thesis, anti-loneliness vision, 70/30 revenue split", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/become-a-companion", "Become a Companion, Companio", "Host Supply Acquisition Funnel", "Apply now", "Public", "Earnings simulator, 4-step KYC application, rate configuration", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/faq", "FAQ, Companio", "Comprehensive Help & Policy Q&A", "Open contact form", "Public", "Pass pricing, 12-hr companion response SLA, wallet refunds", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/contact", "Contact us, Companio", "Support & Grievance Hub", "Write to team", "Public", "Categorized contact form, DPDPA Grievance Officer details", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/trust", "Trust & ID checks, Companio", "Verification Transparency Disclosure", "Find a companion", "Public", "Aadhaar/PAN manual structural check, limitations disclosure", "200 OK", "2026-11-06"],
    ["https://www.trycompanio.in/verify", "Check who you are meeting, Companio", "In-Person Meetup Protocol", "Report safety concern", "Public", "4-step safety checklist, 4-digit code in-person handover", "200 OK", "2026-11-06"],
    ["https://www.trycompanio.in/community-guidelines", "Community Guidelines, Companio", "Code of Conduct & Enforcement Rules", "Report in-app", "Public", "Zero-tolerance offenses, bans, non-platonic ban, appeal terms", "200 OK", "2026-11-06"],
    ["https://www.trycompanio.in/refunds", "Refund Policy, Companio", "Consumer Rights & Wallet Terms", "Email team", "Public", "Pass refund terms, wallet credits (1:1 INR), 12% cashout fee", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/terms", "Terms of Service, Companio", "Legal Terms of Service", "Informational", "Public", "DPDPA 2023 compliance, arbitration, liability limitations", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/privacy", "Privacy Policy, Companio", "Data Privacy & Protection Policy", "Request deletion", "Public", "DPDPA user rights, data retention, grievance officer email", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/delivery", "Delivery Policy, Companio", "Digital Fulfillment Terms", "Informational", "Public", "Instant pass provisioning, 24-hr post-meetup companion payout", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/cookies", "Cookie Policy, Companio", "Tracking Disclosures & Consent", "Cookie settings", "Public", "First-party auth cookies, PostHog, Meta, Google analytics", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/accessibility", "Accessibility, Companio", "Web Accessibility Commitment", "Informational", "Public", "WCAG compliance commitment, ARIA roles, skip-to-content", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/careers", "Careers, Companio", "Talent Acquisition / Stealth Roles", "Send introduction", "Public", "Engineering, Trust & Safety, City Ops talent callout", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/press", "Press & Media, Companio", "Press Kit & Brand Assets", "Write to team", "Public", "One-liner, pass summary, safety badges, PR inquiries", "200 OK", "2026-11-13"],
    ["https://www.trycompanio.in/experience/coffee", "Book a Cafe Chat in India | Companio", "Activity Landing Page (Coffee)", "Unlock profile", "Public preview", "Companion preview cards in Agra, Ahmedabad, Delhi, Bangalore", "200 OK", "2026-11-15"],
    ["https://www.trycompanio.in/experience/city-walk", "Book a City Walk in India | Companio", "Activity Landing Page (Walks)", "Unlock profile", "Public preview", "Heritage walks, evening strolling companions, safety guidelines", "200 OK", "2026-11-15"],
    ["https://www.trycompanio.in/experience/events", "Book a Live Event Companion | Companio", "Activity Landing Page (Events)", "Unlock profile", "Public preview", "Concerts, comedy gigs, festival plus-one companion bookings", "200 OK", "2026-11-15"],
    ["https://www.trycompanio.in/experience/gym", "Book a Gym Buddy in India | Companio", "Activity Landing Page (Gym)", "Unlock profile", "Public preview", "Workout accountability partners, gym spotters, fitness buddies", "200 OK", "2026-11-15"],
    ["https://www.trycompanio.in/experience/museum", "Book a Museum Visit Companion | Companio", "Activity Landing Page (Museum)", "Unlock profile", "Public preview", "Cultural visits, art galleries, history museum companions", "200 OK", "2026-11-15"],
    ["https://www.trycompanio.in/delhi/companions", "Platonic Companions in Delhi | Companio", "Programmatic City Landing Page", "View Delhi companions", "Public", "Connaught Place, Hauz Khas, Gurgaon coverage, local hosts", "200 OK", "2026-11-16"],
    ["https://www.trycompanio.in/mumbai/companions", "Platonic Companions in Mumbai | Companio", "Programmatic City Landing Page", "View Mumbai companions", "Public", "Bandra, Marine Drive, BKC, Colaba, Navi Mumbai coverage", "200 OK", "2026-11-16"],
    ["https://www.trycompanio.in/bengaluru/companions", "Platonic Companions in Bengaluru | Companio", "Programmatic City Landing Page", "View Bengaluru companions", "Public", "Indiranagar, Koramangala, Cubbon Park, HSR Layout coverage", "200 OK", "2026-11-16"],
    ["https://www.trycompanio.in/login", "Login | Companio", "Authentication Portal", "Sign in", "Public", "Email OTP confirmation, magic link authentication", "200 OK", "Dynamic"],
    ["https://www.trycompanio.in/dashboard", "User Dashboard | Companio", "Client Booking & Account Portal", "Book / Message", "Authenticated Member", "Active passes, chat threads, booking history, wallet balance", "302 Auth Required", "Dynamic"],
    ["https://www.trycompanio.in/companion-dashboard", "Companion Dashboard | Companio", "Host Operations & Payouts Portal", "Accept / Withdraw", "Authenticated Companion", "Incoming booking requests, calendar, earnings, UPI cashout", "302 Auth Required", "Dynamic"]
]

with open(os.path.join(BASE_DIR, "website_pages.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["url", "title", "page_purpose", "primary_cta", "access_level", "key_features", "http_status", "last_modified"])
    writer.writerows(pages_data)

# 2. website_features.csv
features_data = [
    ["Activity Plan Picker", "Core Booking", "Allows users to select between Coffee, City Walk, Events, Gym, Museum, Elder Company", "Members", "Active", "Live", "Next.js State / React"],
    ["City Filter & Geolocation", "Discovery", "Locates companions across 60+ Indian metro and Tier-2 cities", "Members", "Active", "Live", "OpenStreetMap / MapTiler API"],
    ["Companio Access Pass", "Monetization", "Pass required to unlock unmasked companion profiles and activate direct booking", "Members", "Active", "Live", "Razorpay Payment Gateway"],
    ["Escrow Booking Protection", "Financial", "Holds meetup payments in escrow until 4-digit code exchanged in person", "Both", "Active", "Live", "Razorpay / Custom Escrow Logic"],
    ["ID-Checked Badge", "Trust & Safety", "Manual verification of government Aadhaar / PAN card and photo consistency", "Companions", "Active", "Live", "Manual Admin Portal"],
    ["In-App SOS & Snapshot Sharing", "Safety Telemetry", "One-tap trigger to export location snapshot and meetup details via WhatsApp/SMS", "Both", "Active", "Live", "Web Share API / Geolocation API"],
    ["Host Application Flow", "Supply Acquisition", "4-step onboarding flow requiring details, activity rates, ID upload, and ₹99.50 fee", "Companions", "Active", "Live", "Next.js API / Vercel Blob Storage"],
    ["Earnings Calculator", "Supply Marketing", "Interactive slider calculating monthly companion earnings based on hourly rates", "Companions", "Active", "Live", "Client-Side React Component"],
    ["Wallet & UPI Cashout", "Financial", "Closed-loop wallet balance (1 credit = ₹1) with 12% cashout fee to companion UPI", "Both", "Active", "Live", "Razorpay Payouts / NPCI UPI"],
    ["Strictly Platonic Zero-Tolerance Banner", "Brand & Legal", "Persistent trust signaling detailing strict ban on non-platonic or romantic conduct", "Public", "Active", "Live", "Tailwind CSS Sticky Banner"],
    ["Programmatic City SEO Pages", "Acquisition", "66+ indexed city landing pages with localized copy and neighborhood anchors", "Search Engines", "Active", "Live", "Next.js ISR (Incremental Static Regeneration)"],
    ["Post-Meetup Review System", "Reputation", "Mutual 5-star rating and qualitative feedback mechanism unlocking after meetup", "Both", "Active", "Post-booking only", "PostgreSQL / Prisma DB"],
    ["Live Map Companion Radar", "Discovery", "Radius-based interactive map displaying nearby companions in real time", "Members", "Roadmap", "Planned", "ArcGIS / MapTiler Integration"],
    ["Automated UIDAI Aadhaar e-KYC", "Trust & Safety", "Instant API-level Aadhaar biometric/OTP verification replacing manual review", "Companions", "Roadmap", "Planned", "DigiLocker / Setu / Signzy API"]
]

with open(os.path.join(BASE_DIR, "website_features.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["feature_name", "category", "feature_description", "target_user", "availability", "implementation_status", "tech_dependency"])
    writer.writerows(features_data)

# 3. instagram_posts.csv
ig_posts = [
    ["post_01", "Reel (POV Video)", "2026-10-18", "Urban Loneliness & Relocation", "Moving to a new city as an adult is weird. Surrounded by millions of people, but your phone is the only thing talking back.", "You don't need another dating app; you just need a city buddy. Finding your crowd shouldn't feel like a full-time job. Skip the lonely weekends and explore your city with someone who actually shares your vibe. Coffee, walks, and gigs—platonic, safe, and right in your neighborhood.", "High Saves & Shares (Corporate Transplants)", "Relatable adult friendship struggles in Bengaluru/Gurgaon", "Tap the link in bio to find a verified local companion in your city.", "#TryCompanio #UrbanLoneliness #MakeFriends #CityLife #PlatonicConnections #DelhiDiaries #BangaloreDiaries"],
    ["post_02", "Reel (Humor / POV)", "2026-10-25", "Gym Spotter & Accountability", "The hardest part of leg day shouldn't be finding someone to spot your squat.", "Trying to stay motivated at the gym alone is tough. Stop lifting in total isolation and find a local training partner who matches your energy and actually shows up. Drop your city below or find your gym partner on Companio.", "High Comment Volume (City & Gym tags)", "Asking for gym partners in specific localities (Indiranagar, HSR, Malviya Nagar)", "Drop your city in comments or tap link in bio to match with local gym buddies.", "#GymBuddy #WorkoutMotivation #FitnessCommunity #MakeFriends #CompanioApp #GymLife"],
    ["post_03", "Carousel (Trust & Safety)", "2026-11-02", "Four Unbreakable Safety Commitments", "Why Companio is strictly platonic and 100% safe.", "1. Every profile reviewed with Govt ID.\n2. Strictly platonic promise (instant permanent ban for violations).\n3. In-app SOS snapshot & location sharing.\n4. Escrow payments via Razorpay (companions paid only post-meetup).", "High Bookmarks / Trust Anchor", "Inquiries about female companion verification & emergency handling", "Read our full Community Guidelines & Safety Centre at trycompanio.in", "#SafetyFirst #TrustAndSafety #VerifiedProfiles #SafeMeetups #Companio"],
    ["post_04", "Reel (Culture & Gigs)", "2026-11-08", "Concert Plus-One & Events", "Nobody should skip the gig just because they'd have to go alone.", "Your favorite indie band is in town, your friends backed out at the last minute, and now your ticket is sitting on your bedside table. Never miss a gig again. Find a fellow music enthusiast on Companio who knows all the lyrics and is ready to jump into the pit with you.", "High Share-to-Story Ratio", "Debating festival lineups (Lollapalooza, NH7, standup specials)", "Link in bio to find your event plus-one today.", "#ConcertBuddy #LiveMusicIndia #FestivalSeason #GigGoers #PlusOne #IndieMusic"],
    ["post_05", "Carousel (Supply Recruitment)", "2026-11-12", "Become a Companion Side-Hustle", "Show people your city and get paid up to 70% per meetup on your own schedule.", "Love coffee chats, fitness, or city walks? Turn your free time into earnings. Set your own schedule, accept only requests you want, and get paid straight to your UPI account after a 24-hour verification check.", "High Direct Inquiries / Host Applications", "Questions regarding payout timing and the ₹99.50 application fee", "Apply in 10 minutes at trycompanio.in/become-a-companion", "#SideHustleIndia #BecomeAHost #ExploreYourCity #EarnMoney #CollegeHustle"]
]

with open(os.path.join(BASE_DIR, "instagram_posts.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["post_id", "content_format", "publication_date", "main_topic", "hook_text", "caption_text", "engagement_signal", "top_comment_theme", "call_to_action", "hashtags"])
    writer.writerows(ig_posts)

# 4. instagram_comments.csv
ig_comments = [
    ["comm_01", "post_01", "Geographic Demand", "Availability Inquiry", "Neutral", "When is Companio launching in Hyderabad (Gachibowli area)? Moved here for Amazon last month and it's so isolated.", "Hey! We are active in Hyderabad! Check out the explore tab on trycompanio.in to see local hosts.", "High (Supply expansion confirmation)"],
    ["comm_02", "post_01", "Dating App Skepticism", "Objection / Mistrust", "Negative", "Is this just rent-a-girlfriend repackaged? Looks like a dating app in disguise.", "Absolutely not. We have a 0-tolerance strictly platonic policy. Any romantic or adult solicitations result in immediate permanent bans and forfeiture of funds.", "High (Trust defense)"],
    ["comm_03", "post_02", "Feature Intent", "Community Formation", "Positive", "Need a 6 AM workout partner in Bandra West! Cult.fit Carter Road anyone?", "You can filter companions by 'Gym' and location 'Mumbai - Bandra' on our site right now!", "Medium (Conversion nudge)"],
    ["comm_04", "post_03", "Female Safety Concerns", "Safety Validation", "Mixed", "As a woman, how do I know the person I am meeting is actually who they say they are?", "Every companion submits government Aadhaar/PAN + selfie verification before being listed. Meetups are strictly in public places, and our in-app SOS lets you share live location.", "Critical (Conversion reassurance)"],
    ["comm_05", "post_03", "Pricing Friction", "Cost Confusion", "Neutral", "Do I pay the pass fee AND the hourly companion rate? Why both?", "The pass (from ₹99.50) covers our platform KYC, safety systems, and profile access. The hourly meetup fee goes directly to your companion (they keep 70%) for their time.", "High (Pricing education)"],
    ["comm_06", "post_05", "Host Economics", "Application Friction", "Negative", "Why do I have to pay ₹99.50 just to apply to become a companion? What if I am rejected?", "The ₹99.50 application fee covers our manual manual ID inspection and background check. If you already hold an active member pass, the application is 100% free!", "High (Supply barrier explanation)"],
    ["comm_07", "post_05", "Income Verification", "Earning Potential", "Positive", "Can college students do this on weekends? How fast is UPI payment?", "Yes! You must be 18+ with valid govt ID. Payouts are transferred directly to your UPI within 24 hours of completing a verified meetup.", "Medium (Host recruitment)"]
]

with open(os.path.join(BASE_DIR, "instagram_comments.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["comment_id", "post_id", "theme", "user_intent", "sentiment", "user_statement", "brand_response", "actionability"])
    writer.writerows(ig_comments)

# 5. competitors.csv
competitors_data = [
    ["TryCompanio", "Target Platform", "https://trycompanio.in", "New Delhi (National 60+ Cities)", "Pass + Hourly Escrow", "99.50", "30% (32% > ₹1k)", "Urban corporate migrants, fitness enthusiasts, gig goers (20-35)", "Strict platonic promise, manual ID check, escrow, SOS snapshot", "No native mobile app, zero blog SEO, early-stage brand recognition", "Next.js, Vercel, Cloudflare, Razorpay"],
    ["KoPartner", "Direct Competitor", "https://kopartner.in", "Delhi, Mumbai, Bengaluru, Pune", "Advance Booking Fee + Hourly", "1000.00", "20-30% platform margin", "Affluent professionals, elderly, event attendees", "Multi-metro footprint, covers elder care & medical support", "High hourly rates (₹1k-₹2k/hr), dated web interface, manual booking", "WordPress / Custom PHP, Razorpay"],
    ["Snapmate", "Direct Competitor", "https://snapmate.in", "Gurugram, Delhi NCR", "Hourly Concierge Tier", "1000.00", "25-30% cut", "High-net-worth urbanites, solo event attendees", "Clear tiered hourly menu, concierge brand framing", "Prohibitive pricing for youth, feels like staffing rather than friendship", "React / Node.js, Razorpay"],
    ["RentalFriend.in", "Direct Competitor", "https://rentalfriend.in", "Mumbai, Pune, Delhi", "Package Duration Plans", "299.00", "Fixed margin (~35%)", "Budget-conscious youth, college students, wedding plus-one seekers", "Extremely low cost (₹299 for 3 hrs), clear platonic positioning", "Low companion payouts lead to high flake/cancellation rates, poor tech", "Core PHP / Bootstrap"],
    ["Friendy", "Direct Competitor", "https://friendy.in", "Pan-India (Tier 1 & 2)", "In-App Coin Micro-transactions", "50.00", "Variable (30-40%)", "Tier-2 Android users seeking casual companionship", "Google Play native app, peer-driven rate setting", "Spam/fake profile vulnerability, low retention, paywall chat friction", "Android Native (Java/Kotlin), Firebase"],
    ["PlusOneStar", "Direct Competitor", "https://plusonestar.com", "Bengaluru, Mumbai", "Zero-Custody P2P (0% Commission)", "0.00", "0% (Freemium add-ons)", "Gen Z, tech-savvy event-goers, concert attendees", "3D biometric liveness KYC, 0% platform take-rate, privacy-first", "Relies entirely on peer negotiation, low monetization runway", "React PWA, WebAuthn, Stripe/UPI"],
    ["RentAFriend.com", "Global Benchmark", "https://rentafriend.com", "Global (US, UK, Canada, India)", "Monthly/Annual Subscription", "1650.00", "0% of hourly (100% sub)", "Expats, tourists, lonely adults worldwide", "Pioneer brand, 600k+ global companions, zero meetup cut", "Extremely dated 2000s web UI, zero safety telemetry, credit card barrier", "Legacy LAMP stack"],
    ["Timeleft", "Indirect Competitor", "https://timeleft.com", "Global (Paris, NY, Mumbai, Bangalore)", "Ticket / Sub + Own Dinner", "400.00", "100% ticket revenue", "Young professionals seeking Wednesday group dinners with 5 strangers", "High psychological safety (group of 6, not 1-on-1), algorithm matching", "Limited to Wednesday dinners; high restaurant meal expense (₹1.5k-₹2.5k)", "React Native, Node.js, Stripe"],
    ["Bumble BFF", "Indirect Competitor", "https://bumble.com/bff", "Global & Pan-India Metros", "Freemium / Premium Boosts", "499.00", "100% subscription", "Young women & urbanites seeking free platonic friends", "Massive brand trust, free core tier, verified selfie badges", "Severe 'swipe & ghost' fatigue, zero commitment, 90%+ conversations die", "Native iOS/Android, C++, Go, Kubernetes"],
    ["FRND App", "Indirect Competitor", "https://frnd.app", "Pan-India (Tier 2/3 focus)", "Audio Chat Coins & Virtual Gifting", "20.00", "50%+ margin on coin economy", "Bharat / vernacular youth seeking virtual companionship", "Krafton-backed, highly engaging gamified audio rooms, massive scale", "Purely virtual/audio (no real-life public meetups), romantic undertones", "Flutter, Go, WebRTC, AWS"],
    ["Playace", "Indirect Competitor", "https://playace.co", "Bengaluru, Mumbai, Delhi", "House Party Cover Charge", "800.00", "20-25% split with host", "Weekend socializers seeking curated house parties & board games", "Vibrant community, alcohol/food included, high social energy", "Limited to domestic spaces/house parties; irregular weekend schedules", "Next.js, Supabase, Razorpay"]
]

with open(os.path.join(BASE_DIR, "competitors.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["competitor_name", "competitor_type", "website_url", "geographic_coverage", "pricing_model", "base_price_inr", "platform_cut", "target_demographics", "core_strengths", "core_weaknesses", "tech_stack"])
    writer.writerows(competitors_data)

# 6. customer_feedback.csv
feedback_data = [
    ["fb_01", "Instagram Comments", "@trycompanio", "Corporate Migrant (Bengaluru)", "Isolation & Loneliness", "I moved from Jaipur to Bangalore for my tech job. Outside office hours I barely speak 10 words a day. This concept actually makes sense if it's safe.", "Positive", "Companionship without romantic expectations", "Low"],
    ["fb_02", "Reddit Community", "r/StartupIndia", "Early Adopter (Delhi)", "Pricing & Value Transparency", "Why should I pay ₹99 just to view profiles and then pay the companion ₹500/hr? If they decline my booking do I lose my money?", "Mixed", "Refund certainty and clear value proposition", "Medium"],
    ["fb_03", "Instagram Comments", "@get_companio", "Young Female Professional (Mumbai)", "Personal Safety & Trust", "What happens if a male user books a female companion and acts inappropriately? What is the emergency support?", "Negative (Concern)", "Physical security, immediate distress response, background checks", "High"],
    ["fb_04", "ScamAdviser / Gridinsoft", "Web Search", "Cautious Consumer", "Platform Legitimacy", "Company is only incorporated recently (May 2026). No founder LinkedIn or registered office pictures. Need to ensure it's not an online scam.", "Neutral", "Corporate transparency, registered LLP credentials, founder visibility", "Medium"],
    ["fb_05", "Instagram Comments", "@trycompanio", "Prospective Host (Pune)", "Host Economics", "Charging ₹99 just to submit my Aadhaar and get verified feels scammy. Most gig apps verify for free and take commission later.", "Negative", "Frictionless companion onboarding without upfront fees", "High"],
    ["fb_06", "Web Experience Preview", "trycompanio.in", "Event Goer (Delhi)", "Activity Specificity", "I have an extra ticket to Diljit's concert in Delhi because my friend got sick. Booking a music buddy for 3 hours is way better than wasting ₹6,000 ticket.", "Positive", "Specific use-case validation (concert plus-one)", "Low"]
]

with open(os.path.join(BASE_DIR, "customer_feedback.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["feedback_id", "source_type", "channel_or_handle", "user_persona", "category", "verbatim_observation", "sentiment", "underlying_need", "brand_risk_level"])
    writer.writerows(feedback_data)

# 7. sources.csv
sources_data = [
    ["src_01", "TryCompanio Official Website", "https://www.trycompanio.in/", "Primary Portal", "Verified Primary", "2026-11-17", "Homepage, pass tiers, activity taxonomy, safety protocols, 126 cities, 1.2L+ signups"],
    ["src_02", "TryCompanio Safety Centre", "https://www.trycompanio.in/safety", "Primary Portal", "Verified Primary", "2026-11-17", "Platonic promise, SOS location sharing, grievance officer, hotline +91 91794 93270"],
    ["src_03", "TryCompanio Host Portal", "https://www.trycompanio.in/become-a-companion", "Primary Portal", "Verified Primary", "2026-11-17", "70% payout share, ₹99.50 host fee, 4-step KYC submission, UPI settlements"],
    ["src_04", "TryCompanio Legal & Refunds", "https://www.trycompanio.in/refunds", "Legal / Compliance", "Verified Primary", "2026-11-17", "Closed-loop wallet rules, 12% cashout fee, Consumer Protection Act 2019 compliance"],
    ["src_05", "Ministry of Corporate Affairs (MCA)", "https://www.zaubacorp.com/company/TRYCOMPANIOLABS-LLP/ACY-1464", "Corporate Registry", "Verified Primary", "2026-11-17", "LLPIN ACY-1464, inc. 14-May-2026, Designated Partners Hardik Kedar & Prashant Yadav, DLF Prime Tower Okhla Delhi"],
    ["src_06", "TryCompanio Instagram Profile", "https://www.instagram.com/trycompanio/", "Social Media", "Verified Primary", "2026-11-17", "Bio, highlights, content pillars, reels hooks, comment intelligence, follower sentiment"],
    ["src_07", "KoPartner Official Portal", "https://kopartner.in/", "Competitor Portal", "Verified Secondary", "2026-11-17", "Pricing ₹1k-₹2k/hr, metro footprint, companion categories, advance fee"],
    ["src_08", "RentalFriend India", "https://rentalfriend.in/", "Competitor Portal", "Verified Secondary", "2026-11-17", "Pricing ₹299 for 3 hrs, package model, Delhi/Mumbai/Pune focus"],
    ["src_09", "PlusOneStar PWA", "https://plusonestar.com/", "Competitor Portal", "Verified Secondary", "2026-11-17", "Zero-custody P2P model, 0% commission, 3D biometric KYC, concert companion focus"],
    ["src_10", "ScamAdviser Trust Scan", "https://www.scamadviser.com/check-website/trycompanio.in", "Security & Reputation", "Verified Secondary", "2026-11-17", "Trust score 76-79/100, Let's Encrypt SSL, GoDaddy registrar, privacy DNS"],
    ["src_11", "Gridinsoft Security Check", "https://gridinsoft.com/online-virus-scanner/url/trycompanio.in", "Security & Reputation", "Verified Secondary", "2026-11-17", "Safety rating 57/100, clean blacklist history, young domain analysis"],
    ["src_12", "India Loneliness Economy Report", "https://www.business-standard.com/markets/news/loneliness-economy-india-startups", "Market Intelligence", "Verified Secondary", "2026-11-17", "43-58% urban loneliness prevalence, 600M domestic migrants, $7.9B AI & companion market 2030 projection"]
]

with open(os.path.join(BASE_DIR, "sources.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["source_id", "entity_or_title", "source_url", "source_category", "verification_level", "access_date", "key_data_extracted"])
    writer.writerows(sources_data)

print("All 7 CSV datasets written successfully to", BASE_DIR)
