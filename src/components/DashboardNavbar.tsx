import { Filter, LucideSortDesc, Search } from "lucide-react";
import React from "react";

const DashboardNavbar = ({title}:{title:string}) => {
   return (
      <div className="w-full flex items-center justify-between ">
         <p className="font-bold">{title}</p>
         <div className="flex items-center gap-4">
            <div className="bg-background p-2 flex items-center rounded-full gap-2 px-2">
               <Search />
               <input className="bg-transparent border-none outline-none" placeholder="Search"/>
            </div>
            <div className="p-2 flex gap-1 border rounded-lg cursor-pointer items-center"><Filter size={12}/><span>Filter</span></div>
            <div className="p-2 flex gap-1 border rounded-lg cursor-pointer items-center"><LucideSortDesc size={12}/><span>Sort</span></div>
         </div>
      </div>
   );
};

export default DashboardNavbar;
