"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DataTable } from "./DataTable";
import clsx from "clsx";
interface Student {
   name: string;
   email: string;
   performance: number;
}
const getStatus = (performance: number | null) => {
   if (performance === null) return "No performance";
   if (performance > 80) return "Excellent";
   if (performance > 60) return "Very Good";
   if (performance > 50) return "Good";
   return "Bad";
};

const getStatusStyles = (status: string) => {
   switch (status) {
      case "Excellent":
         return { textColor: "text-green-800", bgColor: "bg-green-100" };
      case "Very Good":
         return { textColor: "text-yellow-800", bgColor: "bg-yellow-100" };
      case "Good":
         return { textColor: "text-orange-800", bgColor: "bg-orange-100" };
      case "Bad":
         return { textColor: "text-red-800", bgColor: "bg-red-100" };
      case "No Rating":
         return { textColor: "text-gray-800", bgColor: "bg-gray-100" };
      default:
         return { textColor: "text-gray-800", bgColor: "bg-gray-100" };
   }
};

const getAverageRating = (performance: number[]) => {
   if (!performance || performance.length === 0) return null;
   const total = performance.reduce((acc, curr) => acc + curr, 0);
   return Math.round((total / performance.length) * 20);
};

const getProgressBarColor = (rating: number) => {
   if (rating > 80) return "#4caf50";
   if (rating > 60) return "#ffeb3b";
   if (rating > 50) return "#ff9800";
   return "#f44336";
};

const columns: ColumnDef<Student>[] = [
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "email",
      header: "Email",
   },

   {
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => {
         const performance = row.original.performance;
         const status = getStatus(performance);
         const { textColor, bgColor } = getStatusStyles(status);
         return (
            <span
               className={clsx(
                  "rounded text-xs p-2 whitespace-nowrap",
                  textColor,
                  bgColor
               )}
            >
               {status}
            </span>
         );
      },
   },
   {
      accessorKey: "averagePerformance",
      header: "Average Performance",
      cell: ({ row }) => {
         const performance = row.original.performance;
         if (performance === null) {
            return <span>No Performance</span>;
         }
         const color = getProgressBarColor(performance);
         return (
            <div style={{ width: 50, height: 50, margin: "0 auto" }}>
               <CircularProgressbar
                  value={performance}
                  text={`${performance}%`}
                  styles={buildStyles({
                     textColor: "#000",
                     pathColor: color,
                     trailColor: "#d6d6d6",
                  })}
               />
            </div>
         );
      },
   },
];
const dummyStudents = [
   {
      name: "John Doe",
      email: "john.doe@example.com",
      performance: 80,
   },
   {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      performance: 65,
   },
   {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      performance: 90,
   },
   {
      name: "Bob Brown",
      email: "bob.brown@example.com",
      performance: 55,
   },
];
const TopStudentsTable = () => {
   return (
      <div>
         <DataTable
            columns={columns}
            data={dummyStudents}
         />
      </div>
   );
};

export default TopStudentsTable;
