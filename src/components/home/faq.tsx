import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How do I get started with Smart Eduhub?",
    answer: "Getting started is easy! Simply create an account, browse our course catalog, and enroll in any course that interests you. Our platform provides immediate access to course materials once enrolled.",
    value: "item-1",
  },
  {
    question: "What types of courses do you offer?",
    answer: "We offer a wide range of courses across different categories including Technology, Business, Design, Marketing, and Personal Development. Our courses are designed for both beginners and advanced learners.",
    value: "item-2",
  },
  {
    question: "Are the certificates recognized by employers?",
    answer: "Yes, our certificates are industry-recognized. They demonstrate your commitment to professional development and the specific skills you've acquired through our courses.",
    value: "item-3",
  },
  {
    question: "Can I access the courses on mobile devices?",
    answer: "Absolutely! Our platform is fully responsive and works seamlessly across all devices - desktop, tablet, and mobile. You can learn anywhere, anytime.",
    value: "item-4",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers. We also offer flexible payment plans for select courses to make education more accessible.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-main/10 p-3 rounded-full mb-4">
          <HelpCircle className="text-main h-6 w-6" />
        </div>
        <h2 className="text-lg text-main font-medium mb-2 tracking-wider">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <h3 className="text-2xl font-bold text-gray-900">
          Have Questions? We're Here to Help
        </h3>
      </div>

      <Accordion 
        type="single" 
        collapsible 
        className="w-full space-y-4"
      >
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem 
            key={value} 
            value={value}
            className="bg-white border border-gray-200 rounded-lg px-4"
          >
            <AccordionTrigger className="text-left py-4 text-gray-900 hover:text-main transition-colors">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};