import { useState, useEffect } from "react";
import { Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

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
   const [processedFileUrl, setProcessedFileUrl] = useState<string>("");
   const [isLoading, setIsLoading] = useState(true);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
   const isDocx = fileExtension === "docx";
   const isPdf = fileExtension === "pdf";

   useEffect(() => {
      setIsLoading(true);
      setErrorMessage(null);
      
      if (isDocx) {
         handleDocxConversion();
      } else if (isPdf) {
         handlePdfFile();
      } else {
         // For other file types, use directly
         setProcessedFileUrl(fileUrl);
         setIsLoading(false);
      }
   }, [fileUrl]);

   const handleDocxConversion = async () => {
      try {
         const mammoth = await import("mammoth");
         const response = await fetch(fileUrl);
         const arrayBuffer = await response.arrayBuffer();
         const result = await mammoth.default.convertToHtml({ arrayBuffer });
         setDocxContent(result.value);
         setIsLoading(false);
      } catch (err) {
         console.error("Error converting DOCX:", err);
         setErrorMessage("Failed to load DOCX file. Please try downloading it instead.");
         setIsLoading(false);
      }
   };

   const handlePdfFile = async () => {
      try {
         // Use fetch with a proxy approach to avoid ad blocker issues
         // First, try to fetch using the original URL
         const fetchWithTimeout = async (url: string, options = {}, timeout = 5000) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
         };

         // Try direct fetch first
         try {
            const response = await fetchWithTimeout(fileUrl, { 
               method: 'GET',
               mode: 'cors',
               cache: 'no-cache',
               credentials: 'same-origin',
               headers: {
                  'Accept': 'application/pdf',
                  'X-Requested-With': 'XMLHttpRequest', // Some servers check for this
               },
            });

            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setProcessedFileUrl(url);
            setIsLoading(false);
            return;
         } catch (directError) {
            console.warn("Direct fetch failed, trying alternative approach:", directError);
            // Continue to fallback approaches
         }

         // Fallback: Try to use a data URL approach (works for smaller PDFs)
         try {
            // Use a server-side proxy endpoint if available
            const proxyUrl = `/api/proxy-file?url=${encodeURIComponent(fileUrl)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
               throw new Error(`Proxy HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setProcessedFileUrl(url);
         } catch (proxyError) {
            console.error("All PDF fetch approaches failed:", proxyError);
            
            // Last resort: use the original URL and let the component handle it
            setProcessedFileUrl(fileUrl);
            setErrorMessage("The PDF may be blocked by your browser. Try disabling ad blockers or download the file.");
         }
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      return () => {
         // Cleanup URL object when component unmounts
         if (processedFileUrl && processedFileUrl.startsWith('blob:')) {
            URL.revokeObjectURL(processedFileUrl);
         }
      };
   }, [processedFileUrl]);

   const containerClasses = isFullscreen
      ? "fixed inset-0 z-[100] bg-white"
      : `relative ${className}`;

   if (isDocx) {
      return (
         <div className={containerClasses}>
            {isFullscreen && (
               <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleFullscreen}
                  className="fixed top-4 right-4 z-[101]"
               >
                  <Minimize2 className="h-5 w-5" />
               </Button>
            )}
            <div
               className={`w-full h-full overflow-auto bg-white p-8 ${
                  isFullscreen ? "p-12" : ""
               }`}
            >
               {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                     <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2">Loading document...</p>
                     </div>
                  </div>
               ) : (
                  <div
                     className="prose max-w-none"
                     dangerouslySetInnerHTML={{ __html: docxContent }}
                  />
               )}
            </div>
         </div>
      );
   }

   if (isLoading) {
      return (
         <div className={containerClasses}>
            <div className="flex items-center justify-center h-full">
               <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2">Loading document...</p>
               </div>
            </div>
         </div>
      );
   }

   // For PDF and other file types, use DocViewer
   const docs = [{ 
      uri: isPdf ? processedFileUrl : fileUrl,
      fileType: fileExtension || undefined
   }];

   return (
      <div className={containerClasses}>
         {isFullscreen && (
            <Button
               variant="outline"
               size="icon"
               onClick={onToggleFullscreen}
               className="fixed top-4 right-4 z-[101]"
            >
               <Minimize2 className="h-5 w-5" />
            </Button>
         )}
         <div className="w-full h-full bg-gray-100 overflow-auto">
            {errorMessage ? (
               <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
                     <div className="text-red-500 mb-4">⚠️</div>
                     <h3 className="text-lg font-medium mb-2">Document Loading Error</h3>
                     <p className="text-gray-600 mb-4">{errorMessage}</p>
                     <Button
                        onClick={() => window.open(fileUrl, "_blank")}
                        variant="outline"
                     >
                        Download Document Instead
                     </Button>
                  </div>
               </div>
            ) : (
               <DocViewer
                  documents={docs}
                  pluginRenderers={DocViewerRenderers}
                  style={{ height: "100%" }}
                  config={{
                     header: {
                        disableHeader: true,
                        disableFileName: true,
                     },
                     pdfZoom: {
                        defaultZoom: 1.0,
                        zoomJump: 0.2,
                     },
                     pdfVerticalScrollByDefault: true,
                  }}
               />
            )}
         </div>
      </div>
   );
};

export default DocumentViewer;