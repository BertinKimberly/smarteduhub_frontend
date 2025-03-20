"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
   image: string;
   name: string;
   userName: string;
   comment: string;
   rating: number;
}

const reviewList: ReviewProps[] = [
   {
      image: "/api/placeholder/40/40",
      name: "Sarah Johnson",
      userName: "High School Teacher",
      comment:
         "Smart Eduhub has transformed my classroom. The AI-powered learning adapts to each student's needs, and the analytics give me insights I never had before. My students' test scores have improved by 23% this semester!",
      rating: 5.0,
   },
   {
      image: "/api/placeholder/40/40",
      name: "Michael Rodriguez",
      userName: "Parent of 2",
      comment:
         "As a working parent, I appreciate how the flexible scheduling allows my children to learn at their own pace. The detailed reports help me stay involved in their education even with my busy schedule.",
      rating: 4.8,
   },
   {
      image: "/api/placeholder/40/40",
      name: "Dr. Emily Chen",
      userName: "School District Director",
      comment:
         "Implementing Smart Eduhub across our district has been the best decision we've made. The curriculum alignment ensures all students receive standardized education, while the personalization addresses individual learning styles.",
      rating: 4.9,
   },
   {
      image: "/api/placeholder/40/40",
      name: "James Wilson",
      userName: "High School Student",
      comment:
         "I used to struggle with math, but the instant feedback system helped me understand where I was going wrong. The personalized practice problems built my confidence, and I improved my grade from a C to an A-.",
      rating: 5.0,
   },
   {
      image: "/api/placeholder/40/40",
      name: "Dr. Olivia Thompson",
      userName: "Education Researcher",
      comment:
         "The data analytics from Smart Eduhub have been invaluable for our research on adaptive learning. We can now quantify the impact of personalized education in ways that weren't possible before this platform existed.",
      rating: 5.0,
   },
   {
      image: "/api/placeholder/40/40",
      name: "Principal Robert Garcia",
      userName: "Elementary School Administrator",
      comment:
         "Smart Eduhub has streamlined our administrative processes while providing teachers with powerful tools to support student learning. The multi-role platform meets everyone's needs in one integrated system.",
      rating: 4.9,
   },
];

export const TestimonialSection = () => {
   return (
      <section
         id="testimonials"
         className="bg-white py-24 sm:py-32"
      >
         <div className="container mx-auto px-4">
            <h2 className="text-lg text-blue-600 text-center mb-2 tracking-wider font-medium">
               Testimonials
            </h2>

            <h2 className="text-3xl md:text-4xl text-center font-bold mb-4 text-gray-900">
               Success Stories from Our Community
            </h2>

            <h3 className="md:w-3/4 lg:w-2/3 mx-auto text-xl text-center text-gray-600 mb-12">
               Join over 1,000 schools and 50,000+ students who are experiencing
               the transformative power of personalized education.
            </h3>

            <Carousel
               opts={{
                  align: "start",
               }}
               className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
            >
               <CarouselContent>
                  {reviewList.map((review) => (
                     <CarouselItem
                        key={review.name}
                        className="md:basis-1/2 lg:basis-1/3"
                     >
                        <Card className="h-full bg-blue-50 border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                           <CardContent className="pt-6 pb-0">
                              <div className="flex gap-1 pb-6">
                                 {[...Array(5)].map((_, i) => (
                                    <Star
                                       key={i}
                                       className={`size-4 ${
                                          i < Math.floor(review.rating)
                                             ? "fill-blue-600 text-blue-600"
                                             : "fill-gray-300 text-gray-300"
                                       }`}
                                    />
                                 ))}
                              </div>
                              <p className="text-gray-600">{`"${review.comment}"`}</p>
                           </CardContent>

                           <CardHeader>
                              <div className="flex flex-row items-center gap-4">
                                 <Avatar>
                                    <AvatarImage
                                       src={review.image}
                                       alt={review.name}
                                    />
                                    <AvatarFallback>
                                       {review.name.charAt(0)}
                                       {review.userName.charAt(0)}
                                    </AvatarFallback>
                                 </Avatar>

                                 <div className="flex flex-col">
                                    <CardTitle className="text-lg text-gray-900">
                                       {review.name}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                       {review.userName}
                                    </CardDescription>
                                 </div>
                              </div>
                           </CardHeader>
                        </Card>
                     </CarouselItem>
                  ))}
               </CarouselContent>
               <CarouselPrevious className="bg-white border border-blue-100 text-blue-600 hover:bg-blue-50" />
               <CarouselNext className="bg-white border border-blue-100 text-blue-600 hover:bg-blue-50" />
            </Carousel>
         </div>
      </section>
   );
};
