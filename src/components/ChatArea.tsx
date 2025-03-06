"use client";

import React, { useState, useEffect, useRef } from "react";
import {
   ResizableHandle,
   ResizablePanel,
   ResizablePanelGroup,
} from "./ui/resizable"; // Fix the import path
import {
   Search,
   PenBox,
   Plus,
   File,
   Send,
   Hash,
   MessageSquare,
   Users,
   Settings,
   Bell,
} from "lucide-react";
import {
   useGetAllChannels,
   useCreateChannel,
   useGetMessagesByChannel,
   useCreateMessage,
} from "@/hooks/useChats";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetchUsers } from "@/hooks/useUsers";
import { useDMWebSocket } from "@/hooks/useWebsocket";
import {
   useGetDMHistory,
   useSendDirectMessage,
   useMarkMessagesAsRead,
   useActiveConversations,
} from "@/hooks/useDirectMessages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessageBubble = ({ message, isOwnMessage, showName = true }) => {
   return (
      <div
         className={`flex flex-col ${
            isOwnMessage ? "items-end" : "items-start"
         }`}
      >
         {showName && !isOwnMessage && (
            <span className="text-xs text-muted-foreground ml-2 mb-1">
               {message.user?.name || "Unknown User"}
            </span>
         )}
         <div
            className={`relative rounded-lg px-4 py-2 max-w-[70%] shadow-sm ${
               isOwnMessage ? "bg-main text-white" : "bg-background"
            }`}
         >
            <p className="break-words">{message.message}</p>
            <span className="block mt-1 text-xs opacity-70">
               {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
               })}
            </span>
         </div>
      </div>
   );
};

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
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [isDMMode, setIsDMMode] = useState(false);
   const { data: users } = useFetchUsers();
   const { data: dmHistory } = useGetDMHistory(
      user?.id || "",
      selectedUser?.id || ""
   );
   const { mutate: sendDM } = useSendDirectMessage();
   const { mutate: markAsRead } = useMarkMessagesAsRead();

   const {
      sendMessage: sendDMWebSocket,
      messages: realtimeDMs,
      isConnected: isDMConnected,
   } = useDMWebSocket(user?.id || null);

   const [searchQuery, setSearchQuery] = useState("");
   const { data: activeConversations, isLoading: conversationsLoading } =
      useActiveConversations(user?.id || "");

   // Filter users and channels based on search
   const filteredUsers = users?.filter(
      (u: any) =>
         u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         u.email.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const filteredChannels = channels?.filter((c: any) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
   );

   // Filter conversations only if they exist
   const filteredConversations = React.useMemo(() => {
      if (!activeConversations) return [];

      return activeConversations.filter(
         (u: any) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
   }, [activeConversations, searchQuery]);

   // Combine DM history with realtime messages
   const allDirectMessages = [...(dmHistory || []), ...realtimeDMs];

   const handleCreateChannel = () => {
      const channelName = prompt("Enter channel name:");
      if (channelName) {
         createChannel({ name: channelName });
      }
   };

   const handleSendMessage = async () => {
      if (!message.trim() || !user?.id) return;

      if (isDMMode && selectedUser) {
         const messageData = {
            sender_id: user.id,
            recipient_id: selectedUser.id,
            message: message,
         };

         try {
            // Send to WebSocket for real-time update
            sendDMWebSocket(messageData);

            // Store in database
            await sendDM(messageData);
            setMessage("");
         } catch (error) {
            console.error("Error sending DM:", error);
         }
      } else if (selectedChannel) {
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

   // Add an effect to scroll to bottom when new messages arrive
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   const allMessages = [...(messages || []), ...realTimeMessages];

   useEffect(() => {
      if (isDMMode) {
         if (allDirectMessages.length > 0) scrollToBottom();
      } else {
         if (allMessages.length > 0) scrollToBottom();
      }
   }, [allDirectMessages, allMessages, isDMMode]);

   useEffect(() => {
      if (selectedChannel) {
         refetchMessages();
      }
   }, [selectedChannel, refetchMessages]);

   return (
      <ResizablePanelGroup
         direction="horizontal"
         className="min-h-[85vh] rounded-lg border border-submain  shadow-sm md:min-w-full mt-8"
      >
         <ResizablePanel
            defaultSize={25}
            maxSize={30}
            minSize={15}
         >
            <div className="flex h-full flex-col border-r border-submain">
               {/* Sidebar Header */}
               <div className="p-4 border-b border-submain">
                  <div className="relative bg-background rounded-lg">
                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                     <Input
                        className="w-full pl-9 border-none bg-background"
                        placeholder="Search chats..."
                        size={32}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                  </div>
               </div>

               {/* Toggle between Channels and DMs */}
               <div className="flex border-b border-submain">
                  <button
                     onClick={() => setIsDMMode(false)}
                     className={`flex-1 p-2 text-sm font-medium ${
                        !isDMMode ? "bg-main text-white" : "hover:bg-background"
                     }`}
                  >
                     Channels
                  </button>
                  <button
                     onClick={() => setIsDMMode(true)}
                     className={`flex-1 p-2 text-sm font-medium ${
                        isDMMode ? "bg-main text-white" : "hover:bg-background"
                     }`}
                  >
                     Direct Messages
                  </button>
               </div>

               {/* Content Area */}
               <ScrollArea className="flex-1 p-4">
                  {isDMMode ? (
                     <div className="space-y-4">
                        {/* Active Conversations */}
                        {conversationsLoading ? (
                           <div className="text-sm text-muted-foreground text-center py-4">
                              Loading conversations...
                           </div>
                        ) : filteredConversations.length > 0 ? (
                           <div className="mb-6">
                              <h3 className="text-sm font-medium mb-2">
                                 Recent Conversations
                              </h3>
                              <div className="space-y-2">
                                 {filteredConversations.map((u: any) => (
                                    <button
                                       key={u.id}
                                       onClick={() => setSelectedUser(u)}
                                       className={`w-full flex items-center gap-3 rounded-lg p-2 transition-colors ${
                                          selectedUser?.id === u.id
                                             ? "bg-background text-main"
                                             : "hover:bg-background"
                                       }`}
                                    >
                                       <Avatar className="h-8 w-8">
                                          <AvatarImage src={u.avatar} />
                                          <AvatarFallback>
                                             {u.name[0]}
                                          </AvatarFallback>
                                       </Avatar>
                                       <div className="text-left">
                                          <div className="text-sm font-medium">
                                             {u.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                             {u.email}
                                          </div>
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </div>
                        ) : (
                           <div className="text-sm text-muted-foreground text-center py-4">
                              No conversations yet
                           </div>
                        )}

                        {/* Search Results */}
                        {searchQuery && (
                           <div>
                              <h3 className="text-sm font-medium mb-2">
                                 Search Results
                              </h3>
                              <div className="space-y-2">
                                 {filteredUsers?.map((u: any) => (
                                    <button
                                       key={u.id}
                                       onClick={() => setSelectedUser(u)}
                                       className={`w-full flex items-center gap-3 rounded-lg p-2 transition-colors ${
                                          selectedUser?.id === u.id
                                             ? "bg-background text-main"
                                             : "hover:bg-background"
                                       }`}
                                    >
                                       <Avatar className="h-8 w-8">
                                          <AvatarImage src={u.avatar} />
                                          <AvatarFallback>
                                             {u.name[0]}
                                          </AvatarFallback>
                                       </Avatar>
                                       <div className="text-left">
                                          <div className="text-sm font-medium">
                                             {u.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                             {u.email}
                                          </div>
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  ) : (
                     // Channels List
                     <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                              <Hash className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                 Channels
                              </span>
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCreateChannel}
                              className="text-main hover:text-main/80 hover:bg-background"
                           >
                              <Plus className="h-4 w-4" />
                           </Button>
                        </div>

                        <div className="space-y-1">
                           {filteredChannels?.map((channel: any) => (
                              <button
                                 key={channel.id}
                                 onClick={() => setSelectedChannel(channel.id)}
                                 className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors
                        ${
                           selectedChannel === channel.id
                              ? "bg-background text-main"
                              : "hover:bg-background hover:text-main"
                        }`}
                              >
                                 <Hash className="h-4 w-4" />
                                 <span>{channel.name}</span>
                                 {channel.unreadCount > 0 && (
                                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-main text-xs text-white">
                                       {channel.unreadCount}
                                    </span>
                                 )}
                              </button>
                           ))}
                        </div>
                     </div>
                  )}
               </ScrollArea>
            </div>
         </ResizablePanel>

         <ResizableHandle withHandle />

         <ResizablePanel defaultSize={75}>
            <div className="flex h-full flex-col">
               {/* Chat Header */}
               <div className="border-b border-submain p-4 bg-background">
                  <div className="flex items-center gap-2">
                     {isDMMode ? (
                        selectedUser && (
                           <>
                              <Avatar className="h-8 w-8">
                                 <AvatarImage src={selectedUser.avatar} />
                                 <AvatarFallback>
                                    {selectedUser.name[0]}
                                 </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                 {selectedUser.name}
                              </span>
                           </>
                        )
                     ) : (
                        <>
                           <Hash className="h-5 w-5" />
                           <span className="font-medium">
                              {channels?.find(
                                 (c: any) => c.id === selectedChannel
                              )?.name || "general"}
                           </span>
                        </>
                     )}
                  </div>
               </div>

               {/* Messages Area */}
               <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                     {isDMMode
                        ? allDirectMessages?.map((msg: any, index: number) => (
                             <MessageBubble
                                key={msg.id || `rt-${index}`}
                                message={msg}
                                isOwnMessage={msg.sender_id === user?.id}
                                showName={true}
                             />
                          ))
                        : allMessages?.map((msg: any, index: number) => (
                             <MessageBubble
                                key={msg.id || `rt-${index}`}
                                message={msg}
                                isOwnMessage={msg.user_id === user?.id}
                                showName={true}
                             />
                          ))}
                     <div ref={messagesEndRef} />
                  </div>
               </ScrollArea>

               {/* Message Input */}
               <div className="border-t border-submain p-4">
                  <div className="flex items-center gap-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-background hover:text-main"
                     >
                        <Plus className="h-5 w-5" />
                     </Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-background hover:text-main"
                     >
                        <File className="h-5 w-5" />
                     </Button>
                     <div className="relative flex-1">
                        <Input
                           className="pr-12 focus:border-main"
                           placeholder="Type a message..."
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           onKeyPress={(e) =>
                              e.key === "Enter" && handleSendMessage()
                           }
                        />
                        <Button
                           size="icon"
                           variant="ghost"
                           className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-background hover:text-main"
                           onClick={handleSendMessage}
                        >
                           <Send className="h-5 w-5" />
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </ResizablePanel>
      </ResizablePanelGroup>
   );
};

export default ChatArea;
