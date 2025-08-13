//@ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
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
   Check,
   Volume2,
   VolumeX,
   Star,
   Users,
   Share2,
   MessageCircle,
   CalendarCheck,
   Clock,
   BookOpen,
   Award,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
   useGetCourseById,
   useGetMaterials,
   useMarkMaterialComplete,
} from "@/hooks/useCourses";
import DocumentViewer from "@/components/DocumentViewer";
import { CourseRatings } from "@/components/CourseRatings";
import AIAnalysisPanel from "@/components/AIAnalysisPanel";
import { useExtractDocumentText } from "@/hooks/useAI";
import { useCreateRating } from "@/hooks/useRatings";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import RatingDialog from "@/components/RatingDialog";
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDistanceToNow } from "date-fns";

interface Material {
   id: string;
   title: string;
   file_path: string;
   viewed?: boolean; // Add this property
   course_id?: string;
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

   // Group all useState hooks at the top
   const [activeTab, setActiveTab] = useState("overview");
   const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
      null
   );
   const [isFullscreen, setIsFullscreen] = useState(false);
   const [showAIPanel, setShowAIPanel] = useState(false);
   const [selectedMaterialForAI, setSelectedMaterialForAI] =
      useState<DocumentAnalysisResponse | null>(null);
   const [materialCompleted, setMaterialCompleted] = useState(false);
   const [isSpeaking, setIsSpeaking] = useState(false);
   const { user, isAuthenticated } = useAuthStore();
   const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

   // Group all queries
   const extractDocumentText = useExtractDocumentText();
   const { data: course, isLoading, error } = useGetCourseById(courseId);
   const { data: materials, isLoading: materialsLoading } =
      useGetMaterials(courseId);
   const { mutate: markComplete, isPending: marking } =
      useMarkMaterialComplete();
   const createRatingMutation = useCreateRating();

   const handleRateClick = () => {
      if (!isAuthenticated) {
         return; // Alert dialog will handle this case
      }
      setIsRatingDialogOpen(true);
   };

   const handleRateSubmit = async (rating: number, feedback: string) => {
      try {
         await createRatingMutation.mutateAsync({
            courseId,
            rating,
            feedback,
         });
         toast.success("Thank you for your rating!");
         setIsRatingDialogOpen(false);
      } catch (error) {
         toast.error("Failed to submit rating. Please try again.");
         console.error("Failed to submit rating:", error);
      }
   };

   // Move useEffect to top level
   useEffect(() => {
      if (selectedMaterialId && materials) {
         const selectedMaterial = materials.find(
            (m) => m.id === selectedMaterialId
         );
         if (selectedMaterial) {
            setMaterialCompleted(selectedMaterial.viewed || false);
         }
      }
   }, [selectedMaterialId, materials]);

   // Handle mark complete function
   const handleMarkComplete = () => {
      if (!materialCompleted && selectedMaterialId) {
         markComplete(
            { materialId: selectedMaterialId },
            {
               onSuccess: () => {
                  setMaterialCompleted(true);
                  toast.success("Material marked as completed!");
               },
               onError: (error) => {
                  console.error("Failed to mark as completed", error);
                  toast.error("Failed to mark material as completed");
               },
            }
         );
      }
   };

   // Function to get file URL
   const getFileUrl = (filePath: string) => {
      // Remove any leading 'uploads/' since the API endpoint already includes it
      const cleanPath = filePath.replace(/^uploads\//, "");
      return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${cleanPath}`;
   };

   const averageRating = course?.ratings?.length
      ? course.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
        course.ratings.length
      : 0;

   const levelColorMap: Record<string, string> = {
      beginner: "bg-green-100 text-green-700 border-green-200",
      intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
      advanced: "bg-red-100 text-red-700 border-red-200",
      "all-levels": "bg-purple-100 text-purple-700 border-purple-200",
   };

   const levelColorClass =
      levelColorMap[course?.level?.toLowerCase() || ""] ||
      "bg-blue-100 text-blue-700 border-blue-200";

   // Function to handle AI analysis
   const handleAIAnalysis = async (material: Material) => {
      try {
         setShowAIPanel(true); // Show panel immediately with loading state
         const response = await extractDocumentText.mutateAsync(material.id);
         if (response) {
            setSelectedMaterialForAI(response);
         }
      } catch (error) {
         console.error("Error extracting document text:", error);
         toast.error("Could not analyze the document. Please try again later.");
         setShowAIPanel(false);
      }
   };

   // Add handleSpeak function
   const handleSpeak = (text: string) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
         if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
         }

         const utterance = new SpeechSynthesisUtterance(text);
         utterance.onend = () => setIsSpeaking(false);
         utterance.onerror = () => setIsSpeaking(false);
         window.speechSynthesis.speak(utterance);
         setIsSpeaking(true);
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
                     onClick={() => {
                        setSelectedMaterialId(null);
                        setShowAIPanel(false);
                     }}
                     className="text-gray-700"
                  >
                     <ChevronLeft className="mr-2 h-4 w-4" />
                     Back to Course
                  </Button>

                  <div className="flex items-center gap-2">
                     <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                           handleSpeak(selectedMaterial?.title || "")
                        }
                        className="bg-white"
                        title="Read Aloud"
                     >
                        {isSpeaking ? (
                           <VolumeX className="h-4 w-4" />
                        ) : (
                           <Volume2 className="h-4 w-4" />
                        )}
                     </Button>

                     {!showAIPanel && (
                        <Button
                           variant="secondary"
                           onClick={() => handleAIAnalysis(selectedMaterial)}
                           disabled={extractDocumentText.isPending}
                           className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                        >
                           {extractDocumentText.isPending ? (
                              <>
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                 Analyzing...
                              </>
                           ) : (
                              <>
                                 <Brain className="h-4 w-4 mr-2" />
                                 AI Analysis
                              </>
                           )}
                        </Button>
                     )}
                     {!isFullscreen && !showAIPanel && (
                        <>
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
                        </>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex-1 flex flex-col bg-gray-100">
               <div className="container mx-auto p-6">
                  {showAIPanel ? (
                     <>
                        {extractDocumentText.isPending ? (
                           <div className="bg-white rounded-lg p-8 text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                              <h3 className="text-lg font-medium mb-2">
                                 Analyzing Document
                              </h3>
                              <p className="text-gray-500">
                                 Please wait while AI analyzes{" "}
                                 {selectedMaterial.title}
                              </p>
                           </div>
                        ) : selectedMaterialForAI ? (
                           <AIAnalysisPanel
                              materialId={selectedMaterialForAI.material_id}
                              materialTitle={selectedMaterialForAI.title}
                              courseId={selectedMaterialForAI.course_id}
                              content={selectedMaterialForAI.content}
                              onClose={() => {
                                 setShowAIPanel(false);
                                 setSelectedMaterialForAI(null);
                              }}
                           />
                        ) : null}
                     </>
                  ) : (
                     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <DocumentViewer
                           fileUrl={fileUrl}
                           isFullscreen={isFullscreen}
                           onToggleFullscreen={() => setIsFullscreen(false)}
                        />
                        {/* Mark as Completed Button */}
                        <div className="p-4 border-t">
                           {!materialCompleted ? (
                              <Button
                                 onClick={handleMarkComplete}
                                 disabled={marking}
                                 className="w-full"
                              >
                                 {marking
                                    ? "Marking as completed..."
                                    : "Mark as Completed"}
                              </Button>
                           ) : (
                              <div className="flex items-center justify-center text-green-600 gap-2">
                                 <Check className="h-4 w-4" />
                                 <span>Material completed!</span>
                              </div>
                           )}
                        </div>
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

   const ratingButton = (
      <>
         <AlertDialog>
            <AlertDialogTrigger asChild>
               <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 mb-4"
                  onClick={() => isAuthenticated && handleRateClick()}
               >
                  Rate this Course
               </Button>
            </AlertDialogTrigger>
            {!isAuthenticated && (
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Login Required</AlertDialogTitle>
                     <AlertDialogDescription>
                        Please login to rate this course.
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogAction onClick={() => router.push("/login")}>
                        Login
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            )}
         </AlertDialog>

         <RatingDialog
            courseId={courseId}
            onRate={handleRateSubmit}
            isOpen={isRatingDialogOpen}
            onOpenChange={setIsRatingDialogOpen}
         />
      </>
   );

   const ratingsTabContent = (
      <TabsContent
         value="ratings"
         className="bg-white rounded-lg shadow-sm p-6"
      >
         <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
               Student Reviews
            </h2>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
               <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="text-center">
                     <div className="text-5xl font-bold text-gray-900 mb-2">
                        {averageRating.toFixed(1)}
                     </div>
                     <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Star
                              key={star}
                              className={`h-5 w-5 ${
                                 star <= Math.round(averageRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-300 text-gray-300"
                              }`}
                           />
                        ))}
                     </div>
                     <p className="text-gray-600">
                        {course?.ratings?.length || 0} reviews
                     </p>
                  </div>

                  <div className="flex-1 space-y-2">
                     {[5, 4, 3, 2, 1].map((rating) => {
                        const ratingCount =
                           course?.ratings?.filter((r) => r.rating === rating)
                              .length || 0;
                        const percentage =
                           course?.ratings?.length > 0
                              ? (ratingCount / course.ratings.length) * 100
                              : 0;

                        return (
                           <div
                              key={rating}
                              className="flex items-center"
                           >
                              <div className="flex items-center w-16">
                                 <span className="text-sm text-gray-600 mr-2">
                                    {rating}
                                 </span>
                                 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              </div>
                              <div className="w-full max-w-md">
                                 <Progress
                                    value={percentage}
                                    className="h-2"
                                 />
                              </div>
                              <span className="text-sm text-gray-600 ml-2">
                                 {percentage.toFixed(0)}%
                              </span>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Display individual reviews */}
            <div className="space-y-6">
               {course?.ratings?.map((review) => (
                  <div
                     key={review.id}
                     className="bg-white border border-gray-200 rounded-lg p-6"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                           <Avatar className="h-10 w-10 mr-4">
                              <AvatarFallback>
                                 {review.student?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                           </Avatar>
                           <div>
                              <h4 className="font-medium text-gray-900">
                                 {review.student?.name || "Anonymous User"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                 {formatDistanceToNow(
                                    new Date(review.created_at),
                                    {
                                       addSuffix: true,
                                    }
                                 )}
                              </p>
                           </div>
                        </div>
                        <div className="flex">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                 key={star}
                                 className={`h-4 w-4 ${
                                    star <= review.rating
                                       ? "fill-yellow-400 text-yellow-400"
                                       : "fill-gray-300 text-gray-300"
                                 }`}
                              />
                           ))}
                        </div>
                     </div>
                     {review.feedback && (
                        <p className="text-gray-700">{review.feedback}</p>
                     )}
                  </div>
               ))}
            </div>

            {(!course?.ratings || course.ratings.length === 0) && (
               <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Star className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                     No reviews yet
                  </h3>
                  <p className="text-gray-500">
                     Be the first to review this course!
                  </p>
               </div>
            )}
         </div>
      </TabsContent>
   );

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
         <DashboardNavbar title={course.title} />

         {/* Course Header */}
         <div className="bg-gradient-to-r from-main to-indigo-700">
            <div className="container mx-auto px-4 py-16">
               <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 text-white">
                     <div className="flex items-center gap-2 mb-4">
                        <Badge className={`${levelColorClass} font-medium`}>
                           {course.level}
                        </Badge>
                        <Badge
                           variant="outline"
                           className="bg-white/10 text-white backdrop-blur-sm"
                        >
                           {course.category}
                        </Badge>
                     </div>

                     <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        {course.title}
                     </h1>

                     <p className="text-lg md:text-xl text-blue-100 mb-6">
                        {course.description}
                     </p>

                     <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex items-center">
                           <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                 <Star
                                    key={star}
                                    className={`h-5 w-5 ${
                                       star <= Math.round(averageRating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "fill-gray-300 text-gray-300"
                                    }`}
                                 />
                              ))}
                           </div>
                           <span className="text-white font-medium">
                              {averageRating.toFixed(1)}
                           </span>
                           <span className="text-blue-200 ml-1">
                              ({course.ratings?.length || 0} reviews)
                           </span>
                        </div>

                        <div className="flex items-center">
                           <Users className="h-5 w-5 mr-2 text-blue-200" />
                           <span className="text-white">
                              {course.enrollments?.length || 0} students
                           </span>
                        </div>

                        <div className="flex items-center">
                           <CalendarCheck className="h-5 w-5 mr-2 text-blue-200" />
                           <span className="text-white">
                              Created:{" "}
                              {new Date(course.created_at).toLocaleDateString()}
                           </span>
                        </div>
                     </div>

                     <div className="flex items-center mb-6">
                        <Avatar className="h-12 w-12 border-2 border-white">
                           <AvatarFallback>
                              {course.teacher?.name?.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                           <p className="text-white font-medium">
                              {course.teacher?.name}
                           </p>
                           <p className="text-blue-200 text-sm">
                              {course.teacher?.role}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="md:col-span-1">
                     <Card className="overflow-hidden rounded-xl shadow-xl">
                        <div className="h-20 bg-gradient-to-br from-blue-400 to-indigo-500 relative">
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all">
                                 <GraduationCap />
                              </div>
                           </div>
                        </div>

                        <CardContent className="p-6">
                           <div className="border-t border-gray-100 pt-4">
                              <h3 className="font-medium text-gray-900 mb-3">
                                 This course includes:
                              </h3>
                              <ul className="space-y-2">
                                 <li className="flex items-center text-sm text-gray-600">
                                    <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                                    {course.materials?.length || 0} lessons
                                 </li>
                              
                                 <li className="flex items-center text-sm text-gray-600">
                                    <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                                    Direct instructor access
                                 </li>
                              </ul>
                           </div>

                           <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-100">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="text-gray-600"
                              >
                                 <Share2 className="h-4 w-4 mr-2" />
                                 Share
                              </Button>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="text-gray-600"
                              >
                                 Gift this course
                              </Button>
                           </div>
                           {ratingButton}
                        </CardContent>
                     </Card>
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
                                          onClick={() => {
                                             handleAIAnalysis(material);
                                             setSelectedMaterialId(material.id); // Ensure material is selected
                                          }}
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

               {ratingsTabContent}
            </Tabs>
         </div>
         <RatingDialog
            courseId={courseId}
            onRate={handleRateSubmit}
            isOpen={isRatingDialogOpen}
            onOpenChange={setIsRatingDialogOpen}
         />
      </div>
   );
};

export default CourseDetailPage;
