"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useDeleteCourse, useGetAllCourses } from "@/hooks/useCourses";
import { Edit, Trash2 } from "lucide-react";
import Empty from "@/components/Empty";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import CourseForm from "@/components/CourseForm";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
}

const CoursesAdmin = () => {
  const { data: courses = [], isLoading } = useGetAllCourses();
  const deleteCourseMutation = useDeleteCourse();
  const [open, setOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const handleDelete = (id: string) => deleteCourseMutation.mutate(id);

  const handleEdit = (course: Course) => {
    setEditCourse(course);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCourse(null);
  };

  const columns: ColumnDef<Course>[] = [
    { accessorKey: "title", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "level", header: "Level" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="text-main cursor-pointer" onClick={() => handleEdit(row.original)}>
            <Edit size={20} />
          </div>
          <div className="text-red-500 cursor-pointer" onClick={() => handleDelete(row.original.id)}>
            <Trash2 size={20} />
          </div>
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-3">
      <DashboardNavbar title="Courses" />
      <div className="p-3">
        <div className="my-6 flex items-center justify-between">
          <h3>A List of all courses</h3>
          <Button className="bg-main p-6" onClick={() => setOpen(true)}>
            Create Course
          </Button>
        </div>
        {/* @ts-ignore */}
        {courses.length === 0 ? <Empty /> : <DataTable columns={columns} data={courses} />}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCourse ? "Edit Course" : "Create a New Course"}</DialogTitle>
          </DialogHeader>
          <CourseForm editCourse={editCourse} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesAdmin;
