import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Rating, RatingCreate } from "@/types/rating";

interface CreateRatingData {
   courseId: string;
   rating: number;
   feedback: string;
}

const createRating = (data: CreateRatingData): Promise<Rating> => {
   const ratingData: RatingCreate = {
      course_id: data.courseId,
      rating: data.rating,
      feedback: data.feedback || undefined,
   };

   return handleApiRequest(() => authorizedAPI.post(`/ratings`, ratingData));
};

export const useCreateRating = () => {
   const queryClient = useQueryClient();

   return useMutation<Rating, Error, CreateRatingData>({
      mutationFn: createRating,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["course"] });
      },
   });
};
