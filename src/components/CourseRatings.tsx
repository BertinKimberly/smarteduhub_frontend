import React from "react";
import { Star, StarHalf } from "lucide-react";
import { useGetRatings, useGetRatingStats } from "@/hooks/useRatings";
import { RatingWithFeedback, RatingStats } from "@/types/rating";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface CourseRatingsProps {
   courseId: string;
}

export const CourseRatings: React.FC<CourseRatingsProps> = ({ courseId }) => {
   const { data: ratings, isLoading: ratingsLoading } = useGetRatings(courseId);
   const { data: stats, isLoading: statsLoading } = useGetRatingStats(courseId);

   if (ratingsLoading || statsLoading) {
      return <div>Loading ratings...</div>;
   }

   const renderStars = (rating: number) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
         if (i <= rating) {
            stars.push(
               <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
               />
            );
         } else if (i - 0.5 === rating) {
            stars.push(
               <StarHalf
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
               />
            );
         } else {
            stars.push(
               <Star
                  key={i}
                  className="h-4 w-4 text-gray-300"
               />
            );
         }
      }
      return stars;
   };

   return (
      <div className="space-y-6">
         {/* Rating Statistics */}
         {stats && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
               <div className="flex items-center gap-8">
                  <div className="text-center">
                     <div className="text-4xl font-bold text-gray-900">
                        {stats.averageRating.toFixed(1)}
                     </div>
                     <div className="flex items-center justify-center gap-1 my-2">
                        {renderStars(stats.averageRating)}
                     </div>
                     <div className="text-sm text-gray-500">
                        {stats.totalRatings} ratings
                     </div>
                  </div>
                  <div className="flex-1 space-y-2">
                     {[5, 4, 3, 2, 1].map((rating) => (
                        <div
                           key={rating}
                           className="flex items-center gap-2"
                        >
                           <span className="text-sm text-gray-600 w-6">
                              {rating}
                           </span>
                           <Progress
                              value={
                                 ((stats.ratingDistribution[rating] || 0) /
                                    stats.totalRatings) *
                                 100
                              }
                              className="h-2"
                           />
                           <span className="text-sm text-gray-500 w-12">
                              {stats.ratingDistribution[rating] || 0}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* Individual Reviews */}
         <div className="space-y-6">
            {ratings?.map((rating) => (
               <div
                  key={rating.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
               >
                  <div className="flex items-start gap-4">
                     <Avatar>
                        <AvatarFallback>
                           {rating.student.name.charAt(0)}
                        </AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                        <div className="flex items-center justify-between">
                           <h4 className="font-medium text-gray-900">
                              {rating.student.name}
                           </h4>
                           <span className="text-sm text-gray-500">
                              {formatDistanceToNow(
                                 new Date(rating.created_at),
                                 { addSuffix: true }
                              )}
                           </span>
                        </div>
                        <div className="flex items-center gap-1 my-2">
                           {renderStars(rating.rating)}
                        </div>
                        {rating.feedback && (
                           <p className="text-gray-600 mt-2">
                              {rating.feedback}
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};
