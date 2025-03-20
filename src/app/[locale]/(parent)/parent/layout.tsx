"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}