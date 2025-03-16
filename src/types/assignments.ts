// types/assignments.ts
export interface Assignment {
   id: string;
   title: string;
   description?: string;
   course_id: string;
   google_form_url?: string;
   created_at: string;
   due_date?: string;
   submitted_at?: string;
   course: {
     id: string;
     title: string;
   };
 }
 
 export interface AssignmentFormData {
   title: string;
   description?: string;
   course_id: string;
   google_form_url?: string;
   due_date?: string;
 }
 
 export interface AssignmentStats {
   total: number;
   pending: number;
   completed: number;
   overdue: number;
 }
 
 export interface CourseWithAssignments {
   courseId: string;
   courseTitle: string;
   assignments: Assignment[];
 }