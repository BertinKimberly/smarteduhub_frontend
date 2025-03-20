//@ts-nocheck
"use client";
import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { useGetAllCourses } from "@/hooks/useCourses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Search,
   BookOpen,
   Clock,
   Filter,
   X,
   GraduationCap,
   BarChart,
   ChevronRight,
} from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

// Categories and levels arrays
const categories = [
   "All Categories",
   "Web Development",
   "Data Science",
   "Business",
   "Design",
   "Marketing",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

interface CourseData {
   id: string;
   title: string;
   description?: string | null;
   category: string;
   level: string;
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

const CourseCard: React.FC<{ course: CourseData }> = ({ course }) => {
   const link = `/courses/${course.id}`;

   const defaultCategory = "other";
   const categoryLower = (course.category || defaultCategory).toLowerCase();
   const levelLower = (course.level || "all-levels").toLowerCase();

   const levelColorClass =
      levelColorMap[levelLower] || "bg-blue-100 text-blue-700 border-blue-200";
   const categoryIcon = categoryIconMap[categoryLower] || (
      <GraduationCap className="h-4 w-4" />
   );

   return (
      <Link
         href={link}
         passHref
      >
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
                     {course.teacher?.name ? (
                        <span className="text-sm text-gray-600">
                           By {course.teacher.name}
                        </span>
                     ) : (
                        <span className="text-sm text-gray-600">
                           Smart Eduhub Course
                        </span>
                     )}

                     <span className="text-blue-600 flex items-center text-sm font-medium group">
                        View Course
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                     </span>
                  </div>
               </div>
            </div>
         </Tilt>
      </Link>
   );
};

const CoursesPage = () => {
   const t = useTranslations("courses");
   const { data: courses, isLoading, error } = useGetAllCourses();
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("All Categories");
   const [selectedLevel, setSelectedLevel] = useState("All Levels");
   const [showFilters, setShowFilters] = useState(false);

   if (isLoading)
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
         </div>
      );

   if (error)
      return (
         <div className="min-h-screen flex items-center justify-center text-red-500">
            Error loading courses
         </div>
      );

   const filteredCourses = courses?.filter((course: any) => {
      const matchesSearch = course.title
         .toLowerCase()
         .includes(searchTerm.toLowerCase());
      const matchesCategory =
         selectedCategory === "All Categories" ||
         course.category === selectedCategory;
      const matchesLevel =
         selectedLevel === "All Levels" || course.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
   });

   return (
      <div className="min-h-screen bg-[#F8F9FE] pb-4">
         {/* Hero Section */}
         <div className="relative overflow-hidden bg-gradient-to-r from-main  to-indigo-700">
            {/* Background decoration elements */}
            <div className="absolute inset-0">
               <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
               <div className="absolute left-1/3 top-2/3 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl"></div>
               <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl"></div>
            </div>

            <div className="container relative mx-auto px-4 py-20">
               <div className="mb-12 text-center">
                  <h1 className="mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-5xl font-extrabold leading-tight text-transparent md:text-6xl">
                     {t("hero.title")}
                  </h1>
                  <p className="mx-auto max-w-2xl text-lg font-medium text-blue-100">
                     {t("hero.description")}
                  </p>
               </div>

               {/* Enhanced Search Experience */}
               <div className="mx-auto max-w-3xl">
                  <div className="relative flex items-center rounded-2xl bg-white/10 p-2 backdrop-blur-lg">
                     {/* Search Input */}
                     <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-200" />
                        <Input
                           placeholder="What do you want to learn today?"
                           className="w-full border-0 bg-transparent py-4 pl-12 pr-4 text-white placeholder-white placeholder:text-white/70 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>

                     {/* Quick Category Filters */}
                     <div className="hidden md:flex">
                        {["Development", "Design", "Business"].map((cat) => (
                           <Button
                              key={cat}
                              variant="ghost"
                              className="text-sm text-white hover:bg-white/20"
                              onClick={() => {
                                 setSelectedCategory(cat);
                                 setShowFilters(true);
                              }}
                           >
                              {cat}
                           </Button>
                        ))}
                     </div>

                     {/* Filter Toggle Button */}
                     <Button
                        className="ml-2 rounded-xl bg-white px-4 text-indigo-700 hover:bg-blue-50"
                        onClick={() => setShowFilters(!showFilters)}
                     >
                        {showFilters ? (
                           <X className="mr-2 h-4 w-4" />
                        ) : (
                           <Filter className="mr-2 h-4 w-4" />
                        )}
                        {showFilters ? "Hide Filters" : "Filters"}
                     </Button>
                  </div>

                  {/* Stats bar */}
                  <div className="mt-6 flex justify-center space-x-12 text-center text-sm text-white/80">
                     <div>
                        <span className="font-bold text-white">100+</span>{" "}
                        Courses
                     </div>
                     <div>
                        <span className="font-bold text-white">50+</span>{" "}
                        Instructors
                     </div>
                     <div>
                        <span className="font-bold text-white">10k+</span>{" "}
                        Students
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Expanded Filters Panel (slides down when filters are toggled) */}
         {showFilters && (
            <div className="bg-white py-2 shadow-lg transform transition-all duration-300">
               <div className="container mx-auto px-4">
                  <div className="flex flex-wrap gap-6 py-4">
                     <div className="flex-1 min-w-[180px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Category
                        </label>
                        <Select
                           onValueChange={setSelectedCategory}
                           defaultValue={selectedCategory}
                        >
                           <SelectTrigger className="w-full border-indigo-100 focus:ring-indigo-500">
                              <SelectValue placeholder="Select category" />
                           </SelectTrigger>
                           <SelectContent>
                              {categories.map((category) => (
                                 <SelectItem
                                    key={category}
                                    value={category}
                                 >
                                    {category}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="flex-1 min-w-[180px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Level
                        </label>
                        <Select
                           onValueChange={setSelectedLevel}
                           defaultValue={selectedLevel}
                        >
                           <SelectTrigger className="w-full border-indigo-100 focus:ring-indigo-500">
                              <SelectValue placeholder="Select level" />
                           </SelectTrigger>
                           <SelectContent>
                              {levels.map((level) => (
                                 <SelectItem
                                    key={level}
                                    value={level}
                                 >
                                    {level}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="flex-1 min-w-[180px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Duration
                        </label>
                        <Select defaultValue="any">
                           <SelectTrigger className="w-full border-indigo-100 focus:ring-indigo-500">
                              <SelectValue placeholder="Course length" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="any">Any Duration</SelectItem>
                              <SelectItem value="short">0-3 Hours</SelectItem>
                              <SelectItem value="medium">3-10 Hours</SelectItem>
                              <SelectItem value="long">10+ Hours</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="flex items-end w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                           Apply Filters
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Courses Grid */}
         <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredCourses?.map((course: CourseData) => (
                  <CourseCard
                     key={course.id}
                     course={course}
                  />
               ))}
            </div>

            {filteredCourses?.length === 0 && (
               <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                     No courses found
                  </h3>
                  <p className="text-gray-600">
                     Try adjusting your search or filters
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};

export default CoursesPage;
