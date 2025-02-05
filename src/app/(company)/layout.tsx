import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const CommonPagesLayout = ({ children }: { children: ReactNode }) => {
   return (
      <div>
         <Navbar />
         <div>{children}</div>
         <Footer />
      </div>
   );
};

export default CommonPagesLayout;
