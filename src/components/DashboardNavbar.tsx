"use client";

import React, { useEffect, useState } from "react";
import {
   Search,
   Bell,
   Menu,
   User,
   Settings,
   LogOut,
   UserCircle,
   HelpCircle,
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
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface DashboardNavbarProps {
   title: string;
   userName?: string;
}

const DashboardNavbar = ({
   title,
   userName = "User",
}: DashboardNavbarProps) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const router = useRouter();
   const pathname = usePathname();

   const getUserRole = (): "admin" | "student" | "teacher" | "parent" => {
      const path = pathname.split("/")[1]; // Get the first segment of the path
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

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         setIsScrolled(scrollPosition > 20);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <nav
         className={`w-full sticky top-0 z-50 transition-all duration-300 ${
            isScrolled
               ? "bg-background/95 backdrop-blur-md shadow-sm"
               : "bg-background/50 backdrop-blur-sm"
         }`}
      >
         <div className=" mx-auto px-4 sm:px-6 lg:px-8">
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
                        className="w-full pl-10 h-9"
                     />
                  </div>
               </div>

               {/* Right section */}
               <div className="hidden md:flex items-center gap-2">
                  <Button
                     variant="ghost"
                     size="sm"
                     className="relative"
                  >
                     <Bell className="h-4 w-4" />
                     <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                        3
                     </span>
                  </Button>

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
                        <DropdownMenuLabel className="font-normal">
                         
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="cursor-pointer"
                           onClick={() => router.push(getProfilePath())}
                        >
                           <UserCircle className="mr-2 h-4 w-4" />
                           <span>Profile</span>
                        </DropdownMenuItem>
                      
                        <DropdownMenuItem className="cursor-pointer">
                          <Link href="/help-center">
                           <HelpCircle className="mr-2 h-4 w-4" />
                           <span>Help & Support</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="cursor-pointer text-red-600 focus:text-red-600"
                           onClick={() => {
                              // Add your logout logic here
                              router.push("/login");
                           }}
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
                           className="w-full pl-10"
                        />
                     </div>
                     <div className="flex gap-2">
                        <Button
                           variant="ghost"
                           size="sm"
                           className="flex-1 gap-2"
                           onClick={() => router.push("/profile")}
                        >
                           <User className="h-4 w-4" />
                           Profile
                        </Button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </nav>
   );
};

export default DashboardNavbar;
