import DashboardSidebar from "@/components/DashboardSidebar";
import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
   return (
      <div className="flex gap-3 min-h-screen p-2">
         <DashboardSidebar role="admin" />
         <main className="flex-1 relative">{children}</main>
      </div>
   );
};

export default AdminLayout;
