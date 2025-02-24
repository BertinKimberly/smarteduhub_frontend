import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Course, CourseFormData } from "@/types/course";

const getAllCourses = (): Promise<Course[]> => {
   return handleApiRequest(() => authorizedAPI.get("/courses"));
};

const createCourse = (data: CourseFormData): Promise<Course> => {
   const formData = new FormData();
   formData.append("title", data.title);
   formData.append("description", data.description || "");
   formData.append("category", data.category);
   formData.append("level", data.level);
   if (data.file) {
      formData.append("file", data.file);
   }

   return handleApiRequest(() =>
      authorizedAPI.post("/courses", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
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
   return handleApiRequest(() => authorizedAPI.put(`/courses/${id}`, data));
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

const uploadCourseMaterial = ({
   id,
   file,
}: {
   id: string;
   file: File;
}): Promise<Course> => {
   const formData = new FormData();
   formData.append("file", file);

   return handleApiRequest(() =>
      authorizedAPI.post(`/courses/${id}/upload`, formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      })
   );
};

const getEnrolledCourses = (): Promise<Course[]> => {
   return handleApiRequest(() => authorizedAPI.get("/courses/enrolled/me"));
};

const enrollInCourse = (id: string): Promise<Course> => {
   return handleApiRequest(() => authorizedAPI.post(`/courses/${id}/enroll`));
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
