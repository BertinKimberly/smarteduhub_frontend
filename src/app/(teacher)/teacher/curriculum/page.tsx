"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import React from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";

type CourseCardProps = {
   name: string;
   index: number;
};

const CourseCard: React.FC<CourseCardProps> = ({ name, index }) => {
   const link = `/dashboard/curriculum/${index + 1}`;

   return (
      <Link
         href={link}
         target="_blank"
         passHref
      >
         <Tilt
            className="rounded-2xl shadow-lg flex justify-center items-center border border-submain"
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            scale={1.05}
            transitionSpeed={450}
         >
            <div className="flex flex-col items-center justify-center bg-tertiary rounded-2xl w-full min-h-[200px] p-5 ">
               <h3 className="text-blue-500 font-bold text-2xl mb-2 text-center">
                  {name}
               </h3>
               <span className="text-blue-400 underline hover:text-blue-300 text-center">
                  More
               </span>
            </div>
         </Tilt>
      </Link>
   );
};

const sampleCourses = [
   { id: 1, name: "Introduction to Programming" },
   { id: 2, name: "Advanced React" },
   { id: 3, name: "Data Structures and Algorithms" },
];

const CurriculumPage = () => {
   return (
      <div className="p-3">
         <DashboardNavbar title="Curriculum" />
         <div className="p-2 flex flex-col gap-6">
            <h2>Available courses</h2>
            <div className="rounded-lg p-4 flex items-center justify-center">
               <div className="flex flex-wrap justify-center gap-8">
                  {sampleCourses.map((course, index) => (
                     <CourseCard
                        key={course.id}
                        name={course.name}
                        index={index}
                     />
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default CurriculumPage;
