"use client";
import React, { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import {
   useGetAllCoursesWithEnrollment,
   useEnrollInCourse,
} from "@/hooks/useCourses";
import {
   GraduationCap,
   Clock,
   BarChart,
   Search,
   Filter,
   ChevronRight,
   Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import DashboardNavbar from "@/components/DashboardNavbar";

interface CourseData {
   id: string;
   title: string;
   description?: string | null;
   category: string;
   level: string;
   isEnrolled?: boolean;
   rating?: number;
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

const CourseCard: React.FC<{
   course: CourseData;
   onEnroll: (id: string) => void;
   isEnrolling: boolean;
   enrollingId: string | null;
}> = ({ course, onEnroll, isEnrolling, enrollingId }) => {
   const link = `/courses/${course.id}`;

   // Default category if not found
   const defaultCategory = "other";
   const categoryLower = (course.category || defaultCategory).toLowerCase();
   const levelLower = (course.level || "all-levels").toLowerCase();

   // Get color class or default
   const levelColorClass =
      levelColorMap[levelLower] || "bg-blue-100 text-blue-700 border-blue-200";
   const categoryIcon = categoryIconMap[categoryLower] || (
      <GraduationCap className="h-4 w-4" />
   );

   const handleEnrollClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onEnroll(course.id);
   };

   const renderStars = (rating: number) => {
      return Array(5)
         .fill(0)
         .map((_, index) => (
            <svg
               key={index}
               className={`w-4 h-4 ${
                  index < rating ? "text-yellow-400" : "text-gray-300"
               }`}
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 20 20"
               fill="currentColor"
            >
               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
         ));
   };

   return (
      <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
         <Tilt
            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full"
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            scale={1.02}
            transitionSpeed={400}
            glareEnable={true}
            glareMaxOpacity={0.1}
            glareColor="#ffffff"
            glarePosition="all"
         >
            <div className="flex flex-col h-full bg-white border border-blue-100">
               <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full">
                     {categoryIcon}
                  </div>
               </div>

               <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                     <Badge
                        variant="outline"
                        className={`font-medium ${levelColorClass}`}
                     >
                        {course.level}
                     </Badge>
                     <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                     >
                        {course.category}
                     </Badge>
                  </div>

                  <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">
                     {course.title}
                  </h3>

                  {course.description && (
                     <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {course.description}
                     </p>
                  )}

                  <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
                     <div className="flex items-center">
                        {renderStars(course.rating || 0)}
                        <span className="ml-2 text-sm text-gray-600">
                           {course.rating?.toFixed(1) || "No ratings"}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="px-6 pb-6">
                  {course.isEnrolled ? (
                     <Button
                        className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium border border-green-200"
                        disabled
                     >
                        Enrolled
                     </Button>
                  ) : (
                     <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-main hover:to-indigo-700 text-white font-medium"
                        onClick={handleEnrollClick}
                        disabled={isEnrolling && enrollingId === course.id}
                     >
                        {isEnrolling && enrollingId === course.id ? (
                           <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Enrolling...
                           </>
                        ) : (
                           "Enroll Now"
                        )}
                     </Button>
                  )}
               </div>
            </div>
         </Tilt>
      </div>
   );
};

const AllCoursesPage = () => {
   const { data: courses, isLoading } = useGetAllCoursesWithEnrollment();
   const enrollMutation = useEnrollInCourse();

   const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [categoryFilter, setCategoryFilter] = useState("all");
   const [levelFilter, setLevelFilter] = useState("all");
   const [enrollingId, setEnrollingId] = useState<string | null>(null);
   const [error, setError] = useState<Error | null>(null);

   const categories = [
      "Mathematics",
      "Science",
      "Language",
      "Programming",
      "History",
   ];
   const levels = ["Beginner", "Intermediate", "Advanced", "All-Levels"];

   useEffect(() => {
      if (!courses && !isLoading) {
         setError(new Error("Failed to load courses"));
      }
   }, [courses, isLoading]);

   useEffect(() => {
      if (courses) {
         let result = courses.map((course) => ({
            ...course,
            teacher: {
               ...course.teacher,
               id: course.teacher?.id || "",
               name: course.teacher?.name || "",
            },
         }));

         // Apply search filter
         if (searchTerm) {
            result = result.filter(
               (course) =>
                  course.title
                     .toLowerCase()
                     .includes(searchTerm.toLowerCase()) ||
                  course.description
                     ?.toLowerCase()
                     .includes(searchTerm.toLowerCase())
            );
         }

         // Apply category filter
         if (categoryFilter && categoryFilter !== "all") {
            result = result.filter(
               (course) =>
                  course.category.toLowerCase() === categoryFilter.toLowerCase()
            );
         }

         // Apply level filter
         if (levelFilter && levelFilter !== "all") {
            result = result.filter(
               (course) =>
                  course.level.toLowerCase() === levelFilter.toLowerCase()
            );
         }

         setFilteredCourses(result);
      }
   }, [courses, searchTerm, categoryFilter, levelFilter]);

   const handleEnroll = (courseId: string) => {
      setEnrollingId(courseId);
      enrollMutation.mutate(courseId, {
         onSuccess: () => {
            toast.success("You have successfully enrolled in this course!");
            setEnrollingId(null);
         },
         onError: (error) => {
            toast.error(
               error.message ||
                  "There was an error enrolling in this course. Please try again."
            );
            setEnrollingId(null);
         },
      });
   };

   const clearFilters = () => {
      setSearchTerm("");
      setCategoryFilter("all");
      setLevelFilter("all");
   };

   const displayCourses =
      filteredCourses.length > 0 ? filteredCourses : courses || [];

   return (
      <div className="bg-gray-50 min-h-screen">
         {/* Header */}
         <DashboardNavbar title="Courses" />
         <div className="bg-gradient-to-r from-main to-indigo-700 py-16">
            <div className="container mx-auto px-4">
               <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Explore All Courses
               </h1>
               <p className="text-blue-100 text-lg md:w-2/3">
                  Discover a wide range of AI-powered courses designed to adapt
                  to your learning style and help you master new skills at your
                  own pace.
               </p>
            </div>
         </div>

         {/* Search and Filter */}
         <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md p-6 -mt-12 mb-8">
               <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                     <div className="relative">
                        <Search
                           className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                           size={18}
                        />
                        <Input
                           type="text"
                           placeholder="Search courses..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-10 border-gray-200"
                        />
                     </div>
                  </div>

                  <div className="md:w-48">
                     <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                     >
                        <SelectTrigger className="border-gray-200">
                           <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              <SelectItem value="all">
                                 All Categories
                              </SelectItem>
                              {categories.map((category) => (
                                 <SelectItem
                                    key={category}
                                    value={category.toLowerCase()}
                                 >
                                    {category}
                                 </SelectItem>
                              ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="md:w-48">
                     <Select
                        value={levelFilter}
                        onValueChange={setLevelFilter}
                     >
                        <SelectTrigger className="border-gray-200">
                           <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              <SelectItem value="all">All Levels</SelectItem>
                              {levels.map((level) => (
                                 <SelectItem
                                    key={level}
                                    value={level.toLowerCase()}
                                 >
                                    {level}
                                 </SelectItem>
                              ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  </div>

                  <Button
                     variant="outline"
                     onClick={clearFilters}
                     className="border-gray-200 text-gray-600"
                  >
                     Clear Filters
                  </Button>
               </div>
            </div>

            {/* Course List */}
            {isLoading ? (
               <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Loading courses...</span>
               </div>
            ) : error ? (
               <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-lg mx-auto text-center">
                  There was an error loading courses. Please try again later.
               </div>
            ) : displayCourses.length === 0 ? (
               <div className="bg-blue-50 border border-blue-200 text-blue-700 p-8 rounded-lg max-w-lg mx-auto text-center">
                  <Filter className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-2">
                     No courses found
                  </h3>
                  <p>
                     Try adjusting your search criteria or browse all available
                     courses.
                  </p>
                  <Button
                     variant="outline"
                     onClick={clearFilters}
                     className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                     Clear Filters
                  </Button>
               </div>
            ) : (
               <div className="flex flex-wrap -mx-4">
                  {displayCourses.map((course) => (
                     <CourseCard
                        key={course.id}
                        // @ts-ignore
                        course={course}
                        onEnroll={handleEnroll}
                        isEnrolling={enrollMutation.isPending}
                        enrollingId={enrollingId}
                     />
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

export default AllCoursesPage;
