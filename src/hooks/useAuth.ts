import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useAuthStore } from "@/store/useAuthStore";
import { UserUpdate } from "@/types/user";
import { Cookies } from "react-cookie";

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

// Add these interfaces
interface OAuthResponse {
   auth_url: string;
}

interface OAuthCallbackResponse {
   access_token: string;
   token_type: string;
   expires_in: number;
   user: User;
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

const initiateOAuth = (provider: string, role?: string) => {
   // For login (no role), just use provider in state
   // For register (with role), include role in state
   const stateString = role
      ? `${provider}-${role}-${Math.random().toString(36).substring(7)}`
      : `${provider}-${Math.random().toString(36).substring(7)}`;

   return handleApiRequest(() =>
      unauthorizedAPI.get<OAuthResponse>(
         `/auth/oauth/${provider}?state=${stateString}${
            role ? `&role=${role}` : ""
         }`
      )
   );
};

const handleOAuthCallback = (provider: string, code: string) => {
   return handleApiRequest(() =>
      unauthorizedAPI.get<OAuthCallbackResponse>(
         `/auth/oauth/${provider}/callback`,
         {
            params: { code },
            withCredentials: true,
         }
      )
   );
};

const updateUserProfile = async (userData: UserUpdate) => {
   const userId = useAuthStore.getState().user?.id;
   if (!userId) throw new Error("User ID not found");

   return handleApiRequest(() =>
      authorizedAPI.put(`/users/${userId}`, userData, { withCredentials: true })
   );
};

const fetchUserProfile = async () => {
   return handleApiRequest(() =>
      authorizedAPI.get("/users/profile", {
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
            setUser(data.user);
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

export const useInitiateOAuth = () => {
   return useMutation({
      mutationFn: ({ provider, role }: { provider: string; role?: string }) =>
         initiateOAuth(provider, role),
      onSuccess: (data) => {
         if (data?.auth_url) {
            window.location.href = data.auth_url;
         }
      },
      onError: (error) => {
         console.error("OAuth initiation error:", error);
      },
   });
};

export const useOAuthCallback = () => {
   const { setUser, setIsAuthenticated } = useAuthStore();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
         provider,
         code,
         state,
      }: {
         provider: string;
         code: string;
         state: string;
      }) => {
         const response = await handleOAuthCallback(provider, code);
         if (response?.user) {
            setUser(response.user);
            setIsAuthenticated(true);
         }
         return response;
      },
   });
};

export const useUpdateProfile = () => {
   const { setUser } = useAuthStore();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateUserProfile,
      onSuccess: (data) => {
         if (data?.user) {
            setUser(data.user);
            queryClient.invalidateQueries({ queryKey: ["profile"] });
         }
      },
      onError: (error) => {
         console.error("Profile update error:", error);
      },
   });
};

export const useProfile = () => {
   return useQuery({
      queryKey: ["profile"],
      queryFn: fetchUserProfile,
      staleTime: 1000 * 60 * 5,
   });
};
