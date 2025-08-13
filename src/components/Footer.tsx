"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/images/logo.svg";
import {
   Facebook,
   Instagram,
   Twitter,
   ArrowRight,
   Mail,
   MapPin,
   Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FooterLink {
   title: string;
   href: string;
}

interface FooterSection {
   id: number;
   title: string;
   links: FooterLink[];
}

interface SocialLink {
   icon: React.ReactNode;
   href: string;
   label: string;
}

const socialLinks: SocialLink[] = [
   {
      icon: <Facebook size={18} />,
      href: "https://www.facebook.com",
      label: "Facebook",
   },
   {
      icon: <Instagram size={18} />,
      href: "https://www.instagram.com",
      label: "Instagram",
   },
   {
      icon: <Twitter size={18} />,
      href: "https://www.twitter.com",
      label: "Twitter",
   },
];

const footerSections: FooterSection[] = [
   {
      id: 1,
      title: "Platform",
      links: [
         { title: "For Students", href: "/" },
         { title: "For Teachers", href: "/" },
         { title: "For Parents", href: "/" },
         { title: "For Institutions", href: "/" },
         { title: "Pricing", href: "/" },
      ],
   },
   {
      id: 2,
      title: "Company",
      links: [
         { title: "About Us", href: "/" },
         { title: "Careers", href: "/" },
         { title: "Blog", href: "/" },
         { title: "Press", href: "/" },
         { title: "Contact", href: "/" },
      ],
   },
   {
      id: 3,
      title: "Resources",
      links: [
         { title: "Help Center", href: "/" },
         { title: "Community", href: "/" },
         { title: "Webinars", href: "/" },
         { title: "Partners", href: "/" },
         { title: "Developers", href: "/" },
      ],
   },
];

const Footer = () => {
   const currentYear = new Date().getFullYear();

   return (
      <footer className="relative bg-gradient-to-br from-main via-indigo-500 to-indigo-700 pt-20 overflow-hidden">
         {/* Background decoration elements */}
         <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-40 right-40 w-80 h-80 bg-indigo-400 rounded-full filter blur-3xl opacity-5"></div>
            <div className="absolute bottom-40 left-40 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-5"></div>
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-indigo-800/30">
               {/* Brand column */}
               <div className="lg:col-span-4 space-y-6">
                  <Link
                     href="/"
                     className="inline-flex items-center"
                  >
                     <div className="bg-white p-2 rounded-lg">
                        <Image
                           src={Logo}
                           alt="Smart Eduhub Logo"
                           className="h-8 w-auto"
                        />
                     </div>
                     <span className="ml-3 text-xl font-bold text-white">
                        Smart Eduhub
                     </span>
                  </Link>

                  <p className="text-indigo-200">
                     Revolutionize your learning journey with our AI-powered
                     platform that adapts to your unique pace and style.
                  </p>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-indigo-400" />
                        <span className="text-indigo-200">
                           123 Education Ave, Learning City
                        </span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-indigo-400" />
                        <span className="text-indigo-200">
                           contact@smarteduhub.com
                        </span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-indigo-400" />
                        <span className="text-indigo-200">
                           +1 (555) 123-4567
                        </span>
                     </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                     {socialLinks.map((item, i) => (
                        <Link
                           key={i}
                           href={item.href}
                           aria-label={item.label}
                           className="bg-indigo-800/50 hover:bg-indigo-700 transition-colors h-10 w-10 rounded-full flex items-center justify-center text-indigo-200 hover:text-white"
                        >
                           {item.icon}
                        </Link>
                     ))}
                  </div>
               </div>

               {/* Links columns */}
               <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {footerSections.map((section) => (
                     <div key={section.id}>
                        <h3 className="text-white font-semibold mb-6">
                           {section.title}
                        </h3>
                        <ul className="space-y-4">
                           {section.links.map((link, index) => (
                              <li key={index}>
                                 <Link
                                    href={link.href}
                                    className="text-indigo-200 hover:text-white hover:underline transition-colors inline-flex items-center"
                                 >
                                    {link.title}
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>

               {/* Newsletter column */}
               <div className="lg:col-span-3 space-y-6">
                  <h3 className="text-white font-semibold">
                     Subscribe to our newsletter
                  </h3>
                  <p className="text-indigo-200">
                     Stay updated with the latest features, educational tips,
                     and special offers.
                  </p>

                  <div className="space-y-3">
                     <div className="relative">
                        <Input
                           type="email"
                           placeholder="Your email address"
                           className="bg-indigo-800/30 border-indigo-700 text-white placeholder:text-indigo-300 py-6 pr-12"
                        />
                        <Button
                           className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500"
                           size="sm"
                        >
                           <ArrowRight className="h-4 w-4" />
                        </Button>
                     </div>
                     <p className="text-xs text-indigo-300">
                        By subscribing, you agree to our Privacy Policy and
                        consent to receive updates.
                     </p>
                  </div>
               </div>
            </div>

            {/* Copyright section */}
            <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
               <p className="text-indigo-300 text-sm">
                  © {currentYear} Smart Eduhub. All rights reserved.
               </p>

               <div className="flex items-center divide-x divide-indigo-700">
                  <Link
                     href="/"
                     className="text-indigo-300 hover:text-white text-sm px-4 transition-colors"
                  >
                     Privacy Policy
                  </Link>
                  <Link
                     href="/"
                     className="text-indigo-300 hover:text-white text-sm px-4 transition-colors"
                  >
                     Terms of Service
                  </Link>
                  <Link
                     href="/"
                     className="text-indigo-300 hover:text-white text-sm px-4 transition-colors"
                  >
                     Cookie Settings
                  </Link>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
