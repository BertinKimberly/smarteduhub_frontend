import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authorizedAPI, unauthorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useAuthStore } from "@/store/useAuthStore";
import { UserUpdate } from "@/types/user";
import { Cookies } from "react-cookie";

interface User {
   id: string;
   username?: string;
   name: string;
   email: string;
   phone?: string;
   country?: string;
   field_of_study?: string;
   role: string;
   is_active: boolean;
   is_superuser: boolean;
   created_at: string;
   oauth_provider?: string;
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
   confirmPassword: string;
   role: string;
   username?: string;
   phone?: string;
   country?: string;
   field_of_study?: string;
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

const logoutUser = async () => {
   try {
      await authorizedAPI.post("/auth/logout", {}, { withCredentials: true });
      // Clear cookies manually as fallback
      document.cookie =
         "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      // Clear local storage
      localStorage.removeItem("auth-storage");
      return true;
   } catch (error) {
      console.error("Logout error:", error);
      throw error;
   }
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
   const router = useRouter();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: logoutUser,
      onSuccess: () => {
         clearUser(); // Clear user data from Zustand store
         // Clear React Query cache
         queryClient.clear();
         // Redirect to login
         location.replace("/login");
      },
      onError: (error) => {
         console.error("Logout error:", error);
         // Even if the API call fails, clear local data
         clearUser();
         localStorage.removeItem("auth-storage");
         location.replace("/login");
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
   const router = useRouter();

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
         try {
            const response = await handleOAuthCallback(provider, code);
            if (response?.user) {
               setUser(response.user);
               setIsAuthenticated(true);

               // Get role from user data
               const role = response.user.role;

               // Redirect based on role
               switch (role) {
                  case "admin":
                     router.push("/admin");
                     break;
                  case "teacher":
                     router.push("/teacher");
                     break;
                  case "parent":
                     router.push("/parent");
                     break;
                  case "student":
                     router.push("/student");
                     break;
                  default:
                     router.push("/student");
               }
            }
            return response;
         } catch (error) {
            console.error("OAuth callback error:", error);
            location.replace("/login");
            throw error;
         }
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
