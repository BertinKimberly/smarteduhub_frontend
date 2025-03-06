import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
   Rating,
   RatingCreate,
   RatingWithFeedback,
   RatingStats,
} from "@/types/rating";

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

const getRatings = (courseId: string): Promise<RatingWithFeedback[]> => {
   return handleApiRequest(() =>
      authorizedAPI.get(`/ratings/course/${courseId}`)
   );
};

const getRatingStats = (courseId: string): Promise<RatingStats> => {
   return handleApiRequest(() =>
      authorizedAPI.get(`/ratings/stats/${courseId}`)
   );
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

export const useGetRatings = (courseId: string) => {
   return useQuery<RatingWithFeedback[], Error>({
      queryKey: ["ratings", courseId],
      queryFn: () => getRatings(courseId),
      enabled: !!courseId,
   });
};

export const useGetRatingStats = (courseId: string) => {
   return useQuery<RatingStats, Error>({
      queryKey: ["ratingStats", courseId],
      queryFn: () => getRatingStats(courseId),
      enabled: !!courseId,
   });
};
