"use client";
import React from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomCard from "@/components/CustomCard";
import { Book, Star, Pen, Users, Calendar, Bell, PieChart } from "lucide-react";
import {
   ResponsiveContainer,
   PieChart as RechartPieChart,
   Pie,
   Cell,
   Tooltip,
   Legend,
} from "recharts";
import ParentLineChart from "@/components/parent/ParentLineChart";
import ParentBarChart from "@/components/parent/ParentBarChart";

const cardData = [
   {
      icon: Book,
      desc: "Total Available Courses",
      title: `${20} Courses`,
      color: "#979205",
   },
   {
      icon: Star,
      desc: "Total Completed Projects",
      title: `${20} Courses`,
      color: "#FEB185",
   },
   {
      icon: Pen,
      desc: "Total Completed Assignments",
      title: `${30} assignments`,
      color: "#8495B2",
   },
   {
      icon: Users,
      desc: "All Students enrolled in same courses",
      title: `${40} Students`,
      color: "#311D4A",
   },
];

const classActivityData = [
   { name: "Active", value: 45, color: "#979205" },
   { name: "Completed", value: 35, color: "#FEB185" },
   { name: "Upcoming", value: 20, color: "#8495B2" },
];

const DashboardPage = () => {
   const upcomingClasses = [
      {
         title: "Advanced Mathematics",
         date: "March 1, 2025",
         time: "10:00 AM",
      },
      {
         title: "Physics Lab Session",
         date: "March 2, 2025",
         time: "2:00 PM",
      },
      {
         title: "Chemistry Class",
         date: "March 3, 2025",
         time: "11:30 AM",
      },
   ];

   const recentUpdates = [
      { message: "New assignment submitted by John Doe", time: "1 hour ago" },
      { message: "Class schedule updated for Physics", time: "3 hours ago" },
      { message: "5 students completed the quiz", time: "Yesterday" },
   ];

   return (
      <div className="p-3">
         <DashboardNavbar title="Teacher" />
         
       
         {/* Summary Cards */}
         <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4 mb-6 py-8">
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

         {/* Class Activities and Updates */}
         <section className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border p-4 rounded-lg col-span-1">
               <h3 className="font-medium mb-4">Class Activities</h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <RechartPieChart>
                        <Pie
                           data={classActivityData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {classActivityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
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
                  <h3 className="font-medium">Upcoming Classes</h3>
                  <Button variant="outline" size="sm">View All</Button>
               </div>
               <div className="space-y-4">
                  {upcomingClasses.map((event, i) => (
                     <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
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
                  <h3 className="font-medium">Recent Updates</h3>
                  <Button variant="outline" size="sm">View All</Button>
               </div>
               <div className="space-y-4">
                  {recentUpdates.map((update, i) => (
                     <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                        <Bell className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                           <p className="font-medium">{update.message}</p>
                           <p className="text-sm text-gray-500">{update.time}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Active Courses */}
         <section className="my-6">
            <div className="flex items-center justify-between w-full my-4">
               <h3 className="font-medium">Active Courses</h3>
               <Button className="text-blue-600" variant="outline">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[1, 2, 3].map((course) => (
                  <Card key={course} className="hover:shadow-md transition-shadow">
                     <CardContent className="p-4">
                        <div className="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                           <Book className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="font-medium">Course Title {course}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                           Students Enrolled: {[32, 28, 35][course - 1]}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                           <Progress value={[80, 65, 70][course - 1]} className="w-2/3 h-2" />
                           <span className="text-sm font-medium">
                              {[80, 65, 70][course - 1]}%
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

export default DashboardPage;
