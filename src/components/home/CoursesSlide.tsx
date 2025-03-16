//@ts-nocheck
"use client";
import React from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { useGetAllCourses } from "@/hooks/useCourses";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
   GraduationCap,
   Clock,
   BarChart,
   ChevronRight,
   Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface CourseData {
   id: string;
   title: string;
   description?: string;
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
   const t = useTranslations("home.courses");
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

   return (
      <CarouselItem className="pl-2 pr-2 md:basis-1/2 lg:basis-1/3">
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
                        <span className="text-sm text-gray-600">
                           {course.teacher?.name
                              ? t("byAuthor", { name: course.teacher.name })
                              : t("smartEduHubCourse")}
                        </span>

                        <span className="text-blue-600 flex items-center text-sm font-medium group">
                           View Course
                           <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </div>
                  </div>
               </div>
            </Tilt>
         </Link>
      </CarouselItem>
   );
};

const CoursesSection = () => {
   const t = useTranslations("home.courses");
   const { data: courses, isLoading, error } = useGetAllCourses();
   const plugin = React.useRef(
      Autoplay({ delay: 4000, stopOnInteraction: true })
   );

   const displayCourses = courses?.length ? courses : [];

   return (
      <section
         id="courses"
         className="bg-white py-24 sm:py-32"
      >
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-lg text-blue-600 text-center mb-2 tracking-wider font-medium">
                  {t("title")}
               </h2>
               <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-gray-900">
                  {t("subtitle")}
               </h2>
               <h3 className="md:w-3/4 lg:w-2/3 mx-auto text-xl text-center text-gray-600">
                  {t("description")}
               </h3>
            </div>

            {isLoading ? (
               <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Loading courses...</span>
               </div>
            ) : error ? (
               <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-lg mx-auto text-center">
                  There was an error loading courses. Please try again later.
               </div>
            ) : (
               <Carousel
                  className="w-full"
                  plugins={[plugin.current]}
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                  opts={{
                     loop: true,
                     align: "start",
                  }}
               >
                  <CarouselContent>
                     {displayCourses.map((course: CourseData) => (
                        <CourseCard
                           key={course.id}
                           course={course}
                        />
                     ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-4 mt-8">
                     <CarouselPrevious className="static bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors" />
                     <CarouselNext className="static bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors" />
                  </div>
               </Carousel>
            )}

            <div className="text-center mt-12">
               <Link
                  href="/courses"
                  passHref
               >
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-main hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto">
                     Browse All Courses
                     <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
               </Link>
            </div>
         </div>
      </section>
   );
};

export default CoursesSection;
