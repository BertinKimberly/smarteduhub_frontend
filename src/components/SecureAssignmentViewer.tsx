"use client";
import React, { useEffect, useState } from "react";
//@ts-ignore
import FormfacadeEmbed from "@formfacade/embed-react";
import {
   Shield,
   AlertTriangle,
   Lock,
   CheckCircle,
   RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubmitAssignment } from "@/hooks/useAssignments";
import { toast } from "react-toastify";

interface Assignment {
   id: string;
   title: string;
   description?: string;
   course_id: string;
   google_form_url?: string;
   created_at: string;
   course: {
      id: string;
      title: string;
   };
   submitted_at?: string;
   due_date?: string;
}

interface SecureAssignmentViewerProps {
   assignment: Assignment;
   onClose?: () => void;
}

const SecureAssignmentViewer: React.FC<SecureAssignmentViewerProps> = ({
   assignment,
   onClose,
}) => {
   const submitAssignmentMutation = useSubmitAssignment();
   const [isFullscreen, setIsFullscreen] = useState(false);
   const [securityStatus, setSecurityStatus] = useState<
      "initial" | "secure" | "warning" | "completed"
   >("initial");
   const [warningSeverity, setWarningSeverity] = useState(0);
   const [warningMessage, setWarningMessage] = useState("");

   const handleSecurityViolation = (type: string) => {
      setSecurityStatus("warning");
      setWarningSeverity((prev) => Math.min(prev + 1, 3));

      switch (type) {
         case "fullscreen":
            setWarningMessage(
               "Please stay in fullscreen mode to continue your assignment."
            );
            break;
         case "copy":
            setWarningMessage(
               "Copying is not allowed during this secure assignment."
            );
            break;
         case "paste":
            setWarningMessage(
               "Pasting is not allowed during this secure assignment."
            );
            break;
         default:
            setWarningMessage(
               "Security violation detected. Please follow assignment rules."
            );
      }

      // Auto-reset warning after 3 seconds
      setTimeout(() => {
         if (document.fullscreenElement) {
            setSecurityStatus("secure");
         }
      }, 3000);
   };

   useEffect(() => {
      if (!isFullscreen) return;

      // Prevent tab closing
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
         e.preventDefault();
         e.returnValue =
            "Are you sure you want to leave? Your progress may be lost and this action will be recorded.";
         return e.returnValue;
      };

      // Prevent copying
      const handleCopy = (e: ClipboardEvent) => {
         e.preventDefault();
         handleSecurityViolation("copy");
         return false;
      };

      // Prevent pasting
      const handlePaste = (e: ClipboardEvent) => {
         e.preventDefault();
         handleSecurityViolation("paste");
         return false;
      };

      // Prevent right-click
      const handleContextMenu = (e: MouseEvent) => {
         e.preventDefault();
         return false;
      };

      // Prevent key combinations
      const handleKeyDown = (e: KeyboardEvent) => {
         // Prevent PrintScreen
         if (e.key === "PrintScreen") {
            e.preventDefault();
            handleSecurityViolation("screenshot");
            return false;
         }

         // Prevent Ctrl+C (copy)
         if (e.ctrlKey && e.key === "c") {
            e.preventDefault();
            handleSecurityViolation("copy");
            return false;
         }

         // Prevent Ctrl+V (paste)
         if (e.ctrlKey && e.key === "v") {
            e.preventDefault();
            handleSecurityViolation("paste");
            return false;
         }

         // Prevent Ctrl+P (print)
         if (e.ctrlKey && e.key === "p") {
            e.preventDefault();
            handleSecurityViolation("print");
            return false;
         }

         // Prevent Alt+Tab (switch tabs)
         if (e.altKey && e.key === "Tab") {
            e.preventDefault();
            handleSecurityViolation("switch");
            return false;
         }
      };

      // Detect fullscreen change
      const handleFullscreenChange = () => {
         const isCurrentlyFullscreen = document.fullscreenElement !== null;
         setIsFullscreen(isCurrentlyFullscreen);

         if (isCurrentlyFullscreen) {
            setSecurityStatus("secure");
         } else if (securityStatus !== "completed") {
            handleSecurityViolation("fullscreen");
            // Attempt to re-enter fullscreen
            setTimeout(requestFullscreen, 1000);
         }
      };

      // Add event listeners
      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("copy", handleCopy);
      document.addEventListener("paste", handlePaste);
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("fullscreenchange", handleFullscreenChange);

      // Return cleanup function
      return () => {
         window.removeEventListener("beforeunload", handleBeforeUnload);
         document.removeEventListener("copy", handleCopy);
         document.removeEventListener("paste", handlePaste);
         document.removeEventListener("contextmenu", handleContextMenu);
         document.removeEventListener("keydown", handleKeyDown);
         document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
         );
      };
   }, [isFullscreen, securityStatus]);

   const requestFullscreen = () => {
      try {
         const elem = document.documentElement;
         if (elem.requestFullscreen) {
            elem.requestFullscreen();
         } else if ((elem as any).mozRequestFullScreen) {
            (elem as any).mozRequestFullScreen();
         } else if ((elem as any).webkitRequestFullscreen) {
            (elem as any).webkitRequestFullscreen();
         } else if ((elem as any).msRequestFullscreen) {
            (elem as any).msRequestFullscreen();
         }
      } catch (error) {
         console.error("Could not enter fullscreen mode:", error);
      }
   };

   const startSecureAssignment = async () => {
      try {
         await document.documentElement.requestFullscreen();
         setIsFullscreen(true);
         setSecurityStatus("secure");
      } catch (error) {
         console.error("Failed to enter fullscreen:", error);
         toast.error("Failed to enter fullscreen mode");
      }
   };

   const prefillForm = () => ({
      "entry.1297600622": assignment.course.title,
      "entry.813617742": `${new Date()}`,
   });

   const onSubmitForm = async () => {
      try {
         await submitAssignmentMutation.mutateAsync({
            assignmentId: assignment.id,
         });
         setSecurityStatus("completed");

         // Exit fullscreen when form is submitted
         if (document.exitFullscreen) {
            document.exitFullscreen();
         }

         toast.success("Assignment submitted successfully!");
         onClose?.(); // Close the viewer after submission
      } catch (error) {
         toast.error("Failed to submit assignment");
         console.error("Submission error:", error);
      }
   };

   const onFormLoad = () => {
      console.log("----FORM LOADED----");
   };

   // Helper function to convert Google Form URL to embedded URL
   const getFormEmbedUrl = (url: string) => {
      // Handle both formats: forms/d/e/ and forms/d/
      const formId =
         url.match(/\/forms\/d\/e\/([^\/]+)\/|\/forms\/d\/([^\/]+)/)?.[1] ||
         url.match(/\/forms\/d\/([^\/]+)/)?.[1];
      if (!formId) return url;
      return `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true&usp=pp_url`;
   };

   if (assignment.submitted_at) {
      return (
         <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
               <p className="font-medium text-green-700">
                  Assignment Completed
               </p>
               <p className="text-green-600 text-sm">
                  You submitted this assignment successfully.
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="mt-4">
         {!isFullscreen ? (
            <div className="border border-blue-200 rounded-lg bg-blue-50 p-5">
               <div className="flex items-start mb-4">
                  <Shield className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                     <h4 className="font-semibold text-blue-700 mb-1">
                        Secure Assignment
                     </h4>
                     <p className="text-blue-600 text-sm mb-3">
                        This assignment uses secure mode to ensure academic
                        integrity. When you start the assignment:
                     </p>
                     <ul className="text-blue-600 text-sm list-disc list-inside space-y-1 mb-4">
                        <li>Your browser will enter fullscreen mode</li>
                        <li>Copy/paste functionality will be disabled</li>
                        <li>Screenshots will be prevented</li>
                        <li>Tab switching will be restricted</li>
                     </ul>
                     <p className="text-blue-600 text-sm">
                        Please ensure you have enough time to complete the
                        assignment before starting.
                     </p>
                  </div>
               </div>
               <Button
                  onClick={startSecureAssignment}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium"
               >
                  <Lock className="mr-2 h-4 w-4" />
                  Start Secure Assignment
               </Button>
            </div>
         ) : (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
               {/* Security Status Bar */}
               <div className="sticky top-0 z-10 p-4 bg-white border-b">
                  {securityStatus === "warning" && (
                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
                        <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                        <p className="text-red-700">{warningMessage}</p>
                     </div>
                  )}
                  {securityStatus === "secure" && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                        <Shield className="h-5 w-5 text-green-600 mr-2" />
                        <p className="text-green-700 text-sm font-medium">
                           Secure Mode Active - {assignment.title}
                        </p>
                     </div>
                  )}
               </div>

               {/* Form Content */}
               <div className="flex-1 overflow-auto">
                  {assignment.google_form_url && (
                     <iframe
                        src={getFormEmbedUrl(assignment.google_form_url)}
                        className="w-full h-full border-0"
                        onLoad={(e) => {
                           console.log("Form loaded");
                           onFormLoad();
                        }}
                     />
                  )}
               </div>

               {/* Submit Button */}
               <div className="sticky bottom-0 p-4 bg-white border-t">
                  <Button
                     onClick={onSubmitForm}
                     className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                     Submit Assignment
                  </Button>
               </div>
            </div>
         )}
      </div>
   );
};

export default SecureAssignmentViewer;
