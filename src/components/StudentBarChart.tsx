"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

   // Process courses data to get monthly enrollment stats
   const monthlyStats =
      courses
         ?.reduce((acc: any[], course: any) => {
            // Use the first enrollment's created_at if available
            const enrollmentDate = new Date(
               course.enrollments?.[0]?.created_at || course.created_at
            );
            const month = enrollmentDate.toLocaleString("default", {
               month: "long",
            });

            const existingMonth = acc.find((item) => item.month === month);
            if (existingMonth) {
               existingMonth.completed += course.progress || 0;
               existingMonth.ongoing += 100 - (course.progress || 0);
            } else {
               acc.push({
                  month,
                  completed: course.progress || 0,
                  ongoing: 100 - (course.progress || 0),
               });
            }
            return acc;
         }, [])
         .slice(-6) || []; // Get last 6 months

   const chartConfig = {
      completed: {
         label: "Completed",
         color: "hsl(var(--chart-1))",
      },
      ongoing: {
         label: "Ongoing",
         color: "hsl(var(--chart-2))",
      },
   };

   return (
      <Card className="border-none shadow-none">
         <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
         </CardHeader>
         <CardContent>
            <ChartContainer config={chartConfig}>
               <BarChart
                  accessibilityLayer
                  data={monthlyStats}
               >
                  <CartesianGrid vertical={false} />
                  <XAxis
                     dataKey="month"
                     tickLine={false}
                     tickMargin={10}
                     axisLine={false}
                     tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                     cursor={false}
                     content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                     dataKey="completed"
                     fill="var(--color-desktop)"
                     radius={4}
                  />
                  <Bar
                     dataKey="ongoing"
                     fill="var(--color-mobile)"
                     radius={4}
                  />
               </BarChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
