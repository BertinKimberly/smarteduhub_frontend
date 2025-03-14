//@ts-nocheck
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useGetEnrolledCourses } from "@/hooks/useCourses";
import {
   GraduationCap,
   Clock,
   BarChart,
   Search,
   Book,
   BookOpen,
   CheckCircle2,
   ChevronRight,
   Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardNavbar from "@/components/DashboardNavbar";
import { EnrolledCourseCard } from "@/components/student/EnrolledCourseCard";

interface CourseData {
   id: string;
   title: string;
   description?: string;
   category: string;
   level: string;
   progress?: number;
   lastAccessed?: string;
   teacher?: {
      id: string;
      name: string;
   };
}

interface Course extends CourseData {
   progress?: number;
   lastAccessed?: string;
   teacher?: {
      id: string;
      name: string;
   };
}

const levelColorMap: Record<string, string> = {
   beginner: "bg-green-100 text-green-700 border-green-200",
   intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
   advanced: "bg-red-100 text-red-700 border-red-200",
   "all-levels": "bg-purple-100 text-purple-700 border-purple-200",
};

const categoryIconMap: Record<string, React.ReactNode> = {
   mathematics: <BarChart className="h-4 w-4" />,
   science: <GraduationCap className="h-4 w-4" />,
   language: <GraduationCap className="h-4 w-4" />,
   programming: <GraduationCap className="h-4 w-4" />,
   history: <Clock className="h-4 w-4" />,
};

const EnrolledCoursesPortal = () => {
   const {
      data: courses,
      isLoading,
      error,
   } = useGetEnrolledCourses<Course[]>();
   const [searchTerm, setSearchTerm] = useState("");
   const [activeTab, setActiveTab] = useState("all");

   const displayCourses = courses || [];

   // Filter courses based on search term
   const filteredCourses = displayCourses.filter(
      (course) =>
         course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         course.description?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   // Filter courses based on tab
   const getFilteredCoursesByTab = () => {
      switch (activeTab) {
         case "inProgress":
            return filteredCourses.filter(
               (course) =>
                  (course.progress || 0) > 0 && (course.progress || 0) < 100
            );
         case "notStarted":
            return filteredCourses.filter(
               (course) => !course.progress || course.progress === 0
            );
         case "completed":
            return filteredCourses.filter((course) => course.progress === 100);
         default:
            return filteredCourses;
      }
   };

   const tabFilteredCourses = getFilteredCoursesByTab();

   // Get stats for dashboard
   const totalCourses = displayCourses.length;
   const inProgressCourses = displayCourses.filter(
      (course) => (course.progress || 0) > 0 && (course.progress || 0) < 100
   ).length;
   const completedCourses = displayCourses.filter(
      (course) => course.progress === 100
   ).length;
   const notStartedCourses = displayCourses.filter(
      (course) => !course.progress || course.progress === 0
   ).length;

   return (
      <div className="bg-gray-50 min-h-screen">
         {/* Header */}
         <DashboardNavbar title="Enrolled Courses" />
         <div className="bg-gradient-to-r from-main to-indigo-700 py-16">
            <div className="container mx-auto px-4">
               <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  My Learning Dashboard
               </h1>
               <p className="text-blue-100 text-lg md:w-2/3">
                  Track your progress, continue your learning journey, and
                  manage all your enrolled courses.
               </p>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-12 mb-8">
               <Card className="bg-white shadow-md">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg text-gray-600 flex items-center">
                        <Book className="mr-2 h-5 w-5 text-blue-600" />
                        Total Courses
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-3xl font-bold text-gray-800">
                        {totalCourses}
                     </p>
                  </CardContent>
               </Card>

               <Card className="bg-white shadow-md">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg text-gray-600 flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-yellow-600" />
                        In Progress
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-3xl font-bold text-gray-800">
                        {inProgressCourses}
                     </p>
                  </CardContent>
               </Card>

               <Card className="bg-white shadow-md">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg text-gray-600 flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-red-600" />
                        Not Started
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-3xl font-bold text-gray-800">
                        {notStartedCourses}
                     </p>
                  </CardContent>
               </Card>

               <Card className="bg-white shadow-md">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg text-gray-600 flex items-center">
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                        Completed
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-3xl font-bold text-gray-800">
                        {completedCourses}
                     </p>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Course List with Tabs */}
         <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                     My Enrolled Courses
                  </h2>
                  <div className="relative w-full md:w-64">
                     <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                     />
                     <Input
                        type="text"
                        placeholder="Search your courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200"
                     />
                  </div>
               </div>

               <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
               >
                  <TabsList className="grid grid-cols-4 mb-6">
                     <TabsTrigger value="all">All Courses</TabsTrigger>
                     <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                     <TabsTrigger value="notStarted">Not Started</TabsTrigger>
                     <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab}>
                     {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                           <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                           <span className="ml-3 text-gray-600">
                              Loading your courses...
                           </span>
                        </div>
                     ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-lg mx-auto text-center">
                           There was an error loading your courses. Please try
                           again later.
                        </div>
                     ) : tabFilteredCourses.length === 0 ? (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-8 rounded-lg max-w-lg mx-auto text-center">
                           <Book className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                           <h3 className="text-xl font-semibold mb-2">
                              No courses found
                           </h3>
                           <p>
                              {searchTerm
                                 ? "No courses match your search criteria."
                                 : activeTab === "all"
                                 ? "You haven't enrolled in any courses yet."
                                 : activeTab === "inProgress"
                                 ? "You don't have any courses in progress."
                                 : activeTab === "notStarted"
                                 ? "You don't have any courses that you haven't started yet."
                                 : "You haven't completed any courses yet."}
                           </p>
                           {searchTerm && (
                              <Button
                                 variant="outline"
                                 onClick={() => setSearchTerm("")}
                                 className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
                              >
                                 Clear Search
                              </Button>
                           )}
                           {activeTab !== "all" && (
                              <Button
                                 variant="outline"
                                 onClick={() => setActiveTab("all")}
                                 className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
                              >
                                 View All Courses
                              </Button>
                           )}
                           {activeTab === "all" && !courses?.length && (
                              <Link
                                 href="/courses"
                                 passHref
                              >
                                 <Button className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-main hover:to-indigo-700 text-white">
                                    Browse Courses
                                 </Button>
                              </Link>
                           )}
                        </div>
                     ) : (
                        <div className="flex flex-wrap -mx-4">
                           {tabFilteredCourses.map((course) => (
                              <EnrolledCourseCard
                                 key={course.id}
                                 course={course}
                              />
                           ))}
                        </div>
                     )}
                  </TabsContent>
               </Tabs>
            </div>
         </div>
      </div>
   );
};

export default EnrolledCoursesPortal;
