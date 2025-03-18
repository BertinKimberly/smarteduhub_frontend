import { User } from "./user";
import { Rating } from "./rating";

export interface Material {
   id: string;
   title: string;
   file_path: string;
   course_id: string;
   created_at: string;
   viewed?: boolean; // added to track if material is completed
}

export interface Enrollment {
   id: string;
   student_id: string;
   course_id: string;
   progress: number;
   last_accessed: string;
   created_at: string;
}

export interface Course {
   id: string;
   title: string;
   description: string | null;
   long_description: string | null;
   prerequisites: string[] | null;
   category: string;
   level: string;
   created_at: string;
   teacher: User;
   materials: Material[];
   ratings: Rating[];
   isEnrolled?: boolean;
   enrollments: Enrollment[];
   duration?: string;
}

export interface CourseFormData {
   title: string;
   description?: string;
   long_description?: string;
   prerequisites?: string[];
   category: string;
   level: string;
}
