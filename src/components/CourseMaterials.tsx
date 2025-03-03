import { FC, useState } from "react";
import { Material } from "@/types/course";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
   useUploadMaterial,
   useGetMaterials,
   useDeleteMaterial,
} from "@/hooks/useCourses";
import { FileIcon, Trash2Icon, Download, Eye } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "./ui/dialog";

interface CourseMaterialsProps {
   courseId: string;
   isTeacher?: boolean;
}

const CourseMaterials: FC<CourseMaterialsProps> = ({
   courseId,
   isTeacher = false,
}) => {
   const [title, setTitle] = useState("");
   const [file, setFile] = useState<File | null>(null);
   const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

   const { data: materials, isLoading, refetch } = useGetMaterials(courseId);
   const uploadMutation = useUploadMaterial();
   const deleteMutation = useDeleteMaterial();

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
         setFile(e.target.files[0]);
      }
   };

   const handleUpload = async () => {
      if (!file || !title) return;

      try {
         await uploadMutation.mutateAsync({
            courseId,
            title,
            file,
         });
         setTitle("");
         setFile(null);
         // Refetch materials after upload
         refetch();
      } catch (error) {
         console.error("Failed to upload material:", error);
      }
   };

   const handleDelete = async (materialId: string) => {
      try {
         await deleteMutation.mutateAsync(materialId);
         // Refetch materials after deletion
         refetch();
      } catch (error) {
         console.error("Failed to delete material:", error);
      }
   };

   const getFileUrl = (filePath: string) => {
      // Strip any 'uploads/courses/' prefix from the filePath
      const cleanPath = filePath.replace(/^(uploads\/)?(courses\/)?/, "");

      // Use the base URL and append the cleaned path
      return `${process.env.NEXT_PUBLIC_BASE_URL}${cleanPath}`;
   };

   const renderMaterialPreview = (material: Material) => {
      const fileUrl = getFileUrl(material.file_path);
      const fileExtension = material.file_path.split(".").pop()?.toLowerCase();

      if (fileExtension === "pdf") {
         return (
            <iframe
               src={`${fileUrl}#view=fitH`}
               title={material.title}
               className="w-full h-full min-h-[500px] border-0"
            />
         );
      }

      if (["jpg", "jpeg", "png", "gif"].includes(fileExtension || "")) {
         return (
            <img
               src={fileUrl}
               alt={material.title}
               className="max-w-full h-auto"
            />
         );
      }

      return (
         <div className="p-8 text-center text-gray-500">
            <FileIcon className="h-12 w-12 mx-auto mb-4" />
            <p>This file type cannot be previewed. Please download to view.</p>
         </div>
      );
   };

   if (isLoading) return <div>Loading materials...</div>;

   return (
      <div className="space-y-4">
         <h3 className="text-lg font-semibold">Course Materials</h3>

         {isTeacher && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
               <Input
                  placeholder="Material title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1"
               />
               <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  className="flex-1"
               />
               <Button
                  onClick={handleUpload}
                  disabled={!file || !title || uploadMutation.isPending}
                  className="whitespace-nowrap"
               >
                  {uploadMutation.isPending ? "Uploading..." : "Upload Material"}
               </Button>
            </div>
         )}

         <div className="grid gap-4">
            {materials && materials.length > 0 ? (
               materials.map((material) => (
                  <Card key={material.id}>
                     <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3">
                        <div className="flex items-center gap-3">
                           <FileIcon className="h-5 w-5 text-blue-500" />
                           <span className="font-medium">{material.title}</span>
                           <span className="text-sm text-gray-500">
                              ({material.file_path.split("/").pop()})
                           </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 ml-auto">
                           <Dialog>
                              <DialogTrigger asChild>
                                 <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedMaterial(material)}
                                 >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                 </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl h-[80vh]">
                                 <DialogHeader>
                                    <DialogTitle>
                                       {material.title}
                                       <span className="text-sm text-gray-500 ml-2">
                                          ({material.file_path.split("/").pop()})
                                       </span>
                                    </DialogTitle>
                                 </DialogHeader>
                                 <div className="flex-1 overflow-auto h-full">
                                    {renderMaterialPreview(material)}
                                 </div>
                              </DialogContent>
                           </Dialog>

                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                 const url = getFileUrl(material.file_path);
                                 window.open(url, "_blank");
                              }}
                           >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                           </Button>

                           {isTeacher && (
                              <Button
                                 variant="destructive"
                                 size="icon"
                                 onClick={() => handleDelete(material.id)}
                                 disabled={deleteMutation.isPending}
                              >
                                 <Trash2Icon className="h-4 w-4" />
                              </Button>
                           )}
                        </div>
                     </CardContent>
                  </Card>
               ))
            ) : (
               <p className="text-gray-500 text-center py-4">
                  No materials available for this course.
               </p>
            )}
         </div>
      </div>
   );
};

export default CourseMaterials;