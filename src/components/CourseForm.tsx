import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UploadCloud, Plus, X } from "lucide-react";
import { useCreateCourse, useUpdateCourse } from "@/hooks/useCourses";

interface Course {
   id?: string;
   title: string;
   description: string;
   long_description?: string;
   prerequisites?: string[];
   category: string;
   level: string;
}

interface CourseFormProps {
   editCourse?: Course | null;
   onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ editCourse, onClose }) => {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [prerequisite, setPrerequisite] = useState<string>("");
   const [prerequisites, setPrerequisites] = useState<string[]>(
      editCourse?.prerequisites || []
   );
   const createCourseMutation = useCreateCourse();
   const updateCourseMutation = useUpdateCourse();

   const {
      register,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: { errors },
   } = useForm<Course>({
      defaultValues: editCourse || {
         title: "",
         description: "",
         long_description: "",
         prerequisites: [],
         category: "",
         level: "",
      },
   });

   useEffect(() => {
      if (editCourse) {
         reset(editCourse);
         setPrerequisites(editCourse.prerequisites || []);
      }
   }, [editCourse, reset]);

   const onDrop = (acceptedFiles: File[]) => {
      setSelectedFile(acceptedFiles[0]);
   };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      multiple: false,
      accept: {
         "application/pdf": [".pdf"],
         "image/*": [".png", ".jpg", ".jpeg"],
      },
   });

   const addPrerequisite = () => {
      if (prerequisite.trim()) {
         setPrerequisites([...prerequisites, prerequisite.trim()]);
         setPrerequisite("");
      }
   };

   const removePrerequisite = (index: number) => {
      setPrerequisites(prerequisites.filter((_, i) => i !== index));
   };

   const onSubmit = (data: Course) => {
      const formData = {
         title: data.title,
         description: data.description,
         long_description: data.long_description || "",
         prerequisites: prerequisites,
         category: data.category,
         level: data.level,
         file: selectedFile,
      };

      if (editCourse?.id) {
         updateCourseMutation.mutate(
            { data: formData, id: editCourse.id },
            {
               onSuccess: () => {
                  onClose();
                  reset();
               },
            }
         );
      } else {
         createCourseMutation.mutate(formData, {
            onSuccess: () => {
               onClose();
               reset();
               setSelectedFile(null);
               setPrerequisites([]);
            },
         });
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="space-y-4"
      >
         {/* Course Title */}
         <Input
            {...register("title", { required: "Title is required" })}
            placeholder="Course Title"
         />
         {errors.title?.message && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
         )}

         {/* Course Description */}
         <Textarea
            {...register("description")}
            placeholder="Course Description"
         />

         {/* Long Description (What you'll learn) */}
         <Textarea
            {...register("long_description")}
            placeholder="What students will learn (detailed description)"
         />

         {/* Prerequisites */}
         <div className="space-y-2">
            <label className="text-sm font-medium">Prerequisites</label>
            <div className="flex gap-2">
               <Input
                  value={prerequisite}
                  onChange={(e) => setPrerequisite(e.target.value)}
                  placeholder="Add a prerequisite"
                  onKeyDown={(e) => {
                     if (e.key === "Enter") {
                        e.preventDefault();
                        addPrerequisite();
                     }
                  }}
               />
               <Button
                  type="button"
                  onClick={addPrerequisite}
                  className="bg-main"
               >
                  <Plus className="w-4 h-4" />
               </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
               {prerequisites.map((prereq, index) => (
                  <div
                     key={index}
                     className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                  >
                     <span className="text-sm">{prereq}</span>
                     <button
                        type="button"
                        onClick={() => removePrerequisite(index)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                     >
                        <X className="w-3 h-3" />
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* Category Dropdown */}
         <Select
            onValueChange={(value) => setValue("category", value)}
            defaultValue={editCourse?.category}
         >
            <SelectTrigger>
               <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="programming">Programming</SelectItem>
               <SelectItem value="design">Design</SelectItem>
               <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
         </Select>

         {/* Level Dropdown */}
         <Select
            onValueChange={(value) => setValue("level", value)}
            defaultValue={editCourse?.level}
         >
            <SelectTrigger>
               <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="beginner">Beginner</SelectItem>
               <SelectItem value="intermediate">Intermediate</SelectItem>
               <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
         </Select>

         {/* File Upload */}
         <div className="border p-4 rounded-lg">
            <div
               {...getRootProps()}
               className="flex flex-col items-center justify-center border-dashed border-2 p-6 cursor-pointer"
            >
               <input {...getInputProps()} />
               <UploadCloud className="w-10 h-10 text-gray-500" />
               <p className="text-gray-500">
                  Drag & drop a file or click to upload
               </p>
            </div>
            {selectedFile && (
               <p className="mt-2 text-sm text-gray-700">
                  Selected: {selectedFile.name}
               </p>
            )}
         </div>

         {/* Submit Button */}
         <Button
            type="submit"
            className="w-full bg-main"
         >
            {editCourse ? "Update Course" : "Create Course"}
         </Button>
      </form>
   );
};

export default CourseForm;
