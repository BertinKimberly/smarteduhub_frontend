"use client"
import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { useGetAllCourses } from "@/hooks/useCourses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Clock, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock categories for demonstration
const categories = [
  "All Categories",
  "Web Development",
  "Data Science",
  "Business",
  "Design",
  "Marketing"
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

type CourseCardProps = {
  name: string;
  id: string;
  category?: string;
  level?: string;
  duration?: string;
  rating?: number;
};

const CourseCard: React.FC<CourseCardProps> = ({ 
  name, 
  id, 
  category = "Web Development",
  level = "Beginner",
  duration = "6 weeks",
  rating = 4.5
}) => {
  return (
    <Link href={`/courses/${id}`} passHref>
      <Tilt
        className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full max-w-[350px] transition-all hover:shadow-xl"
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        scale={1.02}
        transitionSpeed={450}
      >
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="bg-main/10 text-main">
              {category}
            </Badge>
            <Badge variant="outline" className="flex gap-1 items-center">
              <Clock className="h-3 w-3" /> {duration}
            </Badge>
          </div>
          
          <h3 className="font-bold text-xl text-gray-900">{name}</h3>
          
          <div className="flex justify-between items-center mt-2">
            <Badge variant="secondary" className="bg-gray-100">
              {level}
            </Badge>
            <span className="text-yellow-500 font-medium">★ {rating}</span>
          </div>
          
          <Button className="w-full mt-2 bg-main rounded-full">
            View Course
          </Button>
        </div>
      </Tilt>
    </Link>
  );
};

const CoursesPage = () => {
  const { data: courses, isLoading, error } = useGetAllCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error loading courses
    </div>
  );

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      {/* Hero Section */}
      <div className="bg-main text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Explore Our Courses
          </h1>
          <p className="text-lg opacity-90 text-center max-w-2xl mx-auto mb-8">
            Discover a world of knowledge with our expertly crafted courses
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search courses..."
                className="w-full p-6 rounded-full bg-white/95 text-gray-900 pr-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              className="bg-white text-main hover:bg-gray-100 rounded-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <X /> : <Filter />}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Level</label>
              <Select onValueChange={setSelectedLevel} defaultValue={selectedLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: any) => (
            <CourseCard
              key={course.id}
              name={course.title}
              id={course.id}
              category={course.category}
              level={course.level}
              duration={course.duration}
              rating={course.rating}
            />
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;