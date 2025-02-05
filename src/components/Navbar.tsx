"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import Logo from "@/images/logo.svg";
import Image from "next/image";

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   return (
      <>
         <nav className=" px-4  bg-[#F8F9FE]">
            <div className="container flex items-center justify-between h-[90px] mx-auto ">
               {/* Logo and Desktop Links */}
               <div className="flex items-center gap-8">
                  <Link
                     className="flex gap-1 items-center justify-center"
                     href="/"
                  >
                     <Image
                        src={Logo}
                        alt="Logo"
                     />
                     <p className="font-bold ">Smart Eduhub</p>
                  </Link>

                  {/* Desktop Links */}
                  <div className="hidden md:flex gap-4">
                     <Link
                        href="/courses"
                        className="hover:text-main"
                     >
                        Courses
                     </Link>
                     <Link
                        href="/about"
                        className="hover:text-main"
                     >
                        About
                     </Link>
                     <Link
                        href="/contact"
                        className="hover:text-main"
                     >
                        Contact
                     </Link>
                  </div>
               </div>

               {/* Mobile Hamburger Menu */}
               <div className="md:hidden">
                  <button
                     className="text-gray-800 focus:outline-none font-extrabold"
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                     {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
               </div>

               {/* Mobile Dropdown Menu */}
               {isMenuOpen && (
                  <div className="absolute top-[90px] left-0 w-full bg-[#F8F9FE] shadow-md md:hidden z-30 text-black px-8  transition-all">
                     <div className="flex flex-col items-center gap-4 p-4 text-lg">
                        <Link
                           href="/courses"
                           onClick={() => setIsMenuOpen(false)}
                           className="hover:text-main"
                        >
                           Courses
                        </Link>
                        <Link
                           href="/about"
                           onClick={() => setIsMenuOpen(false)}
                           className="hover:text-main"
                        >
                           About
                        </Link>
                        <Link
                           href="/contact"
                           onClick={() => setIsMenuOpen(false)}
                           className="hover:text-main"
                        >
                           Contact
                        </Link>
                        <div className="flex w-full gap-2 items-center justify-center">
                        <Link href="/login">
                           <Button className="bg-main rounded-full p-4 py-6 px-8 ">
                              Login
                           </Button>
                        </Link>

                        <Link href="/register">
                     <Button
                        className="border border-main rounded-full p-4 py-6 px-8"
                        variant="outline"
                     >
                        Register
                     </Button>
                  </Link>
                        </div>
                     </div>
                  </div>
               )}

               {/* Call-to-Action Button */}
               <div className="hidden md:flex gap-4 xl:gap-6">
                  <Link href="/login">
                     <Button className="bg-main rounded-full p-4 py-6 px-8">
                        Login
                     </Button>
                  </Link>
                  <Link href="/register">
                     <Button
                        className="border border-main rounded-full p-4 py-6 px-8"
                        variant="outline"
                     >
                        Register
                     </Button>
                  </Link>
               </div>
            </div>
         </nav>
      </>
   );
};

export default Navbar;
