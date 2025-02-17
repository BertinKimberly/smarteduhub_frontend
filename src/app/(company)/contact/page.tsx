import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FAQSection } from '@/components/home/faq';

export const ContactSection = () => {
  return (
    <div className="bg-[#F8F9FE] min-h-screen">
      {/* Hero Section */}
      <div className="bg-main text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Get in Touch</h1>
          <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
            Have questions about our courses or need support? We're here to help you achieve your educational goals.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="First Name" 
                  className="p-6 rounded-lg"
                />
                <Input 
                  placeholder="Last Name" 
                  className="p-6 rounded-lg"
                />
              </div>
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="p-6 rounded-lg"
              />
              <Input 
                placeholder="Subject" 
                className="p-6 rounded-lg"
              />
              <Textarea 
                placeholder="Your Message" 
                className="p-6 rounded-lg min-h-[150px]"
              />
              <Button className="bg-main rounded-full py-6 px-8 w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <CardContent className="p-0 flex items-start space-x-4">
                  <div className="bg-main/10 p-3 rounded-full">
                    <Mail className="text-main h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-gray-600">support@smarteduhub.com</p>
                    <p className="text-gray-600">info@smarteduhub.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0 flex items-start space-x-4">
                  <div className="bg-main/10 p-3 rounded-full">
                    <Phone className="text-main h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0 flex items-start space-x-4">
                  <div className="bg-main/10 p-3 rounded-full">
                    <MapPin className="text-main h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-gray-600">123 Education Street</p>
                    <p className="text-gray-600">New York, NY 10001</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0 flex items-start space-x-4">
                  <div className="bg-main/10 p-3 rounded-full">
                    <Clock className="text-main h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Working Hours</h3>
                    <p className="text-gray-600">Mon - Fri: 9:00 - 18:00</p>
                    <p className="text-gray-600">Sat: 10:00 - 14:00</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm mt-8">
             <FAQSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;