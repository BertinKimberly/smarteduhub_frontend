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
   file_attachments?: any[];
}

// Send a new message
const createMessage = (formData: CreateMessageData): Promise<any> => {
   return handleApiRequest(() => authorizedAPI.post("/chat", formData));
};

// Edit a message
const editMessage = (data: {
   messageId: string;
   message: string;
   userId: string;
}): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/chat/message/${data.messageId}`, {
         edit_data: { message: data.message },
         user_id: data.userId,
      })
   );
};

// Edit a direct message
const editDirectMessage = (data: {
   messageId: string;
   message: string;
   userId: string;
}): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.put(`/chat/dm/${data.messageId}`, {
         edit_data: { message: data.message },
         user_id: data.userId,
      })
   );
};

// Delete a message
const deleteMessage = (data: {
   messageId: string;
   userId: string;
}): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.delete(`/chat/message/${data.messageId}`, {
         data: { user_id: data.userId },
      })
   );
};

// Delete a direct message
const deleteDirectMessage = (data: {
   messageId: string;
   userId: string;
}): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.delete(`/chat/dm/${data.messageId}`, {
         data: { user_id: data.userId },
      })
   );
};

// Add reaction to a message
const addReaction = (data: {
   messageId: string;
   emoji: string;
   userId: string;
}): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post(
         `/chat/message/${data.messageId}/react`,
         { emoji: data.emoji, user_id: data.userId },
         { headers: { "Content-Type": "application/json" } }
      )
   );
};

// Add reaction to a direct message
const addDMReaction = (data: {
   messageId: string;
   emoji: string;
   userId: string;
}): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post(
         `/chat/dm/${data.messageId}/react`,
         { emoji: data.emoji, user_id: data.userId },
         { headers: { "Content-Type": "application/json" } }
      )
   );
};

// Upload a file
const uploadFile = (file: File): Promise<any> => {
   const formData = new FormData();
   formData.append("file", file);
   return handleApiRequest(() =>
      authorizedAPI.post("/chat/upload/", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      })
   );
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

export const useEditMessage = () => {
   return useMutation<any, Error, any>({
      mutationFn: editMessage,
   });
};

export const useEditDirectMessage = () => {
   return useMutation<any, Error, any>({
      mutationFn: editDirectMessage,
   });
};

export const useDeleteMessage = () => {
   return useMutation<any, Error, any>({
      mutationFn: deleteMessage,
   });
};

export const useDeleteDirectMessage = () => {
   return useMutation<any, Error, any>({
      mutationFn: deleteDirectMessage,
   });
};

export const useAddReaction = () => {
   return useMutation<any, Error, any>({
      mutationFn: addReaction,
   });
};

export const useAddDMReaction = () => {
   return useMutation<any, Error, any>({
      mutationFn: addDMReaction,
   });
};

export const useUploadFile = () => {
   return useMutation<any, Error, any>({
      mutationFn: uploadFile,
   });
};
