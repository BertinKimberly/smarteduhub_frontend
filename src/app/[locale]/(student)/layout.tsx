"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useNotificationsWebSocket } from "@/hooks/useNotificationsWebSocket";
import React, { ReactNode } from "react";

const StudentLayout = ({ children }: { children: ReactNode }) => {
     useNotificationsWebSocket();
   return (
      <div className="p-2 flex gap-3 overflow-hidden">
         <DashboardSidebar role="student"/>
         <div className="w-full h-screen rounded-lg overflow-y-scroll">
            {children}
         </div>
      </div>
   );
};

export default StudentLayout;
