import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Caveat, Outfit, Fraunces, Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { CelebrationOverlay } from "@/components/ui/celebration";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

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
  title: {
    default: "Meetzy Club — Find a Buddy, Not a Date | Hire Verified Local Companions",
    template: "%s | Meetzy Club",
  },
  description:
    "Looking for a gym partner, movie buddy, or coffee companion? Connect with ID-verified local buddies across India. 100% platonic, escrow-safe, public places only. Zero awkwardness.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${outfit.variable} ${fraunces.variable} ${bricolage.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased font-sans">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <AuthProvider>
          <ToastProvider>
            <CelebrationOverlay />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
