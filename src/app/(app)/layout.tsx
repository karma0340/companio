import React from "react";
import AppShellLayout from "@/components/marketplace/AppShellLayout";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShellLayout>{children}</AppShellLayout>;
}
