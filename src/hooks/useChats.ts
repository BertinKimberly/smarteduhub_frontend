import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";

// Fetch all channels
const getAllChannels = (): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.get("/chat/channels"));
};

// Create a new channel
const createChannel = (formData: any): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post("/chat/channels", formData)
   );
};

const getMessagesByChannel = ({ queryKey }: any): Promise<any> => {
   const [_, channelId] = queryKey;
   return handleApiRequest(() =>
      authorizedAPI.get(`/chat/messages/${channelId}`)
   );
};

// Update the createMessage interface if you have one
interface CreateMessageData {
   channel_id: string;
   message: string;
   user_id: string;
   timestamp: string;
}

// Send a new message
const createMessage = (formData: CreateMessageData): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.post("/chat", formData));
};

// React Query Hooks
export const useGetAllChannels = () =>
   useQuery<any, Error>({ queryKey: ["channels"], queryFn: getAllChannels });

export const useCreateChannel = () => {
   return useMutation<any, Error, any>({
      mutationFn: createChannel,
   });
};

export const useGetMessagesByChannel = (channelId: string) =>
   useQuery<any, Error, any>({
      queryKey: ["messages", channelId],
      queryFn: getMessagesByChannel,
      enabled: !!channelId, // Prevents querying if channelId is empty
   });

export const useCreateMessage = () => {
   return useMutation<any, Error, any>({
      mutationFn: createMessage,
   });
};
