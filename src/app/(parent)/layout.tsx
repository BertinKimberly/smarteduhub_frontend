
import DashboardSidebar from "@/components/DashboardSidebar";
import React, { ReactNode } from "react";

const ParentLayout = ({ children }: { children: ReactNode }) => {
   return (
      <div className="p-2 flex gap-3 overflow-hidden">
         <DashboardSidebar role="parent" />
         <div className="border border-main w-full h-screen rounded-lg overflow-y-scroll">
            {children}
         </div>
      </div>
   );
};

export default ParentLayout;
