//@ts-nocheck
import { FC, useState } from "react";
import { CourseFormData } from "@/types/course";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "./ui/select";
import { useCreateCourse, useUploadMaterial } from "@/hooks/useCourses";
import {
   BookOpen,
   FileIcon,
   FileText,
   Loader2,
   Plus,
   Trash2Icon,
   Upload,
   CheckCircle2,
   ArrowRight,
} from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

const CATEGORY_OPTIONS = [
   { value: "programming", label: "Programming & Development" },
   { value: "business", label: "Business & Entrepreneurship" },
   { value: "design", label: "Design & Creative Arts" },
   { value: "marketing", label: "Marketing & Communication" },
   { value: "science", label: "Science & Engineering" },
   { value: "languages", label: "Languages & Linguistics" },
   { value: "mathematics", label: "Mathematics & Statistics" },
   { value: "health", label: "Health & Wellness" },
   { value: "music", label: "Music & Audio" },
   { value: "technology", label: "Technology & IT" },
] as const;

interface CourseCreateFormProps {
   onSuccess: () => void;
}

const CourseCreateForm: FC<CourseCreateFormProps> = ({ onSuccess }) => {
   const [formData, setFormData] = useState<CourseFormData>({
      title: "",
      description: "",
      long_description: "",
      prerequisites: [],
      category: "",
      level: "Beginner",
   });

   const [prerequisiteInput, setPrerequisiteInput] = useState("");

   const [courseId, setCourseId] = useState<string>("");

   // Materials state
   const [materials, setMaterials] = useState<
      Array<{ title: string; file: File }>
   >([]);
   const [currentMaterial, setCurrentMaterial] = useState({
      title: "",
      file: null as File | null,
   });
   const [uploadProgress, setUploadProgress] = useState(0);
   const [activeTab, setActiveTab] = useState("basic-info");
   const [validationErrors, setValidationErrors] = useState({
      title: false,
      description: false,
      category: false,
   });

   const createCourseMutation = useCreateCourse();
   const uploadMaterialMutation = useUploadMaterial();

   const validateBasicInfo = () => {
      const errors = {
         title: !formData.title.trim(),
         description: !formData.description.trim(),
         category: !formData.category.trim(),
      };

      setValidationErrors(errors);
      return !Object.values(errors).some(Boolean);
   };

   const handleBasicInfoSubmit = async () => {
      if (!validateBasicInfo()) return;

      try {
         // Ensure prerequisites is an array
         const courseData = {
            ...formData,
            prerequisites: formData.prerequisites || [],
            description: formData.description || "",
            long_description: formData.long_description || "",
         };

         const course = await createCourseMutation.mutateAsync(courseData);
         setCourseId(course.id);
         setActiveTab("materials");
      } catch (error) {
         console.error("Failed to create course:", error);
      }
   };

   const handleAddMaterial = () => {
      if (currentMaterial.title && currentMaterial.file) {
         setMaterials([
            ...materials,
            { ...currentMaterial } as { title: string; file: File },
         ]);
         setCurrentMaterial({ title: "", file: null });
      }
   };

   const handleRemoveMaterial = (index: number) => {
      setMaterials(materials.filter((_, i) => i !== index));
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
         const file = e.target.files[0];
         setCurrentMaterial((prev) => ({
            ...prev,
            file,
            // If no title is set yet, use the file name (without extension) as default title
            title: prev.title || file.name.split(".").slice(0, -1).join("."),
         }));
      }
   };

   const handleFinish = async () => {
      try {
         setUploadProgress(0);
         // Upload all materials
         for (let i = 0; i < materials.length; i++) {
            const material = materials[i];
            await uploadMaterialMutation.mutateAsync({
               courseId,
               title: material.title,
               file: material.file,
            });
            setUploadProgress(Math.round(((i + 1) / materials.length) * 100));
         }
         onSuccess();
      } catch (error) {
         console.error("Failed to upload materials:", error);
      }
   };

   const getFileIcon = (fileName: string) => {
      const ext = fileName.split(".").pop()?.toLowerCase();

      if (ext === "pdf") return <FileText className="h-5 w-5 text-red-500" />;
      if (["doc", "docx"].includes(ext || ""))
         return <FileText className="h-5 w-5 text-blue-500" />;
      if (["ppt", "pptx"].includes(ext || ""))
         return <FileText className="h-5 w-5 text-orange-500" />;
      return <FileIcon className="h-5 w-5 text-gray-500" />;
   };

   const getFileSize = (file: File) => {
      const sizeInKB = file.size / 1024;
      if (sizeInKB < 1024) return `${Math.round(sizeInKB)} KB`;
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
   };

   const handleAddPrerequisite = () => {
      if (prerequisiteInput.trim()) {
         setFormData((prev) => ({
            ...prev,
            prerequisites: [
               ...(prev.prerequisites || []),
               prerequisiteInput.trim(),
            ],
         }));
         setPrerequisiteInput("");
      }
   };

   const handleRemovePrerequisite = (index: number) => {
      setFormData((prev) => ({
         ...prev,
         prerequisites: prev.prerequisites?.filter((_, i) => i !== index) || [],
      }));
   };

   return (
      <div className="space-y-6">
         <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
         >
            <TabsList className="inline-flex h-14 items-center justify-center rounded-lg bg-blue-50 p-1 text-blue-600 mb-8">
               <TabsTrigger
                  value="basic-info"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm h-10"
               >
                  1. Basic Information
               </TabsTrigger>
               <TabsTrigger
                  value="materials"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm h-10"
                  disabled={!courseId}
               >
                  2. Course Materials
               </TabsTrigger>
            </TabsList>

            <TabsContent
               value="basic-info"
               className="space-y-6"
            >
               <div className="grid gap-6">
                  <div className="grid gap-3">
                     <Label
                        htmlFor="title"
                        className="text-base"
                     >
                        Course Title<span className="text-red-500">*</span>
                     </Label>
                     <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                           setFormData({ ...formData, title: e.target.value });
                           if (e.target.value.trim()) {
                              setValidationErrors({
                                 ...validationErrors,
                                 title: false,
                              });
                           }
                        }}
                        placeholder="e.g., Introduction to Biology"
                        className={`h-12 ${
                           validationErrors.title
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                        }`}
                     />
                     {validationErrors.title && (
                        <span className="text-sm text-red-500">
                           Course title is required
                        </span>
                     )}
                  </div>

                  <div className="grid gap-3">
                     <Label
                        htmlFor="description"
                        className="text-base"
                     >
                        Description<span className="text-red-500">*</span>
                     </Label>
                     <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => {
                           setFormData({
                              ...formData,
                              description: e.target.value,
                           });
                           if (e.target.value.trim()) {
                              setValidationErrors({
                                 ...validationErrors,
                                 description: false,
                              });
                           }
                        }}
                        placeholder="Provide a brief description of the course"
                        className={`min-h-24 ${
                           validationErrors.description
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                        }`}
                     />
                     {validationErrors.description && (
                        <span className="text-sm text-red-500">
                           Description is required
                        </span>
                     )}
                  </div>

                  <div className="grid gap-3">
                     <Label
                        htmlFor="long_description"
                        className="text-base"
                     >
                        What You&apos;ll Learn
                     </Label>
                     <Textarea
                        id="long_description"
                        value={formData.long_description}
                        onChange={(e) =>
                           setFormData({
                              ...formData,
                              long_description: e.target.value,
                           })
                        }
                        placeholder="Detail what students will learn in this course"
                        className="min-h-24"
                     />
                  </div>

                  <div className="grid gap-3">
                     <Label
                        htmlFor="prerequisites"
                        className="text-base"
                     >
                        Prerequisites
                     </Label>
                     <div className="flex gap-2">
                        <Input
                           id="prerequisites"
                           value={prerequisiteInput}
                           onChange={(e) =>
                              setPrerequisiteInput(e.target.value)
                           }
                           placeholder="Add a prerequisite"
                           className="h-12"
                           onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                 e.preventDefault();
                                 handleAddPrerequisite();
                              }
                           }}
                        />
                        <Button
                           type="button"
                           onClick={handleAddPrerequisite}
                           variant="outline"
                           className="h-12"
                        >
                           Add
                        </Button>
                     </div>
                     {formData.prerequisites &&
                        formData.prerequisites.length > 0 && (
                           <div className="flex flex-wrap gap-2 mt-2">
                              {formData.prerequisites.map(
                                 (prerequisite, index) => (
                                    <Badge
                                       key={index}
                                       variant="secondary"
                                       className="px-3 py-1"
                                    >
                                       {prerequisite}
                                       <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                                          onClick={() =>
                                             handleRemovePrerequisite(index)
                                          }
                                       >
                                          ×
                                       </Button>
                                    </Badge>
                                 )
                              )}
                           </div>
                        )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="grid gap-3">
                        <Label
                           htmlFor="category"
                           className="text-base"
                        >
                           Category<span className="text-red-500">*</span>
                        </Label>
                        <Select
                           value={formData.category}
                           onValueChange={(value) => {
                              setFormData({
                                 ...formData,
                                 category: value,
                              });
                              if (value) {
                                 setValidationErrors({
                                    ...validationErrors,
                                    category: false,
                                 });
                              }
                           }}
                        >
                           <SelectTrigger
                              id="category"
                              className="h-12"
                           >
                              <SelectValue placeholder="Select a category" />
                           </SelectTrigger>
                           <SelectContent>
                              {CATEGORY_OPTIONS.map(({ value, label }) => (
                                 <SelectItem
                                    key={value}
                                    value={value}
                                 >
                                    {label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        {validationErrors.category && (
                           <span className="text-sm text-red-500">
                              Category is required
                           </span>
                        )}
                     </div>
                     <div className="grid gap-3">
                        <Label
                           htmlFor="level"
                           className="text-base"
                        >
                           Difficulty Level
                           <span className="text-red-500">*</span>
                        </Label>
                        <Select
                           value={formData.level}
                           onValueChange={(value) =>
                              setFormData({ ...formData, level: value })
                           }
                        >
                           <SelectTrigger
                              id="level"
                              className="h-12"
                           >
                              <SelectValue placeholder="Select level" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">
                                 Intermediate
                              </SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </div>

               <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                  <Button
                     onClick={handleBasicInfoSubmit}
                     className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md h-12 px-6"
                     disabled={createCourseMutation.isPending}
                  >
                     {createCourseMutation.isPending ? (
                        <>
                           <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                           Creating...
                        </>
                     ) : (
                        <>
                           Continue to Materials{" "}
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                     )}
                  </Button>
               </div>
            </TabsContent>

            <TabsContent
               value="materials"
               className="space-y-6"
            >
               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                     <BookOpen className="h-5 w-5 text-blue-600" />
                     <h3 className="text-lg font-medium">
                        Add Course Materials
                     </h3>
                  </div>

                  <Card className="p-6 border-dashed">
                     <div className="grid md:grid-cols-2 gap-4 items-start">
                        <div className="space-y-3">
                           <Label
                              htmlFor="materialTitle"
                              className="text-base"
                           >
                              Material Title
                           </Label>
                           <Input
                              id="materialTitle"
                              value={currentMaterial.title}
                              onChange={(e) =>
                                 setCurrentMaterial((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                 }))
                              }
                              placeholder="e.g., Week 1 Lecture Notes"
                              className="h-12"
                           />
                        </div>
                        <div className="space-y-3">
                           <Label
                              htmlFor="materialFile"
                              className="text-base"
                           >
                              Upload File
                           </Label>
                           <div className="relative">
                              <Input
                                 id="materialFile"
                                 type="file"
                                 onChange={handleFileChange}
                                 accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.jpeg"
                                 className="h-12 opacity-0 absolute inset-0 cursor-pointer"
                              />
                              <div className="h-12 px-4 border rounded-md flex items-center justify-between text-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                                 <span>
                                    {currentMaterial.file
                                       ? currentMaterial.file.name
                                       : "Select file (.pdf, .doc, .ppt, etc.)"}
                                 </span>
                                 <Upload className="h-4 w-4" />
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="flex justify-end mt-4">
                        <Button
                           onClick={handleAddMaterial}
                           disabled={
                              !currentMaterial.title || !currentMaterial.file
                           }
                           className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                        >
                           <Plus className="h-4 w-4 mr-2" />
                           Add Material
                        </Button>
                     </div>
                  </Card>
               </div>

               <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 mt-8 mb-2">
                     {materials.length > 0
                        ? `Added Materials (${materials.length})`
                        : "No materials added yet"}
                  </h4>

                  {materials.length > 0 ? (
                     <div className="grid gap-3">
                        {materials.map((material, index) => (
                           <Card
                              key={index}
                              className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                           >
                              <div className="flex items-center gap-3">
                                 {getFileIcon(material.file.name)}
                                 <div>
                                    <span className="font-medium block">
                                       {material.title}
                                    </span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                       {material.file.name} •{" "}
                                       {getFileSize(material.file)}
                                    </span>
                                 </div>
                              </div>
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 onClick={() => handleRemoveMaterial(index)}
                                 className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                              >
                                 <Trash2Icon className="h-4 w-4" />
                              </Button>
                           </Card>
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                        <FileText className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">
                           Upload course materials to enhance your course.
                        </p>
                     </div>
                  )}
               </div>

               {uploadMaterialMutation.isPending && uploadProgress > 0 && (
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span>Uploading materials...</span>
                        <span>{uploadProgress}%</span>
                     </div>
                     <Progress
                        value={uploadProgress}
                        className="h-2"
                     />
                  </div>
               )}

               <div className="flex justify-between gap-4 mt-8 pt-4 border-t">
                  <Button
                     variant="outline"
                     onClick={() => setActiveTab("basic-info")}
                     className="h-12"
                  >
                     Back to Basic Info
                  </Button>
                  <Button
                     onClick={handleFinish}
                     disabled={
                        uploadMaterialMutation.isPending ||
                        materials.length === 0
                     }
                     className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md h-12 px-6"
                  >
                     {uploadMaterialMutation.isPending ? (
                        <>
                           <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                           Uploading Materials...
                        </>
                     ) : (
                        <>
                           <CheckCircle2 className="mr-2 h-4 w-4" />
                           Create Course
                        </>
                     )}
                  </Button>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default CourseCreateForm;
