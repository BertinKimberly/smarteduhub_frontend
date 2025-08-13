import { authorizedAPI } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ChatSession {
   id: string;
   messages: Array<{ role: string; content: string }>;
   created_at: string;
   session_type: string;
   course_id?: string;
}

interface CreateSessionParams {
   messages: Array<{ role: string; content: string }>;
   session_type: string;
   title?: string;
}

const CHAT_SESSIONS_KEY = "chat-sessions";

export const useChatHistory = () => {
   const queryClient = useQueryClient();

   const {
      data: sessions = [],
      isLoading,
      error,
   } = useQuery<ChatSession[]>({
      queryKey: [CHAT_SESSIONS_KEY],
      queryFn: async () => {
         try {
            const response = await authorizedAPI.get("/ai/chat-sessions");
            return response.data;
         } catch (error) {
            console.error("Error fetching chat sessions:", error);
            return [];
         }
      },
      staleTime: 1000 * 60, // 1 minute
   });

   const createSession = async (params: CreateSessionParams) => {
      try {
         const response = await authorizedAPI.post("/ai/chat", {
            messages: params.messages,
            session_type: params.session_type,
         });

         // Invalidate and refetch chat sessions
         await queryClient.invalidateQueries({ queryKey: [CHAT_SESSIONS_KEY] });

         return response.data;
      } catch (error) {
         console.error("Error creating chat session:", error);
         throw error;
      }
   };

   return {
      sessions,
      isLoading,
      error,
      createSession,
   };
};
