import ChatArea from "@/components/ChatArea";
import DashboardNavbar from "@/components/DashboardNavbar";
import React from "react";

const ParentMessages = () => {
   return (
      <div className="p-3">
         <DashboardNavbar title="Chat"/>
         <ChatArea />
      </div>
   );
};

export default ParentMessages;
