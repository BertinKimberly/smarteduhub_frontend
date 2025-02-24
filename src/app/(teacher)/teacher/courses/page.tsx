// app/courses/page.tsx
"use client";

import {
   useGetAllCourses,
   useCreateCourse,
   useDeleteCourse,
} from "@/hooks/useCourses";
import { Course, CourseFormData } from "@/types/course";
import { useState } from "react";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";
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
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardNavbar from "@/components/DashboardNavbar";

const CoursesPage = () => {
   // Replace static courses with real data
   const { data: courses, isLoading } = useGetAllCourses();
   const createCourseMutation = useCreateCourse();
   const deleteCourseMutation = useDeleteCourse();

   // States
   const [searchQuery, setSearchQuery] = useState("");
   const [newCourse, setNewCourse] = useState<CourseFormData>({
      title: "",
      description: "",
      category: "",
      level: "Beginner",
   });
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   // Filter courses based on search query
   const filteredCourses =
      courses?.filter((course) =>
         course.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

   // Handle new course creation
   const handleCreateCourse = async () => {
      if (newCourse.title && newCourse.description) {
         try {
            await createCourseMutation.mutateAsync({
               ...newCourse,
               file: selectedFile || undefined,
            });
            setNewCourse({
               title: "",
               description: "",
               category: "",
               level: "Beginner",
            });
            setSelectedFile(null);
            setIsDialogOpen(false);
         } catch (error) {
            console.error("Failed to create course:", error);
         }
      }
   };

   // Handle file selection
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
         setSelectedFile(e.target.files[0]);
      }
   };

   // Handle course deletion
   const handleDeleteCourse = async (courseId: string) => {
      try {
         await deleteCourseMutation.mutateAsync(courseId);
      } catch (error) {
         console.error("Failed to delete course:", error);
      }
   };

   if (isLoading) {
      return <div>Loading courses...</div>;
   }

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

   return (
      <>
         <DashboardNavbar title="Courses" />
         <div className="p-6 w-full mx-auto">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h1 className="text-3xl font-bold">My Courses</h1>
                  <p className="text-gray-500 mt-1">
                     Manage your courses and course materials
                  </p>
               </div>
               <Dialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
               >
                  <DialogTrigger asChild>
                     <Button className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" /> Create Course
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                     <DialogHeader>
                        <DialogTitle>Create New Course</DialogTitle>
                        <DialogDescription>
                           Fill in the details below to create a new course.
                        </DialogDescription>
                     </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                           <Label htmlFor="title">Course Title</Label>
                           <Input
                              id="title"
                              value={newCourse.title}
                              onChange={(e) =>
                                 setNewCourse({
                                    ...newCourse,
                                    title: e.target.value,
                                 })
                              }
                              placeholder="e.g., Introduction to Biology"
                           />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="description">Description</Label>
                           <Textarea
                              id="description"
                              value={newCourse.description}
                              onChange={(e) =>
                                 setNewCourse({
                                    ...newCourse,
                                    description: e.target.value,
                                 })
                              }
                              placeholder="Provide a brief description of the course"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="grid gap-2">
                              <Label htmlFor="category">Category</Label>
                              <Input
                                 id="category"
                                 value={newCourse.category}
                                 onChange={(e) =>
                                    setNewCourse({
                                       ...newCourse,
                                       category: e.target.value,
                                    })
                                 }
                                 placeholder="e.g., Science"
                              />
                           </div>
                           <div className="grid gap-2">
                              <Label htmlFor="level">Difficulty Level</Label>
                              <Select
                                 value={newCourse.level}
                                 onValueChange={(value) =>
                                    setNewCourse({
                                       ...newCourse,
                                       level: value as any,
                                    })
                                 }
                              >
                                 <SelectTrigger id="level">
                                    <SelectValue placeholder="Select level" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="Beginner">
                                       Beginner
                                    </SelectItem>
                                    <SelectItem value="Intermediate">
                                       Intermediate
                                    </SelectItem>
                                    <SelectItem value="Advanced">
                                       Advanced
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="file">Course Material</Label>
                           <Input
                              id="file"
                              type="file"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.ppt,.pptx"
                           />
                        </div>
                     </div>
                     <DialogFooter>
                        <Button
                           variant="outline"
                           onClick={() => setIsDialogOpen(false)}
                        >
                           Cancel
                        </Button>
                        <Button onClick={handleCreateCourse}>
                           Create Course
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>

            <div className="flex justify-between items-center mb-6">
               <div className="relative w-72">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="Search courses..."
                     className="pl-8"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="flex gap-2">
                  <Button
                     variant="outline"
                     className="flex items-center"
                  >
                     <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                  <Select>
                     <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="date">Last Updated</SelectItem>
                        <SelectItem value="students">Students</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredCourses.map((course) => (
                  <Card
                     key={course.id}
                     className="overflow-hidden border border-gray-200"
                  >
                     <div className="h-2 bg-blue-600"></div>
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h3 className="font-semibold text-lg line-clamp-1">
                                 {course.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                 {course.category}
                              </p>
                           </div>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                 >
                                    <MoreHorizontal className="h-4 w-4" />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 <DropdownMenuItem>
                                    Edit Course
                                 </DropdownMenuItem>
                                 <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                 <DropdownMenuItem>Archive</DropdownMenuItem>
                                 <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                       handleDeleteCourse(course.id)
                                    }
                                 >
                                    Delete
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                           {course.description}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                           <Badge variant="secondary">{course.level}</Badge>
                           <Badge
                              variant="outline"
                              className={getStatusStyle(course.status)}
                           >
                              {course.status}
                           </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="text-sm text-gray-500">
                              <span className="font-medium">
                                 {course.students}
                              </span>{" "}
                              students
                           </div>
                           <div className="text-sm text-gray-500">
                              Updated: {course.lastUpdated}
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {filteredCourses.length === 0 && (
               <div className="text-center py-12">
                  <p className="text-gray-500">
                     No courses found. Try a different search term or create a
                     new course.
                  </p>
               </div>
            )}
         </div>
      </>
   );
};

export default CoursesPage;
