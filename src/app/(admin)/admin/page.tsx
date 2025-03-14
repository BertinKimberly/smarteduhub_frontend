"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Brain, Rocket, Upload } from "lucide-react";
import React from "react";
import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AdminOveralChart from "@/components/AdminOveralChart";
import { Calendar } from "@/components/ui/calendar";
import TopStudentsTable from "@/components/TopStudentsTable";
import Image from "next/image";
import bold from "@/icons/bold.png";
import medal from "@/icons/medal.png";
import school from "@/icons/school.png";
import { useAuthStore } from "@/store/useAuthStore";

const AdminPage = () => {
   const [date, setDate] = React.useState<Date | undefined>(new Date());

   const { user } = useAuthStore();

   return (
      <div className="p-2  flex flex-col gap-4 sm:gap-6">
         <DashboardNavbar title="Admin Dashboard" />
         <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
               <h3>
                  Welcome <span className="text-main">{user?.name}</span>
               </h3>
               <small>Pleased that you are back</small>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
               <div className="bg-main p-1 flex gap-2 items-center rounded-lg text-white px-2">
                  <Upload size={12} />
                  <span className="text-sm">Upload Curriculum</span>
               </div>
               <div className="bg-main p-1 flex gap-2 items-center rounded-lg text-white px-2">
                  <Brain size={12} />
                  <span className="text-sm">Analyze Curriculum</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background border border-main rounded-lg p-2 py-4 flex flex-col gap-1 justify-between w-full">
               <p className="font-bold ">Overall Performance</p>
               <div className="flex items-center gap-2 py-3">
                  <Rocket className="text-main" />
                  <span className="text-green-500">8.7%</span>of the profit
               </div>
               <div className="flex justify-center">
                  <small className="w-5/6">All the corners of the school</small>
                  <span>...</span>
               </div>
            </div>
            <div className="bg-background border border-main rounded-lg p-2 py-4 flex flex-col gap-1 justify-between w-full">
               <p className="font-bold ">Overall Performance</p>
               <div className="flex items-center gap-2 py-3">
                  <Rocket className="text-main" />
                  <span className="text-green-500">8.7%</span>of the profit
               </div>
               <div className="flex justify-center">
                  <small className="w-5/6">All the corners of the school</small>
                  <span>...</span>
               </div>
            </div>
            <div className="flex flex-col gap-4">
               <div className="border p-3 flex gap-4 rounded-lg justify-between">
                  <div>
                     <p>Students</p>
                     <h5>2.6k</h5>
                     <small>80% increase</small>
                  </div>
                  <div>
                     <Link href="/admin/students">View All</Link>
                     <div style={{ width: 50, height: 50, margin: "0 auto" }}>
                        <CircularProgressbar
                           value={80}
                           text={`80%`}
                           styles={buildStyles({
                              textColor: "#000",
                              pathColor: "#ffeb3b",
                              trailColor: "#d6d6d6",
                           })}
                        />
                     </div>
                  </div>
               </div>
               <div className="border p-3 flex gap-4 rounded-lg justify-between">
                  <div>
                     <p>Lessons</p>
                     <h5>40</h5>
                     <small>90% increase</small>
                  </div>
                  <div>
                     <Link href="/admin/courses">View All</Link>
                     <div style={{ width: 50, height: 50, margin: "0 auto" }}>
                        <CircularProgressbar
                           value={90}
                           text={`80%`}
                           styles={buildStyles({
                              textColor: "#000",
                              pathColor: "#4caf50",
                              trailColor: "#d6d6d6",
                           })}
                        />
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex flex-col gap-4">
               <div className="border p-3 flex gap-4 rounded-lg justify-between">
                  <div>
                     <p>AI Score</p>
                     <h5>20</h5>
                     <small>80% increase</small>
                  </div>
                  <div>
                     <Link href="/admin/students">View All</Link>
                     <div style={{ width: 50, height: 50, margin: "0 auto" }}>
                        <CircularProgressbar
                           value={80}
                           text={`80%`}
                           styles={buildStyles({
                              textColor: "#000",
                              pathColor: "#4caf50",
                              trailColor: "#d6d6d6",
                           })}
                        />
                     </div>
                  </div>
               </div>
               <div className="border p-3 flex gap-4 rounded-lg justify-between">
                  <div>
                     <p>Books Used</p>
                     <h5>23.6k</h5>
                     <small>20% Available</small>
                  </div>
                  <div>
                     <Link href="/admin/courses">View All</Link>
                     <div style={{ width: 50, height: 50, margin: "0 auto" }}>
                        <CircularProgressbar
                           value={20}
                           text={`80%`}
                           styles={buildStyles({
                              textColor: "#000",
                              pathColor: "#ff9800",
                              trailColor: "#d6d6d6",
                           })}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex flex-col lg:flex-row gap-4">
            <div className="border border-main rounded-lg p-1 w-full lg:w-3/4">
               <AdminOveralChart />
            </div>
            <div className="border border-main rounded-lg w-full lg:w-[30%] flex items-center justify-center p-2">
               <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md w-full"
               />
            </div>
         </div>

         <div className="flex flex-col lg:flex-row gap-4">
            <div className="border bg-background border-main p-4 rounded-lg w-full lg:w-[60%]">
               <p className="mb-4 sm:mb-6 font-bold">Top Perfoming students</p>
               <TopStudentsTable />
            </div>
            <div className="w-full lg:w-[40%]">
               <div className="flex flex-col gap-4">
                  <span>More Info</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                     <div className="border shadow p-3 rounded-lg flex gap-4 items-center justify-between">
                        <Image
                           src={bold}
                           alt="bold"
                        />
                        <div>
                           <p className="font-bold">300</p>
                           <small>More Students this year</small>
                        </div>
                     </div>
                     <div className="border shadow p-3 rounded-lg flex gap-4 items-center justify-between">
                        <Image
                           src={school}
                           alt="school"
                        />
                        <div>
                           <p className="font-bold">6</p>
                           <small>Courses Completed</small>
                        </div>
                     </div>
                     <div className="border shadow p-3 rounded-lg flex gap-4 items-center justify-between">
                        <Image
                           src={medal}
                           alt="medal"
                        />
                        <div>
                           <p className="font-bold">25</p>
                           <small>Competitions Won</small>
                        </div>
                     </div>
                     <div className="border shadow p-3 rounded-lg flex gap-4 items-center justify-between">
                        <Image
                           src={medal}
                           alt="medal"
                        />
                        <div>
                           <p className="font-bold">25</p>
                           <small>Competitions Won</small>
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
