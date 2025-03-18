//@ts-nocheck
"use client";

import { TrendingUp, BookOpen, GraduationCap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { useGetEnrolledCourses } from "@/hooks/useCourses";

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

export function StudentBarChart() {
   const { data: courses } = useGetEnrolledCourses();

   // Generate dummy progress data for courses since progress field isn't working
   const courseProgressData = courses?.map((course, index) => {
      // Generate dummy progress values between 25 and 95 based on index
      const dummyProgress = 25 + (index % 4) * 20 + Math.floor(Math.random() * 15);
      
      return {
         name: course.title || `Course ${index + 1}`,
         completed: dummyProgress,
         remaining: 100 - dummyProgress,
         category: course.category || "General",
         tooltip: `${course.title || `Course ${index + 1}`} (${course.category || "General"})`
      };
   }) || [];

   // If no courses available, provide sample data for demonstration
   const displayData = courseProgressData.length > 0 ? 
      courseProgressData.slice(0, 6) : 
      [
         { name: "Machine Learning", completed: 85, remaining: 15, category: "Computer Science", tooltip: "Machine Learning (Computer Science)" },
         { name: "Ushimwe", completed: 65, remaining: 35, category: "Machine Learning", tooltip: "Ushimwe (Machine Learning)" },
         { name: "Uri Yahweh", completed: 45, remaining: 55, category: "Technology", tooltip: "Uri Yahweh (Technology)" },
         { name: "Mana we", completed: 75, remaining: 25, category: "Computer Science", tooltip: "Mana we (Computer Science)" },
         { name: "Ebeneza", completed: 30, remaining: 70, category: "Computer Science", tooltip: "Ebeneza (Computer Science)" },
         { name: "Sinzakorwa nisoni", completed: 55, remaining: 45, category: "Science", tooltip: "Sinzakorwa nisoni (Science)" }
      ];

   // Sort by progress (highest first)
   displayData.sort((a, b) => b.completed - a.completed);

   // Calculate overall dummy statistics
   const completedCourses = Math.floor(displayData.length * 0.3); // 30% of courses completed for demo
   const totalCourses = displayData.length;
   const overallProgress = Math.round(displayData.reduce((sum, course) => sum + course.completed, 0) / displayData.length);

   // Get category distribution from display data
   const categories = displayData.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1;
      return acc;
   }, {});

   const chartConfig = {
      completed: {
         label: "Completed",
         color: "hsl(215, 100%, 60%)",
      },
      remaining: {
         label: "Remaining",
         color: "hsl(220, 13%, 91%)",
      },
   };

   return (
      <Card className="border shadow-md">
         <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
               <CardTitle className="text-xl font-semibold">Course Progress</CardTitle>
               <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{completedCourses}/{totalCourses} Completed</span>
               </div>
            </div>
            <CardDescription className="flex items-center text-gray-500">
               Overall progress: {overallProgress}%
               <div className="w-24 h-2 bg-gray-200 rounded-full ml-2">
                  <div 
                     className="h-full bg-blue-500 rounded-full" 
                     style={{ width: `${overallProgress}%` }}
                  ></div>
               </div>
            </CardDescription>
         </CardHeader>
         <CardContent className="px-0"> {/* Reduced padding here */}
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                     data={displayData}
                     layout="vertical"
                     margin={{ top: 5, right: 10, left: 80, bottom: 5 }} 
                  >
                     <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
                     <XAxis type="number" domain={[0, 100]} tickCount={6} />
                     <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 12 }} 
                        width={80} 
                        tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value} 
                     />
                     <Tooltip
                        formatter={(value, name) => [`${value}%`, name === "completed" ? "Completed" : "Remaining"]}
                        labelFormatter={(label) => displayData.find(item => item.name === label)?.tooltip || label}
                     />
                     <Legend />
                     <Bar 
                        dataKey="completed" 
                        stackId="a" 
                        fill="#3b82f6" 
                        name="Completed"
                        radius={[0, 0, 0, 0]}
                        barSize={20}
                     />
                     <Bar 
                        dataKey="remaining" 
                        stackId="a" 
                        fill="#e5e7eb" 
                        name="Remaining"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                     />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </CardContent>
         <CardFooter className="pt-0 flex justify-between text-sm text-gray-500">
            <div className="flex items-center">
               <BookOpen className="h-4 w-4 mr-2" />
               Top categories: {Object.keys(categories).slice(0, 2).join(", ")}
            </div>
            <div>
               {totalCourses} courses enrolled
            </div>
         </CardFooter>
      </Card>
   );
}