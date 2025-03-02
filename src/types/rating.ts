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
