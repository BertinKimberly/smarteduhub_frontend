"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-b from-white via-background to-submain min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-main to-indigo-600 p-1" />
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-main/10 p-6 rounded-full">
                  <Search className="h-12 w-12 text-main" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
              <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-8">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
                Let&apos;s get you back on track with your learning journey.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      <div className="bg-main/10 p-2 rounded-full mr-4">
                        <BookOpen className="h-5 w-5 text-main" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">Browse Courses</h3>
                        <p className="text-sm text-gray-500">Explore our catalog</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      <div className="bg-main/10 p-2 rounded-full mr-4">
                        <Search className="h-5 w-5 text-main" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">Search</h3>
                        <p className="text-sm text-gray-500">Find what you need</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="bg-main hover:bg-indigo-700 text-white rounded-full py-6 px-8 w-full sm:w-auto">
                    <Home className="mr-2 h-4 w-4" /> Go to Homepage
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-main text-main hover:bg-main/10 rounded-full py-6 px-8 bg-transparent w-full sm:w-auto"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? <Link href="/contact" className="text-main hover:underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default NotFound;