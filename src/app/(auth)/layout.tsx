import Image from "next/image";
import React, { ReactNode } from "react";
import LoginImg from "../../../public/images/login.svg";
import assisted from "../../../public/images/assisted.png";
import dot from "../../../public/images/dot.png";
const AuthLayout = ({ children }: { children: ReactNode }) => {
   return (
      <div className="w-full min-h-screen flex items-center justify-center">
         <div className="container mx-auto ">{children}</div>
         <div className="absolute -bottom-20 right-0 z-10">
            <div className="relative hidden md:block">
               <Image
                  src={LoginImg}
                  alt="login"
                  className="w-[400px] xl:w-[500px] relative z-10"
               />
               <div className="absolute top-1/2 left-24 transform z-30">
                  <Image
                     src={assisted}
                     alt="assisted"
                     className="w-[200px] opacity-80"
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
   );
};

export default AuthLayout;
