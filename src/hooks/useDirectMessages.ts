//@ts-nocheck

import { useMutation, useQuery } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

interface DirectMessage {
   id: string;
   sender_id: string;
   recipient_id: string;
   message: string;
   timestamp: string;
   is_read: boolean;
}

const getDMHistory = ({ queryKey }: any): Promise<DirectMessage[]> => {
   const [_, user1Id, user2Id] = queryKey;
   return handleApiRequest(() =>
      authorizedAPI.get(`/chat/dm/${user1Id}/${user2Id}`)
   );
};

const sendDirectMessage = (data: {
   sender_id: string;
   recipient_id: string;
   message: string;
}): Promise<DirectMessage> => {
   return handleApiRequest(() =>
      authorizedAPI.post("/chat/dm/", data, {
         headers: {
            "Content-Type": "application/json",
         },
      })
   );
};

const markMessagesAsRead = (
   recipientId: string,
   senderId: string
): Promise<void> => {
   return handleApiRequest(() =>
      authorizedAPI.post(`/chat/dm/read/${recipientId}/${senderId}`)
   );
};

const getActiveConversations = (userId: string): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.get(`/chat/dm/conversations/user/${userId}`, {
         headers: {
            Accept: "application/json",
         },
      })
   );
};

export const useGetDMHistory = (user1Id: string, user2Id: string) => {
   return useQuery<DirectMessage[], Error>({
      queryKey: ["dm-history", user1Id, user2Id],
      queryFn: getDMHistory,
      enabled: !!(user1Id && user2Id),
   });
};

export const useSendDirectMessage = () => {
   return useMutation<DirectMessage, Error, any>({
      mutationFn: sendDirectMessage,
   });
};

export const useMarkMessagesAsRead = () => {
   return useMutation<void, Error, { recipientId: string; senderId: string }>({
      mutationFn: ({ recipientId, senderId }) =>
         markMessagesAsRead(recipientId, senderId),
   });
};

export const useActiveConversations = (userId: string) => {
   return useQuery({
      queryKey: ["active-conversations", userId],
      queryFn: () => getActiveConversations(userId),
      enabled: !!userId && userId.length > 10, // Only enable if we have a valid-looking UUID
      refetchOnWindowFocus: true, // Add this to keep conversations up to date
      staleTime: 1000 * 60, // Consider data stale after 1 minute
      onSuccess: (data: any) => {
         console.log("Conversations fetched successfully:", data);
      },
      onError: (error: any) => {
         console.error(
            "Error fetching conversations:",
            error?.response?.data || error
         );
      },
   });
};
