"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
   Book,
   Pen,
   Star,
   Calendar,
   Bell,
   BarChart3,
   PieChart,
} from "lucide-react";
import Link from "next/link";
import {
   LineChart,
   Line,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
   PieChart as RechartPieChart,
   Pie,
   Cell,
} from "recharts";
import DashboardNavbar from "@/components/DashboardNavbar";
import CustomCard from "@/components/CustomCard";
import ParentLineChart from "@/components/parent/ParentLineChart";
import ParentBarChart from "@/components/parent/ParentBarChart";

const activityData = [
   { name: "Completed", value: 68, color: "#979205" },
   { name: "In Progress", value: 23, color: "#FEB185" },
   { name: "Not Started", value: 9, color: "#8495B2" },
];

const cardData = [
   {
      icon: Book,
      desc: "Child's Enrolled Courses",
      title: `${4} Courses`,
      color: "#979205",
   },
   {
      icon: Star,
      desc: "Average Performance",
      title: "87%",
      color: "#FEB185",
   },
   {
      icon: Pen,
      desc: "Pending Assignments",
      title: `${5} Tasks`,
      color: "#8495B2",
   },
   {
      icon: Calendar,
      desc: "Attendance Rate",
      title: "95%",
      color: "#311D4A",
   },
];

const ParentHome = () => {
   const upcomingEvents = [
      {
         title: "Parent-Teacher Meeting",
         date: "March 2, 2025",
         time: "5:00 PM",
      },
      {
         title: "Science Fair Project Due",
         date: "March 10, 2025",
         time: "3:30 PM",
      },
      { title: "Spring Break Begins", date: "March 15, 2025", time: "All Day" },
   ];

   const recentNotifications = [
      { message: "Emma completed Math Quiz with 92%", time: "2 hours ago" },
      { message: "New assignment added in Science", time: "Yesterday" },
      { message: "Term project guidelines updated", time: "2 days ago" },
   ];

   return (
      <div className="p-3">
         {/* Dashboard Header */}
         <DashboardNavbar title="Parent" />

         {/* Child's Progress */}
         <div className="flex flex-col gap-2 w-full md:w-[40%] my-6">
            <div className="flex justify-between items-center">
               <h4 className="font-medium">Overall Progress</h4>
               <span className="text-sm text-gray-500">87% Complete</span>
            </div>
            <Progress
               value={87}
               className="h-2"
            />
         </div>

         {/* Summary Cards */}
         <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4 mb-6">
            {cardData.map((d, i) => (
               <CustomCard
                  key={i}
                  icon={d.icon}
                  desc={d.desc}
                  title={d.title}
                  color={d.color}
               />
            ))}
         </section>

         {/* Charts Section */}
         <section className="rounded-lg mt-6 flex gap-6 flex-col md:flex-row">
            <ParentLineChart />
            <ParentBarChart />
         </section>

         {/* Activity and Upcoming Events */}
         <section className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border p-4 rounded-lg col-span-1">
               <h3 className="font-medium mb-4">Assignment Completion</h3>
               <div className="h-64">
                  <ResponsiveContainer
                     width="100%"
                     height="100%"
                  >
                     <RechartPieChart>
                        <Pie
                           data={activityData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {activityData.map((entry, index) => (
                              <Cell
                                 key={`cell-${index}`}
                                 fill={entry.color}
                              />
                           ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                     </RechartPieChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="border p-4 rounded-lg col-span-1">
               <div className="flex items-center justify-between w-full mb-4">
                  <h3 className="font-medium">Upcoming Events</h3>
                  <Button
                     variant="outline"
                     size="sm"
                  >
                     View All
                  </Button>
               </div>
               <div className="space-y-4">
                  {upcomingEvents.map((event, i) => (
                     <div
                        key={i}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md"
                     >
                        <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                           <p className="font-medium">{event.title}</p>
                           <p className="text-sm text-gray-500">
                              {event.date} • {event.time}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="border p-4 rounded-lg col-span-1">
               <div className="flex items-center justify-between w-full mb-4">
                  <h3 className="font-medium">Recent Notifications</h3>
                  <Button
                     variant="outline"
                     size="sm"
                  >
                     View All
                  </Button>
               </div>
               <div className="space-y-4">
                  {recentNotifications.map((notification, i) => (
                     <div
                        key={i}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md"
                     >
                        <Bell className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                           <p className="font-medium">{notification.message}</p>
                           <p className="text-sm text-gray-500">
                              {notification.time}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Child's Courses */}
         <section className="my-6">
            <div className="flex items-center justify-between w-full my-4">
               <h3 className="font-medium">Child's Courses</h3>
               <Button
                  className="text-blue-600"
                  variant="outline"
               >
                  View All
               </Button>
            </div>
            {/* Placeholder for courses - would need to implement similar to the student dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[1, 2, 3].map((course) => (
                  <Card
                     key={course}
                     className="hover:shadow-md transition-shadow"
                  >
                     <CardContent className="p-4">
                        <div className="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                           <Book className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="font-medium">Course Title {course}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                           Teacher: Mr. Smith
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                           <Progress
                              value={[75, 60, 45][course - 1]}
                              className="w-2/3 h-2"
                           />
                           <span className="text-sm font-medium">
                              {[75, 60, 45][course - 1]}%
                           </span>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </section>
      </div>
   );
};

export default ParentHome;
