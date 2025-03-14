"use client";
import { AssignmentChart } from "@/components/AssignmentChart";
import CustomCard from "@/components/CustomCard";
import DashboardNavbar from "@/components/DashboardNavbar";
import { StudentBarChart } from "@/components/StudentBarChart";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Book, Pen, Star, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useGetEnrolledCourses } from "@/hooks/useCourses";
import { EnrolledCourseCard } from "@/components/student/EnrolledCourseCard";

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

const StudentHome = () => {
   const { data: courses, isLoading, error } = useGetEnrolledCourses();

   // Take only first 3 courses for preview
   const previewCourses = courses?.slice(0, 3) || [];

   return (
      <div>
         <DashboardNavbar title="Dashboard" />
         <div className="flex flex-col gap-2 w-[40%] my-6">
            <h4>Curriculum Progress</h4>
            <Progress value={40} />
         </div>

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

         <section className=" rounded-lg mt-6 flex gap-6 flex-col md:flex-row">
            <div className="border p-4 flex flex-col gap-4 w-full md:w-[50%] rounded-lg">
               <p className="">Performance Overview</p>
               <StudentBarChart />
               <Link
                  href="/student/courses"
                  className="text-main"
               >
                  View All Courses
               </Link>
            </div>
            <div className="border p-4 flex flex-col gap-4 w-full md:w-[50%] rounded-lg">
               <p className="text-transparent bg-clip-text bg-gradient-to-r from-main via-blue-400 to-pink-200">
                  Assignments Overview
               </p>

               <AssignmentChart />
            </div>
         </section>

         {/* enrolled courses  */}
         <section className="my-6">
            <div className="flex items-center justify-between w-full my-4">
               <h3>Enrolled Courses</h3>
               <Link href="/student/enrolled-courses">
                  <Button
                     className="text-main"
                     variant="outline"
                  >
                     View All
                  </Button>
               </Link>
            </div>

            {/* courses  */}
            <div className="flex flex-wrap -mx-4">
               {isLoading ? (
                  <div className="w-full flex items-center justify-center py-12">
                     <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                     <span className="ml-3 text-gray-600">
                        Loading courses...
                     </span>
                  </div>
               ) : error ? (
                  <div className="w-full text-center py-12 text-gray-500">
                     Failed to load courses. Please try again later.
                  </div>
               ) : previewCourses.length === 0 ? (
                  <div className="w-full text-center py-12 text-gray-500">
                     No courses enrolled yet.
                     <Link
                        href="/courses"
                        className="block mt-2 text-main hover:underline"
                     >
                        Browse Available Courses
                     </Link>
                  </div>
               ) : (
                  previewCourses.map((course) => (
                     <EnrolledCourseCard
                        key={course.id}
                        //@ts-ignore
                        course={course}
                     />
                  ))
               )}
            </div>
         </section>
      </div>
   );
};

export default StudentHome;
