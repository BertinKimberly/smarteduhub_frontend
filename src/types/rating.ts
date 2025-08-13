import { User } from "./user";
import { Course } from "./course";

export interface Rating {
   id: string;
   student_id: string;
   course_id: string;
   rating: number;
   feedback: string | null;
   created_at: string;
   student: User;
   course: Course;
}

export interface RatingCreate {
   course_id: string;
   rating: number;
   feedback?: string;
}

export interface RatingStats {
   averageRating: number;
   totalRatings: number;
   ratingDistribution: {
      [key: number]: number; // key is 1-5, value is count
   };
}

export interface RatingWithFeedback extends Rating {
   student: {
      name: string;
      email: string;
      avatar?: string;
   };
   created_at: string;
}
