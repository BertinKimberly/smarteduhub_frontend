export interface Course {
   id: string;
   title: string;
   description: string;
   category: string;
   level: "Beginner" | "Intermediate" | "Advanced";
   file_path?: string;
   teacher_id: string;
   created_at: string;
   updated_at: string;
}

export interface CourseFormData {
   title: string;
   description: string;
   category: string;
   level: "Beginner" | "Intermediate" | "Advanced";
   file?: File;
}
