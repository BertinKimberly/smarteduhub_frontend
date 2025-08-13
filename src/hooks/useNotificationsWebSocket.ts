"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

export const useNotificationsWebSocket = () => {
   //@ts-ignore
   const { user, token } = useAuthStore();
   const queryClient = useQueryClient();

   useEffect(() => {
      if (!user || !token) return;

      const ws = new WebSocket(
         `${process.env.NEXT_PUBLIC_WS_URL}/ws/notifications?token=${token}`
      );

      ws.onopen = () => {
         ws.send(JSON.stringify({ user_id: user.id }));
      };

      ws.onmessage = (event) => {
         const data = JSON.parse(event.data);
         if (data.type === "NOTIFICATION") {
            // Invalidate and refetch notifications
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
         }
      };

      return () => {
         ws.close();
      };
   }, [user, token, queryClient]);
};
