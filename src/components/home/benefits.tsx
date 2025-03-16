import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, LightbulbIcon, TrendingUp } from "lucide-react";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

export const BenefitsSection = () => {
   const t = useTranslations("home.benefits");

   const benefitList = [
      {
         icon: <Brain className="h-8 w-8" />,
         title: t("personalized.title"),
         description: t("personalized.description"),
      },
      {
         icon: <Target className="h-8 w-8" />,
         title: t("analytics.title"),
         description: t("analytics.description"),
      },
      {
         icon: <LightbulbIcon className="h-8 w-8" />,
         title: t("content.title"),
         description: t("content.description"),
      },
      {
         icon: <TrendingUp className="h-8 w-8" />,
         title: t("improvement.title"),
         description: t("improvement.description"),
      },
   ];

   return (
      <section
         id="benefits"
         className="bg-gradient-to-b from-white to-blue-50 py-24 sm:py-32"
      >
         <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
               <div>
                  <h2 className="text-lg text-blue-600 mb-2 tracking-wider font-medium">
                     {t("title")}
                  </h2>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                     {t("subtitle")}
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                     {t("description")}
                  </p>
               </div>

               <div className="grid lg:grid-cols-2 gap-6 w-full">
                  {benefitList.map(({ icon, title, description }, index) => (
                     <Card
                        key={title}
                        className="bg-white border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group/number"
                     >
                        <CardHeader>
                           <div className="flex justify-between">
                              <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mb-6">
                                 {icon}
                              </div>
                              <span className="text-5xl text-blue-100 font-medium transition-all duration-300 group-hover/number:text-blue-200">
                                 0{index + 1}
                              </span>
                           </div>

                           <CardTitle className="text-gray-900">
                              {title}
                           </CardTitle>
                        </CardHeader>

                        <CardContent className="text-gray-600">
                           {description}
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
};

export default BenefitsSection;
