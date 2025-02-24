import DashboardSidebar from "@/components/DashboardSidebar";
import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
   return (
      <div className="p-2 flex gap-3 overflow-hidden">
         <DashboardSidebar role="teacher"/>
         <div className="w-full h-screen rounded-lg overflow-y-scroll">
            {children}
         </div>
      </div>
   );
};

export default AdminLayout;
