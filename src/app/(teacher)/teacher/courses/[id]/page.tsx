"use client";

import { useGetCourseById } from "@/hooks/useCourses";
import CourseMaterials from "@/components/CourseMaterials";

const CoursePage = ({ params }: { params: { id: string } }) => {
   const { data: course, isLoading } = useGetCourseById(params.id);

   if (isLoading) return <div>Loading course...</div>;
   if (!course) return <div>Course not found</div>;

   return (
      <div className="container mx-auto py-8">
         <h1 className="text-2xl font-bold mb-6">{course.title}</h1>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <div className="space-y-6">
                  <section>
                     <h2 className="text-xl font-semibold mb-3">
                        About this course
                     </h2>
                     <p>{course.description}</p>
                  </section>

                  {course.long_description && (
                     <section>
                        <h2 className="text-xl font-semibold mb-3">
                           What you&apos;ll learn
                        </h2>
                        <p>{course.long_description}</p>
                     </section>
                  )}

                  {course.prerequisites && (
                     <section>
                        <h2 className="text-xl font-semibold mb-3">
                           Prerequisites
                        </h2>
                        <p>{course.prerequisites}</p>
                     </section>
                  )}
               </div>
            </div>

            <div>
               <CourseMaterials
                  courseId={course.id}
                  isTeacher={true}
               />
            </div>
         </div>
      </div>
   );
};

export default CoursePage;
