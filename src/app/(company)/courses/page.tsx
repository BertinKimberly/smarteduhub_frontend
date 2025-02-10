"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import React from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { useGetAllCourses } from "@/hooks/useCourses";

type CourseCardProps = {
   name: string;
   id: string;
};

const CourseCard: React.FC<CourseCardProps> = ({ name, id }) => {
   const link = `/courses/${id}`;

   return (
      <Link
         href={link}
         passHref
      >
         <Tilt
            className="rounded-2xl shadow-lg flex justify-center items-center border border-submain w-[250px] sm:w-[300px] xl:w-[350px]"
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            scale={1.05}
            transitionSpeed={450}
         >
            <div className="flex flex-col items-center justify-center bg-tertiary rounded-2xl w-full min-h-[200px] p-5 ">
               <h3 className="font-bold text-2xl mb-2 text-center">{name}</h3>
               <span className="text-blue-400 underline hover:text-blue-300 text-center">
                  More
               </span>
            </div>
         </Tilt>
      </Link>
   );
};

const CoursesPage = () => {
   const { data: courses, isLoading, error } = useGetAllCourses();

   console.log("courses", courses);
   

   if (isLoading) return <div>Loading...</div>;
   if (error) return <div>Error loading courses</div>;

   return (
      <div className="p-3">
         <div className="p-2 flex flex-col gap-6 items-center justify-center">
            <h2>Available courses</h2>
            <div className="rounded-lg p-4 flex items-center justify-center">
               <div className="flex flex-wrap justify-center gap-8">
                  {courses.map((course: any) => (
                     <CourseCard
                        key={course.id}
                        name={course.title}
                        id={course.id}
                     />
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default CoursesPage;
