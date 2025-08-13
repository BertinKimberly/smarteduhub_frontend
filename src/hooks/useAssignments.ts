//@ts-nocheck
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
interface Assignment {
   id: string;
   title: string;
   description?: string;
   course_id: string;
   google_form_url?: string;
   created_at: string;
   course: {
      id: string;
      title: string;
   };
}

const getAllAssignments = (): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.get("/assignments"));
};

const createAssignment = (formData: any): Promise<Assignment> => {
   const payload = {
      ...formData,
      google_form_url: formData.google_form_url || null, // Ensure null if empty
   };
   return handleApiRequest(() => authorizedAPI.post("/assignments", payload));
};

const updateAssignment = ({ formData, _id }: any): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/assignments/${_id}`, formData)
   );
};

const getAssignmentById = ({ queryKey }: any): Promise<any> => {
   const [_, _id] = queryKey;
   if (!_id) throw new Error("Assignment ID is required");
   return handleApiRequest(() => authorizedAPI.get(`/assignments/${_id}`));
};

const deleteAssignmentById = (_id: string): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.delete(`/assignments/${_id}`));
};

const getTeacherAssignments = (): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.get("/assignments/teacher"));
};

const getStudentAssignments = (): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.get("/assignments/student"));
};

const submitAssignment = (data: { assignmentId: string }): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post(`/assignments/${data.assignmentId}/submit`)
   );
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

export const useGetAssignmentById = (_id?: string) =>
   useQuery<any, Error>({
      queryKey: ["assignment", _id],
      queryFn: getAssignmentById,
      enabled: !!_id, // Only run the query if _id exists
   });

export const useGetTeacherAssignments = () =>
   useQuery<Assignment[], Error>({
      queryKey: ["teacherAssignments"],
      queryFn: getTeacherAssignments,
      retry: false,
      onError: (error) => {
         console.error("Error fetching teacher assignments:", error);
      },
   });

export const useGetStudentAssignments = () =>
   useQuery<Assignment[], Error>({
      queryKey: ["studentAssignments"],
      queryFn: getStudentAssignments,
      retry: false,
      onError: (error) => {
         console.error("Error fetching student assignments:", error);
      },
   });

export const useSubmitAssignment = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: submitAssignment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["studentAssignments"] });
      },
   });
};
