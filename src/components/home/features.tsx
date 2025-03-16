import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BrainCircuit, 
  BarChart3, 
  Users, 
  GraduationCap, 
  MessageCircle, 
  CalendarClock 
} from "lucide-react";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

export const FeaturesSection = () => {
  const t = useTranslations("home.features");

  const featureList = [
    {
      icon: <BrainCircuit className="h-6 w-6" />,
      title: t("aiLearning.title"),
      description: t("aiLearning.description"),
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: t("analytics.title"),
      description: t("analytics.description"),
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t("multiRole.title"),
      description: t("multiRole.description"),
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: t("curriculum.title"),
      description: t("curriculum.description"),
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: t("feedback.title"),
      description: t("feedback.description"),
    },
    {
      icon: <CalendarClock className="h-6 w-6" />,
      title: t("scheduling.title"),
      description: t("scheduling.description"),
    },
  ];

  return (
    <section id="features" className="bg-blue-50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-lg text-main text-center mb-2 tracking-wider font-medium">
          {t("title")}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-gray-900">
          {t("subtitle")}
        </h2>

        <h3 className="md:w-3/4 lg:w-2/3 mx-auto text-xl text-center text-gray-600 mb-12">
          {t("description")}
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map(({ icon, title, description }) => (
            <div key={title}>
              <Card className="h-full bg-white border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                <CardHeader className="flex justify-center items-center pb-2">
                  <div className="bg-gradient-to-r from-main to-indigo-600 p-4 rounded-lg text-white mb-6">
                    {icon}
                  </div>

                  <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
                </CardHeader>

                <CardContent className="text-gray-600 text-center">
                  {description}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;