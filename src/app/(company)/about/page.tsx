import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   BookOpen,
   Users,
   Trophy,
   Target,
   ChevronRight,
   GraduationCap,
   Globe,
   Clock,
} from "lucide-react";
import Link from "next/link";

const stats = [
   { icon: <BookOpen className="h-6 w-6" />, value: "500+", label: "Courses" },
   { icon: <Users className="h-6 w-6" />, value: "50,000+", label: "Students" },
   {
      icon: <Trophy className="h-6 w-6" />,
      value: "95%",
      label: "Success Rate",
   },
   { icon: <Globe className="h-6 w-6" />, value: "100+", label: "Countries" },
];

const values = [
   {
      icon: <Target className="h-6 w-6 text-main" />,
      title: "Quality Education",
      description:
         "We deliver high-quality, industry-relevant education that prepares students for real-world success.",
   },
   {
      icon: <GraduationCap className="h-6 w-6 text-main" />,
      title: "Student Success",
      description:
         "Our primary focus is on student achievement and helping them reach their full potential.",
   },
   {
      icon: <Globe className="h-6 w-6 text-main" />,
      title: "Global Access",
      description:
         "Making quality education accessible to students worldwide through our digital platform.",
   },
   {
      icon: <Clock className="h-6 w-6 text-main" />,
      title: "Lifetime Learning",
      description:
         "Supporting continuous learning and professional development throughout your career.",
   },
];

const About = () => {
   return (
      <div className="bg-[#F8F9FE] min-h-screen pb-4">
         {/* Hero Section */}
         <div className="bg-gradient-to-r from-main to-indigo-600 text-white py-20">
            <div className="container mx-auto px-4">
               <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                     Empowering Lives Through Education
                  </h1>
                  <p className="text-lg opacity-90 mb-8">
                     Smart Eduhub is revolutionizing online education by making
                     high-quality learning accessible to everyone, everywhere.
                  </p>
                  <Button className="bg-white text-main hover:bg-gray-100 rounded-full py-6 px-8">
                     Start Learning Today{" "}
                     <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
               </div>
            </div>
         </div>

         {/* Stats Section */}
         <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {stats.map((stat, index) => (
                  <Card
                     key={index}
                     className="text-center p-6"
                  >
                     <CardContent className="p-0">
                        <div className="flex justify-center mb-4">
                           <div className="bg-main/10 p-3 rounded-full">
                              {stat.icon}
                           </div>
                        </div>
                        <h3 className="text-3xl font-bold text-main mb-2">
                           {stat.value}
                        </h3>
                        <p className="text-gray-600">{stat.label}</p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         {/* Story Section */}
         <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
               <h2 className="text-3xl font-bold text-center mb-6">
                  Our Story
               </h2>
               <div className="bg-white rounded-xl shadow-sm p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                     Founded in 2020, Smart Eduhub emerged from a simple yet
                     powerful vision: to democratize education and make quality
                     learning accessible to everyone. We recognized that
                     traditional education systems weren&apos;t adapting quickly
                     enough to meet the needs of today&apos;s rapidly evolving world.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     What started as a small collection of online courses has
                     grown into a global learning platform, serving students
                     from over 100 countries. Our success is built on our
                     commitment to excellence, innovation in education
                     technology, and most importantly, our dedication to student
                     success.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                     Today, we continue to expand our course offerings, enhance
                     our learning platform, and forge partnerships with industry
                     leaders to ensure our students receive the most relevant
                     and up-to-date education possible.
                  </p>
               </div>
            </div>
         </div>

         {/* Values Section */}
         <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
               Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {values.map((value, index) => (
                  <Card
                     key={index}
                     className="p-6"
                  >
                     <CardContent className="p-0">
                        <div className="bg-main/10 p-3 rounded-full w-fit mb-4">
                           {value.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3">
                           {value.title}
                        </h3>
                        <p className="text-gray-600">{value.description}</p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         {/* CTA Section */}
         <div className="bg-main text-white py-16">
            <div className="container mx-auto px-4 text-center">
               <h2 className="text-3xl font-bold mb-6">
                  Join Our Learning Community
               </h2>
               <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                  Start your learning journey today and join thousands of
                  students who are transforming their lives through education.
               </p>
               <div className="flex gap-4 justify-center">
                  <Link href="/courses">
                     <Button className="bg-white text-main hover:bg-gray-100 rounded-full py-6 px-8">
                        Browse Courses
                     </Button>
                  </Link>
                  <Link href="/contact">
                     <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 rounded-full py-6 px-8 bg-transparent"
                     >
                        Contact Us
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default About;
