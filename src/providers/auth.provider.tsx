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
                .find((row) => row.startsWith("auth-token="))
                ?.split("=")[1];

            if (!token) {
                console.error("No token found.");
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            const decodedToken: any = jwtDecode(token);
            if (!decodedToken.id) {
                console.error("User ID not found in token.");
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            // Fetch full user details from API
            const response = await authorizedAPI.get(`/auth/users/${decodedToken.id}`);
            const userData = response.data;

            setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
            });

            setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="items-center justify-center flex min-h-screen">
                <h4>Loading...</h4>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthProvider;
