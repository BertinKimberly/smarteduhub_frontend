import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
   Rating,
   RatingCreate,
   RatingWithFeedback,
   RatingStats,
} from "@/types/rating";
import { toast } from "react-toastify";

interface CreateRatingData {
   courseId: string;
   rating: number;
   feedback: string;
}

interface RatingError {
   message: string;
   status: number;
}

const createRating = async (data: CreateRatingData): Promise<Rating> => {
   const ratingData: RatingCreate = {
      course_id: data.courseId,
      rating: data.rating,
      feedback: data.feedback || undefined,
   };

   try {
      return await handleApiRequest(() =>
         authorizedAPI.post(`/ratings`, ratingData)
      );
   } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to submit rating";
      throw { message, status: error.response?.status || 500 } as RatingError;
   }
};

const getRatings = async (courseId: string): Promise<RatingWithFeedback[]> => {
   try {
      return await handleApiRequest(() =>
         authorizedAPI.get(`/ratings/course/${courseId}`)
      );
   } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to fetch ratings";
      throw { message, status: error.response?.status || 500 } as RatingError;
   }
};

const getRatingStats = async (courseId: string): Promise<RatingStats> => {
   try {
      return await handleApiRequest(() =>
         authorizedAPI.get(`/ratings/stats/${courseId}`)
      );
   } catch (error: any) {
      const message =
         error.response?.data?.detail || "Failed to fetch rating stats";
      throw { message, status: error.response?.status || 500 } as RatingError;
   }
};

export const useCreateRating = () => {
   const queryClient = useQueryClient();

   return useMutation<Rating, RatingError, CreateRatingData>({
      mutationFn: createRating,
      onSuccess: (_, variables) => {
         // Invalidate both ratings and stats queries for the course
         queryClient.invalidateQueries({
            queryKey: ["ratings", variables.courseId],
         });
         queryClient.invalidateQueries({
            queryKey: ["ratingStats", variables.courseId],
         });
         queryClient.invalidateQueries({
            queryKey: ["course", variables.courseId],
         });
      },
      onError: (error) => {
         toast.error(error.message);
      },
   });
};

export const useGetRatings = (courseId: string) => {
   return useQuery<RatingWithFeedback[], RatingError>({
      queryKey: ["ratings", courseId],
      queryFn: () => getRatings(courseId),
      enabled: !!courseId,
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      retry: (failureCount, error) => {
         // Don't retry on 404s
         if (error.status === 404) return false;
         // Retry up to 3 times for other errors
         return failureCount < 3;
      },
   });
};

export const useGetRatingStats = (courseId: string) => {
   return useQuery<RatingStats, RatingError>({
      queryKey: ["ratingStats", courseId],
      queryFn: () => getRatingStats(courseId),
      enabled: !!courseId,
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      retry: (failureCount, error) => {
         // Don't retry on 404s
         if (error.status === 404) return false;
         // Retry up to 3 times for other errors
         return failureCount < 3;
      },
   });
};
