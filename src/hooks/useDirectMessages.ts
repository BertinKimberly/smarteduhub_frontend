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
   return handleApiRequest(() => authorizedAPI.post("/chat/dm/", data));
};

const markMessagesAsRead = (
   recipientId: string,
   senderId: string
): Promise<void> => {
   return handleApiRequest(() =>
      authorizedAPI.post(`/chat/dm/read/${recipientId}/${senderId}`)
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
