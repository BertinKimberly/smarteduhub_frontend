import ChatArea from "@/components/ChatArea";
import DashboardNavbar from "@/components/DashboardNavbar";
import React from "react";

const StudentChat = () => {
   return (
      <div>
         <DashboardNavbar title="Chat" />
         <div className="">
            <ChatArea />
         </div>
      </div>
   );
};

export default StudentChat;
