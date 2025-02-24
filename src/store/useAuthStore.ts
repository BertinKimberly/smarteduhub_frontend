// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
   id: string;
   name: string;
   email: string;
   role: string;
   phone?: string;
   address?: string;
   // Add any other relevant fields
}

interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   setUser: (user: User | null) => void;
   clearUser: () => void;
   setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create(
   persist<AuthState>(
      (set) => ({
         user: null,
         isAuthenticated: false,
         setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
         clearUser: () => set({ user: null, isAuthenticated: false }),
         setIsAuthenticated: (isAuthenticated: boolean) =>
            set({ isAuthenticated }),
      }),
      {
         name: "auth-storage", // Unique name for localStorage
      }
   )
);
