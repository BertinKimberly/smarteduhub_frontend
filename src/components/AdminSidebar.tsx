"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import logo from "@/images/logo.svg";
import {
   Bell,
   Book,
   Calendar,
   ChartArea,
   House,
   LogOut,
   Menu,
   MessageCircleCode,
   Settings,
   User,
   User2,
} from "lucide-react";

const AdminSidebar = () => {
   const [isCollapsed, setIsCollapsed] = useState(false);
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth < 768);
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
   };

   return (
      <>
         <div
            className={`hidden  rounded-lg p-4 border relative border-main h-fit  md:flex flex-col gap-6 ${
               isCollapsed ? "w-fit" : "w-[250px]"
            }`}
         >
            <button
               onClick={toggleSidebar}
               className="mb-4 font-bold absolute -right-2 border border-main bg-white w-8 h-8 rounded-full"
            >
               {isCollapsed ? ">" : "<"}
            </button>
            <Link
               className="flex gap-3 items-center justify-start"
               href="/"
            >
               <Image
                  src={logo}
                  alt="smarteduhub"
               />
               {!isCollapsed && (
                  <span className="text-main font-bold">Smart Eduhub</span>
               )}
            </Link>
            <div className="flex flex-col gap-4">
               {[
                  { icon: <House />, label: "Dashboard", link: "/admin" },
                  {
                     icon: <Book />,
                     label: "Curriculum",
                     link: "/admin/curriculum",
                  },
                  {
                     icon: <User2 />,
                     label: "Students",
                     link: "/admin/students",
                  },
                  {
                     icon: <MessageCircleCode />,
                     label: "Chat",
                     link: "/chats",
                  },
                  {
                     icon: <Bell />,
                     label: "Notifications",
                     link: "/admin/notifications",
                  },
                  {
                     icon: <Calendar />,
                     label: "Schedule",
                     link: "/admin/schedule",
                  },
                  {
                     icon: <Settings />,
                     label: "Settings",
                     link: "/admin/settings",
                  },
                  { icon: <LogOut />, label: "Logout", link: "/login" },
               ].map(({ icon, label, link }) => (
                  <Link
                     key={label}
                     className="flex gap-4 hover:bg-background p-2 rounded-lg cursor-pointer hover:text-main"
                     href={link}
                  >
                     {icon}
                     {!isCollapsed && <span>{label}</span>}
                  </Link>
               ))}
            </div>
            <div className="py-4 flex items-center gap-2">
               <div className="border h-8 w-8 rounded-full flex items-center justify-center p-1">
                  <User />
               </div>
               {!isCollapsed && (
                  <div className="flex flex-col">
                     <small>James Peter</small>
                     <small>james@gmail.com</small>
                  </div>
               )}
            </div>
         </div>
      </>
   );
};

export default AdminSidebar;
