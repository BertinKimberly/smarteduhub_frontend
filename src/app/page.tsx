import Footer from "@/components/Footer";
import { BenefitsSection } from "@/components/home/benefits";
import { ContactSection } from "@/components/home/contact";
import CoursesSlide from "@/components/home/CoursesSlide";
import { FAQSection } from "@/components/home/faq";
import { FeaturesSection } from "@/components/home/features";
import { HeroSection } from "@/components/home/hero";
import { TestimonialSection } from "@/components/home/testimonial";
import Navbar from "@/components/Navbar";
import React from "react";

const Home = () => {
   return <div>
      <Navbar/>
      <HeroSection/>
      <CoursesSlide/>
      <BenefitsSection/>
      <FeaturesSection/>
      <TestimonialSection/>
      <ContactSection/>
      <FAQSection/>
      <Footer/>
   </div>;
};

export default Home;
