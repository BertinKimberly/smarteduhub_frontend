import React from "react";
import {
   ArrowLeft,
   MessageCircle,
   ThumbsUp,
   ThumbsDown,
   Share,
   Bookmark,
   Calendar,
   Clock,
   FileText,
   Shield,
   User,
   Search,
   HelpCircle,
} from "lucide-react";
import Link from "next/link";

const HelpCenterDetail = () => {
   // This is placeholder data for a sample help article
   const article = {
      id: 1,
      title: "How do I reset my password?",
      lastUpdated: "February 15, 2025",
      readTime: "3 min read",
      category: "Account Management",
      icon: Shield,
      description:
         "A comprehensive guide to resetting your password and keeping your account secure.",
      content: [
         {
            type: "paragraph",
            text: "Resetting your password on Smart Eduhub is a simple process designed to help you regain access to your account while maintaining security. Whether you've forgotten your password or simply want to update it for security reasons, follow the steps below.",
         },
         {
            type: "heading",
            text: "Method 1: Reset from the Login Screen",
         },
         {
            type: "steps",
            items: [
               "Go to the Smart Eduhub login page",
               "Click on the 'Forgot Password?' link below the login form",
               "Enter the email address associated with your account",
               "Check your email for a password reset link",
               "Click the link and follow the instructions to create a new password",
            ],
         },
         {
            type: "note",
            text: "The password reset link will expire after 24 hours for security reasons. If you don't use it within that timeframe, you'll need to request a new one.",
         },
         {
            type: "heading",
            text: "Method 2: Reset from Account Settings",
         },
         {
            type: "steps",
            items: [
               "Log in to your Smart Eduhub account",
               "Click on your profile icon in the top right corner",
               "Select 'Settings' from the dropdown menu",
               "Navigate to the 'Security' tab",
               "Click on 'Change Password'",
               "Enter your current password and then your new desired password twice",
               "Click 'Save Changes' to update your password",
            ],
         },
         {
            type: "heading",
            text: "Password Requirements",
         },
         {
            type: "paragraph",
            text: "To ensure your account remains secure, your password must meet the following requirements:",
         },
         {
            type: "list",
            items: [
               "At least 8 characters long",
               "Contains at least one uppercase letter",
               "Contains at least one lowercase letter",
               "Contains at least one number",
               "Contains at least one special character (e.g., !@#$%^&*)",
            ],
         },
         {
            type: "heading",
            text: "Troubleshooting Password Reset Issues",
         },
         {
            type: "paragraph",
            text: "If you're experiencing difficulties with the password reset process, here are some common solutions:",
         },
         {
            type: "list",
            items: [
               "Check your spam or junk folder for the reset email",
               "Ensure you're using the correct email address associated with your account",
               "Try using a different browser or clearing your cache",
               "If you still don't receive the email after 15 minutes, try requesting a new reset link",
            ],
         },
         {
            type: "tip",
            text: "For security reasons, we recommend changing your password regularly, about every 3-6 months, and avoid reusing passwords across different websites and services.",
         },
      ],
      relatedArticles: [
         "How to update your email address",
         "Two-factor authentication setup guide",
         "Account security best practices",
      ],
      helpful: 289,
      notHelpful: 14,
   };

   return (
      <div className="py-10 bg-gray-50 min-h-screen">
         <div className="container mx-auto px-4">
            {/* Navigation */}
            <div className="mb-6">
               <Link
                  href="/help-center"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
               >
                  <ArrowLeft
                     size={18}
                     className="mr-2"
                  />
                  Back to Help Center
               </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Main Content */}
               <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                     {/* Article Header */}
                     <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="bg-blue-50 p-2 rounded-lg">
                              <article.icon
                                 className="text-blue-600"
                                 size={24}
                              />
                           </div>
                           <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              {article.category}
                           </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                           {article.title}
                        </h1>
                        <p className="text-gray-600 text-lg mb-4">
                           {article.description}
                        </p>

                        <div className="flex items-center text-sm text-gray-500 gap-4">
                           <div className="flex items-center">
                              <Calendar
                                 size={16}
                                 className="mr-1"
                              />
                              Last updated: {article.lastUpdated}
                           </div>
                           <div className="flex items-center">
                              <Clock
                                 size={16}
                                 className="mr-1"
                              />
                              {article.readTime}
                           </div>
                        </div>
                     </div>

                     {/* Article Content */}
                     <div className="prose max-w-none">
                        {article.content.map((section, index) => (
                           <div
                              key={index}
                              className="mb-6"
                           >
                              {section.type === "paragraph" && (
                                 <p className="text-gray-700 leading-relaxed">
                                    {section.text}
                                 </p>
                              )}

                              {section.type === "heading" && (
                                 <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
                                    {section.text}
                                 </h2>
                              )}

                              {section.type === "steps" && (
                                 <ol className="list-decimal pl-6 space-y-2">
                                    {section.items?.map((item, i) => (
                                       <li
                                          key={i}
                                          className="text-gray-700 pl-2"
                                       >
                                          {item}
                                       </li>
                                    ))}
                                 </ol>
                              )}

                              {section.type === "list" && (
                                 <ul className="list-disc pl-6 space-y-2">
                                    {section.items?.map((item, i) => (
                                       <li
                                          key={i}
                                          className="text-gray-700 pl-2"
                                       >
                                          {item}
                                       </li>
                                    ))}
                                 </ul>
                              )}

                              {section.type === "note" && (
                                 <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <p className="text-blue-800">
                                       {section.text}
                                    </p>
                                 </div>
                              )}

                              {section.type === "tip" && (
                                 <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                                    <h3 className="font-semibold text-green-800 mb-1">
                                       Tip
                                    </h3>
                                    <p className="text-green-800">
                                       {section.text}
                                    </p>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>

                     {/* Article Footer */}
                     <div className="mt-12 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                           Was this article helpful?
                        </h3>
                        <div className="flex items-center gap-4">
                           <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                              <ThumbsUp size={18} />
                              Yes ({article.helpful})
                           </button>
                           <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                              <ThumbsDown size={18} />
                              No ({article.notHelpful})
                           </button>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                           <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <Share size={18} />
                              Share
                           </button>
                           <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <Bookmark size={18} />
                              Save
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Sidebar */}
               <div className="lg:col-span-1">
                  {/* Search */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                     <div className="relative">
                        <Search
                           className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                           size={18}
                        />
                        <input
                           type="text"
                           placeholder="Search help articles..."
                           className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-500/30"
                        />
                     </div>
                  </div>

                  {/* Related Articles */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Related Articles
                     </h3>
                     <ul className="space-y-3">
                        {article.relatedArticles.map((title, index) => (
                           <li key={index}>
                              <Link
                                 href={`/help-center/details/${index + 2}`}
                                 className="flex items-start gap-2 text-blue-600 hover:text-blue-800"
                              >
                                 <FileText
                                    size={18}
                                    className="mt-0.5 flex-shrink-0"
                                 />
                                 <span>{title}</span>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-gradient-to-r from-main to-indigo-600 rounded-xl shadow-md p-6 text-white">
                     <div className="flex flex-col items-center text-center">
                        <div className="bg-white/20 p-3 rounded-full mb-4">
                           <HelpCircle size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                           Still need help?
                        </h3>
                        <p className="opacity-90 mb-4">
                           Our support team is ready to assist you with any
                           questions.
                        </p>
                        <Link
                           href="/contact"
                           className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
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
            </div>
         </div>
      </div>
   );
};

export default HelpCenterDetail;
