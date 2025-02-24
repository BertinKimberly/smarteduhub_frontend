"use client";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import React from "react";

import {
   ChartConfig,
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
   { month: "January", activeUsers: 2450, courseEnrollments: 1800 },
   { month: "February", activeUsers: 2800, courseEnrollments: 2100 },
   { month: "March", activeUsers: 3200, courseEnrollments: 2400 },
   { month: "April", activeUsers: 3600, courseEnrollments: 2800 },
   { month: "May", activeUsers: 4100, courseEnrollments: 3200 },
   { month: "June", activeUsers: 4500, courseEnrollments: 3600 },
   { month: "July", activeUsers: 4800, courseEnrollments: 3900 },
   { month: "August", activeUsers: 5200, courseEnrollments: 4300 },
   { month: "September", activeUsers: 5600, courseEnrollments: 4700 },
   { month: "October", activeUsers: 6000, courseEnrollments: 5100 },
   { month: "November", activeUsers: 6400, courseEnrollments: 5500 },
   { month: "December", activeUsers: 6800, courseEnrollments: 5900 },
];

const chartConfig = {
   activeUsers: {
      label: "Active Users",
      color: "#1782CF",
   },
   courseEnrollments: {
      label: "Course Enrollments",
      color: "#42f554",
   },
} satisfies ChartConfig;

const AdminOveralChart = () => {
   return (
      <div>
         <Card className="border-none shadow-none">
            <CardHeader>
               <CardTitle>Platform Usage Metrics</CardTitle>
               <CardDescription>Year 2024</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="overflow-x-auto">
                  <ChartContainer
                     config={chartConfig}
                     className="h-[200px] min-w-[800px]"
                  >
                     <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                           left: 1,
                           right: 1,
                        }}
                     >
                        <CartesianGrid vertical={false} />
                        <XAxis
                           dataKey="month"
                           tickLine={false}
                           axisLine={false}
                           tickMargin={2}
                           tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                           cursor={false}
                           content={<ChartTooltipContent />}
                        />
                        <Line
                           dataKey="activeUsers"
                           type="monotone"
                           stroke="#1782CF"
                           strokeWidth={2}
                           dot={false}
                        />
                        <Line
                           dataKey="courseEnrollments"
                           type="monotone"
                           stroke="#EFF6FF"
                           strokeWidth={2}
                           dot={false}
                        />
                     </LineChart>
                  </ChartContainer>
               </div>
            </CardContent>
            <CardFooter>
               <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                     <div className="flex items-center gap-2 font-medium leading-none">
                        Growth in platform usage: 178% YoY{" "}
                        <TrendingUp className="h-4 w-4" />
                     </div>
                     <div className="flex items-center gap-2 leading-none text-muted-foreground">
                        Showing active users and course enrollments for the
                        entire year
                     </div>
                  </div>
               </div>
            </CardFooter>
         </Card>
      </div>
   );
};

export default AdminOveralChart;
