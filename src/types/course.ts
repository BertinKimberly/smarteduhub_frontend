import { User } from "./user";
import { Assignment } from "./assignment";
import { Rating } from "./rating";

export type Material = {
   id: string;
   title: string;
   file_path: string;
   course_id: string;
   created_at: string;
};

export type Lesson = {
   id: string;
   title: string;
   type: "pdf" | "document" | "assignment" | "reading";
   file_path?: string;
   created_at: string;
   course_id: string;
};

export type Course = {
   id: string;
   title: string;
   description?: string;
   long_description?: string;
   prerequisites?: string;
   teacher_id: string;
   category: string;
   level: string;
   created_at: string;
   materials: Material[];
   teacher?: User;
   // Additional frontend display properties
   status?: string;
   students?: number;
   lastUpdated?: string;
};

export type Enrollment = {
   id: string;
   user_id: string;
   course_id: string;
   enrolled_at: string;
   user: User;
   course: Course;
};

export type CourseFormData = {
   title: string;
   description?: string;
   long_description?: string;
   prerequisites?: string;
   category: string;
   level: string;
};
