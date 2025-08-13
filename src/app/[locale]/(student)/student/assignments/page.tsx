//@ts-nocheck
"use client";
import React, { useState } from "react";
import { useGetStudentAssignments } from "@/hooks/useAssignments";
import {
   Book,
   BookOpen,
   Clock,
   Search,
   FileText,
   CheckCircle2,
   XCircle,
   AlertCircle,
   ChevronRight,
   Calendar,
   Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardNavbar from "@/components/DashboardNavbar";
import SecureAssignmentViewer from "@/components/SecureAssignmentViewer";

const StudentAssignmentsPage = () => {
   const { data: assignments, isLoading, error } = useGetStudentAssignments();
   const [searchTerm, setSearchTerm] = useState("");
   const [activeTab, setActiveTab] = useState("all");
   const [activeAssignment, setActiveAssignment] = useState<string | null>(
      null
   );

   const displayAssignments = assignments || [];

   // Filter assignments based on search term and tab
   const filteredAssignments = displayAssignments.filter((assignment) => {
      const matchesSearch =
         assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         assignment.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         assignment.course.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

      // Filter based on active tab
      if (activeTab === "pending") {
         return matchesSearch && !assignment.submitted_at;
      } else if (activeTab === "completed") {
         return matchesSearch && assignment.submitted_at;
      }
      return matchesSearch;
   });

   // Group assignments by course
   const groupedByCourse = filteredAssignments.reduce((acc, assignment) => {
      const courseId = assignment.course.id;
      if (!acc[courseId]) {
         acc[courseId] = {
            courseTitle: assignment.course.title,
            assignments: [],
         };
      }
      acc[courseId].assignments.push(assignment);
      return acc;
   }, {});

   // Get stats for dashboard
   const totalAssignments = displayAssignments.length;
   const pendingAssignments = displayAssignments.filter(
      (assignment) => !assignment.submitted_at
   ).length;
   const completedAssignments = displayAssignments.filter(
      (assignment) => assignment.submitted_at
   ).length;

   // Function to format date
   const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
      });
   };

   return (
      <div className="bg-gray-50 min-h-screen">
         {/* Header */}
         <DashboardNavbar title="Student Assignments" />
         <div className="bg-gradient-to-r from-main to-indigo-700 py-16">
            <div className="container mx-auto px-4">
               <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  My Assignments Dashboard
               </h1>
               <p className="text-blue-100 text-lg md:w-2/3">
                  View and complete assignments from your enrolled courses with
                  our secure assignment submission system.
               </p>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-12 mb-8">
               <Card className="bg-white shadow-md">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg text-gray-600 flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-600" />
                        Total Assignments
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-3xl font-bold text-gray-800">
                        {totalAssignments}
                     </p>
                  </CardContent>
               </Card>

               <Card className="bg-white shadow-md">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg text-gray-600 flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-yellow-600" />
                        Pending
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-3xl font-bold text-gray-800">
                        {pendingAssignments}
                     </p>
                  </CardContent>
               </Card>

               <Card className="bg-white shadow-md">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg text-gray-600 flex items-center">
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                        Completed
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-3xl font-bold text-gray-800">
                        {completedAssignments}
                     </p>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Assignment List with Tabs */}
         <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                     My Assignments
                  </h2>
                  <div className="relative w-full md:w-64">
                     <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                     />
                     <Input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200"
                     />
                  </div>
               </div>

               <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
               >
                  <TabsList className="grid grid-cols-3 mb-6">
                     <TabsTrigger value="all">All Assignments</TabsTrigger>
                     <TabsTrigger value="pending">Pending</TabsTrigger>
                     <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab}>
                     {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                           <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                           <span className="ml-3 text-gray-600">
                              Loading your assignments...
                           </span>
                        </div>
                     ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-lg mx-auto text-center">
                           There was an error loading your assignments. Please
                           try again later.
                        </div>
                     ) : Object.keys(groupedByCourse).length === 0 ? (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-8 rounded-lg max-w-lg mx-auto text-center">
                           <FileText className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                           <h3 className="text-xl font-semibold mb-2">
                              No assignments found
                           </h3>
                           <p>
                              {searchTerm
                                 ? "No assignments match your search criteria."
                                 : activeTab === "all"
                                 ? "You don't have any assignments yet."
                                 : activeTab === "pending"
                                 ? "You don't have any pending assignments."
                                 : "You haven't completed any assignments yet."}
                           </p>
                           {searchTerm && (
                              <Button
                                 variant="outline"
                                 onClick={() => setSearchTerm("")}
                                 className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
                              >
                                 Clear Search
                              </Button>
                           )}
                           {activeTab !== "all" && (
                              <Button
                                 variant="outline"
                                 onClick={() => setActiveTab("all")}
                                 className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
                              >
                                 View All Assignments
                              </Button>
                           )}
                        </div>
                     ) : (
                        Object.keys(groupedByCourse).map((courseId) => (
                           <div
                              key={courseId}
                              className="mb-8"
                           >
                              <div className="flex items-center mb-4">
                                 <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                                 <h3 className="text-xl font-semibold text-gray-800">
                                    {groupedByCourse[courseId].courseTitle}
                                 </h3>
                              </div>

                              <div className="space-y-4">
                                 {groupedByCourse[courseId].assignments.map(
                                    (assignment) => (
                                       <Card
                                          key={assignment.id}
                                          className="overflow-hidden border-l-4 border-l-blue-500"
                                       >
                                          <div className="p-5">
                                             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                                                <div>
                                                   <h4 className="text-lg font-medium text-gray-900">
                                                      {assignment.title}
                                                   </h4>
                                                   <div className="flex items-center space-x-3 mt-1">
                                                      <div className="flex items-center text-sm text-gray-500">
                                                         <Calendar
                                                            size={16}
                                                            className="mr-1"
                                                         />
                                                         <span>
                                                            Created:{" "}
                                                            {formatDate(
                                                               assignment.created_at
                                                            )}
                                                         </span>
                                                      </div>
                                                      {assignment.due_date && (
                                                         <div className="flex items-center text-sm text-gray-500">
                                                            <Clock
                                                               size={16}
                                                               className="mr-1"
                                                            />
                                                            <span>
                                                               Due:{" "}
                                                               {formatDate(
                                                                  assignment.due_date
                                                               )}
                                                            </span>
                                                         </div>
                                                      )}
                                                      {assignment.submitted_at ? (
                                                         <Badge className="bg-green-100 text-green-800 border-green-200">
                                                            <CheckCircle2
                                                               size={12}
                                                               className="mr-1"
                                                            />
                                                            Submitted
                                                         </Badge>
                                                      ) : (
                                                         <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                            <AlertCircle
                                                               size={12}
                                                               className="mr-1"
                                                            />
                                                            Pending
                                                         </Badge>
                                                      )}
                                                   </div>
                                                </div>
                                                {assignment.google_form_url &&
                                                   !assignment.submitted_at && (
                                                      <Button
                                                         onClick={() =>
                                                            setActiveAssignment(
                                                               assignment.id
                                                            )
                                                         }
                                                         className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                                                      >
                                                         Start Assignment
                                                      </Button>
                                                   )}
                                             </div>

                                             {assignment.description && (
                                                <p className="text-gray-600 mb-4">
                                                   {assignment.description}
                                                </p>
                                             )}

                                             {assignment.google_form_url &&
                                                activeAssignment ===
                                                   assignment.id && (
                                                   <div className="fixed inset-0 z-50">
                                                      <SecureAssignmentViewer
                                                         assignment={assignment}
                                                         onClose={() =>
                                                            setActiveAssignment(
                                                               null
                                                            )
                                                         }
                                                      />
                                                   </div>
                                                )}
                                          </div>
                                       </Card>
                                    )
                                 )}
                              </div>
                           </div>
                        ))
                     )}
                  </TabsContent>
               </Tabs>
            </div>
         </div>
      </div>
   );
};

export default StudentAssignmentsPage;
