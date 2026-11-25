import type { Metadata } from "next";
import Script from "next/script";
import { Caveat, Outfit, Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { CelebrationOverlay } from "@/components/ui/celebration";
import { ScrollManager } from "@/components/layout/scroll-manager";
import { CompareTray } from "@/components/companion/compare-tray";
import { getInitialAuthSnapshot } from "@/lib/server-auth";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Meetzy Club",
  title: {
    default: "Meetzy Club — Find a Buddy, Not a Date | Verified Local Companions in India",
    template: "%s | Meetzy Club",
  },
  description:
    "Looking for a gym partner, movie buddy, coffee companion, or city guide? Connect with mobile OTP-verified local hosts across India. 100% platonic, escrow-safe, public venues only.",
  keywords: [
    "platonic companion India",
    "rent a friend India",
    "gym partner Chandigarh",
    "movie buddy Delhi NCR",
    "coffee companion Bengaluru",
    "city walk buddy Mumbai",
    "event plus one India",
    "Meetzy Club",
  ],
  authors: [{ name: "Meetzy Club" }],
  creator: "Meetzy Club",
  publisher: "Meetzy Club",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Meetzy Club",
    title: "Meetzy Club — Find a Buddy, Not a Date | Verified Local Companions",
    description:
      "Book mobile OTP-verified local companions for coffee chats, movies, gym spotting, and city walks across India. 100% platonic, public places only, escrow protected.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 512,
        height: 512,
        alt: "Meetzy Club — Verified Platonic Companions Across India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meetzy Club — Find a Buddy, Not a Date",
    description:
      "Verified local companions for coffee chats, movies, gym, and food walks across India. 100% platonic, public venues only.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Meetzy Club",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      description:
        "India's verified platonic companionship directory for gym partners, movie buddies, coffee chats, and public social meetups.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "meetzyclub@gmail.com",
        contactType: "customer support",
        areaServed: "IN",
      },
    },
    {
      "@type": "WebSite",
      name: "Meetzy Club",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/explore?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialAuth = await getInitialAuthSnapshot();

  return (
    <html
      lang="en"
      className={`${caveat.variable} ${outfit.variable} ${bricolage.variable} ${dmSans.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <AuthProvider initialAuth={initialAuth}>
          <ToastProvider>
            <ScrollManager />
            <CelebrationOverlay />
            {children}
            <CompareTray />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
