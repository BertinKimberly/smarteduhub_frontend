"use client";
import { useState, useRef, useEffect } from "react";
import { useAILearning } from "@/hooks/useAI"; // Changed this import
import { IoMdClose } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { ChatHistory } from "@/components/ChatHistory";
import { useChatHistory } from "@/hooks/useChatHistory";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { MessageSquare, Sparkles, BookOpen, Lightbulb } from "lucide-react"; // Add these imports
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const ChatBot = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [messages, setMessages] = useState<
      Array<{ role: string; content: string; timestamp?: Date }>
   >([]);
   const [input, setInput] = useState("");
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const aiLearning = useAILearning(); // Changed to useAILearning
   const { createSession } = useChatHistory();

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const handleSend = async () => {
      if (!input.trim()) return;

      const userMessage = {
         role: "user",
         content: input,
         timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");

      try {
         const response = await aiLearning.mutateAsync({
            messages: updatedMessages.map(({ role, content }) => ({
               role,
               content,
            })),
         });

         // Check if response exists and extract the content from it
         // This is the fix for the error - ensuring we handle the response correctly
         const assistantMessage = {
            role: "assistant",
            content:
               typeof response?.response === "string"
                  ? response.response
                  : "I didn't get that. Can you try again?",
            timestamp: new Date(),
         };

         console.log("Mana ntabara", response);

         const newMessages = [...updatedMessages, assistantMessage];
         setMessages(newMessages);

         // Create or update chat session
         await createSession({
            messages: newMessages.map(({ role, content }) => ({
               role,
               content,
            })),
            session_type: "chat",
            title: userMessage.content.slice(0, 50) + "...",
         });
      } catch (error) {
         console.error("Chat error:", error);
         setMessages([
            ...updatedMessages,
            {
               role: "assistant",
               content: "Sorry, I encountered an error. Please try again.",
               timestamp: new Date(),
            },
         ]);
      }
   };

   const WelcomeMessage = () => (
      <div className="h-full flex items-center justify-center px-4">
         <div className="space-y-6 max-w-sm">
            <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
               <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                  <Sparkles className="h-7 w-7 text-blue-600" />
               </div>
               <h3 className="text-lg font-medium text-blue-800 text-center">
                  Welcome to Smart AI Assistant!
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700">
                     <BookOpen className="h-5 w-5 flex-shrink-0" />
                     <p className="text-sm">Get help with your studies</p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                     <MessageSquare className="h-5 w-5 flex-shrink-0" />
                     <p className="text-sm">Ask questions about any topic</p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700">
                     <Lightbulb className="h-5 w-5 flex-shrink-0" />
                     <p className="text-sm">Get instant explanations</p>
                  </div>
               </div>
            </div>
            <div className="text-center text-sm text-gray-500">
               Type your message below to start chatting
            </div>
         </div>
      </div>
   );

   return (
      <div className="fixed bottom-4 right-4 z-50">
         {isOpen ? (
            <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 h-[500px] flex flex-col overflow-hidden">
               <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg flex justify-between items-center">
                  <h3 className="font-semibold">Chat Assistant</h3>
                  <div className="flex gap-2">
                     <ChatHistory
                        onSelectSession={(session) => {
                           setMessages(
                              session.messages.map((msg: any) => ({
                                 ...msg,
                                 timestamp: new Date(),
                              }))
                           );
                        }}
                     />
                     <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-gray-200"
                     >
                        <IoMdClose size={24} />
                     </button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                     <WelcomeMessage />
                  ) : (
                     <div className="space-y-4">
                        {messages.map((message, index) => (
                           <div
                              key={index}
                              className={`flex ${
                                 message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                              }`}
                           >
                              <MessageBubble message={message} />
                           </div>
                        ))}
                     </div>
                  )}
                  <div ref={messagesEndRef} />
               </div>

               <div className="p-4 border-t bg-gray-50">
                  <form
                     onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                     }}
                     className="flex gap-2 relative"
                  >
                     <Textarea
                        placeholder="Ask me anything about your courses..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="min-h-[60px] flex-1 pr-12 rounded-xl border-blue-200 focus:border-blue-400 shadow-sm resize-none"
                     />
                     <Button
                        onClick={handleSend}
                        disabled={!input.trim() || aiLearning.isPending}
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
            </div>
         ) : (
            <button
               onClick={() => setIsOpen(true)}
               className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            >
               <IoChatbubbleEllipses size={24} />
            </button>
         )}
      </div>
   );
};

export default ChatBot;
