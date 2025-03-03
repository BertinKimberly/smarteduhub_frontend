import { useEffect, useState } from "react";

interface ChatMessage {
   channel_id: string;
   message: string;
   user_id: string;
   timestamp: string;
}

export const useWebSocket = (channelId: string | null) => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [socket, setSocket] = useState<WebSocket | null>(null);
   const [isConnected, setIsConnected] = useState(false);

   useEffect(() => {
      let ws: WebSocket | null = null;

      const connectWebSocket = () => {
         if (channelId) {
            ws = new WebSocket(
               `ws://127.0.0.1:8000/api/v1/chat/ws/${channelId}`
            );
            setSocket(ws);

            ws.onopen = () => {
               console.log("WebSocket connection established");
               setIsConnected(true);
            };

            ws.onmessage = (event) => {
               try {
                  const parsedData: ChatMessage = JSON.parse(event.data);
                  setMessages((prev) => [...prev, parsedData]);
               } catch (e) {
                  console.error("Error parsing message:", e);
               }
            };

            ws.onerror = (error) => {
               console.error("WebSocket error:", error);
               setIsConnected(false);
            };

            ws.onclose = () => {
               console.log("WebSocket connection closed");
               setIsConnected(false);
               setTimeout(connectWebSocket, 3000);
            };
         }
      };

      connectWebSocket();

      return () => {
         if (ws) {
            ws.close();
         }
      };
   }, [channelId]);

   const sendMessage = (message: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
         socket.send(message);
      } else {
         console.error("WebSocket is not connected");
      }
   };

   return { sendMessage, messages, isConnected };
};

export const useDMWebSocket = (recipientId: string | null) => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [socket, setSocket] = useState<WebSocket | null>(null);
   const [isConnected, setIsConnected] = useState(false);

   useEffect(() => {
      let ws: WebSocket | null = null;

      const connectWebSocket = () => {
         if (recipientId) {
            ws = new WebSocket(
               `ws://127.0.0.1:8000/api/v1/chat/dm/${recipientId}`
            );
            setSocket(ws);

            ws.onopen = () => {
               setIsConnected(true);
            };

            ws.onmessage = (event) => {
               try {
                  const parsedData: ChatMessage = JSON.parse(event.data);
                  setMessages((prev) => [...prev, parsedData]);
               } catch (e) {
                  console.error("Error parsing message:", e);
               }
            };

            ws.onerror = () => {
               setIsConnected(false);
            };

            ws.onclose = () => {
               setIsConnected(false);
               setTimeout(connectWebSocket, 3000);
            };
         }
      };

      connectWebSocket();

      return () => {
         if (ws) {
            ws.close();
         }
      };
   }, [recipientId]);

   const sendMessage = (message: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
         socket.send(message);
      }
   };

   return { sendMessage, messages, isConnected };
};
