"use client";
import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useFetchUsers } from "@/hooks/useUsers";
import RoleFilter from "./RoleFilter";

interface User {
   name: string;
   email: string;
   role: string;
}

const columns: ColumnDef<User>[] = [
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "email",
      header: "Email",
   },
   {
      accessorKey: "phone",
      header: "Phone",
   },
   {
      accessorKey: "username",
      header: "Username",
   },
   {
      accessorKey: "role",
      header: "Role",
   },
];

const UsersTable = () => {
   const { data: userData, isPending: isUserPending } = useFetchUsers();
   const [selectedRole, setSelectedRole] = useState("all");

   const filteredData = useMemo(() => {
      if (!userData) return [];
      if (selectedRole === "all") return userData;
      return userData.filter(
         (user) => user.role.toLowerCase() === selectedRole
      );
   }, [userData, selectedRole]);

   return (
      <div className="space-y-4 mt-10">
         <RoleFilter
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
         />
         <DataTable
            columns={columns}
            data={filteredData}
         />
      </div>
   );
};

export default UsersTable;
