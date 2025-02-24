"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Progress } from "@/components/ui/progress";
import { Brain, Maximize2, Minimize2 } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import mammoth from "mammoth";

const CourseDetails: React.FC = () => {
   const courseTitle = "Advanced Java Programming";
   const courseDescription = "This course covers advanced topics in Java programming, including design patterns, concurrency, and best practices.";
   const duration = "Duration: 10 weeks";
   const level = "Level: Advanced";
   const instructor = "Instructor: John Doe";

   const [file, setFile] = useState<File | null>(null);
   const [docContent, setDocContent] = useState<string>("");
   const [viewEntire, setViewEntire] = useState<boolean>(false);
   const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files ? e.target.files[0] : null;
      if (!selectedFile) return;

      setFile(selectedFile);
      setViewEntire(false);

      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
         const reader = new FileReader();
         reader.onload = async (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setDocContent(result.value);
         };
         reader.readAsArrayBuffer(selectedFile);
      }
   };

   return (
      <div className="p-3">
         <DashboardNavbar title="Course Details" />
         <div className="p-2 flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between">
               <h4 className="text-main">{courseTitle}</h4>
               <div className="flex items-center gap-4">
                  <button onClick={() => setIsFullScreen(!isFullScreen)} className="bg-main text-submain p-2 rounded-lg">
                     {isFullScreen ? <Minimize2 /> : <Maximize2 />}
                  </button>
                  <div className="bg-main text-submain flex p-2 items-center gap-3 rounded-lg">
                     <Brain /> <p>Analyze With AI</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-2 w-[20%] mt-8 mb-4">
               <small>Curriculum Progress</small>
               <Progress value={40} />
            </div>

            <div className="border border-main rounded-lg p-4">
               <h5 className="text-lg font-bold">{courseTitle}</h5>
               <p className="text-sm">{courseDescription}</p>
               <p className="text-xs text-gray-500">{duration}</p>
               <p className="text-xs text-gray-500">{level}</p>
               <p className="text-xs text-gray-500">{instructor}</p>
            </div>

            <div className="border border-main p-4 rounded-lg">
               <input type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} className="mb-4" />

               {file && isFullScreen && (
                  <div className="fixed inset-0 bg-white z-50 p-4 overflow-y-auto h-screen">
                     <button onClick={() => setIsFullScreen(false)} className="absolute top-4 right-4 bg-main text-white p-2 rounded">
                        <Minimize2 />
                     </button>
                     {file.type === "application/pdf" && (
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                           <Viewer fileUrl={URL.createObjectURL(file)} defaultScale={1.5} />
                        </Worker>
                     )}
                     {file.type.startsWith("image/") && (
                        <img src={URL.createObjectURL(file)} alt="Uploaded" className="w-full h-auto" />
                     )}
                     {file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                        <div dangerouslySetInnerHTML={{ __html: docContent }} className="prose max-w-full" />
                     )}
                  </div>
               )}

               {!isFullScreen && (
                  <>
                     {file && file.type === "application/pdf" && (
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                           <Viewer fileUrl={URL.createObjectURL(file)} defaultScale={viewEntire ? 1.5 : 0.75} />
                        </Worker>
                     )}

                     {file && file.type.startsWith("image/") && (
                        <img src={URL.createObjectURL(file)} alt="Uploaded" className="w-full h-auto" />
                     )}

                     {file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                        <div
                           dangerouslySetInnerHTML={{ __html: docContent }}
                           className={`prose max-w-full ${viewEntire ? "" : "max-h-60 overflow-hidden"}`}
                        />
                     )}

                     {file && (
                        <button
                           onClick={() => setViewEntire(!viewEntire)}
                           className="mt-4 inline-block bg-main text-white py-2 px-4 rounded-md"
                        >
                           {viewEntire ? "Collapse Document" : "View Entire Document"}
                        </button>
                     )}
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default CourseDetails;
