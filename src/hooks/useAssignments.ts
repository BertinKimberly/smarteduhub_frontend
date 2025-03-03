import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getAllAssignments = (): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.get("/assignments"));
};

const createAssignment = (formData: any): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.post("/assignments", formData));
};

const updateAssignment = ({ formData, _id }: any): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/assignments/${_id}`, formData)
   );
};

const getAssignmentById = ({ queryKey }: any): Promise<any> => {
   const [_, _id] = queryKey;
   return handleApiRequest(() => authorizedAPI.get(`/assignments/${_id}`));
};

const deleteAssignmentById = (_id: string): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.delete(`/assignments/${_id}`));
};

export const useGetAllAssignments = () =>
   useQuery<any, Error>({
      queryKey: ["assignments"],
      queryFn: getAllAssignments,
   });

export const useCreateAssignment = () => {
   return useMutation<any, Error, any>({
      mutationFn: createAssignment,
   });
};

export const useUpdateAssignment = () => {
   return useMutation<any, Error, any>({
      mutationFn: updateAssignment,
   });
};

export const useDeleteAssignment = () => {
   return useMutation<any, Error, string>({
      mutationFn: deleteAssignmentById,
   });
};

export const useGetAssignmentById = (_id: string) =>
   useQuery<any, Error, any>({
      queryKey: ["assignment", _id],
      queryFn: getAssignmentById,
   });
