import type { Metadata } from "next";
import { Inter, Caveat, Outfit, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Companio | Never go alone.",
  description: "Explore your city with a local companion. Coffee, walks, and gigs with someone who knows the city. Strictly platonic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${outfit.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-[#FBFCFF] text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
