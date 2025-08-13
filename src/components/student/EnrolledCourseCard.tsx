//@ts-nocheck
import React from "react";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, GraduationCap, Clock, ChevronRight } from "lucide-react";
import { CourseProgressTracker } from "@/components/CourseProgressTracker";

export interface CourseData {
   id: string;
   title: string;
   description?: string;
   category?: string; // Made optional with ?
   level: string;
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

export const EnrolledCourseCard: React.FC<{ course: CourseData }> = ({
   course,
}) => {
   const link = `/student/enrolled-courses/${course.id}`;

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

   // Format the progress
   const progress = course.progress || 0;
   const formattedProgress = Math.round(progress);

   const enrollment = course.enrollments?.[0];

   return (
      <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
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

                     <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                           <span>Progress</span>
                           <span>{formattedProgress}%</span>
                        </div>
                        <Progress
                           value={progress}
                           className="h-2"
                        />
                     </div>

                     <CourseProgressTracker
                        course={course}
                        currentProgress={enrollment?.progress || 0}
                     />

                     <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
                        {course.lastAccessed ? (
                           <span className="text-xs text-gray-500">
                              Last accessed: {course.lastAccessed}
                           </span>
                        ) : (
                           <span className="text-xs text-gray-500">
                              Not started yet
                           </span>
                        )}

                        <span className="text-blue-600 flex items-center text-sm font-medium group">
                           Continue Learning
                           <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </div>
                  </div>
               </div>
            </Tilt>
         </Link>
      </div>
   );
};
