"use client";

import React from 'react';
import { useNotificationsWebSocket } from "@/hooks/useNotificationsWebSocket";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useNotificationsWebSocket();
  
  return <>{children}</>;
}
