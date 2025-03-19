//@ts-nocheck
import { useEffect, useState } from "react";

interface ChatMessage {
   channel_id: string;
   message: string;
   user_id: string;
   timestamp: string;
}

interface WebSocketMessage {
   type: string;
   data: any;
}

export const useWebSocket = (channelId: string | null) => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [socket, setSocket] = useState<WebSocket | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(
      null
   );

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
                  const data = JSON.parse(event.data);
                  setLastMessage(data);

                  if (data.type) {
                     switch (data.type) {
                        case "message_edited":
                           setMessages((prev) =>
                              prev.map((msg) =>
                                 msg.id === data.data.id ? data.data : msg
                              )
                           );
                           break;

                        case "message_deleted":
                           setMessages((prev) =>
                              prev.filter(
                                 (msg) => msg.id !== data.data.message_id
                              )
                           );
                           break;

                        case "message_reacted":
                           setMessages((prev) =>
                              prev.map((msg) =>
                                 msg.id === data.data.message_id
                                    ? {
                                         ...msg,
                                         reactions: [
                                            ...(msg.reactions || []),
                                            data.data.reaction,
                                         ],
                                      }
                                    : msg
                              )
                           );
                           break;

                        default:
                           // Handle regular messages
                           setMessages((prev) => [...prev, data]);
                     }
                  } else {
                     // Handle regular messages
                     setMessages((prev) => [...prev, data]);
                  }
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

   return { sendMessage, messages, isConnected, lastMessage };
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
                  const data = JSON.parse(event.data);

                  if (data.type) {
                     switch (data.type) {
                        case "message_edited":
                           setMessages((prev) =>
                              prev.map((msg) =>
                                 msg.id === data.data.id ? data.data : msg
                              )
                           );
                           break;

                        case "message_deleted":
                           setMessages((prev) =>
                              prev.filter(
                                 (msg) => msg.id !== data.data.message_id
                              )
                           );
                           break;

                        case "message_reacted":
                           setMessages((prev) =>
                              prev.map((msg) =>
                                 msg.id === data.data.message_id
                                    ? {
                                         ...msg,
                                         reactions: [
                                            ...(msg.reactions || []),
                                            data.data.reaction,
                                         ],
                                      }
                                    : msg
                              )
                           );
                           break;

                        default:
                           // Handle regular messages with duplicate check
                           setMessages((prev) => {
                              const isDuplicate = prev.some(
                                 (msg) =>
                                    msg.id === data.id ||
                                    (msg.message === data.message &&
                                       msg.timestamp === data.timestamp)
                              );
                              if (isDuplicate) return prev;
                              return [...prev, data];
                           });
                     }
                  } else {
                     // Handle regular messages with duplicate check
                     setMessages((prev) => {
                        const isDuplicate = prev.some(
                           (msg) =>
                              msg.id === data.id ||
                              (msg.message === data.message &&
                                 msg.timestamp === data.timestamp)
                        );
                        if (isDuplicate) return prev;
                        return [...prev, data];
                     });
                  }
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
