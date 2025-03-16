"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
   ArrowLeft,
   GraduationCap,
   AlertCircle,
   Loader2,
   ChevronLeft,
   Download,
   Eye,
   FileIcon,
   Maximize2,
   Minimize2,
   Brain,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useGetCourseById, useGetMaterials } from "@/hooks/useCourses";
import DocumentViewer from "@/components/DocumentViewer";
import { CourseRatings } from "@/components/CourseRatings";
import AIAnalysisPanel from "@/components/AIAnalysisPanel";
import { useExtractDocumentText } from "@/hooks/useAI";

interface Material {
   id: string;
   title: string;
   file_path: string;
}

interface DocumentAnalysisResponse {
   material_id: string;
   title: string;
   course_id: string;
   content: string;
}

const levelColorMap: Record<string, string> = {
   beginner: "bg-green-100 text-green-700 border-green-200",
   intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
   advanced: "bg-red-100 text-red-700 border-red-200",
   "all-levels": "bg-purple-100 text-purple-700 border-purple-200",
};

const CourseDetailPage = () => {
   const params = useParams();
   const router = useRouter();
   const courseId = params.id as string;
   const [activeTab, setActiveTab] = useState("overview");
   const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
      null
   );
   const [isFullscreen, setIsFullscreen] = useState(false);
   const [showAIPanel, setShowAIPanel] = useState(false);
   const [selectedMaterialForAI, setSelectedMaterialForAI] =
      useState<DocumentAnalysisResponse | null>(null);
   const extractDocumentText = useExtractDocumentText();

   const { data: course, isLoading, error } = useGetCourseById(courseId);
   const { data: materials, isLoading: materialsLoading } =
      useGetMaterials(courseId);

   // Function to get file URL
   const getFileUrl = (filePath: string) => {
      // Remove any leading 'uploads/' since the API endpoint already includes it
      const cleanPath = filePath.replace(/^uploads\//, "");
      return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${cleanPath}`;
   };

   console.log("Course:", course);
   console.log("Materials:", materials);

   // Function to handle AI analysis
   const handleAIAnalysis = async (material: Material) => {
      try {
         const response = await extractDocumentText.mutateAsync(material.id);
         setSelectedMaterialForAI(response);
         setShowAIPanel(true);
      } catch (error) {
         console.error("Error extracting document text:", error);
      }
   };

   // Render loading state
   if (isLoading) {
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
                        Could not find the requested course.
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

   // If a material is selected for viewing, show the PDF viewer
   if (selectedMaterialId && materials) {
      const selectedMaterial = materials.find(
         (m) => m.id === selectedMaterialId
      );
      if (!selectedMaterial) return null;

      const fileUrl = getFileUrl(selectedMaterial.file_path);

      return (
         <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardNavbar
               title={selectedMaterial?.title || "View Material"}
            />

            <div className="bg-white border-b">
               <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                  <Button
                     variant="ghost"
                     onClick={() => setSelectedMaterialId(null)}
                     className="text-gray-700"
                  >
                     <ChevronLeft className="mr-2 h-4 w-4" />
                     Back to Course
                  </Button>

                  {!isFullscreen && (
                     <div className="flex items-center gap-2">
                        <Button
                           variant="outline"
                           size="icon"
                           onClick={() => setIsFullscreen(true)}
                           className="bg-white shadow-sm hover:bg-gray-100"
                        >
                           <Maximize2 className="h-4 w-4 text-gray-700" />
                        </Button>
                        <Button
                           variant="outline"
                           onClick={() => window.open(fileUrl, "_blank")}
                        >
                           <Download className="h-4 w-4 mr-2" />
                           Download
                        </Button>
                     </div>
                  )}
               </div>
            </div>

            <div className="flex-1 flex items-stretch justify-center bg-gray-100">
               <div className="w-full max-w-6xl mx-auto p-6 flex gap-6">
                  <div className="w-2/3 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                     <DocumentViewer
                        fileUrl={fileUrl}
                        isFullscreen={isFullscreen}
                        onToggleFullscreen={() => setIsFullscreen(false)}
                     />
                  </div>
                  {showAIPanel && selectedMaterialForAI && (
                     <div className="w-1/3">
                        <AIAnalysisPanel
                           materialId={selectedMaterialForAI.material_id}
                           materialTitle={selectedMaterialForAI.title}
                           courseId={selectedMaterialForAI.course_id}
                           content={selectedMaterialForAI.content}
                           onClose={() => setShowAIPanel(false)}
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   }

   const levelClass =
      levelColorMap[course.level.toLowerCase()] ||
      "bg-blue-100 text-blue-700 border-blue-200";

   const prerequisites = course.prerequisites ? course.prerequisites : [];
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
                           <GraduationCap className="h-4 w-4 mr-1" />
                           <span className="text-sm">
                              By {course.teacher.name}
                           </span>
                        </div>
                     </div>
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
                  <TabsTrigger value="overview">Course Overview</TabsTrigger>
                  <TabsTrigger value="materials">Course Materials</TabsTrigger>
                  <TabsTrigger value="ratings">Ratings & Reviews</TabsTrigger>
               </TabsList>

               <TabsContent
                  value="overview"
                  className="space-y-8"
               >
                  <div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        About This Course
                     </h2>
                     <p className="text-gray-700 leading-relaxed mb-6">
                        {course.long_description}
                     </p>
                  </div>

                  <div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Prerequisites
                     </h2>
                     <ul className="space-y-2">
                        {prerequisites.map((prerequisite, index) => (
                           <li
                              key={index}
                              className="flex items-start"
                           >
                              <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                                 {index + 1}
                              </div>
                              <p className="text-gray-700">{prerequisite}</p>
                           </li>
                        ))}
                     </ul>
                  </div>
               </TabsContent>

               <TabsContent
                  value="materials"
                  className="bg-white rounded-lg shadow-sm p-6"
               >
                  {/* Custom Material Cards with Simple Viewer Integration */}
                  <div className="space-y-4">
                     <h3 className="text-lg font-semibold">Course Materials</h3>

                     {materialsLoading ? (
                        <div className="text-center py-8">
                           <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                           <p>Loading materials...</p>
                        </div>
                     ) : materials && materials.length > 0 ? (
                        <div className="grid gap-4">
                           {materials.map((material) => (
                              <Card
                                 key={material.id}
                                 className="hover:shadow-md transition-shadow"
                              >
                                 <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                       <div className="bg-blue-100 p-2 rounded">
                                          <FileIcon className="h-5 w-5 text-blue-600" />
                                       </div>
                                       <div>
                                          <h4 className="font-medium">
                                             {material.title}
                                          </h4>
                                          <p className="text-sm text-gray-500">
                                             {material.file_path
                                                .split("/")
                                                .pop()}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Button
                                          onClick={() =>
                                             setSelectedMaterialId(material.id)
                                          }
                                          variant="default"
                                       >
                                          <Eye className="h-4 w-4 mr-2" />
                                          View
                                       </Button>
                                       <Button
                                          variant="outline"
                                          onClick={() => {
                                             const url = getFileUrl(
                                                material.file_path
                                             );
                                             window.open(url, "_blank");
                                          }}
                                       >
                                          <Download className="h-4 w-4 mr-2" />
                                          Download
                                       </Button>
                                       <Button
                                          onClick={() =>
                                             handleAIAnalysis(material)
                                          }
                                          variant="secondary"
                                       >
                                          <Brain className="h-4 w-4 mr-2" />
                                          AI Analysis
                                       </Button>
                                    </div>
                                 </CardContent>
                              </Card>
                           ))}
                        </div>
                     ) : (
                        <p className="text-gray-500 text-center py-8">
                           No materials available for this course.
                        </p>
                     )}
                  </div>
               </TabsContent>

               <TabsContent
                  value="ratings"
                  className="bg-white rounded-lg shadow-sm p-6"
               >
                  <CourseRatings courseId={courseId} />
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
};

export default CourseDetailPage;
