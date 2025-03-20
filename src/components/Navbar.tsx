"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import Logo from "@/images/logo.svg";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const { isAuthenticated, user } = useAuthStore();
   const router = useRouter();
   const pathname = usePathname();
   const locale = useLocale();
   const t = useTranslations("navbar");
   const [hasMounted, setHasMounted] = useState(false);

   useEffect(() => {
      setHasMounted(true);
   }, []);

   // Skip rendering any dynamic content until client-side hydration is complete
   if (!hasMounted) {
      return <div className="h-[90px]"></div>; // Or appropriate placeholder
   }

   // Language options
   const languages = [
      { label: "EN", value: "en" },
      { label: "FR", value: "fr" },
      { label: "RW", value: "rw" },
   ];

   const handleLanguageChange = (newLocale: string) => {
      router.replace("/" + pathname, { locale: newLocale });
   };

   const getDashboardLink = () => {
      if (!user?.role) return "/";
      return `/${user.role.toLowerCase()}`;
   };

   return (
      <>
         <nav className="px-4 bg-[#F8F9FE]">
            <div className="container flex items-center justify-between h-[90px] mx-auto">
               {/* Logo and Desktop Links */}
               <div className="flex items-center gap-8">
                  <Link
                     className="flex gap-1 items-center justify-center"
                     href="/"
                  >
                     <Image
                        src={Logo}
                        alt="Logo"
                        width={30}
                        height={30}
                     />
                     <p className="font-bold text-main hover:text-main/50 ">
                        Smart Eduhub
                     </p>
                  </Link>

                  {/* Desktop Links */}
                  <div className="hidden md:flex gap-4">
                     <Link
                        href="/courses"
                        className="hover:text-main"
                     >
                        {t("courses")}
                     </Link>
                     <Link
                        href="/about"
                        className="hover:text-main"
                     >
                        {t("about")}
                     </Link>
                     <Link
                        href="/contact"
                        className="hover:text-main"
                     >
                        {t("contact")}
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
                           {t("courses")}
                        </Link>
                        <Link
                           href="/about"
                           onClick={() => setIsMenuOpen(false)}
                           className="hover:text-main"
                        >
                           {t("about")}
                        </Link>
                        <Link
                           href="/contact"
                           onClick={() => setIsMenuOpen(false)}
                           className="hover:text-main"
                        >
                           {t("contact")}
                        </Link>
                        <div className="flex w-full gap-2 items-center justify-center">
                           {isAuthenticated ? (
                              <Link href={getDashboardLink()}>
                                 <Button className="bg-main rounded-full p-4 py-6 px-8">
                                    {t("dashboard")}
                                 </Button>
                              </Link>
                           ) : (
                              <>
                                 <Link href="/login">
                                    <Button className="bg-main rounded-full p-4 py-6 px-8">
                                       {t("login")}
                                    </Button>
                                 </Link>
                                 <Link href="/register">
                                    <Button
                                       className="border border-main rounded-full p-4 py-6 px-8"
                                       variant="outline"
                                    >
                                       {t("register")}
                                    </Button>
                                 </Link>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               )}

               {/* Desktop Call-to-Action Buttons */}
               <div className="hidden md:flex items-center gap-4 xl:gap-6">
                  {/* Language Switcher */}
                  <Select
                     value={locale}
                     onValueChange={handleLanguageChange}
                  >
                     <SelectTrigger className="w-[140px]">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {languages.map((lang) => (
                           <SelectItem
                              key={lang.value}
                              value={lang.value}
                           >
                              {lang.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  {isAuthenticated ? (
                     <Link href={getDashboardLink()}>
                        <Button className="bg-main rounded-full p-4 py-6 px-8">
                           {t("dashboard")}
                        </Button>
                     </Link>
                  ) : (
                     <>
                        <Link href="/login">
                           <Button className="bg-main rounded-full p-4 py-6 px-8">
                              {t("login")}
                           </Button>
                        </Link>
                        <Link href="/register">
                           <Button
                              className="border border-main rounded-full p-4 py-6 px-8"
                              variant="outline"
                           >
                              {t("register")}
                           </Button>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </nav>
      </>
   );
};

export default Navbar;
