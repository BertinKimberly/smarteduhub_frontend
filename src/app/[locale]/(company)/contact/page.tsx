//@ts-nocheck
"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Send, Laptop, BookOpen, Book } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FAQSection } from "@/components/home/faq";

const ContactPage = () => {
   const t = useTranslations("contact");

   return (
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
         {/* Hero Section with Glassmorphism */}
         <div className="bg-gradient-to-r from-main to-indigo-600  text-white py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/1200/400')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            <div className="container mx-auto px-4 relative z-10">
               <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 tracking-tight">
                  {t("hero.title")}
               </h1>
               <p className="text-center text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light">
                  {t("hero.description")}
               </p>
            </div>
            <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-50"></div>
         </div>

         {/* Main Content */}
         <div className="container mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Contact Form */}
               <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                  <h2 className="text-2xl font-bold mb-8 text-gray-800">
                     {t("form.title")}
                  </h2>
                  <form className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">
                              {t("form.firstName")}
                           </label>
                           <Input
                              placeholder="John"
                              className="p-6 rounded-xl border-gray-200"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">
                              {t("form.lastName")}
                           </label>
                           <Input
                              placeholder="Doe"
                              className="p-6 rounded-xl border-gray-200"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                           {t("form.email")}
                        </label>
                        <Input
                           type="email"
                           placeholder="john@example.com"
                           className="p-6 rounded-xl border-gray-200"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                           {t("form.userType.label")}
                        </label>
                        <select className="w-full p-6 rounded-xl border-gray-200 bg-white">
                           <option value="">
                              {t("form.userType.placeholder")}
                           </option>
                           <option value="student">
                              {t("form.userType.student")}
                           </option>
                           <option value="parent">
                              {t("form.userType.parent")}
                           </option>
                           <option value="teacher">
                              {t("form.userType.teacher")}
                           </option>
                           <option value="administrator">
                              {t("form.userType.administrator")}
                           </option>
                           <option value="other">
                              {t("form.userType.other")}
                           </option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                           {t("form.subject")}
                        </label>
                        <Input
                           placeholder={t("form.subjectPlaceholder")}
                           className="p-6 rounded-xl border-gray-200"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                           {t("form.message")}
                        </label>
                        <Textarea
                           placeholder={t("form.messagePlaceholder")}
                           className="p-6 rounded-xl border-gray-200 min-h-[180px]"
                        />
                     </div>

                     <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl py-6 px-8 w-full md:w-auto transition-all duration-300 flex items-center justify-center gap-2 text-base">
                        {t("form.sendButton")}
                        <Send className="h-4 w-4" />
                     </Button>
                  </form>
               </div>

               {/* Contact Information */}
               <div className="lg:col-span-5 space-y-8">
                  <h2 className="text-2xl font-bold mb-8 text-gray-800">
                     {t("support.title")}
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                     <Card className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                        <CardContent className="p-0 flex items-start space-x-4">
                           <div className="bg-indigo-100 p-4 rounded-2xl">
                              <Mail className="text-indigo-600 h-6 w-6" />
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                 {t("support.email.title")}
                              </h3>
                              <p className="text-gray-600 hover:text-indigo-600 transition-colors">
                                 support@smarteduhub.com
                              </p>
                              <p className="text-gray-600 hover:text-indigo-600 transition-colors">
                                 info@smarteduhub.com
                              </p>
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                        <CardContent className="p-0 flex items-start space-x-4">
                           <div className="bg-purple-100 p-4 rounded-2xl">
                              <Phone className="text-purple-600 h-6 w-6" />
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                 {t("support.phone.title")}
                              </h3>
                              <p className="text-gray-600">+1 (555) 123-4567</p>
                              <p className="text-gray-600 text-sm mt-1">
                                 {t("support.phone.hours")}
                              </p>
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                        <CardContent className="p-0 flex items-start space-x-4">
                           <div className="bg-blue-100 p-4 rounded-2xl">
                              <Laptop className="text-blue-600 h-6 w-6" />
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                 {t("support.chat.title")}
                              </h3>
                              <p className="text-gray-600">
                                 {t("support.chat.description")}
                              </p>
                              <p className="text-gray-600 text-sm mt-1">
                                 {t("support.chat.availability")}
                              </p>
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                        <CardContent className="p-0 flex items-start space-x-4">
                           <div className="bg-pink-100 p-4 rounded-2xl">
                              <BookOpen className="text-pink-600 h-6 w-6" />
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                 {t("support.knowledge.title")}
                              </h3>
                              <p className="text-gray-600">
                                 {t("support.knowledge.description")}
                              </p>
                              <p className="text-gray-600 text-sm mt-1">
                                 <a
                                    href="#"
                                    className="text-indigo-600 hover:underline"
                                 >
                                    {t("support.knowledge.link")}
                                 </a>
                              </p>
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Platform Features Summary */}
                  <Card className="mt-8 rounded-2xl overflow-hidden shadow-lg bg-white p-6 border-0">
                     <h3 className="font-bold text-xl mb-4 text-gray-800">
                        {t("platform.title")}
                     </h3>
                     <div className="space-y-3">
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Book className="h-4 w-4 text-green-600" />
                           </div>
                           <p className="text-gray-700">
                              {t("platform.features.learning")}
                           </p>
                        </div>
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Book className="h-4 w-4 text-green-600" />
                           </div>
                           <p className="text-gray-700">
                              {t("platform.features.tracking")}
                           </p>
                        </div>
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Book className="h-4 w-4 text-green-600" />
                           </div>
                           <p className="text-gray-700">
                              {t("platform.features.access")}
                           </p>
                        </div>
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Book className="h-4 w-4 text-green-600" />
                           </div>
                           <p className="text-gray-700">
                              {t("platform.features.tools")}
                           </p>
                        </div>
                     </div>
                  </Card>
               </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-10 rounded-3xl shadow-lg mt-16 border border-gray-100">
               <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                  {t("faq.title")}
               </h2>
               <FAQSection />
            </div>
         </div>
      </div>
   );
};

export default ContactPage;
