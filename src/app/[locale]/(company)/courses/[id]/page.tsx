//@ts-nocheck
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
   CalendarCheck,
   Clock,
   BookOpen,
   GraduationCap,
   Users,
   Star,
   Award,
   MessageCircle,
   Share2,
   Download,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetCourseById, useGetRelatedCourses } from "@/hooks/useCourses";
import RatingDialog from "@/components/RatingDialog";
import { useCreateRating } from "@/hooks/useRatings";
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
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const CourseDetail = () => {
   const params = useParams();
   const router = useRouter();
   const courseId = params.id as string;
   const {
      data: course,
      isLoading: loading,
      error,
   } = useGetCourseById(courseId);
   const { data: relatedCourses } = useGetRelatedCourses(courseId);
   const [progress, setProgress] = useState(8);
   const { user, isAuthenticated } = useAuthStore();
   const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
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

   if (loading) {
      return (
         <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
               <p className="text-gray-600">Loading course details...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="container mx-auto px-4 py-12 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-lg text-center">
               <p>
                  There was an error loading the course details. Please try
                  again later.
               </p>
               <Button
                  className="mt-4 bg-red-600 hover:bg-red-700"
                  onClick={() => router.push("/courses")}
               >
                  Back to Courses
               </Button>
            </div>
         </div>
      );
   }

   if (!course) return null;

   const averageRating = course.ratings?.length
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
      levelColorMap[course.level.toLowerCase()] ||
      "bg-blue-100 text-blue-700 border-blue-200";

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

   // Split prerequisites into array if it exists
   const prerequisitesList = course.prerequisites ? course.prerequisites : [];

   return (
      <>
         {/* Hero Section */}
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
                        <div className="aspect-video bg-gradient-to-br from-blue-400 to-indigo-500 relative">
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
                                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                    {course.duration} of content
                                 </li>
                                 <li className="flex items-center text-sm text-gray-600">
                                    <Award className="h-4 w-4 mr-2 text-blue-600" />
                                    Certificate of completion
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

         {/* Main Content */}
         <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8">
               <div className="md:col-span-2">
                  <Tabs
                     defaultValue="overview"
                     className="mb-12"
                  >
                     <TabsList className="mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="instructor">Instructor</TabsTrigger>
                        <TabsTrigger value="materials">Materials</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                              {prerequisitesList.map((prerequisite, index) => (
                                 <li
                                    key={index}
                                    className="flex items-start"
                                 >
                                    <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                                       {index + 1}
                                    </div>
                                    <p className="text-gray-700">
                                       {prerequisite}
                                    </p>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </TabsContent>

                     <TabsContent value="instructor">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
                           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                              <Avatar className="h-24 w-24 border-2 border-blue-100">
                                 <AvatarFallback className="text-2xl uppercase">
                                    {course.teacher?.name?.charAt(0)}
                                 </AvatarFallback>
                              </Avatar>

                              <div>
                                 <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {course.teacher?.name}
                                 </h2>
                                 <p className="text-blue-600 mb-4">
                                    {course.teacher?.role}
                                 </p>

                                 <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                       <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                       <span>4.9 Instructor Rating</span>
                                    </div>
                                    <div className="flex items-center">
                                       <MessageCircle className="h-4 w-4 mr-1" />
                                       <span>2,347 Reviews</span>
                                    </div>
                                    <div className="flex items-center">
                                       <Users className="h-4 w-4 mr-1" />
                                       <span>18,430 Students</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </TabsContent>

                     <TabsContent value="materials">
                        <div className="space-y-4">
                           {course.materials?.map((material) => (
                              <div
                                 key={material.id}
                                 className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                              >
                                 <div className="flex items-center">
                                    <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded flex items-center justify-center mr-4">
                                       <Download className="h-5 w-5" />
                                    </div>
                                    <div>
                                       <h4 className="font-medium text-gray-900">
                                          {material.title}
                                       </h4>
                                       <p className="text-sm text-gray-500">
                                          Added on{" "}
                                          {new Date(
                                             material.created_at
                                          ).toLocaleDateString()}
                                       </p>
                                    </div>
                                 </div>
                                 <Button
                                    variant="outline"
                                    size="sm"
                                 >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                 </Button>
                              </div>
                           ))}
                        </div>
                     </TabsContent>

                     <TabsContent value="reviews">
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
                                                star <=
                                                Math.round(averageRating)
                                                   ? "fill-yellow-400 text-yellow-400"
                                                   : "fill-gray-300 text-gray-300"
                                             }`}
                                          />
                                       ))}
                                    </div>
                                    <p className="text-gray-600">
                                       {course.ratings?.length || 0} reviews
                                    </p>
                                 </div>

                                 <div className="flex-1 space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                       // Calculate percentage for each rating (mock data)
                                       const percentage =
                                          rating === 5
                                             ? 78
                                             : rating === 4
                                             ? 15
                                             : rating === 3
                                             ? 5
                                             : rating === 2
                                             ? 1
                                             : 1;

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
                                                {percentage}%
                                             </span>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-6">
                              {course.ratings?.map((review) => (
                                 <div
                                    key={review.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6"
                                 >
                                    <div className="flex justify-between items-start mb-4">
                                       <div className="flex items-center">
                                          <Avatar className="h-10 w-10 mr-4">
                                             <AvatarFallback>
                                                {review.student?.name?.charAt(
                                                   0
                                                ) || "U"}
                                             </AvatarFallback>
                                          </Avatar>
                                          <div>
                                             <h4 className="font-medium text-gray-900">
                                                {review.student?.name ||
                                                   "Anonymous User"}
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
                                       <p className="text-gray-700">
                                          {review.feedback}
                                       </p>
                                    )}
                                 </div>
                              ))}
                           </div>

                           {(!course.ratings ||
                              course.ratings.length === 0) && (
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

                           <div className="flex justify-center mt-8">
                              <Button
                                 variant="outline"
                                 className="border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                 Load More Reviews
                              </Button>
                           </div>
                        </div>
                     </TabsContent>
                  </Tabs>
               </div>

               <div className="md:col-span-1">
                  <div className="sticky top-24">
                     <Card className="shadow-sm">
                        <CardContent className="p-6">
                           <h3 className="font-bold text-gray-900 mb-4">
                              Related Courses
                           </h3>
                           <div className="space-y-4">
                              {relatedCourses?.map((relatedCourse) => (
                                 <div
                                    key={relatedCourse.id}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() =>
                                       router.push(
                                          `/courses/${relatedCourse.id}`
                                       )
                                    }
                                 >
                                    <div className="w-20 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded flex items-center justify-center">
                                       <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                       <h4 className="font-medium text-gray-900 text-sm">
                                          {relatedCourse.title}
                                       </h4>
                                       <p className="text-xs text-gray-500">
                                          {relatedCourse.category} •{" "}
                                          {relatedCourse.level}
                                       </p>
                                    </div>
                                 </div>
                              ))}
                              {!relatedCourses?.length && (
                                 <p className="text-sm text-gray-500 text-center py-4">
                                    No related courses found
                                 </p>
                              )}
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default CourseDetail;
