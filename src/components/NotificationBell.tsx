// NotificationBell.tsx
"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onClick,
}) => {
  return (
    <Button
      id="notifications-trigger"
      variant="ghost"
      size="sm"
      className="relative"
      onClick={onClick}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Button>
  );
};

export default NotificationBell;