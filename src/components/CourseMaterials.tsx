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
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

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
   const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
      null
   );

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

      console.log("Preview URL:", fileUrl); // Debug log

      if (fileExtension === "pdf") {
         return (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
               <div style={{ height: "500px" }}>
                  <Viewer
                     fileUrl={fileUrl}
                     onError={(error) => {
                        console.error("PDF viewer error:", error);
                        console.log("Attempted URL:", fileUrl);
                     }}
                  />
               </div>
            </Worker>
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
            <div className="flex gap-4 mb-6">
               <Input
                  placeholder="Material title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
               <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
               />
               <Button
                  onClick={handleUpload}
                  disabled={!file || !title || uploadMutation.isPending}
               >
                  {uploadMutation.isPending
                     ? "Uploading..."
                     : "Upload Material"}
               </Button>
            </div>
         )}

         <div className="grid gap-4">
            {materials && materials.length > 0 ? (
               materials.map((material) => (
                  <Card key={material.id}>
                     <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                           <FileIcon className="h-5 w-5 text-blue-500" />
                           <span>{material.title}</span>
                           <span className="text-sm text-gray-500">
                              ({material.file_path.split("/").pop()})
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Dialog>
                              <DialogTrigger asChild>
                                 <Button
                                    variant="outline"
                                    size="sm"
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
                                          ({material.file_path.split("/").pop()}
                                          )
                                       </span>
                                    </DialogTitle>
                                 </DialogHeader>
                                 <div className="flex-1 overflow-auto">
                                    {renderMaterialPreview(material)}
                                 </div>
                              </DialogContent>
                           </Dialog>

                           <Button
                              variant="outline"
                              onClick={() => {
                                 const url = getFileUrl(material.file_path);
                                 console.log("Download URL:", url); // Debug log
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
