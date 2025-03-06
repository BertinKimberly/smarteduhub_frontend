import { useState, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import mammoth from "mammoth";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";

interface DocumentViewerProps {
   fileUrl: string;
   className?: string;
   isFullscreen?: boolean;
   onToggleFullscreen?: () => void;
}

const DocumentViewer = ({
   fileUrl,
   className = "w-full h-full",
   isFullscreen = false,
   onToggleFullscreen,
}: DocumentViewerProps) => {
   const [docxContent, setDocxContent] = useState<string>("");
   const [error, setError] = useState<boolean>(false);
   const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
   const isDocx = fileExtension === "docx";

   useEffect(() => {
      if (isDocx) {
         handleDocxConversion();
      }
   }, [fileUrl]);

   const handleDocxConversion = async () => {
      try {
         const response = await fetch(fileUrl);
         const arrayBuffer = await response.arrayBuffer();
         const result = await mammoth.convertToHtml({ arrayBuffer });
         setDocxContent(result.value);
         setError(false);
      } catch (err) {
         console.error("Error converting DOCX:", err);
         setError(true);
      }
   };

   const containerClasses = isFullscreen
      ? "fixed inset-0 z-[100] bg-white"
      : `relative ${className}`;

   // Add minimize button for fullscreen mode
   const MinimizeButton = isFullscreen && (
      <Button
         variant="outline"
         size="icon"
         onClick={onToggleFullscreen}
         className="fixed top-4 right-4 z-[101] bg-white shadow-lg hover:bg-gray-100 border"
      >
         <Minimize2 className="h-5 w-5 text-gray-700" />
      </Button>
   );

   if (isDocx && !error) {
      return (
         <div className={containerClasses}>
            {MinimizeButton}
            <div
               className={`w-full h-full overflow-auto bg-white p-8 ${
                  isFullscreen ? "p-12" : ""
               }`}
            >
               <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: docxContent }}
               />
            </div>
         </div>
      );
   }

   const docs = [{ uri: fileUrl }];

   return (
      <div className={containerClasses}>
         {MinimizeButton}
         <DocViewer
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            style={{
               height: "100%",
               overflow: "auto",
               backgroundColor: "white",
            }}
            config={{
               header: {
                  disableHeader: false,
                  disableFileName: false,
               },
               pdfZoom: {
                  defaultZoom: 1.1,
                  zoomJump: 0.2,
               },
               pdfVerticalScrollByDefault: true,
            }}
         />
      </div>
   );
};

export default DocumentViewer;
