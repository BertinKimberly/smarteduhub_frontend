//@ts-nocheck
"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetAllCourses, useDeleteCourse } from "@/hooks/useCourses";
import { useState } from "react";
import { Search, MoreHorizontal, BookOpen, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import Tilt from "react-parallax-tilt";

const levelColorMap: Record<string, string> = {
   beginner: "bg-green-100 text-green-700 border-green-200",
   intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
   advanced: "bg-red-100 text-red-700 border-red-200",
   "all-levels": "bg-purple-100 text-purple-700 border-purple-200",
};

const CoursesPage = () => {
   const { data: courses, isLoading } = useGetAllCourses();
   const deleteCourseMutation = useDeleteCourse();
   const { user } = useAuthStore();

   // States
   const [searchQuery, setSearchQuery] = useState("");
   const [activeFilter, setActiveFilter] = useState("all");

   // Filter courses based on search query, active filter, and teacher ID
   const filteredCourses =
      courses?.filter((course) => {
         const matchesSearch = course.title
            .toLowerCase()
            .includes(searchQuery?.toLowerCase());
         const matchesFilter =
            activeFilter === "all" ||
            course?.status?.toLowerCase() === activeFilter?.toLowerCase();
         const isTeachersCourse = course.teacher?.id === user?.id;

         return matchesSearch && matchesFilter && isTeachersCourse;
      }) || [];

   // Handle course deletion
   const handleDeleteCourse = async (courseId: string) => {
      try {
         await deleteCourseMutation.mutateAsync(courseId);
      } catch (error) {
         console.error("Failed to delete course:", error);
      }
   };

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

   // Loading state
   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-2">
               <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
               <p className="text-blue-600 font-medium">Loading courses...</p>
            </div>
         </div>
      );
   }

   return (
      <>
         <DashboardNavbar title="Courses" />
         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
            <div className="max-w-7xl mx-auto px-4">
               <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  My Courses
               </h1>
               <p className="text-blue-100 text-lg md:w-2/3">
                  Manage your courses and course materials
               </p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-md p-6 -mt-12 mb-8">
               <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-grow">
                     <div className="relative">
                        <Search
                           className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                           size={18}
                        />
                        <Input
                           placeholder="Search courses..."
                           className="pl-10 border-gray-200"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </div>
                  </div>
                  <Link href="/teacher/courses/new">
                     <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                     </Button>
                  </Link>
               </div>
            </div>

            <Tabs
               defaultValue="all"
               className="mb-6"
               onValueChange={setActiveFilter}
            >
               <TabsList className="bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                     value="all"
                     className="rounded-md"
                  >
                     All Courses
                  </TabsTrigger>
                  <TabsTrigger
                     value="active"
                     className="rounded-md"
                  >
                     Active
                  </TabsTrigger>
                  <TabsTrigger
                     value="draft"
                     className="rounded-md"
                  >
                     Drafts
                  </TabsTrigger>
                  <TabsTrigger
                     value="archived"
                     className="rounded-md"
                  >
                     Archived
                  </TabsTrigger>
               </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredCourses.map((course) => (
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
                                       onClick={() =>
                                          handleDeleteCourse(course.id)
                                       }
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
                                    levelColorMap[
                                       course.level?.toLowerCase()
                                    ] ||
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
               ))}
            </div>

            {filteredCourses.length === 0 && (
               <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                     <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                     No courses found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                     {searchQuery
                        ? "Try a different search term or clear your filters."
                        : "Create your first course by clicking the 'Create Course' button."}
                  </p>
                  {searchQuery && (
                     <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                           setSearchQuery("");
                           setActiveFilter("all");
                        }}
                     >
                        Clear filters
                     </Button>
                  )}
               </div>
            )}
         </div>
      </>
   );
};

export default CoursesPage;
