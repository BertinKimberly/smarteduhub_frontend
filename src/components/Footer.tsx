import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Logo from "@/images/logo.svg";

interface ProductType {
   id: number;
   section: string;
   link: string[];
}

interface socialLinks {
   icon: React.ReactNode;
   link: string;
}

const socialLinks: socialLinks[] = [
   {
      icon: <Facebook size={14} />,
      link: "www.facebook.com",
   },
   {
      icon: <Instagram size={14} />,
      link: "www.instagram.com",
   },
   {
      icon: <Twitter size={14} />,
      link: "www.twitter.com",
   },
];

const products: ProductType[] = [
   {
      id: 1,
      section: "Company",
      link: ["About", "Careers", "Mobile", "Blog", "How we work?"],
   },
   {
      id: 2,
      section: "Contact",
      link: ["Help/FAQ", "Press", "Affiliates", "Hotel owners", "Partners"],
   },
   {
      id: 3,
      section: "More",
      link: [
         "Airline fees",
         "Airlines",
         "Low fare tips",
         "Badges &",
         "Certificates",
      ],
   },
];

const footer = () => {
   const currentYear = new Date().getFullYear();

   return (
      <div className="bg-submain mt-8">
         <div className="mx-auto max-w-2xl sm:pt-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8 ">
            <div className="my-12 grid grid-cols-1 gap-y-10 sm:grid-cols-6 lg:grid-cols-12">
               {/* COLUMN-1 */}

               <div className="sm:col-span-6 lg:col-span-5">
                  <div className="flex flex-shrink-0 items-center border-right">
                     <Link
                        className="flex gap-1 items-center justify-center"
                        href="/"
                     >
                        <Image
                           src={Logo}
                           alt="Logo"
                        />
                        <p className="font-bold text-main ">Smart Eduhub</p>
                     </Link>
                  </div>
                  <h3 className="text-xs font-medium text-gunmetalgray lh-160 mt-5 mb-4 lg:mb-16">
                     {" "}
                     Open an account in minutes, get full financial <br />{" "}
                     control for much longer.
                  </h3>
                  <div className="flex gap-4">
                     {socialLinks.map((items, i) => (
                        <Link
                           href={items.link}
                           key={i}
                        >
                           <div className="bg-white h-12 w-12 shadow-xl text-base rounded-full flex items-center justify-center footer-icons hover:bg-ultramarine">
                              {items.icon}
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>

               {/* CLOUMN-2/3/4 */}

               {products.map((product) => (
                  <div
                     key={product.id}
                     className="sm:col-span-2"
                  >
                     <p className="text-black text-lg font-medium mb-9">
                        {product.section}
                     </p>
                     <ul>
                        {product.link.map((link: string, index: number) => (
                           <li
                              key={index}
                              className="mb-5"
                           >
                              <Link
                                 href="/"
                                 className="text-darkgray text-base font-normal mb-6 space-links"
                              >
                                 {link}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>

            {/* All Rights Reserved */}

            <div className="py-10 md:flex items-center justify-between border-t border-t-gray-blue">
               <h4 className="text-dark-red opacity-75 text-sm text-center md:text-start font-normal">
                  @{currentYear}.Smart Eduhub.All rights reserved
               </h4>
               <div className="flex gap-5 mt-5 md:mt-0 justify-center md:justify-start">
                  <h4 className="text-dark-red opacity-75 text-sm font-normal">
                     <Link
                        href="/"
                        target="_blank"
                     >
                        Privacy policy
                     </Link>
                  </h4>
                  <div className="h-5 bg-dark-red opacity-25 w-0.5"></div>
                  <h4 className="text-dark-red opacity-75 text-sm font-normal">
                     <Link
                        href="/"
                        target="_blank"
                     >
                        Terms & conditions
                     </Link>
                  </h4>
               </div>
            </div>
         </div>
      </div>
   );
};

export default footer;



