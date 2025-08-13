//@ts-nocheck
import { authorizedAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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

// Add function to invite users to a channel
const inviteToChannel = (data: {
   channelId: string;
   userIds: string[];
}): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.post(`/chat/channels/${data.channelId}/invite`, {
         user_ids: data.userIds,
      })
   );
};

// Add these new functions and hooks
const getChannelMembers = (channelId: string): Promise<any> => {
   return handleApiRequest(() =>
      authorizedAPI.get(`/chat/channels/${channelId}/members`)
   );
};

export const useGetChannelMembers = (channelId: string | null) => {
   return useQuery({
      queryKey: ["channelMembers", channelId],
      queryFn: () => getChannelMembers(channelId!),
      enabled: !!channelId,
   });
};

export const useInviteMembers = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({
         channelId,
         userIds,
      }: {
         channelId: string;
         userIds: string[];
      }) =>
         authorizedAPI.post(`/chat/channels/${channelId}/invite`, {
            user_ids: userIds,
         }),
      onSuccess: (_, variables) => {
         // Invalidate channel members query
         queryClient.invalidateQueries({
            queryKey: ["channelMembers", variables.channelId],
         });
      },
   });
};

// React Query Hooks
const checkChannelAccess = (channel: any, user: any): boolean => {
   if (!user) return false;

   // Admin can access special channels
   if (user.role === "admin") {
      return true;
   }

   // Check special channels access
   const channelName = channel.name.toLowerCase();
   if (channelName === "students" && user.role === "student") return true;
   if (channelName === "teachers" && user.role === "teacher") return true;
   if (channelName === "parents" && user.role === "parent") return true;
   if (
      channelName === "parents-teachers" &&
      (user.role === "parent" || user.role === "teacher")
   )
      return true;

   // Check if user created the channel or is a member
   return (
      String(channel.creator_id) === String(user.id) ||
      (Array.isArray(channel.members) &&
         channel.members.includes(String(user.id)))
   );
};

export const useGetAllChannels = () => {
   const queryClient = useQueryClient();
   const { user } = useAuthStore(); // Add this line to get current user

   return useQuery<any, Error>({
      queryKey: ["channels"],
      queryFn: getAllChannels,
      select: (data) => {
         // Filter channels based on user access
         return data.filter((channel: any) =>
            checkChannelAccess(channel, user)
         );
      },
      onSuccess: (data) => {
         queryClient.setQueryData(["channels"], data);
      },
   });
};

export const useCreateChannel = () => {
   const queryClient = useQueryClient();
   const { user } = useAuthStore();

   return useMutation<any, Error, any>({
      mutationFn: (channelData) =>
         createChannel({
            ...channelData,
            creator_id: user?.id,
            members: [user?.id], // Initialize members array with creator
         }),
      onSuccess: async (newChannel) => {
         // Update local cache
         const currentChannels = queryClient.getQueryData(["channels"]) || [];
         queryClient.setQueryData(
            ["channels"],
            [...currentChannels, { ...newChannel, creator_id: user?.id }]
         );
         await queryClient.invalidateQueries({ queryKey: ["channels"] });
      },
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

// Add the new mutation hook
export const useInviteToChannel = () => {
   return useMutation<any, Error, any>({
      mutationFn: inviteToChannel,
   });
};

// Add this new hook for handling real-time channel updates
export const useChannelWebSocket = () => {
   const queryClient = useQueryClient();

   useEffect(() => {
      const ws = new WebSocket(`ws://localhost:8000/chat/ws/channels`);

      ws.onmessage = (event) => {
         const data = JSON.parse(event.data);

         if (data.type === "channel_created") {
            // Get current channels
            const currentChannels =
               queryClient.getQueryData(["channels"]) || [];

            // Update cache with new channel
            queryClient.setQueryData(
               ["channels"],
               [...currentChannels, data.data]
            );
         }
      };

      return () => {
         ws.close();
      };
   }, [queryClient]);
};
