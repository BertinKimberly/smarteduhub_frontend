import DashboardNavbar from "@/components/DashboardNavbar";
import React from "react";
import { Progress } from "@/components/ui/progress";
import CustomCard from "@/components/CustomCard";
import { Book, Goal, Pen, Star, Users } from "lucide-react";


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

const DashboardPage = () => {
   return (
      <div className="p-3">
         <DashboardNavbar title="Teacher" />
         <div className="flex flex-col gap-6 pt-10">
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

         </div>
      </div>
   );
};

export default DashboardPage;
