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

interface FeaturesProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: "AI-Powered Learning",
    description:
      "Advanced algorithms analyze each student's learning patterns to deliver personalized content that adapts in real-time to their progress and needs.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Comprehensive Analytics",
    description:
      "Detailed dashboards provide actionable insights into performance, highlighting strengths and identifying areas that need additional attention.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Multi-Role Platform",
    description:
      "Specialized interfaces for students, parents, teachers, and administrators with features designed specifically for each user's needs.",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Curriculum Aligned",
    description:
      "Content mapped to national education standards ensuring students receive comprehensive instruction that prepares them for standardized testing and beyond.",
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Instant Feedback",
    description:
      "Real-time assessment and feedback during learning activities help students understand concepts immediately rather than waiting for traditional grading.",
  },
  {
    icon: <CalendarClock className="h-6 w-6" />,
    title: "Flexible Scheduling",
    description:
      "Learn anytime, anywhere with on-demand access to lessons, allowing students to progress at their own pace while maintaining accountability.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-blue-50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-lg text-main text-center mb-2 tracking-wider font-medium">
          Platform Features
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-gray-900">
          Technology That Transforms Learning
        </h2>

        <h3 className="md:w-3/4 lg:w-2/3 mx-auto text-xl text-center text-gray-600 mb-12">
          Smart EduHub combines cutting-edge artificial intelligence with proven educational methodologies 
          to create an adaptive learning environment that meets the unique needs of every student.
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