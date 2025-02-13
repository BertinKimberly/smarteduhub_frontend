"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImg from "@/images/hero.svg";
import { Input } from "../ui/input";

export const HeroSection = () => {
   return (
      <div className=" w-full bg-main text-white rounded-b-[10%] min-h-[80vh] flex flex-col justify-center items-center">
         <div className="container py-10 mx-auto w-full flex gap-8 items-center justify-center">
            <div className="flex flex-col gap-4  items-center md:items-start justify-center md:w-1/2">
               <h1 className="text-4xl font-bold text-center md:text-start">
                  Welcome to the future of work
               </h1>
               <p className="text-lg text-center md:text-start">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                  eget et, sed id. Nunc, sed ut. Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Labore, tempore repellendus
                  commodi non voluptatem neque dolor. Modi, quas amet porro
                  aliquid illo veritatis inventore placeat perferendis eligendi
                  mollitia error totam, quia aut animi, tempora magni incidunt
                  quaerat natus velit dolorum!
               </p>
               <div className="flex w-full gap-6 items-center justify-center md:justify-start">
                  <Link href="/login">
                     <Button className="bg-main rounded-full p-4 py-6 px-8 border-white border">
                        Login
                     </Button>
                  </Link>

                  <Link href="/register">
                     <Button
                        className="border border-white text-main rounded-full p-4 py-6 px-8"
                        variant="outline"
                     >
                        Register
                     </Button>
                  </Link>
               </div>

               {/* search courses */}
               <div className="mt-10">
                <h3>Explorer Courses</h3>
               </div>
               <div className="mt-4 flex w-full">
                <Input className="p-8 rounded-l-full w-3/4 outline-none bg-white text-black text-lg" placeholder="Search course "/><div className="border border-white flex items-center justify-center rounded-r-full p-4 bg-white text-main cursor-pointer"><Search/></div>
               </div>
            </div>
            <div className="hidden md:block relative w-1/2 h-1/2 ">
               <Image
                  src={HeroImg}
                  objectFit="contain"
                  alt="Hero Image"
               />
            </div>
         </div>
      </div>
   );
};
