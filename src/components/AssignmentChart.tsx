"use client";

import { useGetStudentAssignments } from "@/hooks/useAssignments";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart } from "recharts";

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

export function AssignmentChart() {
   const { data: assignments } = useGetStudentAssignments();

   // Process assignments data to get monthly stats
   const monthlyData =
      assignments?.reduce((acc: any[], assignment: any) => {
         const month = new Date(assignment.created_at).getMonth();
         const monthName = new Date(assignment.created_at).toLocaleString(
            "default",
            { month: "long" }
         );

         const existingMonth = acc.find((item) => item.month === monthName);
         if (existingMonth) {
            existingMonth.count += 1;
         } else {
            acc.push({ month: monthName, count: 1 });
         }
         return acc;
      }, []) || [];

   const chartConfig = {
      count: {
         label: "Assignments",
         color: "hsl(var(--chart-1))",
      },
   };

   return (
      <Card className="border-none shadow-none">
         <CardContent>
            <ChartContainer config={chartConfig}>
               <LineChart
                  accessibilityLayer
                  data={monthlyData}
                  margin={{ top: 24, left: 24, right: 24 }}
               >
                  <CartesianGrid vertical={false} />
                  <ChartTooltip
                     cursor={false}
                     content={
                        <ChartTooltipContent
                           indicator="line"
                           nameKey="count"
                        />
                     }
                  />
                  <Line
                     dataKey="count"
                     type="natural"
                     stroke="var(--color-visitors)"
                     strokeWidth={2}
                     dot={{ fill: "var(--color-visitors)" }}
                     activeDot={{ r: 6 }}
                  >
                     <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                        dataKey="month"
                     />
                  </Line>
               </LineChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
