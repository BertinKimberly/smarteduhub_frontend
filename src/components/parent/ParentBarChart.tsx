"use client"
import React from 'react'
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell } from 'recharts';

const gradeData = [
    { subject: 'Math', grade: 85 },
    { subject: 'Science', grade: 92 },
    { subject: 'English', grade: 78 },
    { subject: 'History', grade: 88 },
    { subject: 'Art', grade: 95 },
  ];
  
const ParentBarChart = () => {
  return (
    <div className="border p-4 flex flex-col gap-4 w-full md:w-[50%] rounded-lg">
    <p className="text-transparent bg-clip-text bg-gradient-to-r from-main via-blue-400 to-pink-200">
      Academic Performance
    </p>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={gradeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="grade" fill="#8495B2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
  )
}

export default ParentBarChart
