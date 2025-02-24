// app/dashboard/courses/page.tsx
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";

// Types
interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  image: string;
  progress: number;
  lastAccessed: string;
  status: "in-progress" | "completed" | "not-started";
  duration: string;
}

const EnrolledCoursesPage: React.FC = () => {
  // Sample courses data
  const courses: Course[] = [
    {
      id: "1",
      title: "Advanced React Patterns",
      category: "Web Development",
      instructor: "Sarah Johnson",
      image: "/api/placeholder/320/180",
      progress: 65,
      lastAccessed: "2 days ago",
      status: "in-progress",
      duration: "8 hours",
    },
    {
      id: "2",
      title: "TypeScript for Professionals",
      category: "Programming",
      instructor: "Michael Chen",
      image: "/api/placeholder/320/180",
      progress: 100,
      lastAccessed: "1 week ago",
      status: "completed",
      duration: "10 hours",
    },
    {
      id: "3",
      title: "Next.js 14 Fundamentals",
      category: "Web Development",
      instructor: "Alex Rodriguez",
      image: "/api/placeholder/320/180",
      progress: 25,
      lastAccessed: "Yesterday",
      status: "in-progress",
      duration: "12 hours",
    },
    {
      id: "4",
      title: "UI/UX Design Principles",
      category: "Design",
      instructor: "Emma Wilson",
      image: "/api/placeholder/320/180",
      progress: 0,
      lastAccessed: "Never",
      status: "not-started",
      duration: "6 hours",
    },
  ];

  return (
   <>
   <DashboardNavbar title="Enrolled courses"/>
    <div className="container mx-auto py-8 ">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-gray-500">Continue learning where you left off</p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((course) => course.status === "in-progress")
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((course) => course.status === "completed")
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="not-started" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((course) => course.status === "not-started")
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const getStatusBadge = (status: Course["status"]) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "not-started":
        return <Badge className="bg-gray-500">Not Started</Badge>;
      default:
        return null;
    }
  };

  const getButtonText = (status: Course["status"]) => {
    switch (status) {
      case "in-progress":
        return "Continue Learning";
      case "completed":
        return "Review Course";
      case "not-started":
        return "Start Course";
      default:
        return "View Course";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-lg">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge(course.status)}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <CardDescription className="mt-1">
              by {course.instructor}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{course.category}</span>
          <span>{course.duration}</span>
        </div>
        
        {course.status !== "not-started" && (
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-4">
          {course.status !== "not-started" 
            ? `Last accessed ${course.lastAccessed}` 
            : "Ready to start learning"}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button className="w-full" variant={course.status === "not-started" ? "outline" : "default"}>
          {getButtonText(course.status)}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnrolledCoursesPage;