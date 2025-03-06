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

export const useDMWebSocket = (userId: string | null) => {
   const [messages, setMessages] = useState<any[]>([]);
   const [socket, setSocket] = useState<WebSocket | null>(null);
   const [isConnected, setIsConnected] = useState(false);

   useEffect(() => {
      let ws: WebSocket | null = null;

      const connectWebSocket = () => {
         if (userId) {
            ws = new WebSocket(
               `ws://127.0.0.1:8000/api/v1/chat/ws/dm/${userId}`
            );
            setSocket(ws);

            ws.onopen = () => {
               setIsConnected(true);
               console.log("DM WebSocket Connected");
            };

            ws.onmessage = (event) => {
               try {
                  const parsedData = JSON.parse(event.data);
                  setMessages((prev) => {
                     // Avoid duplicate messages
                     const isDuplicate = prev.some(
                        (msg) =>
                           msg.id === parsedData.id ||
                           (msg.message === parsedData.message &&
                              msg.timestamp === parsedData.timestamp)
                     );
                     if (isDuplicate) return prev;
                     return [...prev, parsedData];
                  });
               } catch (e) {
                  console.error("Error parsing DM:", e);
               }
            };

            ws.onerror = (error) => {
               console.error("DM WebSocket error:", error);
               setIsConnected(false);
            };

            ws.onclose = () => {
               console.log("DM WebSocket closed");
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
   }, [userId]);

   const sendMessage = (messageData: {
      sender_id: string;
      recipient_id: string;
      message: string;
   }) => {
      if (socket?.readyState === WebSocket.OPEN) {
         const messageWithTimestamp = {
            ...messageData,
            timestamp: new Date().toISOString(),
         };
         socket.send(JSON.stringify(messageWithTimestamp));
      } else {
         console.error("DM WebSocket is not connected");
      }
   };

   return { sendMessage, messages, isConnected };
};
