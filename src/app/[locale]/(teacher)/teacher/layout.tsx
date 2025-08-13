"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
