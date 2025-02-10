"use client";

import DashboardNavbar from "@/components/DashboardNavbar";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCourseById } from "@/hooks/useCourses";
import { FaStar, FaUserTie } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import { validate as isValidUUID } from "uuid";

const CourseDetailsPage = () => {
   const params = useParams();
   const id = params.id;
   const router = useRouter();

   // Validate UUID before proceeding
   const isValidId = id && typeof id === "string" && isValidUUID(id);

   // Fetch course data only if the ID is valid
   const { data: course, isLoading, error } = useGetCourseById(id as string);

   console.log("course", course);

   useEffect(() => {
      // Redirect to not-found if the ID is invalid
      if (!isValidId) {
         router.push("/not-found");
      }
   }, [isValidId, router]);

   useEffect(() => {
      // Redirect to not-found if the course is not found or there's an error
      if (!isLoading && course?.detail === "Course not found") {
         router.push("/not-found");
      }
   }, [isLoading, course, router]);

   // Show loading state while fetching data
   if (isLoading) {
      return <div>Loading...</div>;
   }

   // Prevent rendering if course is not found
   if (!course || error || course?.detail === "Course not found") {
      return null; // Redirect will be handled by useEffect
   }

   return (
      <div className="p-5">
         <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-center mb-4">
               {course.title}
            </h1>
            <p className="text-gray-600 text-center italic">
               Category: {course.category}
            </p>
            <p className="text-gray-500 text-center mb-6">
               Level: {course.level}
            </p>

            <div className="border-t pt-4">
               <h2 className="text-xl font-semibold mb-2">
                  Course Description
               </h2>
               <p className="text-gray-700">
                  {course.description || "No description available."}
               </p>
            </div>

            <div className="border-t pt-4 mt-4">
               <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <FaUserTie className="text-blue-500" /> Instructor
               </h2>
               <p className="text-gray-700 font-medium">
                  {course.teacher.name}
               </p>
               <p className="text-gray-500 text-sm">{course.teacher.email}</p>
            </div>

            <div className="border-t pt-4 mt-4">
               <h2 className="text-xl font-semibold mb-2">Ratings</h2>
               {course.ratings.length > 0 ? (
                  <div className="flex gap-1 text-yellow-400">
                     {[...Array(5)].map((_, i) => (
                        <FaStar
                           key={i}
                           className={
                              i < course.ratings.length
                                 ? "text-yellow-500"
                                 : "text-gray-300"
                           }
                        />
                     ))}
                  </div>
               ) : (
                  <p className="text-gray-500 italic">No ratings yet.</p>
               )}
            </div>

            <div className="mt-6 flex justify-center">
               <Link
                  href="/courses"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md"
               >
                  Back to Courses
               </Link>
            </div>
         </div>
      </div>
   );
};

export default CourseDetailsPage;
