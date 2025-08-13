"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { authorizedAPI } from "@/lib/api";

interface AuthProviderProps {
   children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const { setUser, setIsAuthenticated } = useAuthStore();
   const [loading, setLoading] = useState(true);

   const fetchUserData = async () => {
      try {
         const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];

         // If no token is found, just set authenticated to false and continue
         if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
         }

         try {
            const decodedToken: any = jwtDecode(token);

            // If token is invalid or missing ID, handle as unauthenticated
            if (!decodedToken.id) {
               setIsAuthenticated(false);
               setLoading(false);
               return;
            }

            // Fetch full user details from API
            const response = await authorizedAPI.get(
               `/users/${decodedToken.id}`
            );
            const userData = response.data;

            setUser({
               id: userData.id,
               name: userData.name,
               email: userData.email,
               role: userData.role,
            });

            setIsAuthenticated(true);
         } catch (tokenError) {
            // Invalid token or decode error, handle as unauthenticated
            setIsAuthenticated(false);
         }
      } catch (error) {
         // API or network error
         setIsAuthenticated(false);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUserData();
   }, []);

   // Optional: Show loading state only if it takes longer than a threshold
   const [showLoading, setShowLoading] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => {
         if (loading) {
            setShowLoading(true);
         }
      }, 500); // Show loading spinner after 500ms

      return () => clearTimeout(timer);
   }, [loading]);

   if (loading && showLoading) {
      return (
         <div className="items-center justify-center flex min-h-screen">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main mx-auto"></div>
               <p className="mt-4 text-main">Loading...</p>
            </div>
         </div>
      );
   }

   return <>{children}</>;
};

export default AuthProvider;
