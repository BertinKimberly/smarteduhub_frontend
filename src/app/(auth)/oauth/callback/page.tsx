"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();

export default function OAuthCallback() {
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
            // Store the token
            cookies.remove("access_token", { path: "/" });
            cookies.set("access_token", token, { path: "/" });

            // Decode token to get role
            const decoded: any = jwtDecode(token);

            // Redirect based on role
            switch (decoded.role) {
               case "admin":
                  window.location.replace("/admin");
                  break;
               case "teacher":
                  window.location.replace("/teacher");
                  break;
               case "parent":
                  window.location.replace("/parent");
                  break;
               case "student":
                  window.location.replace("/student");
                  break;
               default:
                  window.location.replace("/student");
            }
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
