"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
   useCreateCourse,
   useDeleteCourse,
   useGetAllCourses,
   useUpdateCourse,
} from "@/hooks/useCourses";
import { Edit, Trash2 } from "lucide-react";
import Empty from "@/components/Empty";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";

interface Course {
   id: string;
   title: string;
   description: string;
}

const CoursesAdmin = () => {
   const { data: courses = [], isLoading } = useGetAllCourses();
   const deleteCourseMutation = useDeleteCourse();
   const createCourseMutation = useCreateCourse();
   const updateCourseMutation = useUpdateCourse();
   const [open, setOpen] = useState(false);
   const [editCourse, setEditCourse] = useState<Course | null>(null);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<Course>();

   const handleDelete = (id: string) => {
      deleteCourseMutation.mutate(id);
   };

   const handleEdit = (course: Course) => {
      setEditCourse(course);
      setOpen(true);
   };

   const onSubmit = (data: Course) => {
      if (editCourse) {
         updateCourseMutation.mutate(
            { _id: editCourse.id, formData: data },
            {
               onSuccess: () => {
                  setEditCourse(null);
                  setOpen(false);
                  reset();
               },
            }
         );
      } else {
         createCourseMutation.mutate(data, {
            onSuccess: () => {
               setOpen(false);
               reset();
            },
         });
      }
   };

   const columns: ColumnDef<Course>[] = [
      {
         accessorKey: "title",
         header: "Name",
      },
      {
         accessorKey: "description",
         header: "Description",
      },
      {
         accessorKey: "actions",
         header: "Actions",
         cell: (row) => {
            const course = row.row.original;
            return (
               <div className="flex items-center space-x-2">
                  <Button className="bg-main" onClick={() => handleEdit(course)}>
                     <Edit size={20} />
                  </Button>
                  <Button className="bg-red-500" onClick={() => handleDelete(course.id)}>
                     <Trash2 size={20} />
                  </Button>
               </div>
            );
         },
      },
   ];

   if (isLoading) return <div>Loading...</div>;

   return (
      <div className="p-3">
         <DashboardNavbar title="Courses" />
         <div className="p-3">
            <div className="my-6 flex items-center justify-between">
               <h3>A List of all courses</h3>

               <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                     <Button className="bg-main p-6" onClick={() => setEditCourse(null)}>
                        Create Course
                     </Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>{editCourse ? "Edit Course" : "Create a New Course"}</DialogTitle>
                     </DialogHeader>
                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                           {...register("title", { required: "Title is required" })}
                           placeholder="Course Title"
                           defaultValue={editCourse?.title}
                        />
                        {errors.title?.message && (
                           <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}

                        <Textarea
                           {...register("description")}
                           placeholder="Course Description"
                           defaultValue={editCourse?.description}
                        />

                        <Button type="submit" className="w-full bg-main">
                           {editCourse ? "Update Course" : "Create Course"}
                        </Button>
                     </form>
                  </DialogContent>
               </Dialog>
            </div>

            {courses.length === 0 ? <Empty /> : <DataTable columns={columns} data={courses} />}
         </div>
      </div>
   );
};

export default CoursesAdmin;
