"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImg from "@/images/hero.svg";
import { Input } from "../ui/input";

export const HeroSection = () => {
   return (
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16 md:py-24">
         {/* Background elements */}
         <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-10"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <div className="space-y-8">
                  <Badge
                     variant="secondary"
                     className="px-4 py-1 mb-4 text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                  >
                     <Sparkles className="w-4 h-4 mr-2" />
                     AI-Driven Education
                  </Badge>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-indigo-600">
                        Smart EduHub:
                     </span>{" "}
                     The Future of Personalized Learning
                  </h1>

                  <p className="text-lg text-slate-600 max-w-xl">
                     Revolutionize your learning journey with our AI-powered
                     platform that adapts to your unique pace and style. Unlock
                     your full potential with personalized content for students,
                     parents, teachers, and administrators.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                     >
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                     <Button
                        size="lg"
                        variant="outline"
                        className="border-slate-300"
                     >
                        Learn More
                     </Button>
                  </div>

                  <div className="pt-6">
                     <div className="p-2 bg-white rounded-xl shadow-lg max-w-md">
                        <div className="relative flex items-center">
                           <Search className="absolute left-3 h-5 w-5 text-slate-400" />
                           <Input
                              type="text"
                              placeholder="Search for courses..."
                              className="pl-10 py-6 border-none focus:ring-2 focus:ring-indigo-500"
                           />
                           <Button className="absolute right-1 bg-indigo-600 hover:bg-indigo-700">
                              Explore
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="hidden lg:flex justify-center relative">
                  <div className="relative w-full max-w-lg">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur-lg opacity-75 animate-pulse"></div>
                     <div className="relative bg-white rounded-lg shadow-xl overflow-hidden p-1">
                        <Image
                           src={HeroImg}
                           alt="Smart EduHub Platform"
                           className="w-full h-auto"
                           priority
                        />
                     </div>

                     {/* Floating elements */}
                     <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                           Students
                        </Badge>
                     </div>
                     <div className="absolute top-1/2 -left-8 bg-white p-4 rounded-lg shadow-lg">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                           Teachers
                        </Badge>
                     </div>
                     <div className="absolute -bottom-6 -right-2 bg-white p-4 rounded-lg shadow-lg">
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                           Parents
                        </Badge>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
