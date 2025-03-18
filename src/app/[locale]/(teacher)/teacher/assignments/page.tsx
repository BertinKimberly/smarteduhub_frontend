//@ts-nocheck
"use client";

import React, { useState } from "react";
import {
  useGetTeacherAssignments,
  useCreateAssignment,
} from "@/hooks/useAssignments";
import { useGetAllCourses } from "@/hooks/useCourses";
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
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Search, Plus, MoreHorizontal, Loader2, ClipboardList } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Tilt from "react-parallax-tilt";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  google_form_url: z
    .string()
    .url("Must be a valid URL")
    .refine((url) => url.includes("docs.google.com/forms"), {
      message: "Must be a valid Google Form URL",
    })
    .optional()
    .or(z.string().length(0)),
  course_id: z.string().min(1, "Course is required"),
});

type FormData = z.infer<typeof formSchema>;

const TeacherAssignmentsPage = () => {
  const { data: assignments, error, isLoading } = useGetTeacherAssignments();
  const { data: courses } = useGetAllCourses();
  const createMutation = useCreateAssignment();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

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
        data.google_form_url = data.google_form_url.replace("/edit", "/viewform");
      }

      await createMutation.mutateAsync(data);
      toast.success("Assignment created successfully");
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create assignment");
    }
  };

  // Filter assignments based on search query
  const filteredAssignments = assignments?.filter((assignment) => {
    return assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  // Get course name by ID
  const getCourseNameById = (courseId) => {
    const course = courses?.find((c) => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-blue-600 font-medium">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar title="Assignments" />
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            My Assignments
          </h1>
          <p className="text-blue-100 text-lg md:w-2/3">
            Create and manage assignments for your courses
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-6 -mt-12 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-grow">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search assignments..."
                  className="pl-10 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="mr-2 h-4 w-4" /> Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Create New Assignment</DialogTitle>
                  <DialogDescription>
                    Fill in the assignment details to create a new assignment for your students.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input
                              className="border-gray-200"
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
                              className="border-gray-200 min-h-[100px]"
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
                              className="border-gray-200"
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
                              <SelectTrigger className="border-gray-200">
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courses?.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
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
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Assignment"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveFilter}>
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md">
              All Assignments
            </TabsTrigger>
            <TabsTrigger value="recent" className="rounded-md">
              Recent
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-md">
              Upcoming
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <Tilt
                key={assignment.id}
                className="rounded-xl overflow-hidden"
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                scale={1.02}
                transitionSpeed={400}
              >
                <Card className="border border-blue-100 h-full">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full">
                      <ClipboardList className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {getCourseNameById(assignment.course_id)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer">
                            Edit Assignment
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            View Submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 cursor-pointer">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                      {assignment.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                        Assignment
                      </Badge>
                      {assignment.google_form_url && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Google Form
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">
                          {assignment.submissions?.length || 0}
                        </span>{" "}
                        submissions
                      </div>
                      {assignment.google_form_url && (
                        <a
                          href={assignment.google_form_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Open Form
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </Tilt>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg col-span-3">
              <div className="mb-4">
                <ClipboardList className="h-12 w-12 mx-auto text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No assignments found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery
                  ? "Try a different search term or clear your filters."
                  : "Create your first assignment by clicking the 'Create Assignment' button."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherAssignmentsPage;