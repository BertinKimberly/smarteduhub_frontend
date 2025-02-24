"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
   Users,
   Briefcase,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
   role: "admin" | "student" | "parent";
}

const DashboardSidebar = ({ role }: SidebarProps) => {
   const { user } = useAuthStore();
   const [isCollapsed, setIsCollapsed] = useState(false);
   const [isMobile, setIsMobile] = useState(false);
   const pathname = usePathname();

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

   // Define navigation links based on the role
   const links = {
      admin: [
         { icon: <House />, label: "Dashboard", link: "/admin" },
         { icon: <User />, label: "Profile", link: "/admin/profile" },
         { icon: <Book />, label: "Courses", link: "/admin/courses" },
         { icon: <User2 />, label: "Users", link: "/admin/users" },
         { icon: <MessageCircleCode />, label: "Chat", link: "/admin/chat" },
         {
            icon: <Bell />,
            label: "Notifications",
            link: "/admin/notifications",
         },
         { icon: <Calendar />, label: "Schedule", link: "/admin/schedule" },
         { icon: <Settings />, label: "Settings", link: "/admin/settings" },
      ],
      student: [
         { icon: <House />, label: "Home", link: "/student" },
         { icon: <User />, label: "Profile", link: "/student/profile" },
         { icon: <Book />, label: "Courses", link: "/student/courses" },
         { icon: <Calendar />, label: "Timetable", link: "/student/timetable" },
         { icon: <MessageCircleCode />, label: "Chat", link: "/student/chat" },
      ],
      parent: [
         { icon: <House />, label: "Dashboard", link: "/parent" },
         { icon: <User />, label: "Profile", link: "/parent/profile" },
         { icon: <User2 />, label: "My Child", link: "/parent/child" },
         {
            icon: <ChartArea />,
            label: "Performance",
            link: "/parent/performance",
         },

         {
            icon: <MessageCircleCode />,
            label: "Messages",
            link: "/parent/messages",
         },
      ],
   };

   return (
      <div
         className={`hidden sticky top-4 rounded-lg p-4 border relative border-main h-[calc(100vh-1rem)] md:flex flex-col gap-6 ${
            isCollapsed ? "w-fit" : "w-[240px]"
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
            {links[role].map(({ icon, label, link }) => (
               <Link
                  key={label}
                  className={`flex gap-4 p-2 rounded-lg cursor-pointer hover:bg-background hover:text-main ${
                     pathname === link ? "bg-background text-main" : ""
                  }`}
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
                  <small>{user?.name}</small>
                  <small>{user?.email}</small>
               </div>
            )}
         </div>
         <Link
            className="flex gap-4 p-2 rounded-lg cursor-pointer hover:bg-main hover:text-white"
            href="/login"
         >
            <LogOut />
            {!isCollapsed && <span>Logout</span>}
         </Link>
      </div>
   );
};

export default DashboardSidebar;
