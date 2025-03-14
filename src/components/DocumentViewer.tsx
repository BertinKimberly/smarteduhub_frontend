import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";

// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
   const [numPages, setNumPages] = useState<number | null>(null);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [pdfLoading, setPdfLoading] = useState<boolean>(true);

   const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
   const isPdf = fileExtension === "pdf";
   const isDocx = fileExtension === "docx";
   const isSupportedByBrowser = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'txt'].includes(fileExtension || '');

   useEffect(() => {
      if (isDocx) {
         handleDocxConversion();
      }
   }, [fileUrl]);

   const handleDocxConversion = async () => {
      try {
         // Import mammoth dynamically only when needed
         const mammoth = await import('mammoth');
         const response = await fetch(fileUrl);
         const arrayBuffer = await response.arrayBuffer();
         const result = await mammoth.default.convertToHtml({ arrayBuffer });
         setDocxContent(result.value);
         setError(false);
      } catch (err) {
         console.error("Error converting DOCX:", err);
         setError(true);
      }
   };

   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setPdfLoading(false);
   };

   const containerClasses = isFullscreen
      ? "fixed inset-0 z-[100] bg-white"
      : `relative ${className}`;

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

   // DOCX handling
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

   // PDF handling with react-pdf
   if (isPdf) {
      return (
         <div className={containerClasses}>
            {MinimizeButton}
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center overflow-auto p-4">
               {pdfLoading && (
                  <div className="text-center">
                     <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
                     <p className="text-gray-600">Loading PDF...</p>
                  </div>
               )}
               <Document
                  file={fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) => {
                     console.error("Failed to load PDF:", error);
                     setError(true);
                  }}
               >
                  <Page
                     pageNumber={pageNumber}
                     width={isFullscreen ? window.innerWidth * 0.9 : 800}
                  />
               </Document>
               {numPages && (
                  <div className="mt-4 flex items-center justify-center space-x-4">
                     <Button
                        variant="outline"
                        onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                     >
                        Previous
                     </Button>
                     <span className="text-gray-600">
                        Page {pageNumber} of {numPages}
                     </span>
                     <Button
                        variant="outline"
                        onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
                        disabled={pageNumber >= numPages}
                     >
                        Next
                     </Button>
                  </div>
               )}
            </div>
         </div>
      );
   }

   // For simple browser-supported files like images
   if (isSupportedByBrowser) {
      return (
         <div className={containerClasses}>
            {MinimizeButton}
            <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-auto">
               {(['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExtension || '')) ? (
                  <img 
                     src={fileUrl} 
                     alt="Document preview" 
                     className="max-w-full max-h-full object-contain"
                  />
               ) : (
                  <iframe 
                     src={fileUrl} 
                     className="w-full h-full border-0" 
                     title="Document preview"
                  />
               )}
            </div>
         </div>
      );
   }

   // For unsupported file types
   return (
      <div className={containerClasses}>
         {MinimizeButton}
         <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-600">Unsupported file type.</p>
         </div>
      </div>
   );
};

export default DocumentViewer;