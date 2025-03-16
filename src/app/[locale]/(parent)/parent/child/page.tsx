"use client";
import {
   User,
   BookOpen,
   Calendar,
   Clock,
   Award,
   BarChart,
   CheckCircle,
   AlertCircle,
   MessageSquare,
   Activity,
   BookMarked,
} from "lucide-react";
import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useProfile } from "@/hooks/useAuth";
import { useChildren, useChildDetails } from "@/hooks/useParent";

const MyChildPage = () => {
   const { data: user, isLoading: isLoadingUser, isError } = useProfile();
   const { data: children, isLoading: isLoadingChildren } = useChildren();
   const [selectedChild, setSelectedChild] = useState<string>("");
   const { data: childDetails, isLoading: isLoadingDetails } =
      useChildDetails(selectedChild);

   useEffect(() => {
      if (children && children.length > 0 && !selectedChild) {
         setSelectedChild(children[0].id);
      }
   }, [children]);

   if (isLoadingUser || isLoadingChildren || isLoadingDetails) {
      return <div>Loading...</div>;
   }

   if (!children || children.length === 0) {
      return <div>No children found</div>;
   }

   const selectedChildData = childDetails;

   const recentActivity = [
      {
         type: "assignment",
         title: "Completed Math Quiz",
         date: "Today",
         status: "completed" as const,
         score: "85%",
      },
      {
         type: "course",
         title: "Started Science Chapter 4",
         date: "Yesterday",
         status: "in-progress" as const,
      },
      {
         type: "assignment",
         title: "English Essay Submission",
         date: "2 days ago",
         status: "pending-review" as const,
      },
   ];

   const upcomingAssignments = [
      {
         title: "History Project",
         dueDate: "Feb 28, 2025",
         status: "not-started",
      },
      {
         title: "Science Lab Report",
         dueDate: "Mar 3, 2025",
         status: "in-progress",
      },
      { title: "Math Test", dueDate: "Mar 5, 2025", status: "not-started" },
   ];

   const courseProgress = [
      { subject: "Mathematics", progress: 75, grade: "B+" },
      { subject: "Science", progress: 60, grade: "A-" },
      { subject: "English", progress: 85, grade: "A" },
      { subject: "History", progress: 45, grade: "B" },
   ];

   // Status indicator component
   const statusStyles = {
      completed: "bg-green-500",
      "in-progress": "bg-blue-500",
      "pending-review": "bg-yellow-500",
      "not-started": "bg-gray-400",
      overdue: "bg-red-500",
   };

   const StatusIndicator = ({
      status,
   }: {
      status: keyof typeof statusStyles;
   }) => {
      return (
         <span
            className={`inline-block w-3 h-3 rounded-full ${
               statusStyles[status] || "bg-gray-400"
            } mr-2`}
         ></span>
      );
   };

   return (
      <>
         <div className="w-full space-y-6">
            <DashboardNavbar title="My Child" />

            {/* Child Selector */}
            <div className="bg-white rounded-lg shadow p-4">
               <div className="flex flex-wrap gap-3">
                  {children.map((child) => (
                     <button
                        key={child.id}
                        onClick={() => setSelectedChild(child.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                           selectedChild === child.id
                              ? "bg-main text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                        }`}
                     >
                        <User size={16} />
                        {child.name}
                     </button>
                  ))}
               </div>
            </div>

            {selectedChildData && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Child Info Section */}
                  <div className="md:col-span-2 space-y-6">
                     <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-4">
                              <div className="bg-main/10 h-24 w-24 rounded-full flex items-center justify-center">
                                 <User
                                    size={40}
                                    className="text-main"
                                 />
                              </div>
                              <div>
                                 <h2 className="text-2xl font-semibold">
                                    {selectedChildData.name}
                                 </h2>
                                 <p className="text-gray-600">
                                    {selectedChildData.grade}
                                 </p>
                                 <div className="mt-2 flex gap-4">
                                    <div className="flex items-center gap-1 text-sm">
                                       <Award
                                          size={16}
                                          className="text-main"
                                       />
                                       <span>{selectedChildData.grade}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                       <Calendar
                                          size={16}
                                          className="text-main"
                                       />
                                       <span>
                                          {selectedChildData.attendance}{" "}
                                          Attendance
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                       <Clock
                                          size={16}
                                          className="text-main"
                                       />
                                       <span>
                                          {
                                             selectedChildData.upcomingAssignments
                                          }{" "}
                                          Due soon
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <button className="bg-main hover:bg-main/90 transition-colors text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
                              <MessageSquare size={14} />
                              Contact Teacher
                           </button>
                        </div>
                     </div>

                     {/* Recent Activity Section */}
                     <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">
                           Recent Activity
                        </h3>
                        <div className="space-y-4">
                           {recentActivity.map((activity, i) => (
                              <div
                                 key={i}
                                 className="flex items-center gap-3 border-b pb-4 last:border-0"
                              >
                                 <Activity className="text-main" />
                                 <div className="flex-1">
                                    <div className="flex items-center">
                                       <StatusIndicator
                                          status={activity.status}
                                       />
                                       <p className="font-medium">
                                          {activity.title}
                                       </p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                       {activity.date}
                                    </p>
                                 </div>
                                 {activity.score && (
                                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                       {activity.score}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Course Progress Section */}
                     <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">
                           Course Progress
                        </h3>
                        <div className="space-y-5">
                           {courseProgress.map((course, i) => (
                              <div
                                 key={i}
                                 className="space-y-2"
                              >
                                 <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                       <BookMarked
                                          size={18}
                                          className="text-main"
                                       />
                                       <span className="font-medium">
                                          {course.subject}
                                       </span>
                                    </div>
                                    <div className="bg-main/10 text-main px-3 py-1 rounded-full text-sm font-medium">
                                       {course.grade}
                                    </div>
                                 </div>
                                 <div className="relative pt-1">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                       <div
                                          className="bg-main h-2.5 rounded-full"
                                          style={{
                                             width: `${course.progress}%`,
                                          }}
                                       ></div>
                                    </div>
                                    <p className="text-right text-xs text-gray-500 mt-1">
                                       {course.progress}% Complete
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Sidebar - Upcoming Assignments & Quick Stats */}
                  <div className="space-y-6">
                     <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">
                           Upcoming Assignments
                        </h3>
                        <div className="space-y-4">
                           {upcomingAssignments.map((assignment, i) => (
                              <div
                                 key={i}
                                 className="flex items-start gap-3 border-b pb-4 last:border-0"
                              >
                                 <div className="mt-0.5">
                                    {assignment.status === "not-started" ? (
                                       <AlertCircle
                                          size={18}
                                          className="text-yellow-500"
                                       />
                                    ) : (
                                       <CheckCircle
                                          size={18}
                                          className="text-green-500"
                                       />
                                    )}
                                 </div>
                                 <div>
                                    <p className="font-medium">
                                       {assignment.title}
                                    </p>
                                    <div className="flex items-center">
                                       <Calendar
                                          size={14}
                                          className="text-gray-500 mr-1"
                                       />
                                       <p className="text-sm text-gray-500">
                                          Due: {assignment.dueDate}
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                           <BookOpen size={14} />
                           View All Assignments
                        </button>
                     </div>

                     <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">
                           Weekly Stats
                        </h3>
                        <div className="space-y-4">
                           <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                 <p className="text-gray-600">
                                    Time Spent Learning
                                 </p>
                                 <p className="font-bold text-main">12h 45m</p>
                              </div>
                              <div className="grid grid-cols-7 gap-1 h-16">
                                 {[25, 45, 15, 60, 80, 30, 20].map(
                                    (height, i) => (
                                       <div
                                          key={i}
                                          className="flex flex-col items-center justify-end"
                                       >
                                          <div
                                             className="bg-main w-full rounded-t-sm"
                                             style={{ height: `${height}%` }}
                                          ></div>
                                          <span className="text-xs text-gray-500 mt-1">
                                             {
                                                [
                                                   "M",
                                                   "T",
                                                   "W",
                                                   "T",
                                                   "F",
                                                   "S",
                                                   "S",
                                                ][i]
                                             }
                                          </span>
                                       </div>
                                    )
                                 )}
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-3">
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                 <BarChart
                                    size={22}
                                    className="text-main mx-auto mb-1"
                                 />
                                 <p className="text-2xl font-bold text-main">
                                    86%
                                 </p>
                                 <p className="text-xs text-gray-600">
                                    Avg. Score
                                 </p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                 <Award
                                    size={22}
                                    className="text-main mx-auto mb-1"
                                 />
                                 <p className="text-2xl font-bold text-main">
                                    4
                                 </p>
                                 <p className="text-xs text-gray-600">
                                    Achievements
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white rounded-lg shadow p-4">
                        <button className="w-full bg-main hover:bg-main/90 transition-colors text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                           <Award size={16} />
                           Download Progress Report
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </>
   );
};

export default MyChildPage;
