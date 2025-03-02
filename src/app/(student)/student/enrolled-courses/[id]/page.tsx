"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
   ArrowLeft,
   BookOpen,
   CheckCircle,
   Clock,
   Download,
   FileText,
   GraduationCap,
   PlayCircle,
   AlertCircle,
   ChevronDown,
   ChevronRight,
   BarChart,
   Loader2,
   Book,
   Maximize2,
   Minimize2,
   File,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import mammoth from "mammoth";
import { useGetCourseById, useGetMaterials } from "@/hooks/useCourses";
import { Material } from "@/types/course";
import { API_URL } from "@/lib/api";
import CourseMaterials from "@/components/CourseMaterials";

interface CourseData {
   id: string;
   title: string;
   description: string;
   category: string;
   level: string;
   progress: number;
   lastAccessed: string;
   duration: string;
   sections: CourseSection[];
   teacher: {
      id: string;
      name: string;
      avatar: string;
      bio: string;
   };
   overview: {
      whatYouWillLearn: string[];
      requirements: string[];
      targetAudience: string[];
   };
}

interface CourseSection {
   id: string;
   title: string;
   duration: string;
   completed: boolean;
   lessons: CourseLesson[];
}

interface CourseLesson {
   id: string;
   title: string;
   type: "pdf" | "document" | "assignment" | "reading";
   duration: string;
   completed: boolean;
   file_path?: string;
}

const levelColorMap: Record<string, string> = {
   beginner: "bg-green-100 text-green-700 border-green-200",
   intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
   advanced: "bg-red-100 text-red-700 border-red-200",
   "all-levels": "bg-purple-100 text-purple-700 border-purple-200",
};

const lessonTypeIconMap: Record<string, React.ReactNode> = {
   pdf: <FileText className="h-4 w-4" />,
   document: <FileText className="h-4 w-4" />,
   assignment: <FileText className="h-4 w-4" />,
   reading: <BookOpen className="h-4 w-4" />,
};

const CourseDetailPage = () => {
   const params = useParams();
   const router = useRouter();
   const courseId = params.id as string;
   const [course, setCourse] = useState<CourseData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState("content");
   const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
   const { data: materials, isLoading: materialsLoading } =
      useGetMaterials(courseId);
   const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
      null
   );
   const [docContent, setDocContent] = useState<string>("");
   const [viewEntire, setViewEntire] = useState<boolean>(false);
   const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

   useEffect(() => {
      // In a real app, this would fetch course data from an API
      const fetchCourseData = async () => {
         try {
            setLoading(true);
            // Simulate API call with timeout
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock data for demonstration
            const mockCourse: CourseData = {
               id: courseId,
               title: "Advanced React: Building Modern Web Applications",
               description:
                  "Master React and learn to build scalable, performant applications with modern best practices including hooks, context API, and server components.",
               category: "Programming",
               level: "intermediate",
               progress: 35,
               lastAccessed: "2 days ago",
               duration: "24 hours",
               teacher: {
                  id: "t1",
                  name: "Dr. Emma Wilson",
                  avatar: "/api/placeholder/100/100",
                  bio: "Senior Frontend Developer with 8+ years of experience specializing in React and modern JavaScript frameworks.",
               },
               overview: {
                  whatYouWillLearn: [
                     "Build complex React applications from scratch",
                     "Master React hooks and functional components",
                     "Implement state management with Context API and Redux",
                     "Create responsive UIs with modern CSS frameworks",
                     "Optimize React applications for performance",
                  ],
                  requirements: [
                     "Basic understanding of JavaScript (ES6+)",
                     "Familiarity with HTML and CSS",
                     "Some experience with React is helpful but not required",
                  ],
                  targetAudience: [
                     "Web developers looking to enhance their React skills",
                     "Frontend developers transitioning to React",
                     "Developers interested in modern web application architecture",
                  ],
               },
               sections: [
                  {
                     id: "s1",
                     title: "Introduction to Modern React",
                     duration: "3 hours",
                     completed: true,
                     lessons: [
                        {
                           id: "l1",
                           title: "Course Overview and Setup",
                           type: "pdf",
                           duration: "15 min",
                           completed: true,
                        },
                        {
                           id: "l2",
                           title: "React Fundamentals Recap",
                           type: "pdf",
                           duration: "25 min",
                           completed: true,
                        },
                        {
                           id: "l3",
                           title: "Understanding React 18 Features",
                           type: "reading",
                           duration: "20 min",
                           completed: true,
                        },
                        {
                           id: "l4",
                           title: "Module Quiz",
                           type: "quiz",
                           duration: "10 min",
                           completed: true,
                        },
                     ],
                  },
                  {
                     id: "s2",
                     title: "Hooks Deep Dive",
                     duration: "4 hours",
                     completed: false,
                     lessons: [
                        {
                           id: "l5",
                           title: "useState and useEffect in Depth",
                           type: "pdf",
                           duration: "35 min",
                           completed: true,
                        },
                        {
                           id: "l6",
                           title: "Creating Custom Hooks",
                           type: "pdf",
                           duration: "40 min",
                           completed: true,
                        },
                        {
                           id: "l7",
                           title: "useRef, useContext, and useReducer",
                           type: "pdf",
                           duration: "45 min",
                           completed: false,
                        },
                        {
                           id: "l8",
                           title: "Performance Hooks: useMemo and useCallback",
                           type: "pdf",
                           duration: "30 min",
                           completed: false,
                        },
                        {
                           id: "l9",
                           title: "Hooks Practical Assignment",
                           type: "assignment",
                           duration: "1 hour",
                           completed: false,
                        },
                     ],
                  },
                  {
                     id: "s3",
                     title: "State Management",
                     duration: "6 hours",
                     completed: false,
                     lessons: [
                        {
                           id: "l10",
                           title: "Local vs Global State",
                           type: "reading",
                           duration: "25 min",
                           completed: false,
                        },
                        {
                           id: "l11",
                           title: "Context API Patterns",
                           type: "pdf",
                           duration: "45 min",
                           completed: false,
                        },
                        {
                           id: "l12",
                           title: "Introduction to Redux",
                           type: "pdf",
                           duration: "50 min",
                           completed: false,
                        },
                        {
                           id: "l13",
                           title: "Modern Redux with Redux Toolkit",
                           type: "pdf",
                           duration: "55 min",
                           completed: false,
                        },
                        {
                           id: "l14",
                           title: "State Management Quiz",
                           type: "quiz",
                           duration: "15 min",
                           completed: false,
                        },
                     ],
                  },
               ],
            };

            setCourse(mockCourse);

            // Set the current lesson based on progress
            if (mockCourse) {
               // Find the first incomplete lesson
               let foundCurrentLesson = false;
               for (const section of mockCourse.sections) {
                  if (foundCurrentLesson) break;

                  for (const lesson of section.lessons) {
                     if (!lesson.completed) {
                        setCurrentLessonId(lesson.id);
                        foundCurrentLesson = true;
                        break;
                     }
                  }
               }

               // If all lessons are completed, set to the last lesson
               if (!foundCurrentLesson && mockCourse.sections.length > 0) {
                  const lastSection =
                     mockCourse.sections[mockCourse.sections.length - 1];
                  if (lastSection.lessons.length > 0) {
                     setCurrentLessonId(
                        lastSection.lessons[lastSection.lessons.length - 1].id
                     );
                  }
               }
            }

            setLoading(false);
         } catch (err) {
            setError("Failed to load course data. Please try again later.");
            setLoading(false);
         }
      };

      fetchCourseData();
   }, [courseId]);

   const handleStartLesson = (lessonId: string) => {
      setCurrentLessonId(lessonId);
      setActiveTab("lesson");
   };

   const handleMarkComplete = () => {
      if (!course || !currentLessonId) return;

      const updatedCourse = { ...course };
      let totalLessons = 0;
      let completedLessons = 0;

      // Update the completed status for the current lesson
      updatedCourse.sections = updatedCourse.sections.map((section) => {
         const updatedLessons = section.lessons.map((lesson) => {
            totalLessons++;

            if (lesson.id === currentLessonId) {
               lesson.completed = true;
            }

            if (lesson.completed) {
               completedLessons++;
            }

            return lesson;
         });

         // Check if all lessons in section are completed
         const allCompleted = updatedLessons.every(
            (lesson) => lesson.completed
         );

         return {
            ...section,
            completed: allCompleted,
            lessons: updatedLessons,
         };
      });

      // Update progress percentage
      updatedCourse.progress = Math.round(
         (completedLessons / totalLessons) * 100
      );

      setCourse(updatedCourse);

      // Find the next incomplete lesson
      let foundNext = false;
      let foundCurrent = false;

      for (const section of updatedCourse.sections) {
         if (foundNext) break;

         for (const lesson of section.lessons) {
            if (lesson.id === currentLessonId) {
               foundCurrent = true;
               continue;
            }

            if (foundCurrent && !lesson.completed) {
               setCurrentLessonId(lesson.id);
               foundNext = true;
               break;
            }
         }
      }
   };

   const findCurrentLesson = () => {
      if (!course || !currentLessonId) return null;

      for (const section of course.sections) {
         for (const lesson of section.lessons) {
            if (lesson.id === currentLessonId) {
               return { lesson, section };
            }
         }
      }

      return null;
   };

   const currentLessonData = findCurrentLesson();

   const handleMaterialSelect = async (material: Material) => {
      setSelectedMaterial(material);
      setViewEntire(false);

      // Handle DOCX files
      if (material.file_path.endsWith(".docx")) {
         const response = await fetch(material.file_path);
         const arrayBuffer = await response.arrayBuffer();
         const result = await mammoth.convertToHtml({ arrayBuffer });
         setDocContent(result.value);
      }
   };

   const renderLessonContent = (lesson: CourseLesson) => {
      if (!lesson.file_path) {
         return (
            <div className="p-8 text-center text-gray-500">
               <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
               <p>No document attached to this lesson</p>
            </div>
         );
      }

      return (
         <div className="space-y-4">
            {lesson.file_path.endsWith(".pdf") && (
               <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer
                     fileUrl={lesson.file_path}
                     defaultScale={isFullScreen ? 1.5 : 0.75}
                  />
               </Worker>
            )}

            {/\.(jpg|jpeg|png|gif)$/i.test(lesson.file_path) && (
               <img
                  src={lesson.file_path}
                  alt={lesson.title}
                  className="w-full h-auto"
               />
            )}

            {lesson.file_path.endsWith(".docx") && (
               <>
                  <div
                     dangerouslySetInnerHTML={{ __html: docContent }}
                     className={`prose max-w-full ${
                        viewEntire ? "" : "max-h-60 overflow-hidden"
                     }`}
                  />
                  <Button
                     onClick={() => setViewEntire(!viewEntire)}
                     className="mt-4"
                  >
                     {viewEntire ? "Show Less" : "Show More"}
                  </Button>
               </>
            )}
         </div>
      );
   };

   // Render loading state
   if (loading) {
      return (
         <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardNavbar title="Course Details" />
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">
                     Loading course...
                  </h3>
               </div>
            </div>
         </div>
      );
   }

   // Render error state
   if (error || !course) {
      return (
         <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardNavbar title="Course Error" />
            <div className="flex-1 flex items-center justify-center p-6">
               <Card className="max-w-md w-full">
                  <CardHeader>
                     <CardTitle className="flex items-center text-red-600">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Error Loading Course
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="mb-4">
                        {error || "Could not find the requested course."}
                     </p>
                     <Button
                        variant="outline"
                        onClick={() => router.push("/student/enrolled-courses")}
                        className="w-full"
                     >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to My Courses
                     </Button>
                  </CardContent>
               </Card>
            </div>
         </div>
      );
   }

   const levelClass =
      levelColorMap[course.level.toLowerCase()] ||
      "bg-blue-100 text-blue-700 border-blue-200";

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
         <DashboardNavbar title={course.title} />

         {/* Course Header */}
         <div className="bg-gradient-to-r from-main to-indigo-700 py-12">
            <div className="container mx-auto px-4 md:px-6">
               <div className="flex items-center mb-4">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => router.push("/student/enrolled-courses")}
                     className="text-white hover:bg-white/10"
                  >
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Back to My Courses
                  </Button>
               </div>

               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                     <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                           variant="outline"
                           className={`font-medium ${levelClass} border-opacity-50`}
                        >
                           {course.level}
                        </Badge>
                        <Badge
                           variant="outline"
                           className="bg-white/10 text-white border-white/20"
                        >
                           {course.category}
                        </Badge>
                     </div>

                     <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {course.title}
                     </h1>

                     <p className="text-blue-100 md:w-3/4">
                        {course.description}
                     </p>

                     <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80">
                        <div className="flex items-center">
                           <Clock className="h-4 w-4 mr-1" />
                           <span className="text-sm">{course.duration}</span>
                        </div>
                        <div className="flex items-center">
                           <GraduationCap className="h-4 w-4 mr-1" />
                           <span className="text-sm">
                              By {course.teacher.name}
                           </span>
                        </div>
                        <div className="flex items-center">
                           <BookOpen className="h-4 w-4 mr-1" />
                           <span className="text-sm">
                              Last accessed {course.lastAccessed}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="md:w-64 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                     <div className="flex justify-between text-white mb-2">
                        <span>Your progress</span>
                        <span>{course.progress}%</span>
                     </div>
                     <Progress
                        value={course.progress}
                        className="h-2 bg-white/20"
                     />
                     <Button
                        className="mt-4 w-full bg-white hover:bg-white/90 text-blue-700"
                        onClick={() => {
                           if (currentLessonId) {
                              handleStartLesson(currentLessonId);
                           }
                        }}
                     >
                        {course.progress > 0
                           ? "Continue Learning"
                           : "Start Course"}
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* Course Content */}
         <div className="container mx-auto px-4 md:px-6 py-8">
            <Tabs
               value={activeTab}
               onValueChange={setActiveTab}
            >
               <TabsList className="mb-6 bg-white">
                  <TabsTrigger value="content">Course Content</TabsTrigger>
                  <TabsTrigger value="overview">Course Overview</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="materials">Course Materials</TabsTrigger>
                  {currentLessonId && (
                     <TabsTrigger value="lesson">Current Lesson</TabsTrigger>
                  )}
               </TabsList>

               <TabsContent
                  value="content"
                  className="bg-white rounded-lg shadow-sm p-6"
               >
                  <div className="mb-4 flex items-center justify-between">
                     <h2 className="text-xl font-bold text-gray-800">
                        Course Content
                     </h2>
                     <div className="text-sm text-gray-500">
                        {course.sections.reduce(
                           (acc, section) => acc + section.lessons.length,
                           0
                        )}{" "}
                        lessons • {course.duration}
                     </div>
                  </div>

                  <Accordion
                     type="single"
                     collapsible
                     className="w-full"
                  >
                     {course.sections.map((section) => (
                        <AccordionItem
                           key={section.id}
                           value={section.id}
                        >
                           <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-lg">
                              <div className="flex items-center justify-between w-full pr-4">
                                 <div className="flex items-center">
                                    {section.completed ? (
                                       <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                    ) : (
                                       <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3" />
                                    )}
                                    <span className="font-medium">
                                       {section.title}
                                    </span>
                                 </div>
                                 <div className="text-sm text-gray-500 flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {section.duration}
                                 </div>
                              </div>
                           </AccordionTrigger>
                           <AccordionContent className="pl-12 pr-4">
                              {section.lessons.map((lesson) => (
                                 <div
                                    key={lesson.id}
                                    className={`flex items-center justify-between py-3 px-4 my-1 rounded-lg ${
                                       currentLessonId === lesson.id
                                          ? "bg-blue-50 border border-blue-200"
                                          : "hover:bg-gray-50 cursor-pointer"
                                    }`}
                                    onClick={() => handleStartLesson(lesson.id)}
                                 >
                                    <div className="flex items-center">
                                       {lesson.completed ? (
                                          <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                                       ) : (
                                          <div className="h-4 w-4 border border-gray-300 rounded-full mr-3" />
                                       )}
                                       <div className="flex items-center">
                                          {lessonTypeIconMap[lesson.type]}
                                          <span className="ml-2">
                                             {lesson.title}
                                          </span>
                                       </div>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center">
                                       <Clock className="h-3 w-3 mr-1" />
                                       {lesson.duration}
                                    </div>
                                 </div>
                              ))}
                           </AccordionContent>
                        </AccordionItem>
                     ))}
                  </Accordion>
               </TabsContent>

               <TabsContent
                  value="overview"
                  className="bg-white rounded-lg shadow-sm p-6"
               >
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                     Course Overview
                  </h2>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                           <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                           What You Will Learn
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {course.overview.whatYouWillLearn.map(
                              (item, index) => (
                                 <div
                                    key={index}
                                    className="flex items-start"
                                 >
                                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    <span>{item}</span>
                                 </div>
                              )
                           )}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                           <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                           Requirements
                        </h3>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                           {course.overview.requirements.map((item, index) => (
                              <li key={index}>{item}</li>
                           ))}
                        </ul>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                           <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                           Who This Course is For
                        </h3>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                           {course.overview.targetAudience.map(
                              (item, index) => (
                                 <li key={index}>{item}</li>
                              )
                           )}
                        </ul>
                     </div>
                  </div>
               </TabsContent>

               <TabsContent
                  value="instructor"
                  className="bg-white rounded-lg shadow-sm p-6"
               >
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                     About the Instructor
                  </h2>

                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="md:w-1/4 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-3">
                           <img
                              src={course.teacher.avatar}
                              alt={course.teacher.name}
                              className="w-full h-full object-cover"
                           />
                        </div>
                        <h3 className="text-lg font-semibold text-center">
                           {course.teacher.name}
                        </h3>
                        <Link
                           href={`/instructors/${course.teacher.id}`}
                           passHref
                        >
                           <Button
                              variant="link"
                              className="mt-1 text-blue-600"
                           >
                              View Profile
                           </Button>
                        </Link>
                     </div>

                     <div className="md:w-3/4">
                        <p className="text-gray-700 whitespace-pre-line">
                           {course.teacher.bio}
                        </p>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <Card>
                              <CardHeader className="pb-2">
                                 <CardTitle className="text-lg">
                                    Courses
                                 </CardTitle>
                              </CardHeader>
                              <CardContent>
                                 <p className="text-2xl font-bold">12</p>
                              </CardContent>
                           </Card>

                           <Card>
                              <CardHeader className="pb-2">
                                 <CardTitle className="text-lg">
                                    Students
                                 </CardTitle>
                              </CardHeader>
                              <CardContent>
                                 <p className="text-2xl font-bold">4,827</p>
                              </CardContent>
                           </Card>

                           <Card>
                              <CardHeader className="pb-2">
                                 <CardTitle className="text-lg">
                                    Rating
                                 </CardTitle>
                              </CardHeader>
                              <CardContent>
                                 <p className="text-2xl font-bold">4.8/5</p>
                              </CardContent>
                           </Card>
                        </div>
                     </div>
                  </div>
               </TabsContent>

               <TabsContent
                  value="lesson"
                  className="bg-white rounded-lg shadow-sm"
               >
                  {currentLessonData && (
                     <div className="flex flex-col">
                        <div className="p-4 border-b">
                           <div className="flex items-center justify-between">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="text-gray-600"
                                 onClick={() => setActiveTab("content")}
                              >
                                 <ArrowLeft className="mr-2 h-4 w-4" />
                                 Back to Course
                              </Button>
                              <Badge
                                 variant="outline"
                                 className={`${
                                    currentLessonData.lesson.type === "pdf"
                                       ? "bg-blue-100 text-blue-700"
                                       : currentLessonData.lesson.type ===
                                         "quiz"
                                       ? "bg-amber-100 text-amber-700"
                                       : currentLessonData.lesson.type ===
                                         "assignment"
                                       ? "bg-purple-100 text-purple-700"
                                       : "bg-green-100 text-green-700"
                                 }`}
                              >
                                 {
                                    lessonTypeIconMap[
                                       currentLessonData.lesson.type
                                    ]
                                 }
                                 <span className="ml-1 capitalize">
                                    {currentLessonData.lesson.type}
                                 </span>
                              </Badge>
                           </div>
                           <h2 className="text-xl font-bold mt-3 mb-1">
                              {currentLessonData.lesson.title}
                           </h2>
                           <p className="text-gray-500 text-sm">
                              Section: {currentLessonData.section.title} •{" "}
                              {currentLessonData.lesson.duration}
                           </p>
                        </div>

                        <div className="p-6">
                           <div className="flex justify-between mb-4">
                              <div>
                                 <h3 className="text-lg font-semibold">
                                    {currentLessonData.lesson.title}
                                 </h3>
                                 <p className="text-sm text-gray-500">
                                    Section: {currentLessonData.section.title}
                                 </p>
                              </div>
                              {currentLessonData.lesson.file_path && (
                                 <Button
                                    variant="outline"
                                    onClick={() =>
                                       window.open(
                                          currentLessonData.lesson.file_path
                                       )
                                    }
                                 >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Document
                                 </Button>
                              )}
                           </div>

                           {renderLessonContent(currentLessonData.lesson)}
                        </div>

                        <div className="mt-auto border-t p-4 bg-gray-50">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                 <Button
                                    variant="outline"
                                    size="sm"
                                 >
                                    Previous Lesson
                                 </Button>
                                 <Button
                                    variant="outline"
                                    size="sm"
                                 >
                                    Next Lesson
                                 </Button>
                              </div>

                              <Button
                                 onClick={handleMarkComplete}
                                 disabled={currentLessonData.lesson.completed}
                                 className={`${
                                    currentLessonData.lesson.completed
                                       ? "bg-green-600 hover:bg-green-700"
                                       : ""
                                 }`}
                              >
                                 {currentLessonData.lesson.completed ? (
                                    <>
                                       <CheckCircle className="mr-2 h-4 w-4" />
                                       Completed
                                    </>
                                 ) : (
                                    <>
                                       <CheckCircle className="mr-2 h-4 w-4" />
                                       Mark as Complete
                                    </>
                                 )}
                              </Button>
                           </div>
                        </div>
                     </div>
                  )}
               </TabsContent>

               <TabsContent
                  value="materials"
                  className="bg-white rounded-lg shadow-sm p-6"
               >
                  {courseId && (
                     <CourseMaterials
                        courseId={courseId}
                        isTeacher={false}
                     />
                  )}
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
};

export default CourseDetailPage;
