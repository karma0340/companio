import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Companio | Connect, Meet, and Experience the City Together",
  description: "India's premier on-demand platonic companionship platform for public activities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[#102A43] antialiased">
        {children}
      </body>
    </html>
  );
}
