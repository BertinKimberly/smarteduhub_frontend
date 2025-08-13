"use client";
import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import {
   useUpdateCourseProgress,
   calculateCourseProgress,
} from "@/hooks/useCourses";
import type { Course } from "@/types/course";

interface CourseProgressTrackerProps {
   course: Course;
   currentProgress: number;
}

export function CourseProgressTracker({
   course,
   currentProgress,
}: CourseProgressTrackerProps) {
   const { mutate: updateProgress } = useUpdateCourseProgress();

   // Update progress when material is viewed
   const handleMaterialViewed = (materialId: string) => {
      const newProgress = calculateCourseProgress(course);
      updateProgress({ courseId: course.id, progress: newProgress });
   };

   return (
      <div className="space-y-2">
         <div className="flex justify-between text-sm">
            <span>Course Progress</span>
            <span>{Math.round(currentProgress)}%</span>
         </div>
         <Progress value={currentProgress} />
         <p className="text-xs text-muted-foreground">
            {/* @ts-ignore */}
            {course.materials?.filter((m) => m.viewed).length || 0} of{" "}
            {course.materials?.length || 0} materials completed
         </p>
      </div>
   );
}
