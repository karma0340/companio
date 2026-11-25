import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Verified Host",
  description:
    "Register once with OTP verification (INR 113 incl. all due taxes), host 100% platonic public meetups, and keep 70% fixed payout per session.",
};

export default function BecomeACompanionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
