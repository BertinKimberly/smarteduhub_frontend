"use client";
import CourseCreateForm from "@/components/CourseCreateForm";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function NewCoursePage() {
   const router = useRouter();

   const handleSuccess = () => {
      router.push("/teacher/courses");
   };

   return (
      <>
      <DashboardNavbar title="Add Courses" />
      <div className="min-h-screen bg-gray-50/50">
         <div className="container mx-auto py-8">
            <div className="mb-8">
               <Link
                  href="/teacher/courses"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
               >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
               </Link>
               <h1 className="text-3xl font-bold mt-4 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Create New Course
               </h1>
               <p className="text-gray-500">
                  Fill in the details below to create your new course.
               </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-8">
               <CourseCreateForm onSuccess={handleSuccess} />
            </div>
         </div>
      </div>
      </>
   );
}
