//@ts-nocheck
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Course, CourseFormData, Material } from "@/types/course";
import React from "react";

const getAllCourses = (): Promise<Course[]> => {
   return handleApiRequest(() => authorizedAPI.get("/courses"));
};

const createCourse = (data: CourseFormData): Promise<Course> => {
   // Create a proper object instead of FormData since backend expects JSON
   const courseData = {
      title: data.title,
      description: data.description || "",
      long_description: data.long_description || "",
      prerequisites: data.prerequisites || [],
      category: data.category,
      level: data.level,
   };

   return handleApiRequest(() =>
      authorizedAPI.post("/courses", courseData, {
         headers: {
            "Content-Type": "application/json",
         },
      })
   );
};

const updateCourse = ({
   data,
   id,
}: {
   data: CourseFormData;
   id: string;
}): Promise<Course> => {
   // Make sure prerequisites is properly formatted
   const courseData = {
      ...data,
      prerequisites: data.prerequisites || null,
   };

   return handleApiRequest(() =>
      authorizedAPI.put(`/courses/${id}`, courseData)
   );
};

const getCourseById = ({
   queryKey,
}: {
   queryKey: [string, string];
}): Promise<Course> => {
   const [_, id] = queryKey;
   return handleApiRequest(() => authorizedAPI.get(`/courses/${id}`));
};

const deleteCourseById = (id: string): Promise<void> => {
   return handleApiRequest(() => authorizedAPI.delete(`/courses/${id}`));
};

const getEnrolledCourses = (): Promise<Course[]> => {
   return handleApiRequest(() => authorizedAPI.get("/courses/enrolled/me"));
};

const enrollInCourse = (id: string): Promise<Course> => {
   return handleApiRequest(() => authorizedAPI.post(`/courses/${id}/enroll`));
};

const uploadMaterial = ({
   courseId,
   title,
   file,
}: {
   courseId: string;
   title: string;
   file: File;
}): Promise<Material> => {
   const formData = new FormData();
   formData.append("title", title);
   formData.append("file", file);

   return handleApiRequest(() =>
      authorizedAPI.post(`/courses/${courseId}/materials`, formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      })
   );
};

const getMaterials = (courseId: string): Promise<Material[]> => {
   return handleApiRequest(() =>
      authorizedAPI.get(`/courses/${courseId}/materials`)
   );
};

const deleteMaterial = (materialId: string): Promise<void> => {
   return handleApiRequest(() =>
      authorizedAPI.delete(`/courses/materials/${materialId}`)
   );
};

const getRelatedCourses = async (course: Course): Promise<Course[]> => {
   // Get all courses
   const allCourses = await handleApiRequest(() =>
      authorizedAPI.get("/courses")
   );

   // Filter out the current course and sort by relevance
   return allCourses
      .filter((c: Course) => c.id !== course.id) // Remove current course
      .map((c: Course) => ({
         ...c,
         relevanceScore: calculateRelevanceScore(course, c),
      }))
      .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3); // Get top 3 most relevant courses
};

const calculateRelevanceScore = (
   sourceCourse: Course,
   targetCourse: Course
): number => {
   let score = 0;

   // Same category (highest weight)
   if (sourceCourse.category === targetCourse.category) {
      score += 5;
   }

   // Same level
   if (sourceCourse.level === targetCourse.level) {
      score += 3;
   }

   // Similar description (basic text matching)
   if (sourceCourse.description && targetCourse.description) {
      const sourceWords = sourceCourse.description.toLowerCase().split(" ");
      const targetWords = targetCourse.description.toLowerCase().split(" ");
      const commonWords = sourceWords.filter(
         (word) => word.length > 3 && targetWords.includes(word)
      );
      score += commonWords.length * 0.1;
   }

   return score;
};

export const useGetAllCourses = () =>
   useQuery<Course[], Error>({ queryKey: ["courses"], queryFn: getAllCourses });

export const useGetEnrolledCourses = () =>
   useQuery<Course[], Error>({
      queryKey: ["enrolledCourses"],
      queryFn: getEnrolledCourses,
   });

export const useCreateCourse = () => {
   return useMutation<Course, Error, CourseFormData>({
      mutationFn: createCourse,
   });
};

export const useUpdateCourse = () => {
   return useMutation<Course, Error, { data: CourseFormData; id: string }>({
      mutationFn: updateCourse,
   });
};

export const useDeleteCourse = () => {
   return useMutation<void, Error, string>({
      mutationFn: deleteCourseById,
   });
};

export const useGetCourseById = (id: string) => {
   return useQuery({
      queryKey: ["course", id || ""],
      queryFn: getCourseById,
      enabled: !!id,
   });
};

export const useEnrollInCourse = () => {
   return useMutation<Course, Error, string>({
      mutationFn: enrollInCourse,
   });
};

export const useUploadMaterial = () => {
   return useMutation<
      Material,
      Error,
      { courseId: string; title: string; file: File }
   >({
      mutationFn: uploadMaterial,
   });
};

export const useGetMaterials = (courseId: string) => {
   return useQuery<Material[], Error>({
      queryKey: ["materials", courseId],
      queryFn: () => getMaterials(courseId),
      enabled: !!courseId,
   });
};

export const useDeleteMaterial = () => {
   return useMutation<void, Error, string>({
      mutationFn: deleteMaterial,
   });
};

export const useGetRelatedCourses = (courseId: string) => {
   const { data: currentCourse } = useGetCourseById(courseId);

   return useQuery<Course[], Error>({
      queryKey: ["relatedCourses", courseId],
      queryFn: () => getRelatedCourses(currentCourse as Course),
      enabled: !!currentCourse, // Only run when we have the current course data
   });
};

export const useGetAllCoursesWithEnrollment = () => {
   const { data: allCourses, isLoading: isLoadingAll } = useGetAllCourses();
   const { data: enrolledCourses, isLoading: isLoadingEnrolled } =
      useGetEnrolledCourses();

   const mergedCourses = React.useMemo(() => {
      if (!allCourses) return [];

      return allCourses.map((course) => ({
         ...course,
         isEnrolled:
            enrolledCourses?.some((enrolled) => enrolled.id === course.id) ??
            false,
         materials: course.materials || [], // Ensure materials is always an array
      }));
   }, [allCourses, enrolledCourses]);

   return {
      data: mergedCourses,
      isLoading: isLoadingAll || isLoadingEnrolled,
   };
};

export const useUpdateCourseProgress = () => {
   const queryClient = useQueryClient();

   return useMutation<
      { progress: number },
      Error,
      { courseId: string; progress: number }
   >({
      mutationFn: async ({ courseId, progress }) => {
         const response = await authorizedAPI.put(
            `/courses/${courseId}/progress`,
            { progress }
         );
         return response.data;
      },
      onSuccess: () => {
         // Invalidate and refetch enrolled courses
         queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
      },
   });
};

// Add function to calculate course progress
export const calculateCourseProgress = (course: Course): number => {
   if (!course.materials || course.materials.length === 0) return 0;

   const materialsViewed = course.materials.filter((m) => m.viewed).length;
   return (materialsViewed / course.materials.length) * 100;
};

export const useMarkMaterialComplete = () => {
   const queryClient = useQueryClient();
   return useMutation<any, Error, { materialId: string }>({
      mutationFn: async ({ materialId }) => {
         const response = await authorizedAPI.patch(
            `/courses/materials/${materialId}/complete`
         );
         return response.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["materials"] });
         queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
      },
   });
};
