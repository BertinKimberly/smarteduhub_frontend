"use client";
import Image from "next/image";
import React, { useState } from "react";
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
   MessageCircleCode,
   Settings,
   User,
   User2,
   Users,
   Briefcase,
   BookOpenCheck,
   MessageSquare,
   Brain,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
   role: "admin" | "student" | "parent" | "teacher";
}

const DashboardSidebar = ({ role }: SidebarProps) => {
   const { user } = useAuthStore();
   const [isCollapsed, setIsCollapsed] = useState(false);
   const pathname = usePathname();

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
         {
            icon: <BookOpenCheck />,
            label: "Enrolled Courses",
            link: "/student/enrolled-courses",
         },
         { icon: <Calendar />, label: "Timetable", link: "/student/timetable" },
         { icon: <MessageCircleCode />, label: "Chat", link: "/student/chat" },
         {
            icon: <Brain />,
            label: "AI Chat",
            link: "/student/ai-chat",
         },
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
      teacher: [
         { icon: <House />, label: "Dashboard", link: "/teacher" },
         { icon: <User />, label: "Profile", link: "/teacher/profile" },
         { icon: <Briefcase />, label: "Courses", link: "/teacher/courses" },
         { icon: <Users />, label: "Students", link: "/teacher/students" },
         { icon: <MessageCircleCode />, label: "Chat", link: "/teacher/chat" },
         { icon: <Calendar />, label: "Schedule", link: "/teacher/schedule" },
      ],
   };

   return (
      <div
         className={`hidden sticky top-0 rounded-lg p-3 border border-main bg-white md:flex flex-col justify-between gap-6 ${
            isCollapsed ? "w-fit" : "w-[240px]"
         } h-auto min-h-[400px] max-h-[90vh] overflow-y-auto`}
      >
         {/* Toggle Button */}
         <button
            onClick={toggleSidebar}
            className="absolute -right-2 top-3 font-bold bg-white w-8 h-8 rounded-full border border-main hover:bg-background shadow-sm"
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
               width={30}
               height={30}
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

         <div>
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
      </div>
   );
};

export default DashboardSidebar;
