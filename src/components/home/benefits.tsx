import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, LightbulbIcon, TrendingUp } from "lucide-react";
import { ReactNode } from "react";

interface BenefitsProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Personalized Learning",
    description:
      "Our AI technology adapts to each student's learning style, pace, and preferences, creating truly customized educational experiences that improve retention and results.",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Performance Analytics",
    description:
      "Get comprehensive insights into academic progress with detailed analytics dashboards for students, parents, teachers, and administrators to track growth in real-time.",
  },
  {
    icon: <LightbulbIcon className="h-8 w-8" />,
    title: "Engaging Content",
    description:
      "Access interactive lessons, videos, quizzes, and simulations designed by educational experts to make learning enjoyable while achieving better academic outcomes.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Continuous Improvement",
    description:
      "Our platform evolves with each student, constantly refining recommendations and learning pathways based on performance data and the latest educational research.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="bg-gradient-to-b from-white to-blue-50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
          <div>
            <h2 className="text-lg text-blue-600 mb-2 tracking-wider font-medium">Why Choose Smart EduHub</h2>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Transforming Education Through Technology
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Smart EduHub combines cutting-edge AI with proven educational methodologies to deliver 
              personalized learning experiences that help students achieve their full potential while 
              giving educators powerful tools to maximize their impact.
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

                  <CardTitle className="text-gray-900">{title}</CardTitle>
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