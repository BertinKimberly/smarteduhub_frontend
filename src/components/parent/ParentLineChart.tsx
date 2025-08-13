"use client"
import React from 'react'
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const attendanceData = [
    { month: 'Jan', attendance: 95 },
    { month: 'Feb', attendance: 97 },
    { month: 'Mar', attendance: 92 },
    { month: 'Apr', attendance: 98 },
    { month: 'May', attendance: 96 },
    { month: 'Jun', attendance: 94 },
  ];

const ParentLineChart = () => {
  return (
    <div className="border p-4 flex flex-col gap-4 w-full md:w-[50%] rounded-lg">
             <p className="font-medium">Attendance Overview</p>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={attendanceData}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="month" />
                   <YAxis domain={[80, 100]} />
                   <Tooltip />
                   <Legend />
                   <Line 
                     type="monotone" 
                     dataKey="attendance" 
                     stroke="#1782CF" 
                     strokeWidth={2} 
                     activeDot={{ r: 8 }} 
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
             <Link href="/parent/attendance" className="text-blue-600">
               View Full Attendance Report
             </Link>
           </div>
  )
}

export default ParentLineChart
