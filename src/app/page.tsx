import Footer from "@/components/Footer";
import { BenefitsSection } from "@/components/home/benefits";
import { CommunitySection } from "@/components/home/community";
import { ContactSection } from "@/components/home/contact";
import { FAQSection } from "@/components/home/faq";
import { FeaturesSection } from "@/components/home/features";
import { TestimonialSection } from "@/components/home/testimonial";
import Navbar from "@/components/Navbar";
import React from "react";

const Home = () => {
   return <div>
      <Navbar/>
      <BenefitsSection/>
      <FeaturesSection/>
      <TestimonialSection/>
      {/* <CommunitySection/> */}
      <ContactSection/>
      <FAQSection/>
      <Footer/>
   </div>;
};

export default Home;
