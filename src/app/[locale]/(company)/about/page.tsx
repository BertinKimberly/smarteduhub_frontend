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
import { useTranslations } from "next-intl";

const About = () => {
   const t = useTranslations("about");

   const stats = [
      {
         icon: <BookOpen className="h-6 w-6" />,
         value: "500+",
         label: t("stats.courses"),
      },
      {
         icon: <Users className="h-6 w-6" />,
         value: "50,000+",
         label: t("stats.students"),
      },
      {
         icon: <Trophy className="h-6 w-6" />,
         value: "95%",
         label: t("stats.successRate"),
      },
      {
         icon: <Globe className="h-6 w-6" />,
         value: "100+",
         label: t("stats.countries"),
      },
   ];

   const values = [
      {
         icon: <Target className="h-6 w-6 text-main" />,
         title: t("values.quality.title"),
         description: t("values.quality.description"),
      },
      {
         icon: <GraduationCap className="h-6 w-6 text-main" />,
         title: t("values.success.title"),
         description: t("values.success.description"),
      },
      {
         icon: <Globe className="h-6 w-6 text-main" />,
         title: t("values.access.title"),
         description: t("values.access.description"),
      },
      {
         icon: <Clock className="h-6 w-6 text-main" />,
         title: t("values.learning.title"),
         description: t("values.learning.description"),
      },
   ];

   return (
      <div className="bg-[#F8F9FE] min-h-screen pb-4">
         {/* Hero Section */}
         <div className="bg-gradient-to-r from-main to-indigo-600 text-white py-20">
            <div className="container mx-auto px-4">
               <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                     {t("hero.title")}
                  </h1>
                  <p className="text-lg opacity-90 mb-8">
                     {t("hero.description")}
                  </p>
                  <Button className="bg-white text-main hover:bg-gray-100 rounded-full py-6 px-8">
                     {t("hero.cta")} <ChevronRight className="ml-2 h-4 w-4" />
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
                  {t("story.title")}
               </h2>
               <div className="bg-white rounded-xl shadow-sm p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                     {t("story.part1")}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                     {t("story.part2")}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                     {t("story.part3")}
                  </p>
               </div>
            </div>
         </div>

         {/* Values Section */}
         <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
               {t("values.title")}
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
               <h2 className="text-3xl font-bold mb-6">{t("cta.title")}</h2>
               <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                  {t("cta.description")}
               </p>
               <div className="flex gap-4 justify-center">
                  <Link href="/courses">
                     <Button className="bg-white text-main hover:bg-gray-100 rounded-full py-6 px-8">
                        {t("cta.browseCourses")}
                     </Button>
                  </Link>
                  <Link href="/contact">
                     <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 rounded-full py-6 px-8 bg-transparent"
                     >
                        {t("cta.contactUs")}
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default About;
