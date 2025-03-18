//@ts-nocheck
"use client";

import { useGetStudentAssignments } from "@/hooks/useAssignments";
import { TrendingUp, BookOpen } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   ChartConfig,
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";

// Dummy data to make the chart look amazing
const dummyAssignments = [
  { id: 1, title: "Math Quiz", subject: "Mathematics", created_at: "2025-01-05", score: 92 },
  { id: 2, title: "History Essay", subject: "History", created_at: "2025-01-15", score: 88 },
  { id: 3, title: "Science Lab Report", subject: "Science", created_at: "2025-01-25", score: 95 },
  { id: 4, title: "Literature Analysis", subject: "English", created_at: "2025-02-03", score: 87 },
  { id: 5, title: "Geography Project", subject: "Geography", created_at: "2025-02-12", score: 91 },
  { id: 6, title: "Physics Problem Set", subject: "Science", created_at: "2025-02-22", score: 84 },
  { id: 7, title: "Poetry Analysis", subject: "English", created_at: "2025-03-05", score: 89 },
  { id: 8, title: "Chemistry Lab", subject: "Science", created_at: "2025-03-15", score: 93 },
  { id: 9, title: "Art History Essay", subject: "Art", created_at: "2025-03-20", score: 96 },
  { id: 10, title: "Calculus Test", subject: "Mathematics", created_at: "2025-03-28", score: 90 },
];

export function AssignmentChart() {
   // Use dummy data instead of the hook (for demo purposes)
   // const { data: assignments } = useGetStudentAssignments();
   const assignments = dummyAssignments;

   // Process assignments data to get monthly stats
   const monthlyData = assignments.reduce((acc, assignment) => {
      const month = new Date(assignment.created_at).getMonth();
      const monthName = new Date(assignment.created_at).toLocaleString(
         "default",
         { month: "short" }
      );
      
      const existingMonth = acc.find((item) => item.month === monthName);
      if (existingMonth) {
         existingMonth.count += 1;
         existingMonth.avgScore = (existingMonth.avgScore * (existingMonth.count - 1) + assignment.score) / existingMonth.count;
      } else {
         acc.push({ 
            month: monthName, 
            count: 1, 
            avgScore: assignment.score,
            name: monthName
         });
      }
      return acc;
   }, []);

   // Sort by month for proper display
   monthlyData.sort((a, b) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.indexOf(a.month) - months.indexOf(b.month);
   });

   const chartConfig = {
      count: {
         label: "Assignments",
         color: "hsl(var(--chart-1))",
      },
      avgScore: {
         label: "Avg Score",
         color: "hsl(var(--chart-2))",
      }
   };

   const totalAssignments = assignments.length;
   const avgScore = Math.round(assignments.reduce((sum, assignment) => sum + assignment.score, 0) / totalAssignments);
   const trend = monthlyData.length > 1 ? 
      monthlyData[monthlyData.length-1].count - monthlyData[0].count : 0;

   return (
      <Card className="border shadow-md">
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <CardTitle className="text-xl font-semibold">Assignment Progress</CardTitle>
               <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{trend >= 0 ? `+${trend}` : trend} this quarter</span>
               </div>
            </div>
            <CardDescription className="text-gray-500">
               Total assignments: {totalAssignments} | Average score: {avgScore}%
            </CardDescription>
         </CardHeader>
         <CardContent>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                     data={monthlyData}
                     margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="month" />
                     <YAxis yAxisId="left" />
                     <YAxis yAxisId="right" orientation="right" />
                     <Tooltip />
                     <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="count"
                        name="Assignments"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ fill: "#8884d8", strokeWidth: 2 }}
                        activeDot={{ r: 8 }}
                     />
                     <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgScore"
                        name="Avg Score"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ fill: "#82ca9d", strokeWidth: 2 }}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </CardContent>
         <CardFooter className="pt-0">
            <div className="flex items-center text-sm text-gray-500">
               <BookOpen className="h-4 w-4 mr-2" />
               Showing data from January to March 2025
            </div>
         </CardFooter>
      </Card>
   );
}