"use client";
import React, { useState } from "react";
import { useAILearning } from "@/hooks/useAI";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, Send } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import MessageBubble from "@/components/MessageBubble";
import { ChatHistory } from "@/components/ChatHistory";
import { useChatHistory } from "@/hooks/useChatHistory";

const AIChatPage = () => {
   const [messages, setMessages] = useState<
      Array<{ role: string; content: string }>
   >([]);
   const [currentMessage, setCurrentMessage] = useState("");
   const aiLearning = useAILearning();
   const { createSession } = useChatHistory();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentMessage.trim()) return;

      const newMessage = { role: "user", content: currentMessage };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setCurrentMessage("");

      try {
         const response = await aiLearning.mutateAsync({
            messages: updatedMessages.map(({ role, content }) => ({
               role,
               content,
            })),
         });

         if (response && response.response) {
            const newMessages = [
               ...updatedMessages,
               { role: "assistant", content: response.response },
            ];
            setMessages(newMessages);

            // Create or update chat session
            await createSession({
               messages: newMessages,
               session_type: "general",
               title: newMessages[0].content.slice(0, 50) + "...",
            });
         } else {
            throw new Error("Invalid response format");
         }
      } catch (error) {
         console.error("Error in AI chat:", error);
         setMessages([
            ...updatedMessages,
            {
               role: "assistant",
               content: "Sorry, I encountered an error. Please try again.",
            },
         ]);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
         {/* @ts-ignore */}
         <DashboardNavbar title="Eduh AI" >
            <ChatHistory
               onSelectSession={(session) => {
                  setMessages(session.messages);
               }}
            />
         </DashboardNavbar>

         <div className="flex-1 container mx-auto px-4 py-6">
            <Card className="max-w-4xl mx-auto shadow-lg border-0 overflow-hidden">
               <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                     <MessageSquare className="h-5 w-5" />
                     Chat with AI Learning Assistant
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="h-[600px] flex flex-col">
                     <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4 bg-white">
                        {messages.length === 0 ? (
                           <div className="h-full flex items-center justify-center text-center">
                              <div className="space-y-3 p-6 bg-blue-50 rounded-xl max-w-md">
                                 <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                                    <MessageSquare className="h-8 w-8 text-blue-600" />
                                 </div>
                                 <h3 className="text-lg font-medium text-blue-800">
                                    Start a conversation
                                 </h3>
                                 <p className="text-blue-600">
                                    Ask questions about your courses, get help
                                    with assignments, or explore any topic
                                    you&apos;re curious about!
                                 </p>
                              </div>
                           </div>
                        ) : (
                           <div className="space-y-4">
                              {messages.map((msg, index) => (
                                 <div
                                    key={index}
                                    className={`flex ${
                                       msg.role === "user"
                                          ? "justify-end"
                                          : "justify-start"
                                    }`}
                                 >
                                    <MessageBubble message={msg} />
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                     <form
                        onSubmit={handleSubmit}
                        className="flex gap-2 relative"
                     >
                        <Textarea
                           placeholder="Ask me anything about your courses..."
                           value={currentMessage}
                           onChange={(e) => setCurrentMessage(e.target.value)}
                           className="min-h-[60px] flex-1 pr-12 rounded-xl border-blue-200 focus:border-blue-400 shadow-sm resize-none"
                        />
                        <Button
                           type="submit"
                           disabled={
                              !currentMessage.trim() || aiLearning.isPending
                           }
                           className="absolute right-2 bottom-2 rounded-full w-10 h-10 p-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                           {aiLearning.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                              <Send className="h-4 w-4" />
                           )}
                        </Button>
                     </form>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default AIChatPage;
