// app/students/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
   Search,
   Filter,
   Download,
   UserPlus,
   MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardNavbar from "@/components/DashboardNavbar";

// Types
interface Student {
   id: string;
   name: string;
   email: string;
   enrolledCourses: string[];
   avatar?: string;
   grade: string;
   lastActive: string;
   performance: "Excellent" | "Good" | "Average" | "Needs Improvement";
}

interface Course {
   id: string;
   title: string;
}

const StudentsPage = () => {
   // Sample courses data
   const [courses, setCourses] = useState<Course[]>([
      { id: "c1", title: "Introduction to Mathematics" },
      { id: "c2", title: "Advanced Physics" },
      { id: "c3", title: "World History" },
      { id: "c4", title: "Literature Analysis" },
      { id: "c5", title: "Computer Programming" },
   ]);

   // Sample students data
   const [students, setStudents] = useState<Student[]>([
      {
         id: "s1",
         name: "Emma Johnson",
         email: "emma.j@school.edu",
         enrolledCourses: ["c1", "c4", "c5"],
         grade: "10th",
         lastActive: "2025-02-23",
         performance: "Excellent",
      },
      {
         id: "s2",
         name: "Liam Smith",
         email: "liam.s@school.edu",
         enrolledCourses: ["c2", "c5"],
         grade: "11th",
         lastActive: "2025-02-22",
         performance: "Good",
      },
      {
         id: "s3",
         name: "Olivia Brown",
         email: "olivia.b@school.edu",
         enrolledCourses: ["c1", "c3"],
         grade: "9th",
         lastActive: "2025-02-20",
         performance: "Average",
      },
      {
         id: "s4",
         name: "Noah Davis",
         email: "noah.d@school.edu",
         enrolledCourses: ["c2", "c3", "c4"],
         grade: "10th",
         lastActive: "2025-02-24",
         performance: "Good",
      },
      {
         id: "s5",
         name: "Ava Wilson",
         email: "ava.w@school.edu",
         enrolledCourses: ["c1", "c5"],
         grade: "11th",
         lastActive: "2025-02-21",
         performance: "Excellent",
      },
      {
         id: "s6",
         name: "James Miller",
         email: "james.m@school.edu",
         enrolledCourses: ["c3", "c4"],
         grade: "9th",
         lastActive: "2025-02-19",
         performance: "Needs Improvement",
      },
   ]);

   // States for filtering and UI
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
   const [selectedGrade, setSelectedGrade] = useState<string>("all");
   const [selectedPerformance, setSelectedPerformance] =
      useState<string>("all");
   const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
   const [newStudent, setNewStudent] = useState<Partial<Student>>({
      name: "",
      email: "",
      enrolledCourses: [],
      grade: "10th",
      performance: "Average",
   });
   const [filteredStudents, setFilteredStudents] =
      useState<Student[]>(students);

   // Get student initials for avatar fallback
   const getInitials = (name: string) => {
      const names = name.split(" ");
      if (names.length >= 2) {
         return `${names[0][0]}${names[1][0]}`;
      }
      return name.substring(0, 2).toUpperCase();
   };

   // Get performance badge styling
   const getPerformanceBadgeStyle = (performance: string) => {
      switch (performance) {
         case "Excellent":
            return "bg-green-100 text-green-800";
         case "Good":
            return "bg-blue-100 text-blue-800";
         case "Average":
            return "bg-yellow-100 text-yellow-800";
         case "Needs Improvement":
            return "bg-red-100 text-red-800";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   // Handle course selection for filtering
   const handleCourseFilterChange = (courseId: string) => {
      setSelectedCourses((prev) => {
         if (prev.includes(courseId)) {
            return prev.filter((id) => id !== courseId);
         } else {
            return [...prev, courseId];
         }
      });
   };

   // Handle new student creation
   const handleAddStudent = () => {
      if (newStudent.name && newStudent.email) {
         const student: Student = {
            id: `s${students.length + 1}`,
            name: newStudent.name,
            email: newStudent.email,
            enrolledCourses: newStudent.enrolledCourses || [],
            grade: newStudent.grade || "10th",
            lastActive: new Date().toISOString().split("T")[0],
            performance: newStudent.performance as
               | "Excellent"
               | "Good"
               | "Average"
               | "Needs Improvement",
         };

         setStudents([...students, student]);
         setNewStudent({
            name: "",
            email: "",
            enrolledCourses: [],
            grade: "10th",
            performance: "Average",
         });
         setIsAddStudentDialogOpen(false);
      }
   };

   // Handle new student course selection
   const handleNewStudentCourseChange = (courseId: string) => {
      setNewStudent((prev) => {
         const enrolledCourses = prev.enrolledCourses || [];

         if (enrolledCourses.includes(courseId)) {
            return {
               ...prev,
               enrolledCourses: enrolledCourses.filter((id) => id !== courseId),
            };
         } else {
            return {
               ...prev,
               enrolledCourses: [...enrolledCourses, courseId],
            };
         }
      });
   };

   // Update filtered students when filters change
   useEffect(() => {
      let results = students;

      // Filter by search query
      if (searchQuery) {
         results = results.filter(
            (student) =>
               student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               student.email.toLowerCase().includes(searchQuery.toLowerCase())
         );
      }

      // Filter by selected courses
      if (selectedCourses.length > 0) {
         results = results.filter((student) =>
            selectedCourses.every((courseId) =>
               student.enrolledCourses.includes(courseId)
            )
         );
      }

      // Filter by grade
      if (selectedGrade && selectedGrade !== "all") {
         results = results.filter((student) => student.grade === selectedGrade);
      }

      // Filter by performance
      if (selectedPerformance && selectedPerformance !== "all") {
         results = results.filter(
            (student) => student.performance === selectedPerformance
         );
      }

      setFilteredStudents(results);
   }, [
      searchQuery,
      selectedCourses,
      selectedGrade,
      selectedPerformance,
      students,
   ]);

   return (
      <>
         <DashboardNavbar title="Students" />
         <div className="p-6 w-full mx-auto">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h1 className="text-3xl font-bold">Students</h1>
                  <p className="text-gray-500 mt-1">
                     Manage and monitor your students
                  </p>
               </div>
               <div className="flex gap-2">
                  <Button
                     variant="outline"
                     className="flex items-center"
                  >
                     <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                  <Dialog
                     open={isAddStudentDialogOpen}
                     onOpenChange={setIsAddStudentDialogOpen}
                  >
                     <DialogTrigger asChild>
                        <Button className="flex items-center">
                           <UserPlus className="mr-2 h-4 w-4" /> Add Student
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                           <DialogTitle>Add New Student</DialogTitle>
                           <DialogDescription>
                              Enter the student&apos;s details below.
                           </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                 <Label htmlFor="name">Full Name</Label>
                                 <Input
                                    id="name"
                                    value={newStudent.name}
                                    onChange={(e) =>
                                       setNewStudent({
                                          ...newStudent,
                                          name: e.target.value,
                                       })
                                    }
                                    placeholder="e.g., John Smith"
                                 />
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="email">Email Address</Label>
                                 <Input
                                    id="email"
                                    type="email"
                                    value={newStudent.email}
                                    onChange={(e) =>
                                       setNewStudent({
                                          ...newStudent,
                                          email: e.target.value,
                                       })
                                    }
                                    placeholder="student@school.edu"
                                 />
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                 <Label htmlFor="grade">Grade</Label>
                                 <Select
                                    value={newStudent.grade}
                                    onValueChange={(value) =>
                                       setNewStudent({
                                          ...newStudent,
                                          grade: value,
                                       })
                                    }
                                 >
                                    <SelectTrigger id="grade">
                                       <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="9th">
                                          9th Grade
                                       </SelectItem>
                                       <SelectItem value="10th">
                                          10th Grade
                                       </SelectItem>
                                       <SelectItem value="11th">
                                          11th Grade
                                       </SelectItem>
                                       <SelectItem value="12th">
                                          12th Grade
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="performance">
                                    Performance
                                 </Label>
                                 <Select
                                    value={newStudent.performance}
                                    onValueChange={(value) =>
                                       setNewStudent({
                                          ...newStudent,
                                          performance: value as any,
                                       })
                                    }
                                 >
                                    <SelectTrigger id="performance">
                                       <SelectValue placeholder="Select performance" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="Excellent">
                                          Excellent
                                       </SelectItem>
                                       <SelectItem value="Good">
                                          Good
                                       </SelectItem>
                                       <SelectItem value="Average">
                                          Average
                                       </SelectItem>
                                       <SelectItem value="Needs Improvement">
                                          Needs Improvement
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                           <div className="grid gap-2">
                              <Label>Enrolled Courses</Label>
                              <div className="border rounded-md p-4 space-y-2">
                                 {courses.map((course) => (
                                    <div
                                       key={course.id}
                                       className="flex items-center space-x-2"
                                    >
                                       <Checkbox
                                          id={`course-${course.id}`}
                                          checked={(
                                             newStudent.enrolledCourses || []
                                          ).includes(course.id)}
                                          onCheckedChange={() =>
                                             handleNewStudentCourseChange(
                                                course.id
                                             )
                                          }
                                       />
                                       <label
                                          htmlFor={`course-${course.id}`}
                                          className="text-sm"
                                       >
                                          {course.title}
                                       </label>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                        <DialogFooter>
                           <Button
                              variant="outline"
                              onClick={() => setIsAddStudentDialogOpen(false)}
                           >
                              Cancel
                           </Button>
                           <Button onClick={handleAddStudent}>
                              Add Student
                           </Button>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mb-6">
               <div className="lg:w-1/4 space-y-6">
                  <Card>
                     <CardContent className="p-6">
                        <h3 className="font-medium mb-4">Filter Students</h3>

                        <div className="space-y-6">
                           <div>
                              <Label className="mb-2 block">
                                 Enrolled Courses
                              </Label>
                              <div className="space-y-2">
                                 {courses.map((course) => (
                                    <div
                                       key={course.id}
                                       className="flex items-center space-x-2"
                                    >
                                       <Checkbox
                                          id={`filter-course-${course.id}`}
                                          checked={selectedCourses.includes(
                                             course.id
                                          )}
                                          onCheckedChange={() =>
                                             handleCourseFilterChange(course.id)
                                          }
                                       />
                                       <label
                                          htmlFor={`filter-course-${course.id}`}
                                          className="text-sm"
                                       >
                                          {course.title}
                                       </label>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div>
                              <Label
                                 htmlFor="grade-filter"
                                 className="mb-2 block"
                              >
                                 Grade
                              </Label>
                              <Select
                                 value={selectedGrade}
                                 onValueChange={setSelectedGrade}
                              >
                                 <SelectTrigger id="grade-filter">
                                    <SelectValue placeholder="All Grades" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="all">
                                       All Grades
                                    </SelectItem>
                                    <SelectItem value="9th">
                                       9th Grade
                                    </SelectItem>
                                    <SelectItem value="10th">
                                       10th Grade
                                    </SelectItem>
                                    <SelectItem value="11th">
                                       11th Grade
                                    </SelectItem>
                                    <SelectItem value="12th">
                                       12th Grade
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <div>
                              <Label
                                 htmlFor="performance-filter"
                                 className="mb-2 block"
                              >
                                 Performance
                              </Label>
                              <Select
                                 value={selectedPerformance}
                                 onValueChange={setSelectedPerformance}
                              >
                                 <SelectTrigger id="performance-filter">
                                    <SelectValue placeholder="All Performance Levels" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="all">
                                       All Performance Levels
                                    </SelectItem>
                                    <SelectItem value="Excellent">
                                       Excellent
                                    </SelectItem>
                                    <SelectItem value="Good">Good</SelectItem>
                                    <SelectItem value="Average">
                                       Average
                                    </SelectItem>
                                    <SelectItem value="Needs Improvement">
                                       Needs Improvement
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                 setSelectedCourses([]);
                                 setSelectedGrade("all");
                                 setSelectedPerformance("all");
                              }}
                           >
                              Clear Filters
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               <div className="lg:w-3/4">
                  <div className="mb-4">
                     <div className="relative">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                        <Input
                           placeholder="Search students by name or email..."
                           className="pl-8"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </div>
                  </div>

                  <Card>
                     <div className="rounded-md border">
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Student</TableHead>
                                 <TableHead>Grade</TableHead>
                                 <TableHead>Enrolled Courses</TableHead>
                                 <TableHead>Performance</TableHead>
                                 <TableHead>Last Active</TableHead>
                                 <TableHead></TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {filteredStudents.map((student) => (
                                 <TableRow key={student.id}>
                                    <TableCell>
                                       <div className="flex items-center gap-3">
                                          <Avatar>
                                             <AvatarImage
                                                src={student.avatar}
                                             />
                                             <AvatarFallback>
                                                {getInitials(student.name)}
                                             </AvatarFallback>
                                          </Avatar>
                                          <div>
                                             <div className="font-medium">
                                                {student.name}
                                             </div>
                                             <div className="text-sm text-gray-500">
                                                {student.email}
                                             </div>
                                          </div>
                                       </div>
                                    </TableCell>
                                    <TableCell>{student.grade}</TableCell>
                                    <TableCell>
                                       <div className="flex flex-wrap gap-1">
                                          {student.enrolledCourses.map(
                                             (courseId) => {
                                                const course = courses.find(
                                                   (c) => c.id === courseId
                                                );
                                                return (
                                                   <Badge
                                                      key={courseId}
                                                      variant="outline"
                                                      className="whitespace-nowrap"
                                                   >
                                                      {course
                                                         ? course.title.substring(
                                                              0,
                                                              15
                                                           ) +
                                                           (course.title
                                                              .length > 15
                                                              ? "..."
                                                              : "")
                                                         : courseId}
                                                   </Badge>
                                                );
                                             }
                                          )}
                                       </div>
                                    </TableCell>
                                    <TableCell>
                                       <Badge
                                          variant="outline"
                                          className={getPerformanceBadgeStyle(
                                             student.performance
                                          )}
                                       >
                                          {student.performance}
                                       </Badge>
                                    </TableCell>
                                    <TableCell>{student.lastActive}</TableCell>
                                    <TableCell>
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
                                                View Profile
                                             </DropdownMenuItem>
                                             <DropdownMenuItem>
                                                Send Message
                                             </DropdownMenuItem>
                                             <DropdownMenuItem>
                                                Edit Details
                                             </DropdownMenuItem>
                                             <DropdownMenuSeparator />
                                             <DropdownMenuItem className="text-red-600">
                                                Remove Student
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                        {filteredStudents.length === 0 && (
                           <div className="text-center py-6">
                              <p className="text-gray-500">
                                 No students found. Try adjusting your filters.
                              </p>
                           </div>
                        )}
                     </div>
                  </Card>
               </div>
            </div>
         </div>
      </>
   );
};

export default StudentsPage;
