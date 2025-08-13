"use client";

import React, { useEffect, useState } from "react";
import {
   Search,
   Menu,
   User,
   LogOut,
   UserCircle,
   HelpCircle,
   House,
   Book,
   Calendar,
   ChartArea,
   MessageCircleCode,
   Users,
   Briefcase,
   BookOpenCheck,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import NotificationsSheet from "./NotificationsSheet";
import NotificationBell from "./NotificationBell";
import { useLogoutUser } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

interface DashboardNavbarProps {
   title: string;
   userName?: string;
}

const DashboardNavbar = ({ title }: DashboardNavbarProps) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const logout = useLogoutUser();
   const locale = useLocale();
   const { notifications } = useNotifications();

   // Calculate unread count
   const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

   const getUserRole = (): "admin" | "student" | "teacher" | "parent" => {
      const path = pathname.split("/")[1];
      switch (path) {
         case "admin":
            return "admin";
         case "student":
            return "student";
         case "teacher":
            return "teacher";
         case "parent":
            return "parent";
         default:
            return "student"; // Default fallback
      }
   };

   const userRole = getUserRole();
   const getProfilePath = () => `/${userRole}/profile`;

   const getRoleLinks = (role: "admin" | "student" | "parent" | "teacher") => {
      const links = {
         admin: [
            { icon: <House />, label: "Dashboard", link: "/admin" },
            { icon: <Book />, label: "Courses", link: "/admin/courses" },
            { icon: <Users />, label: "Users", link: "/admin/users" },
            { icon: <MessageCircleCode />, label: "Chat", link: "/admin/chat" },
            { icon: <Calendar />, label: "Schedule", link: "/admin/schedule" },
         ],
         student: [
            { icon: <House />, label: "Home", link: "/student" },
            { icon: <Book />, label: "Courses", link: "/student/courses" },
            {
               icon: <BookOpenCheck />,
               label: "Enrolled Courses",
               link: "/student/enrolled-courses",
            },
            {
               icon: <Calendar />,
               label: "Timetable",
               link: "/student/timetable",
            },
            {
               icon: <MessageCircleCode />,
               label: "Chat",
               link: "/student/chat",
            },
         ],
         parent: [
            { icon: <House />, label: "Dashboard", link: "/parent" },
            { icon: <Users />, label: "My Child", link: "/parent/child" },
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
            { icon: <Briefcase />, label: "Courses", link: "/teacher/courses" },
            { icon: <Users />, label: "Students", link: "/teacher/students" },
            {
               icon: <MessageCircleCode />,
               label: "Chat",
               link: "/teacher/chat",
            },
         ],
      };
      return links[role];
   };

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         setIsScrolled(scrollPosition > 20);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   // Close notifications drawer when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         const target = event.target as HTMLElement;
         if (
            isNotificationsOpen &&
            !target.closest("#notifications-drawer") &&
            !target.closest("#notifications-trigger")
         ) {
            setIsNotificationsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [isNotificationsOpen]);

   const handleLogout = async () => {
      try {
         await logout.mutateAsync();
      } catch (error) {
         console.error("Logout failed:", error);
      }
   };

   // Language options with codes only
   const languages = [
      { code: "en", label: "EN" },
      { code: "fr", label: "FR" },
      { code: "rw", label: "RW" },
   ];

   const handleLanguageChange = (newLocale: string) => {
      router.replace("/" + pathname, { locale: newLocale });
   };

   return (
      <nav
         className={`w-full sticky top-0 z-50 transition-all duration-300 ${
            isScrolled
               ? "bg-background/95 backdrop-blur-md shadow-sm"
               : "bg-background/50 backdrop-blur-sm"
         }`}
      >
         <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
               {/* Left section */}
               <div className="flex items-center">
                  <h1 className="font-semibold text-xl tracking-tight">
                     {title}
                  </h1>
               </div>

               {/* Center section - Search (hidden on mobile) */}
               <div className="hidden md:flex flex-1 justify-center px-8">
                  <div className="relative w-full max-w-md">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full pl-10 h-9 bg-white"
                     />
                  </div>
               </div>

               {/* Right section */}
               <div className="hidden md:flex items-center gap-2">
                  <Select
                     value={locale}
                     onValueChange={handleLanguageChange}
                  >
                     <SelectTrigger className="w-[100px]">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {languages.map(({ code, label }) => (
                           <SelectItem
                              key={code}
                              value={code}
                           >
                              <span>{label}</span>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  <NotificationBell
                     unreadCount={unreadCount}
                     onClick={() =>
                        setIsNotificationsOpen(!isNotificationsOpen)
                     }
                  />

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="outline"
                           size="sm"
                           className="gap-2 ml-2 h-10 px-4 rounded-full w-10"
                        >
                           <User className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent
                        className="w-56"
                        align="end"
                     >
                        <DropdownMenuLabel className="font-normal"></DropdownMenuLabel>
                        <DropdownMenuItem
                           className="cursor-pointer"
                           onClick={() => router.push(getProfilePath())}
                        >
                           <UserCircle className="mr-2 h-4 w-4" />
                           <span>Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer ">
                           <Link
                              href="/help-center"
                              className="flex  flex-row gap-2"
                           >
                              <HelpCircle className="mr-2 h-4 w-4" />
                              <span>Help & Support</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="cursor-pointer text-red-600 focus:text-red-600"
                           onClick={handleLogout}
                        >
                           <LogOut className="mr-2 h-4 w-4" />
                           <span>Log out</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               {/* Mobile menu button */}
               <div className="md:hidden">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                     <Menu className="h-5 w-5" />
                  </Button>
               </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
               <div className="md:hidden py-4 border-t">
                  <div className="space-y-4">
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                           type="search"
                           placeholder="Search..."
                           className="w-full pl-10 bg-white"
                        />
                     </div>

                     <Select
                        value={locale}
                        onValueChange={handleLanguageChange}
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {languages.map(({ code, label }) => (
                              <SelectItem
                                 key={code}
                                 value={code}
                              >
                                 <span>{label}</span>
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>

                     {/* Role-based navigation links */}
                     <div className="flex flex-col gap-2">
                        {getRoleLinks(userRole).map(({ icon, label, link }) => (
                           <Link
                              key={label}
                              href={link}
                              className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg"
                           >
                              {icon}
                              <span>{label}</span>
                           </Link>
                        ))}
                     </div>

                     <div className="pt-4 border-t">
                        <Button
                           variant="ghost"
                           size="sm"
                           className="w-full justify-start gap-3"
                           onClick={() => router.push(getProfilePath())}
                        >
                           <User className="h-4 w-4" />
                           Profile
                        </Button>
                        <Button
                           variant="ghost"
                           size="sm"
                           className="w-full justify-start gap-3 text-red-600"
                           onClick={() => router.push("/login")}
                        >
                           <LogOut className="h-4 w-4" />
                           Log out
                        </Button>
                     </div>
                  </div>
               </div>
            )}

            {/* Notifications Sheet Component */}
            <NotificationsSheet
               open={isNotificationsOpen}
               onOpenChange={setIsNotificationsOpen}
            />
         </div>
      </nav>
   );
};

export default DashboardNavbar;
