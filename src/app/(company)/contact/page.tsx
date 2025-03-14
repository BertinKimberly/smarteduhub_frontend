import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Send, Laptop, BookOpen, Book } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FAQSection } from "@/components/home/faq";

const ContactPage = () => {
   return (
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
         {/* Hero Section with Glassmorphism */}
         <div className="bg-gradient-to-r from-main to-indigo-600 text-white py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/1200/400')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            <div className="container mx-auto px-4 relative z-10">
               <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 tracking-tight">
                  Get in Touch
               </h1>
               <p className="text-center text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light">
                  Have questions about our AI-driven learning platform or need
                  support? We&apos;re here to help you achieve your educational
                  goals.
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
                     Send us a Message
                  </h2>
                  <form className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">
                              First Name
                           </label>
                           <Input
                              placeholder="John"
                              className="p-6 rounded-xl border-gray-200"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">
                              Last Name
                           </label>
                           <Input
                              placeholder="Doe"
                              className="p-6 rounded-xl border-gray-200"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                           Email Address
                        </label>
                        <Input
                           type="email"
                           placeholder="john@example.com"
                           className="p-6 rounded-xl border-gray-200"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                           User Type
                        </label>
                        <select className="w-full p-6 rounded-xl border-gray-200 bg-white">
                           <option value="">Select your role</option>
                           <option value="student">Student</option>
                           <option value="parent">Parent</option>
                           <option value="teacher">Teacher</option>
                           <option value="administrator">Administrator</option>
                           <option value="other">Other</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                           Subject
                        </label>
                        <Input
                           placeholder="How can we help you with Smart EduHub?"
                           className="p-6 rounded-xl border-gray-200"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                           Your Message
                        </label>
                        <Textarea
                           placeholder="Please describe your query about our AI learning platform in detail..."
                           className="p-6 rounded-xl border-gray-200 min-h-[180px]"
                        />
                     </div>

                     <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl py-6 px-8 w-full md:w-auto transition-all duration-300 flex items-center justify-center gap-2 text-base">
                        Send Message
                        <Send className="h-4 w-4" />
                     </Button>
                  </form>
               </div>

               {/* Contact Information */}
               <div className="lg:col-span-5 space-y-8">
                  <h2 className="text-2xl font-bold mb-8 text-gray-800">
                     Platform Support
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                     <Card className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                        <CardContent className="p-0 flex items-start space-x-4">
                           <div className="bg-indigo-100 p-4 rounded-2xl">
                              <Mail className="text-indigo-600 h-6 w-6" />
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                                 Email Support
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
                                 Phone Support
                              </h3>
                              <p className="text-gray-600">+1 (555) 123-4567</p>
                              <p className="text-gray-600 text-sm mt-1">
                                 Available Mon-Fri: 9:00 - 18:00 ET
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
                                 Live Chat
                              </h3>
                              <p className="text-gray-600">
                                 Connect with our support team in real-time
                                 through the platform
                              </p>
                              <p className="text-gray-600 text-sm mt-1">
                                 24/7 AI assistance available
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
                                 Knowledge Base
                              </h3>
                              <p className="text-gray-600">
                                 Browse our comprehensive guides and tutorials
                              </p>
                              <p className="text-gray-600 text-sm mt-1">
                                 <a
                                    href="#"
                                    className="text-indigo-600 hover:underline"
                                 >
                                    Visit our Help Center →
                                 </a>
                              </p>
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Platform Features Summary */}
                  <Card className="mt-8 rounded-2xl overflow-hidden shadow-lg bg-white p-6 border-0">
                     <h3 className="font-bold text-xl mb-4 text-gray-800">
                        Smart EduHub Platform
                     </h3>
                     <div className="space-y-3">
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Book className="h-4 w-4 text-green-600" />
                           </div>
                           <p className="text-gray-700">
                              Personalized AI Learning Paths
                           </p>
                        </div>
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Book className="h-4 w-4 text-green-600" />
                           </div>
                           <p className="text-gray-700">
                              Real-time Progress Tracking
                           </p>
                        </div>
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Book className="h-4 w-4 text-green-600" />
                           </div>
                           <p className="text-gray-700">
                              Multi-role Access for Students, Parents & Teachers
                           </p>
                        </div>
                        <div className="flex items-center">
                           <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Book className="h-4 w-4 text-green-600" />
                           </div>
                           <p className="text-gray-700">
                              Comprehensive Administration Tools
                           </p>
                        </div>
                     </div>
                  </Card>
               </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-10 rounded-3xl shadow-lg mt-16 border border-gray-100">
               <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                  Frequently Asked Questions
               </h2>
               <FAQSection />
            </div>
         </div>
      </div>
   );
};

export default ContactPage;
