"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Brain, Rocket, Upload, ChevronRight, Users, BookOpen, Calculator, Award } from "lucide-react";
import React from "react";
import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AdminOveralChart from "@/components/AdminOveralChart";
import { Calendar } from "@/components/ui/calendar";
import TopStudentsTable from "@/components/TopStudentsTable";
import { useAuthStore } from "@/store/useAuthStore";
import { Badge } from "@/components/ui/badge";

const AdminPage = () => {
   const [date, setDate] = React.useState<Date | undefined>(new Date());
   const { user } = useAuthStore();

   return (
      <div className="bg-gray-50 min-h-screen">
         <DashboardNavbar title="Admin Dashboard" />
         
         {/* Header Section */}
         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-8">
            <div className="container mx-auto px-4">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                     <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Welcome, <span className="text-blue-100">{user?.name}</span>
                     </h1>
                     <p className="text-blue-100 mt-1">Pleased that you are back</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                     <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                        <Upload size={16} />
                        <span>Upload Curriculum</span>
                     </button>
                     <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                        <Brain size={16} />
                        <span>Analyze Curriculum</span>
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div className="container mx-auto px-4 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-12 mb-8">
               <div className="bg-white rounded-xl overflow-hidden shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-lg font-semibold text-gray-800">Overall Performance</h3>
                           <div className="flex items-center gap-2 mt-2">
                              <Rocket className="text-blue-500" size={20} />
                              <span className="text-green-500 font-bold">8.7%</span>
                              <span className="text-gray-600">improvement</span>
                           </div>
                           <p className="text-gray-500 mt-2 text-sm">All the corners of the school</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">View</Badge>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl overflow-hidden shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
                           <div className="flex items-center gap-2 mt-2">
                              <Calculator className="text-indigo-500" size={20} />
                              <span className="text-green-500 font-bold">$24,500</span>
                              <span className="text-gray-600">this month</span>
                           </div>
                           <p className="text-gray-500 mt-2 text-sm">12.5% increase from last month</p>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">View</Badge>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                     <div className="flex justify-between">
                        <div>
                           <h3 className="text-lg font-semibold text-gray-800">Students</h3>
                           <div className="flex items-center gap-2 mt-2">
                              <Users className="text-blue-500" size={20} />
                              <span className="text-gray-800 font-bold">2.6k</span>
                           </div>
                           <p className="text-green-500 text-sm mt-1">80% increase</p>
                        </div>
                        <div className="flex flex-col items-end">
                           <Link href="/admin/students" className="text-blue-500 hover:text-blue-700 text-sm flex items-center mb-2">
                              View All <ChevronRight size={16} />
                           </Link>
                           <div style={{ width: 60, height: 60 }}>
                              <CircularProgressbar
                                 value={80}
                                 text={`80%`}
                                 styles={buildStyles({
                                    textColor: "#1e40af",
                                    textSize: "24px",
                                    pathColor: "#3b82f6",
                                    trailColor: "#dbeafe",
                                 })}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                     <div className="flex justify-between">
                        <div>
                           <h3 className="text-lg font-semibold text-gray-800">Lessons</h3>
                           <div className="flex items-center gap-2 mt-2">
                              <BookOpen className="text-indigo-500" size={20} />
                              <span className="text-gray-800 font-bold">40</span>
                           </div>
                           <p className="text-green-500 text-sm mt-1">90% increase</p>
                        </div>
                        <div className="flex flex-col items-end">
                           <Link href="/admin/courses" className="text-blue-500 hover:text-blue-700 text-sm flex items-center mb-2">
                              View All <ChevronRight size={16} />
                           </Link>
                           <div style={{ width: 60, height: 60 }}>
                              <CircularProgressbar
                                 value={90}
                                 text={`90%`}
                                 styles={buildStyles({
                                    textColor: "#4f46e5",
                                    textSize: "24px",
                                    pathColor: "#6366f1",
                                    trailColor: "#e0e7ff",
                                 })}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* AI Score and Books Used */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Analytics</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                           <div className="flex justify-between items-center">
                              <div>
                                 <p className="text-gray-600">AI Score</p>
                                 <h4 className="text-2xl font-bold text-gray-800 mt-1">20</h4>
                                 <p className="text-green-500 text-sm mt-1">80% increase</p>
                              </div>
                              <div style={{ width: 50, height: 50 }}>
                                 <CircularProgressbar
                                    value={80}
                                    text={`80%`}
                                    styles={buildStyles({
                                       textColor: "#1e40af",
                                       textSize: "24px",
                                       pathColor: "#3b82f6",
                                       trailColor: "#dbeafe",
                                    })}
                                 />
                              </div>
                           </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                           <div className="flex justify-between items-center">
                              <div>
                                 <p className="text-gray-600">Books Used</p>
                                 <h4 className="text-2xl font-bold text-gray-800 mt-1">23.6k</h4>
                                 <p className="text-amber-500 text-sm mt-1">20% Available</p>
                              </div>
                              <div style={{ width: 50, height: 50 }}>
                                 <CircularProgressbar
                                    value={20}
                                    text={`20%`}
                                    styles={buildStyles({
                                       textColor: "#7c3aed",
                                       textSize: "24px",
                                       pathColor: "#8b5cf6",
                                       trailColor: "#ede9fe",
                                    })}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar</h3>
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md w-full"
                     />
                  </div>
               </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 mb-8">
               <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
                  <AdminOveralChart />
               </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row gap-8">
               {/* Top Performing Students */}
               <div className="w-full lg:w-2/3 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Top Performing Students</h3>
                        <Link href="/admin/students" className="text-blue-500 hover:text-blue-700 text-sm flex items-center">
                           View All <ChevronRight size={16} />
                        </Link>
                     </div>
                     <TopStudentsTable />
                  </div>
               </div>

               {/* More Info */}
               <div className="w-full lg:w-1/3">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 p-6">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center gap-4">
                           <div className="bg-blue-100 p-3 rounded-full">
                              <Users className="h-6 w-6 text-blue-500" />
                           </div>
                           <div>
                              <p className="text-2xl font-bold text-gray-800">300</p>
                              <p className="text-gray-600 text-sm">More Students this year</p>
                           </div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 flex items-center gap-4">
                           <div className="bg-purple-100 p-3 rounded-full">
                              <BookOpen className="h-6 w-6 text-purple-500" />
                           </div>
                           <div>
                              <p className="text-2xl font-bold text-gray-800">6</p>
                              <p className="text-gray-600 text-sm">Courses Completed</p>
                           </div>
                        </div>
                        
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex items-center gap-4">
                           <div className="bg-amber-100 p-3 rounded-full">
                              <Award className="h-6 w-6 text-amber-500" />
                           </div>
                           <div>
                              <p className="text-2xl font-bold text-gray-800">25</p>
                              <p className="text-gray-600 text-sm">Competitions Won</p>
                           </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex items-center gap-4">
                           <div className="bg-green-100 p-3 rounded-full">
                              <Award className="h-6 w-6 text-green-500" />
                           </div>
                           <div>
                              <p className="text-2xl font-bold text-gray-800">25</p>
                              <p className="text-gray-600 text-sm">Competitions Won</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminPage;