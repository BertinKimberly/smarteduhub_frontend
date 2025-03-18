"use client";
import React from "react";
import { useGetAllAssignments } from "@/hooks/useAssignments";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import DashboardNavbar from "@/components/DashboardNavbar";

interface Assignment {
   id: string;
   title: string;
   description: string;
   google_form_url?: string;
   course: {
      id: string;
      title: string;
   };
}

const columns: ColumnDef<Assignment>[] = [
   { accessorKey: "id", header: "ID" },
   { accessorKey: "title", header: "Title" },
   { accessorKey: "description", header: "Description" },
   {
      accessorKey: "google_form_url",
      header: "Google Form URL",
      cell: ({ row }) => {
         const url = row.getValue("google_form_url");
         return url ? (
            <a
               href={url as string}
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-600 hover:underline"
            >
               View Form
            </a>
         ) : (
            "No form attached"
         );
      },
   },
   {
      accessorKey: "course.title",
      header: "Course",
      cell: ({ row }) => row.original.course?.title || "N/A",
   },
];

const AdminAssignmentsPage = () => {
   const { data, error, isLoading } = useGetAllAssignments();

   if (isLoading) return <div>Loading...</div>;
   if (error) return <div>Error loading assignments</div>;

   return (
      <>
      <DashboardNavbar title="Assignments"/>
      <div className="p-2">
         <h1 className="text-2xl font-bold mb-4">Admin Assignments</h1>
         <DataTable
            columns={columns}
            data={data || []}
         />
      </div>
      </>
   );
};

export default AdminAssignmentsPage;
