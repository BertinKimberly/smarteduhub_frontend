import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getAllRatings = (): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.get("/ratings"));
};

const createRating = (formData: any): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.post("/ratings", formData));
};

const updateRatings = ({ formData, _id }: any): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/ratings/${_id}`, formData)
   );
};

const getRatingsById = ({ queryKey }: any): Promise<any> => {
   const [_, _id] = queryKey;
   return handleApiRequest(() => authorizedAPI.get(`/ratings/${_id}`));
};

const deleteRatingsById = ({ queryKey }: any): Promise<any> => {
   const [_, _id] = queryKey;
   return handleApiRequest(() => authorizedAPI.get(`/ratings/${_id}`));
};

export const useGetAllRatings = () =>
   useQuery<any, Error>({ queryKey: ["ratings"], queryFn: getAllRatings });

export const useCreateRating = () => {
   return useMutation<any, Error, any>({
      mutationFn: createRating,
   });
};

export const useUpdateRatings = () => {
   return useMutation<any, Error, any>({
      mutationFn: updateRatings,
   });
};

export const deleteRatings = () => {
   return useMutation<any, Error, any>({
      mutationFn: deleteRatingsById,
   });
};

export const useGetRatingsById = (_id: string) =>
   useQuery<any, Error, any>({
      queryKey: ["ratings", _id],
      queryFn: getRatingsById,
   });
