"use client";
import React from "react";
import {
   useGetTeacherAssignments,
   useCreateAssignment,
} from "@/hooks/useAssignments";
import { useGetAllCourses } from "@/hooks/useCourses"; // Add this import
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
} from "@/components/ui/form";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"; // Add these imports
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const formSchema = z.object({
   title: z.string().min(1, "Title is required"),
   description: z.string().min(1, "Description is required"),
   google_form_url: z
      .string()
      .url("Must be a valid URL")
      .refine((url) => url.includes("docs.google.com/forms"), {
         message: "Must be a valid Google Form URL",
      })
      .optional(),
   course_id: z.string().min(1, "Course ID is required"),
});

type FormData = z.infer<typeof formSchema>;

const TeacherAssignmentsPage = () => {
   const { data, error, isLoading } = useGetTeacherAssignments();
   const { data: courses } = useGetAllCourses();
   const createMutation = useCreateAssignment();

   const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         title: "",
         description: "",
         google_form_url: "",
         course_id: "",
      },
   });

   const onSubmit = async (data: FormData) => {
      try {
         // Ensure the Google Form URL is in the correct format
         if (data.google_form_url) {
            // Convert edit URL to viewform URL if necessary
            data.google_form_url = data.google_form_url.replace(
               "/edit",
               "/viewform"
            );
         }

         await createMutation.mutateAsync(data);
         toast.success("Assignment created successfully");
         form.reset();
      } catch (error) {
         toast.error("Failed to create assignment");
      }
   };

   return (
      <div className="p-6 space-y-8">
         <div className="bg-gradient-to-b from-background via-white to-main rounded-lg p-4 md:p-10 shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Create New Assignment</h1>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Title *</FormLabel>
                           <FormControl>
                              <Input
                                 className="bg-white p-6 outline-none border border-main"
                                 placeholder="Assignment title"
                                 {...field}
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Description *</FormLabel>
                           <FormControl>
                              <Textarea
                                 className="bg-white p-4 outline-none border border-main min-h-[100px]"
                                 placeholder="Assignment description"
                                 {...field}
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="google_form_url"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Google Form URL</FormLabel>
                           <FormControl>
                              <Input
                                 className="bg-white p-6 outline-none border border-main"
                                 placeholder="https://forms.google.com/..."
                                 {...field}
                              />
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="course_id"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Course *</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger className="bg-white p-6 outline-none border border-main">
                                    <SelectValue placeholder="Select a course" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {courses?.map((course: any) => (
                                    <SelectItem
                                       key={course.id}
                                       value={course.id}
                                    >
                                       {course.title}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </FormItem>
                     )}
                  />

                  <Button
                     type="submit"
                     className="w-full bg-main py-6"
                  >
                     {createMutation.isPending
                        ? "Creating..."
                        : "Create Assignment"}
                  </Button>
               </form>
            </Form>
         </div>

         <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Your Assignments</h2>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error loading assignments</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {data?.map((assignment: any) => (
                  <div
                     key={assignment.id}
                     className="bg-white p-4 rounded shadow-md"
                  >
                     <h3 className="font-bold text-lg">{assignment.title}</h3>
                     <p className="text-gray-600 mt-2">
                        {assignment.description}
                     </p>
                     {assignment.google_form_url && (
                        <a
                           href={assignment.google_form_url}
                           target="_blank"
                           rel="noreferrer"
                           className="text-main hover:underline mt-4 inline-block"
                        >
                           Open Google Form
                        </a>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default TeacherAssignmentsPage;
