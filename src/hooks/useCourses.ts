import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getAllCourses = (): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.get("/courses"));
};

const createCourse = (formData: any): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post("/courses", formData, { withCredentials: true })
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

const deleteCourseById = ({ queryKey }: any): Promise<any> => {
   const [_, _id] = queryKey;
   return handleApiRequest(() => authorizedAPI.get(`/courses/${_id}`));
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
   return useMutation<any, Error, any>({
      mutationFn: deleteCourseById,
   });
};

export const useGetCourseById = (_id: string) =>
   useQuery<any, Error, any>({
      queryKey: ["course", _id],
      queryFn: getCourseById,
   });
