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

export interface CourseFormData {
   title: string;
   description: string;
   long_description?: string;
   prerequisites?: string[];
   category: string;
   level: string;
}

export interface Course extends CourseFormData {
   id: string;
   teacher: {
      id: string;
      name: string;
      email: string;
   };
   materials: Array<{
      id: string;
      title: string;
      file_path: string;
   }>;
   ratings: any[];
   enrollments: any[];
   is_enrolled: boolean;
   progress?: number;
}
