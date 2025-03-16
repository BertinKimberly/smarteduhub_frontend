import DashboardNavbar from "@/components/DashboardNavbar";
import React from "react";
import {
   ResizableHandle,
   ResizablePanel,
   ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatArea from "@/components/ChatArea";

const ChatPage = () => {
   return (
      <div className="p-3">
         <DashboardNavbar title="Chats" />
         <div className="">
            <ChatArea />
         </div>
      </div>
   );
};

export default ChatPage;
