"use client";
import React, { useState, useEffect } from "react";
import {
   ResizableHandle,
   ResizablePanel,
   ResizablePanelGroup,
} from "@/components/ui/resizable";
import { File, MoveDown, PenBox, Plus, Search } from "lucide-react";
import {
   useGetAllChannels,
   useCreateChannel,
   useGetMessagesByChannel,
   useCreateMessage,
} from "@/hooks/useChats";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useAuthStore } from "@/store/useAuthStore";

const ChatArea = () => {
   const { user } = useAuthStore();
   const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
   const [message, setMessage] = useState("");
   const { data: channels } = useGetAllChannels();
   const { mutate: createChannel } = useCreateChannel();
   const { data: messages, refetch: refetchMessages } = useGetMessagesByChannel(
      selectedChannel || ""
   );
   const { mutate: sendMessage } = useCreateMessage();
   const {
      sendMessage: sendWebSocketMessage,
      messages: realTimeMessages,
      isConnected,
   } = useWebSocket(selectedChannel);

   const handleCreateChannel = () => {
      const channelName = prompt("Enter channel name:");
      if (channelName) {
         createChannel({ name: channelName });
      }
   };
   const handleSendMessage = async () => {
      if (message.trim() && selectedChannel && user) {
         const messageData = {
            channel_id: selectedChannel,
            message: message,
            user_id: user.id,
            timestamp: new Date().toISOString(),
         };

         try {
            await sendMessage(messageData);
            sendWebSocketMessage(JSON.stringify(messageData));
            setMessage("");
            refetchMessages();
         } catch (error) {
            console.error("Error sending message:", error);
         }
      }
   };

   useEffect(() => {
      if (selectedChannel) {
         refetchMessages();
         console.log("Umwami naganze", messages);
      }
   }, [selectedChannel, refetchMessages]);

   // Combine API messages and real-time messages
   const allMessages = [...(messages || []), ...realTimeMessages];

   return (
      <ResizablePanelGroup
         direction="horizontal"
         className="min-h-[85vh] max-w-md rounded-lg border md:min-w-full mt-8"
      >
         <ResizablePanel
            defaultSize={25}
            maxSize={30}
            minSize={15}
         >
            <div className="flex h-full p-6 bg-background flex-col gap-6 items-center justify-start">
               <div className="bg-[#F8F9FE] p-2 flex items-center rounded-full gap-2 px-2 h-fit">
                  <Search />
                  <input
                     className="bg-transparent border-none outline-none"
                     placeholder="Search chats..."
                  />
               </div>
               <div className="flex justify-start items-center gap-2 w-full">
                  <div>
                     Unreads
                     <span className="bg-red-500 h-10 w-10 rounded-full p-1 text-white ml-1">
                        8
                     </span>
                  </div>
                  <div className="bg-main rounded-lg p-1 flex items-center justify-center gap-4 text-white">
                     <small>New Message</small>
                     <PenBox size={15} />
                  </div>
               </div>

               <div className="flex items-center justify-between w-full">
                  <p>Channels</p>
                  <p
                     className="text-red-600 underline cursor-pointer"
                     onClick={handleCreateChannel}
                  >
                     Create
                  </p>
               </div>
               <div className="w-full flex flex-col gap-2">
                  {channels?.map((channel: any) => (
                     <div
                        key={channel.id}
                        className={`rounded-lg bg-submain p-2 w-full flex items-center gap-2 cursor-pointer justify-between ${
                           selectedChannel === channel.id
                              ? "border-main border-2"
                              : ""
                        }`}
                        onClick={() => setSelectedChannel(channel.id)}
                     >
                        <div className="flex">
                           <span className="mr-4">#</span>
                           <p>{channel.name}</p>
                        </div>
                        <div className="bg-main w-8 h-8 rounded-full p-1 flex items-center justify-center">
                           1
                        </div>
                     </div>
                  ))}
               </div>
               <div className="flex items-center justify-between w-full">
                  <p>Direct Messages</p>
                  <p className="text-red-600 underline">Clear</p>
               </div>
               <div className="w-full flex flex-col gap-2">
                  {/* DM list here */}
               </div>
            </div>
         </ResizablePanel>
         <ResizableHandle withHandle />
         <ResizablePanel defaultSize={75}>
            <div className="flex h-full p-6 relative flex-col">
               <div className="border border-main rounded-t-lg p-3">
                  <p>
                     #{" "}
                     {channels?.find((c: any) => c.id === selectedChannel)
                        ?.name || "general"}{" "}
                  </p>
               </div>

               <div className="flex flex-col gap-2 py-2 overflow-y-auto">
                  {allMessages?.map((msg: any, index: number) => (
                     <div
                        key={msg.id || `rt-${index}`}
                        className={`flex ${
                           msg.user_id === user?.id
                              ? "justify-end"
                              : "justify-start"
                        }`}
                     >
                        <div
                           className={`rounded-lg p-2 ${
                              msg.user_id === user?.id
                                 ? "bg-main text-white"
                                 : "bg-[#F8F9FE]"
                           } w-fit max-w-[70%]`}
                        >
                           <p>{msg.message}</p>
                           <small className="text-xs opacity-70">
                              {msg.timestamp
                                 ? new Date(msg.timestamp).toLocaleString()
                                 : ""}
                           </small>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="absolute bottom-8 w-full flex items-center justify-center gap-8">
                  <span className="text-main cursor-pointer">
                     <Plus />
                  </span>
                  <span className="text-main cursor-pointer">
                     <File />
                  </span>
                  <input
                     className="bg-background w-3/4 p-3 rounded-lg focus:border-main outline-none"
                     placeholder="Type a message..."
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                     }
                  />
               </div>
            </div>
         </ResizablePanel>
      </ResizablePanelGroup>
   );
};

export default ChatArea;
