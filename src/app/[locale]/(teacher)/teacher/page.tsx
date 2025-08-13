//@ts-nocheck
"use client";
import React from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomCard from "@/components/CustomCard";
import {
   Book,
   Star,
   Pen,
   Users,
   Calendar,
   Bell,
   PieChart,
   Plus,
   BookOpen,
   MoreHorizontal,
} from "lucide-react";
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
import { useDeleteCourse, useGetAllCourses } from "@/hooks/useCourses";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Reuse levelColorMap and categoryIconMap from student portal
const levelColorMap: Record<string, string> = {
   beginner: "bg-green-100 text-green-700 border-green-200",
   intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
   advanced: "bg-red-100 text-red-700 border-red-200",
   "all-levels": "bg-purple-100 text-purple-700 border-purple-200",
};

const categoryIconMap: Record<string, React.ReactNode> = {
   mathematics: <Book className="h-4 w-4" />,
   science: <Star className="h-4 w-4" />,
   language: <Pen className="h-4 w-4" />,
   programming: <Users className="h-4 w-4" />,
   history: <Calendar className="h-4 w-4" />,
};

const TeacherDashboardPage = () => {
   const { data: courses = [], isLoading } = useGetAllCourses();
   const { user } = useAuthStore();

   const deleteCourseMutation = useDeleteCourse();

   // Status badge styling
   const getStatusStyle = (status: string) => {
      switch (status) {
         case "Active":
            return "bg-green-100 text-green-800";
         case "Draft":
            return "bg-yellow-100 text-yellow-800";
         case "Archived":
            return "bg-gray-100 text-gray-800";
         default:
            return "bg-blue-100 text-blue-800";
      }
   };

   // Handle course deletion
   const handleDeleteCourse = async (courseId: string) => {
      try {
         await deleteCourseMutation.mutateAsync(courseId);
      } catch (error) {
         console.error("Failed to delete course:", error);
      }
   };

   // Filter teacher's courses and get most recent 3
   const teacherCourses = courses
      .filter((course) => course.teacher.id === user?.id)
      .sort(
         (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 3);

   const TeacherCourseCard = ({ course }) => {
      const categoryLower = course.category.toLowerCase();
      const levelLower = course.level.toLowerCase();
      const levelColorClass =
         levelColorMap[levelLower] ||
         "bg-blue-100 text-blue-700 border-blue-200";
      const categoryIcon = categoryIconMap[categoryLower] || (
         <Book className="h-4 w-4" />
      );

      return (
         <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <Tilt
               key={course.id}
               className="rounded-xl overflow-hidden"
               tiltMaxAngleX={8}
               tiltMaxAngleY={8}
               scale={1.02}
               transitionSpeed={400}
            >
               <Card className="border border-blue-100 h-full">
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
                     <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full">
                        <BookOpen className="h-8 w-8 text-white" />
                     </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                           <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {course.title}
                           </h3>
                           <p className="text-sm text-gray-500 mt-1">
                              {course.category}
                           </p>
                        </div>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-8 w-8"
                              >
                                 <MoreHorizontal className="h-4 w-4" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent
                              align="end"
                              className="w-48"
                           >
                              <DropdownMenuItem className="cursor-pointer">
                                 Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                 Preview Course
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                 Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                 {course.status === "Archived"
                                    ? "Unarchive"
                                    : "Archive"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 className="text-red-600 cursor-pointer"
                                 onClick={() => handleDeleteCourse(course.id)}
                              >
                                 Delete
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>

                     <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                        {course.description}
                     </p>

                     <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <Badge
                           variant="outline"
                           className={`${
                              levelColorMap[course.level?.toLowerCase()] ||
                              "bg-blue-100 text-blue-700 border-blue-200"
                           }`}
                        >
                           {course.level}
                        </Badge>
                        <Badge
                           variant="outline"
                           className={`${getStatusStyle(
                              course.status
                           )} border-0`}
                        >
                           {course.status}
                        </Badge>
                     </div>

                     <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                           <span className="font-medium text-gray-700">
                              {course.enrollments}
                           </span>{" "}
                           students
                        </div>
                        <div className="text-xs text-gray-400">
                           Updated: {course.lastUpdate}
                        </div>
                     </div>
                  </div>
               </Card>
            </Tilt>
         </div>
      );
   };

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
                  <ResponsiveContainer
                     width="100%"
                     height="100%"
                  >
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
                  <h3 className="font-medium">Upcoming Classes</h3>
                  <Button
                     variant="outline"
                     size="sm"
                  >
                     View All
                  </Button>
               </div>
               <div className="space-y-4">
                  {upcomingClasses.map((event, i) => (
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
                  <h3 className="font-medium">Recent Updates</h3>
                  <Button
                     variant="outline"
                     size="sm"
                  >
                     View All
                  </Button>
               </div>
               <div className="space-y-4">
                  {recentUpdates.map((update, i) => (
                     <div
                        key={i}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md"
                     >
                        <Bell className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                           <p className="font-medium">{update.message}</p>
                           <p className="text-sm text-gray-500">
                              {update.time}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Active Courses Section */}
         <section className="my-6">
            <div className="flex items-center justify-between w-full mb-6">
               <div>
                  <h3 className="text-2xl font-semibold">Recent Courses</h3>
                  <p className="text-sm text-gray-500 mt-1">
                     Your most recently created courses
                  </p>
               </div>
               <div className="flex gap-3">
                  <Link href="/teacher/courses">
                     <Button variant="outline">View All Courses</Button>
                  </Link>
                  <Link href="/teacher/courses/new">
                     <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                     </Button>
                  </Link>
               </div>
            </div>

            {isLoading ? (
               <div className="text-center py-8">Loading courses...</div>
            ) : teacherCourses.length === 0 ? (
               <div className="text-center py-8 bg-blue-50 rounded-lg">
                  <Book className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                  <p className="text-gray-600">
                     Start by creating your first course
                  </p>
               </div>
            ) : (
               <div className="flex flex-wrap -mx-4">
                  {teacherCourses.map((course) => (
                     <TeacherCourseCard
                        key={course.id}
                        course={course}
                     />
                  ))}
               </div>
            )}
         </section>

         {/* ...existing remaining sections... */}
      </div>
   );
};

export default TeacherDashboardPage;
