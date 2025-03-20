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
   NotebookText,
   GamepadIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogoutUser } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

interface SidebarProps {
   role: "admin" | "student" | "parent" | "teacher";
}

const DashboardSidebar = ({ role }: SidebarProps) => {
   const t = useTranslations("dashboard");
   const { user } = useAuthStore();
   const [isCollapsed, setIsCollapsed] = useState(false);
   const pathname = usePathname();
   const logout = useLogoutUser();

   const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
   };

   const handleLogout = async () => {
      try {
         await logout.mutateAsync();
      } catch (error) {
         console.error("Logout failed:", error);
      }
   };

   // Add this helper function
   const isActiveLink = (link: string) => {
      // For home routes like /student, /admin, etc, require exact match
      if (link === `/${role}`) {
         return pathname.replace(/^\/[a-z]{2}/, '') === link;
      }
      // For other routes, use includes
      return pathname.includes(link);
   };

   // Define navigation links based on the role
   const links = {
      admin: [
         { icon: <House />, label: t("menu.dashboard"), link: "/admin" },
         { icon: <User />, label: t("menu.profile"), link: "/admin/profile" },
         { icon: <Book />, label: t("menu.courses"), link: "/admin/courses" },
         { icon: <User2 />, label: t("menu.users"), link: "/admin/users" },
         {
            icon: <NotebookText />,
            label: t("menu.assignments"),
            link: "/admin/assignments",
         },
         {
            icon: <MessageCircleCode />,
            label: t("menu.chat"),
            link: "/admin/chat",
         },
         {
            icon: <Bell />,
            label: t("menu.notifications"),
            link: "/admin/notifications",
         },
         {
            icon: <Calendar />,
            label: t("menu.schedule"),
            link: "/admin/schedule",
         },
         {
            icon: <Settings />,
            label: t("menu.settings"),
            link: "/admin/settings",
         },
      ],
      student: [
         { icon: <House />, label: t("menu.home"), link: "/student" },
         { icon: <User />, label: t("menu.profile"), link: "/student/profile" },
         { icon: <Book />, label: t("menu.courses"), link: "/student/courses" },
         {
            icon: <BookOpenCheck />,
            label: t("menu.enrolledCourses"),
            link: "/student/enrolled-courses",
         },
         {
            icon: <NotebookText />,
            label: t("menu.assignments"),
            link: "/student/assignments",
         },
         {
            icon: <GamepadIcon/>,
            label: t("menu.games"),
            link: "/student/gamified-learning",
         },
         {
            icon: <Calendar />,
            label: t("menu.timetable"),
            link: "/student/timetable",
         },
         {
            icon: <MessageCircleCode />,
            label: t("menu.chat"),
            link: "/student/chat",
         },
      ],
      parent: [
         { icon: <House />, label: t("menu.dashboard"), link: "/parent" },
         { icon: <User />, label: t("menu.profile"), link: "/parent/profile" },
         { icon: <User2 />, label: t("menu.myChild"), link: "/parent/child" },
         {
            icon: <ChartArea />,
            label: t("menu.performance"),
            link: "/parent/performance",
         },
         {
            icon: <MessageCircleCode />,
            label: t("menu.messages"),
            link: "/parent/messages",
         },
      ],
      teacher: [
         { icon: <House />, label: t("menu.dashboard"), link: "/teacher" },
         { icon: <User />, label: t("menu.profile"), link: "/teacher/profile" },
         {
            icon: <Briefcase />,
            label: t("menu.courses"),
            link: "/teacher/courses",
         },
         {
            icon: <NotebookText />,
            label: t("menu.assignments"),
            link: "/teacher/assignments",
         },
         {
            icon: <Users />,
            label: t("menu.students"),
            link: "/teacher/students",
         },
         {
            icon: <MessageCircleCode />,
            label: t("menu.chat"),
            link: "/teacher/chat",
         },
         {
            icon: <Calendar />,
            label: t("menu.schedule"),
            link: "/teacher/schedule",
         },
      ],
   };

   return (
      <div
         className={`hidden sticky top-0 rounded-lg p-3 border border-submain shadow-lg bg-white md:flex flex-col justify-between gap-6 ${
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
                     isActiveLink(link) ? "bg-background text-main font-medium" : ""
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
            <button
               className="flex gap-4 p-2 rounded-lg cursor-pointer hover:bg-main hover:text-white w-full"
               onClick={handleLogout}
            >
               <LogOut />
               {!isCollapsed && <span>{t("logout")}</span>}
            </button>
         </div>
      </div>
   );
};

export default DashboardSidebar;
