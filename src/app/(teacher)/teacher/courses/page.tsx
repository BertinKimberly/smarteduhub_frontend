"use client";

import { useGetAllCourses, useDeleteCourse } from "@/hooks/useCourses";
import { useState } from "react";
import { Search, Plus, MoreHorizontal, Filter, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import DashboardNavbar from "@/components/DashboardNavbar";
import CourseCreateForm from "@/components/CourseCreateForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CoursesPage = () => {
  // Data fetching
  const { data: courses, isLoading } = useGetAllCourses();
  const deleteCourseMutation = useDeleteCourse();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter courses based on search query and active filter
  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || 
      course.status.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  }) || [];

  // Handle course deletion
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourseMutation.mutateAsync(courseId);
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  // Status badge styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-blue-600 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar title="Courses" />
      <div className="max-w-7xl mx-auto p-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Courses
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your courses and course materials
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create New Course</DialogTitle>
                <DialogDescription>
                  Fill in the course details and add materials to publish your course.
                </DialogDescription>
              </DialogHeader>
              <CourseCreateForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses by title or category..."
                className="pl-10 h-12 rounded-lg shadow-sm border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 lg:col-span-1">
            <Select>
              <SelectTrigger className="h-12 rounded-lg shadow-sm border-gray-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="titleDesc">Title Z-A</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="students">Most Students</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="h-12 rounded-lg shadow-sm border-gray-200 flex-1"
            >
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveFilter}>
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md">All Courses</TabsTrigger>
            <TabsTrigger value="active" className="rounded-md">Active</TabsTrigger>
            <TabsTrigger value="draft" className="rounded-md">Drafts</TabsTrigger>
            <TabsTrigger value="archived" className="rounded-md">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {course.category}
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
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Preview Course
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        {course.status === "Archived" ? "Unarchive" : "Archive"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                    {course.level}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${getStatusStyle(course.status)} border-0`}
                  >
                    {course.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{course.students}</span>{" "}
                    students
                  </div>
                  <div className="text-xs text-gray-400">
                    Updated: {course.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery 
                ? "Try a different search term or clear your filters."
                : "Create your first course by clicking the 'Create Course' button."}
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
    </>
  );
};

export default CoursesPage;