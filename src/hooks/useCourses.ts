import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";

const getAllCourses = (): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.get("/courses"));
};

const createCourse = (formData: FormData): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post("/courses", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
         withCredentials: true,
      })
   );
};

const updateCourse = ({ formData, _id }: any): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/courses/${_id}`, formData, { withCredentials: true })
   );
};

const getCourseById = ({ queryKey }: any): Promise<any> => {
   const [_, _id] = queryKey;
   return handleApiRequest(() => authorizedAPI.get(`/courses/${_id}`));
};

const deleteCourseById = (_id: string): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.delete(`/courses/${_id}`));
};

const enrollInCourse = (_id: string): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post(
         `/courses/${_id}/enroll`,
         {},
         { withCredentials: true }
      )
   );
};

export const useGetAllCourses = () =>
   useQuery<any, Error>({ queryKey: ["courses"], queryFn: getAllCourses });

export const useCreateCourse = () => {
   return useMutation<any, Error, any>({
      mutationFn: createCourse,
   });
};

export const useUpdateCourse = () => {
   return useMutation<any, Error, any>({
      mutationFn: updateCourse,
   });
};

export const useDeleteCourse = () => {
   return useMutation<any, Error, string>({
      mutationFn: deleteCourseById,
   });
};

export const useGetCourseById = (id: string | null) => {
   return useQuery({
      queryKey: ["course", id],
      queryFn: getCourseById,
      enabled: !!id,
   });
};

export const useEnrollInCourse = () => {
   return useMutation<any, Error, string>({
      mutationFn: enrollInCourse,
   });
};
