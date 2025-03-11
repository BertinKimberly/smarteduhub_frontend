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
   MoreVertical,
   Smile,
   Forward,
   Edit,
   Trash2,
} from "lucide-react";
import {
   useGetAllChannels,
   useCreateChannel,
   useGetMessagesByChannel,
   useCreateMessage,
   useUploadFile,
   useAddReaction,
   useAddDMReaction,
   useEditMessage,
   useEditDirectMessage,
   useDeleteMessage,
   useDeleteDirectMessage,
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
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { EmojiPicker } from "./ui/emoji-picker";

// Date separator component
const DateSeparator = ({ date }) => {
   const today = new Date();
   today.setHours(0, 0, 0, 0);

   const yesterday = new Date(today);
   yesterday.setDate(yesterday.getDate() - 1);

   const messageDate = new Date(date);
   messageDate.setHours(0, 0, 0, 0);

   let dateText;

   if (messageDate.getTime() === today.getTime()) {
      dateText = "Today";
   } else if (messageDate.getTime() === yesterday.getTime()) {
      dateText = "Yesterday";
   } else {
      // Format as "Monday, March 11th"
      dateText = messageDate.toLocaleDateString("en-US", {
         weekday: "long",
         month: "long",
         day: "numeric",
      });

      // Add ordinal suffix to day
      const day = messageDate.getDate();
      const suffix = getDaySuffix(day);
      dateText = dateText.replace(day.toString(), day + suffix);
   }

   return (
      <div className="flex items-center justify-center my-4">
         <div className="h-px bg-submain flex-1"></div>
         <span className="px-4 text-xs text-muted-foreground font-medium">
            {dateText}
         </span>
         <div className="h-px bg-submain flex-1"></div>
      </div>
   );
};

// Helper function to get day suffix (st, nd, rd, th)
const getDaySuffix = (day) => {
   if (day > 3 && day < 21) return "th";
   switch (day % 10) {
      case 1:
         return "st";
      case 2:
         return "nd";
      case 3:
         return "rd";
      default:
         return "th";
   }
};

const MessageBubble = ({ message, isOwnMessage, showName = true }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [editedMessage, setEditedMessage] = useState(message.message);
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const { user } = useAuthStore();
   const { mutate: editMessage } = useEditMessage();
   const { mutate: editDM } = useEditDirectMessage();
   const { mutate: deleteMessage } = useDeleteMessage();
   const { mutate: deleteDM } = useDeleteDirectMessage();
   const { mutate: addReaction } = useAddReaction();
   const { mutate: addDMReaction } = useAddDMReaction();

   const handleEdit = () => {
      const editFn = message.channel_id ? editMessage : editDM;
      editFn(
         {
            messageId: message.id,
            message: editedMessage,
            userId: user?.id,
         },
         {
            onSuccess: () => {
               setIsEditing(false);
               toast.success("Message updated successfully");
            },
            onError: () => {
               toast.error("Failed to update message");
            },
         }
      );
   };

   const handleDelete = () => {
      const deleteFn = message.channel_id ? deleteMessage : deleteDM;
      deleteFn(
         {
            messageId: message.id,
            userId: user?.id,
         },
         {
            onSuccess: () => {
               toast.success("Message deleted successfully");
            },
            onError: () => {
               toast.error("Failed to delete message");
            },
         }
      );
   };

   const handleReaction = (emoji: string) => {
      const reactionFn = message.channel_id ? addReaction : addDMReaction;
      reactionFn(
         {
            messageId: message.id,
            emoji,
            userId: user?.id,
         },
         {
            onSuccess: () => {
               setShowEmojiPicker(false);
            },
            onError: () => {
               toast.error("Failed to add reaction");
            },
         }
      );
   };

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
         <div className="flex items-start gap-2">
            <div
               className={`relative rounded-lg px-4 py-2 max-w-[70%] shadow-sm ${
                  isOwnMessage ? "bg-main text-white" : "bg-background"
               }`}
            >
               {isEditing ? (
                  <div className="flex flex-col gap-2">
                     <Input
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        className="min-w-[200px]"
                     />
                     <div className="flex justify-end gap-2">
                        <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => setIsEditing(false)}
                        >
                           Cancel
                        </Button>
                        <Button
                           size="sm"
                           onClick={handleEdit}
                        >
                           Save
                        </Button>
                     </div>
                  </div>
               ) : (
                  <>
                     <p className="break-words">{message.message}</p>
                     {message.file_attachments?.map((file, index) => (
                        <div
                           key={index}
                           className="mt-2"
                        >
                           <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:underline flex items-center gap-2"
                           >
                              <File className="h-4 w-4" />
                              {file.filename}
                           </a>
                        </div>
                     ))}
                     <span className="block mt-1 text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                           hour: "2-digit",
                           minute: "2-digit",
                        })}
                        {message.edited && (
                           <span className="ml-1 text-xs opacity-50">
                              (edited)
                           </span>
                        )}
                     </span>
                  </>
               )}
            </div>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="h-8 w-8"
                  >
                     <MoreVertical className="h-4 w-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEmojiPicker(true)}>
                     <Smile className="h-4 w-4 mr-2" />
                     React
                  </DropdownMenuItem>
                  {isOwnMessage && (
                     <>
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                           <Edit className="h-4 w-4 mr-2" />
                           Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           onClick={handleDelete}
                           className="text-red-500"
                        >
                           <Trash2 className="h-4 w-4 mr-2" />
                           Delete
                        </DropdownMenuItem>
                     </>
                  )}
                  <DropdownMenuItem>
                     <Forward className="h-4 w-4 mr-2" />
                     Forward
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
         {message.reactions?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 ml-2">
               {message.reactions.map((reaction, index) => (
                  <div
                     key={index}
                     className="flex items-center gap-1 bg-background rounded-full px-2 py-1 text-xs"
                  >
                     <span>{reaction.emoji}</span>
                     <span className="text-muted-foreground">
                        {reaction.user.name}
                     </span>
                  </div>
               ))}
            </div>
         )}
         <Dialog
            open={showEmojiPicker}
            onOpenChange={setShowEmojiPicker}
         >
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Add Reaction</DialogTitle>
               </DialogHeader>
               <EmojiPicker onEmojiSelect={handleReaction} />
            </DialogContent>
         </Dialog>
      </div>
   );
};

// Function to group messages by date
const groupMessagesByDate = (messages) => {
   if (!messages || messages.length === 0) return [];

   const groups = [];
   let currentDate = null;
   let currentMessages = [];

   messages.forEach((message) => {
      const messageDate = new Date(message.timestamp || Date.now());
      messageDate.setHours(0, 0, 0, 0);

      if (currentDate === null) {
         currentDate = messageDate;
         currentMessages.push(message);
      } else if (messageDate.getTime() === currentDate.getTime()) {
         currentMessages.push(message);
      } else {
         groups.push({
            date: currentDate,
            messages: currentMessages,
         });
         currentDate = messageDate;
         currentMessages = [message];
      }
   });

   if (currentMessages.length > 0) {
      groups.push({
         date: currentDate,
         messages: currentMessages,
      });
   }

   return groups;
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

   // Group messages by date
   const allMessages = [...(messages || []), ...realTimeMessages];
   const groupedChannelMessages = groupMessagesByDate(allMessages);
   const groupedDirectMessages = groupMessagesByDate(allDirectMessages);

   const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
   const [newChannelName, setNewChannelName] = useState("");

   const handleCreateChannel = () => {
      if (newChannelName.trim()) {
         createChannel({ name: newChannelName.trim() });
         setNewChannelName("");
         setIsCreateChannelOpen(false);
      }
   };

   const handleSendMessage = async () => {
      if (!message.trim() || !user?.id) return;

      if (isDMMode && selectedUser) {
         const messageData = {
            sender_id: user.id,
            recipient_id: selectedUser.id,
            message: message,
            timestamp: new Date().toISOString(),
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
         className="h-[85vh] rounded-lg border border-submain shadow-sm md:min-w-full mt-8"
         style={{ height: "85vh" }} // Enforce fixed height with inline style
      >
         <ResizablePanel
            defaultSize={25}
            maxSize={30}
            minSize={15}
         >
            <div className="flex flex-col h-full border-r border-submain">
               {/* Sidebar Header - Fixed */}
               <div className="p-4 border-b border-submain flex-shrink-0">
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

               {/* Toggle between Channels and DMs - Fixed */}
               <div className="flex border-b border-submain flex-shrink-0">
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

               {/* Content Area - Scrollable */}
               <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                     {isDMMode ? (
                        <div className="space-y-4">
                           {/* Active Conversations */}
                           {conversationsLoading ? (
                              <div className="text-sm text-muted-foreground text-center py-4">
                                 Loading conversations...
                              </div>
                           ) : filteredConversations.length > 0 ? (
                              <div className="mb-6">
                                 <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">
                                       Recent Conversations
                                    </h3>
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={() => setSearchQuery(" ")} // Trigger search mode with a space
                                       className="text-main hover:text-main/80 hover:bg-background"
                                    >
                                       <Plus className="h-4 w-4" />
                                    </Button>
                                 </div>
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
                                    Start New Conversation
                                 </h3>
                                 <div className="space-y-2">
                                    {filteredUsers
                                       ?.filter((u) => u.id !== user?.id)
                                       .map((u: any) => (
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
                                 onClick={() => setIsCreateChannelOpen(true)}
                                 className="text-main hover:text-main/80 hover:bg-background"
                              >
                                 <Plus className="h-4 w-4" />
                              </Button>
                           </div>

                           <div className="space-y-1">
                              {filteredChannels?.map((channel: any) => (
                                 <button
                                    key={channel.id}
                                    onClick={() =>
                                       setSelectedChannel(channel.id)
                                    }
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
            </div>
         </ResizablePanel>

         <ResizableHandle withHandle />

         <ResizablePanel defaultSize={75}>
            <div className="flex flex-col h-full">
               {/* Chat Header - Fixed */}
               <div className="border-b border-submain p-4 bg-background flex-shrink-0">
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

               {/* Messages Area - Scrollable */}
               <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                     <div className="space-y-4">
                        {isDMMode
                           ? groupedDirectMessages.map((group, groupIndex) => (
                                <div key={`group-${groupIndex}`}>
                                   <DateSeparator date={group.date} />
                                   <div className="space-y-4">
                                      {group.messages.map(
                                         (msg: any, index: number) => (
                                            <MessageBubble
                                               key={
                                                  msg.id ||
                                                  `dm-${groupIndex}-${index}`
                                               }
                                               message={msg}
                                               isOwnMessage={
                                                  msg.sender_id === user?.id
                                               }
                                               showName={true}
                                            />
                                         )
                                      )}
                                   </div>
                                </div>
                             ))
                           : groupedChannelMessages.map((group, groupIndex) => (
                                <div key={`group-${groupIndex}`}>
                                   <DateSeparator date={group.date} />
                                   <div className="space-y-4">
                                      {group.messages.map(
                                         (msg: any, index: number) => (
                                            <MessageBubble
                                               key={
                                                  msg.id ||
                                                  `ch-${groupIndex}-${index}`
                                               }
                                               message={msg}
                                               isOwnMessage={
                                                  msg.user_id === user?.id
                                               }
                                               showName={true}
                                            />
                                         )
                                      )}
                                   </div>
                                </div>
                             ))}
                        <div ref={messagesEndRef} />
                     </div>
                  </ScrollArea>
               </div>

               {/* Message Input - Fixed */}
               <div className="border-t border-submain p-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                     <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                              uploadFile.mutate(file, {
                                 onSuccess: (fileData) => {
                                    // Handle the uploaded file
                                    const messageData = {
                                       channel_id: selectedChannel,
                                       message: message,
                                       user_id: user?.id,
                                       timestamp: new Date().toISOString(),
                                       file_attachments: [fileData],
                                    };
                                    sendMessage(messageData);
                                    setMessage("");
                                 },
                                 onError: () => {
                                    toast.error("Failed to upload file");
                                 },
                              });
                           }
                        }}
                     />
                     <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-background hover:text-main"
                        onClick={() =>
                           document.getElementById("file-upload")?.click()
                        }
                     >
                        <Plus className="h-5 w-5" />
                     </Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-background hover:text-main"
                        onClick={() =>
                           document.getElementById("file-upload")?.click()
                        }
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
         <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Create New Channel</DialogTitle>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Input
                        id="channelName"
                        placeholder="Enter channel name"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        className="col-span-4"
                     />
                  </div>
               </div>
               <DialogFooter>
                  <Button onClick={() => setIsCreateChannelOpen(false)} variant="outline">
                     Cancel
                  </Button>
                  <Button onClick={handleCreateChannel}>Create Channel</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </ResizablePanelGroup>
   );
};

export default ChatArea;
