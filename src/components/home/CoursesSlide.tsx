"use client";
import React from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { useGetAllCourses } from "@/hooks/useCourses";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type CourseCardProps = {
  name: string;
  id: string;
};

const CourseCard: React.FC<CourseCardProps> = ({ name, id }) => {
  const link = `/courses/${id}`;

  return (
    <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
      <Link href={link} passHref>
        <Tilt
          className="rounded-2xl shadow-lg flex justify-center items-center border border-submain w-[250px] sm:w-[300px] xl:w-[350px]"
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          scale={1.05}
          transitionSpeed={450}
        >
          <div className="flex flex-col items-center justify-center bg-tertiary rounded-2xl w-full min-h-[200px] p-5">
            <h3 className="font-bold text-2xl mb-2 text-center">{name}</h3>
            <span className="text-blue-400 underline hover:text-blue-300 text-center">
              More
            </span>
          </div>
        </Tilt>
      </Link>
    </CarouselItem>
  );
};

const CoursesSlide = () => {
  const { data: courses, isLoading, error } = useGetAllCourses();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div className="p-2 flex flex-col gap-6 items-center justify-center mt-6">
      <h2>Are you Ready to Learn?</h2>
      <div className="rounded-lg p-4 flex items-center justify-center">
        <Carousel 
          className="w-full max-w-5xl"
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
            align: "start"
          }}
        >
          <CarouselContent className="-ml-1">
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                name={course.title}
                id={course.id}
              />
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default CoursesSlide;