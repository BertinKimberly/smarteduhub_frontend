"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();

// Create a client component that uses the search params
function CallbackHandler() {
   const [isProcessing, setIsProcessing] = useState(true);
   const searchParams = useSearchParams();
   const token = searchParams.get("token");
   const error = searchParams.get("error");

   useEffect(() => {
      if (error) {
         toast.error(error);
         window.location.replace("/login");
         return;
      }

      if (token) {
         try {
            // Remove any existing token
            cookies.remove("access_token", { path: "/" });

            // Set the new token with proper options
            cookies.set("access_token", token, {
               path: "/",
               secure: true,
               sameSite: "lax",
            });

            // Log token for debugging
            console.log("Token set:", token);
            console.log("Cookie value:", cookies.get("access_token"));

            // Decode token to get role
            const decoded: any = jwtDecode(token);
            console.log("Decoded token:", decoded);

            // Redirect based on role with a slight delay to ensure cookie is set
            setTimeout(() => {
               switch (decoded.role) {
                  case "admin":
                     window.location.href = "/admin";
                     break;
                  case "teacher":
                     window.location.href = "/teacher";
                     break;
                  case "parent":
                     window.location.href = "/parent";
                     break;
                  case "student":
                     window.location.href = "/student";
                     break;
                  default:
                     window.location.href = "/student";
               }
            }, 100);
         } catch (error) {
            console.error("Token processing error:", error);
            toast.error("Authentication failed");
            window.location.replace("/login");
         }
      }
   }, [token, error]);

   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="text-center">
            <h2 className="text-xl mb-4">Processing your login...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main mx-auto"></div>
         </div>
      </div>
   );
}

// Create a loading component
function Loading() {
   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="text-center">
            <h2 className="text-xl mb-4">Loading...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main mx-auto"></div>
         </div>
      </div>
   );
}

// Main component with Suspense boundary
export default function OAuthCallback() {
   return (
      <Suspense fallback={<Loading />}>
         <CallbackHandler />
      </Suspense>
   );
}
