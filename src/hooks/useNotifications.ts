import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types/notification";
import { authorizedAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export const useNotifications = (skip: number = 0, limit: number = 50) => {
   const queryClient = useQueryClient();
   const { user } = useAuthStore();

   const { data: notifications, isLoading } = useQuery({
      queryKey: ["notifications", skip, limit],
      queryFn: async () => {
         const response = await authorizedAPI.get<Notification[]>(
            `/notifications?skip=${skip}&limit=${limit}`
         );
         return response.data;
      },
      enabled: !!user,
      refetchInterval: 30000,
   });

   const markAsRead = useMutation({
      mutationFn: async (notificationId: string) => {
         const response = await authorizedAPI.patch(
            `/notifications/${notificationId}/read`
         );
         return response.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["notifications"] });
      },
   });

   const markAllAsRead = useMutation({
      mutationFn: async () => {
         const response = await authorizedAPI.patch(
            "/notifications/read-all"
         );
         return response.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["notifications"] });
      },
   });

   return {
      notifications,
      isLoading,
      markAsRead,
      markAllAsRead,
   };
};
