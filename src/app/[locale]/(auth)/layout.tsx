"use client";

import Image from "next/image";
import React, { ReactNode } from "react";
import LoginImg from "../../../../public/images/login.svg";
import assisted from "../../../../public/images/assisted.png";
import dot from "../../../../public/images/dot.png";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

const AuthLayout = ({ children }: { children: ReactNode }) => {
   const router = useRouter();
   const pathname = usePathname();
   const locale = useLocale();

   // Language options
   const languages = [
      { label: "English", value: "en" },
      { label: "Français", value: "fr" },
      { label: "Kinyarwanda", value: "rw" },
   ];

   const handleLanguageChange = (newLocale: string) => {
      router.replace("/" + pathname, { locale: newLocale });
   };

   return (
      <main className="w-full min-h-screen relative">
         <div className="absolute top-4 right-4 z-20">
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
         </div>

         <div className="w-full min-h-screen flex items-center justify-center">
            <div className="px-2 w-[98%] sm:container mx-auto relative z-10 flex items-center justify-center">
               {children}
            </div>
            <div className="fixed bottom-0 right-0 z-10 pointer-events-none">
               <div className="relative hidden md:block">
                  <Image
                     src={LoginImg}
                     alt="login"
                     className="w-[300px] xl:w-[400px] 2xl:w-[500px] relative z-20"
                  />
                  <div className="absolute top-1/2 left-32 transform z-30">
                     <Image
                        src={assisted}
                        alt="assisted"
                        className="w-[100px] xl:w-[200px] opacity-80"
                     />
                  </div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                     <Image
                        src={dot}
                        alt="dot"
                        className="w-[50px] opacity-80"
                     />
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
};

export default AuthLayout;
