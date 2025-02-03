import AdminSidebar from "@/components/AdminSidebar";
import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
   return (
      <div className="p-2 flex gap-3 overflow-hidden">
         <AdminSidebar />
         <div className="border border-main w-full h-screen rounded-lg overflow-y-scroll">
            {children}
         </div>
      </div>
   );
};

export default AdminLayout;
