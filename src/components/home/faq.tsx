import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQProps {
   question: string;
   answer: string;
   value: string;
}

const FAQList: FAQProps[] = [
   {
      question:
         "How does Smart Eduhub's AI personalize learning for each student?",
      answer:
         "Our AI analyzes each student's learning patterns, strengths, and areas for improvement through continuous assessment. It then customizes content delivery, adjusts difficulty levels, and recommends specific resources that match the student's learning style. As students progress, the system evolves with them, ensuring they're always challenged at the right level.",
      value: "item-1",
   },
   {
      question:
         "What kind of analytics are available for teachers and parents?",
      answer:
         "Teachers receive comprehensive dashboards showing class-wide trends, individual student progress, and specific skill mastery levels. Parents can access reports showing their child's engagement, progress across subjects, time spent learning, and achievement milestones. Both can view real-time updates and receive alerts when intervention might be beneficial.",
      value: "item-2",
   },
   {
      question: "How does Smart Eduhub align with educational standards?",
      answer:
         "Our curriculum is mapped to national and state educational standards including Common Core, Next Generation Science Standards, and others. Content is regularly updated to reflect changes in standards, and our assessment system provides clear tracking of standards mastery to ensure students are meeting grade-level expectations.",
      value: "item-3",
   },
   {
      question:
         "Can teachers customize the platform for their classroom needs?",
      answer:
         "Absolutely! Teachers can customize learning paths, create their own content, modify existing lessons, adjust assessment parameters, and design specialized intervention programs. Our platform provides tools for creating differentiated instruction while maintaining alignment with curriculum standards.",
      value: "item-4",
   },
   {
      question:
         "How does the platform handle student data privacy and security?",
      answer:
         "We maintain strict FERPA and COPPA compliance, with enterprise-grade security measures including end-to-end encryption, secure authentication, and regular security audits. Student data is never sold or shared with third parties, and parents/administrators have complete visibility into data collection practices.",
      value: "item-5",
   },
   {
      question: "What support resources are available for implementation?",
      answer:
         "We provide comprehensive support including dedicated implementation specialists, professional development workshops, instructional coaching, 24/7 technical support, and an extensive resource library. Our onboarding process ensures smooth integration with existing school systems and training for all stakeholders.",
      value: "item-6",
   },
];

export const FAQSection = () => {
   return (
      <section
         id="faq"
         className="bg-blue-50 py-24 sm:py-32"
      >
         <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-12">
               <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg mb-6">
                  <HelpCircle className="text-white h-6 w-6" />
               </div>
               <h2 className="text-lg text-blue-600 text-center mb-2 tracking-wider font-medium">
                  FREQUENTLY ASKED QUESTIONS
               </h2>
               <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-gray-900">
                  Have Questions? We&apos;re Here to Help
               </h2>
               <h3 className="md:w-3/4 lg:w-2/3 mx-auto text-xl text-center text-gray-600 mb-8">
                  Get answers to commonly asked questions about Smart
                  Eduhub&apos;s features, implementation, and support.
               </h3>
            </div>

            <div className="w-full max-w-4xl mx-auto">
               <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
               >
                  {FAQList.map(({ question, answer, value }) => (
                     <AccordionItem
                        key={value}
                        value={value}
                        className="bg-white border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 rounded-lg"
                     >
                        <AccordionTrigger className="text-left px-6 py-5 text-gray-900 hover:text-blue-600 transition-colors font-medium">
                           {question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 px-6 pb-5 pt-2 leading-relaxed">
                           {answer}
                        </AccordionContent>
                     </AccordionItem>
                  ))}
               </Accordion>
            </div>
         </div>
      </section>
   );
};
