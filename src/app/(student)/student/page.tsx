import { AssignmentChart } from "@/components/AssignmentChart";
import CustomCard from "@/components/CustomCard";
import DashboardNavbar from "@/components/DashboardNavbar";
import { StudentBarChart } from "@/components/StudentBarChart";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Book, Pen, Star, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const cardData = [
   {
      icon: Book,
      desc: "Total Available Courses",
      title: `${20} Courses`,
      color: "#979205",
   },
   {
      icon: Star,
      desc: "Total Completed Projects",
      title: `${20} Courses`,
      color: "#FEB185",
   },
   {
      icon: Pen,
      desc: "Total Completed Assignments",
      title: `${30} assignments`,
      color: "#8495B2",
   },
   {
      icon: Users,
      desc: "All Students enrolled in same courses",
      title: `${40} Students`,
      color: "#311D4A",
   },
];
const StudentHome = () => {
   return (
      <div className="p-3">
         <DashboardNavbar title="Dashboard" />
         <div className="flex flex-col gap-2 w-[40%] my-6">
            <h4>Curriculum Progress</h4>
            <Progress value={40} />
         </div>

         <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4 mb-6">
            {cardData.map((d, i) => (
               <CustomCard
                  key={i}
                  icon={d.icon}
                  desc={d.desc}
                  title={d.title}
                  color={d.color}
               />
            ))}
         </section>

         <section className=" rounded-lg mt-6 flex gap-6 flex-col md:flex-row">
            <div className="border p-4 flex flex-col gap-4 w-full md:w-[50%] rounded-lg">
               <p className="">Performance Overview</p>
               <StudentBarChart />
               <Link
                  href="/student/courses"
                  className="text-main"
               >
                  View All Courses
               </Link>
            </div>
            <div className="border p-4 flex flex-col gap-4 w-full md:w-[50%] rounded-lg">
               <p className="text-transparent bg-clip-text bg-gradient-to-r from-main via-blue-400 to-pink-200">
                  Assignments Overview
               </p>

               <AssignmentChart />
            </div>
         </section>

         {/* enrolled courses  */}
         <section className="my-6">
          <div className="flex items-center justify-between w-full my-4"><h3>Enrolled Courses</h3> <Button className="text-main" variant="outline">View All</Button></div>
            
            {/* courses  */}
         </section>
      </div>
   );
};

export default StudentHome;
