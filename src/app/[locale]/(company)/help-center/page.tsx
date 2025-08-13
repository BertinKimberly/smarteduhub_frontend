"use client";
import React, { useState } from "react";
import {
   Search,
   MessageCircle,
   FileText,
   Users,
   Shield,
   HelpCircle,
   BookOpen,
   MonitorSmartphone,
   Globe,
   Settings,
   Calendar,
   Video,
   ArrowRight,
   TrendingUp,
   Award,
   Zap,
} from "lucide-react";
import Link from "next/link";

const HelpCenter = () => {
   const [searchQuery, setSearchQuery] = useState("");

   const faqs = [
      {
         question: "How do I reset my password?",
         answer:
            "Go to settings, click on 'Change Password', and follow the steps.",
         icon: Shield,
      },
      {
         question: "How can I contact support?",
         answer: "Use the chat feature or email us at support@smarteduhub.com.",
         icon: MessageCircle,
      },
      {
         question: "Where can I find my assignments?",
         answer: "Check the 'My Courses' section for all your assignments.",
         icon: FileText,
      },
      {
         question: "How do I enroll in a course?",
         answer: "Browse available courses and click 'Enroll' to get started.",
         icon: Users,
      },
      {
         question: "Can I access courses on my mobile?",
         answer: "Yes, Smart Eduhub is fully mobile-friendly!",
         icon: MonitorSmartphone,
      },
      {
         question: "Are there international courses available?",
         answer: "Yes! We offer courses from educators around the world.",
         icon: Globe,
      },
      {
         question: "How do I update my profile?",
         answer: "Go to account settings and update your profile details.",
         icon: Settings,
      },
      {
         question: "How do I schedule study sessions?",
         answer: "Use the in-app calendar feature to set up study reminders.",
         icon: Calendar,
      },
      {
         question: "Are there video tutorials available?",
         answer:
            "Yes, check the 'Learning Resources' section for video tutorials.",
         icon: Video,
      },
   ];

   const popularTopics = [
      { title: "Getting Started Guide", icon: BookOpen, color: "bg-blue-100" },
      { title: "Student Success Stories", icon: Award, color: "bg-green-100" },
      { title: "Latest Features", icon: Zap, color: "bg-purple-100" },
      {
         title: "Learning Tips & Tricks",
         icon: TrendingUp,
         color: "bg-orange-100",
      },
   ];

   return (
      <div className="py-10 bg-gray-50 min-h-screen">
         <div className="w-full space-y-8 container mx-auto px-4">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 rounded-2xl shadow-lg text-white">
               <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Welcome to the Help Center
               </h1>
               <p className="text-lg opacity-90 max-w-2xl mb-6">
                  Find answers, explore resources, and get the support you need
                  to make the most of your learning journey.
               </p>
               <div className="relative mt-4 max-w-2xl">
                  <Search
                     className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                     size={20}
                  />
                  <input
                     type="text"
                     placeholder="Search for help..."
                     className="w-full pl-12 pr-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-white/50 text-gray-800 text-lg shadow-md"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </div>

            {/* Popular Topics */}
            <div className="mb-8">
               <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Popular Topics
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {popularTopics.map((topic, index) => (
                     <div
                        key={index}
                        className={`${topic.color} p-4 rounded-xl hover:shadow-md transition-all cursor-pointer`}
                     >
                        <div className="flex items-center gap-3">
                           <topic.icon
                              className="text-gray-800"
                              size={24}
                           />
                           <h3 className="font-medium text-gray-800">
                              {topic.title}
                           </h3>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* FAQ Cards */}
            <div>
               <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Frequently Asked Questions
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faqs.map((faq, index) => (
                     <div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex gap-4 items-start group"
                     >
                        <div className="bg-blue-50 p-2 rounded-lg">
                           <faq.icon
                              className="text-blue-600 group-hover:text-blue-700 transition-colors"
                              size={24}
                           />
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-800">
                              {faq.question}
                           </h3>
                           <p className="text-gray-600 mt-1">{faq.answer}</p>
                           <Link
                              href={`/help-center/details/${index}`}
                              className="text-blue-600 inline-flex items-center mt-2 text-sm font-medium hover:text-blue-700"
                           >
                              Learn more{" "}
                              <ArrowRight
                                 size={16}
                                 className="ml-1"
                              />
                           </Link>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Need More Help Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-blue-50 p-4 rounded-full">
                     <HelpCircle
                        className="text-blue-600"
                        size={36}
                     />
                  </div>
                  <div className="text-center md:text-left">
                     <h3 className="text-2xl font-bold text-gray-800">
                        Need More Help?
                     </h3>
                     <p className="text-gray-600 text-lg">
                        Our support team is ready to assist with personalized
                        guidance.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 ml-auto">
                     <Link
                        className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 font-medium transition-colors text-center"
                        href="/help/faq"
                     >
                        Browse All FAQs
                     </Link>
                     <Link
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center"
                        href="/contact"
                     >
                        <MessageCircle
                           size={18}
                           className="mr-2"
                        />
                        Contact Support
                     </Link>
                  </div>
               </div>
            </div>

            {/* Video Tutorials */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                     Video Tutorials
                  </h2>
                  <Link
                     href="/help/videos"
                     className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                     View all{" "}
                     <ArrowRight
                        size={16}
                        className="ml-1"
                     />
                  </Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                     <div
                        key={item}
                        className="bg-gray-100 rounded-lg p-4 aspect-video flex items-center justify-center relative cursor-pointer hover:bg-gray-200 transition-colors"
                     >
                        <Video
                           size={40}
                           className="text-gray-700"
                        />
                        <div className="absolute bottom-4 left-4">
                           <h3 className="font-medium text-gray-800">
                              Quick Start Tutorial {item}
                           </h3>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default HelpCenter;
