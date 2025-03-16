"use client";
import React, { useState } from "react";
import { useAILearning } from "@/hooks/useAI";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";

const AIChatPage = () => {
   const [messages, setMessages] = useState<
      Array<{ role: string; content: string }>
   >([]);
   const [currentMessage, setCurrentMessage] = useState("");
   const aiLearning = useAILearning();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentMessage.trim()) return;

      const newMessage = { role: "user", content: currentMessage };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setCurrentMessage("");

      try {
         const response = await aiLearning.mutateAsync({
            messages: updatedMessages,
         });

         setMessages([
            ...updatedMessages,
            { role: "assistant", content: response.response },
         ]);
      } catch (error) {
         console.error("Error in AI chat:", error);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
         <DashboardNavbar title="AI Learning Assistant" />

         <div className="flex-1 container mx-auto px-4 py-6">
            <Card className="max-w-4xl mx-auto">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <MessageSquare className="h-5 w-5" />
                     Chat with AI Learning Assistant
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="h-[600px] flex flex-col">
                     <div className="flex-1 overflow-y-auto mb-4 border rounded-md p-4">
                        {messages.length === 0 ? (
                           <div className="h-full flex items-center justify-center text-center">
                              <div className="space-y-2">
                                 <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground" />
                                 <p className="text-muted-foreground">
                                    Start a conversation with your AI learning
                                    assistant. Ask questions about your courses
                                    or any topic!
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
                                    <div
                                       className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                          msg.role === "user"
                                             ? "bg-primary text-primary-foreground"
                                             : "bg-muted"
                                       }`}
                                    >
                                       <div className="whitespace-pre-line">
                                          {msg.content}
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                     <form
                        onSubmit={handleSubmit}
                        className="flex gap-2"
                     >
                        <Textarea
                           placeholder="Ask me anything about your courses..."
                           value={currentMessage}
                           onChange={(e) => setCurrentMessage(e.target.value)}
                           className="min-h-[60px] flex-1"
                        />
                        <Button
                           type="submit"
                           disabled={
                              !currentMessage.trim() || aiLearning.isPending
                           }
                        >
                           {aiLearning.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                              "Send"
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
