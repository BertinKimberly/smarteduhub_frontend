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

interface SignupData {
   name: string;
   email: string;
   password: string;
}

// API call functions
const loginUser = (userData: LoginData) => {
   return handleApiRequest(() =>
      unauthorizedAPI.post("/auth/login", userData, { withCredentials: true })
   );
};

const registerUser = (userData: SignupData) => {
   return handleApiRequest(() =>
      unauthorizedAPI.post("/auth/signup", userData, { withCredentials: true })
   );
};

const logoutUser = () => {
   return handleApiRequest(() =>
      authorizedAPI.post("/auth/logout", {}, { withCredentials: true })
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

export const useLoginUser = () => {
   const { setUser, setIsAuthenticated } = useAuthStore();

   return useMutation({
      mutationFn: loginUser,
      onSuccess: (data) => {
         if (data && data.user) {
            setUser(data.user); // Update Zustand store with user data
            setIsAuthenticated(true);
         }
      },
      onError: (error) => {
         console.error("Login error:", error);
      },
   });
};

export const useRegisterUser = () => {
   const { setUser, setIsAuthenticated } = useAuthStore();

   return useMutation({
      mutationFn: registerUser,
      onSuccess: (data) => {
         if (data && data.user) {
            setUser(data.user); // Update Zustand store with user data
            setIsAuthenticated(true);
         }
      },
      onError: (error) => {
         console.error("Signup error:", error);
      },
   });
};

export const useLogoutUser = () => {
   const { clearUser } = useAuthStore();

   return useMutation({
      mutationFn: logoutUser,
      onSuccess: () => {
         clearUser(); // Clear user data from Zustand store
      },
      onError: (error) => {
         console.error("Logout error:", error);
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
