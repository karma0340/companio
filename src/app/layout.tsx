import type { Metadata } from "next";
import { Inter, Caveat, Outfit, Fraunces, Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/components/ui/toast";
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
  title: "Companio | Never go alone. Find a Buddy, Not a Date",
  description: "Explore your city with verified local companions across India. Coffee, gym, walks, movies, and city tours. Strictly 100% platonic, escrow-protected, public venues only.",
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
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
