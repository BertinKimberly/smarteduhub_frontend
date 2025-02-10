import DashboardNavbar from "@/components/DashboardNavbar";
import TopStudentsTable from "@/components/TopStudentsTable";
import UsersTable from "@/components/UsersTable";
import React from "react";

const AdminStudentsPage = () => {
   return (
      <div className="p-3">
         <DashboardNavbar title="Users" />
         <UsersTable />
      </div>
   );
};

export default AdminStudentsPage;
