import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useAuthStore } from "@/store/useAuthStore";

interface User {
   id: string;
   name: string;
   email: string;
}

interface UpdateUserData {
   userId: string;
   formData: Partial<User>;
}

interface LoginData {
   email: string;
   password: string;
}

// API call functions
const loginUser = (userData: LoginData) => {
   return handleApiRequest(
      () =>
         unauthorizedAPI.post("/auth/login", userData, {
            withCredentials: true,
         }) // To send cookies
   );
};

const registerUser = (userData: Partial<User>) => {
   return handleApiRequest(() =>
      authorizedAPI.post("/auth/signup", userData, { withCredentials: true })
   );
};

const removeUser = (userId: string) => {
   return handleApiRequest(() =>
      authorizedAPI.delete(`/auth/users/${userId}`, { withCredentials: true })
   );
};

const modifyUser = ({ userId, formData }: UpdateUserData) => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/auth/users/${userId}`, formData, {
         withCredentials: true,
      })
   );
};

// React Query Hooks
export const useLoginUser = () => {
   const setUser = useAuthStore((state) => state.setUser);
   const setRoles = useAuthStore((state) => state.setRoles);

   return useMutation({
      mutationFn: loginUser,
      onSuccess: (data) => {
         console.log("Login successful:", data);
         if (data && data.success) {
            setUser(data.data);
            setRoles(data.data.roles);
         }
      },
      onError: (error) => {
         console.error("Login error:", error);
      },
   });
};

export const useRegisterUser = () => {
   const setUser = useAuthStore((state) => state.setUser);
   const setRoles = useAuthStore((state) => state.setRoles);

   return useMutation({
      mutationFn: registerUser,
      onSuccess: (data) => {
         console.log("Signup successful:", data);
         if (data && data.success) {
            setUser(data.data);
            setRoles(data.data.roles);
         }
      },
      onError: (error) => {
         console.error("Signup error:", error);
      },
   });
};

export const useRemoveUser = () => {
   const queryClient = useQueryClient();
   return useMutation<void, Error, string>({
      mutationFn: removeUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["users-by-admin"] });
      },
   });
};

export const useModifyUser = () => {
   const queryClient = useQueryClient();
   return useMutation<void, Error, UpdateUserData>({
      mutationFn: modifyUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["users-by-admin"] });
      },
   });
};
