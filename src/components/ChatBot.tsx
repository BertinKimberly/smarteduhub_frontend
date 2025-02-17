"use client"
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import { useChatWithAI } from "@/hooks/useAI";
import { IoMdClose } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";

const ChatBot = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [input, setInput] = useState("");
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const chatMutation = useChatWithAI();

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const handleSend = async () => {
      if (!input.trim()) return;

      const userMessage: ChatMessage = {
         role: "user",
         content: input,
         timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
         const response = await chatMutation.mutateAsync({
            messages: [...messages, userMessage].map(({ role, content }) => ({
               role,
               content,
            })),
         });

         const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response.response,
            timestamp: new Date(),
         };

         setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
         console.error("Chat error:", error);
      }
   };

   return (
      <div className="fixed bottom-4 right-4 z-50 ">
         {isOpen ? (
            <div className="bg-white rounded-lg shadow-lg w-80 md:w-96 h-[500px] flex flex-col ">
               <div className="p-4 bg-darkBlue text-main rounded-t-lg flex justify-between items-center">
                  <h3 className="font-semibold">Chat Assistant</h3>
                  <button
                     onClick={() => setIsOpen(false)}
                     className="text-main hover:text-gray-300"
                  >
                     <IoMdClose size={24} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                     <div
                        key={index}
                        className={`flex ${
                           message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                        }`}
                     >
                        <div
                           className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === "user"
                                 ? "bg-main text-white rounded-br-none"
                                 : "bg-gray-100 text-gray-800 rounded-bl-none"
                           }`}
                        >
                           {message.content}
                        </div>
                     </div>
                  ))}
                  <div ref={messagesEndRef} />
               </div>

               <div className="p-4 border-t">
                  <div className="flex space-x-2">
                     <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-darkBlue"
                     />
                     <button
                        onClick={handleSend}
                        disabled={chatMutation.isPending}
                        className="px-4 py-2 bg-darkBlue text-main rounded-lg hover:bg-blue-900 disabled:opacity-50"
                     >
                        Send
                     </button>
                  </div>
               </div>
            </div>
         ) : (
            <button
               onClick={() => setIsOpen(true)}
               className="bg-white text-main p-2 rounded-full hover:bg-blue-900 shadow-lg border border-main"
            >
               <IoChatbubbleEllipses size={24} />
            </button>
         )}
      </div>
   );
};

export default ChatBot;
