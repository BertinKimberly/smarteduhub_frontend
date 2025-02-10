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
import { UploadCloud } from "lucide-react";
import {
  useCreateCourse,
  useUpdateCourse,
} from "@/hooks/useCourses";

interface Course {
  id?: string;
  title: string;
  description: string;
  category: string;
  level: string;
}

interface CourseFormProps {
  editCourse?: Course | null;
  onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ editCourse, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      category: "",
      level: "",
    },
  });

  useEffect(() => {
    if (editCourse) {
      reset(editCourse);
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

  const onSubmit = (data: Course) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("level", data.level);
    if (selectedFile) formData.append("file", selectedFile);

    if (editCourse) {
      updateCourseMutation.mutate(
        { _id: editCourse.id, formData },
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
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <p className="text-gray-500">Drag & drop a file or click to upload</p>
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-700">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-main">
        {editCourse ? "Update Course" : "Create Course"}
      </Button>
    </form>
  );
};

export default CourseForm;
