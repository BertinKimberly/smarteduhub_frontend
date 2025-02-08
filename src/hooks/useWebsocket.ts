import { useEffect, useState } from "react";

export const useWebSocket = (channelId: string | null) => {
   const [messages, setMessages] = useState<string[]>([]);
   const [socket, setSocket] = useState<WebSocket | null>(null);

   useEffect(() => {
      if (channelId) {
         const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${channelId}`);
         setSocket(ws);

         ws.onopen = () => {
            console.log("WebSocket connection established");
         };

         ws.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
         };

         ws.onerror = (error) => {
            console.error("WebSocket error:", error);
         };

         ws.onclose = () => {
            console.log("WebSocket connection closed");
         };

         return () => {
            ws.close();
         };
      }
   }, [channelId]);

   const sendMessage = (message: string) => {
      if (socket) {
         socket.send(message);
      }
   };

   return { sendMessage, messages };
};
